/**
 * Created by       Tung Ta Duc - 2015/11/04
 * Last update by   Tung Ta Duc - 2015/11/11
 **/

idcColor = new RGBColor();
idcColor.red = 0;
idcColor.green = 0;
idcColor.blue = 0;

lblIsLaserCut = "Add laser cutter pattern";
lblSilverLayerName = "print";
lblLaserCutLayerName = "laser";
ledLayerName = "LED";

doc = app.activeDocument;

//show up window config
var w = new Window ("dialog", "Generate Interdigital Capacital", undefined, {closeButton: false});
w.alignChildren = "right";
var main = w.add ("group {alignChildren: 'right', orientation: 'column'}");

//add dropdownlist
var groupLayer = main.add ("group {alignChildren: 'left', orientation: 'row'}");
groupLayer.add("statictext", undefined, "Layer: ");
var list = groupLayer.add ("dropdownlist", [0,0,240,20], doc.layers);
list.selection = 0;

for(var i = 0; i < doc.layers.length; i++){
    if(doc.layers[i].name.toUpperCase() == ledLayerName){
        list.selection = i;
        break;
    }
}

list.minimumSize.width = 220;

// add textbox
groupLayer = main.add ("group {alignChildren: 'right', orientation: 'row'}");
groupLayer.add("statictext", undefined, "IDC Length: ");
idcLength = groupLayer.add ("edittext", [0, 0, 170, 22], "200");
idcLength.active = true; 

groupLayer = main.add ("group {alignChildren: 'right', orientation: 'row'}");
groupLayer.add("statictext", undefined, "Number of Fingers: ");
fingerNo = groupLayer.add ("edittext", [0, 0, 170, 22], "NULL");
fingerNo.active = true;

groupLayer = main.add ("group {alignChildren: 'right', orientation: 'row'}");
groupLayer.add("statictext", undefined, "Finger width: ");
fingerWidth = groupLayer.add ("edittext", [0, 0, 170, 22], "1");
fingerWidth.active = true;

groupLayer = main.add ("group {alignChildren: 'right', orientation: 'row'}");
groupLayer.add("statictext", undefined, "Finger length: ");
fingerLength = groupLayer.add ("edittext", [0, 0, 170, 22], "20");
fingerLength.active = true;

groupLayer = main.add ("group {alignChildren: 'right', orientation: 'row'}");
groupLayer.add("statictext", undefined, "Finger gap: ");
fingerGap = groupLayer.add ("edittext", [0, 0, 170, 22], "1");
fingerGap.active = true;

groupLayer = main.add ("group {alignChildren: 'right', orientation: 'row'}");
groupLayer.add("statictext", undefined, "Frame width: ");
frameWidth = groupLayer.add ("edittext", [0, 0, 170, 22], "1");
frameWidth.active = true;

groupLayer = main.add ("group {alignChildren: 'right', orientation: 'row'}");
groupLayer.add("statictext", undefined, "Finger-Frame gap: ");
fingerFrameGap = groupLayer.add ("edittext", [0, 0, 170, 22], "1");
fingerFrameGap.active = true;


// add checkbox
var cbxIsLaserCut = w.add("checkbox", undefined, lblIsLaserCut);
cbxIsLaserCut.value = true;

// add button group and buttons
var buttons = w.add ("group {alignment: 'center'}")
var btnOK = buttons.add ("button", undefined, "OK", {name: "ok"});
buttons.add ("button", undefined, "Cancel", {name: "cancel"});


// on OK
btnOK.onClick = function(){
    // get layer
    var targetLayer = doc.layers[list.selection.index];

    // get inputs
    idcLengthVal = parseFloat(idcLength.text);
    var fingerNoVal = fingerNo.text;
    fingerWidthVal = parseFloat(fingerWidth.text);
    fingerLengthVal = parseFloat(fingerLength.text);
    fingerGapVal = parseFloat(fingerGap.text);
    frameWidthVal = parseFloat(frameWidth.text);
    fingerFrameGapVal = parseFloat(fingerFrameGap.text);

    var fingerStep = fingerWidthVal + fingerGapVal;
    var fingerPeriod = 2*fingerStep;

    if(fingerNoVal == "NULL"){
        fingerNoVal = Math.ceil(idcLengthVal/fingerStep);
    }

    var localLeftX = 0;
    var localRightX = localLeftX + mm2point(frameWidthVal + fingerFrameGapVal);
    var localY = 0;
    var localTmpY = localY;
    for(var i=0;i<fingerNoVal;i++){
        if(i%2==0){
            addRect(targetLayer, localTmpY, localLeftX, mm2point(fingerLengthVal + frameWidthVal), mm2point(fingerWidthVal), 0, idcColor);
        } else {
            addRect(targetLayer, localTmpY, localRightX, mm2point(fingerLengthVal + frameWidthVal), mm2point(fingerWidthVal), 0, idcColor);
        }
        localTmpY -= mm2point(fingerStep);
    }

    addRect(targetLayer, localY, localLeftX, mm2point(frameWidthVal), mm2point(idcLengthVal), 0, idcColor);
    addRect(targetLayer, localY, localRightX + mm2point(fingerLengthVal), mm2point(frameWidthVal), mm2point(idcLengthVal), 0, idcColor);

    //close dialog
    w.close (0);
};

//show dialog
w.show ();




function point2mm(pt){
    return pt * 0.352777778;
}

function mm2point(mm){
    return mm/0.352777778;
}

function addRect(layer, top, left, width, height, angle, fillColor){
    var rect = layer.pathItems.rectangle(top, left, width, height);
    rect.stroked = false;
    rect.fillColor = fillColor;
    return rect;
}
