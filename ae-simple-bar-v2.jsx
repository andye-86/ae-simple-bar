// Simple Bar v2 //
//
// Same UI/UX and visual result as ae-simple-bar.jsx, rebuilt internals.
//
// What changed and why (see project notes from the v1 debugging session):
//   - Every layer's final position is computed and set ONCE, explicitly,
//     in real comp coordinates. v1 relied on AE's "parenting preserves
//     on-screen position" behavior, chained through several intermediate
//     helper layers (a temp null, a second axis line) - every bug found
//     in v1 (baseline offset, axis-line offset, %-text pairing, bar
//     group X-skew) traced back to that same chain silently going wrong
//     partway through. There is no equivalent chain here: nothing is
//     temporarily parented anywhere for positioning purposes.
//   - horBarGraph/vertBarGraph were ~400 lines each, mostly duplicated.
//     Here there is one buildBarGraph(), parameterized by isVertical,
//     built on a small along/cross coordinate abstraction (see
//     computeLayout() and mapPoint()) so the two orientations can't drift
//     out of sync with each other the way v1's two copies did.
//   - Bar group centering and margins are computed directly from a
//     target span fraction of the frame, not a hand-tuned per-bar-count
//     magic constant (v1's curItem.width*.0712*(7-totalBars), which
//     didn't actually center the group - see the v1 fix commit).
//   - Layers are referenced by variable, never by recomputed stack index
//     (v1's curItem.layer((x*3)+2) style arithmetic).
//
// UI is ported from v1 essentially as-is (it was already solid, tested,
// and the user was happy with it) - only the final "build the graph"
// call target changed, from horBarGraph/vertBarGraph to one buildBarGraph.


////// LAYER KIT ///////
// Low-level AE layer builders. Each one sets its own anchor/position (or
// takes explicit final coordinates), so nothing about a layer's placement
// is left for a caller to reverse-engineer later.

//Random RGB color (0-1 per channel).
function randomColor() {
    return [Math.random(), Math.random(), Math.random()];
}

//Creates a rectangle shape layer sized [width,height] in its own local
//space ([0,0] to [width,height]). `anchor` is a point in that same local
//space - whatever point you pick becomes the layer's placement handle,
//since .position is set to `atPosition` directly and nothing here (or
//afterward) needs to compute a compensating offset.
//`fillColorExpr` is an optional expression string for the fill color;
//`fillColorArr` is a plain [r,g,b] (0-1) used when there's no expression.
//Defaults to white if neither is given.
function createRect(curItem, name, width, height, anchor, atPosition, fillColorExpr, fillColorArr) {
    var shapeLayer = curItem.layers.addShape();
    shapeLayer.name = name;

    var group = shapeLayer.property("Contents").addProperty("ADBE Vector Group");
    group.name = "Rect Group";

    var rect = group.property("Contents").addProperty("ADBE Vector Shape - Rect");
    rect.name = "Rect Path";
    rect.property("Size").setValue([width, height]);
    rect.property("Position").setValue([width / 2, height / 2]);

    var fill = group.property("Contents").addProperty("ADBE Vector Graphic - Fill");
    if (fillColorExpr) {
        fill.property("Color").expression = fillColorExpr;
    } else {
        fill.property("Color").setValue(fillColorArr || [1, 1, 1]);
    }

    //addShape() layers can come up 3D (a v1 gotcha - reading
    //anchorPoint/scale on one throws "invalid numeric result"); force 2D.
    shapeLayer.threeDLayer = false;
    shapeLayer.anchorPoint.setValue(anchor);
    shapeLayer.position.setValue(atPosition);
    return shapeLayer;
}

//Creates a straight stroked line from (x1,y1) to (x2,y2) in comp space.
//Fully self-contained - both endpoints are known up front, so position is
//set right here (unlike v1's line helper, which needed a caller to figure
//out a follow-up position after the fact).
function createLine(curItem, name, x1, y1, x2, y2, strokeWidth, colorArr) {
    var shapeLayer = curItem.layers.addShape();
    shapeLayer.name = name;

    var group = shapeLayer.property("Contents").addProperty("ADBE Vector Group");
    group.name = "Line Group";

    var pathGroup = group.property("Contents").addProperty("ADBE Vector Shape - Group");
    var lineShape = new Shape();
    lineShape.vertices = [[0, 0], [x2 - x1, y2 - y1]];
    lineShape.inTangents = [[0, 0], [0, 0]];
    lineShape.outTangents = [[0, 0], [0, 0]];
    lineShape.closed = false;
    pathGroup.property("ADBE Vector Shape").setValue(lineShape);

    var stroke = group.property("Contents").addProperty("ADBE Vector Graphic - Stroke");
    stroke.property("Color").setValue(colorArr || [1, 1, 1]);
    stroke.property("Stroke Width").setValue(strokeWidth);
    stroke.property("Line Cap").setValue(2);

    shapeLayer.threeDLayer = false;
    shapeLayer.anchorPoint.setValue([0, 0]);
    shapeLayer.position.setValue([x1, y1]);
    return shapeLayer;
}

//Creates a point-text layer, fully styled and positioned in one call.
function createText(curItem, initialText, fontSize, justification, atPosition) {
    curItem.layers.addText(initialText);
    var layer = curItem.layer(1);
    var docProp = layer.property("ADBE Text Properties").property("ADBE Text Document");
    var doc = docProp.value;
    doc.resetCharStyle();
    doc.resetParagraphStyle();
    doc.fillColor = [1, 1, 1];
    doc.font = "Arial-BoldMT";
    doc.fontSize = fontSize;
    doc.justification = justification;
    docProp.setValue(doc);
    layer.threeDLayer = false;
    layer.anchorPoint.setValue([0, 0]);
    layer.position.setValue(atPosition);
    return layer;
}

//Builds a position expression that keeps `thisLayer` sitting beside
//`targetName`'s layer: same top edge, offset to the right by `gap`.
//Generalizes the %-beside-Value pairing worked out (and field-verified)
//during the v1 fix.
function pairBesideExpression(targetName, gap) {
    return 'var t = thisComp.layer("' + targetName + '"); ' +
        'var tSize = t.sourceRectAtTime(); ' +
        'var mySize = thisLayer.sourceRectAtTime(); ' +
        'var gap = ' + gap + '; ' +
        'var x = t.transform.position[0]+(tSize.width/2)+(mySize.width/2)+gap; ' +
        'var y = t.transform.position[1]-tSize.height+mySize.height; ' +
        '[x,y]';
}


////// LAYOUT MATH ///////
// Pure arithmetic, no AE calls - every number the graph needs, computed
// once and reasoned about independently of AE's scripting quirks. This is
// the piece that should get sanity-checked with plain node/python before
// trusting it, the way groupShift was validated in the v1 fix.

//along/cross -> screen [x,y]. "along" is the axis bars grow on (Y for a
//horizontal graph, X for a vertical one); "cross" is the axis bars are
//spread out across. Every geometry computation below is written in
//along/cross terms and only converted to screen space at the point where
//an AE call actually needs [x,y] - this is what lets one function build
//both orientations instead of two near-duplicate ones.
function mapPoint(along, cross, isVertical) {
    return isVertical ? [along, cross] : [cross, along];
}

function computeLayout(compWidth, compHeight, totalBars, isVertical) {
    var crossSize = isVertical ? compHeight : compWidth;
    var growthSize = isVertical ? compWidth : compHeight;

    //Bars occupy the middle 80% of the cross axis, evenly spaced -
    //self-scaling with bar count instead of v1's hand-tuned per-count
    //shrink tiers (80/70/60/53%), which is what let the group-centering
    //bug happen in the first place.
    var marginFraction = 0.1;
    var barStep = (crossSize * (1 - 2 * marginFraction)) / totalBars;
    var barThickness = barStep * 0.55;
    var firstBarCross = crossSize * marginFraction + barStep / 2;

    //Baseline sits near the "far" edge of the growth axis (bottom for a
    //horizontal graph, left for a vertical one); bars grow toward the
    //opposite edge. growthSign encodes which direction is "toward growth".
    var baselineMarginFraction = 0.08;
    var baselineAlong = isVertical ? growthSize * baselineMarginFraction : growthSize * (1 - baselineMarginFraction);
    var growthSign = isVertical ? 1 : -1;
    var maxGrowthLength = growthSize * (1 - 2 * baselineMarginFraction);

    return {
        crossSize: crossSize,
        growthSize: growthSize,
        barStep: barStep,
        barThickness: barThickness,
        firstBarCross: firstBarCross,
        baselineAlong: baselineAlong,
        growthSign: growthSign,
        maxGrowthLength: maxGrowthLength,
        axisThickness: barThickness * 0.3,
        valueFontSize: compHeight * .0678,   //(v1's detVar*.11296*0.6, detVar==compHeight)
        percentFontSize: compHeight * .0324, //(v1's detVar*.0540*0.6)
        labelFontSize: compHeight * .03996,
        barGap: compHeight * .01
    };
}

function crossCoordForBar(layout, barIndex) {
    // barIndex is 1-based
    return layout.firstBarCross + (barIndex - 1) * layout.barStep;
}


////// MASTER CONTROL (per-bar animated value + color) ///////

function buildMasterControl(curItem, totalBars, minVal, values) {
    curItem.layers.addNull();
    var mc = curItem.layer(1);
    mc.name = "MASTER CONTROL";
    mc.threeDLayer = false;

    for (var i = 1; i <= totalBars; i++) {
        mc.Effects.addProperty("Slider Control");
        var sliderProp = mc.property("Effects").property("Slider Control").property("Slider");
        sliderProp.setValueAtTime(.8 + ((i - 1) / 2), minVal);
        sliderProp.setValueAtTime(2.5 + ((i - 1) / 2), values[i - 1]);
        sliderProp.setTemporalEaseAtKey(2, [new KeyframeEase(0.8, 100)]);
        mc.property("Effects").property("Slider Control").name = "Value " + i;

        mc.Effects.addProperty("Color Control");
        mc.property("Effects").property("Color Control").property("Color").setValue(randomColor());
        mc.property("Effects").property("Color Control").name = "Color " + i;
    }
    return mc;
}


////// ONE BAR (shape + value text + % text + category label) ///////

function buildBar(curItem, layout, opts, barIndex) {
    var isVertical = opts.isVertical;
    var alongIdx = isVertical ? 0 : 1; //which element of a screen [x,y]/[sx,sy] pair is "along"

    var cross = crossCoordForBar(layout, barIndex);
    var barName = "Bar " + barIndex;

    //--- Bar shape --------------------------------------------------
    var width = isVertical ? layout.maxGrowthLength : layout.barThickness;
    var height = isVertical ? layout.barThickness : layout.maxGrowthLength;
    var anchor = isVertical ? [0, height / 2] : [width / 2, height]; //grows away from this edge
    var atPosition = mapPoint(layout.baselineAlong, cross, isVertical);

    var fillExpr = 'thisComp.layer("MASTER CONTROL").effect("Color ' + barIndex + '")("Color")';
    var barLayer = createRect(curItem, barName, width, height, anchor, atPosition, fillExpr);

    var scaleExpr = 'var s = thisComp.layer("MASTER CONTROL").effect("Value ' + barIndex + '")("Slider"); ' +
        'var temp = ((s - ' + opts.minVal + ') * 100) / (' + opts.maxVal + ' - ' + opts.minVal + '); ' +
        (isVertical ? '[temp,100]' : '[100,temp]');
    barLayer.scale.expression = scaleExpr;

    //--- Value text (tracks the bar's live scale%) -------------------
    var valuePos = mapPoint(layout.baselineAlong, cross, isVertical); //placeholder, overridden by expression below
    var valueLayer = createText(curItem, "0", layout.valueFontSize, ParagraphJustification.CENTER_JUSTIFY, valuePos);
    valueLayer.name = "Value " + barIndex;
    valueLayer.property("Source Text").expression =
        'thisComp.layer("MASTER CONTROL").effect("Value ' + barIndex + '")("Slider").value.toFixed(0)';

    var tipExpr = 'var bar = thisComp.layer("' + barName + '"); ' +
        'var percent = bar.transform.scale[' + alongIdx + '] / 100; ' +
        'var tipAlong = ' + layout.baselineAlong + ' + ' + layout.growthSign + '*(' + layout.maxGrowthLength + '*percent + ' + layout.barGap + '); ' +
        (isVertical ? ('[tipAlong,' + cross + ']') : ('[' + cross + ',tipAlong]'));
    valueLayer.position.expression = tipExpr;

    var opacityExpr = 't1=' + (.8 + ((barIndex - 1) / 2)) + '; t2=' + (1.5 + ((barIndex - 1) / 2)) +
        '; linear(time,t1,t2,0,100)';
    valueLayer.opacity.expression = opacityExpr;

    var resultLayers = { bar: barLayer, value: valueLayer, percent: null, label: null };

    //--- % text (paired beside Value text) ---------------------------
    if (opts.perCheck) {
        var percentLayer = createText(curItem, "%", layout.percentFontSize, ParagraphJustification.CENTER_JUSTIFY, valuePos);
        percentLayer.name = "Percent " + barIndex;
        percentLayer.position.expression = pairBesideExpression("Value " + barIndex, layout.barGap);
        percentLayer.opacity.expression = opacityExpr;
        resultLayers.percent = percentLayer;
    }

    //--- Category label (bar's own name, on the far side of the baseline) ---
    if (opts.axisCheck && opts.labels && opts.labels[barIndex - 1] !== undefined) {
        var labelAlong = layout.baselineAlong - layout.growthSign * (layout.labelFontSize * 1.4);
        var labelPos = mapPoint(labelAlong, cross, isVertical);
        var labelLayer = createText(curItem, opts.labels[barIndex - 1], layout.labelFontSize, ParagraphJustification.CENTER_JUSTIFY, labelPos);
        labelLayer.name = "Label " + barIndex;
        resultLayers.label = labelLayer;
    }

    return resultLayers;
}


////// FULL GRAPH ///////

function buildBarGraph(curItem, opts) {
    // opts: {isVertical, totalBars, minVal, maxVal, barCheck, perCheck,
    //        axisCheck, values, labels}
    var scriptName = opts.isVertical ? "Vertical Bar Graph" : "Horizontal Bar Graph";
    app.beginUndoGroup(scriptName);

    var layout = computeLayout(curItem.width, curItem.height, opts.totalBars, opts.isVertical);
    var isVertical = opts.isVertical;

    var mc = buildMasterControl(curItem, opts.totalBars, opts.minVal, opts.values);

    //Baseline: the "zero" reference line, perpendicular to growth, spanning
    //the bar group's cross extent.
    var crossStart = layout.crossSize * 0.1 - layout.barStep / 2;
    var crossEnd = layout.crossSize * 0.9 + layout.barStep / 2;
    var baselineStart = mapPoint(layout.baselineAlong, crossStart, isVertical);
    var baselineEnd = mapPoint(layout.baselineAlong, crossEnd, isVertical);
    var baselineLayer = createLine(curItem, "Baseline", baselineStart[0], baselineStart[1], baselineEnd[0], baselineEnd[1], layout.axisThickness, [1, 1, 1]);

    //Scale axis: parallel to growth, marking the min-to-max span, sitting
    //just before the first bar.
    var axisCross = crossStart;
    var axisStart = mapPoint(layout.baselineAlong, axisCross, isVertical);
    var axisEndAlong = layout.baselineAlong + layout.growthSign * layout.maxGrowthLength;
    var axisEnd = mapPoint(axisEndAlong, axisCross, isVertical);
    var scaleAxisLayer = createLine(curItem, "Scale Axis", axisStart[0], axisStart[1], axisEnd[0], axisEnd[1], layout.axisThickness, [1, 1, 1]);

    //Back Plate: soft background band behind the bars.
    var plateWidth = isVertical ? layout.maxGrowthLength : (crossEnd - crossStart);
    var plateHeight = isVertical ? (crossEnd - crossStart) : layout.maxGrowthLength;
    var plateAnchor = isVertical ? [0, plateHeight / 2] : [plateWidth / 2, plateHeight];
    var platePos = mapPoint(layout.baselineAlong, (crossStart + crossEnd) / 2, isVertical);
    var backPlate = createRect(curItem, "Back Plate", plateWidth, plateHeight, plateAnchor, platePos, null, [0, 0, 0]);
    backPlate.opacity.setValue(15);

    //Min/Max scale labels, at the two ends of the scale axis.
    if (opts.axisCheck) {
        var minLabelPos = mapPoint(layout.baselineAlong, axisCross, isVertical);
        var minLabel = createText(curItem, String(opts.minVal), layout.labelFontSize, isVertical ? ParagraphJustification.CENTER_JUSTIFY : ParagraphJustification.RIGHT_JUSTIFY, minLabelPos);
        minLabel.name = "Min Label";

        var maxLabelPos = mapPoint(axisEndAlong, axisCross, isVertical);
        var maxLabel = createText(curItem, String(opts.maxVal), layout.labelFontSize, isVertical ? ParagraphJustification.CENTER_JUSTIFY : ParagraphJustification.RIGHT_JUSTIFY, maxLabelPos);
        maxLabel.name = "Max Label";
    }

    //Bars.
    var allBarLayers = [];
    for (var i = 1; i <= opts.totalBars; i++) {
        allBarLayers.push(buildBar(curItem, layout, opts, i));
    }

    //Group everything under a null with an identity transform (position
    //[0,0], anchor [0,0], scale 100%, no rotation) purely for organization
    //- an identity-transform parent can never distort a child's position,
    //no matter when the parenting happens, so this carries none of the
    //risk the v1 parenting chain had.
    curItem.layers.addNull();
    var graphGroup = curItem.layer(1);
    graphGroup.name = "Graph Group";
    graphGroup.threeDLayer = false;
    //addNull() defaults to comp-center, NOT [0,0] - without forcing both
    //of these to zero, this would be exactly the kind of non-identity
    //parent transform that silently shifted children in v1.
    graphGroup.anchorPoint.setValue([0, 0]);
    graphGroup.position.setValue([0, 0]);
    mc.parent = graphGroup;
    baselineLayer.parent = graphGroup;
    scaleAxisLayer.parent = graphGroup;
    backPlate.parent = graphGroup;
    if (opts.axisCheck) {
        minLabel.parent = graphGroup;
        maxLabel.parent = graphGroup;
    }
    for (var j = 0; j < allBarLayers.length; j++) {
        allBarLayers[j].bar.parent = graphGroup;
        allBarLayers[j].value.parent = graphGroup;
        if (allBarLayers[j].percent) allBarLayers[j].percent.parent = graphGroup;
        if (allBarLayers[j].label) allBarLayers[j].label.parent = graphGroup;
    }

    //Precompose the whole group.
    var precomposeArray = [];
    for (var k = 1; k <= curItem.numLayers; k++) {
        if (curItem.layer(k).parent === graphGroup || curItem.layer(k) === graphGroup) {
            precomposeArray.push(curItem.layer(k).index);
        }
    }
    curItem.layers.precompose(precomposeArray, scriptName, true);

    //Move to roughly where the reveal animation finishes.
    curItem.time = (2.5 + ((opts.totalBars - 1) / 2)) + 1;

    app.endUndoGroup();
}


////// UI ///////
// Ported from ae-simple-bar.jsx - same layout, same options, same
// two-stage dialog flow. Only the final call target changed.

function linkSliderAndEdit(slider, edit) {
    slider.onChanging = function () {
        edit.text = Math.round(slider.value);
    };
    edit.onChanging = function () {
        var val = Math.round(Number(edit.text));
        if (isNaN(val)) {
            val = slider.value;
        }
        val = Math.min(slider.maxvalue, Math.max(slider.minvalue, val));
        edit.text = val;
        slider.value = val;
    };
}

// SIMPLEBAR
var simpleBar = new Window("dialog");
simpleBar.text = "Simple Bar v2";
simpleBar.orientation = "column";
simpleBar.alignChildren = ["center", "top"];
simpleBar.spacing = 10;
simpleBar.margins = 16;

var panel2 = simpleBar.add("panel", undefined, undefined, {name: "panel2"});
panel2.preferredSize.width = 280;
panel2.orientation = "column";
panel2.alignChildren = ["left", "top"];
panel2.spacing = 10;
panel2.margins = 10;

var group1 = panel2.add("group", undefined, {name: "group1"});
group1.orientation = "row";
group1.alignChildren = ["left", "center"];
group1.spacing = 10;

var statictext1 = group1.add("statictext", undefined, "Number of Bars:");
var dropdown1_array = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
var dropdown1 = group1.add("dropdownlist", undefined, undefined, {name: "dropdown1", items: dropdown1_array});
dropdown1.selection = 0;
dropdown1.preferredSize.width = 106;

var panel3 = simpleBar.add("panel", undefined, undefined, {name: "panel3"});
panel3.text = "Define your Min and Max for the Scale";
panel3.preferredSize.width = 280;
panel3.orientation = "row";
panel3.alignChildren = ["center", "center"];
panel3.spacing = 14;
panel3.margins = 18;

var minText = panel3.add("statictext", undefined, "Min");
var minField = panel3.add("edittext", undefined, "0");
minField.characters = 5;
var maxText = panel3.add("statictext", undefined, "Max");
var maxField = panel3.add("edittext", undefined, "100");
maxField.characters = 5;

var panel4 = simpleBar.add("panel", undefined, undefined, {name: "panel4"});
panel4.text = "Visual Settings";
panel4.preferredSize.width = 280;
panel4.orientation = "row";
panel4.alignChildren = ["left", "fill"];
panel4.spacing = 14;
panel4.margins = 14;

var group1b = panel4.add("group", undefined, {name: "group1b"});
group1b.orientation = "column";
group1b.alignChildren = ["left", "top"];
group1b.spacing = 10;

var horizontalRadioButton = group1b.add("radiobutton", undefined, "Bars on X-Axis");
var verticalRadioButton = group1b.add("radiobutton", undefined, "Bars on Y-Axis");
horizontalRadioButton.value = true;

var visualDivider = panel4.add("panel", undefined, undefined, {name: "visualDivider"});
visualDivider.alignment = ["center", "fill"];
visualDivider.preferredSize.width = 2;

var group2 = panel4.add("group", undefined, {name: "group2"});
group2.orientation = "column";
group2.alignChildren = ["left", "center"];
group2.spacing = 10;

var barCheckbox = group2.add("checkbox", undefined, "Bar Value Labels");
var perCheckbox = group2.add("checkbox", undefined, "% Labels");
var axisCheckbox = group2.add("checkbox", undefined, "Axis Labels");

perCheckbox.enabled = false;
barCheckbox.onClick = function () {
    perCheckbox.enabled = barCheckbox.value;
    if (!barCheckbox.value) {
        perCheckbox.value = false;
    }
};

var group3 = simpleBar.add("group", undefined, {name: "group3"});
group3.orientation = "row";
group3.alignChildren = ["left", "center"];
group3.spacing = 10;
group3.margins = [0, 10, 0, 0];

var button1 = group3.add("button", undefined, "Let's Go!");
var button2 = group3.add("button", undefined, "Cancel");
var button3 = group3.add("button", undefined, "?");
button3.preferredSize.width = 30;

button1.onClick = function () {
    if (!(app.project.activeItem instanceof CompItem)) {
        alert("Please select a comp as the active item and try again.");
        return;
    }

    var isVertical = verticalRadioButton.value;
    var totalBars = dropdown1.selection.index + 1;
    var minVal = Number(minField.text);
    var maxVal = Number(maxField.text);
    var barCheck = barCheckbox.value;
    var perCheck = perCheckbox.value;
    var axisCheck = axisCheckbox.value;

    secondUI(isVertical, totalBars, minVal, maxVal, barCheck, perCheck, axisCheck);
    simpleBar.close();
};

button2.onClick = function () {
    simpleBar.close();
};

button3.onClick = function () {
    var g = new Window("dialog", "Simple Bar Help", undefined, {resizable: false});
    var globalPanel = g.add("group");
    globalPanel.orientation = "column";
    var helpPanel = globalPanel.add("panel");
    helpPanel.size = [380, 380];
    helpPanel.alignChildren = "left";

    var help1 = helpPanel.add("statictext", undefined, "Bars on X-Axis or Y-Axis", {multiline: true});
    help1.graphics.font = ScriptUI.newFont("dialog", "Bold", 12);
    var help2 = helpPanel.add("statictext", undefined, "You have the option to run the bars across the X-Axis or down the side of the Y-Axis. All features work either way.", {multiline: true});
    help2.preferredSize = [340, 50];

    var divider1 = helpPanel.add("panel");
    divider1.size = [340, 2];

    var help3 = helpPanel.add("statictext", undefined, "Bar Value Labels / % Labels:", {multiline: true});
    help3.graphics.font = ScriptUI.newFont("dialog", "Bold", 12);
    var help4 = helpPanel.add("statictext", undefined, "Selecting Bar Value Labels places the numeric value on top of each bar. % Labels additionally converts that value to a percentage of the min/max scale.", {multiline: true});
    help4.preferredSize = [340, 50];

    var help5 = helpPanel.add("statictext", undefined, "Axis Labels:", {multiline: true});
    help5.graphics.font = ScriptUI.newFont("dialog", "Bold", 12);
    var help6 = helpPanel.add("statictext", undefined, "Selecting this option lets you name each bar and adds min/max labels to the scale. You'll enter the names on the next screen.", {multiline: true});
    help6.preferredSize = [340, 50];

    var help7 = globalPanel.add("statictext", undefined, "Simple Bar v2");

    var closeButton = g.add("button", undefined, "Close");
    closeButton.onClick = function () {
        g.close();
    };

    g.show();
};

simpleBar.show();


// SIMPLEBAR_STEP2
function secondUI(isVertical, totalBars, minVal, maxVal, barCheck, perCheck, axisCheck) {

    var SimpleBar_Step2 = new Window("dialog");
    SimpleBar_Step2.text = "Bar Graph Data";
    SimpleBar_Step2.orientation = "column";
    SimpleBar_Step2.alignChildren = ["center", "top"];
    SimpleBar_Step2.spacing = 10;
    SimpleBar_Step2.margins = 16;

    var group1 = SimpleBar_Step2.add("group", undefined, {name: "group1"});
    group1.orientation = "row";
    group1.alignChildren = ["left", "top"];
    group1.spacing = 10;
    group1.margins = 0;

    var group2 = group1.add("group", undefined, {name: "group2"});
    group2.orientation = "column";
    group2.alignChildren = ["left", "top"];
    group2.spacing = 14;
    group2.margins = 0;

    var group13 = group1.add("group", undefined, {name: "group13"});
    group13.orientation = "column";
    group13.alignChildren = ["left", "top"];
    group13.spacing = 14;
    group13.margins = 0;

    var sliders = [];
    var labelEdits = [];
    var defaultLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var minMaxMiddle = (minVal + maxVal) / 2;

    var leftColumnCount = (totalBars >= 7) ? Math.ceil(totalBars / 2) : totalBars;

    for (var i = 1; i <= totalBars; i++) {
        var targetGroup = (i <= leftColumnCount) ? group2 : group13;

        var panel = targetGroup.add("panel", undefined, undefined, {name: "panel" + i});
        panel.orientation = "column";
        panel.alignChildren = ["left", "top"];
        panel.spacing = 14;
        panel.margins = 16;

        if (axisCheck) {
            var labelGroup = panel.add("group", undefined, {name: "labelGroup" + i});
            labelGroup.orientation = "row";
            labelGroup.alignChildren = ["left", "center"];
            labelGroup.spacing = 10;
            labelGroup.margins = 0;

            var labelStatic = labelGroup.add("statictext", undefined, undefined, {name: "labelStatic" + i});
            labelStatic.text = "Label " + i + ":";

            var labelEdit = labelGroup.add('edittext {properties: {name: "labelEdit' + i + '"}}');
            labelEdit.text = defaultLabels[i - 1] || ("Bar " + i);
            labelEdit.preferredSize.width = 200;
            labelEdits.push(labelEdit);

            var labelDivider = panel.add("panel", undefined, undefined, {name: "labelDivider" + i});
            labelDivider.alignment = "fill";
        }

        var valueGroup = panel.add("group", undefined, {name: "valueGroup" + i});
        valueGroup.orientation = "row";
        valueGroup.alignChildren = ["left", "center"];
        valueGroup.spacing = 12;
        valueGroup.margins = 0;

        var valueStatic = valueGroup.add("statictext", undefined, undefined, {name: "valueStatic" + i});
        valueStatic.text = "Value " + i + ":";

        var slider = valueGroup.add("slider", undefined, undefined, undefined, undefined, {name: "slider" + i});
        slider.minvalue = minVal;
        slider.maxvalue = maxVal;
        slider.value = minMaxMiddle;
        slider.preferredSize.width = 200;
        sliders.push(slider);

        var valueEdit = valueGroup.add('edittext {justify: "center", properties: {name: "valueEdit' + i + '"}}');
        valueEdit.text = Math.round(minMaxMiddle);
        valueEdit.preferredSize.width = 40;

        linkSliderAndEdit(slider, valueEdit);
    }

    var divider11 = SimpleBar_Step2.add("panel", undefined, undefined, {name: "divider11"});
    divider11.alignment = "fill";

    var group24 = SimpleBar_Step2.add("group", undefined, {name: "group24"});
    group24.orientation = "row";
    group24.alignChildren = ["left", "center"];
    group24.spacing = 10;
    group24.margins = [0, 10, 0, 0];

    var okButton = group24.add("button", undefined, undefined, {name: "okButton"});
    okButton.text = "Ok!";
    okButton.preferredSize.width = 71;

    var cancelButton = group24.add("button", undefined, undefined, {name: "cancelButton"});
    cancelButton.text = "Cancel";
    cancelButton.preferredSize.width = 71;

    okButton.onClick = function () {
        var valuesArray = [];
        var labelsArray = [];

        for (var i = 0; i < sliders.length; i++) {
            valuesArray.push(Math.round(sliders[i].value));
            if (axisCheck) {
                labelsArray.push(labelEdits[i].text);
            }
        }

        buildBarGraph(app.project.activeItem, {
            isVertical: isVertical,
            totalBars: totalBars,
            minVal: minVal,
            maxVal: maxVal,
            barCheck: barCheck,
            perCheck: perCheck,
            axisCheck: axisCheck,
            values: valuesArray,
            labels: labelsArray
        });
        SimpleBar_Step2.close();
    };

    cancelButton.onClick = function () {
        SimpleBar_Step2.close();
    };

    SimpleBar_Step2.show();
}
