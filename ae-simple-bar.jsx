// Simple Bar //

////// HELPERS ///////

// Keeps a slider and its numeric edittext in sync, with clamping/NaN protection.
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
// =========
var simpleBar = new Window("dialog");
simpleBar.text = "Simple Bar";
simpleBar.orientation = "column";
simpleBar.alignChildren = ["center", "top"];
simpleBar.spacing = 10;
simpleBar.margins = 16;

// PANEL2 - bar count
// ====================
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

// PANEL3 - min/max
// ==================
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

// PANEL4 - Visual Settings (orientation on the left, checkboxes on the
// right, options stacked vertically within each side, divided by a
// vertical rule)
// ==========================================================================
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

// % Labels only make sense once Bar Value Labels is on - disable instead of
// alerting after the fact.
perCheckbox.enabled = false;
barCheckbox.onClick = function () {
    perCheckbox.enabled = barCheckbox.value;
    if (!barCheckbox.value) {
        perCheckbox.value = false;
    }
};

// GROUP3 - buttons
// ==================
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

    var help7 = globalPanel.add("statictext", undefined, "Simple Bar");

    var closeButton = g.add("button", undefined, "Close");
    closeButton.onClick = function () {
        g.close();
    };

    g.show();
};

simpleBar.show();


// SIMPLEBAR_STEP2
// ================
function secondUI(isVertical, totalBars, minVal, maxVal, barCheck, perCheck, axisCheck) {

    var SimpleBar_Step2 = new Window("dialog");
    SimpleBar_Step2.text = "Bar Graph Data";
    SimpleBar_Step2.orientation = "column";
    SimpleBar_Step2.alignChildren = ["center", "top"];
    SimpleBar_Step2.spacing = 10;
    SimpleBar_Step2.margins = 16;

    // GROUP1
    // ======
    var group1 = SimpleBar_Step2.add("group", undefined, {name: "group1"});
    group1.orientation = "row";
    group1.alignChildren = ["left", "top"];
    group1.spacing = 10;
    group1.margins = 0;

    // GROUP2 / GROUP13 - left/right panel columns
    // =============================================
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

    // BAR PANELS - one panel per bar, balanced across the two columns.
    // Single column up to 6 bars, then split with the left column getting
    // the larger half.
    // ====================================================================
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

    // SIMPLEBAR_STEP2
    // ================
    var divider11 = SimpleBar_Step2.add("panel", undefined, undefined, {name: "divider11"});
    divider11.alignment = "fill";

    // GROUP24
    // =======
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

        if (isVertical) {
            vertBarGraph(totalBars, minVal, maxVal, barCheck, perCheck, axisCheck, valuesArray, labelsArray);
        } else {
            horBarGraph(totalBars, minVal, maxVal, barCheck, perCheck, axisCheck, valuesArray, labelsArray);
        }
        SimpleBar_Step2.close();
    };

    cancelButton.onClick = function () {
        SimpleBar_Step2.close();
    };

    SimpleBar_Step2.show();
}


//////////////////////////////////////////////////////////////////////////////////////////
//Shared Helpers (used by both the Horizontal and Vertical graph makers)

//TEMP: strips Vertical Bar/Back Plate out of the finished precomp for
//testing. Safe to do post-precompose (all the layer-index math that
//builds the graph has already run by then); flip back to false to
//restore them.
var TEMP_HIDE_EXTRAS = true;
function stripTempExtras(builtComp) {
    if (!TEMP_HIDE_EXTRAS) return;
    builtComp.layer("Vertical Bar").remove();
    builtComp.layer("Back Plate").remove();
}

//Random RGB color (0-1 per channel), used instead of a fixed palette so each
//bar's color is different every time the graph is built.
function randomBarColor() {
    return [Math.random(), Math.random(), Math.random()];
}

//Builds a rectangle shape layer the same way ae-simple-ring builds its color
//squares: an "ADBE Vector Group" holding a Rect path + Fill, addressed by
//display name (Contents/Size/Position/Color), which is the pattern already
//proven to work in this project's other scripts.
//Rect position is offset to (width/2, height/2) so the rectangle spans
//[0,0] to [width,height] in layer space, matching a solid's footage bounds -
//this keeps the anchor point math in vBarMaker() working unchanged.
//The Fill's Color is wired straight to the matching "Bar Color N" Color
//Control on MASTER CONTROL, same as the ring script does at creation time.
function createBarShape(curItem, name, width, height, colorIndex) {
    var shapeLayer = curItem.layers.addShape();
    shapeLayer.name = name;
    // addShape() layers can come up as 3D (3-component position), which
    // makes reading anchorPoint/scale throw "invalid numeric result" - force
    // 2D so the rest of this behaves like a normal (2D) solid would have.
    shapeLayer.threeDLayer = false;

    var baseGroup = shapeLayer.property("Contents").addProperty("ADBE Vector Group");
    baseGroup.name = "Bar Group";

    var pathGroup = shapeLayer.property("Contents").property("Bar Group").property("Contents").addProperty("ADBE Vector Shape - Rect");
    pathGroup.name = "Bar Path";
    pathGroup.property("Size").setValue([width, height]);
    pathGroup.property("Position").setValue([width / 2, height / 2]);

    var fillGroup = shapeLayer.property("Contents").property("Bar Group").property("Contents").addProperty("ADBE Vector Graphic - Fill");
    fillGroup.property("Color").expression = "thisComp.layer(\"MASTER CONTROL\").effect(\"Bar Color " + colorIndex + "\")(\"Color\")";

    // Force the same anchor/position defaults a solid gets, AFTER content is
    // added - AE's "Center Anchor Point in New Shape Layers" preference can
    // re-center the layer's anchor/position as soon as it gets content,
    // which would silently undo this if set right after addShape() instead.
    shapeLayer.anchorPoint.setValue([0, 0]);
    shapeLayer.position.setValue([curItem.width / 2, curItem.height / 2]);

    return shapeLayer;
}

//Creates a straight, stroked-line shape layer (no fill) instead of a thin
//solid, for the axis lines. `vertices` is a two-point path in layer space;
//`strokeWidth` is the line thickness. Callers keep tracking their own
//width/height (the same values used to build the path) instead of reading
//them back from the layer, since shape layers have no .width/.height.
function createLineShape(curItem, name, vertices, strokeWidth) {
    var shapeLayer = curItem.layers.addShape();
    shapeLayer.name = name;
    // Same reasoning as createBarShape() - force 2D so anchorPoint/scale
    // reads don't throw "invalid numeric result".
    shapeLayer.threeDLayer = false;

    var baseGroup = shapeLayer.property("Contents").addProperty("ADBE Vector Group");
    baseGroup.name = "Line Group";

    var pathGroup = shapeLayer.property("Contents").property("Line Group").property("Contents").addProperty("ADBE Vector Shape - Group");
    var lineShape = new Shape();
    lineShape.vertices = vertices;
    lineShape.inTangents = [[0, 0], [0, 0]];
    lineShape.outTangents = [[0, 0], [0, 0]];
    lineShape.closed = false;
    pathGroup.property("ADBE Vector Shape").setValue(lineShape);

    var strokeGroup = shapeLayer.property("Contents").property("Line Group").property("Contents").addProperty("ADBE Vector Graphic - Stroke");
    strokeGroup.property("Color").setValue([1, 1, 1]);
    // Visible stroke is thinner than the bounding box `strokeWidth` implies -
    // the anchor-point math above still uses the full width/height so the
    // line's layer bounds line up with what a same-sized solid would have had.
    strokeGroup.property("Stroke Width").setValue(strokeWidth * 0.6);
    strokeGroup.property("Line Cap").setValue(2); // Round Cap

    // Force the same anchor/position defaults a solid gets, AFTER content is
    // added - AE's "Center Anchor Point in New Shape Layers" preference can
    // re-center the layer's anchor/position as soon as it gets content,
    // which would silently undo this if set right after addShape() instead.
    shapeLayer.anchorPoint.setValue([0, 0]);
    shapeLayer.position.setValue([curItem.width / 2, curItem.height / 2]);

    return shapeLayer;
}


//////////////////////////////////////////////////////////////////////////////////////////
//Horizontal Graph Maker
function horBarGraph(pTotalBars, pMinText, pMaxText, pBarLabel, pPerLabel, pAxisLabel, pValues, pLabels) {

//Set Up
var scriptName = "Horizontal Bar Graph";
var curItem = app.project.activeItem;
var detVar = curItem.height;
var pxlAsp = curItem.pixelAspect;
//Baseline Y that bars grow up from - must match Horizontal Bar's own
//placement (below) so a bar's bottom edge lines up with the axis line.
var baselineY = curItem.height*.992;

var checkEx;

var totalBars = pTotalBars;

//Determine Max and Min Amounts
var maxLine = pMaxText;
var minLine = pMinText;
var maxMinDifference = (100/(maxLine - minLine))*.01;
var minMaxMiddle = (maxLine+minLine)/2;

var perCheck = pPerLabel;
var textCheck = pBarLabel;
var labelCheck = pAxisLabel;

/////////////////CREATE MASTER CONTROL///////////////////


//Start Undo Group
app.beginUndoGroup(scriptName);

//Building the Master Null
curItem.layers.addNull();  
curItem.selectedLayers[0].name = "MASTER CONTROL";

//Attach Controls to the the Master Null
for (var x = 1; x <= totalBars; x++) {
    curItem.selectedLayers[0].Effects.addProperty("Slider Control");
    curItem.selectedLayers[0].Effects.addProperty("Color Control");
    
    var valueNumber = pValues[x - 1];
    var colorCont = randomBarColor();

    //Slider Control
    curItem.selectedLayers[0].property("Effects").property("Slider Control").property("Slider").setValueAtTime(.8+((x-1)/2),minLine);
    curItem.selectedLayers[0].property("Effects").property("Slider Control").property("Slider").setValueAtTime(2.5+((x-1)/2),valueNumber);
    
    //Set Ease In for the Animation
    var easeIn = new KeyframeEase(0.8,100);
    curItem.selectedLayers[0].property("Effects").property("Slider Control").property("Slider").setTemporalEaseAtKey(2, [easeIn]);
    
    //Color Control
    curItem.selectedLayers[0].property("Effects").property("Color Control").property("Color").setValue(colorCont);

    //Rename Controls
    curItem.selectedLayers[0].property("Effects").property("Slider Control").name = "Value Amount " + x;
    curItem.selectedLayers[0].property("Effects").property("Color Control").name = "Bar Color " + x;
}

//////////////////CREATE BARS AND ANIMATION/////////////////////


//Create the set number of Bars 
for (var x = 1; x <= totalBars; x++) {
    
    //BAR MAKER FUNCTION
    vBarMaker(x);

    //Parenting - % parents directly to MASTER CONTROL (not Value) so its
    //position expression's reference to Value's transform.position isn't
    //double-applied through a parent chain.
    curItem.layer(1).parent = curItem.layer((x*3)+1);
    curItem.layer(2).parent = curItem.layer((x*3)+1);
    curItem.layer(3).parent = curItem.layer((x*3)+1);

    //Rename Bar Layer
    curItem.layer(3).name = "Bar " + x;

    //EXPRESSIONS
        
    //% Expressions - tracks the Value text's actual rendered bounds so the
    //% sign's top lines up with the Value text's top, offset to its right.
    //(thisLayer.index+1 is the Value text - it's always the layer directly
    //above the % text in the stack.)
    curItem.layer(1).position.expression = "var layDown = thisComp.layer(thisLayer.index+1); var laySize = layDown.sourceRectAtTime(); var gap = thisComp.width*.003; var x = layDown.transform.position[0]+(laySize.width/2)+(thisLayer.sourceRectAtTime().width/2)+gap; var y = layDown.transform.position[1]-laySize.height+thisLayer.sourceRectAtTime().height; [x,y]"
   
    //Text Expression
    curItem.layer(2).property("Source Text").expression = "thisComp.layer(\"MASTER CONTROL\").effect(\"Value Amount " + x + "\")(\"Slider\").value.toFixed(0)"
   
   if(perCheck == true) {
        curItem.layer(2).position.expression  = "temp = (((thisComp.height/100)*((((thisComp.layer(\"MASTER CONTROL\").effect(\"Value Amount " + x + "\")(\"Slider\") - " + minLine + ") * (100)) / (" + maxLine + " - " + minLine + "))  + 0))*-1); [thisComp.layer(\"Bar " + x +"\").transform.position[0] + (thisComp.width*-.008), (temp+(thisComp.height/2))-thisComp.height*.01]"
    } else {
        curItem.layer(2).position.expression  = "temp = (((thisComp.height/100)*((((thisComp.layer(\"MASTER CONTROL\").effect(\"Value Amount " + x + "\")(\"Slider\") - " + minLine + ") * (100)) / (" + maxLine + " - " + minLine + "))  + 0))*-1); [thisComp.layer(\"Bar " + x +"\").transform.position[0], (temp+(thisComp.height/2))-thisComp.height*.01]"    
    }
    
    //Bar Expressions (fill color is wired up in createBarShape() at creation time)
    curItem.layer(3).scale.expression = "temp = ((((thisComp.layer(\"MASTER CONTROL\").effect(\"Value Amount " + x + "\")(\"Slider\") - " + minLine + ") * (100)) / (" + maxLine + " - " + minLine + "))  + 0); [100, temp]";
}


/////////CREATE BACKGROUND//////////

//Exact centering shift (replaces the old approximate curItem.width*.0712*
//(7-totalBars) constant, which didn't actually center the bar group -
//solved so that bar 1 and the last bar land symmetrically around comp
//center, for any totalBars/width/bar width). Computed here (before
//Horizontal Bar is created) because its length depends on it below.
var groupBarWidth = Math.round(detVar*.16);
var groupShift = (1.1*curItem.width - groupBarWidth - curItem.width*(.126+.0014*totalBars)*(totalBars+1)) / 2;

//Where bar 1's own left edge actually is (groupShift alone is just the
//sequence's shift term - bar 1's position also adds its own per-bar
//spacing term). Horizontal Bar/Back Plate need to start here, not at
//groupShift alone, or they overhang past the first bar.
var barSpacingStep = curItem.width*(.126+.0014*totalBars);
var barGroupLeftX = groupShift + (barSpacingStep*1 - curItem.width*.05);
//Span from bar 1's left edge to the last bar's right edge.
var barGroupSpan = barSpacingStep*(totalBars-1) + groupBarWidth;

//Create the Vertical Bar
var vBarThickness = Math.round(detVar*.02);
var vBarLength = detVar;
createLineShape(curItem, "Vertical Bar", [[vBarThickness / 2, 0], [vBarThickness / 2, vBarLength]], vBarThickness);
curItem.selectedLayers[0].label = 9;

var background1LayerWidth = vBarThickness/2;       //Layer Width
var background1LayerHeight = vBarLength/2;     //Layer Height

//Define Anchor Position
var anchorPX = background1LayerWidth;
var anchorPY = background1LayerHeight*2;

//Define Current Position and Current Anchor Point
var curPositionX = curItem.selectedLayers[0].position.value[0] ;
var curPositionY = curItem.selectedLayers[0].position.value[1];
var curAPX = curItem.selectedLayers[0].anchorPoint.value[0];
var curAPY = curItem.selectedLayers[0].anchorPoint.value[1];

//Define Amount to move
var moveX = curAPX - anchorPX;
var moveY = curAPY - anchorPY;

//Actions
curItem.selectedLayers[0].anchorPoint.setValue([anchorPX,anchorPY]);
curItem.selectedLayers[0].position.setValue([curPositionX - moveX, curPositionY - moveY]);

//Move to the side
var curPositionX = curItem.selectedLayers[0].position.value[0];
var curPositionY = curItem.selectedLayers[0].position.value[1];

//Y pinned to baselineY (not curPositionY, which is comp-center-derived) so
//this line's bottom (its anchor) sits on the same baseline as the bars and
//Horizontal Bar, instead of floating below it.
curItem.selectedLayers[0].position.setValue([0, baselineY]);

//Create the Horizontal Bar
var hBarLength = Math.round(barGroupSpan);
var hBarThickness = Math.round(detVar*.02);
createLineShape(curItem, "Horizontal Bar", [[0, hBarThickness / 2], [hBarLength, hBarThickness / 2]], hBarThickness);
curItem.selectedLayers[0].label = 9;

var background1LayerWidth = hBarLength/2;       //Layer Width
var background1LayerHeight = hBarThickness/2;     //Layer Height

//Define Anchor Position
var anchorPX =0;
var anchorPY = background1LayerHeight; 

//Define Current Position and Current Anchor Point
var curPositionX = curItem.selectedLayers[0].position.value[0] ;
var curPositionY = curItem.selectedLayers[0].position.value[1];
var curAPX = curItem.selectedLayers[0].anchorPoint.value[0];
var curAPY = curItem.selectedLayers[0].anchorPoint.value[1];

//Define Amount to move 
var moveX = curAPX - anchorPX; 
var moveY = curAPY - anchorPY;

//Actions
curItem.selectedLayers[0].anchorPoint.setValue([anchorPX,anchorPY]);
curItem.selectedLayers[0].position.setValue([curPositionX - moveX, curPositionY - moveY]); 

//Move to the side
var curPositionX = curItem.selectedLayers[0].position.value[0];
var curPositionY = curItem.selectedLayers[0].position.value[1];

curItem.selectedLayers[0].position.setValue([0, baselineY]);


//Center All Objects
for(x = 1; x <= totalBars; x++) {
        curItem.layer((x*3)+2).parent = curItem.layer(1);
        }

var centerYone = curItem.layer(1).position.value[1];
var centerYtwo = curItem.layer(2).position.value[1];

//Vertical Bar sits one bar-step before the group (an axis reference point,
//not meant to align with the group's own left edge) so it keeps using
//groupShift alone. Horizontal Bar needs to actually span the bar group,
//so it uses barGroupLeftX (groupShift plus bar 1's own spacing term).
curItem.layer(1).position.setValue([groupShift,centerYone]);
curItem.layer(2).position.setValue([barGroupLeftX,centerYtwo]);

for(x = 1; x <= totalBars; x++) {
     curItem.layer((x*3)+2).parent = curItem.layer((totalBars*3)+3);   
     }

//Parent Bars
curItem.layer(1).parent = curItem.layer((totalBars*3)+3);
curItem.layer(2).parent = curItem.layer((totalBars*3)+3);

//Create Background
curItem.layers.addSolid([0,0,0],"Back Plate", Math.round(barGroupSpan), detVar, pxlAsp);
curItem.selectedLayers[0].label = 9;
curItem.selectedLayers[0].opacity.setValue([15]);
curItem.selectedLayers[0].anchorPoint.setValue([0,detVar]);
curItem.selectedLayers[0].position.setValue([barGroupLeftX,centerYone]);
curItem.selectedLayers[0].scale.setValue([100,99]);

//Parent to Master Null
curItem.selectedLayers[0].parent = curItem.layer((totalBars*3)+4);

//Create Grid
curItem.selectedLayers[0].moveAfter(curItem.layer((totalBars*3)+4));
curItem.selectedLayers[0].duplicate();
curItem.selectedLayers[0].Effects.addProperty("Grid");

//Fix the Grid
var gridX = (curItem.selectedLayers[0].property("Effects").property("Grid").property("Anchor").value[0])+8;
var gridY = curItem.selectedLayers[0].property("Effects").property("Grid").property("Anchor").value[1];

curItem.selectedLayers[0].property("Effects").property("Grid").property("Anchor").setValue([gridX,gridY]);

if (labelCheck == true) {
        for (x = 1; x <= totalBars; x++) {
            
                //Label
                var label = pLabels[x - 1];
                
                //Main Text Layer
                curItem.layers.addText(label);  
                curItem.layer(1).label = 4;
                curItem.layer(1).parent = curItem.layer(((totalBars*3)+3)+x);

                //Text modifiers
                var centerNum= app.project.activeItem.selectedLayers[0].property("ADBE Text Properties").property("ADBE Text Document");
                var centerDoc = centerNum.value;
                centerDoc.resetCharStyle();
                centerDoc.resetParagraphStyle();
                centerDoc.fillColor = [1,1,1];
                centerDoc.justification = ParagraphJustification.CENTER_JUSTIFY;
                centerDoc.font = "Arial-BoldMT";
                centerDoc.fontSize = detVar*.03996;
                centerNum.setValue(centerDoc);
                
                //Establish Variables for movement
                var labScaleAmount = Math.round(detVar*.04629);
                curItem.layer(1).position.expression = "[thisComp.layer(\"Bar "+ x +"\").transform.position[0],thisComp.layer(\"Bar "+ x +"\").transform.position[1]+" + labScaleAmount + "\]"
                
                }    
            
         var vertBarDet = 3+totalBars;
            
        //Max Line Label
        curItem.layers.addText(maxLine);

        //Text Attributes
        var centerNum= app.project.activeItem.selectedLayers[0].property("ADBE Text Properties").property("ADBE Text Document");
        var centerDoc = centerNum.value;
        centerDoc.resetCharStyle();
        centerDoc.resetParagraphStyle();
        centerDoc.fillColor = [1,1,1];
        centerDoc.justification = ParagraphJustification.RIGHT_JUSTIFY;
        centerDoc.font = "Arial-BoldMT";
        centerDoc.fontSize = detVar*.03996;
        centerNum.setValue(centerDoc);

        //Place in the correct area
        curItem.layer(1).position.setValue([(curItem.width*.1) - (curItem.width*.005),(detVar*.01)]);
        curItem.layer(1).position.expression = "[thisComp.layer(\"Vertical Bar\").transform.position[0]-(thisComp.width*.015),transform.position[1]]"
        curItem.layer(1).label = 14;
        curItem.layer(1).parent = curItem.layer(((totalBars*3)+vertBarDet+1));

        //Min Line Label
        curItem.layers.addText(minLine);

        //Text Attributes
        var centerNum= app.project.activeItem.selectedLayers[0].property("ADBE Text Properties").property("ADBE Text Document");
        var centerDoc = centerNum.value;
        centerDoc.resetCharStyle();
        centerDoc.resetParagraphStyle();
        centerDoc.fillColor = [1,1,1];
        centerDoc.justification = ParagraphJustification.RIGHT_JUSTIFY;
        centerDoc.font = "Arial-BoldMT";
        centerDoc.fontSize = detVar*.03996;
        centerNum.setValue(centerDoc);

        //Place in the correct area
        curItem.layer(1).position.setValue([(curItem.width*.1) - (curItem.width*.005),(detVar*.99)]);
        curItem.layer(1).position.expression = "[thisComp.layer(\"Vertical Bar\").transform.position[0]-(thisComp.width*.015),transform.position[1]]"
        curItem.layer(1).label = 14;
        curItem.layer(1).parent = curItem.layer(((totalBars*3)+vertBarDet+2));
   
   }



//////////////CLEAN UP//////////////////////////

//Move Master Control to the Top of the Stacking Order
if (labelCheck == true) {
        curItem.layer((totalBars*4)+5).moveToBeginning();
    } else {
        curItem.layer((totalBars*3)+3).moveToBeginning();
    }

//Establish Scale Amount
if (totalBars <= 7) {
    var cleanScaleAmount = 80;
} else if (totalBars == 8 || totalBars == 9) {
    var cleanScaleAmount = 70;
} else if (totalBars ==10 || totalBars == 11){
    var cleanScaleAmount = 60;
} else {
    var cleanScaleAmount = 53;
}

//Scale All down and Change color
curItem.layer(1).scale.setValue([cleanScaleAmount,cleanScaleAmount,cleanScaleAmount]);
curItem.layer(1).label = 2;

//Remove Unwanted Items
removeArray = [];

//Push all unwanted layers to the remove Array
if(labelCheck == false) {
    if (textCheck == false) {
        for(x = 5; x < (totalBars*3)+3; x +=3) {
            removeArray.push(curItem.layer(x));
            }
        }

     if (perCheck == false) {
        for(x = 4; x < (totalBars*3) + 3; x += 3) {
            removeArray.push(curItem.layer(x));
            }
        }
    } else {
        if (textCheck == false) {
            for(x = 7+totalBars; x < ((totalBars*3)+totalBars)+5; x +=3) {
                removeArray.push(curItem.layer(x));
                }
            }

         if (perCheck == false) {
            for(x = 6+totalBars; x < ((totalBars*3)+totalBars) + 5; x += 3) {
                removeArray.push(curItem.layer(x));
                }
            }       
    }

//Delete all Layers in the Remove Array
for (x = 0; x < removeArray.length; x++) {
        removeArray[x].remove();
    }

//Pre Compose
var precomposeArray = [];

if (labelCheck == false) {
    if (perCheck == true && textCheck == true) {
        var precompFinalAmount = 5+(totalBars*3);
    } else if (textCheck == true) {
        var precompFinalAmount = 5+(totalBars*2);
    } else {
        var precompFinalAmount = 5+totalBars;
    }
} else {
    if (perCheck == true && textCheck == true) {
        var precompFinalAmount = 7+(totalBars*4);
    } else if (textCheck == true) {
        var precompFinalAmount = 7+(totalBars*3);
    } else {
        var precompFinalAmount = 7+(totalBars*2);
    }
}

for (var i = 1; i <= precompFinalAmount; i++) {
   precomposeArray.push(i);
   }

var horBuiltComp = curItem.layers.precompose(precomposeArray, "Horizontal Bar Graph", true);
stripTempExtras(horBuiltComp);

//Move to Correct Time Period
var timeSetTo = (2.5+((totalBars-1)/2))+1;
app.project.activeItem.time = timeSetTo;

//End Undo Group
app.endUndoGroup();


//**********************************************************//
//////////////////FUNCTIONS/////////////////////////
function vBarMaker(spacingAmount) {
    
        //Create the Bar
        var barWidth = Math.round(detVar*.16);
        var barHeight = detVar;
        createBarShape(curItem, "Bar", barWidth, barHeight, spacingAmount);
        curItem.layer(1).label = 6;

        var barLayerWidth = barWidth/2;       //Layer Width
        var barLayerHeight = barHeight/2;     //Layer Height

        //Define Anchor Position
        var anchorPX = barLayerWidth;
        var anchorPY = barLayerHeight*2;

        //Define Current Position and Current Anchor Point
        var curPositionX = curItem.layer(1).position.value[0];
        var curPositionY = curItem.layer(1).position.value[1];
        var curAPX = curItem.layer(1).anchorPoint.value[0];
        var curAPY = curItem.layer(1).anchorPoint.value[1];

        //Define Amount to move 
        var moveX = curAPX - anchorPX; 
        var moveY = curAPY - anchorPY;

        //Actions
        curItem.layer(1).anchorPoint.setValue([anchorPX,anchorPY]);
        //Y is pinned to baselineY (not curPositionY - moveY) so the bar's
        //bottom edge (now at the anchor) lines up with Horizontal Bar's own
        //baseline instead of wherever the shape's default creation position
        //(comp center) happened to leave it.
        curItem.layer(1).position.setValue([curPositionX - moveX, baselineY]);

        /////////CREATE TEXT/////////
    
        //Main Text Layer
        curItem.layers.addText("Value");  

        //Main Text Re-figure
        var centerNum= app.project.activeItem.selectedLayers[0].property("ADBE Text Properties").property("ADBE Text Document");
        var centerDoc = centerNum.value;
        centerDoc.resetCharStyle();
        centerDoc.resetParagraphStyle();
        centerDoc.fillColor = [1,1,1];
        centerDoc.justification = ParagraphJustification.CENTER_JUSTIFY;
        centerDoc.font = "Arial-BoldMT";
        centerDoc.fontSize = detVar*.11296*0.6;
        centerNum.setValue(centerDoc);

        //Main Text Re-Position
        curItem.selectedLayers[0].position.setValue([((curItem.width/2)-((curItem.width/2)*.0001))+((curItem.width*.015)*-1),detVar/2]);

        //% Text Layer
        curItem.layers.addText("%");

        //% Text Re-figure
        var perNum= app.project.activeItem.selectedLayers[0].property("ADBE Text Properties").property("ADBE Text Document");
        var perDoc = perNum.value;
        perDoc.resetCharStyle();
        perDoc.resetParagraphStyle();
        perDoc.fillColor = [1,1,1];
        perDoc.justification = ParagraphJustification.CENTER_JUSTIFY;
        perDoc.font = "Arial-BoldMT";
        perDoc.fontSize = detVar*.0540*0.6;
        perNum.setValue(perDoc);

        //% Text Re-Position
        curItem.selectedLayers[0].position.setValue([(curItem.width/2)+((curItem.width/2)*.067),(detVar/2)-((detVar/2)*.06974)]);
        
        //Add Opacity Animation to Text and %
        curItem.layer(1).opacity.setValueAtTime(.8+((spacingAmount-1)/2),0);
        curItem.layer(1).opacity.setValueAtTime(1.5+((spacingAmount-1)/2),100);

        curItem.layer(2).opacity.setValueAtTime(.8+((spacingAmount-1)/2),0);
        curItem.layer(2).opacity.setValueAtTime(1.5+((spacingAmount-1)/2),100);

        //Create Null and Parent All Items
        curItem.layers.addNull();
        curItem.layer(2).parent = curItem.layer(1);
        curItem.layer(3).parent = curItem.layer(1);
        curItem.layer(4).parent = curItem.layer(1);

        //Move Null to the Left of the screen.
        curItem.layer(1).position.setValue([((curItem.width*(.1260 + (.0014*totalBars)))*spacingAmount) - (curItem.width*.05),curItem.height/2]);

        //Delete Null
        curItem.layer(1).remove();
}
}

//////////////////////////////////////////////////////////////////////////////////////////
//Vertical Graph Maker
function vertBarGraph(pTotalBars, pMinText, pMaxText, pBarLabel, pPerLabel, pAxisLabel, pValues, pLabels) {

//Set Up
var scriptName = "Vertical Bar Graph";  
var curItem = app.project.activeItem;
var detVar = curItem.height;
var pxlAsp = curItem.pixelAspect;

var checkEx;

var totalBars = pTotalBars;

//Determine Max and Min Amounts
var maxLine = pMaxText;
var minLine = pMinText;
var maxMinDifference = (100/(maxLine - minLine))*.01;
var minMaxMiddle = (maxLine+minLine)/2;

var perCheck = pPerLabel;
var textCheck = pBarLabel;
var labelCheck = pAxisLabel;

/////////////////CREATE MASTER CONTROL///////////////////


//Start Undo Group
app.beginUndoGroup(scriptName);

//Building the Master Null
curItem.layers.addNull();  
curItem.selectedLayers[0].name = "MASTER CONTROL";

//Attach Controls to the the Master Null
for (var x = 1; x <= totalBars; x++) {
    curItem.selectedLayers[0].Effects.addProperty("Slider Control");
    curItem.selectedLayers[0].Effects.addProperty("Color Control");
    
    var valueNumber = pValues[x - 1];
    var colorCont = randomBarColor();
    //Slider Control
    curItem.selectedLayers[0].property("Effects").property("Slider Control").property("Slider").setValueAtTime(.8+((x-1)/2),0);
    curItem.selectedLayers[0].property("Effects").property("Slider Control").property("Slider").setValueAtTime(2.5+((x-1)/2),valueNumber);
    
    //Set Ease In for the Animation
    var easeIn = new KeyframeEase(0.8,100);
    curItem.selectedLayers[0].property("Effects").property("Slider Control").property("Slider").setTemporalEaseAtKey(2, [easeIn]);
    
    //Color Control
    curItem.selectedLayers[0].property("Effects").property("Color Control").property("Color").setValue(colorCont);

    //Rename Controls
    curItem.selectedLayers[0].property("Effects").property("Slider Control").name = "Value Amount " + x;
    curItem.selectedLayers[0].property("Effects").property("Color Control").name = "Bar Color " + x;
}

//////////////////CREATE BARS AND ANIMATION/////////////////////

//Create the set number of Bars 
for (var x = 1; x <= totalBars; x++) {
    
    //BAR MAKER FUNCTION
    vBarMaker(x);

    //Parenting - % parents directly to MASTER CONTROL (not Value) so its
    //position expression's reference to Value's transform.position isn't
    //double-applied through a parent chain.
    curItem.layer(1).parent = curItem.layer((x*3)+1);
    curItem.layer(2).parent = curItem.layer((x*3)+1);
    curItem.layer(3).parent = curItem.layer((x*3)+1);

    //TextMoveMod
    if(totalBars <= 7) {
    var textMoveMod = .038;
        } else {
    var textMoveMod = .032;
        }
    
    //Rename Bar Layer
    curItem.layer(3).name = "Bar " + x;
    
    //EXPRESSIONS    
        
    //% Expressions - tracks the Value text's actual rendered bounds so the
    //% sign's top lines up with the Value text's top, offset to its right.
    //(thisLayer.index+1 is the Value text - it's always the layer directly
    //above the % text in the stack.)
    curItem.layer(1).position.expression = "var layDown = thisComp.layer(thisLayer.index+1); var laySize = layDown.sourceRectAtTime(); var gap = thisComp.width*.003; var x = layDown.transform.position[0]+(laySize.width/2)+(thisLayer.sourceRectAtTime().width/2)+gap; var y = layDown.transform.position[1]-laySize.height+thisLayer.sourceRectAtTime().height; [x,y]"
   
   //Text Expression
    curItem.layer(2).property("Source Text").expression = "thisComp.layer(\"MASTER CONTROL\").effect(\"Value Amount " + x + "\")(\"Slider\").value.toFixed(0)"
    curItem.layer(2).position.expression  = "temp = (((thisComp.width/100)*(((thisComp.layer(\"MASTER CONTROL\").effect(\"Value Amount " + x + "\")(\"Slider\") - " + minLine + ") * (100)) / (" + maxLine + " - " + minLine + "))  + 0))*-1; [((temp+(thisComp.width/2))-thisComp.height*.01)*-1+(thisComp.width*.004), thisComp.layer(\"Bar " + x +"\").transform.position[1] + (thisComp.height*" + textMoveMod +")]"
    
    //Bar Expressions (fill color is wired up in createBarShape() at creation time)
    curItem.layer(3).scale.expression = "temp = (((thisComp.layer(\"MASTER CONTROL\").effect(\"Value Amount " + x + "\")(\"Slider\"))- 0) - "+minLine+") * (100-0)/("+maxLine+" - "+minLine+");  [100, temp]";

}


/////////CREATE BACKGROUND//////////

if (totalBars > 7) {
        var BGdivider = 8;
    } else {
        var BGdivider = 7;
    }

//Create the Vertical Bar
var vBarThickness = Math.round(detVar*.02);
var vBarLength = Math.round((totalBars/BGdivider) * curItem.height);
createLineShape(curItem, "Vertical Bar", [[vBarThickness / 2, 0], [vBarThickness / 2, vBarLength]], vBarThickness);

var background1LayerWidth = vBarThickness/2;       //Layer Width
var background1LayerHeight = vBarLength/2;     //Layer Height

//Define Anchor Position
var anchorPX = background1LayerWidth;
var anchorPY = background1LayerHeight*2;

//Define Current Position and Current Anchor Point
var curPositionX = curItem.selectedLayers[0].position.value[0] ;
var curPositionY = curItem.selectedLayers[0].position.value[1];
var curAPX = curItem.selectedLayers[0].anchorPoint.value[0];
var curAPY = curItem.selectedLayers[0].anchorPoint.value[1];

//Define Amount to move
var moveX = curAPX - anchorPX;
var moveY = curAPY - anchorPY;

//Actions
curItem.selectedLayers[0].anchorPoint.setValue([anchorPX,anchorPY]);
curItem.selectedLayers[0].position.setValue([curPositionX - moveX, curPositionY - moveY]);

//Move to the side
var curPositionX = curItem.selectedLayers[0].position.value[0];
var curPositionY = curItem.selectedLayers[0].position.value[1];

curItem.selectedLayers[0].position.setValue([0, vBarLength*.992]);

//Create the Horizontal Bar
var hBarLength = curItem.width;
var hBarThickness = Math.round(detVar*.02);
createLineShape(curItem, "Horizontal Bar", [[0, hBarThickness / 2], [hBarLength, hBarThickness / 2]], hBarThickness);

var background1LayerWidth = hBarLength/2;       //Layer Width
var background1LayerHeight = hBarThickness/2;     //Layer Height

//Define Anchor Position
var anchorPX =0;
var anchorPY = background1LayerHeight; 

//Define Current Position and Current Anchor Point
var curPositionX = curItem.selectedLayers[0].position.value[0] ;
var curPositionY = curItem.selectedLayers[0].position.value[1];
var curAPX = curItem.selectedLayers[0].anchorPoint.value[0];
var curAPY = curItem.selectedLayers[0].anchorPoint.value[1];

//Define Amount to move 
var moveX = curAPX - anchorPX; 
var moveY = curAPY - anchorPY;

//Actions
curItem.selectedLayers[0].anchorPoint.setValue([anchorPX,anchorPY]);
curItem.selectedLayers[0].position.setValue([curPositionX - moveX, curPositionY - moveY]); 

//Move to the side
var curPositionX = curItem.selectedLayers[0].position.value[0];
var curPositionY = curItem.selectedLayers[0].position.value[1];

curItem.selectedLayers[0].position.setValue([0, (Math.round((totalBars/7)*curItem.height))*.992]);

if (totalBars > 7) {
    curItem.selectedLayers[0].position.setValue([curItem.layer(2).position.value[0], curItem.layer(2).position.value[1]]);
    }

if (totalBars <= 7 ) {
    //Center All Objects
    for(x = 1; x <= totalBars; x++) {
            curItem.layer((x*3)+2).parent = curItem.layer(1);
            }

    var centerYone = curItem.layer(1).position.value[0];
    var centerYtwo = curItem.layer(2).position.value[0];

    curItem.layer(1).position.setValue([centerYone, (curItem.height/2)+((curItem.height*.0708)*totalBars)]);
    curItem.layer(2).position.setValue([centerYtwo, (curItem.height/2)+((curItem.height*.0708)*totalBars)]);

    for(x = 1; x <= totalBars; x++) {
         curItem.layer((x*3)+2).parent = curItem.layer((totalBars*3)+3);   
         }
     
     //Parent Bars
    curItem.layer(1).parent = curItem.layer((totalBars*3)+3);
    curItem.layer(2).parent = curItem.layer((totalBars*3)+3);
  }



//Create Background
curItem.layers.addSolid([0,0,0],"Back Plate", curItem.width, Math.round((totalBars/BGdivider) * curItem.height), pxlAsp );
curItem.selectedLayers[0].opacity.setValue([15]);

if (totalBars > 7 ){
    //Anchor Point and Position
    curItem.selectedLayers[0].anchorPoint.setValue([0,curItem.selectedLayers[0].height]);
    curItem.selectedLayers[0].position.setValue([curItem.layer(3).position.value[0], curItem.layer(3).position.value[1]]);
    
    //Parent Bars
    curItem.layer(2).parent = curItem.layer((totalBars*3)+4);
    curItem.layer(3).parent = curItem.layer((totalBars*3)+4);
}

//Parent to Master Null
curItem.selectedLayers[0].parent = curItem.layer((totalBars*3)+4);

//Create Grid
curItem.selectedLayers[0].moveAfter(curItem.layer((totalBars*3)+4));
curItem.selectedLayers[0].duplicate();
curItem.selectedLayers[0].Effects.addProperty("Grid");

if (labelCheck == true) {
        for (x = 1; x <= totalBars; x++) {
            
                //Label
                var label = pLabels[x - 1];
                
                //Main Text Layer
                curItem.layers.addText(label);  
                curItem.layer(1).label = 4;
                curItem.layer(1).parent = curItem.layer(((totalBars*3)+3)+x);

                //Text modifiers
                var centerNum= app.project.activeItem.selectedLayers[0].property("ADBE Text Properties").property("ADBE Text Document");
                var centerDoc = centerNum.value;
                centerDoc.resetCharStyle();
                centerDoc.resetParagraphStyle();
                centerDoc.fillColor = [1,1,1];
                centerDoc.justification = ParagraphJustification.RIGHT_JUSTIFY;
                centerDoc.font = "Arial-BoldMT";
                centerDoc.fontSize = detVar*.03996;
                centerNum.setValue(centerDoc);
                
                //Establish Variables for movement
                var labScaleAmount = Math.round(detVar*.04629);
                curItem.layer(1).position.expression = "[thisComp.layer(\"Bar "+ x +"\").transform.position[0]-" + labScaleAmount + "\,thisComp.layer(\"Bar "+ x +"\").transform.position[1]+(thisComp.height*.009)]"
                
                }    
            
         var vertBarDet = 3+totalBars;
            
        //Max Line Label
        curItem.layers.addText(maxLine);

        //Text Attributes
        var centerNum= app.project.activeItem.selectedLayers[0].property("ADBE Text Properties").property("ADBE Text Document");
        var centerDoc = centerNum.value;
        centerDoc.resetCharStyle();
        centerDoc.resetParagraphStyle();
        centerDoc.fillColor = [1,1,1];
        centerDoc.justification = ParagraphJustification.CENTER_JUSTIFY;
        centerDoc.font = "Arial-BoldMT";
        centerDoc.fontSize = detVar*.03996;
        centerNum.setValue(centerDoc);

        //Place in the correct area
        curItem.layer(1).position.setValue([curItem.width,(detVar*.01)]);
        curItem.layer(1).position.expression = "[transform.position[0],thisComp.layer(\"Horizontal Bar\").transform.position[1]-((thisComp.height*.05)*-1)]"
        curItem.layer(1).label = 14;
        curItem.layer(1).parent = curItem.layer(((totalBars*3)+vertBarDet+1));

        //Min Line Label
        curItem.layers.addText(minLine);

        //Text Attributes
        var centerNum= app.project.activeItem.selectedLayers[0].property("ADBE Text Properties").property("ADBE Text Document");
        var centerDoc = centerNum.value;
        centerDoc.resetCharStyle();
        centerDoc.resetParagraphStyle();
        centerDoc.fillColor = [1,1,1];
        centerDoc.justification = ParagraphJustification.CENTER_JUSTIFY;
        centerDoc.font = "Arial-BoldMT";
        centerDoc.fontSize = detVar*.03996;
        centerNum.setValue(centerDoc);

        //Place in the correct area
        curItem.layer(1).position.setValue([0,(detVar*.99)]);
        curItem.layer(1).position.expression = "[transform.position[0],thisComp.layer(\"Horizontal Bar\").transform.position[1]-((thisComp.height*.05)*-1)]"
        curItem.layer(1).label = 14;
        curItem.layer(1).parent = curItem.layer(((totalBars*3)+vertBarDet+2));
   
   }



//////////////CLEAN UP//////////////////////////

//Move Master Control to the Top of the Stacking Order
if (labelCheck == true) {
        curItem.layer((totalBars*4)+5).moveToBeginning();
    } else {
        curItem.layer((totalBars*3)+3).moveToBeginning();
    }

//Establish Scale Amount
if (totalBars <= 7) {
    var cleanScaleAmount = 80;
} else if (totalBars == 8 || totalBars == 9) {
    var cleanScaleAmount = 70;
} else if (totalBars ==10 || totalBars == 11){
    var cleanScaleAmount = 60;
} else {
    var cleanScaleAmount = 53;
}

//Scale All down and Change color
curItem.layer(1).scale.setValue([cleanScaleAmount,cleanScaleAmount,cleanScaleAmount]);
curItem.layer(1).label = 2;

//Amount to move
if (totalBars > 7) {
    
    if (totalBars == 8) {
        var amountFix = .5;
   } else if (totalBars == 9) {
        var amountFix = .46;
   } else if (totalBars == 10) {
       var amountFix = .43;
   } else if (totalBars == 11) {
       var amountFix = .39;
   } else if (totalBars == 12) {
       var amountFix = .35;
   }
       
    var yEndMove = amountFix*curItem.height;
    curItem.layer(1).position.setValue([curItem.layer(1).position.value[0], yEndMove]);
    
    }

//Remove Unwanted Items
removeArray = [];

//Push all unwanted layers to the remove Array
if(labelCheck == false) {
    if (textCheck == false) {
        for(x = 5; x < (totalBars*3)+3; x +=3) {
            removeArray.push(curItem.layer(x));
            }
        }

     if (perCheck == false) {
        for(x = 4; x < (totalBars*3) + 3; x += 3) {
            removeArray.push(curItem.layer(x));
            }
        }
    } else {
        if (textCheck == false) {
            for(x = 7+totalBars; x < ((totalBars*3)+totalBars)+5; x +=3) {
                removeArray.push(curItem.layer(x));
                }
            }

         if (perCheck == false) {
            for(x = 6+totalBars; x < ((totalBars*3)+totalBars) + 5; x += 3) {
                removeArray.push(curItem.layer(x));
                }
            }       
    }

//Delete all Layers in the Remove Array
for (x = 0; x < removeArray.length; x++) {
        removeArray[x].remove();
    }

//Pre Compose
var precomposeArray = [];

if (labelCheck == false) {
    if (perCheck == true && textCheck == true) {
        var precompFinalAmount = 5+(totalBars*3);
    } else if (textCheck == true) {
        var precompFinalAmount = 5+(totalBars*2);
    } else {
        var precompFinalAmount = 5+totalBars;
    }
} else {
    if (perCheck == true && textCheck == true) {
        var precompFinalAmount = 7+(totalBars*4);
    } else if (textCheck == true) {
        var precompFinalAmount = 7+(totalBars*3);
    } else {
        var precompFinalAmount = 7+(totalBars*2);
    }
}

for (var i = 1; i <= precompFinalAmount; i++) {
   precomposeArray.push(i);
   }

var vertBuiltComp = curItem.layers.precompose(precomposeArray, "Vertical Bar Graph", true);
stripTempExtras(vertBuiltComp);

//Move to Correct Time Period
var timeSetTo = (2.5+((totalBars-1)/2))+1;
app.project.activeItem.time = timeSetTo;

//End Undo Group
app.endUndoGroup();

//**********************************************************/
//////////////////FUNCTIONS/////////////////////////

function vBarMaker(spacingAmount) {
    
        //Create the Bar
        var barWidth = Math.round(detVar*.10);
        var barHeight = curItem.width;
        createBarShape(curItem, "Bar", barWidth, barHeight, spacingAmount);
        curItem.layer(1).label = 6;

        var barLayerWidth = barWidth/2;       //Layer Width
        var barLayerHeight = barHeight/2;     //Layer Height

        //Define Anchor Position
        var anchorPX = barLayerWidth;
        var anchorPY = barLayerHeight*2;

        //Define Current Position and Current Anchor Point
        var curPositionX = curItem.layer(1).position.value[0] ;
        var curPositionY = curItem.layer(1).position.value[1];
        var curAPX = curItem.layer(1).anchorPoint.value[0];
        var curAPY = curItem.layer(1).anchorPoint.value[1];

        //Define Amount to move 
        var moveX = curAPX - anchorPX; 
        var moveY = curAPY - anchorPY;

        //Actions
        curItem.layer(1).anchorPoint.setValue([anchorPX,anchorPY]);
        curItem.layer(1).position.setValue([curPositionX - moveX, curPositionY - moveY]); 
        
        curItem.layer(1).rotation.setValue(90);
        curItem.layer(1).position.setValue([0,detVar/2]);
        
       
        /////////CREATE TEXT/////////
    
        //Main Text Layer
        curItem.layers.addText("Value");  
        
        if (totalBars <= 7) {
            var mainTextSize=detVar*.11296*0.6;
            var perTextSize=detVar*.0540*0.6;
            var perMoveMod = .115;
            } else {
            var mainTextSize=detVar*.08996*0.6;
            var perTextSize=detVar*.0380*0.6;
            var perMoveMod = .083;
            }

        //Main Text Re-figure
        var centerNum= app.project.activeItem.selectedLayers[0].property("ADBE Text Properties").property("ADBE Text Document");
        var centerDoc = centerNum.value;
        centerDoc.resetCharStyle();
        centerDoc.resetParagraphStyle();
        centerDoc.fillColor = [1,1,1];
        centerDoc.justification = ParagraphJustification.LEFT_JUSTIFY;
        centerDoc.font = "Arial-BoldMT";
        centerDoc.fontSize = mainTextSize;
        centerNum.setValue(centerDoc);

        //Main Text Re-Position
        curItem.selectedLayers[0].position.setValue([((curItem.width/2)-((curItem.width/2)*.0001))+((curItem.width*.015)*-1),detVar/2]);

        //% Text Layer
        curItem.layers.addText("%");

        //% Text Re-figure
        var perNum= app.project.activeItem.selectedLayers[0].property("ADBE Text Properties").property("ADBE Text Document");
        var perDoc = perNum.value;
        perDoc.resetCharStyle();
        perDoc.resetParagraphStyle();
        perDoc.fillColor = [1,1,1];
        perDoc.justification = ParagraphJustification.LEFT_JUSTIFY;
        perDoc.font = "Arial-BoldMT";
        perDoc.fontSize = perTextSize;
        perNum.setValue(perDoc);

        //% Text Re-Position
        curItem.selectedLayers[0].position.setValue([(curItem.width/2)+((curItem.width/2)*perMoveMod),(detVar/2)-((detVar/2)*.06974)]);
        
        //Add Opacity Animation to Text and %
        curItem.layer(1).opacity.setValueAtTime(.8+((spacingAmount-1)/2),0);
        curItem.layer(1).opacity.setValueAtTime(1.5+((spacingAmount-1)/2),100);

        curItem.layer(2).opacity.setValueAtTime(.8+((spacingAmount-1)/2),0);
        curItem.layer(2).opacity.setValueAtTime(1.5+((spacingAmount-1)/2),100);

        //Create Null and Parent All Items
        curItem.layers.addNull();
        curItem.layer(2).parent = curItem.layer(1);
        curItem.layer(3).parent = curItem.layer(1);
        curItem.layer(4).parent = curItem.layer(1);

        //Move Null to the Left of the screen.
        if (totalBars < 7) {
            curItem.layer(1).position.setValue([curItem.width/2, ((curItem.height*.133)*spacingAmount) - (curItem.height*.05),]);
        } else {
            curItem.layer(1).position.setValue([curItem.width/2, ((curItem.height*.133)*(spacingAmount*.88)) - (curItem.height*.05),]);
        }

        //Delete Null
        curItem.layer(1).remove();

}
}