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

// ======
// parameters objects input
// ======
let sliderDesc;
let slider;
let sliderValue;
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

// ========
//  params
// ========
let pixelsPerCM = 100;
let magnetAngleInPiRadians = 0;

let pixelsPerM = params["ppcm"] * 100;


function setup() {
    canvas = createCanvas(windowWidth, windowHeight * 3 / 4);
    BValue = createSpan("");
    BValue.position(0, canvas.height - 100);
    magnet = new DraggableMagnet(magnetWidth, magnetHeight);
    bulb = new Bulb(130, 130, 80);

    slider = createSlider(-180, 180, 0, 10);
    sliderValue = createSpan(slider.value())
    slider.hide();
    sliderValue.hide();

    parametersButton = createButton("Change Parameters");
    parametersButton.mousePressed(changeParametersWindowState);

    applyParametersButton = createButton('Save');
    applyParametersButton.position(canvas.width * 0.5, canvas.height * 0.7);
    applyParametersButton.mousePressed(saveParams);
    settings.push(applyParametersButton);

    BrDesc = createSpan("Magnet parameter from the <a href='https://www.supermagnete.de/eng/physical-magnet-data'>table</a> [T]");
    BrDesc.position(canvas.width * 0.15, canvas.height * 0.2);
    settings.push(BrDesc);

    BrText = createInput("1.42");
    BrText.position(canvas.width * 0.15, canvas.height * 0.22);
    settings.push(BrText);

    magnetLengthDesc = createSpan("Magnet length [m]");
    magnetLengthDesc.position(canvas.width * 0.15, canvas.height * 0.25);
    settings.push(magnetLengthDesc);

    magnetLengthText = createInput("0.25");
    magnetLengthText.position(canvas.width * 0.15, canvas.height * 0.27);
    settings.push(magnetLengthText);

    magnetWidthDesc = createSpan("Magnet width [m]");
    magnetWidthDesc.position(canvas.width * 0.15, canvas.height * 0.3);
    settings.push(magnetWidthDesc);

    magnetWidthText = createInput("0.1");
    magnetWidthText.position(canvas.width * 0.15, canvas.height * 0.32);
    settings.push(magnetWidthText);

    magnetThicknessDesc = createSpan("Magnet thickness [m]");
    magnetThicknessDesc.position(canvas.width * 0.15, canvas.height * 0.35);
    settings.push(magnetThicknessDesc);

    magnetThicknessText = createInput("0.1");
    magnetThicknessText.position(canvas.width * 0.15, canvas.height * 0.37);
    settings.push(magnetThicknessText);

    coilDiameterDesc = createSpan("Coil diameter [m]");
    coilDiameterDesc.position(canvas.width * 0.15, canvas.height * 0.4);
    settings.push(coilDiameterDesc);

    coilDiameterText = createInput("0.15");
    coilDiameterText.position(canvas.width * 0.15, canvas.height * 0.42);
    settings.push(coilDiameterText);

    coilCountDesc = createSpan("Coils count");
    coilCountDesc.position(canvas.width * 0.15, canvas.height * 0.45);
    settings.push(coilCountDesc);

    coilCountText = createInput("6");
    coilCountText.position(canvas.width * 0.15, canvas.height * 0.47);
    settings.push(coilCountText);

    ppcmDesc = createSpan("Pixels per [cm] ratio");
    ppcmDesc.position(canvas.width * 0.15, canvas.height * 0.50);
    settings.push(ppcmDesc);

    ppcmText = createInput("100");
    ppcmText.position(canvas.width * 0.15, canvas.height * 0.52);
    settings.push(ppcmText);

    settings.forEach(s => {
        s.hide();
    });
}

function draw() {
    if (isParametersWindowOpen) {
        parametersButton.hide();
    } else {
        parametersButton.show();
    }

    if (isParametersWindowOpen) {
        BValue.html("");
        background(220);
        settings.forEach(s => s.show());
    } else {
        settings.forEach(s => s.hide());
        drawParametersInputSegment();
        slider.show();
        sliderValue.show();
        if (lastFi === null) lastFi = 0;
        if (lastTime === null) lastTime = Date.now();
        background(220);
        image(coilBackImg, width / 2 - coilBackImg.width / 2, height / 2 - coilBackImg.height / 2, 250, 250);
        magnet.update();
        magnet.over();
        magnet.changeRotationInDegrees(slider.value())
        magnet.show();
        image(coilFrontImg, width / 2 - coilFrontImg.width / 2 - coilPositionPixDiff, height / 2 - coilFrontImg.height / 2, 250, 250);
        coilXMiddle = (width / 2) + (coilBackImg.width / 2) - 3 * coilPositionPixDiff;
        coilYMiddle = (height / 2) - (coilBackImg.height / 4);

        let B = getB();
        let Fi = getFi(B, params["coilArea"], magnetAngleInPiRadians);
        let newTime = Date.now();
        let dFi = Fi - lastFi;
        let dTime = (newTime - lastTime) / 1000;
        let ElectromotoricForce = getElectroMotoricForce(params["coilCount"], dFi, dTime);
        lastFi = Fi;
        lastTime = newTime;

        updateInfoBox(ElectromotoricForce, dFi, B, (getDistanceToMagnet() * 100));
        bulb.show(ElectromotoricForce);
    }
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
    sliderValue.position(slider.width + 10, canvas.height + 5);
}

function saveParams() {
    if (checkValues()) {
        changeParametersWindowState();
    }
}

function changeParametersWindowState() {
    isParametersWindowOpen = !isParametersWindowOpen;
    console.log(isParametersWindowOpen);
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

    return true;
}