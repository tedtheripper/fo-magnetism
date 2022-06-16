let coilPositionPixDiff = 63;
let magnetWidth = 150;
let magnetHeight = 50;

// =======
// objects
// =======
let magnet;
let bulb;
let canvas;
let coilFrontImg;
let coilBackImg;
let bulbImg;
let shorterCable;
let longerCable;
let graph;

// ======
// parameters objects input
// ======
let sliderDesc;
let slider;
let sliderValue;
let sliderLabel;
let BrDesc;
let BrText;
let magnetLengthDesc;
let magnetLengthText;
let magnetWidthDesc;
let magnetWidthText;
let magnetThicknessDesc;
let magnetThicknessText;
let coilDiameterDesc;
let coilDiameterText;
let coilCountDesc;
let coilCountText;
let ppcmDesc; // pixels per cm
let ppcmText;
let bulbDesc;
let bulbText;
let savedText;
let drawFields;

let applyParametersButton;

let params = {
    "ppcm": 100
};

let coilXMiddle;
let coilYMiddle;
let BValue;

let lastFi = null;
let lastTime = null;

let parametersButton;
let isParametersWindowOpen = true;
let settings = [];
let latestVoltage = [];
let latestNVoltages = 300;
// ========
//  params
// ========
let pixelsPerCM = 100;
let magnetAngleInPiRadians = 0;

let pixelsPerM = params["ppcm"] * 100;


function setup() {
    canvas = createCanvas(windowWidth, windowHeight * 0.99);
    let settingsXStart = canvas.width * 0.70;
    let settingsYStart = canvas.height * 0.10;
    BValue = createSpan("");
    BValue.position(settingsXStart, height - 140);
    magnet = new DraggableMagnet(magnetWidth, magnetHeight);
    bulb = new Bulb(130, 130, 180);
    graph = new Graph(10, height - 165, 620, 160, latestNVoltages);

    slider = createSlider(-180, 180, 0, 10);
    slider.position(700, height - 140);
    sliderValue = createSpan(slider.value());
    sliderValue.position(760, height - 110);
    sliderLabel = createSpan("Magnet angle");
    sliderLabel.position(710, height - 90);
    drawFields = createCheckbox("Draw fields", false);
    drawFields.position(900, height - 140);

    applyParametersButton = createButton('Save');
    applyParametersButton.position(settingsXStart + 30, settingsYStart + 480);
    applyParametersButton.mousePressed(saveParams);
    settings.push(applyParametersButton);
    BrDesc = createSpan("Magnet parameter from the <a href='https://www.supermagnete.de/eng/physical-magnet-data'>table</a> [T]");
    BrDesc.position(settingsXStart, settingsYStart);
    settings.push(BrDesc);

    BrText = createInput("1.42");
    BrText.position(settingsXStart, settingsYStart + 30);
    settings.push(BrText);

    magnetLengthDesc = createSpan("Magnet length [m]");
    magnetLengthDesc.position(settingsXStart, settingsYStart + 60);
    settings.push(magnetLengthDesc);

    magnetLengthText = createInput("0.25");
    magnetLengthText.position(settingsXStart, settingsYStart + 90);
    settings.push(magnetLengthText);

    magnetWidthDesc = createSpan("Magnet width [m]");
    magnetWidthDesc.position(settingsXStart, settingsYStart + 120);
    settings.push(magnetWidthDesc);

    magnetWidthText = createInput("0.1");
    magnetWidthText.position(settingsXStart, settingsYStart + 150);
    settings.push(magnetWidthText);

    magnetThicknessDesc = createSpan("Magnet thickness [m]");
    magnetThicknessDesc.position(settingsXStart, settingsYStart + 180);
    settings.push(magnetThicknessDesc);

    magnetThicknessText = createInput("0.1");
    magnetThicknessText.position(settingsXStart, settingsYStart + 210);
    settings.push(magnetThicknessText);

    coilDiameterDesc = createSpan("Coil diameter [m]");
    coilDiameterDesc.position(settingsXStart, settingsYStart + 240);
    settings.push(coilDiameterDesc);

    coilDiameterText = createInput("0.15");
    coilDiameterText.position(settingsXStart, settingsYStart + 270);
    settings.push(coilDiameterText);

    coilCountDesc = createSpan("Coils count");
    coilCountDesc.position(settingsXStart, settingsYStart + 300);
    settings.push(coilCountDesc);

    coilCountText = createInput("6");
    coilCountText.position(settingsXStart, settingsYStart + 330);
    settings.push(coilCountText);

    ppcmDesc = createSpan("Pixels per cm ratio");
    ppcmDesc.position(settingsXStart, settingsYStart + 360);
    settings.push(ppcmDesc);

    ppcmText = createInput("100");
    ppcmText.position(settingsXStart, settingsYStart + 390);
    settings.push(ppcmText);

    bulbDesc = createSpan("Bulb max voltage [V]");
    bulbDesc.position(settingsXStart, settingsYStart + 420);
    settings.push(bulbDesc);

    bulbText = createInput("230");
    bulbText.position(settingsXStart, settingsYStart + 450);
    settings.push(bulbText);

    savedText = createSpan("Saved!");
    savedText.position(settingsXStart + 150, settingsYStart + 500);
    savedText.hide();

    checkValues();
}

function draw() {
    background(220);
    fill(255);
    rect(0, 0, windowWidth * 2 / 3, windowHeight * 3 / 4);
    drawParametersInputSegment();
    if (lastFi === null) lastFi = 0;
    if (lastTime === null) lastTime = Date.now();

    magnet.setDrawFields(drawFields.checked());
    image(coilBackImg, 600 - coilBackImg.width / 2, 300 - coilBackImg.height / 2, 250, 250);
    magnet.update();
    magnet.over();
    magnet.changeRotationInDegrees(slider.value())
    coilXMiddle = 600 + (coilBackImg.width / 2) - 3 * coilPositionPixDiff;
    coilYMiddle = 300 - (coilBackImg.height / 4);

    let B = getB();
    let Fi = getFi(B, params["coilArea"], magnetAngleInPiRadians);
    let newTime = Date.now();
    let dFi = Fi - lastFi;
    let dTime = (newTime - lastTime) / 1000;
    let ElectromotoricForce = getElectroMotoricForce(params["coilCount"], dFi, dTime);
    lastFi = Fi;
    lastTime = newTime;

    updateInfoBox(ElectromotoricForce, dFi, B, (getDistanceToMagnet() * 100));
    latestVoltage.push(ElectromotoricForce);
    latestVoltage = latestVoltage.slice(-latestNVoltages);
    graph.show(latestVoltage);
    bulb.show(ElectromotoricForce);
    image(shorterCable, 150, 100, 325, 250);
    image(longerCable, 110, 140, 535, 240);
    image(bulbImg, 50, 70, 160, 160);
    magnet.show();
    image(coilFrontImg, 600 - coilFrontImg.width / 2 - coilPositionPixDiff, 300 - coilFrontImg.height / 2, 250, 250);
}

function mousePressed() {
    magnet.pressed();
}

function mouseReleased() {
    magnet.released();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function preload() {
    coilFrontImg = loadImage('assets/coil_front.png');
    coilBackImg = loadImage('assets/coil_back.png');
    bulbImg = loadImage('assets/bulb.png');
    shorterCable = loadImage('assets/shorterCable.png');
    longerCable = loadImage('assets/longerCable.png');
}

function getB() {
    const firstPart = params["br"] / PI;
    const z = getDistanceToMagnet();
    const firstArctan = Math.atan((params["length"] * params["width"]) / (2 * z * Math.sqrt(4 * Math.pow(z, 2) + Math.pow(params["length"], 2) + Math.pow(params["width"], 2))));
    const secondArctan = Math.atan((params["length"] * params["width"]) / (2 * (params["thickness"] + z) * Math.sqrt(4 * Math.pow((params["thickness"] + z), 2) + Math.pow(params["length"], 2) + Math.pow(params["width"], 2))));
    return firstPart * (firstArctan - secondArctan);
}

function getDistanceToMagnet() {
    let northPoleCords = magnet.getPoleCords(true);
    let southPoleCords = magnet.getPoleCords(false);
    return min(Math.sqrt(Math.pow(northPoleCords[0] - coilXMiddle, 2) + Math.pow(northPoleCords[1] - coilYMiddle, 2)),
        Math.sqrt(Math.pow(southPoleCords[0] - coilXMiddle, 2) + Math.pow(southPoleCords[1] - coilYMiddle, 2))) / pixelsPerM;
}

function getFi(B, S, angle) {
    return B * S * Math.cos(angle);
}

function getElectroMotoricForce(N, dFi, dTime) {
    return -(N * dFi) / dTime;
}

function updateInfoBox(E, dFi, B, z) {
    BValue.html("<div style=\"margin: 10px; padding: 10px; background-color: #f9e3;\">" + "Electromotoric Force [V]: " + E.toFixed(4) + "<br/>ΔΦ [Wb]: " + dFi.toFixed(4) + "<br/>B [T]: " + B.toFixed(4) + "<br/>Z [cm]: " + z.toFixed(2) + "cm" + "</div>");
}

function drawParametersInputSegment() {
    sliderValue.html(slider.value() + "°");
}

function saveParams() {
    checkValues();
    savedText.show();
    setTimeout(hideSavedText, 2000);
}

function hideSavedText() {
    savedText.hide();
}

function checkValues() {
    let br = parseFloat(BrText.value());
    if (isNaN(br) || br <= 0) {
        alert("[Magnet parameter] must be a positive number!");
        return false;
    } else {
        params["br"] = br;
    }

    let length = parseFloat(magnetLengthText.value());
    if (isNaN(length) || length <= 0) {
        alert("[Magnet length] must be a positive number!");
        return false;
    } else {
        params["length"] = length;
    }

    let width = parseFloat(magnetWidthText.value());
    if (isNaN(width) || width <= 0) {
        alert("[Magnet width] must be a positive number!");
        return false;
    } else {
        params["width"] = width;
    }

    let thickness = parseFloat(magnetThicknessText.value());
    if (isNaN(thickness) || thickness <= 0) {
        alert("[Magnet thickness] must be a positive number!");
        return false;
    } else {
        params["thickness"] = thickness;
    }

    let coilDiameter = parseFloat(coilDiameterText.value());
    if (isNaN(coilDiameter) || coilDiameter <= 0) {
        alert("[Coil diameter] must be a positive number!");
        return false;
    } else {
        params["coilArea"] = PI * Math.pow(coilDiameter, 2) / 4;
    }

    let coilCount = parseFloat(coilCountText.value());
    if (isNaN(coilCount) || coilCount <= 0 || !Number.isInteger(coilCount)) {
        alert("[Coil count] must be a positive number and an integer!");
        return false;
    } else {
        params["coilCount"] = coilCount;
    }

    let ppcm = parseFloat(ppcmText.value());
    if (isNaN(ppcm) || ppcm <= 0 || !Number.isInteger(ppcm)) {
        alert("[Pixels per cm] must be a positive number and an integer!");
        return false;
    } else {
        params["ppcm"] = ppcm;
    }

    let bulbVoltage = parseFloat(bulbText.value());
    if (isNaN(bulbVoltage) || bulbVoltage <= 0) {
        alert("[Bulb max voltage] must be a positive number!");
        return false;
    } else {
        params["bulbVoltage"] = bulbVoltage;
        bulb.setMaxVoltage(bulbVoltage);
    }

    return true;
}