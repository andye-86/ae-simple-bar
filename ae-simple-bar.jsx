{
function myScript(thisObj) {
          function myScript_buildUI(thisObj) {
                    var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "My Panel Name", [0, 0, 300, 300]);
 
                    res = "group{orientation:'row',\
                        myPanelAlpha: Group{orientation:'column',\
                            groupZero: Panel {orientation:'row', size: [276, 46], alignChildren:['center', 'center'] ,\
                                    horizontalRadioButton: RadioButton{text:'Bars on X-Axis'},\
                                    verticalRadioButton: RadioButton{text:'Bars on Y-Axis'},\
                                    },\
                            groupOne: Group{orientation:'column',\
                                    initialTitle: StaticText{text:'Number of Bars'},\
                                    myDropDownList: DropDownList{properties:{items:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']} size: [276,20]},\
                                    },\
                           groupOneB: Panel {orientation:'column',\
                                  minMaxTitle: StaticText {text:'Define your Min and Max for the Scale'},\
                                  panelTwoA: Group{orientation:'row', size: [244, 46], alignChildren:['center', 'center'],\
                                        minText: StaticText {text:'Min'},\
                                        minField: EditText{text:'0', characters:5},\
                                        maxText: StaticText {text:'Max'},\
                                        maxField: EditText{text:'100', characters:5},\
                                  },\
                                  },\
                            groupTwo: Group{orientation:'row',\
                                    barCheckbox: Checkbox {text:'Bar Value Labels'},\
                                    perCheckbox: Checkbox {text: '% Labels'},\
                                    axisCheckbox: Checkbox {text:'Axis Labels'},\
                                    },\
                            groupDiv1: Group{orientation:'row' ,\
                                    myDivPanelA:Panel{size:[276,2]},\
                                    },\
                            groupThree: Group{orientation:'row',\
                                groupSubOne: Group {orientation:'row',\
                                    myhorButton:Button{text:'Bar Graph', size: [140,20]},\
                                    },\
                                groupSubTwo: Group {orientation:'row',\
                                    myQuestionButton:Button{text:'?', size:[30,20]},\
                                    },\
                          },\
                     },\
               }";
          
            myPanel.grp = myPanel.add(res);
            
            //PanelVar
            var panelOver = myPanel.grp.myPanelAlpha;
            var checkBoxVal = panelOver.groupTwo;
            
            // DropDownList default selection
            panelOver.groupOne.myDropDownList.selection = 0; //Item index starts at 0
            panelOver.groupZero.horizontalRadioButton.value = true;
            
            //Actions - GROUP 1
            panelOver.groupThree.groupSubOne.myhorButton.onClick = function b1Auto() {
                if(panelOver.groupZero.horizontalRadioButton.value == true) {
                    if(checkBoxVal.perCheckbox.value == true && checkBoxVal.barCheckbox.value == false) {
                           alert("You cannot have Percentage (%) Labels without Bar Value Labels. Please enable Bar Value Labels or disable Percentage (%) Labels.");
                        } else {
                                var curItem = app.project.activeItem;
                                // check if comp is selected
                                if (curItem == null || !(curItem instanceof CompItem)){
                                    // if no comp selected, display an alert
                                    alert("Please select a comp as the active item and try again.");
                                } else{
                                    horBarGraph(Number(panelOver.groupOne.myDropDownList.selection.text),Number(panelOver.groupOneB.panelTwoA.minField.text),Number(panelOver.groupOneB.panelTwoA.maxField.text),checkBoxVal.barCheckbox.value,checkBoxVal.perCheckbox.value,checkBoxVal.axisCheckbox.value);
                                }
                            }
                        } 
                if(panelOver.groupZero.verticalRadioButton.value == true) {
                    if(checkBoxVal.perCheckbox.value == true && checkBoxVal.barCheckbox.value == false) {
                           alert("You cannot have Percentage (%) Labels without Bar Value Labels. Please enable Bar Value Labels or disable Percentage (%) Labels.");
                        } else {                    
                          var curItem = app.project.activeItem;
                                // check if comp is selected
                                if (curItem == null || !(curItem instanceof CompItem)){
                                    // if no comp selected, display an alert
                                    alert("Please select a comp as the active item and try again.");
                                } else{
                                    vertBarGraph(Number(panelOver.groupOne.myDropDownList.selection.text),Number(panelOver.groupOneB.panelTwoA.minField.text),Number(panelOver.groupOneB.panelTwoA.maxField.text),checkBoxVal.barCheckbox.value,checkBoxVal.perCheckbox.value,checkBoxVal.axisCheckbox.value);
                                }
                    }
                }
            }
        
            //Help Button
            panelOver.groupThree.groupSubTwo.myQuestionButton.onClick = function helpPanel() {
                var g = new Window("dialog", "Simple Bar Help", undefined, {resizable:false});
                var globalPanel = g.add("group");
                globalPanel.orientation = "column";
                    var helpPanel = globalPanel.add("panel");
                        helpPanel.size = [380,380];
                        helpPanel.alignChildren = "left";
                        var ring1 = helpPanel.add("statictext", undefined ,"Bars on X-Axis or Y-Axis", {multiline: true});
                        ring1.graphics.font = ScriptUI.newFont ("dialog", "Bold", 12);
                        var ring2 = helpPanel.add("statictext", undefined ,"You have the option to run the bars across the X-Axis or down the side of the Y-Axis. All features work either way.", {multiline: true});
                        ring2.preferredSize = [340,70];
                        var divider1 = helpPanel.add("panel");
                        divider1.size = [340,2];
                        var ring3 = helpPanel.add("statictext", undefined ,"Slice Labels:", {multiline: true});
                        ring3.graphics.font = ScriptUI.newFont ("dialog", "Bold", 12);
                        var ring4 = helpPanel.add("statictext", undefined ,"Selecting this option will place the numerical values for each slice next their corresponding pie slice.", {multiline: true});
                        ring4.preferredSize = [340,34];
                        var ring5 = helpPanel.add("statictext", undefined ,"Include Key:", {multiline: true});
                        ring5.graphics.font = ScriptUI.newFont ("dialog", "Bold", 12);
                        var ring6 = helpPanel.add("statictext", undefined ,"Selecting this option will generate a key to the right of the graph.  An additional dialog box will prompt you to enter the label for each box in the key.", {multiline: true});
                        ring6.preferredSize = [340,40];
                    var ring7 = globalPanel.add("statictext", undefined, "Version .9 - Copyright 2017");
               
               //Close Button
               var closeButton = g.add("button", undefined, "Close");
                
                closeButton.onClick = function() {
                    g.close();
                    }
                
                g.show();
            } //End Help Panel Code
 
            //Setup panel sizing and make panel resizable
            myPanel.layout.layout(true);
            myPanel.grp.minimumSize = myPanel.grp.size;
            myPanel.layout.resize();
            myPanel.onResizing = myPanel.onResize = function () {this.layout.resize();}

            return myPanel;
          }
 
 
          var myScriptPal = myScript_buildUI(thisObj);
 
 
          if ((myScriptPal != null) && (myScriptPal instanceof Window)) {
                    myScriptPal.center();
                    myScriptPal.show();
                    }
          }
 
 
          myScript(this);
}


//////////////////////////////////////////////////////////////////////////////////////////
//Shared Helpers (used by both the Horizontal and Vertical graph makers)

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
function createBarShape(name, width, height, colorIndex) {
    var shapeLayer = curItem.layers.addShape();
    shapeLayer.name = name;

    var baseGroup = shapeLayer.property("Contents").addProperty("ADBE Vector Group");
    baseGroup.name = "Bar Group";

    var pathGroup = shapeLayer.property("Contents").property("Bar Group").property("Contents").addProperty("ADBE Vector Shape - Rect");
    pathGroup.name = "Bar Path";
    pathGroup.property("Size").setValue([width, height]);
    pathGroup.property("Position").setValue([width / 2, height / 2]);

    var fillGroup = shapeLayer.property("Contents").property("Bar Group").property("Contents").addProperty("ADBE Vector Graphic - Fill");
    fillGroup.property("Color").expression = "thisComp.layer(\"MASTER CONTROL\").effect(\"Bar Color " + colorIndex + "\")(\"Color\")";

    return shapeLayer;
}


//////////////////////////////////////////////////////////////////////////////////////////
//Horizontal Graph Maker
function horBarGraph(pTotalBars, pMinText, pMaxText, pBarLabel, pPerLabel, pAxisLabel) {

alert("DEBUG: horBarGraph started, pTotalBars=" + pTotalBars);

//Set Up
var scriptName = "Horizontal Bar Graph";
var curItem = app.project.activeItem;
var detVar = curItem.height;
var pxlAsp = curItem.pixelAspect;

var checkEx;

var cancelCheck = false;

//Value Holding Amounts
var master1 = 75;
var master2 = 80;
var master3 = 40;
var master4 = 50;
var master5 = 90;
var master6 = 10;
var master7 = 23;
var master8 = 70;
var master9 = 60;
var master10 = 30;
var master11 = 45;
var master12 = 35;

var totalBars = pTotalBars;

var barLabel1 = "January";
var barLabel2 = "February";
var barLabel3 = "March";
var barLabel4 = "April";
var barLabel5 = "May";
var barLabel6 = "June";
var barLabel7 = "July";
var barLabel8 = "August";
var barLabel9 = "September";
var barLabel10 = "October";
var barLabel11 = "November";
var barLabel12 = "December";

//Determine Max and Min Amounts
var maxLine = pMaxText;
var minLine = pMinText;
var maxMinDifference = (100/(maxLine - minLine))*.01;
var minMaxMiddle = (maxLine+minLine)/2;

var perCheck = pPerLabel;
var textCheck = pBarLabel;
var labelCheck = pAxisLabel;

/////////////////SECONDARY UI CONSTRUCTION//////////////
//Initial UI Construction
var masterUI = new Window("dialog");
var headTitle = masterUI.add("statictext", undefined, "Bar Graph Data");

var sliderPanel = masterUI.add("group");

if (totalBars == 1) {
    var sliderPanelGroup1 = sliderPanel.add("panel");
    var subtitle1 = sliderPanelGroup1.add("statictext", undefined, "Value 1");
    var slider1Group = sliderPanelGroup1.add("group");

    var slider1= slider1Group.add("slider", undefined, maxLine, minLine, maxLine);
    
    slider1.value= minMaxMiddle;
    slider1.size = "width: 200, height: 18";
    
    var sliderVal1 = slider1Group.add("edittext", undefined, slider1.value);
    
    sliderVal1.characters = 5;
   
    sliderPanelGroup1.orientation = "column";
    slider1Group.orientation = "row";
   
    slider1.onChanging = function() {var val1 = Math.round(slider1.value); sliderVal1.text = val1; }
    sliderVal1.onChanging = function() {var val1 = Math.round(sliderVal1.text); slider1.value = val1; }
    
    sliderPanel.orientation = "row";
    
    //Buttons
    var buttonGroup = masterUI.add("group");
    var alrightButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    buttonGroup.orientation = "row";
    
    //Set Text as defined in UI
    alrightButton.onClick = function() {
            master1 = Math.round(slider1.value);
            masterUI.close();
            }
     cancelButton.onClick = function() {
            cancelCheck = true;      
            masterUI.close();
            }
        
     masterUI.show();
} else if (totalBars  == 2) {
    var sliderPanelGroup1 = sliderPanel.add("panel");
    var subtitle1 = sliderPanelGroup1.add("statictext", undefined, "Value 1");
    var slider1Group = sliderPanelGroup1.add("group");
    var subtitle2 = sliderPanelGroup1.add("statictext", undefined, "Value 2");
    var slider2Group = sliderPanelGroup1.add("group");

    var slider1= slider1Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider2= slider2Group.add("slider", undefined, maxLine, minLine, maxLine);
    
    slider1.value= minMaxMiddle;
    slider2.value= minMaxMiddle;
    slider1.size = "width: 200, height: 18";
    slider2.size = "width: 200, height: 18";
    
    var sliderVal1 = slider1Group.add("edittext", undefined, slider1.value);
    var sliderVal2 = slider2Group.add("edittext", undefined, slider2.value);
    
    sliderVal1.characters = 5;
    sliderVal2.characters = 5;
    
    sliderPanelGroup1.orientation = "column";
    slider1Group.orientation = "row";
    slider2Group.orientation = "row";
   
    slider1.onChanging = function() {var val1 = Math.round(slider1.value); sliderVal1.text = val1; }
    sliderVal1.onChanging = function() {var val1 = Math.round(sliderVal1.text); slider1.value = val1; }
    slider2.onChanging = function() {var val2 = Math.round(slider2.value); sliderVal2.text = val2; }    
    sliderVal2.onChanging = function() {var val2 = Math.round(sliderVal2.text); slider2.value = val2; }
    
    sliderPanel.orientation = "row";
    
    //Buttons
    var buttonGroup = masterUI.add("group");
    var alrightButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    buttonGroup.orientation = "row";
    
    //Set Text as defined in UI
    alrightButton.onClick = function() {
            master1 = Math.round(slider1.value);
            master2 = Math.round(slider2.value);
            masterUI.close();
            }
     cancelButton.onClick = function() {
            cancelCheck = true;      
            masterUI.close();
            }
        
     masterUI.show();
} else if (totalBars  == 3) {
    var sliderPanelGroup1 = sliderPanel.add("panel");
    var subtitle1 = sliderPanelGroup1.add("statictext", undefined, "Value 1");
    var slider1Group = sliderPanelGroup1.add("group");
    var subtitle2 = sliderPanelGroup1.add("statictext", undefined, "Value 2");
    var slider2Group = sliderPanelGroup1.add("group");
    var subtitle3 = sliderPanelGroup1.add("statictext", undefined, "Value 3");
    var slider3Group = sliderPanelGroup1.add("group");

    var slider1= slider1Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider2= slider2Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider3= slider3Group.add("slider", undefined, maxLine, minLine, maxLine);
    
    slider1.value= minMaxMiddle;
    slider2.value= minMaxMiddle;
    slider3.value= minMaxMiddle;
    slider1.size = "width: 200, height: 18";
    slider2.size = "width: 200, height: 18";
    slider3.size = "width: 200, height: 18";
    
    var sliderVal1 = slider1Group.add("edittext", undefined, slider1.value);
    var sliderVal2 = slider2Group.add("edittext", undefined, slider2.value);
    var sliderVal3 = slider3Group.add("edittext", undefined, slider3.value);
    
    sliderVal1.characters = 5;
    sliderVal2.characters = 5;
    sliderVal3.characters = 5;
    
    sliderPanelGroup1.orientation = "column";
    slider1Group.orientation = "row";
    slider2Group.orientation = "row";
    slider3Group.orientation = "row";
   
    slider1.onChanging = function() {var val1 = Math.round(slider1.value); sliderVal1.text = val1; }
    sliderVal1.onChanging = function() {var val1 = Math.round(sliderVal1.text); slider1.value = val1; }
    slider2.onChanging = function() {var val2 = Math.round(slider2.value); sliderVal2.text = val2; }    
    sliderVal2.onChanging = function() {var val2 = Math.round(sliderVal2.text); slider2.value = val2; }
    slider3.onChanging = function() {var val3 = Math.round(slider3.value); sliderVal3.text = val3; }
    sliderVal3.onChanging = function() {var val3 = Math.round(sliderVal3.text); slider3.value = val3; }
    
    sliderPanel.orientation = "row";
    
    //Buttons
    var buttonGroup = masterUI.add("group");
    var alrightButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    buttonGroup.orientation = "row";
    
    //Set Text as defined in UI
    alrightButton.onClick = function() {
            master1 = Math.round(slider1.value);
            master2 = Math.round(slider2.value);
            master3 = Math.round(slider3.value);
            masterUI.close();
            }
     cancelButton.onClick = function() {
            cancelCheck = true;      
            masterUI.close();
            }
        
     masterUI.show();
} else if (totalBars  == 4) {
    var sliderPanelGroup1 = sliderPanel.add("panel");
    var subtitle1 = sliderPanelGroup1.add("statictext", undefined, "Value 1");
    var slider1Group = sliderPanelGroup1.add("group");
    var subtitle2 = sliderPanelGroup1.add("statictext", undefined, "Value 2");
    var slider2Group = sliderPanelGroup1.add("group");
    var subtitle3 = sliderPanelGroup1.add("statictext", undefined, "Value 3");
    var slider3Group = sliderPanelGroup1.add("group");
    var subtitle4 = sliderPanelGroup1.add("statictext", undefined, "Value 4");
    var slider4Group = sliderPanelGroup1.add("group");

    var slider1= slider1Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider2= slider2Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider3= slider3Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider4= slider4Group.add("slider", undefined, maxLine, minLine, maxLine);
    
    slider1.value= minMaxMiddle;
    slider2.value= minMaxMiddle;
    slider3.value= minMaxMiddle;
    slider4.value= minMaxMiddle;
    slider1.size = "width: 200, height: 18";
    slider2.size = "width: 200, height: 18";
    slider3.size = "width: 200, height: 18";
    slider4.size = "width: 200, height: 18";
    
    var sliderVal1 = slider1Group.add("edittext", undefined, slider1.value);
    var sliderVal2 = slider2Group.add("edittext", undefined, slider2.value);
    var sliderVal3 = slider3Group.add("edittext", undefined, slider3.value);
    var sliderVal4 = slider4Group.add("edittext", undefined, slider4.value);
    
    sliderVal1.characters = 5;
    sliderVal2.characters = 5;
    sliderVal3.characters = 5;
    sliderVal4.characters = 5;
    
    sliderPanelGroup1.orientation = "column";
    slider1Group.orientation = "row";
    slider2Group.orientation = "row";
    slider3Group.orientation = "row";
    slider4Group.orientation = "row";
   
    slider1.onChanging = function() {var val1 = Math.round(slider1.value); sliderVal1.text = val1; }
    sliderVal1.onChanging = function() {var val1 = Math.round(sliderVal1.text); slider1.value = val1; }
    slider2.onChanging = function() {var val2 = Math.round(slider2.value); sliderVal2.text = val2; }    
    sliderVal2.onChanging = function() {var val2 = Math.round(sliderVal2.text); slider2.value = val2; }
    slider3.onChanging = function() {var val3 = Math.round(slider3.value); sliderVal3.text = val3; }
    sliderVal3.onChanging = function() {var val3 = Math.round(sliderVal3.text); slider3.value = val3; }
    slider4.onChanging = function() {var val4 = Math.round(slider4.value); sliderVal4.text = val4; }
    sliderVal4.onChanging = function() {var val4 = Math.round(sliderVal4.text); slider4.value = val4; }
    
    sliderPanel.orientation = "row";
    
    //Buttons
    var buttonGroup = masterUI.add("group");
    var alrightButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    buttonGroup.orientation = "row";
    
    //Set Text as defined in UI
    alrightButton.onClick = function() {
            master1 = Math.round(slider1.value);
            master2 = Math.round(slider2.value);
            master3 = Math.round(slider3.value);
            master4 = Math.round(slider4.value);            
            masterUI.close();
            }
     cancelButton.onClick = function() {
            cancelCheck = true;      
            masterUI.close();
            }
        
     masterUI.show();
} else if (totalBars == 5) {
    var sliderPanelGroup1 = sliderPanel.add("panel");
    var subtitle1 = sliderPanelGroup1.add("statictext", undefined, "Value 1");
    var slider1Group = sliderPanelGroup1.add("group");
    var subtitle2 = sliderPanelGroup1.add("statictext", undefined, "Value 2");
    var slider2Group = sliderPanelGroup1.add("group");
    var subtitle3 = sliderPanelGroup1.add("statictext", undefined, "Value 3");
    var slider3Group = sliderPanelGroup1.add("group");
    var subtitle4 = sliderPanelGroup1.add("statictext", undefined, "Value 4");
    var slider4Group = sliderPanelGroup1.add("group");
    var subtitle5 = sliderPanelGroup1.add("statictext", undefined, "Value 5");
    var slider5Group = sliderPanelGroup1.add("group");

    var slider1= slider1Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider2= slider2Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider3= slider3Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider4= slider4Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider5= slider5Group.add("slider", undefined, maxLine, minLine, maxLine);
    
    slider1.value= minMaxMiddle;
    slider2.value= minMaxMiddle;
    slider3.value= minMaxMiddle;
    slider4.value= minMaxMiddle;
    slider5.value= minMaxMiddle;
    slider1.size = "width: 200, height: 18";
    slider2.size = "width: 200, height: 18";
    slider3.size = "width: 200, height: 18";
    slider4.size = "width: 200, height: 18";
    slider5.size = "width: 200, height: 18";
    
    var sliderVal1 = slider1Group.add("edittext", undefined, slider1.value);
    var sliderVal2 = slider2Group.add("edittext", undefined, slider2.value);
    var sliderVal3 = slider3Group.add("edittext", undefined, slider3.value);
    var sliderVal4 = slider4Group.add("edittext", undefined, slider4.value);
    var sliderVal5 = slider5Group.add("edittext", undefined, slider5.value);
    
    sliderVal1.characters = 5;
    sliderVal2.characters = 5;
    sliderVal3.characters = 5;
    sliderVal4.characters = 5;
    sliderVal5.characters = 5;
    
    sliderPanelGroup1.orientation = "column";
    slider1Group.orientation = "row";
    slider2Group.orientation = "row";
    slider3Group.orientation = "row";
    slider4Group.orientation = "row";
    slider5Group.orientation = "row";
   
    slider1.onChanging = function() {var val1 = Math.round(slider1.value); sliderVal1.text = val1; }
    sliderVal1.onChanging = function() {var val1 = Math.round(sliderVal1.text); slider1.value = val1; }
    slider2.onChanging = function() {var val2 = Math.round(slider2.value); sliderVal2.text = val2; }    
    sliderVal2.onChanging = function() {var val2 = Math.round(sliderVal2.text); slider2.value = val2; }
    slider3.onChanging = function() {var val3 = Math.round(slider3.value); sliderVal3.text = val3; }
    sliderVal3.onChanging = function() {var val3 = Math.round(sliderVal3.text); slider3.value = val3; }
    slider4.onChanging = function() {var val4 = Math.round(slider4.value); sliderVal4.text = val4; }
    sliderVal4.onChanging = function() {var val4 = Math.round(sliderVal4.text); slider4.value = val4; }
    slider5.onChanging = function() {var val5 = Math.round(slider5.value); sliderVal5.text = val5; }
    sliderVal5.onChanging = function() {var val5 = Math.round(sliderVal5.text); slider5.value = val5; }
    
    sliderPanel.orientation = "row";
    
    //Buttons
    var buttonGroup = masterUI.add("group");
    var alrightButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    buttonGroup.orientation = "row";
    
    //Set Text as defined in UI
    alrightButton.onClick = function() {
            master1 = Math.round(slider1.value);
            master2 = Math.round(slider2.value);
            master3 = Math.round(slider3.value);
            master4 = Math.round(slider4.value);            
            master5 = Math.round(slider5.value);                
            masterUI.close();
            }
     cancelButton.onClick = function() {
            cancelCheck = true;      
            masterUI.close();
            }
        
     masterUI.show();
} else if (totalBars == 6) {
    var sliderPanelGroup1 = sliderPanel.add("panel");
    var subtitle1 = sliderPanelGroup1.add("statictext", undefined, "Value 1");
    var slider1Group = sliderPanelGroup1.add("group");
    var subtitle2 = sliderPanelGroup1.add("statictext", undefined, "Value 2");
    var slider2Group = sliderPanelGroup1.add("group");
    var subtitle3 = sliderPanelGroup1.add("statictext", undefined, "Value 3");
    var slider3Group = sliderPanelGroup1.add("group");
    var subtitle4 = sliderPanelGroup1.add("statictext", undefined, "Value 4");
    var slider4Group = sliderPanelGroup1.add("group");
    var subtitle5 = sliderPanelGroup1.add("statictext", undefined, "Value 5");
    var slider5Group = sliderPanelGroup1.add("group");
    var subtitle6 = sliderPanelGroup1.add("statictext", undefined, "Value 6");
    var slider6Group = sliderPanelGroup1.add("group");

    var slider1= slider1Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider2= slider2Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider3= slider3Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider4= slider4Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider5= slider5Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider6= slider6Group.add("slider", undefined, maxLine, minLine, maxLine);
    
    slider1.value= minMaxMiddle;
    slider2.value= minMaxMiddle;
    slider3.value= minMaxMiddle;
    slider4.value= minMaxMiddle;
    slider5.value= minMaxMiddle;
    slider6.value= minMaxMiddle;
    slider1.size = "width: 200, height: 18";
    slider2.size = "width: 200, height: 18";
    slider3.size = "width: 200, height: 18";
    slider4.size = "width: 200, height: 18";
    slider5.size = "width: 200, height: 18";
    slider6.size = "width: 200, height: 18";
    
    var sliderVal1 = slider1Group.add("edittext", undefined, slider1.value);
    var sliderVal2 = slider2Group.add("edittext", undefined, slider2.value);
    var sliderVal3 = slider3Group.add("edittext", undefined, slider3.value);
    var sliderVal4 = slider4Group.add("edittext", undefined, slider4.value);
    var sliderVal5 = slider5Group.add("edittext", undefined, slider5.value);
    var sliderVal6 = slider6Group.add("edittext", undefined, slider6.value);
    
    sliderVal1.characters = 5;
    sliderVal2.characters = 5;
    sliderVal3.characters = 5;
    sliderVal4.characters = 5;
    sliderVal5.characters = 5;
    sliderVal6.characters = 5;
    
    sliderPanelGroup1.orientation = "column";
    slider1Group.orientation = "row";
    slider2Group.orientation = "row";
    slider3Group.orientation = "row";
    slider4Group.orientation = "row";
    slider5Group.orientation = "row";
    slider6Group.orientation = "row";
   
    slider1.onChanging = function() {var val1 = Math.round(slider1.value); sliderVal1.text = val1; }
    sliderVal1.onChanging = function() {var val1 = Math.round(sliderVal1.text); slider1.value = val1; }
    slider2.onChanging = function() {var val2 = Math.round(slider2.value); sliderVal2.text = val2; }    
    sliderVal2.onChanging = function() {var val2 = Math.round(sliderVal2.text); slider2.value = val2; }
    slider3.onChanging = function() {var val3 = Math.round(slider3.value); sliderVal3.text = val3; }
    sliderVal3.onChanging = function() {var val3 = Math.round(sliderVal3.text); slider3.value = val3; }
    slider4.onChanging = function() {var val4 = Math.round(slider4.value); sliderVal4.text = val4; }
    sliderVal4.onChanging = function() {var val4 = Math.round(sliderVal4.text); slider4.value = val4; }
    slider5.onChanging = function() {var val5 = Math.round(slider5.value); sliderVal5.text = val5; }
    sliderVal5.onChanging = function() {var val5 = Math.round(sliderVal5.text); slider5.value = val5; }
    slider6.onChanging = function() {var val6 = Math.round(slider6.value); sliderVal6.text = val6; }
    sliderVal6.onChanging = function() {var val6 = Math.round(sliderVal6.text); slider6.value = val6; }
    
    sliderPanel.orientation = "row";
    
    //Buttons
    var buttonGroup = masterUI.add("group");
    var alrightButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    buttonGroup.orientation = "row";
    
    //Set Text as defined in UI
    alrightButton.onClick = function() {
            master1 = Math.round(slider1.value);
            master2 = Math.round(slider2.value);
            master3 = Math.round(slider3.value);
            master4 = Math.round(slider4.value);            
            master5 = Math.round(slider5.value);                
            master6 = Math.round(slider6.value);            
            masterUI.close();
            }
     cancelButton.onClick = function() {
            cancelCheck = true;      
            masterUI.close();
            }
        
     masterUI.show();
} else if (totalBars == 7) {
    var sliderPanelGroup1 = sliderPanel.add("panel");
    var subtitle1 = sliderPanelGroup1.add("statictext", undefined, "Value 1");
    var slider1Group = sliderPanelGroup1.add("group");
    var subtitle2 = sliderPanelGroup1.add("statictext", undefined, "Value 2");
    var slider2Group = sliderPanelGroup1.add("group");
    var subtitle3 = sliderPanelGroup1.add("statictext", undefined, "Value 3");
    var slider3Group = sliderPanelGroup1.add("group");
    var subtitle4 = sliderPanelGroup1.add("statictext", undefined, "Value 4");
    var slider4Group = sliderPanelGroup1.add("group");
    var subtitle5 = sliderPanelGroup1.add("statictext", undefined, "Value 5");
    var slider5Group = sliderPanelGroup1.add("group");
    var subtitle6 = sliderPanelGroup1.add("statictext", undefined, "Value 6");
    var slider6Group = sliderPanelGroup1.add("group");
    var subtitle7 = sliderPanelGroup1.add("statictext", undefined, "Value 7");
    var slider7Group = sliderPanelGroup1.add("group");

    var slider1= slider1Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider2= slider2Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider3= slider3Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider4= slider4Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider5= slider5Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider6= slider6Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider7= slider7Group.add("slider", undefined, maxLine, minLine, maxLine);
    
    slider1.value= minMaxMiddle;
    slider2.value= minMaxMiddle;
    slider3.value= minMaxMiddle;
    slider4.value= minMaxMiddle;
    slider5.value= minMaxMiddle;
    slider6.value= minMaxMiddle;
    slider7.value= minMaxMiddle;
    slider1.size = "width: 200, height: 18";
    slider2.size = "width: 200, height: 18";
    slider3.size = "width: 200, height: 18";
    slider4.size = "width: 200, height: 18";
    slider5.size = "width: 200, height: 18";
    slider6.size = "width: 200, height: 18";
    slider7.size = "width: 200, height: 18";
    
    var sliderVal1 = slider1Group.add("edittext", undefined, slider1.value);
    var sliderVal2 = slider2Group.add("edittext", undefined, slider2.value);
    var sliderVal3 = slider3Group.add("edittext", undefined, slider3.value);
    var sliderVal4 = slider4Group.add("edittext", undefined, slider4.value);
    var sliderVal5 = slider5Group.add("edittext", undefined, slider5.value);
    var sliderVal6 = slider6Group.add("edittext", undefined, slider6.value);
    var sliderVal7 = slider7Group.add("edittext", undefined, slider7.value);
    
    sliderVal1.characters = 5;
    sliderVal2.characters = 5;
    sliderVal3.characters = 5;
    sliderVal4.characters = 5;
    sliderVal5.characters = 5;
    sliderVal6.characters = 5;
    sliderVal7.characters = 5;
    
    sliderPanelGroup1.orientation = "column";
    slider1Group.orientation = "row";
    slider2Group.orientation = "row";
    slider3Group.orientation = "row";
    slider4Group.orientation = "row";
    slider5Group.orientation = "row";
    slider6Group.orientation = "row";
    slider7Group.orientation = "row";
   
    slider1.onChanging = function() {var val1 = Math.round(slider1.value); sliderVal1.text = val1; }
    sliderVal1.onChanging = function() {var val1 = Math.round(sliderVal1.text); slider1.value = val1; }
    slider2.onChanging = function() {var val2 = Math.round(slider2.value); sliderVal2.text = val2; }    
    sliderVal2.onChanging = function() {var val2 = Math.round(sliderVal2.text); slider2.value = val2; }
    slider3.onChanging = function() {var val3 = Math.round(slider3.value); sliderVal3.text = val3; }
    sliderVal3.onChanging = function() {var val3 = Math.round(sliderVal3.text); slider3.value = val3; }
    slider4.onChanging = function() {var val4 = Math.round(slider4.value); sliderVal4.text = val4; }
    sliderVal4.onChanging = function() {var val4 = Math.round(sliderVal4.text); slider4.value = val4; }
    slider5.onChanging = function() {var val5 = Math.round(slider5.value); sliderVal5.text = val5; }
    sliderVal5.onChanging = function() {var val5 = Math.round(sliderVal5.text); slider5.value = val5; }
    slider6.onChanging = function() {var val6 = Math.round(slider6.value); sliderVal6.text = val6; }
    sliderVal6.onChanging = function() {var val6 = Math.round(sliderVal6.text); slider6.value = val6; }
    slider7.onChanging = function() {var val7 = Math.round(slider7.value); sliderVal7.text = val7; }
    sliderVal7.onChanging = function() {var val7 = Math.round(sliderVal7.text); slider7.value = val7; }
    
    sliderPanel.orientation = "row";
    
    //Buttons
    var buttonGroup = masterUI.add("group");
    var alrightButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    buttonGroup.orientation = "row";
    
    //Set Text as defined in UI
    alrightButton.onClick = function() {
            master1 = Math.round(slider1.value);
            master2 = Math.round(slider2.value);
            master3 = Math.round(slider3.value);
            master4 = Math.round(slider4.value);            
            master5 = Math.round(slider5.value);                
            master6 = Math.round(slider6.value);            
            master7 = Math.round(slider7.value);
            masterUI.close();
            }
     cancelButton.onClick = function() {
            cancelCheck = true;      
            masterUI.close();
            }
        
     masterUI.show();
} else if (totalBars == 8) {
    var dualGroup  = sliderPanel.add("group"); 
    dualGroup.alignChildren = "top";
    
    var sliderPanelGroup1 = dualGroup.add("panel");
    var sliderPanelGroup2 = dualGroup.add("panel");
    
    var subtitle1 = sliderPanelGroup1.add("statictext", undefined, "Value 1");
    var slider1Group = sliderPanelGroup1.add("group");
    var subtitle2 = sliderPanelGroup1.add("statictext", undefined, "Value 2");
    var slider2Group = sliderPanelGroup1.add("group");
    var subtitle3 = sliderPanelGroup1.add("statictext", undefined, "Value 3");
    var slider3Group = sliderPanelGroup1.add("group");
    var subtitle4 = sliderPanelGroup1.add("statictext", undefined, "Value 4");
    var slider4Group = sliderPanelGroup1.add("group");
    var subtitle5 = sliderPanelGroup2.add("statictext", undefined, "Value 5");
    var slider5Group = sliderPanelGroup2.add("group");
    var subtitle6 = sliderPanelGroup2.add("statictext", undefined, "Value 6");
    var slider6Group = sliderPanelGroup2.add("group");
    var subtitle7 = sliderPanelGroup2.add("statictext", undefined, "Value 7");
    var slider7Group = sliderPanelGroup2.add("group");
    var subtitle8 = sliderPanelGroup2.add("statictext", undefined, "Value 8");
    var slider8Group = sliderPanelGroup2.add("group");

    var slider1= slider1Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider2= slider2Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider3= slider3Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider4= slider4Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider5= slider5Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider6= slider6Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider7= slider7Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider8= slider8Group.add("slider", undefined, maxLine, minLine, maxLine);
    
    slider1.value= minMaxMiddle;
    slider2.value= minMaxMiddle;
    slider3.value= minMaxMiddle;
    slider4.value= minMaxMiddle;
    slider5.value= minMaxMiddle;
    slider6.value= minMaxMiddle;
    slider7.value= minMaxMiddle;
    slider8.value= minMaxMiddle;
    slider1.size = "width: 200, height: 18";
    slider2.size = "width: 200, height: 18";
    slider3.size = "width: 200, height: 18";
    slider4.size = "width: 200, height: 18";
    slider5.size = "width: 200, height: 18";
    slider6.size = "width: 200, height: 18";
    slider7.size = "width: 200, height: 18";
    slider8.size = "width: 200, height: 18";
    
    var sliderVal1 = slider1Group.add("edittext", undefined, slider1.value);
    var sliderVal2 = slider2Group.add("edittext", undefined, slider2.value);
    var sliderVal3 = slider3Group.add("edittext", undefined, slider3.value);
    var sliderVal4 = slider4Group.add("edittext", undefined, slider4.value);
    var sliderVal5 = slider5Group.add("edittext", undefined, slider5.value);
    var sliderVal6 = slider6Group.add("edittext", undefined, slider6.value);
    var sliderVal7 = slider7Group.add("edittext", undefined, slider7.value);
    var sliderVal8 = slider8Group.add("edittext", undefined, slider8.value);
    
    sliderVal1.characters = 5;
    sliderVal2.characters = 5;
    sliderVal3.characters = 5;
    sliderVal4.characters = 5;
    sliderVal5.characters = 5;
    sliderVal6.characters = 5;
    sliderVal7.characters = 5;
    sliderVal8.characters = 5;
    
    dualGroup.orientation = "row";
    sliderPanelGroup1.orientation = "column";
    sliderPanelGroup2.orientation = "column";
    
    slider1Group.orientation = "row";
    slider2Group.orientation = "row";
    slider3Group.orientation = "row";
    slider4Group.orientation = "row";
    slider5Group.orientation = "row";
    slider6Group.orientation = "row";
    slider7Group.orientation = "row";
    slider8Group.orientation = "row";
   
    slider1.onChanging = function() {var val1 = Math.round(slider1.value); sliderVal1.text = val1; }
    sliderVal1.onChanging = function() {var val1 = Math.round(sliderVal1.text); slider1.value = val1; }
    slider2.onChanging = function() {var val2 = Math.round(slider2.value); sliderVal2.text = val2; }    
    sliderVal2.onChanging = function() {var val2 = Math.round(sliderVal2.text); slider2.value = val2; }
    slider3.onChanging = function() {var val3 = Math.round(slider3.value); sliderVal3.text = val3; }
    sliderVal3.onChanging = function() {var val3 = Math.round(sliderVal3.text); slider3.value = val3; }
    slider4.onChanging = function() {var val4 = Math.round(slider4.value); sliderVal4.text = val4; }
    sliderVal4.onChanging = function() {var val4 = Math.round(sliderVal4.text); slider4.value = val4; }
    slider5.onChanging = function() {var val5 = Math.round(slider5.value); sliderVal5.text = val5; }
    sliderVal5.onChanging = function() {var val5 = Math.round(sliderVal5.text); slider5.value = val5; }
    slider6.onChanging = function() {var val6 = Math.round(slider6.value); sliderVal6.text = val6; }
    sliderVal6.onChanging = function() {var val6 = Math.round(sliderVal6.text); slider6.value = val6; }
    slider7.onChanging = function() {var val7 = Math.round(slider7.value); sliderVal7.text = val7; }
    sliderVal7.onChanging = function() {var val7 = Math.round(sliderVal7.text); slider7.value = val7; }
    slider8.onChanging = function() {var val8 = Math.round(slider8.value); sliderVal8.text = val8; }
    sliderVal8.onChanging = function() {var val8 = Math.round(sliderVal8.text); slider8.value = val8; }
    
    sliderPanel.orientation = "row";
    
    //Buttons
    var buttonGroup = masterUI.add("group");
    var alrightButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    buttonGroup.orientation = "row";
    
    //Set Text as defined in UI
    alrightButton.onClick = function() {
            master1 = Math.round(slider1.value);
            master2 = Math.round(slider2.value);
            master3 = Math.round(slider3.value);
            master4 = Math.round(slider4.value);            
            master5 = Math.round(slider5.value);                
            master6 = Math.round(slider6.value);            
            master7 = Math.round(slider7.value);
            master8 = Math.round(slider8.value);
            masterUI.close();
            }
     cancelButton.onClick = function() {
            cancelCheck = true;      
            masterUI.close();
            }
        
     masterUI.show();
    
} else if (totalBars == 9) {
    var dualGroup  = sliderPanel.add("group"); 
    dualGroup.alignChildren = "top";
    
    var sliderPanelGroup1 = dualGroup.add("panel");
    var sliderPanelGroup2 = dualGroup.add("panel");
    
    var subtitle1 = sliderPanelGroup1.add("statictext", undefined, "Value 1");
    var slider1Group = sliderPanelGroup1.add("group");
    var subtitle2 = sliderPanelGroup1.add("statictext", undefined, "Value 2");
    var slider2Group = sliderPanelGroup1.add("group");
    var subtitle3 = sliderPanelGroup1.add("statictext", undefined, "Value 3");
    var slider3Group = sliderPanelGroup1.add("group");
    var subtitle4 = sliderPanelGroup1.add("statictext", undefined, "Value 4");
    var slider4Group = sliderPanelGroup1.add("group");
    var subtitle5 = sliderPanelGroup1.add("statictext", undefined, "Value 5");
    var slider5Group = sliderPanelGroup1.add("group");
    var subtitle6 = sliderPanelGroup2.add("statictext", undefined, "Value 6");
    var slider6Group = sliderPanelGroup2.add("group");
    var subtitle7 = sliderPanelGroup2.add("statictext", undefined, "Value 7");
    var slider7Group = sliderPanelGroup2.add("group");
    var subtitle8 = sliderPanelGroup2.add("statictext", undefined, "Value 8");
    var slider8Group = sliderPanelGroup2.add("group");
    var subtitle9 = sliderPanelGroup2.add("statictext", undefined, "Value 9");
    var slider9Group = sliderPanelGroup2.add("group");

    var slider1= slider1Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider2= slider2Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider3= slider3Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider4= slider4Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider5= slider5Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider6= slider6Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider7= slider7Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider8= slider8Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider9= slider9Group.add("slider", undefined, maxLine, minLine, maxLine);
    
    slider1.value= minMaxMiddle;
    slider2.value= minMaxMiddle;
    slider3.value= minMaxMiddle;
    slider4.value= minMaxMiddle;
    slider5.value= minMaxMiddle;
    slider6.value= minMaxMiddle;
    slider7.value= minMaxMiddle;
    slider8.value= minMaxMiddle;
    slider9.value= minMaxMiddle;
    slider1.size = "width: 200, height: 18";
    slider2.size = "width: 200, height: 18";
    slider3.size = "width: 200, height: 18";
    slider4.size = "width: 200, height: 18";
    slider5.size = "width: 200, height: 18";
    slider6.size = "width: 200, height: 18";
    slider7.size = "width: 200, height: 18";
    slider8.size = "width: 200, height: 18";
    slider9.size = "width: 200, height: 18";
    
    var sliderVal1 = slider1Group.add("edittext", undefined, slider1.value);
    var sliderVal2 = slider2Group.add("edittext", undefined, slider2.value);
    var sliderVal3 = slider3Group.add("edittext", undefined, slider3.value);
    var sliderVal4 = slider4Group.add("edittext", undefined, slider4.value);
    var sliderVal5 = slider5Group.add("edittext", undefined, slider5.value);
    var sliderVal6 = slider6Group.add("edittext", undefined, slider6.value);
    var sliderVal7 = slider7Group.add("edittext", undefined, slider7.value);
    var sliderVal8 = slider8Group.add("edittext", undefined, slider8.value);
    var sliderVal9 = slider9Group.add("edittext", undefined, slider9.value);
    
    sliderVal1.characters = 5;
    sliderVal2.characters = 5;
    sliderVal3.characters = 5;
    sliderVal4.characters = 5;
    sliderVal5.characters = 5;
    sliderVal6.characters = 5;
    sliderVal7.characters = 5;
    sliderVal8.characters = 5;
    sliderVal9.characters = 5;
    
    dualGroup.orientation = "row";
    sliderPanelGroup1.orientation = "column";
    sliderPanelGroup2.orientation = "column";
    
    slider1Group.orientation = "row";
    slider2Group.orientation = "row";
    slider3Group.orientation = "row";
    slider4Group.orientation = "row";
    slider5Group.orientation = "row";
    slider6Group.orientation = "row";
    slider7Group.orientation = "row";
    slider8Group.orientation = "row";
    slider9Group.orientation = "row";
   
    slider1.onChanging = function() {var val1 = Math.round(slider1.value); sliderVal1.text = val1; }
    sliderVal1.onChanging = function() {var val1 = Math.round(sliderVal1.text); slider1.value = val1; }
    slider2.onChanging = function() {var val2 = Math.round(slider2.value); sliderVal2.text = val2; }    
    sliderVal2.onChanging = function() {var val2 = Math.round(sliderVal2.text); slider2.value = val2; }
    slider3.onChanging = function() {var val3 = Math.round(slider3.value); sliderVal3.text = val3; }
    sliderVal3.onChanging = function() {var val3 = Math.round(sliderVal3.text); slider3.value = val3; }
    slider4.onChanging = function() {var val4 = Math.round(slider4.value); sliderVal4.text = val4; }
    sliderVal4.onChanging = function() {var val4 = Math.round(sliderVal4.text); slider4.value = val4; }
    slider5.onChanging = function() {var val5 = Math.round(slider5.value); sliderVal5.text = val5; }
    sliderVal5.onChanging = function() {var val5 = Math.round(sliderVal5.text); slider5.value = val5; }
    slider6.onChanging = function() {var val6 = Math.round(slider6.value); sliderVal6.text = val6; }
    sliderVal6.onChanging = function() {var val6 = Math.round(sliderVal6.text); slider6.value = val6; }
    slider7.onChanging = function() {var val7 = Math.round(slider7.value); sliderVal7.text = val7; }
    sliderVal7.onChanging = function() {var val7 = Math.round(sliderVal7.text); slider7.value = val7; }
    slider8.onChanging = function() {var val8 = Math.round(slider8.value); sliderVal8.text = val8; }
    sliderVal8.onChanging = function() {var val8 = Math.round(sliderVal8.text); slider8.value = val8; }
    slider9.onChanging = function() {var val9 = Math.round(slider9.value); sliderVal9.text = val9; }
    sliderVal9.onChanging = function() {var val9 = Math.round(sliderVal9.text); slider9.value = val9; }
    
    sliderPanel.orientation = "row";
    
    //Buttons
    var buttonGroup = masterUI.add("group");
    var alrightButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    buttonGroup.orientation = "row";
    
    //Set Text as defined in UI
    alrightButton.onClick = function() {
            master1 = Math.round(slider1.value);
            master2 = Math.round(slider2.value);
            master3 = Math.round(slider3.value);
            master4 = Math.round(slider4.value);            
            master5 = Math.round(slider5.value);                
            master6 = Math.round(slider6.value);            
            master7 = Math.round(slider7.value);
            master8 = Math.round(slider8.value);
            master9 = Math.round(slider9.value);
            masterUI.close();
            }
     cancelButton.onClick = function() {
            cancelCheck = true;      
            masterUI.close();
            }
        
     masterUI.show();

    
} else if (totalBars == 10) {
    var dualGroup  = sliderPanel.add("group"); 
    dualGroup.alignChildren = "top";
    
    var sliderPanelGroup1 = dualGroup.add("panel");
    var sliderPanelGroup2 = dualGroup.add("panel");
    
    var subtitle1 = sliderPanelGroup1.add("statictext", undefined, "Value 1");
    var slider1Group = sliderPanelGroup1.add("group");
    var subtitle2 = sliderPanelGroup1.add("statictext", undefined, "Value 2");
    var slider2Group = sliderPanelGroup1.add("group");
    var subtitle3 = sliderPanelGroup1.add("statictext", undefined, "Value 3");
    var slider3Group = sliderPanelGroup1.add("group");
    var subtitle4 = sliderPanelGroup1.add("statictext", undefined, "Value 4");
    var slider4Group = sliderPanelGroup1.add("group");
    var subtitle5 = sliderPanelGroup1.add("statictext", undefined, "Value 5");
    var slider5Group = sliderPanelGroup1.add("group");
    var subtitle6 = sliderPanelGroup2.add("statictext", undefined, "Value 6");
    var slider6Group = sliderPanelGroup2.add("group");
    var subtitle7 = sliderPanelGroup2.add("statictext", undefined, "Value 7");
    var slider7Group = sliderPanelGroup2.add("group");
    var subtitle8 = sliderPanelGroup2.add("statictext", undefined, "Value 8");
    var slider8Group = sliderPanelGroup2.add("group");
    var subtitle9 = sliderPanelGroup2.add("statictext", undefined, "Value 9");
    var slider9Group = sliderPanelGroup2.add("group");
    var subtitle10 = sliderPanelGroup2.add("statictext", undefined, "Value 10");
    var slider10Group = sliderPanelGroup2.add("group");

    var slider1= slider1Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider2= slider2Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider3= slider3Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider4= slider4Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider5= slider5Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider6= slider6Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider7= slider7Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider8= slider8Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider9= slider9Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider10= slider10Group.add("slider", undefined, maxLine, minLine, maxLine);
    
    slider1.value= minMaxMiddle;
    slider2.value= minMaxMiddle;
    slider3.value= minMaxMiddle;
    slider4.value= minMaxMiddle;
    slider5.value= minMaxMiddle;
    slider6.value= minMaxMiddle;
    slider7.value= minMaxMiddle;
    slider8.value= minMaxMiddle;
    slider9.value= minMaxMiddle;
    slider10.value= minMaxMiddle;
    slider1.size = "width: 200, height: 18";
    slider2.size = "width: 200, height: 18";
    slider3.size = "width: 200, height: 18";
    slider4.size = "width: 200, height: 18";
    slider5.size = "width: 200, height: 18";
    slider6.size = "width: 200, height: 18";
    slider7.size = "width: 200, height: 18";
    slider8.size = "width: 200, height: 18";
    slider9.size = "width: 200, height: 18";
    slider10.size = "width: 200, height: 18";
    
    var sliderVal1 = slider1Group.add("edittext", undefined, slider1.value);
    var sliderVal2 = slider2Group.add("edittext", undefined, slider2.value);
    var sliderVal3 = slider3Group.add("edittext", undefined, slider3.value);
    var sliderVal4 = slider4Group.add("edittext", undefined, slider4.value);
    var sliderVal5 = slider5Group.add("edittext", undefined, slider5.value);
    var sliderVal6 = slider6Group.add("edittext", undefined, slider6.value);
    var sliderVal7 = slider7Group.add("edittext", undefined, slider7.value);
    var sliderVal8 = slider8Group.add("edittext", undefined, slider8.value);
    var sliderVal9 = slider9Group.add("edittext", undefined, slider9.value);
    var sliderVal10 = slider10Group.add("edittext", undefined, slider10.value);
    
    sliderVal1.characters = 5;
    sliderVal2.characters = 5;
    sliderVal3.characters = 5;
    sliderVal4.characters = 5;
    sliderVal5.characters = 5;
    sliderVal6.characters = 5;
    sliderVal7.characters = 5;
    sliderVal8.characters = 5;
    sliderVal9.characters = 5;
    sliderVal10.characters = 5;
    
    dualGroup.orientation = "row";
    sliderPanelGroup1.orientation = "column";
    sliderPanelGroup2.orientation = "column";
    
    slider1Group.orientation = "row";
    slider2Group.orientation = "row";
    slider3Group.orientation = "row";
    slider4Group.orientation = "row";
    slider5Group.orientation = "row";
    slider6Group.orientation = "row";
    slider7Group.orientation = "row";
    slider8Group.orientation = "row";
    slider9Group.orientation = "row";
    slider10Group.orientation = "row";
   
    slider1.onChanging = function() {var val1 = Math.round(slider1.value); sliderVal1.text = val1; }
    sliderVal1.onChanging = function() {var val1 = Math.round(sliderVal1.text); slider1.value = val1; }
    slider2.onChanging = function() {var val2 = Math.round(slider2.value); sliderVal2.text = val2; }    
    sliderVal2.onChanging = function() {var val2 = Math.round(sliderVal2.text); slider2.value = val2; }
    slider3.onChanging = function() {var val3 = Math.round(slider3.value); sliderVal3.text = val3; }
    sliderVal3.onChanging = function() {var val3 = Math.round(sliderVal3.text); slider3.value = val3; }
    slider4.onChanging = function() {var val4 = Math.round(slider4.value); sliderVal4.text = val4; }
    sliderVal4.onChanging = function() {var val4 = Math.round(sliderVal4.text); slider4.value = val4; }
    slider5.onChanging = function() {var val5 = Math.round(slider5.value); sliderVal5.text = val5; }
    sliderVal5.onChanging = function() {var val5 = Math.round(sliderVal5.text); slider5.value = val5; }
    slider6.onChanging = function() {var val6 = Math.round(slider6.value); sliderVal6.text = val6; }
    sliderVal6.onChanging = function() {var val6 = Math.round(sliderVal6.text); slider6.value = val6; }
    slider7.onChanging = function() {var val7 = Math.round(slider7.value); sliderVal7.text = val7; }
    sliderVal7.onChanging = function() {var val7 = Math.round(sliderVal7.text); slider7.value = val7; }
    slider8.onChanging = function() {var val8 = Math.round(slider8.value); sliderVal8.text = val8; }
    sliderVal8.onChanging = function() {var val8 = Math.round(sliderVal8.text); slider8.value = val8; }
    slider9.onChanging = function() {var val9 = Math.round(slider9.value); sliderVal9.text = val9; }
    sliderVal9.onChanging = function() {var val9 = Math.round(sliderVal9.text); slider9.value = val9; }
    slider10.onChanging = function() {var val10 = Math.round(slider10.value); sliderVal10.text = val10; }
    sliderVal10.onChanging = function() {var val10 = Math.round(sliderVal10.text); slider10.value = val10; }
    
    sliderPanel.orientation = "row";
    
    //Buttons
    var buttonGroup = masterUI.add("group");
    var alrightButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    buttonGroup.orientation = "row";
    
    //Set Text as defined in UI
    alrightButton.onClick = function() {
            master1 = Math.round(slider1.value);
            master2 = Math.round(slider2.value);
            master3 = Math.round(slider3.value);
            master4 = Math.round(slider4.value);            
            master5 = Math.round(slider5.value);                
            master6 = Math.round(slider6.value);            
            master7 = Math.round(slider7.value);
            master8 = Math.round(slider8.value);
            master9 = Math.round(slider9.value);
            master10 = Math.round(slider10.value);
            masterUI.close();
            }
     cancelButton.onClick = function() {
            cancelCheck = true;      
            masterUI.close();
            }
        
     masterUI.show();

} else if (totalBars == 11) {
    var dualGroup  = sliderPanel.add("group"); 
    dualGroup.alignChildren = "top";
    
    var sliderPanelGroup1 = dualGroup.add("panel");
    var sliderPanelGroup2 = dualGroup.add("panel");
    
    var subtitle1 = sliderPanelGroup1.add("statictext", undefined, "Value 1");
    var slider1Group = sliderPanelGroup1.add("group");
    var subtitle2 = sliderPanelGroup1.add("statictext", undefined, "Value 2");
    var slider2Group = sliderPanelGroup1.add("group");
    var subtitle3 = sliderPanelGroup1.add("statictext", undefined, "Value 3");
    var slider3Group = sliderPanelGroup1.add("group");
    var subtitle4 = sliderPanelGroup1.add("statictext", undefined, "Value 4");
    var slider4Group = sliderPanelGroup1.add("group");
    var subtitle5 = sliderPanelGroup1.add("statictext", undefined, "Value 5");
    var slider5Group = sliderPanelGroup1.add("group");
    var subtitle6 = sliderPanelGroup1.add("statictext", undefined, "Value 6");
    var slider6Group = sliderPanelGroup1.add("group");
    var subtitle7 = sliderPanelGroup2.add("statictext", undefined, "Value 7");
    var slider7Group = sliderPanelGroup2.add("group");
    var subtitle8 = sliderPanelGroup2.add("statictext", undefined, "Value 8");
    var slider8Group = sliderPanelGroup2.add("group");
    var subtitle9 = sliderPanelGroup2.add("statictext", undefined, "Value 9");
    var slider9Group = sliderPanelGroup2.add("group");
    var subtitle10 = sliderPanelGroup2.add("statictext", undefined, "Value 10");
    var slider10Group = sliderPanelGroup2.add("group");
    var subtitle11 = sliderPanelGroup2.add("statictext", undefined, "Value 11");
    var slider11Group = sliderPanelGroup2.add("group");

    var slider1= slider1Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider2= slider2Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider3= slider3Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider4= slider4Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider5= slider5Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider6= slider6Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider7= slider7Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider8= slider8Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider9= slider9Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider10= slider10Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider11= slider11Group.add("slider", undefined, maxLine, minLine, maxLine);
    
    slider1.value= minMaxMiddle;
    slider2.value= minMaxMiddle;
    slider3.value= minMaxMiddle;
    slider4.value= minMaxMiddle;
    slider5.value= minMaxMiddle;
    slider6.value= minMaxMiddle;
    slider7.value= minMaxMiddle;
    slider8.value= minMaxMiddle;
    slider9.value= minMaxMiddle;
    slider10.value= minMaxMiddle;
    slider11.value= minMaxMiddle;
    slider1.size = "width: 200, height: 18";
    slider2.size = "width: 200, height: 18";
    slider3.size = "width: 200, height: 18";
    slider4.size = "width: 200, height: 18";
    slider5.size = "width: 200, height: 18";
    slider6.size = "width: 200, height: 18";
    slider7.size = "width: 200, height: 18";
    slider8.size = "width: 200, height: 18";
    slider9.size = "width: 200, height: 18";
    slider10.size = "width: 200, height: 18";
    slider11.size = "width: 200, height: 18";
    
    var sliderVal1 = slider1Group.add("edittext", undefined, slider1.value);
    var sliderVal2 = slider2Group.add("edittext", undefined, slider2.value);
    var sliderVal3 = slider3Group.add("edittext", undefined, slider3.value);
    var sliderVal4 = slider4Group.add("edittext", undefined, slider4.value);
    var sliderVal5 = slider5Group.add("edittext", undefined, slider5.value);
    var sliderVal6 = slider6Group.add("edittext", undefined, slider6.value);
    var sliderVal7 = slider7Group.add("edittext", undefined, slider7.value);
    var sliderVal8 = slider8Group.add("edittext", undefined, slider8.value);
    var sliderVal9 = slider9Group.add("edittext", undefined, slider9.value);
    var sliderVal10 = slider10Group.add("edittext", undefined, slider10.value);
    var sliderVal11 = slider11Group.add("edittext", undefined, slider11.value);
    
    sliderVal1.characters = 5;
    sliderVal2.characters = 5;
    sliderVal3.characters = 5;
    sliderVal4.characters = 5;
    sliderVal5.characters = 5;
    sliderVal6.characters = 5;
    sliderVal7.characters = 5;
    sliderVal8.characters = 5;
    sliderVal9.characters = 5;
    sliderVal10.characters = 5;
    sliderVal11.characters = 5;
    
    dualGroup.orientation = "row";
    sliderPanelGroup1.orientation = "column";
    sliderPanelGroup2.orientation = "column";
    
    slider1Group.orientation = "row";
    slider2Group.orientation = "row";
    slider3Group.orientation = "row";
    slider4Group.orientation = "row";
    slider5Group.orientation = "row";
    slider6Group.orientation = "row";
    slider7Group.orientation = "row";
    slider8Group.orientation = "row";
    slider9Group.orientation = "row";
    slider10Group.orientation = "row";
    slider11Group.orientation = "row";
   
    slider1.onChanging = function() {var val1 = Math.round(slider1.value); sliderVal1.text = val1; }
    sliderVal1.onChanging = function() {var val1 = Math.round(sliderVal1.text); slider1.value = val1; }
    slider2.onChanging = function() {var val2 = Math.round(slider2.value); sliderVal2.text = val2; }    
    sliderVal2.onChanging = function() {var val2 = Math.round(sliderVal2.text); slider2.value = val2; }
    slider3.onChanging = function() {var val3 = Math.round(slider3.value); sliderVal3.text = val3; }
    sliderVal3.onChanging = function() {var val3 = Math.round(sliderVal3.text); slider3.value = val3; }
    slider4.onChanging = function() {var val4 = Math.round(slider4.value); sliderVal4.text = val4; }
    sliderVal4.onChanging = function() {var val4 = Math.round(sliderVal4.text); slider4.value = val4; }
    slider5.onChanging = function() {var val5 = Math.round(slider5.value); sliderVal5.text = val5; }
    sliderVal5.onChanging = function() {var val5 = Math.round(sliderVal5.text); slider5.value = val5; }
    slider6.onChanging = function() {var val6 = Math.round(slider6.value); sliderVal6.text = val6; }
    sliderVal6.onChanging = function() {var val6 = Math.round(sliderVal6.text); slider6.value = val6; }
    slider7.onChanging = function() {var val7 = Math.round(slider7.value); sliderVal7.text = val7; }
    sliderVal7.onChanging = function() {var val7 = Math.round(sliderVal7.text); slider7.value = val7; }
    slider8.onChanging = function() {var val8 = Math.round(slider8.value); sliderVal8.text = val8; }
    sliderVal8.onChanging = function() {var val8 = Math.round(sliderVal8.text); slider8.value = val8; }
    slider9.onChanging = function() {var val9 = Math.round(slider9.value); sliderVal9.text = val9; }
    sliderVal9.onChanging = function() {var val9 = Math.round(sliderVal9.text); slider9.value = val9; }
    slider10.onChanging = function() {var val10 = Math.round(slider10.value); sliderVal10.text = val10; }
    sliderVal10.onChanging = function() {var val10 = Math.round(sliderVal10.text); slider10.value = val10; }
    slider11.onChanging = function() {var val11 = Math.round(slider11.value); sliderVal11.text = val11; }
    sliderVal11.onChanging = function() {var val11 = Math.round(sliderVal11.text); slider11.value = val11; }
    
    sliderPanel.orientation = "row";
    
    //Buttons
    var buttonGroup = masterUI.add("group");
    var alrightButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    buttonGroup.orientation = "row";
    
    //Set Text as defined in UI
    alrightButton.onClick = function() {
            master1 = Math.round(slider1.value);
            master2 = Math.round(slider2.value);
            master3 = Math.round(slider3.value);
            master4 = Math.round(slider4.value);            
            master5 = Math.round(slider5.value);                
            master6 = Math.round(slider6.value);            
            master7 = Math.round(slider7.value);
            master8 = Math.round(slider8.value);
            master9 = Math.round(slider9.value);
            master10 = Math.round(slider10.value);
            master11 = Math.round(slider11.value);
            masterUI.close();
            }
     cancelButton.onClick = function() {
            cancelCheck = true;      
            masterUI.close();
            }
        
     masterUI.show();
} else if (totalBars == 12) {
    var dualGroup  = sliderPanel.add("group"); 
    dualGroup.alignChildren = "top";
    
    var sliderPanelGroup1 = dualGroup.add("panel");
    var sliderPanelGroup2 = dualGroup.add("panel");
    
    var subtitle1 = sliderPanelGroup1.add("statictext", undefined, "Value 1");
    var slider1Group = sliderPanelGroup1.add("group");
    var subtitle2 = sliderPanelGroup1.add("statictext", undefined, "Value 2");
    var slider2Group = sliderPanelGroup1.add("group");
    var subtitle3 = sliderPanelGroup1.add("statictext", undefined, "Value 3");
    var slider3Group = sliderPanelGroup1.add("group");
    var subtitle4 = sliderPanelGroup1.add("statictext", undefined, "Value 4");
    var slider4Group = sliderPanelGroup1.add("group");
    var subtitle5 = sliderPanelGroup1.add("statictext", undefined, "Value 5");
    var slider5Group = sliderPanelGroup1.add("group");
    var subtitle6 = sliderPanelGroup1.add("statictext", undefined, "Value 6");
    var slider6Group = sliderPanelGroup1.add("group");
    var subtitle7 = sliderPanelGroup2.add("statictext", undefined, "Value 7");
    var slider7Group = sliderPanelGroup2.add("group");
    var subtitle8 = sliderPanelGroup2.add("statictext", undefined, "Value 8");
    var slider8Group = sliderPanelGroup2.add("group");
    var subtitle9 = sliderPanelGroup2.add("statictext", undefined, "Value 9");
    var slider9Group = sliderPanelGroup2.add("group");
    var subtitle10 = sliderPanelGroup2.add("statictext", undefined, "Value 10");
    var slider10Group = sliderPanelGroup2.add("group");
    var subtitle11 = sliderPanelGroup2.add("statictext", undefined, "Value 11");
    var slider11Group = sliderPanelGroup2.add("group");
    var subtitle12 = sliderPanelGroup2.add("statictext", undefined, "Value 12");
    var slider12Group = sliderPanelGroup2.add("group");

    var slider1= slider1Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider2= slider2Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider3= slider3Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider4= slider4Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider5= slider5Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider6= slider6Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider7= slider7Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider8= slider8Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider9= slider9Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider10= slider10Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider11= slider11Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider12= slider12Group.add("slider", undefined, maxLine, minLine, maxLine);

    
    slider1.value= minMaxMiddle;
    slider2.value= minMaxMiddle;
    slider3.value= minMaxMiddle;
    slider4.value= minMaxMiddle;
    slider5.value= minMaxMiddle;
    slider6.value= minMaxMiddle;
    slider7.value= minMaxMiddle;
    slider8.value= minMaxMiddle;
    slider9.value= minMaxMiddle;
    slider10.value= minMaxMiddle;
    slider11.value= minMaxMiddle;
    slider12.value= minMaxMiddle;
    slider1.size = "width: 200, height: 18";
    slider2.size = "width: 200, height: 18";
    slider3.size = "width: 200, height: 18";
    slider4.size = "width: 200, height: 18";
    slider5.size = "width: 200, height: 18";
    slider6.size = "width: 200, height: 18";
    slider7.size = "width: 200, height: 18";
    slider8.size = "width: 200, height: 18";
    slider9.size = "width: 200, height: 18";
    slider10.size = "width: 200, height: 18";
    slider11.size = "width: 200, height: 18";
    slider12.size = "width: 200, height: 18";
    
    var sliderVal1 = slider1Group.add("edittext", undefined, slider1.value);
    var sliderVal2 = slider2Group.add("edittext", undefined, slider2.value);
    var sliderVal3 = slider3Group.add("edittext", undefined, slider3.value);
    var sliderVal4 = slider4Group.add("edittext", undefined, slider4.value);
    var sliderVal5 = slider5Group.add("edittext", undefined, slider5.value);
    var sliderVal6 = slider6Group.add("edittext", undefined, slider6.value);
    var sliderVal7 = slider7Group.add("edittext", undefined, slider7.value);
    var sliderVal8 = slider8Group.add("edittext", undefined, slider8.value);
    var sliderVal9 = slider9Group.add("edittext", undefined, slider9.value);
    var sliderVal10 = slider10Group.add("edittext", undefined, slider10.value);
    var sliderVal11 = slider11Group.add("edittext", undefined, slider11.value);
    var sliderVal12 = slider12Group.add("edittext", undefined, slider12.value);
    
    sliderVal1.characters = 5;
    sliderVal2.characters = 5;
    sliderVal3.characters = 5;
    sliderVal4.characters = 5;
    sliderVal5.characters = 5;
    sliderVal6.characters = 5;
    sliderVal7.characters = 5;
    sliderVal8.characters = 5;
    sliderVal9.characters = 5;
    sliderVal10.characters = 5;
    sliderVal11.characters = 5;
    sliderVal12.characters = 5;
    
    dualGroup.orientation = "row";
    sliderPanelGroup1.orientation = "column";
    sliderPanelGroup2.orientation = "column";
    
    slider1Group.orientation = "row";
    slider2Group.orientation = "row";
    slider3Group.orientation = "row";
    slider4Group.orientation = "row";
    slider5Group.orientation = "row";
    slider6Group.orientation = "row";
    slider7Group.orientation = "row";
    slider8Group.orientation = "row";
    slider9Group.orientation = "row";
    slider10Group.orientation = "row";
    slider11Group.orientation = "row";
    slider12Group.orientation = "row";
   
    slider1.onChanging = function() {var val1 = Math.round(slider1.value); sliderVal1.text = val1; }
    sliderVal1.onChanging = function() {var val1 = Math.round(sliderVal1.text); slider1.value = val1; }
    slider2.onChanging = function() {var val2 = Math.round(slider2.value); sliderVal2.text = val2; }    
    sliderVal2.onChanging = function() {var val2 = Math.round(sliderVal2.text); slider2.value = val2; }
    slider3.onChanging = function() {var val3 = Math.round(slider3.value); sliderVal3.text = val3; }
    sliderVal3.onChanging = function() {var val3 = Math.round(sliderVal3.text); slider3.value = val3; }
    slider4.onChanging = function() {var val4 = Math.round(slider4.value); sliderVal4.text = val4; }
    sliderVal4.onChanging = function() {var val4 = Math.round(sliderVal4.text); slider4.value = val4; }
    slider5.onChanging = function() {var val5 = Math.round(slider5.value); sliderVal5.text = val5; }
    sliderVal5.onChanging = function() {var val5 = Math.round(sliderVal5.text); slider5.value = val5; }
    slider6.onChanging = function() {var val6 = Math.round(slider6.value); sliderVal6.text = val6; }
    sliderVal6.onChanging = function() {var val6 = Math.round(sliderVal6.text); slider6.value = val6; }
    slider7.onChanging = function() {var val7 = Math.round(slider7.value); sliderVal7.text = val7; }
    sliderVal7.onChanging = function() {var val7 = Math.round(sliderVal7.text); slider7.value = val7; }
    slider8.onChanging = function() {var val8 = Math.round(slider8.value); sliderVal8.text = val8; }
    sliderVal8.onChanging = function() {var val8 = Math.round(sliderVal8.text); slider8.value = val8; }
    slider9.onChanging = function() {var val9 = Math.round(slider9.value); sliderVal9.text = val9; }
    sliderVal9.onChanging = function() {var val9 = Math.round(sliderVal9.text); slider9.value = val9; }
    slider10.onChanging = function() {var val10 = Math.round(slider10.value); sliderVal10.text = val10; }
    sliderVal10.onChanging = function() {var val10 = Math.round(sliderVal10.text); slider10.value = val10; }
    slider11.onChanging = function() {var val11 = Math.round(slider11.value); sliderVal11.text = val11; }
    sliderVal11.onChanging = function() {var val11 = Math.round(sliderVal11.text); slider11.value = val11; }
    slider12.onChanging = function() {var val12 = Math.round(slider12.value); sliderVal12.text = val12; }
    sliderVal12.onChanging = function() {var val12 = Math.round(sliderVal12.text); slider12.value = val12; }
    
    sliderPanel.orientation = "row";
    
    //Buttons
    var buttonGroup = masterUI.add("group");
    var alrightButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    buttonGroup.orientation = "row";
    
    //Set Text as defined in UI
    alrightButton.onClick = function() {
            master1 = Math.round(slider1.value);
            master2 = Math.round(slider2.value);
            master3 = Math.round(slider3.value);
            master4 = Math.round(slider4.value);            
            master5 = Math.round(slider5.value);                
            master6 = Math.round(slider6.value);            
            master7 = Math.round(slider7.value);
            master8 = Math.round(slider8.value);
            master9 = Math.round(slider9.value);
            master10 = Math.round(slider10.value);
            master11 = Math.round(slider11.value);
            master12 = Math.round(slider12.value);
            masterUI.close();
            }
     cancelButton.onClick = function() {
            cancelCheck = true;  
            masterUI.close();
            }
        
     masterUI.show();
}

///////////LABEL UI////////////////////
if (cancelCheck == false) {
if (labelCheck == true) {
    
    //Label UI Construction
    var labelUI = new Window("dialog");
    var headTitle = labelUI.add("statictext", undefined, "Labels for Bars");
    var labelMaster = labelUI.add("group");
    labelMaster.alignChildren = "top";
    var labelPanel = labelMaster.add("panel");
    if (totalBars > 8) {
        var labelPanel2 = labelMaster.add("panel");
    }
    
    if (totalBars == 1) {
        var labelGroup1 = labelPanel.add("group");
        var labelStatic1 = labelGroup1.add("statictext", undefined, "Bar Label 1");
        var labelEdit1 = labelGroup1.add("edittext", undefined, "");
        labelEdit1.characters = 30;
    } else if (totalBars == 2) {
        var labelGroup1 = labelPanel.add("group");
        var labelStatic1 = labelGroup1.add("statictext", undefined, "Bar Label 1");
        var labelEdit1 = labelGroup1.add("edittext", undefined, "");
        labelEdit1.characters = 30;
        var labelGroup2 = labelPanel.add("group");
        var labelStatic2 = labelGroup2.add("statictext", undefined, "Bar Label 2");
        var labelEdit2 = labelGroup2.add("edittext", undefined, "");
        labelEdit2.characters = 30;
   } else if (totalBars == 3) {
        var labelGroup1 = labelPanel.add("group");
        var labelStatic1 = labelGroup1.add("statictext", undefined, "Bar Label 1");
        var labelEdit1 = labelGroup1.add("edittext", undefined, "");
        labelEdit1.characters = 30;
        var labelGroup2 = labelPanel.add("group");
        var labelStatic2 = labelGroup2.add("statictext", undefined, "Bar Label 2");
        var labelEdit2 = labelGroup2.add("edittext", undefined, "");
        labelEdit2.characters = 30;       
        var labelGroup3 = labelPanel.add("group");
        var labelStatic3 = labelGroup3.add("statictext", undefined, "Bar Label 3");
        var labelEdit3 = labelGroup3.add("edittext", undefined, "");
        labelEdit3.characters = 30;           
    } else if (totalBars == 4) {
        var labelGroup1 = labelPanel.add("group");
        var labelStatic1 = labelGroup1.add("statictext", undefined, "Bar Label 1");
        var labelEdit1 = labelGroup1.add("edittext", undefined, "");
        labelEdit1.characters = 30;
        var labelGroup2 = labelPanel.add("group");
        var labelStatic2 = labelGroup2.add("statictext", undefined, "Bar Label 2");
        var labelEdit2 = labelGroup2.add("edittext", undefined, "");
        labelEdit2.characters = 30;       
        var labelGroup3 = labelPanel.add("group");
        var labelStatic3 = labelGroup3.add("statictext", undefined, "Bar Label 3");
        var labelEdit3 = labelGroup3.add("edittext", undefined, "");
        labelEdit3.characters = 30; 
        var labelGroup4 = labelPanel.add("group");
        var labelStatic4 = labelGroup4.add("statictext", undefined, "Bar Label 4");
        var labelEdit4 = labelGroup4.add("edittext", undefined, "");
        labelEdit4.characters = 30; 
    } else if (totalBars == 5) {
        var labelGroup1 = labelPanel.add("group");
        var labelStatic1 = labelGroup1.add("statictext", undefined, "Bar Label 1");
        var labelEdit1 = labelGroup1.add("edittext", undefined, "");
        labelEdit1.characters = 30;
        var labelGroup2 = labelPanel.add("group");
        var labelStatic2 = labelGroup2.add("statictext", undefined, "Bar Label 2");
        var labelEdit2 = labelGroup2.add("edittext", undefined, "");
        labelEdit2.characters = 30;       
        var labelGroup3 = labelPanel.add("group");
        var labelStatic3 = labelGroup3.add("statictext", undefined, "Bar Label 3");
        var labelEdit3 = labelGroup3.add("edittext", undefined, "");
        labelEdit3.characters = 30; 
        var labelGroup4 = labelPanel.add("group");
        var labelStatic4 = labelGroup4.add("statictext", undefined, "Bar Label 4");
        var labelEdit4 = labelGroup4.add("edittext", undefined, "");
        labelEdit4.characters = 30;         
        var labelGroup5 = labelPanel.add("group");
        var labelStatic5 = labelGroup5.add("statictext", undefined, "Bar Label 5");
        var labelEdit5 = labelGroup5.add("edittext", undefined, "");
        labelEdit5.characters = 30;      
    } else if (totalBars == 6) {
        var labelGroup1 = labelPanel.add("group");
        var labelStatic1 = labelGroup1.add("statictext", undefined, "Bar Label 1");
        var labelEdit1 = labelGroup1.add("edittext", undefined, "");
        labelEdit1.characters = 30;
        var labelGroup2 = labelPanel.add("group");
        var labelStatic2 = labelGroup2.add("statictext", undefined, "Bar Label 2");
        var labelEdit2 = labelGroup2.add("edittext", undefined, "");
        labelEdit2.characters = 30;       
        var labelGroup3 = labelPanel.add("group");
        var labelStatic3 = labelGroup3.add("statictext", undefined, "Bar Label 3");
        var labelEdit3 = labelGroup3.add("edittext", undefined, "");
        labelEdit3.characters = 30; 
        var labelGroup4 = labelPanel.add("group");
        var labelStatic4 = labelGroup4.add("statictext", undefined, "Bar Label 4");
        var labelEdit4 = labelGroup4.add("edittext", undefined, "");
        labelEdit4.characters = 30;         
        var labelGroup5 = labelPanel.add("group");
        var labelStatic5 = labelGroup5.add("statictext", undefined, "Bar Label 5");
        var labelEdit5 = labelGroup5.add("edittext", undefined, "");
        labelEdit5.characters = 30; 
        var labelGroup6 = labelPanel.add("group");
        var labelStatic6 = labelGroup6.add("statictext", undefined, "Bar Label 6");
        var labelEdit6 = labelGroup6.add("edittext", undefined, "");
        labelEdit6.characters = 30; 
    } else if (totalBars == 7) {
        var labelGroup1 = labelPanel.add("group");
        var labelStatic1 = labelGroup1.add("statictext", undefined, "Bar Label 1");
        var labelEdit1 = labelGroup1.add("edittext", undefined, "");
        labelEdit1.characters = 30;
        var labelGroup2 = labelPanel.add("group");
        var labelStatic2 = labelGroup2.add("statictext", undefined, "Bar Label 2");
        var labelEdit2 = labelGroup2.add("edittext", undefined, "");
        labelEdit2.characters = 30;       
        var labelGroup3 = labelPanel.add("group");
        var labelStatic3 = labelGroup3.add("statictext", undefined, "Bar Label 3");
        var labelEdit3 = labelGroup3.add("edittext", undefined, "");
        labelEdit3.characters = 30; 
        var labelGroup4 = labelPanel.add("group");
        var labelStatic4 = labelGroup4.add("statictext", undefined, "Bar Label 4");
        var labelEdit4 = labelGroup4.add("edittext", undefined, "");
        labelEdit4.characters = 30;         
        var labelGroup5 = labelPanel.add("group");
        var labelStatic5 = labelGroup5.add("statictext", undefined, "Bar Label 5");
        var labelEdit5 = labelGroup5.add("edittext", undefined, "");
        labelEdit5.characters = 30; 
        var labelGroup6 = labelPanel.add("group");
        var labelStatic6 = labelGroup6.add("statictext", undefined, "Bar Label 6");
        var labelEdit6 = labelGroup6.add("edittext", undefined, "");
        labelEdit6.characters = 30;  
        var labelGroup7 = labelPanel.add("group");
        var labelStatic7 = labelGroup7.add("statictext", undefined, "Bar Label 7");
        var labelEdit7 = labelGroup7.add("edittext", undefined, "");
        labelEdit7.characters = 30;    
    } else if (totalBars == 8) {
        var labelGroup1 = labelPanel.add("group");
        var labelStatic1 = labelGroup1.add("statictext", undefined, "Bar Label 1");
        var labelEdit1 = labelGroup1.add("edittext", undefined, "");
        labelEdit1.characters = 30;
        var labelGroup2 = labelPanel.add("group");
        var labelStatic2 = labelGroup2.add("statictext", undefined, "Bar Label 2");
        var labelEdit2 = labelGroup2.add("edittext", undefined, "");
        labelEdit2.characters = 30;       
        var labelGroup3 = labelPanel.add("group");
        var labelStatic3 = labelGroup3.add("statictext", undefined, "Bar Label 3");
        var labelEdit3 = labelGroup3.add("edittext", undefined, "");
        labelEdit3.characters = 30; 
        var labelGroup4 = labelPanel.add("group");
        var labelStatic4 = labelGroup4.add("statictext", undefined, "Bar Label 4");
        var labelEdit4 = labelGroup4.add("edittext", undefined, "");
        labelEdit4.characters = 30;         
        var labelGroup5 = labelPanel.add("group");
        var labelStatic5 = labelGroup5.add("statictext", undefined, "Bar Label 5");
        var labelEdit5 = labelGroup5.add("edittext", undefined, "");
        labelEdit5.characters = 30; 
        var labelGroup6 = labelPanel.add("group");
        var labelStatic6 = labelGroup6.add("statictext", undefined, "Bar Label 6");
        var labelEdit6 = labelGroup6.add("edittext", undefined, "");
        labelEdit6.characters = 30;  
        var labelGroup7 = labelPanel.add("group");
        var labelStatic7 = labelGroup7.add("statictext", undefined, "Bar Label 7");
        var labelEdit7 = labelGroup7.add("edittext", undefined, "");
        labelEdit7.characters = 30;    
        var labelGroup8 = labelPanel.add("group");
        var labelStatic8 = labelGroup8.add("statictext", undefined, "Bar Label 8");
        var labelEdit8 = labelGroup8.add("edittext", undefined, "");
        labelEdit8.characters = 30;    
    } else if (totalBars == 9) {
        var labelGroup1 = labelPanel.add("group");
        var labelStatic1 = labelGroup1.add("statictext", undefined, "Bar Label 1");
        var labelEdit1 = labelGroup1.add("edittext", undefined, "");
        labelEdit1.characters = 18;
        var labelGroup2 = labelPanel.add("group");
        var labelStatic2 = labelGroup2.add("statictext", undefined, "Bar Label 2");
        var labelEdit2 = labelGroup2.add("edittext", undefined, "");
        labelEdit2.characters = 18;       
        var labelGroup3 = labelPanel.add("group");
        var labelStatic3 = labelGroup3.add("statictext", undefined, "Bar Label 3");
        var labelEdit3 = labelGroup3.add("edittext", undefined, "");
        labelEdit3.characters = 18; 
        var labelGroup4 = labelPanel.add("group");
        var labelStatic4 = labelGroup4.add("statictext", undefined, "Bar Label 4");
        var labelEdit4 = labelGroup4.add("edittext", undefined, "");
        labelEdit4.characters = 18;         
        var labelGroup5 = labelPanel.add("group");
        var labelStatic5 = labelGroup5.add("statictext", undefined, "Bar Label 5");
        var labelEdit5 = labelGroup5.add("edittext", undefined, "");
        labelEdit5.characters = 18; 
        var labelGroup6 = labelPanel2.add("group");
        var labelStatic6 = labelGroup6.add("statictext", undefined, "Bar Label 6");
        var labelEdit6 = labelGroup6.add("edittext", undefined, "");
        labelEdit6.characters = 18;  
        var labelGroup7 = labelPanel2.add("group");
        var labelStatic7 = labelGroup7.add("statictext", undefined, "Bar Label 7");
        var labelEdit7 = labelGroup7.add("edittext", undefined, "");
        labelEdit7.characters = 18;    
        var labelGroup8 = labelPanel2.add("group");
        var labelStatic8 = labelGroup8.add("statictext", undefined, "Bar Label 8");
        var labelEdit8 = labelGroup8.add("edittext", undefined, "");
        labelEdit8.characters = 18;  
        var labelGroup9 = labelPanel2.add("group");
        var labelStatic9 = labelGroup9.add("statictext", undefined, "Bar Label 9");
        var labelEdit9 = labelGroup9.add("edittext", undefined, "");
        labelEdit9.characters = 18;  
    } else if (totalBars == 10) {
        var labelGroup1 = labelPanel.add("group");
        var labelStatic1 = labelGroup1.add("statictext", undefined, "Bar Label 1");
        var labelEdit1 = labelGroup1.add("edittext", undefined, "");
        labelEdit1.characters = 18;
        var labelGroup2 = labelPanel.add("group");
        var labelStatic2 = labelGroup2.add("statictext", undefined, "Bar Label 2");
        var labelEdit2 = labelGroup2.add("edittext", undefined, "");
        labelEdit2.characters = 18;       
        var labelGroup3 = labelPanel.add("group");
        var labelStatic3 = labelGroup3.add("statictext", undefined, "Bar Label 3");
        var labelEdit3 = labelGroup3.add("edittext", undefined, "");
        labelEdit3.characters = 18; 
        var labelGroup4 = labelPanel.add("group");
        var labelStatic4 = labelGroup4.add("statictext", undefined, "Bar Label 4");
        var labelEdit4 = labelGroup4.add("edittext", undefined, "");
        labelEdit4.characters = 18;         
        var labelGroup5 = labelPanel.add("group");
        var labelStatic5 = labelGroup5.add("statictext", undefined, "Bar Label 5");
        var labelEdit5 = labelGroup5.add("edittext", undefined, "");
        labelEdit5.characters = 18; 
        var labelGroup6 = labelPanel2.add("group");
        var labelStatic6 = labelGroup6.add("statictext", undefined, "Bar Label 6");
        var labelEdit6 = labelGroup6.add("edittext", undefined, "");
        labelEdit6.characters = 18;  
        var labelGroup7 = labelPanel2.add("group");
        var labelStatic7 = labelGroup7.add("statictext", undefined, "Bar Label 7");
        var labelEdit7 = labelGroup7.add("edittext", undefined, "");
        labelEdit7.characters = 18;    
        var labelGroup8 = labelPanel2.add("group");
        var labelStatic8 = labelGroup8.add("statictext", undefined, "Bar Label 8");
        var labelEdit8 = labelGroup8.add("edittext", undefined, "");
        labelEdit8.characters = 18;  
        var labelGroup9 = labelPanel2.add("group");
        var labelStatic9 = labelGroup9.add("statictext", undefined, "Bar Label 9");
        var labelEdit9 = labelGroup9.add("edittext", undefined, "");
        labelEdit9.characters = 18;  
        var labelGroup10 = labelPanel2.add("group");
        var labelStatic10 = labelGroup10.add("statictext", undefined, "Bar Label 10");
        var labelEdit10 = labelGroup10.add("edittext", undefined, "");
        labelEdit10.characters = 18;    
    } else if (totalBars == 11) {
        var labelGroup1 = labelPanel.add("group");
        var labelStatic1 = labelGroup1.add("statictext", undefined, "Bar Label 1");
        var labelEdit1 = labelGroup1.add("edittext", undefined, "");
        labelEdit1.characters = 18;
        var labelGroup2 = labelPanel.add("group");
        var labelStatic2 = labelGroup2.add("statictext", undefined, "Bar Label 2");
        var labelEdit2 = labelGroup2.add("edittext", undefined, "");
        labelEdit2.characters = 18;       
        var labelGroup3 = labelPanel.add("group");
        var labelStatic3 = labelGroup3.add("statictext", undefined, "Bar Label 3");
        var labelEdit3 = labelGroup3.add("edittext", undefined, "");
        labelEdit3.characters = 18; 
        var labelGroup4 = labelPanel.add("group");
        var labelStatic4 = labelGroup4.add("statictext", undefined, "Bar Label 4");
        var labelEdit4 = labelGroup4.add("edittext", undefined, "");
        labelEdit4.characters = 18;         
        var labelGroup5 = labelPanel.add("group");
        var labelStatic5 = labelGroup5.add("statictext", undefined, "Bar Label 5");
        var labelEdit5 = labelGroup5.add("edittext", undefined, "");
        labelEdit5.characters = 18; 
        var labelGroup6 = labelPanel.add("group");
        var labelStatic6 = labelGroup6.add("statictext", undefined, "Bar Label 6");
        var labelEdit6 = labelGroup6.add("edittext", undefined, "");
        labelEdit6.characters = 18;  
        var labelGroup7 = labelPanel2.add("group");
        var labelStatic7 = labelGroup7.add("statictext", undefined, "Bar Label 7");
        var labelEdit7 = labelGroup7.add("edittext", undefined, "");
        labelEdit7.characters = 18;    
        var labelGroup8 = labelPanel2.add("group");
        var labelStatic8 = labelGroup8.add("statictext", undefined, "Bar Label 8");
        var labelEdit8 = labelGroup8.add("edittext", undefined, "");
        labelEdit8.characters = 18;  
        var labelGroup9 = labelPanel2.add("group");
        var labelStatic9 = labelGroup9.add("statictext", undefined, "Bar Label 9");
        var labelEdit9 = labelGroup9.add("edittext", undefined, "");
        labelEdit9.characters = 18;  
        var labelGroup10 = labelPanel2.add("group");
        var labelStatic10 = labelGroup10.add("statictext", undefined, "Bar Label 10");
        var labelEdit10 = labelGroup10.add("edittext", undefined, "");
        labelEdit10.characters = 18;    
        var labelGroup11 = labelPanel2.add("group");
        var labelStatic11 = labelGroup11.add("statictext", undefined, "Bar Label 11");
        var labelEdit11 = labelGroup11.add("edittext", undefined, "");
        labelEdit11.characters = 18;    
   } else if (totalBars == 12) {
        var labelGroup1 = labelPanel.add("group");
        var labelStatic1 = labelGroup1.add("statictext", undefined, "Bar Label 1");
        var labelEdit1 = labelGroup1.add("edittext", undefined, "");
        labelEdit1.characters = 18;
        var labelGroup2 = labelPanel.add("group");
        var labelStatic2 = labelGroup2.add("statictext", undefined, "Bar Label 2");
        var labelEdit2 = labelGroup2.add("edittext", undefined, "");
        labelEdit2.characters = 18;       
        var labelGroup3 = labelPanel.add("group");
        var labelStatic3 = labelGroup3.add("statictext", undefined, "Bar Label 3");
        var labelEdit3 = labelGroup3.add("edittext", undefined, "");
        labelEdit3.characters = 18; 
        var labelGroup4 = labelPanel.add("group");
        var labelStatic4 = labelGroup4.add("statictext", undefined, "Bar Label 4");
        var labelEdit4 = labelGroup4.add("edittext", undefined, "");
        labelEdit4.characters = 18;         
        var labelGroup5 = labelPanel.add("group");
        var labelStatic5 = labelGroup5.add("statictext", undefined, "Bar Label 5");
        var labelEdit5 = labelGroup5.add("edittext", undefined, "");
        labelEdit5.characters = 18; 
        var labelGroup6 = labelPanel.add("group");
        var labelStatic6 = labelGroup6.add("statictext", undefined, "Bar Label 6");
        var labelEdit6 = labelGroup6.add("edittext", undefined, "");
        labelEdit6.characters = 18;  
        var labelGroup7 = labelPanel2.add("group");
        var labelStatic7 = labelGroup7.add("statictext", undefined, "Bar Label 7");
        var labelEdit7 = labelGroup7.add("edittext", undefined, "");
        labelEdit7.characters = 18;    
        var labelGroup8 = labelPanel2.add("group");
        var labelStatic8 = labelGroup8.add("statictext", undefined, "Bar Label 8");
        var labelEdit8 = labelGroup8.add("edittext", undefined, "");
        labelEdit8.characters = 18;  
        var labelGroup9 = labelPanel2.add("group");
        var labelStatic9 = labelGroup9.add("statictext", undefined, "Bar Label 9");
        var labelEdit9 = labelGroup9.add("edittext", undefined, "");
        labelEdit9.characters = 18;  
        var labelGroup10 = labelPanel2.add("group");
        var labelStatic10 = labelGroup10.add("statictext", undefined, "Bar Label 10");
        var labelEdit10 = labelGroup10.add("edittext", undefined, "");
        labelEdit10.characters = 18;    
        var labelGroup11 = labelPanel2.add("group");
        var labelStatic11 = labelGroup11.add("statictext", undefined, "Bar Label 11");
        var labelEdit11 = labelGroup11.add("edittext", undefined, "");
        labelEdit11.characters = 18;            
        var labelGroup12 = labelPanel2.add("group");
        var labelStatic12 = labelGroup12.add("statictext", undefined, "Bar Label 12");
        var labelEdit12 = labelGroup12.add("edittext", undefined, "");
        labelEdit12.characters = 18;            
} 
        
    //Buttons
    var initialButtonGroup = labelUI.add("group");
    var labelAlrightButton = initialButtonGroup.add("button", undefined, "OK");
    var labelCancelButton = initialButtonGroup.add("button", undefined, "Cancel");

    initialButtonGroup.orientation = "row";
    
        //Set Text as defined in UI
        labelAlrightButton.onClick = function() {
            labelUI.close();
            }
        labelCancelButton.onClick = function() {
            cancelCheck = true;
            labelUI.close();
            }
    
    labelUI.show();

//Point Labels    
if (totalBars == 1) {
    var barLabel1 = labelEdit1.text;
} else if (totalBars == 2) {
    var barLabel1 = labelEdit1.text;
    var barLabel2 = labelEdit2.text;
} else if (totalBars == 3) {
    var barLabel1 = labelEdit1.text;
    var barLabel2 = labelEdit2.text;
    var barLabel3 = labelEdit3.text;  
} else if (totalBars == 4) {
    var barLabel1 = labelEdit1.text;
    var barLabel2 = labelEdit2.text;
    var barLabel3 = labelEdit3.text;  
    var barLabel4 = labelEdit4.text;
} else if (totalBars == 5) {
    var barLabel1 = labelEdit1.text;
    var barLabel2 = labelEdit2.text;
    var barLabel3 = labelEdit3.text;  
    var barLabel4 = labelEdit4.text;
    var barLabel5 = labelEdit5.text;
} else if (totalBars == 6) {
    var barLabel1 = labelEdit1.text;
    var barLabel2 = labelEdit2.text;
    var barLabel3 = labelEdit3.text;  
    var barLabel4 = labelEdit4.text;
    var barLabel5 = labelEdit5.text;
    var barLabel6 = labelEdit6.text;  
} else if (totalBars == 7) {
    var barLabel1 = labelEdit1.text;
    var barLabel2 = labelEdit2.text;
    var barLabel3 = labelEdit3.text;  
    var barLabel4 = labelEdit4.text;
    var barLabel5 = labelEdit5.text;
    var barLabel6 = labelEdit6.text;  
    var barLabel7 = labelEdit7.text;
} else if (totalBars == 8) {
    var barLabel1 = labelEdit1.text;
    var barLabel2 = labelEdit2.text;
    var barLabel3 = labelEdit3.text;  
    var barLabel4 = labelEdit4.text;
    var barLabel5 = labelEdit5.text;
    var barLabel6 = labelEdit6.text;  
    var barLabel7 = labelEdit7.text;
    var barLabel8 = labelEdit8.text;
} else if (totalBars == 9) {
    var barLabel1 = labelEdit1.text;
    var barLabel2 = labelEdit2.text;
    var barLabel3 = labelEdit3.text;  
    var barLabel4 = labelEdit4.text;
    var barLabel5 = labelEdit5.text;
    var barLabel6 = labelEdit6.text;  
    var barLabel7 = labelEdit7.text;
    var barLabel8 = labelEdit8.text;
    var barLabel9 = labelEdit9.text;  
} else if (totalBars == 10) {
    var barLabel1 = labelEdit1.text;
    var barLabel2 = labelEdit2.text;
    var barLabel3 = labelEdit3.text;  
    var barLabel4 = labelEdit4.text;
    var barLabel5 = labelEdit5.text;
    var barLabel6 = labelEdit6.text;  
    var barLabel7 = labelEdit7.text;
    var barLabel8 = labelEdit8.text;
    var barLabel9 = labelEdit9.text;  
    var barLabel10 = labelEdit10.text;
} else if (totalBars == 11) {
    var barLabel1 = labelEdit1.text;
    var barLabel2 = labelEdit2.text;
    var barLabel3 = labelEdit3.text;  
    var barLabel4 = labelEdit4.text;
    var barLabel5 = labelEdit5.text;
    var barLabel6 = labelEdit6.text;  
    var barLabel7 = labelEdit7.text;
    var barLabel8 = labelEdit8.text;
    var barLabel9 = labelEdit9.text;  
    var barLabel10 = labelEdit10.text;
    var barLabel11 = labelEdit11.text;
} else if (totalBars == 12) {
    var barLabel1 = labelEdit1.text;
    var barLabel2 = labelEdit2.text;
    var barLabel3 = labelEdit3.text;  
    var barLabel4 = labelEdit4.text;
    var barLabel5 = labelEdit5.text;
    var barLabel6 = labelEdit6.text;  
    var barLabel7 = labelEdit7.text;
    var barLabel8 = labelEdit8.text;
    var barLabel9 = labelEdit9.text;  
    var barLabel10 = labelEdit10.text;
    var barLabel11 = labelEdit11.text;
    var barLabel12 = labelEdit12.text;  
    }   
}
}
/////////////////CREATE MASTER CONTROL///////////////////

if (cancelCheck == false) {

//Start Undo Group
app.beginUndoGroup(scriptName);

//Building the Master Null
curItem.layers.addNull();  
curItem.selectedLayers[0].name = "MASTER CONTROL";

alert("DEBUG: horBarGraph - Master Null created, totalBars=" + totalBars);

//Attach Controls to the the Master Null
for (var x = 1; x <= totalBars; x++) {
    curItem.selectedLayers[0].Effects.addProperty("Slider Control");
    curItem.selectedLayers[0].Effects.addProperty("Color Control");
    
    var valueNumber;
    var colorCont = randomBarColor();

    if (x == 1) {
        var valueNumber = master1;
    } else if (x == 2) {
        var valueNumber = master2;
    } else if (x == 3) {
        var valueNumber = master3;
    } else if (x == 4) {
        var valueNumber = master4;
    } else if (x == 5) {
        var valueNumber = master5;
    } else if (x == 6) {
        var valueNumber = master6;
    } else if (x == 7) {
        var valueNumber = master7;
    } else if (x == 8) {
        var valueNumber = master8;
    } else if (x == 9) {
        var valueNumber = master9;
    } else if (x == 10) {
        var valueNumber = master10;
    } else if (x == 11) {
       var valueNumber = master11;
    } else if (x == 12) {
       var valueNumber = master12;
    }

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

alert("DEBUG: horBarGraph - attach loop complete");

//////////////////CREATE BARS AND ANIMATION/////////////////////


//Create the set number of Bars 
for (var x = 1; x <= totalBars; x++) {
    
    //BAR MAKER FUNCTION    
    vBarMaker(x);
    if (x == 1) {
        alert("DEBUG: horBarGraph - vBarMaker returned OK for bar 1");
    }
    
    //Parenting
    curItem.layer(1).parent = curItem.layer(2);
    curItem.layer(2).parent = curItem.layer((x*3)+1);
    curItem.layer(3).parent = curItem.layer((x*3)+1);
    
    //Rename Bar Layer
    curItem.layer(3).name = "Bar " + x;
    
    //EXPRESSIONS    
        
    //% Expressions
    curItem.layer(1).position.expression = "x = transform.position[0]; y = transform.position[1]; if (thisComp.layer(\"MASTER CONTROL\").effect(\"Value Amount " + x + "\")(\"Slider\") < 9) { [x/1.65,y] } else { [x,y] }"    
   
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

alert("DEBUG: horBarGraph - create-bars loop complete, building background");


/////////CREATE BACKGROUND//////////

//Create the Vertical Bar
curItem.layers.addSolid([255,255,255],"Vertical Bar", Math.round(detVar*.02), detVar, pxlAsp);
curItem.selectedLayers[0].label = 9;

var background1LayerWidth = curItem.selectedLayers[0].width/2;       //Layer Width
var background1LayerHeight = curItem.selectedLayers[0].height/2;     //Layer Height

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

curItem.selectedLayers[0].position.setValue([0, curPositionY]);

//Create the Horizontal Bar
curItem.layers.addSolid([255,255,255],"Horizontal Bar", Math.round((totalBars/7) * curItem.width), Math.round(detVar*.02), pxlAsp);
curItem.selectedLayers[0].label = 9;

var background1LayerWidth = curItem.selectedLayers[0].width/2;       //Layer Width
var background1LayerHeight = curItem.selectedLayers[0].height/2;     //Layer Height

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

curItem.selectedLayers[0].position.setValue([0, curItem.height*.992]);


//Center All Objects
for(x = 1; x <= totalBars; x++) {
        curItem.layer((x*3)+2).parent = curItem.layer(1);
        }

var centerYone = curItem.layer(1).position.value[1];
var centerYtwo = curItem.layer(2).position.value[1];

curItem.layer(1).position.setValue([(curItem.width*.0712)*(7-totalBars),centerYone]);
curItem.layer(2).position.setValue([(curItem.width*.0712)*(7-totalBars),centerYtwo]);

for(x = 1; x <= totalBars; x++) {
     curItem.layer((x*3)+2).parent = curItem.layer((totalBars*3)+3);   
     }

//Parent Bars
curItem.layer(1).parent = curItem.layer((totalBars*3)+3);
curItem.layer(2).parent = curItem.layer((totalBars*3)+3);

//Create Background
curItem.layers.addSolid([0,0,0],"Back Plate", Math.round((totalBars/7) * curItem.width), detVar, pxlAsp);
curItem.selectedLayers[0].label = 9;
curItem.selectedLayers[0].opacity.setValue([15]);
curItem.selectedLayers[0].anchorPoint.setValue([0,detVar]);
curItem.selectedLayers[0].position.setValue([(curItem.width*.0712)*(7-totalBars),centerYone]);
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
                if (x == 1) {
                    var label = barLabel1;
                    } else if (x == 2) {
                    var label = barLabel2;
                    } else if (x == 3) {
                    var label = barLabel3;
                    } else if (x == 4) {
                    var label = barLabel4;
                    } else if (x == 5) {
                    var label = barLabel5;
                    } else if (x == 6) {
                    var label = barLabel6;
                    } else if (x == 7) {
                    var label = barLabel7;
                    } else if (x == 8) {
                    var label = barLabel8;
                    } else if (x == 9) {
                    var label = barLabel9;
                    } else if (x == 10) {
                    var label = barLabel10;
                    } else if (x == 11) {
                    var label = barLabel11;
                    } else if (x == 12) {
                    var label = barLabel12;
                    }
                
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

curItem.layers.precompose(precomposeArray, "Horizontal Bar Graph", true);

//Move to Correct Time Period
var timeSetTo = (2.5+((totalBars-1)/2))+1;
app.project.activeItem.time = timeSetTo;

//End Undo Group
app.endUndoGroup();
alert("DEBUG: horBarGraph - reached end of function (endUndoGroup done)");

} //Cancel Check Wrapping

//**********************************************************//
//////////////////FUNCTIONS/////////////////////////
function vBarMaker(spacingAmount) {
    
        //Create the Bar
        var barWidth = Math.round(detVar*.16);
        var barHeight = detVar;
        createBarShape("Bar", barWidth, barHeight, spacingAmount);
        if (spacingAmount == 1) {
            alert("DEBUG: vBarMaker(hor) - shape created for bar 1, barWidth=" + barWidth + " barHeight=" + barHeight);
        }
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
        curItem.layer(1).position.setValue([curPositionX - moveX, curPositionY - moveY]); 
        
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
        centerDoc.fontSize = detVar*.11296;
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
        perDoc.fontSize = detVar*.0540;
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
function vertBarGraph(pTotalBars, pMinText, pMaxText, pBarLabel, pPerLabel, pAxisLabel) {
alert("DEBUG: vertBarGraph started, pTotalBars=" + pTotalBars);


//Set Up
var scriptName = "Vertical Bar Graph";  
var curItem = app.project.activeItem;
var detVar = curItem.height;
var pxlAsp = curItem.pixelAspect;

var checkEx;

var cancelCheck = false;

//Value Holding Amounts
var master1 = 75;
var master2 = 80;
var master3 = 40;
var master4 = 50;
var master5 = 90;
var master6 = 10;
var master7 = 23;
var master8 = 70;
var master9 = 60;
var master10 = 30;
var master11 = 45;
var master12 = 35;

var totalBars = pTotalBars;

var barLabel1 = "January";
var barLabel2 = "February";
var barLabel3 = "March";
var barLabel4 = "April";
var barLabel5 = "May";
var barLabel6 = "June";
var barLabel7 = "July";
var barLabel8 = "August";
var barLabel9 = "September";
var barLabel10 = "October";
var barLabel11 = "November";
var barLabel12 = "December";

//Determine Max and Min Amounts
var maxLine = pMaxText;
var minLine = pMinText;
var maxMinDifference = (100/(maxLine - minLine))*.01;
var minMaxMiddle = (maxLine+minLine)/2;

var perCheck = pPerLabel;
var textCheck = pBarLabel;
var labelCheck = pAxisLabel;

/////////////////SECONDARY UI CONSTRUCTION//////////////
//Initial UI Construction
var masterUI = new Window("dialog");
var headTitle = masterUI.add("statictext", undefined, "Bar Graph Data");

var sliderPanel = masterUI.add("group");

if (totalBars == 1) {
    var sliderPanelGroup1 = sliderPanel.add("panel");
    var subtitle1 = sliderPanelGroup1.add("statictext", undefined, "Value 1");
    var slider1Group = sliderPanelGroup1.add("group");

    var slider1= slider1Group.add("slider", undefined, maxLine, minLine, maxLine);
    
    slider1.value= minMaxMiddle;
    slider1.size = "width: 200, height: 18";
    
    var sliderVal1 = slider1Group.add("edittext", undefined, slider1.value);
    
    sliderVal1.characters = 5;
   
    sliderPanelGroup1.orientation = "column";
    slider1Group.orientation = "row";
   
    slider1.onChanging = function() {var val1 = Math.round(slider1.value); sliderVal1.text = val1; }
    sliderVal1.onChanging = function() {var val1 = Math.round(sliderVal1.text); slider1.value = val1; }
    
    sliderPanel.orientation = "row";
    
    //Buttons
    var buttonGroup = masterUI.add("group");
    var alrightButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    buttonGroup.orientation = "row";
    
    //Set Text as defined in UI
    alrightButton.onClick = function() {
            master1 = Math.round(slider1.value);
            masterUI.close();
            }
     cancelButton.onClick = function() {
            cancelCheck = true;      
            masterUI.close();
            }
        
     masterUI.show();
} else if (totalBars  == 2) {
    var sliderPanelGroup1 = sliderPanel.add("panel");
    var subtitle1 = sliderPanelGroup1.add("statictext", undefined, "Value 1");
    var slider1Group = sliderPanelGroup1.add("group");
    var subtitle2 = sliderPanelGroup1.add("statictext", undefined, "Value 2");
    var slider2Group = sliderPanelGroup1.add("group");

    var slider1= slider1Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider2= slider2Group.add("slider", undefined, maxLine, minLine, maxLine);
    
    slider1.value= minMaxMiddle;
    slider2.value= minMaxMiddle;
    slider1.size = "width: 200, height: 18";
    slider2.size = "width: 200, height: 18";
    
    var sliderVal1 = slider1Group.add("edittext", undefined, slider1.value);
    var sliderVal2 = slider2Group.add("edittext", undefined, slider2.value);
    
    sliderVal1.characters = 5;
    sliderVal2.characters = 5;
    
    sliderPanelGroup1.orientation = "column";
    slider1Group.orientation = "row";
    slider2Group.orientation = "row";
   
    slider1.onChanging = function() {var val1 = Math.round(slider1.value); sliderVal1.text = val1; }
    sliderVal1.onChanging = function() {var val1 = Math.round(sliderVal1.text); slider1.value = val1; }
    slider2.onChanging = function() {var val2 = Math.round(slider2.value); sliderVal2.text = val2; }    
    sliderVal2.onChanging = function() {var val2 = Math.round(sliderVal2.text); slider2.value = val2; }
    
    sliderPanel.orientation = "row";
    
    //Buttons
    var buttonGroup = masterUI.add("group");
    var alrightButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    buttonGroup.orientation = "row";
    
    //Set Text as defined in UI
    alrightButton.onClick = function() {
            master1 = Math.round(slider1.value);
            master2 = Math.round(slider2.value);
            masterUI.close();
            }
     cancelButton.onClick = function() {
            cancelCheck = true;      
            masterUI.close();
            }
        
     masterUI.show();
} else if (totalBars  == 3) {
    var sliderPanelGroup1 = sliderPanel.add("panel");
    var subtitle1 = sliderPanelGroup1.add("statictext", undefined, "Value 1");
    var slider1Group = sliderPanelGroup1.add("group");
    var subtitle2 = sliderPanelGroup1.add("statictext", undefined, "Value 2");
    var slider2Group = sliderPanelGroup1.add("group");
    var subtitle3 = sliderPanelGroup1.add("statictext", undefined, "Value 3");
    var slider3Group = sliderPanelGroup1.add("group");

    var slider1= slider1Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider2= slider2Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider3= slider3Group.add("slider", undefined, maxLine, minLine, maxLine);
    
    slider1.value= minMaxMiddle;
    slider2.value= minMaxMiddle;
    slider3.value= minMaxMiddle;
    slider1.size = "width: 200, height: 18";
    slider2.size = "width: 200, height: 18";
    slider3.size = "width: 200, height: 18";
    
    var sliderVal1 = slider1Group.add("edittext", undefined, slider1.value);
    var sliderVal2 = slider2Group.add("edittext", undefined, slider2.value);
    var sliderVal3 = slider3Group.add("edittext", undefined, slider3.value);
    
    sliderVal1.characters = 5;
    sliderVal2.characters = 5;
    sliderVal3.characters = 5;
    
    sliderPanelGroup1.orientation = "column";
    slider1Group.orientation = "row";
    slider2Group.orientation = "row";
    slider3Group.orientation = "row";
   
    slider1.onChanging = function() {var val1 = Math.round(slider1.value); sliderVal1.text = val1; }
    sliderVal1.onChanging = function() {var val1 = Math.round(sliderVal1.text); slider1.value = val1; }
    slider2.onChanging = function() {var val2 = Math.round(slider2.value); sliderVal2.text = val2; }    
    sliderVal2.onChanging = function() {var val2 = Math.round(sliderVal2.text); slider2.value = val2; }
    slider3.onChanging = function() {var val3 = Math.round(slider3.value); sliderVal3.text = val3; }
    sliderVal3.onChanging = function() {var val3 = Math.round(sliderVal3.text); slider3.value = val3; }
    
    sliderPanel.orientation = "row";
    
    //Buttons
    var buttonGroup = masterUI.add("group");
    var alrightButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    buttonGroup.orientation = "row";
    
    //Set Text as defined in UI
    alrightButton.onClick = function() {
            master1 = Math.round(slider1.value);
            master2 = Math.round(slider2.value);
            master3 = Math.round(slider3.value);
            masterUI.close();
            }
     cancelButton.onClick = function() {
            cancelCheck = true;      
            masterUI.close();
            }
        
     masterUI.show();
} else if (totalBars  == 4) {
    var sliderPanelGroup1 = sliderPanel.add("panel");
    var subtitle1 = sliderPanelGroup1.add("statictext", undefined, "Value 1");
    var slider1Group = sliderPanelGroup1.add("group");
    var subtitle2 = sliderPanelGroup1.add("statictext", undefined, "Value 2");
    var slider2Group = sliderPanelGroup1.add("group");
    var subtitle3 = sliderPanelGroup1.add("statictext", undefined, "Value 3");
    var slider3Group = sliderPanelGroup1.add("group");
    var subtitle4 = sliderPanelGroup1.add("statictext", undefined, "Value 4");
    var slider4Group = sliderPanelGroup1.add("group");

    var slider1= slider1Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider2= slider2Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider3= slider3Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider4= slider4Group.add("slider", undefined, maxLine, minLine, maxLine);
    
    slider1.value= minMaxMiddle;
    slider2.value= minMaxMiddle;
    slider3.value= minMaxMiddle;
    slider4.value= minMaxMiddle;
    slider1.size = "width: 200, height: 18";
    slider2.size = "width: 200, height: 18";
    slider3.size = "width: 200, height: 18";
    slider4.size = "width: 200, height: 18";
    
    var sliderVal1 = slider1Group.add("edittext", undefined, slider1.value);
    var sliderVal2 = slider2Group.add("edittext", undefined, slider2.value);
    var sliderVal3 = slider3Group.add("edittext", undefined, slider3.value);
    var sliderVal4 = slider4Group.add("edittext", undefined, slider4.value);
    
    sliderVal1.characters = 5;
    sliderVal2.characters = 5;
    sliderVal3.characters = 5;
    sliderVal4.characters = 5;
    
    sliderPanelGroup1.orientation = "column";
    slider1Group.orientation = "row";
    slider2Group.orientation = "row";
    slider3Group.orientation = "row";
    slider4Group.orientation = "row";
   
    slider1.onChanging = function() {var val1 = Math.round(slider1.value); sliderVal1.text = val1; }
    sliderVal1.onChanging = function() {var val1 = Math.round(sliderVal1.text); slider1.value = val1; }
    slider2.onChanging = function() {var val2 = Math.round(slider2.value); sliderVal2.text = val2; }    
    sliderVal2.onChanging = function() {var val2 = Math.round(sliderVal2.text); slider2.value = val2; }
    slider3.onChanging = function() {var val3 = Math.round(slider3.value); sliderVal3.text = val3; }
    sliderVal3.onChanging = function() {var val3 = Math.round(sliderVal3.text); slider3.value = val3; }
    slider4.onChanging = function() {var val4 = Math.round(slider4.value); sliderVal4.text = val4; }
    sliderVal4.onChanging = function() {var val4 = Math.round(sliderVal4.text); slider4.value = val4; }
    
    sliderPanel.orientation = "row";
    
    //Buttons
    var buttonGroup = masterUI.add("group");
    var alrightButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    buttonGroup.orientation = "row";
    
    //Set Text as defined in UI
    alrightButton.onClick = function() {
            master1 = Math.round(slider1.value);
            master2 = Math.round(slider2.value);
            master3 = Math.round(slider3.value);
            master4 = Math.round(slider4.value);            
            masterUI.close();
            }
     cancelButton.onClick = function() {
            cancelCheck = true;      
            masterUI.close();
            }
        
     masterUI.show();
} else if (totalBars == 5) {
    var sliderPanelGroup1 = sliderPanel.add("panel");
    var subtitle1 = sliderPanelGroup1.add("statictext", undefined, "Value 1");
    var slider1Group = sliderPanelGroup1.add("group");
    var subtitle2 = sliderPanelGroup1.add("statictext", undefined, "Value 2");
    var slider2Group = sliderPanelGroup1.add("group");
    var subtitle3 = sliderPanelGroup1.add("statictext", undefined, "Value 3");
    var slider3Group = sliderPanelGroup1.add("group");
    var subtitle4 = sliderPanelGroup1.add("statictext", undefined, "Value 4");
    var slider4Group = sliderPanelGroup1.add("group");
    var subtitle5 = sliderPanelGroup1.add("statictext", undefined, "Value 5");
    var slider5Group = sliderPanelGroup1.add("group");

    var slider1= slider1Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider2= slider2Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider3= slider3Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider4= slider4Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider5= slider5Group.add("slider", undefined, maxLine, minLine, maxLine);
    
    slider1.value= minMaxMiddle;
    slider2.value= minMaxMiddle;
    slider3.value= minMaxMiddle;
    slider4.value= minMaxMiddle;
    slider5.value= minMaxMiddle;
    slider1.size = "width: 200, height: 18";
    slider2.size = "width: 200, height: 18";
    slider3.size = "width: 200, height: 18";
    slider4.size = "width: 200, height: 18";
    slider5.size = "width: 200, height: 18";
    
    var sliderVal1 = slider1Group.add("edittext", undefined, slider1.value);
    var sliderVal2 = slider2Group.add("edittext", undefined, slider2.value);
    var sliderVal3 = slider3Group.add("edittext", undefined, slider3.value);
    var sliderVal4 = slider4Group.add("edittext", undefined, slider4.value);
    var sliderVal5 = slider5Group.add("edittext", undefined, slider5.value);
    
    sliderVal1.characters = 5;
    sliderVal2.characters = 5;
    sliderVal3.characters = 5;
    sliderVal4.characters = 5;
    sliderVal5.characters = 5;
    
    sliderPanelGroup1.orientation = "column";
    slider1Group.orientation = "row";
    slider2Group.orientation = "row";
    slider3Group.orientation = "row";
    slider4Group.orientation = "row";
    slider5Group.orientation = "row";
   
    slider1.onChanging = function() {var val1 = Math.round(slider1.value); sliderVal1.text = val1; }
    sliderVal1.onChanging = function() {var val1 = Math.round(sliderVal1.text); slider1.value = val1; }
    slider2.onChanging = function() {var val2 = Math.round(slider2.value); sliderVal2.text = val2; }    
    sliderVal2.onChanging = function() {var val2 = Math.round(sliderVal2.text); slider2.value = val2; }
    slider3.onChanging = function() {var val3 = Math.round(slider3.value); sliderVal3.text = val3; }
    sliderVal3.onChanging = function() {var val3 = Math.round(sliderVal3.text); slider3.value = val3; }
    slider4.onChanging = function() {var val4 = Math.round(slider4.value); sliderVal4.text = val4; }
    sliderVal4.onChanging = function() {var val4 = Math.round(sliderVal4.text); slider4.value = val4; }
    slider5.onChanging = function() {var val5 = Math.round(slider5.value); sliderVal5.text = val5; }
    sliderVal5.onChanging = function() {var val5 = Math.round(sliderVal5.text); slider5.value = val5; }
    
    sliderPanel.orientation = "row";
    
    //Buttons
    var buttonGroup = masterUI.add("group");
    var alrightButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    buttonGroup.orientation = "row";
    
    //Set Text as defined in UI
    alrightButton.onClick = function() {
            master1 = Math.round(slider1.value);
            master2 = Math.round(slider2.value);
            master3 = Math.round(slider3.value);
            master4 = Math.round(slider4.value);            
            master5 = Math.round(slider5.value);                
            masterUI.close();
            }
     cancelButton.onClick = function() {
            cancelCheck = true;      
            masterUI.close();
            }
        
     masterUI.show();
} else if (totalBars == 6) {
    var sliderPanelGroup1 = sliderPanel.add("panel");
    var subtitle1 = sliderPanelGroup1.add("statictext", undefined, "Value 1");
    var slider1Group = sliderPanelGroup1.add("group");
    var subtitle2 = sliderPanelGroup1.add("statictext", undefined, "Value 2");
    var slider2Group = sliderPanelGroup1.add("group");
    var subtitle3 = sliderPanelGroup1.add("statictext", undefined, "Value 3");
    var slider3Group = sliderPanelGroup1.add("group");
    var subtitle4 = sliderPanelGroup1.add("statictext", undefined, "Value 4");
    var slider4Group = sliderPanelGroup1.add("group");
    var subtitle5 = sliderPanelGroup1.add("statictext", undefined, "Value 5");
    var slider5Group = sliderPanelGroup1.add("group");
    var subtitle6 = sliderPanelGroup1.add("statictext", undefined, "Value 6");
    var slider6Group = sliderPanelGroup1.add("group");

    var slider1= slider1Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider2= slider2Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider3= slider3Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider4= slider4Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider5= slider5Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider6= slider6Group.add("slider", undefined, maxLine, minLine, maxLine);
    
    slider1.value= minMaxMiddle;
    slider2.value= minMaxMiddle;
    slider3.value= minMaxMiddle;
    slider4.value= minMaxMiddle;
    slider5.value= minMaxMiddle;
    slider6.value= minMaxMiddle;
    slider1.size = "width: 200, height: 18";
    slider2.size = "width: 200, height: 18";
    slider3.size = "width: 200, height: 18";
    slider4.size = "width: 200, height: 18";
    slider5.size = "width: 200, height: 18";
    slider6.size = "width: 200, height: 18";
    
    var sliderVal1 = slider1Group.add("edittext", undefined, slider1.value);
    var sliderVal2 = slider2Group.add("edittext", undefined, slider2.value);
    var sliderVal3 = slider3Group.add("edittext", undefined, slider3.value);
    var sliderVal4 = slider4Group.add("edittext", undefined, slider4.value);
    var sliderVal5 = slider5Group.add("edittext", undefined, slider5.value);
    var sliderVal6 = slider6Group.add("edittext", undefined, slider6.value);
    
    sliderVal1.characters = 5;
    sliderVal2.characters = 5;
    sliderVal3.characters = 5;
    sliderVal4.characters = 5;
    sliderVal5.characters = 5;
    sliderVal6.characters = 5;
    
    sliderPanelGroup1.orientation = "column";
    slider1Group.orientation = "row";
    slider2Group.orientation = "row";
    slider3Group.orientation = "row";
    slider4Group.orientation = "row";
    slider5Group.orientation = "row";
    slider6Group.orientation = "row";
   
    slider1.onChanging = function() {var val1 = Math.round(slider1.value); sliderVal1.text = val1; }
    sliderVal1.onChanging = function() {var val1 = Math.round(sliderVal1.text); slider1.value = val1; }
    slider2.onChanging = function() {var val2 = Math.round(slider2.value); sliderVal2.text = val2; }    
    sliderVal2.onChanging = function() {var val2 = Math.round(sliderVal2.text); slider2.value = val2; }
    slider3.onChanging = function() {var val3 = Math.round(slider3.value); sliderVal3.text = val3; }
    sliderVal3.onChanging = function() {var val3 = Math.round(sliderVal3.text); slider3.value = val3; }
    slider4.onChanging = function() {var val4 = Math.round(slider4.value); sliderVal4.text = val4; }
    sliderVal4.onChanging = function() {var val4 = Math.round(sliderVal4.text); slider4.value = val4; }
    slider5.onChanging = function() {var val5 = Math.round(slider5.value); sliderVal5.text = val5; }
    sliderVal5.onChanging = function() {var val5 = Math.round(sliderVal5.text); slider5.value = val5; }
    slider6.onChanging = function() {var val6 = Math.round(slider6.value); sliderVal6.text = val6; }
    sliderVal6.onChanging = function() {var val6 = Math.round(sliderVal6.text); slider6.value = val6; }
    
    sliderPanel.orientation = "row";
    
    //Buttons
    var buttonGroup = masterUI.add("group");
    var alrightButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    buttonGroup.orientation = "row";
    
    //Set Text as defined in UI
    alrightButton.onClick = function() {
            master1 = Math.round(slider1.value);
            master2 = Math.round(slider2.value);
            master3 = Math.round(slider3.value);
            master4 = Math.round(slider4.value);            
            master5 = Math.round(slider5.value);                
            master6 = Math.round(slider6.value);            
            masterUI.close();
            }
     cancelButton.onClick = function() {
            cancelCheck = true;      
            masterUI.close();
            }
        
     masterUI.show();
} else if (totalBars == 7) {
    var sliderPanelGroup1 = sliderPanel.add("panel");
    var subtitle1 = sliderPanelGroup1.add("statictext", undefined, "Value 1");
    var slider1Group = sliderPanelGroup1.add("group");
    var subtitle2 = sliderPanelGroup1.add("statictext", undefined, "Value 2");
    var slider2Group = sliderPanelGroup1.add("group");
    var subtitle3 = sliderPanelGroup1.add("statictext", undefined, "Value 3");
    var slider3Group = sliderPanelGroup1.add("group");
    var subtitle4 = sliderPanelGroup1.add("statictext", undefined, "Value 4");
    var slider4Group = sliderPanelGroup1.add("group");
    var subtitle5 = sliderPanelGroup1.add("statictext", undefined, "Value 5");
    var slider5Group = sliderPanelGroup1.add("group");
    var subtitle6 = sliderPanelGroup1.add("statictext", undefined, "Value 6");
    var slider6Group = sliderPanelGroup1.add("group");
    var subtitle7 = sliderPanelGroup1.add("statictext", undefined, "Value 7");
    var slider7Group = sliderPanelGroup1.add("group");

    var slider1= slider1Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider2= slider2Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider3= slider3Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider4= slider4Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider5= slider5Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider6= slider6Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider7= slider7Group.add("slider", undefined, maxLine, minLine, maxLine);
    
    slider1.value= minMaxMiddle;
    slider2.value= minMaxMiddle;
    slider3.value= minMaxMiddle;
    slider4.value= minMaxMiddle;
    slider5.value= minMaxMiddle;
    slider6.value= minMaxMiddle;
    slider7.value= minMaxMiddle;
    slider1.size = "width: 200, height: 18";
    slider2.size = "width: 200, height: 18";
    slider3.size = "width: 200, height: 18";
    slider4.size = "width: 200, height: 18";
    slider5.size = "width: 200, height: 18";
    slider6.size = "width: 200, height: 18";
    slider7.size = "width: 200, height: 18";
    
    var sliderVal1 = slider1Group.add("edittext", undefined, slider1.value);
    var sliderVal2 = slider2Group.add("edittext", undefined, slider2.value);
    var sliderVal3 = slider3Group.add("edittext", undefined, slider3.value);
    var sliderVal4 = slider4Group.add("edittext", undefined, slider4.value);
    var sliderVal5 = slider5Group.add("edittext", undefined, slider5.value);
    var sliderVal6 = slider6Group.add("edittext", undefined, slider6.value);
    var sliderVal7 = slider7Group.add("edittext", undefined, slider7.value);
    
    sliderVal1.characters = 5;
    sliderVal2.characters = 5;
    sliderVal3.characters = 5;
    sliderVal4.characters = 5;
    sliderVal5.characters = 5;
    sliderVal6.characters = 5;
    sliderVal7.characters = 5;
    
    sliderPanelGroup1.orientation = "column";
    slider1Group.orientation = "row";
    slider2Group.orientation = "row";
    slider3Group.orientation = "row";
    slider4Group.orientation = "row";
    slider5Group.orientation = "row";
    slider6Group.orientation = "row";
    slider7Group.orientation = "row";
   
    slider1.onChanging = function() {var val1 = Math.round(slider1.value); sliderVal1.text = val1; }
    sliderVal1.onChanging = function() {var val1 = Math.round(sliderVal1.text); slider1.value = val1; }
    slider2.onChanging = function() {var val2 = Math.round(slider2.value); sliderVal2.text = val2; }    
    sliderVal2.onChanging = function() {var val2 = Math.round(sliderVal2.text); slider2.value = val2; }
    slider3.onChanging = function() {var val3 = Math.round(slider3.value); sliderVal3.text = val3; }
    sliderVal3.onChanging = function() {var val3 = Math.round(sliderVal3.text); slider3.value = val3; }
    slider4.onChanging = function() {var val4 = Math.round(slider4.value); sliderVal4.text = val4; }
    sliderVal4.onChanging = function() {var val4 = Math.round(sliderVal4.text); slider4.value = val4; }
    slider5.onChanging = function() {var val5 = Math.round(slider5.value); sliderVal5.text = val5; }
    sliderVal5.onChanging = function() {var val5 = Math.round(sliderVal5.text); slider5.value = val5; }
    slider6.onChanging = function() {var val6 = Math.round(slider6.value); sliderVal6.text = val6; }
    sliderVal6.onChanging = function() {var val6 = Math.round(sliderVal6.text); slider6.value = val6; }
    slider7.onChanging = function() {var val7 = Math.round(slider7.value); sliderVal7.text = val7; }
    sliderVal7.onChanging = function() {var val7 = Math.round(sliderVal7.text); slider7.value = val7; }
    
    sliderPanel.orientation = "row";
    
    //Buttons
    var buttonGroup = masterUI.add("group");
    var alrightButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    buttonGroup.orientation = "row";
    
    //Set Text as defined in UI
    alrightButton.onClick = function() {
            master1 = Math.round(slider1.value);
            master2 = Math.round(slider2.value);
            master3 = Math.round(slider3.value);
            master4 = Math.round(slider4.value);            
            master5 = Math.round(slider5.value);                
            master6 = Math.round(slider6.value);            
            master7 = Math.round(slider7.value);
            masterUI.close();
            }
     cancelButton.onClick = function() {
            cancelCheck = true;      
            masterUI.close();
            }
        
     masterUI.show();
} else if (totalBars == 8) {
    var dualGroup  = sliderPanel.add("group"); 
    dualGroup.alignChildren = "top";
    
    var sliderPanelGroup1 = dualGroup.add("panel");
    var sliderPanelGroup2 = dualGroup.add("panel");
    
    var subtitle1 = sliderPanelGroup1.add("statictext", undefined, "Value 1");
    var slider1Group = sliderPanelGroup1.add("group");
    var subtitle2 = sliderPanelGroup1.add("statictext", undefined, "Value 2");
    var slider2Group = sliderPanelGroup1.add("group");
    var subtitle3 = sliderPanelGroup1.add("statictext", undefined, "Value 3");
    var slider3Group = sliderPanelGroup1.add("group");
    var subtitle4 = sliderPanelGroup1.add("statictext", undefined, "Value 4");
    var slider4Group = sliderPanelGroup1.add("group");
    var subtitle5 = sliderPanelGroup2.add("statictext", undefined, "Value 5");
    var slider5Group = sliderPanelGroup2.add("group");
    var subtitle6 = sliderPanelGroup2.add("statictext", undefined, "Value 6");
    var slider6Group = sliderPanelGroup2.add("group");
    var subtitle7 = sliderPanelGroup2.add("statictext", undefined, "Value 7");
    var slider7Group = sliderPanelGroup2.add("group");
    var subtitle8 = sliderPanelGroup2.add("statictext", undefined, "Value 8");
    var slider8Group = sliderPanelGroup2.add("group");

    var slider1= slider1Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider2= slider2Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider3= slider3Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider4= slider4Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider5= slider5Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider6= slider6Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider7= slider7Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider8= slider8Group.add("slider", undefined, maxLine, minLine, maxLine);
    
    slider1.value= minMaxMiddle;
    slider2.value= minMaxMiddle;
    slider3.value= minMaxMiddle;
    slider4.value= minMaxMiddle;
    slider5.value= minMaxMiddle;
    slider6.value= minMaxMiddle;
    slider7.value= minMaxMiddle;
    slider8.value= minMaxMiddle;
    slider1.size = "width: 200, height: 18";
    slider2.size = "width: 200, height: 18";
    slider3.size = "width: 200, height: 18";
    slider4.size = "width: 200, height: 18";
    slider5.size = "width: 200, height: 18";
    slider6.size = "width: 200, height: 18";
    slider7.size = "width: 200, height: 18";
    slider8.size = "width: 200, height: 18";
    
    var sliderVal1 = slider1Group.add("edittext", undefined, slider1.value);
    var sliderVal2 = slider2Group.add("edittext", undefined, slider2.value);
    var sliderVal3 = slider3Group.add("edittext", undefined, slider3.value);
    var sliderVal4 = slider4Group.add("edittext", undefined, slider4.value);
    var sliderVal5 = slider5Group.add("edittext", undefined, slider5.value);
    var sliderVal6 = slider6Group.add("edittext", undefined, slider6.value);
    var sliderVal7 = slider7Group.add("edittext", undefined, slider7.value);
    var sliderVal8 = slider8Group.add("edittext", undefined, slider8.value);
    
    sliderVal1.characters = 5;
    sliderVal2.characters = 5;
    sliderVal3.characters = 5;
    sliderVal4.characters = 5;
    sliderVal5.characters = 5;
    sliderVal6.characters = 5;
    sliderVal7.characters = 5;
    sliderVal8.characters = 5;
    
    dualGroup.orientation = "row";
    sliderPanelGroup1.orientation = "column";
    sliderPanelGroup2.orientation = "column";
    
    slider1Group.orientation = "row";
    slider2Group.orientation = "row";
    slider3Group.orientation = "row";
    slider4Group.orientation = "row";
    slider5Group.orientation = "row";
    slider6Group.orientation = "row";
    slider7Group.orientation = "row";
    slider8Group.orientation = "row";
   
    slider1.onChanging = function() {var val1 = Math.round(slider1.value); sliderVal1.text = val1; }
    sliderVal1.onChanging = function() {var val1 = Math.round(sliderVal1.text); slider1.value = val1; }
    slider2.onChanging = function() {var val2 = Math.round(slider2.value); sliderVal2.text = val2; }    
    sliderVal2.onChanging = function() {var val2 = Math.round(sliderVal2.text); slider2.value = val2; }
    slider3.onChanging = function() {var val3 = Math.round(slider3.value); sliderVal3.text = val3; }
    sliderVal3.onChanging = function() {var val3 = Math.round(sliderVal3.text); slider3.value = val3; }
    slider4.onChanging = function() {var val4 = Math.round(slider4.value); sliderVal4.text = val4; }
    sliderVal4.onChanging = function() {var val4 = Math.round(sliderVal4.text); slider4.value = val4; }
    slider5.onChanging = function() {var val5 = Math.round(slider5.value); sliderVal5.text = val5; }
    sliderVal5.onChanging = function() {var val5 = Math.round(sliderVal5.text); slider5.value = val5; }
    slider6.onChanging = function() {var val6 = Math.round(slider6.value); sliderVal6.text = val6; }
    sliderVal6.onChanging = function() {var val6 = Math.round(sliderVal6.text); slider6.value = val6; }
    slider7.onChanging = function() {var val7 = Math.round(slider7.value); sliderVal7.text = val7; }
    sliderVal7.onChanging = function() {var val7 = Math.round(sliderVal7.text); slider7.value = val7; }
    slider8.onChanging = function() {var val8 = Math.round(slider8.value); sliderVal8.text = val8; }
    sliderVal8.onChanging = function() {var val8 = Math.round(sliderVal8.text); slider8.value = val8; }
    
    sliderPanel.orientation = "row";
    
    //Buttons
    var buttonGroup = masterUI.add("group");
    var alrightButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    buttonGroup.orientation = "row";
    
    //Set Text as defined in UI
    alrightButton.onClick = function() {
            master1 = Math.round(slider1.value);
            master2 = Math.round(slider2.value);
            master3 = Math.round(slider3.value);
            master4 = Math.round(slider4.value);            
            master5 = Math.round(slider5.value);                
            master6 = Math.round(slider6.value);            
            master7 = Math.round(slider7.value);
            master8 = Math.round(slider8.value);
            masterUI.close();
            }
     cancelButton.onClick = function() {
            cancelCheck = true;      
            masterUI.close();
            }
        
     masterUI.show();
    
} else if (totalBars == 9) {
    var dualGroup  = sliderPanel.add("group"); 
    dualGroup.alignChildren = "top";
    
    var sliderPanelGroup1 = dualGroup.add("panel");
    var sliderPanelGroup2 = dualGroup.add("panel");
    
    var subtitle1 = sliderPanelGroup1.add("statictext", undefined, "Value 1");
    var slider1Group = sliderPanelGroup1.add("group");
    var subtitle2 = sliderPanelGroup1.add("statictext", undefined, "Value 2");
    var slider2Group = sliderPanelGroup1.add("group");
    var subtitle3 = sliderPanelGroup1.add("statictext", undefined, "Value 3");
    var slider3Group = sliderPanelGroup1.add("group");
    var subtitle4 = sliderPanelGroup1.add("statictext", undefined, "Value 4");
    var slider4Group = sliderPanelGroup1.add("group");
    var subtitle5 = sliderPanelGroup1.add("statictext", undefined, "Value 5");
    var slider5Group = sliderPanelGroup1.add("group");
    var subtitle6 = sliderPanelGroup2.add("statictext", undefined, "Value 6");
    var slider6Group = sliderPanelGroup2.add("group");
    var subtitle7 = sliderPanelGroup2.add("statictext", undefined, "Value 7");
    var slider7Group = sliderPanelGroup2.add("group");
    var subtitle8 = sliderPanelGroup2.add("statictext", undefined, "Value 8");
    var slider8Group = sliderPanelGroup2.add("group");
    var subtitle9 = sliderPanelGroup2.add("statictext", undefined, "Value 9");
    var slider9Group = sliderPanelGroup2.add("group");

    var slider1= slider1Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider2= slider2Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider3= slider3Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider4= slider4Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider5= slider5Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider6= slider6Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider7= slider7Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider8= slider8Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider9= slider9Group.add("slider", undefined, maxLine, minLine, maxLine);
    
    slider1.value= minMaxMiddle;
    slider2.value= minMaxMiddle;
    slider3.value= minMaxMiddle;
    slider4.value= minMaxMiddle;
    slider5.value= minMaxMiddle;
    slider6.value= minMaxMiddle;
    slider7.value= minMaxMiddle;
    slider8.value= minMaxMiddle;
    slider9.value= minMaxMiddle;
    slider1.size = "width: 200, height: 18";
    slider2.size = "width: 200, height: 18";
    slider3.size = "width: 200, height: 18";
    slider4.size = "width: 200, height: 18";
    slider5.size = "width: 200, height: 18";
    slider6.size = "width: 200, height: 18";
    slider7.size = "width: 200, height: 18";
    slider8.size = "width: 200, height: 18";
    slider9.size = "width: 200, height: 18";
    
    var sliderVal1 = slider1Group.add("edittext", undefined, slider1.value);
    var sliderVal2 = slider2Group.add("edittext", undefined, slider2.value);
    var sliderVal3 = slider3Group.add("edittext", undefined, slider3.value);
    var sliderVal4 = slider4Group.add("edittext", undefined, slider4.value);
    var sliderVal5 = slider5Group.add("edittext", undefined, slider5.value);
    var sliderVal6 = slider6Group.add("edittext", undefined, slider6.value);
    var sliderVal7 = slider7Group.add("edittext", undefined, slider7.value);
    var sliderVal8 = slider8Group.add("edittext", undefined, slider8.value);
    var sliderVal9 = slider9Group.add("edittext", undefined, slider9.value);
    
    sliderVal1.characters = 5;
    sliderVal2.characters = 5;
    sliderVal3.characters = 5;
    sliderVal4.characters = 5;
    sliderVal5.characters = 5;
    sliderVal6.characters = 5;
    sliderVal7.characters = 5;
    sliderVal8.characters = 5;
    sliderVal9.characters = 5;
    
    dualGroup.orientation = "row";
    sliderPanelGroup1.orientation = "column";
    sliderPanelGroup2.orientation = "column";
    
    slider1Group.orientation = "row";
    slider2Group.orientation = "row";
    slider3Group.orientation = "row";
    slider4Group.orientation = "row";
    slider5Group.orientation = "row";
    slider6Group.orientation = "row";
    slider7Group.orientation = "row";
    slider8Group.orientation = "row";
    slider9Group.orientation = "row";
   
    slider1.onChanging = function() {var val1 = Math.round(slider1.value); sliderVal1.text = val1; }
    sliderVal1.onChanging = function() {var val1 = Math.round(sliderVal1.text); slider1.value = val1; }
    slider2.onChanging = function() {var val2 = Math.round(slider2.value); sliderVal2.text = val2; }    
    sliderVal2.onChanging = function() {var val2 = Math.round(sliderVal2.text); slider2.value = val2; }
    slider3.onChanging = function() {var val3 = Math.round(slider3.value); sliderVal3.text = val3; }
    sliderVal3.onChanging = function() {var val3 = Math.round(sliderVal3.text); slider3.value = val3; }
    slider4.onChanging = function() {var val4 = Math.round(slider4.value); sliderVal4.text = val4; }
    sliderVal4.onChanging = function() {var val4 = Math.round(sliderVal4.text); slider4.value = val4; }
    slider5.onChanging = function() {var val5 = Math.round(slider5.value); sliderVal5.text = val5; }
    sliderVal5.onChanging = function() {var val5 = Math.round(sliderVal5.text); slider5.value = val5; }
    slider6.onChanging = function() {var val6 = Math.round(slider6.value); sliderVal6.text = val6; }
    sliderVal6.onChanging = function() {var val6 = Math.round(sliderVal6.text); slider6.value = val6; }
    slider7.onChanging = function() {var val7 = Math.round(slider7.value); sliderVal7.text = val7; }
    sliderVal7.onChanging = function() {var val7 = Math.round(sliderVal7.text); slider7.value = val7; }
    slider8.onChanging = function() {var val8 = Math.round(slider8.value); sliderVal8.text = val8; }
    sliderVal8.onChanging = function() {var val8 = Math.round(sliderVal8.text); slider8.value = val8; }
    slider9.onChanging = function() {var val9 = Math.round(slider9.value); sliderVal9.text = val9; }
    sliderVal9.onChanging = function() {var val9 = Math.round(sliderVal9.text); slider9.value = val9; }
    
    sliderPanel.orientation = "row";
    
    //Buttons
    var buttonGroup = masterUI.add("group");
    var alrightButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    buttonGroup.orientation = "row";
    
    //Set Text as defined in UI
    alrightButton.onClick = function() {
            master1 = Math.round(slider1.value);
            master2 = Math.round(slider2.value);
            master3 = Math.round(slider3.value);
            master4 = Math.round(slider4.value);            
            master5 = Math.round(slider5.value);                
            master6 = Math.round(slider6.value);            
            master7 = Math.round(slider7.value);
            master8 = Math.round(slider8.value);
            master9 = Math.round(slider9.value);
            masterUI.close();
            }
     cancelButton.onClick = function() {
            cancelCheck = true;      
            masterUI.close();
            }
        
     masterUI.show();

    
} else if (totalBars == 10) {
    var dualGroup  = sliderPanel.add("group"); 
    dualGroup.alignChildren = "top";
    
    var sliderPanelGroup1 = dualGroup.add("panel");
    var sliderPanelGroup2 = dualGroup.add("panel");
    
    var subtitle1 = sliderPanelGroup1.add("statictext", undefined, "Value 1");
    var slider1Group = sliderPanelGroup1.add("group");
    var subtitle2 = sliderPanelGroup1.add("statictext", undefined, "Value 2");
    var slider2Group = sliderPanelGroup1.add("group");
    var subtitle3 = sliderPanelGroup1.add("statictext", undefined, "Value 3");
    var slider3Group = sliderPanelGroup1.add("group");
    var subtitle4 = sliderPanelGroup1.add("statictext", undefined, "Value 4");
    var slider4Group = sliderPanelGroup1.add("group");
    var subtitle5 = sliderPanelGroup1.add("statictext", undefined, "Value 5");
    var slider5Group = sliderPanelGroup1.add("group");
    var subtitle6 = sliderPanelGroup2.add("statictext", undefined, "Value 6");
    var slider6Group = sliderPanelGroup2.add("group");
    var subtitle7 = sliderPanelGroup2.add("statictext", undefined, "Value 7");
    var slider7Group = sliderPanelGroup2.add("group");
    var subtitle8 = sliderPanelGroup2.add("statictext", undefined, "Value 8");
    var slider8Group = sliderPanelGroup2.add("group");
    var subtitle9 = sliderPanelGroup2.add("statictext", undefined, "Value 9");
    var slider9Group = sliderPanelGroup2.add("group");
    var subtitle10 = sliderPanelGroup2.add("statictext", undefined, "Value 10");
    var slider10Group = sliderPanelGroup2.add("group");

    var slider1= slider1Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider2= slider2Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider3= slider3Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider4= slider4Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider5= slider5Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider6= slider6Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider7= slider7Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider8= slider8Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider9= slider9Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider10= slider10Group.add("slider", undefined, maxLine, minLine, maxLine);
    
    slider1.value= minMaxMiddle;
    slider2.value= minMaxMiddle;
    slider3.value= minMaxMiddle;
    slider4.value= minMaxMiddle;
    slider5.value= minMaxMiddle;
    slider6.value= minMaxMiddle;
    slider7.value= minMaxMiddle;
    slider8.value= minMaxMiddle;
    slider9.value= minMaxMiddle;
    slider10.value= minMaxMiddle;
    slider1.size = "width: 200, height: 18";
    slider2.size = "width: 200, height: 18";
    slider3.size = "width: 200, height: 18";
    slider4.size = "width: 200, height: 18";
    slider5.size = "width: 200, height: 18";
    slider6.size = "width: 200, height: 18";
    slider7.size = "width: 200, height: 18";
    slider8.size = "width: 200, height: 18";
    slider9.size = "width: 200, height: 18";
    slider10.size = "width: 200, height: 18";
    
    var sliderVal1 = slider1Group.add("edittext", undefined, slider1.value);
    var sliderVal2 = slider2Group.add("edittext", undefined, slider2.value);
    var sliderVal3 = slider3Group.add("edittext", undefined, slider3.value);
    var sliderVal4 = slider4Group.add("edittext", undefined, slider4.value);
    var sliderVal5 = slider5Group.add("edittext", undefined, slider5.value);
    var sliderVal6 = slider6Group.add("edittext", undefined, slider6.value);
    var sliderVal7 = slider7Group.add("edittext", undefined, slider7.value);
    var sliderVal8 = slider8Group.add("edittext", undefined, slider8.value);
    var sliderVal9 = slider9Group.add("edittext", undefined, slider9.value);
    var sliderVal10 = slider10Group.add("edittext", undefined, slider10.value);
    
    sliderVal1.characters = 5;
    sliderVal2.characters = 5;
    sliderVal3.characters = 5;
    sliderVal4.characters = 5;
    sliderVal5.characters = 5;
    sliderVal6.characters = 5;
    sliderVal7.characters = 5;
    sliderVal8.characters = 5;
    sliderVal9.characters = 5;
    sliderVal10.characters = 5;
    
    dualGroup.orientation = "row";
    sliderPanelGroup1.orientation = "column";
    sliderPanelGroup2.orientation = "column";
    
    slider1Group.orientation = "row";
    slider2Group.orientation = "row";
    slider3Group.orientation = "row";
    slider4Group.orientation = "row";
    slider5Group.orientation = "row";
    slider6Group.orientation = "row";
    slider7Group.orientation = "row";
    slider8Group.orientation = "row";
    slider9Group.orientation = "row";
    slider10Group.orientation = "row";
   
    slider1.onChanging = function() {var val1 = Math.round(slider1.value); sliderVal1.text = val1; }
    sliderVal1.onChanging = function() {var val1 = Math.round(sliderVal1.text); slider1.value = val1; }
    slider2.onChanging = function() {var val2 = Math.round(slider2.value); sliderVal2.text = val2; }    
    sliderVal2.onChanging = function() {var val2 = Math.round(sliderVal2.text); slider2.value = val2; }
    slider3.onChanging = function() {var val3 = Math.round(slider3.value); sliderVal3.text = val3; }
    sliderVal3.onChanging = function() {var val3 = Math.round(sliderVal3.text); slider3.value = val3; }
    slider4.onChanging = function() {var val4 = Math.round(slider4.value); sliderVal4.text = val4; }
    sliderVal4.onChanging = function() {var val4 = Math.round(sliderVal4.text); slider4.value = val4; }
    slider5.onChanging = function() {var val5 = Math.round(slider5.value); sliderVal5.text = val5; }
    sliderVal5.onChanging = function() {var val5 = Math.round(sliderVal5.text); slider5.value = val5; }
    slider6.onChanging = function() {var val6 = Math.round(slider6.value); sliderVal6.text = val6; }
    sliderVal6.onChanging = function() {var val6 = Math.round(sliderVal6.text); slider6.value = val6; }
    slider7.onChanging = function() {var val7 = Math.round(slider7.value); sliderVal7.text = val7; }
    sliderVal7.onChanging = function() {var val7 = Math.round(sliderVal7.text); slider7.value = val7; }
    slider8.onChanging = function() {var val8 = Math.round(slider8.value); sliderVal8.text = val8; }
    sliderVal8.onChanging = function() {var val8 = Math.round(sliderVal8.text); slider8.value = val8; }
    slider9.onChanging = function() {var val9 = Math.round(slider9.value); sliderVal9.text = val9; }
    sliderVal9.onChanging = function() {var val9 = Math.round(sliderVal9.text); slider9.value = val9; }
    slider10.onChanging = function() {var val10 = Math.round(slider10.value); sliderVal10.text = val10; }
    sliderVal10.onChanging = function() {var val10 = Math.round(sliderVal10.text); slider10.value = val10; }
    
    sliderPanel.orientation = "row";
    
    //Buttons
    var buttonGroup = masterUI.add("group");
    var alrightButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    buttonGroup.orientation = "row";
    
    //Set Text as defined in UI
    alrightButton.onClick = function() {
            master1 = Math.round(slider1.value);
            master2 = Math.round(slider2.value);
            master3 = Math.round(slider3.value);
            master4 = Math.round(slider4.value);            
            master5 = Math.round(slider5.value);                
            master6 = Math.round(slider6.value);            
            master7 = Math.round(slider7.value);
            master8 = Math.round(slider8.value);
            master9 = Math.round(slider9.value);
            master10 = Math.round(slider10.value);
            masterUI.close();
            }
     cancelButton.onClick = function() {
            cancelCheck = true;      
            masterUI.close();
            }
        
     masterUI.show();

} else if (totalBars == 11) {
    var dualGroup  = sliderPanel.add("group"); 
    dualGroup.alignChildren = "top";
    
    var sliderPanelGroup1 = dualGroup.add("panel");
    var sliderPanelGroup2 = dualGroup.add("panel");
    
    var subtitle1 = sliderPanelGroup1.add("statictext", undefined, "Value 1");
    var slider1Group = sliderPanelGroup1.add("group");
    var subtitle2 = sliderPanelGroup1.add("statictext", undefined, "Value 2");
    var slider2Group = sliderPanelGroup1.add("group");
    var subtitle3 = sliderPanelGroup1.add("statictext", undefined, "Value 3");
    var slider3Group = sliderPanelGroup1.add("group");
    var subtitle4 = sliderPanelGroup1.add("statictext", undefined, "Value 4");
    var slider4Group = sliderPanelGroup1.add("group");
    var subtitle5 = sliderPanelGroup1.add("statictext", undefined, "Value 5");
    var slider5Group = sliderPanelGroup1.add("group");
    var subtitle6 = sliderPanelGroup1.add("statictext", undefined, "Value 6");
    var slider6Group = sliderPanelGroup1.add("group");
    var subtitle7 = sliderPanelGroup2.add("statictext", undefined, "Value 7");
    var slider7Group = sliderPanelGroup2.add("group");
    var subtitle8 = sliderPanelGroup2.add("statictext", undefined, "Value 8");
    var slider8Group = sliderPanelGroup2.add("group");
    var subtitle9 = sliderPanelGroup2.add("statictext", undefined, "Value 9");
    var slider9Group = sliderPanelGroup2.add("group");
    var subtitle10 = sliderPanelGroup2.add("statictext", undefined, "Value 10");
    var slider10Group = sliderPanelGroup2.add("group");
    var subtitle11 = sliderPanelGroup2.add("statictext", undefined, "Value 11");
    var slider11Group = sliderPanelGroup2.add("group");

    var slider1= slider1Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider2= slider2Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider3= slider3Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider4= slider4Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider5= slider5Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider6= slider6Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider7= slider7Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider8= slider8Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider9= slider9Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider10= slider10Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider11= slider11Group.add("slider", undefined, maxLine, minLine, maxLine);
    
    slider1.value= minMaxMiddle;
    slider2.value= minMaxMiddle;
    slider3.value= minMaxMiddle;
    slider4.value= minMaxMiddle;
    slider5.value= minMaxMiddle;
    slider6.value= minMaxMiddle;
    slider7.value= minMaxMiddle;
    slider8.value= minMaxMiddle;
    slider9.value= minMaxMiddle;
    slider10.value= minMaxMiddle;
    slider11.value= minMaxMiddle;
    slider1.size = "width: 200, height: 18";
    slider2.size = "width: 200, height: 18";
    slider3.size = "width: 200, height: 18";
    slider4.size = "width: 200, height: 18";
    slider5.size = "width: 200, height: 18";
    slider6.size = "width: 200, height: 18";
    slider7.size = "width: 200, height: 18";
    slider8.size = "width: 200, height: 18";
    slider9.size = "width: 200, height: 18";
    slider10.size = "width: 200, height: 18";
    slider11.size = "width: 200, height: 18";
    
    var sliderVal1 = slider1Group.add("edittext", undefined, slider1.value);
    var sliderVal2 = slider2Group.add("edittext", undefined, slider2.value);
    var sliderVal3 = slider3Group.add("edittext", undefined, slider3.value);
    var sliderVal4 = slider4Group.add("edittext", undefined, slider4.value);
    var sliderVal5 = slider5Group.add("edittext", undefined, slider5.value);
    var sliderVal6 = slider6Group.add("edittext", undefined, slider6.value);
    var sliderVal7 = slider7Group.add("edittext", undefined, slider7.value);
    var sliderVal8 = slider8Group.add("edittext", undefined, slider8.value);
    var sliderVal9 = slider9Group.add("edittext", undefined, slider9.value);
    var sliderVal10 = slider10Group.add("edittext", undefined, slider10.value);
    var sliderVal11 = slider11Group.add("edittext", undefined, slider11.value);
    
    sliderVal1.characters = 5;
    sliderVal2.characters = 5;
    sliderVal3.characters = 5;
    sliderVal4.characters = 5;
    sliderVal5.characters = 5;
    sliderVal6.characters = 5;
    sliderVal7.characters = 5;
    sliderVal8.characters = 5;
    sliderVal9.characters = 5;
    sliderVal10.characters = 5;
    sliderVal11.characters = 5;
    
    dualGroup.orientation = "row";
    sliderPanelGroup1.orientation = "column";
    sliderPanelGroup2.orientation = "column";
    
    slider1Group.orientation = "row";
    slider2Group.orientation = "row";
    slider3Group.orientation = "row";
    slider4Group.orientation = "row";
    slider5Group.orientation = "row";
    slider6Group.orientation = "row";
    slider7Group.orientation = "row";
    slider8Group.orientation = "row";
    slider9Group.orientation = "row";
    slider10Group.orientation = "row";
    slider11Group.orientation = "row";
   
    slider1.onChanging = function() {var val1 = Math.round(slider1.value); sliderVal1.text = val1; }
    sliderVal1.onChanging = function() {var val1 = Math.round(sliderVal1.text); slider1.value = val1; }
    slider2.onChanging = function() {var val2 = Math.round(slider2.value); sliderVal2.text = val2; }    
    sliderVal2.onChanging = function() {var val2 = Math.round(sliderVal2.text); slider2.value = val2; }
    slider3.onChanging = function() {var val3 = Math.round(slider3.value); sliderVal3.text = val3; }
    sliderVal3.onChanging = function() {var val3 = Math.round(sliderVal3.text); slider3.value = val3; }
    slider4.onChanging = function() {var val4 = Math.round(slider4.value); sliderVal4.text = val4; }
    sliderVal4.onChanging = function() {var val4 = Math.round(sliderVal4.text); slider4.value = val4; }
    slider5.onChanging = function() {var val5 = Math.round(slider5.value); sliderVal5.text = val5; }
    sliderVal5.onChanging = function() {var val5 = Math.round(sliderVal5.text); slider5.value = val5; }
    slider6.onChanging = function() {var val6 = Math.round(slider6.value); sliderVal6.text = val6; }
    sliderVal6.onChanging = function() {var val6 = Math.round(sliderVal6.text); slider6.value = val6; }
    slider7.onChanging = function() {var val7 = Math.round(slider7.value); sliderVal7.text = val7; }
    sliderVal7.onChanging = function() {var val7 = Math.round(sliderVal7.text); slider7.value = val7; }
    slider8.onChanging = function() {var val8 = Math.round(slider8.value); sliderVal8.text = val8; }
    sliderVal8.onChanging = function() {var val8 = Math.round(sliderVal8.text); slider8.value = val8; }
    slider9.onChanging = function() {var val9 = Math.round(slider9.value); sliderVal9.text = val9; }
    sliderVal9.onChanging = function() {var val9 = Math.round(sliderVal9.text); slider9.value = val9; }
    slider10.onChanging = function() {var val10 = Math.round(slider10.value); sliderVal10.text = val10; }
    sliderVal10.onChanging = function() {var val10 = Math.round(sliderVal10.text); slider10.value = val10; }
    slider11.onChanging = function() {var val11 = Math.round(slider11.value); sliderVal11.text = val11; }
    sliderVal11.onChanging = function() {var val11 = Math.round(sliderVal11.text); slider11.value = val11; }
    
    sliderPanel.orientation = "row";
    
    //Buttons
    var buttonGroup = masterUI.add("group");
    var alrightButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    buttonGroup.orientation = "row";
    
    //Set Text as defined in UI
    alrightButton.onClick = function() {
            master1 = Math.round(slider1.value);
            master2 = Math.round(slider2.value);
            master3 = Math.round(slider3.value);
            master4 = Math.round(slider4.value);            
            master5 = Math.round(slider5.value);                
            master6 = Math.round(slider6.value);            
            master7 = Math.round(slider7.value);
            master8 = Math.round(slider8.value);
            master9 = Math.round(slider9.value);
            master10 = Math.round(slider10.value);
            master11 = Math.round(slider11.value);
            masterUI.close();
            }
     cancelButton.onClick = function() {
            cancelCheck = true;      
            masterUI.close();
            }
        
     masterUI.show();
} else if (totalBars == 12) {
    var dualGroup  = sliderPanel.add("group"); 
    dualGroup.alignChildren = "top";
    
    var sliderPanelGroup1 = dualGroup.add("panel");
    var sliderPanelGroup2 = dualGroup.add("panel");
    
    var subtitle1 = sliderPanelGroup1.add("statictext", undefined, "Value 1");
    var slider1Group = sliderPanelGroup1.add("group");
    var subtitle2 = sliderPanelGroup1.add("statictext", undefined, "Value 2");
    var slider2Group = sliderPanelGroup1.add("group");
    var subtitle3 = sliderPanelGroup1.add("statictext", undefined, "Value 3");
    var slider3Group = sliderPanelGroup1.add("group");
    var subtitle4 = sliderPanelGroup1.add("statictext", undefined, "Value 4");
    var slider4Group = sliderPanelGroup1.add("group");
    var subtitle5 = sliderPanelGroup1.add("statictext", undefined, "Value 5");
    var slider5Group = sliderPanelGroup1.add("group");
    var subtitle6 = sliderPanelGroup1.add("statictext", undefined, "Value 6");
    var slider6Group = sliderPanelGroup1.add("group");
    var subtitle7 = sliderPanelGroup2.add("statictext", undefined, "Value 7");
    var slider7Group = sliderPanelGroup2.add("group");
    var subtitle8 = sliderPanelGroup2.add("statictext", undefined, "Value 8");
    var slider8Group = sliderPanelGroup2.add("group");
    var subtitle9 = sliderPanelGroup2.add("statictext", undefined, "Value 9");
    var slider9Group = sliderPanelGroup2.add("group");
    var subtitle10 = sliderPanelGroup2.add("statictext", undefined, "Value 10");
    var slider10Group = sliderPanelGroup2.add("group");
    var subtitle11 = sliderPanelGroup2.add("statictext", undefined, "Value 11");
    var slider11Group = sliderPanelGroup2.add("group");
    var subtitle12 = sliderPanelGroup2.add("statictext", undefined, "Value 12");
    var slider12Group = sliderPanelGroup2.add("group");

    var slider1= slider1Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider2= slider2Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider3= slider3Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider4= slider4Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider5= slider5Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider6= slider6Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider7= slider7Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider8= slider8Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider9= slider9Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider10= slider10Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider11= slider11Group.add("slider", undefined, maxLine, minLine, maxLine);
    var slider12= slider12Group.add("slider", undefined, maxLine, minLine, maxLine);

    
    slider1.value= minMaxMiddle;
    slider2.value= minMaxMiddle;
    slider3.value= minMaxMiddle;
    slider4.value= minMaxMiddle;
    slider5.value= minMaxMiddle;
    slider6.value= minMaxMiddle;
    slider7.value= minMaxMiddle;
    slider8.value= minMaxMiddle;
    slider9.value= minMaxMiddle;
    slider10.value= minMaxMiddle;
    slider11.value= minMaxMiddle;
    slider12.value= minMaxMiddle;
    slider1.size = "width: 200, height: 18";
    slider2.size = "width: 200, height: 18";
    slider3.size = "width: 200, height: 18";
    slider4.size = "width: 200, height: 18";
    slider5.size = "width: 200, height: 18";
    slider6.size = "width: 200, height: 18";
    slider7.size = "width: 200, height: 18";
    slider8.size = "width: 200, height: 18";
    slider9.size = "width: 200, height: 18";
    slider10.size = "width: 200, height: 18";
    slider11.size = "width: 200, height: 18";
    slider12.size = "width: 200, height: 18";
    
    var sliderVal1 = slider1Group.add("edittext", undefined, slider1.value);
    var sliderVal2 = slider2Group.add("edittext", undefined, slider2.value);
    var sliderVal3 = slider3Group.add("edittext", undefined, slider3.value);
    var sliderVal4 = slider4Group.add("edittext", undefined, slider4.value);
    var sliderVal5 = slider5Group.add("edittext", undefined, slider5.value);
    var sliderVal6 = slider6Group.add("edittext", undefined, slider6.value);
    var sliderVal7 = slider7Group.add("edittext", undefined, slider7.value);
    var sliderVal8 = slider8Group.add("edittext", undefined, slider8.value);
    var sliderVal9 = slider9Group.add("edittext", undefined, slider9.value);
    var sliderVal10 = slider10Group.add("edittext", undefined, slider10.value);
    var sliderVal11 = slider11Group.add("edittext", undefined, slider11.value);
    var sliderVal12 = slider12Group.add("edittext", undefined, slider12.value);
    
    sliderVal1.characters = 5;
    sliderVal2.characters = 5;
    sliderVal3.characters = 5;
    sliderVal4.characters = 5;
    sliderVal5.characters = 5;
    sliderVal6.characters = 5;
    sliderVal7.characters = 5;
    sliderVal8.characters = 5;
    sliderVal9.characters = 5;
    sliderVal10.characters = 5;
    sliderVal11.characters = 5;
    sliderVal12.characters = 5;
    
    dualGroup.orientation = "row";
    sliderPanelGroup1.orientation = "column";
    sliderPanelGroup2.orientation = "column";
    
    slider1Group.orientation = "row";
    slider2Group.orientation = "row";
    slider3Group.orientation = "row";
    slider4Group.orientation = "row";
    slider5Group.orientation = "row";
    slider6Group.orientation = "row";
    slider7Group.orientation = "row";
    slider8Group.orientation = "row";
    slider9Group.orientation = "row";
    slider10Group.orientation = "row";
    slider11Group.orientation = "row";
    slider12Group.orientation = "row";
   
    slider1.onChanging = function() {var val1 = Math.round(slider1.value); sliderVal1.text = val1; }
    sliderVal1.onChanging = function() {var val1 = Math.round(sliderVal1.text); slider1.value = val1; }
    slider2.onChanging = function() {var val2 = Math.round(slider2.value); sliderVal2.text = val2; }    
    sliderVal2.onChanging = function() {var val2 = Math.round(sliderVal2.text); slider2.value = val2; }
    slider3.onChanging = function() {var val3 = Math.round(slider3.value); sliderVal3.text = val3; }
    sliderVal3.onChanging = function() {var val3 = Math.round(sliderVal3.text); slider3.value = val3; }
    slider4.onChanging = function() {var val4 = Math.round(slider4.value); sliderVal4.text = val4; }
    sliderVal4.onChanging = function() {var val4 = Math.round(sliderVal4.text); slider4.value = val4; }
    slider5.onChanging = function() {var val5 = Math.round(slider5.value); sliderVal5.text = val5; }
    sliderVal5.onChanging = function() {var val5 = Math.round(sliderVal5.text); slider5.value = val5; }
    slider6.onChanging = function() {var val6 = Math.round(slider6.value); sliderVal6.text = val6; }
    sliderVal6.onChanging = function() {var val6 = Math.round(sliderVal6.text); slider6.value = val6; }
    slider7.onChanging = function() {var val7 = Math.round(slider7.value); sliderVal7.text = val7; }
    sliderVal7.onChanging = function() {var val7 = Math.round(sliderVal7.text); slider7.value = val7; }
    slider8.onChanging = function() {var val8 = Math.round(slider8.value); sliderVal8.text = val8; }
    sliderVal8.onChanging = function() {var val8 = Math.round(sliderVal8.text); slider8.value = val8; }
    slider9.onChanging = function() {var val9 = Math.round(slider9.value); sliderVal9.text = val9; }
    sliderVal9.onChanging = function() {var val9 = Math.round(sliderVal9.text); slider9.value = val9; }
    slider10.onChanging = function() {var val10 = Math.round(slider10.value); sliderVal10.text = val10; }
    sliderVal10.onChanging = function() {var val10 = Math.round(sliderVal10.text); slider10.value = val10; }
    slider11.onChanging = function() {var val11 = Math.round(slider11.value); sliderVal11.text = val11; }
    sliderVal11.onChanging = function() {var val11 = Math.round(sliderVal11.text); slider11.value = val11; }
    slider12.onChanging = function() {var val12 = Math.round(slider12.value); sliderVal12.text = val12; }
    sliderVal12.onChanging = function() {var val12 = Math.round(sliderVal12.text); slider12.value = val12; }
    
    sliderPanel.orientation = "row";
    
    //Buttons
    var buttonGroup = masterUI.add("group");
    var alrightButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    buttonGroup.orientation = "row";
    
    //Set Text as defined in UI
    alrightButton.onClick = function() {
            master1 = Math.round(slider1.value);
            master2 = Math.round(slider2.value);
            master3 = Math.round(slider3.value);
            master4 = Math.round(slider4.value);            
            master5 = Math.round(slider5.value);                
            master6 = Math.round(slider6.value);            
            master7 = Math.round(slider7.value);
            master8 = Math.round(slider8.value);
            master9 = Math.round(slider9.value);
            master10 = Math.round(slider10.value);
            master11 = Math.round(slider11.value);
            master12 = Math.round(slider12.value);
            masterUI.close();
            }
     cancelButton.onClick = function() {
            cancelCheck = true;  
            masterUI.close();
            }
        
     masterUI.show();
}

///////////LABEL UI////////////////////
if (cancelCheck == false) {
if (labelCheck == true) {
    
    //Label UI Construction
    var labelUI = new Window("dialog");
    var headTitle = labelUI.add("statictext", undefined, "Labels for Points");
    var labelMaster = labelUI.add("group");
    labelMaster.alignChildren = "top";
    var labelPanel = labelMaster.add("panel");
    if (totalBars > 8) {
        var labelPanel2 = labelMaster.add("panel");
    }
    
    if (totalBars == 1) {
        var labelGroup1 = labelPanel.add("group");
        var labelStatic1 = labelGroup1.add("statictext", undefined, "Bar Label 1");
        var labelEdit1 = labelGroup1.add("edittext", undefined, "");
        labelEdit1.characters = 30;
    } else if (totalBars == 2) {
        var labelGroup1 = labelPanel.add("group");
        var labelStatic1 = labelGroup1.add("statictext", undefined, "Bar Label 1");
        var labelEdit1 = labelGroup1.add("edittext", undefined, "");
        labelEdit1.characters = 30;
        var labelGroup2 = labelPanel.add("group");
        var labelStatic2 = labelGroup2.add("statictext", undefined, "Bar Label 2");
        var labelEdit2 = labelGroup2.add("edittext", undefined, "");
        labelEdit2.characters = 30;
   } else if (totalBars == 3) {
        var labelGroup1 = labelPanel.add("group");
        var labelStatic1 = labelGroup1.add("statictext", undefined, "Bar Label 1");
        var labelEdit1 = labelGroup1.add("edittext", undefined, "");
        labelEdit1.characters = 30;
        var labelGroup2 = labelPanel.add("group");
        var labelStatic2 = labelGroup2.add("statictext", undefined, "Bar Label 2");
        var labelEdit2 = labelGroup2.add("edittext", undefined, "");
        labelEdit2.characters = 30;       
        var labelGroup3 = labelPanel.add("group");
        var labelStatic3 = labelGroup3.add("statictext", undefined, "Bar Label 3");
        var labelEdit3 = labelGroup3.add("edittext", undefined, "");
        labelEdit3.characters = 30;           
    } else if (totalBars == 4) {
        var labelGroup1 = labelPanel.add("group");
        var labelStatic1 = labelGroup1.add("statictext", undefined, "Bar Label 1");
        var labelEdit1 = labelGroup1.add("edittext", undefined, "");
        labelEdit1.characters = 30;
        var labelGroup2 = labelPanel.add("group");
        var labelStatic2 = labelGroup2.add("statictext", undefined, "Bar Label 2");
        var labelEdit2 = labelGroup2.add("edittext", undefined, "");
        labelEdit2.characters = 30;       
        var labelGroup3 = labelPanel.add("group");
        var labelStatic3 = labelGroup3.add("statictext", undefined, "Bar Label 3");
        var labelEdit3 = labelGroup3.add("edittext", undefined, "");
        labelEdit3.characters = 30; 
        var labelGroup4 = labelPanel.add("group");
        var labelStatic4 = labelGroup4.add("statictext", undefined, "Bar Label 4");
        var labelEdit4 = labelGroup4.add("edittext", undefined, "");
        labelEdit4.characters = 30; 
    } else if (totalBars == 5) {
        var labelGroup1 = labelPanel.add("group");
        var labelStatic1 = labelGroup1.add("statictext", undefined, "Bar Label 1");
        var labelEdit1 = labelGroup1.add("edittext", undefined, "");
        labelEdit1.characters = 30;
        var labelGroup2 = labelPanel.add("group");
        var labelStatic2 = labelGroup2.add("statictext", undefined, "Bar Label 2");
        var labelEdit2 = labelGroup2.add("edittext", undefined, "");
        labelEdit2.characters = 30;       
        var labelGroup3 = labelPanel.add("group");
        var labelStatic3 = labelGroup3.add("statictext", undefined, "Bar Label 3");
        var labelEdit3 = labelGroup3.add("edittext", undefined, "");
        labelEdit3.characters = 30; 
        var labelGroup4 = labelPanel.add("group");
        var labelStatic4 = labelGroup4.add("statictext", undefined, "Bar Label 4");
        var labelEdit4 = labelGroup4.add("edittext", undefined, "");
        labelEdit4.characters = 30;         
        var labelGroup5 = labelPanel.add("group");
        var labelStatic5 = labelGroup5.add("statictext", undefined, "Bar Label 5");
        var labelEdit5 = labelGroup5.add("edittext", undefined, "");
        labelEdit5.characters = 30;      
    } else if (totalBars == 6) {
        var labelGroup1 = labelPanel.add("group");
        var labelStatic1 = labelGroup1.add("statictext", undefined, "Bar Label 1");
        var labelEdit1 = labelGroup1.add("edittext", undefined, "");
        labelEdit1.characters = 30;
        var labelGroup2 = labelPanel.add("group");
        var labelStatic2 = labelGroup2.add("statictext", undefined, "Bar Label 2");
        var labelEdit2 = labelGroup2.add("edittext", undefined, "");
        labelEdit2.characters = 30;       
        var labelGroup3 = labelPanel.add("group");
        var labelStatic3 = labelGroup3.add("statictext", undefined, "Bar Label 3");
        var labelEdit3 = labelGroup3.add("edittext", undefined, "");
        labelEdit3.characters = 30; 
        var labelGroup4 = labelPanel.add("group");
        var labelStatic4 = labelGroup4.add("statictext", undefined, "Bar Label 4");
        var labelEdit4 = labelGroup4.add("edittext", undefined, "");
        labelEdit4.characters = 30;         
        var labelGroup5 = labelPanel.add("group");
        var labelStatic5 = labelGroup5.add("statictext", undefined, "Bar Label 5");
        var labelEdit5 = labelGroup5.add("edittext", undefined, "");
        labelEdit5.characters = 30; 
        var labelGroup6 = labelPanel.add("group");
        var labelStatic6 = labelGroup6.add("statictext", undefined, "Bar Label 6");
        var labelEdit6 = labelGroup6.add("edittext", undefined, "");
        labelEdit6.characters = 30; 
    } else if (totalBars == 7) {
        var labelGroup1 = labelPanel.add("group");
        var labelStatic1 = labelGroup1.add("statictext", undefined, "Bar Label 1");
        var labelEdit1 = labelGroup1.add("edittext", undefined, "");
        labelEdit1.characters = 30;
        var labelGroup2 = labelPanel.add("group");
        var labelStatic2 = labelGroup2.add("statictext", undefined, "Bar Label 2");
        var labelEdit2 = labelGroup2.add("edittext", undefined, "");
        labelEdit2.characters = 30;       
        var labelGroup3 = labelPanel.add("group");
        var labelStatic3 = labelGroup3.add("statictext", undefined, "Bar Label 3");
        var labelEdit3 = labelGroup3.add("edittext", undefined, "");
        labelEdit3.characters = 30; 
        var labelGroup4 = labelPanel.add("group");
        var labelStatic4 = labelGroup4.add("statictext", undefined, "Bar Label 4");
        var labelEdit4 = labelGroup4.add("edittext", undefined, "");
        labelEdit4.characters = 30;         
        var labelGroup5 = labelPanel.add("group");
        var labelStatic5 = labelGroup5.add("statictext", undefined, "Bar Label 5");
        var labelEdit5 = labelGroup5.add("edittext", undefined, "");
        labelEdit5.characters = 30; 
        var labelGroup6 = labelPanel.add("group");
        var labelStatic6 = labelGroup6.add("statictext", undefined, "Bar Label 6");
        var labelEdit6 = labelGroup6.add("edittext", undefined, "");
        labelEdit6.characters = 30;  
        var labelGroup7 = labelPanel.add("group");
        var labelStatic7 = labelGroup7.add("statictext", undefined, "Bar Label 7");
        var labelEdit7 = labelGroup7.add("edittext", undefined, "");
        labelEdit7.characters = 30;    
    } else if (totalBars == 8) {
        var labelGroup1 = labelPanel.add("group");
        var labelStatic1 = labelGroup1.add("statictext", undefined, "Bar Label 1");
        var labelEdit1 = labelGroup1.add("edittext", undefined, "");
        labelEdit1.characters = 30;
        var labelGroup2 = labelPanel.add("group");
        var labelStatic2 = labelGroup2.add("statictext", undefined, "Bar Label 2");
        var labelEdit2 = labelGroup2.add("edittext", undefined, "");
        labelEdit2.characters = 30;       
        var labelGroup3 = labelPanel.add("group");
        var labelStatic3 = labelGroup3.add("statictext", undefined, "Bar Label 3");
        var labelEdit3 = labelGroup3.add("edittext", undefined, "");
        labelEdit3.characters = 30; 
        var labelGroup4 = labelPanel.add("group");
        var labelStatic4 = labelGroup4.add("statictext", undefined, "Bar Label 4");
        var labelEdit4 = labelGroup4.add("edittext", undefined, "");
        labelEdit4.characters = 30;         
        var labelGroup5 = labelPanel.add("group");
        var labelStatic5 = labelGroup5.add("statictext", undefined, "Bar Label 5");
        var labelEdit5 = labelGroup5.add("edittext", undefined, "");
        labelEdit5.characters = 30; 
        var labelGroup6 = labelPanel.add("group");
        var labelStatic6 = labelGroup6.add("statictext", undefined, "Bar Label 6");
        var labelEdit6 = labelGroup6.add("edittext", undefined, "");
        labelEdit6.characters = 30;  
        var labelGroup7 = labelPanel.add("group");
        var labelStatic7 = labelGroup7.add("statictext", undefined, "Bar Label 7");
        var labelEdit7 = labelGroup7.add("edittext", undefined, "");
        labelEdit7.characters = 30;    
        var labelGroup8 = labelPanel.add("group");
        var labelStatic8 = labelGroup8.add("statictext", undefined, "Bar Label 8");
        var labelEdit8 = labelGroup8.add("edittext", undefined, "");
        labelEdit8.characters = 30;    
    } else if (totalBars == 9) {
        var labelGroup1 = labelPanel.add("group");
        var labelStatic1 = labelGroup1.add("statictext", undefined, "Bar Label 1");
        var labelEdit1 = labelGroup1.add("edittext", undefined, "");
        labelEdit1.characters = 18;
        var labelGroup2 = labelPanel.add("group");
        var labelStatic2 = labelGroup2.add("statictext", undefined, "Bar Label 2");
        var labelEdit2 = labelGroup2.add("edittext", undefined, "");
        labelEdit2.characters = 18;       
        var labelGroup3 = labelPanel.add("group");
        var labelStatic3 = labelGroup3.add("statictext", undefined, "Bar Label 3");
        var labelEdit3 = labelGroup3.add("edittext", undefined, "");
        labelEdit3.characters = 18; 
        var labelGroup4 = labelPanel.add("group");
        var labelStatic4 = labelGroup4.add("statictext", undefined, "Bar Label 4");
        var labelEdit4 = labelGroup4.add("edittext", undefined, "");
        labelEdit4.characters = 18;         
        var labelGroup5 = labelPanel.add("group");
        var labelStatic5 = labelGroup5.add("statictext", undefined, "Bar Label 5");
        var labelEdit5 = labelGroup5.add("edittext", undefined, "");
        labelEdit5.characters = 18; 
        var labelGroup6 = labelPanel2.add("group");
        var labelStatic6 = labelGroup6.add("statictext", undefined, "Bar Label 6");
        var labelEdit6 = labelGroup6.add("edittext", undefined, "");
        labelEdit6.characters = 18;  
        var labelGroup7 = labelPanel2.add("group");
        var labelStatic7 = labelGroup7.add("statictext", undefined, "Bar Label 7");
        var labelEdit7 = labelGroup7.add("edittext", undefined, "");
        labelEdit7.characters = 18;    
        var labelGroup8 = labelPanel2.add("group");
        var labelStatic8 = labelGroup8.add("statictext", undefined, "Bar Label 8");
        var labelEdit8 = labelGroup8.add("edittext", undefined, "");
        labelEdit8.characters = 18;  
        var labelGroup9 = labelPanel2.add("group");
        var labelStatic9 = labelGroup9.add("statictext", undefined, "Bar Label 9");
        var labelEdit9 = labelGroup9.add("edittext", undefined, "");
        labelEdit9.characters = 18;  
    } else if (totalBars == 10) {
        var labelGroup1 = labelPanel.add("group");
        var labelStatic1 = labelGroup1.add("statictext", undefined, "Bar Label 1");
        var labelEdit1 = labelGroup1.add("edittext", undefined, "");
        labelEdit1.characters = 18;
        var labelGroup2 = labelPanel.add("group");
        var labelStatic2 = labelGroup2.add("statictext", undefined, "Bar Label 2");
        var labelEdit2 = labelGroup2.add("edittext", undefined, "");
        labelEdit2.characters = 18;       
        var labelGroup3 = labelPanel.add("group");
        var labelStatic3 = labelGroup3.add("statictext", undefined, "Bar Label 3");
        var labelEdit3 = labelGroup3.add("edittext", undefined, "");
        labelEdit3.characters = 18; 
        var labelGroup4 = labelPanel.add("group");
        var labelStatic4 = labelGroup4.add("statictext", undefined, "Bar Label 4");
        var labelEdit4 = labelGroup4.add("edittext", undefined, "");
        labelEdit4.characters = 18;         
        var labelGroup5 = labelPanel.add("group");
        var labelStatic5 = labelGroup5.add("statictext", undefined, "Bar Label 5");
        var labelEdit5 = labelGroup5.add("edittext", undefined, "");
        labelEdit5.characters = 18; 
        var labelGroup6 = labelPanel2.add("group");
        var labelStatic6 = labelGroup6.add("statictext", undefined, "Bar Label 6");
        var labelEdit6 = labelGroup6.add("edittext", undefined, "");
        labelEdit6.characters = 18;  
        var labelGroup7 = labelPanel2.add("group");
        var labelStatic7 = labelGroup7.add("statictext", undefined, "Bar Label 7");
        var labelEdit7 = labelGroup7.add("edittext", undefined, "");
        labelEdit7.characters = 18;    
        var labelGroup8 = labelPanel2.add("group");
        var labelStatic8 = labelGroup8.add("statictext", undefined, "Bar Label 8");
        var labelEdit8 = labelGroup8.add("edittext", undefined, "");
        labelEdit8.characters = 18;  
        var labelGroup9 = labelPanel2.add("group");
        var labelStatic9 = labelGroup9.add("statictext", undefined, "Bar Label 9");
        var labelEdit9 = labelGroup9.add("edittext", undefined, "");
        labelEdit9.characters = 18;  
        var labelGroup10 = labelPanel2.add("group");
        var labelStatic10 = labelGroup10.add("statictext", undefined, "Bar Label 10");
        var labelEdit10 = labelGroup10.add("edittext", undefined, "");
        labelEdit10.characters = 18;    
    } else if (totalBars == 11) {
        var labelGroup1 = labelPanel.add("group");
        var labelStatic1 = labelGroup1.add("statictext", undefined, "Bar Label 1");
        var labelEdit1 = labelGroup1.add("edittext", undefined, "");
        labelEdit1.characters = 18;
        var labelGroup2 = labelPanel.add("group");
        var labelStatic2 = labelGroup2.add("statictext", undefined, "Bar Label 2");
        var labelEdit2 = labelGroup2.add("edittext", undefined, "");
        labelEdit2.characters = 18;       
        var labelGroup3 = labelPanel.add("group");
        var labelStatic3 = labelGroup3.add("statictext", undefined, "Bar Label 3");
        var labelEdit3 = labelGroup3.add("edittext", undefined, "");
        labelEdit3.characters = 18; 
        var labelGroup4 = labelPanel.add("group");
        var labelStatic4 = labelGroup4.add("statictext", undefined, "Bar Label 4");
        var labelEdit4 = labelGroup4.add("edittext", undefined, "");
        labelEdit4.characters = 18;         
        var labelGroup5 = labelPanel.add("group");
        var labelStatic5 = labelGroup5.add("statictext", undefined, "Bar Label 5");
        var labelEdit5 = labelGroup5.add("edittext", undefined, "");
        labelEdit5.characters = 18; 
        var labelGroup6 = labelPanel.add("group");
        var labelStatic6 = labelGroup6.add("statictext", undefined, "Bar Label 6");
        var labelEdit6 = labelGroup6.add("edittext", undefined, "");
        labelEdit6.characters = 18;  
        var labelGroup7 = labelPanel2.add("group");
        var labelStatic7 = labelGroup7.add("statictext", undefined, "Bar Label 7");
        var labelEdit7 = labelGroup7.add("edittext", undefined, "");
        labelEdit7.characters = 18;    
        var labelGroup8 = labelPanel2.add("group");
        var labelStatic8 = labelGroup8.add("statictext", undefined, "Bar Label 8");
        var labelEdit8 = labelGroup8.add("edittext", undefined, "");
        labelEdit8.characters = 18;  
        var labelGroup9 = labelPanel2.add("group");
        var labelStatic9 = labelGroup9.add("statictext", undefined, "Bar Label 9");
        var labelEdit9 = labelGroup9.add("edittext", undefined, "");
        labelEdit9.characters = 18;  
        var labelGroup10 = labelPanel2.add("group");
        var labelStatic10 = labelGroup10.add("statictext", undefined, "Bar Label 10");
        var labelEdit10 = labelGroup10.add("edittext", undefined, "");
        labelEdit10.characters = 18;    
        var labelGroup11 = labelPanel2.add("group");
        var labelStatic11 = labelGroup11.add("statictext", undefined, "Bar Label 11");
        var labelEdit11 = labelGroup11.add("edittext", undefined, "");
        labelEdit11.characters = 18;    
   } else if (totalBars == 12) {
        var labelGroup1 = labelPanel.add("group");
        var labelStatic1 = labelGroup1.add("statictext", undefined, "Bar Label 1");
        var labelEdit1 = labelGroup1.add("edittext", undefined, "");
        labelEdit1.characters = 18;
        var labelGroup2 = labelPanel.add("group");
        var labelStatic2 = labelGroup2.add("statictext", undefined, "Bar Label 2");
        var labelEdit2 = labelGroup2.add("edittext", undefined, "");
        labelEdit2.characters = 18;       
        var labelGroup3 = labelPanel.add("group");
        var labelStatic3 = labelGroup3.add("statictext", undefined, "Bar Label 3");
        var labelEdit3 = labelGroup3.add("edittext", undefined, "");
        labelEdit3.characters = 18; 
        var labelGroup4 = labelPanel.add("group");
        var labelStatic4 = labelGroup4.add("statictext", undefined, "Bar Label 4");
        var labelEdit4 = labelGroup4.add("edittext", undefined, "");
        labelEdit4.characters = 18;         
        var labelGroup5 = labelPanel.add("group");
        var labelStatic5 = labelGroup5.add("statictext", undefined, "Bar Label 5");
        var labelEdit5 = labelGroup5.add("edittext", undefined, "");
        labelEdit5.characters = 18; 
        var labelGroup6 = labelPanel.add("group");
        var labelStatic6 = labelGroup6.add("statictext", undefined, "Bar Label 6");
        var labelEdit6 = labelGroup6.add("edittext", undefined, "");
        labelEdit6.characters = 18;  
        var labelGroup7 = labelPanel2.add("group");
        var labelStatic7 = labelGroup7.add("statictext", undefined, "Bar Label 7");
        var labelEdit7 = labelGroup7.add("edittext", undefined, "");
        labelEdit7.characters = 18;    
        var labelGroup8 = labelPanel2.add("group");
        var labelStatic8 = labelGroup8.add("statictext", undefined, "Bar Label 8");
        var labelEdit8 = labelGroup8.add("edittext", undefined, "");
        labelEdit8.characters = 18;  
        var labelGroup9 = labelPanel2.add("group");
        var labelStatic9 = labelGroup9.add("statictext", undefined, "Bar Label 9");
        var labelEdit9 = labelGroup9.add("edittext", undefined, "");
        labelEdit9.characters = 18;  
        var labelGroup10 = labelPanel2.add("group");
        var labelStatic10 = labelGroup10.add("statictext", undefined, "Bar Label 10");
        var labelEdit10 = labelGroup10.add("edittext", undefined, "");
        labelEdit10.characters = 18;    
        var labelGroup11 = labelPanel2.add("group");
        var labelStatic11 = labelGroup11.add("statictext", undefined, "Bar Label 11");
        var labelEdit11 = labelGroup11.add("edittext", undefined, "");
        labelEdit11.characters = 18;            
        var labelGroup12 = labelPanel2.add("group");
        var labelStatic12 = labelGroup12.add("statictext", undefined, "Bar Label 12");
        var labelEdit12 = labelGroup12.add("edittext", undefined, "");
        labelEdit12.characters = 18;            
} 
        
    //Buttons
    var initialButtonGroup = labelUI.add("group");
    var labelAlrightButton = initialButtonGroup.add("button", undefined, "OK");
    var labelCancelButton = initialButtonGroup.add("button", undefined, "Cancel");

    initialButtonGroup.orientation = "row";
    
        //Set Text as defined in UI
        labelAlrightButton.onClick = function() {
            labelUI.close();
            }
        labelCancelButton.onClick = function() {
            cancelCheck = true;
            labelUI.close();
            }
    
    labelUI.show();

//Point Labels    
if (totalBars == 1) {
    var barLabel1 = labelEdit1.text;
} else if (totalBars == 2) {
    var barLabel1 = labelEdit1.text;
    var barLabel2 = labelEdit2.text;
} else if (totalBars == 3) {
    var barLabel1 = labelEdit1.text;
    var barLabel2 = labelEdit2.text;
    var barLabel3 = labelEdit3.text;  
} else if (totalBars == 4) {
    var barLabel1 = labelEdit1.text;
    var barLabel2 = labelEdit2.text;
    var barLabel3 = labelEdit3.text;  
    var barLabel4 = labelEdit4.text;
} else if (totalBars == 5) {
    var barLabel1 = labelEdit1.text;
    var barLabel2 = labelEdit2.text;
    var barLabel3 = labelEdit3.text;  
    var barLabel4 = labelEdit4.text;
    var barLabel5 = labelEdit5.text;
} else if (totalBars == 6) {
    var barLabel1 = labelEdit1.text;
    var barLabel2 = labelEdit2.text;
    var barLabel3 = labelEdit3.text;  
    var barLabel4 = labelEdit4.text;
    var barLabel5 = labelEdit5.text;
    var barLabel6 = labelEdit6.text;  
} else if (totalBars == 7) {
    var barLabel1 = labelEdit1.text;
    var barLabel2 = labelEdit2.text;
    var barLabel3 = labelEdit3.text;  
    var barLabel4 = labelEdit4.text;
    var barLabel5 = labelEdit5.text;
    var barLabel6 = labelEdit6.text;  
    var barLabel7 = labelEdit7.text;
} else if (totalBars == 8) {
    var barLabel1 = labelEdit1.text;
    var barLabel2 = labelEdit2.text;
    var barLabel3 = labelEdit3.text;  
    var barLabel4 = labelEdit4.text;
    var barLabel5 = labelEdit5.text;
    var barLabel6 = labelEdit6.text;  
    var barLabel7 = labelEdit7.text;
    var barLabel8 = labelEdit8.text;
} else if (totalBars == 9) {
    var barLabel1 = labelEdit1.text;
    var barLabel2 = labelEdit2.text;
    var barLabel3 = labelEdit3.text;  
    var barLabel4 = labelEdit4.text;
    var barLabel5 = labelEdit5.text;
    var barLabel6 = labelEdit6.text;  
    var barLabel7 = labelEdit7.text;
    var barLabel8 = labelEdit8.text;
    var barLabel9 = labelEdit9.text;  
} else if (totalBars == 10) {
    var barLabel1 = labelEdit1.text;
    var barLabel2 = labelEdit2.text;
    var barLabel3 = labelEdit3.text;  
    var barLabel4 = labelEdit4.text;
    var barLabel5 = labelEdit5.text;
    var barLabel6 = labelEdit6.text;  
    var barLabel7 = labelEdit7.text;
    var barLabel8 = labelEdit8.text;
    var barLabel9 = labelEdit9.text;  
    var barLabel10 = labelEdit10.text;
} else if (totalBars == 11) {
    var barLabel1 = labelEdit1.text;
    var barLabel2 = labelEdit2.text;
    var barLabel3 = labelEdit3.text;  
    var barLabel4 = labelEdit4.text;
    var barLabel5 = labelEdit5.text;
    var barLabel6 = labelEdit6.text;  
    var barLabel7 = labelEdit7.text;
    var barLabel8 = labelEdit8.text;
    var barLabel9 = labelEdit9.text;  
    var barLabel10 = labelEdit10.text;
    var barLabel11 = labelEdit11.text;
} else if (totalBars == 12) {
    var barLabel1 = labelEdit1.text;
    var barLabel2 = labelEdit2.text;
    var barLabel3 = labelEdit3.text;  
    var barLabel4 = labelEdit4.text;
    var barLabel5 = labelEdit5.text;
    var barLabel6 = labelEdit6.text;  
    var barLabel7 = labelEdit7.text;
    var barLabel8 = labelEdit8.text;
    var barLabel9 = labelEdit9.text;  
    var barLabel10 = labelEdit10.text;
    var barLabel11 = labelEdit11.text;
    var barLabel12 = labelEdit12.text;  
    }   
}
}
/////////////////CREATE MASTER CONTROL///////////////////

if (cancelCheck == false) {

//Start Undo Group
app.beginUndoGroup(scriptName);

//Building the Master Null
curItem.layers.addNull();  
curItem.selectedLayers[0].name = "MASTER CONTROL";

alert("DEBUG: vertBarGraph - Master Null created, totalBars=" + totalBars);

//Attach Controls to the the Master Null
for (var x = 1; x <= totalBars; x++) {
    curItem.selectedLayers[0].Effects.addProperty("Slider Control");
    curItem.selectedLayers[0].Effects.addProperty("Color Control");
    
    var valueNumber;
    var colorCont = randomBarColor();

    if (x == 1) {
        var valueNumber = master1;
    } else if (x == 2) {
        var valueNumber = master2;
    } else if (x == 3) {
        var valueNumber = master3;
    } else if (x == 4) {
        var valueNumber = master4;
    } else if (x == 5) {
        var valueNumber = master5;
    } else if (x == 6) {
        var valueNumber = master6;
    } else if (x == 7) {
        var valueNumber = master7;
    } else if (x == 8) {
        var valueNumber = master8;
    } else if (x == 9) {
        var valueNumber = master9;
    } else if (x == 10) {
        var valueNumber = master10;
    } else if (x == 11) {
       var valueNumber = master11;
    } else if (x == 12) {
       var valueNumber = master12;
    }
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

alert("DEBUG: vertBarGraph - attach loop complete");

//////////////////CREATE BARS AND ANIMATION/////////////////////

//Create the set number of Bars 
for (var x = 1; x <= totalBars; x++) {
    
    //BAR MAKER FUNCTION    
    vBarMaker(x);
    if (x == 1) {
        alert("DEBUG: vertBarGraph - vBarMaker returned OK for bar 1");
    }
    
    //Parenting
    curItem.layer(1).parent = curItem.layer(2);
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
        
    //% Expressions
    curItem.layer(1).position.expression = "x = transform.position[0]; y = transform.position[1]; if (thisComp.layer(\"MASTER CONTROL\").effect(\"Value Amount " + x + "\")(\"Slider\") < 9.5) { [x/1.65,y] } else { [x,y] }"    
   
   //Text Expression
    curItem.layer(2).property("Source Text").expression = "thisComp.layer(\"MASTER CONTROL\").effect(\"Value Amount " + x + "\")(\"Slider\").value.toFixed(0)"
    curItem.layer(2).position.expression  = "temp = (((thisComp.width/100)*(((thisComp.layer(\"MASTER CONTROL\").effect(\"Value Amount " + x + "\")(\"Slider\") - " + minLine + ") * (100)) / (" + maxLine + " - " + minLine + "))  + 0))*-1; [((temp+(thisComp.width/2))-thisComp.height*.01)*-1+(thisComp.width*.004), thisComp.layer(\"Bar " + x +"\").transform.position[1] + (thisComp.height*" + textMoveMod +")]"
    
    //Bar Expressions (fill color is wired up in createBarShape() at creation time)
    curItem.layer(3).scale.expression = "temp = (((thisComp.layer(\"MASTER CONTROL\").effect(\"Value Amount " + x + "\")(\"Slider\"))- 0) - "+minLine+") * (100-0)/("+maxLine+" - "+minLine+");  [100, temp]";
    
}

alert("DEBUG: vertBarGraph - create-bars loop complete, building background");


/////////CREATE BACKGROUND//////////

if (totalBars > 7) {
        var BGdivider = 8;
    } else {
        var BGdivider = 7;
    }

//Create the Vertical Bar
curItem.layers.addSolid([255,255,255],"Vertical Bar", Math.round(detVar*.02), Math.round((totalBars/BGdivider) * curItem.height), pxlAsp );

var background1LayerWidth = curItem.selectedLayers[0].width/2;       //Layer Width
var background1LayerHeight = curItem.selectedLayers[0].height/2;     //Layer Height

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

curItem.selectedLayers[0].position.setValue([0, (Math.round((totalBars/BGdivider)*curItem.height))*.992]);

//Create the Horizontal Bar
curItem.layers.addSolid([255,255,255],"Horizontal Bar", curItem.width, Math.round(detVar*.02), pxlAsp );

var background1LayerWidth = curItem.selectedLayers[0].width/2;       //Layer Width
var background1LayerHeight = curItem.selectedLayers[0].height/2;     //Layer Height

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
                if (x == 1) {
                    var label = barLabel1;
                    } else if (x == 2) {
                    var label = barLabel2;
                    } else if (x == 3) {
                    var label = barLabel3;
                    } else if (x == 4) {
                    var label = barLabel4;
                    } else if (x == 5) {
                    var label = barLabel5;
                    } else if (x == 6) {
                    var label = barLabel6;
                    } else if (x == 7) {
                    var label = barLabel7;
                    } else if (x == 8) {
                    var label = barLabel8;
                    } else if (x == 9) {
                    var label = barLabel9;
                    } else if (x == 10) {
                    var label = barLabel10;
                    } else if (x == 11) {
                    var label = barLabel11;
                    } else if (x == 12) {
                    var label = barLabel12;
                    }
                
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

curItem.layers.precompose(precomposeArray, "Vertical Bar Graph", true);

//Move to Correct Time Period
var timeSetTo = (2.5+((totalBars-1)/2))+1;
app.project.activeItem.time = timeSetTo;

//End Undo Group
app.endUndoGroup();
alert("DEBUG: vertBarGraph - reached end of function (endUndoGroup done)");

//**********************************************************/
//////////////////FUNCTIONS/////////////////////////

function vBarMaker(spacingAmount) {
    
        //Create the Bar
        var barWidth = Math.round(detVar*.10);
        var barHeight = curItem.width;
        createBarShape("Bar", barWidth, barHeight, spacingAmount);
        if (spacingAmount == 1) {
            alert("DEBUG: vBarMaker(vert) - shape created for bar 1, barWidth=" + barWidth + " barHeight=" + barHeight);
        }
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
            var mainTextSize=detVar*.11296;
            var perTextSize=detVar*.0540;
            var perMoveMod = .115;
            } else {
            var mainTextSize=detVar*.08996;
            var perTextSize=detVar*.0380;
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
}