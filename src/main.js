let magnet;
let bulb;
let slider;
let sliderValue;
let canvas;
let coilFrontImg;
let coilBackImg;
let coilPositionPixDiff = 63;
let magnetWidth = 150;
let magnetHeight = 50;

let coilXMiddle;
let coilYMiddle;
let BValue;

let lastFi = null;
let lastTime = null;


// ========
//  params
// ========
let pixelsPerCM = 100;
let magnetLengthInM = 0.10;
let magnetWidthInM = 0.10;
let magnetThicknessInM = 0.25;
let coilArea = 10;
let coilQuantity = 6;
let Br = 1.42; // data from the table
let magnetAngleInPiRadians = 0;

let pixelsPerM = pixelsPerCM * 100;


function setup() {
    canvas = createCanvas(windowWidth, windowHeight * 3 / 4);
    magnet = new DraggableMagnet(magnetWidth, magnetHeight);
    bulb = new Bulb(130, 130, 80);
    slider = createSlider(-90, 90, 0, 10);
    sliderValue = createSpan(slider.value())
    BValue = createSpan("Value: 0");
    BValue.position(0, canvas.height + 40)
}

function draw() {
    if (lastFi === null) lastFi = 0;
    if (lastTime === null) lastTime = Date.now();
    background(220);
    image(coilBackImg, width / 2 - coilBackImg.width / 2, height / 2 - coilBackImg.height / 2, 250, 250);
    magnet.update();
    magnet.over();
    magnet.show();
    sliderValue.html(slider.value());
    image(coilFrontImg, width / 2 - coilFrontImg.width / 2 - coilPositionPixDiff, height / 2 - coilFrontImg.height / 2, 250, 250);
    coilXMiddle = (width / 2) - (coilFrontImg.width / 2) - (coilPositionPixDiff / 4);
    coilYMiddle = (height / 2) - (coilBackImg.height / 4);

    let B = getB();
    let Fi = getFi(B, coilArea, magnetAngleInPiRadians);
    let newTime = Date.now();
    let dFi = Fi - lastFi;
    let dTime = (newTime - lastTime) / 1000;
    let ElectromotoricForce = getElectroMotoricForce(coilQuantity, dFi, dTime);
    lastFi = Fi;
    lastTime = newTime;

    updateInfoBox(ElectromotoricForce, dFi, B, (getDistanceToMagnet() * 100).toFixed(2));
    bulb.show(ElectromotoricForce);
    fill(0)
    rect(100, 100, -30, -30);

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
    const firstPart = Br / PI;
    const z = getDistanceToMagnet();
    const firstArctan = Math.atan((magnetLengthInM * magnetWidthInM) / (2 * z * Math.sqrt(4 * Math.pow(z, 2) + Math.pow(magnetLengthInM, 2) + Math.pow(magnetWidthInM, 2))));
    const secondArctan = Math.atan((magnetLengthInM * magnetWidthInM) / (2 * (magnetThicknessInM + z) * Math.sqrt(4 * Math.pow((magnetThicknessInM + z), 2) + Math.pow(magnetLengthInM, 2) + Math.pow(magnetWidthInM, 2))));
    return firstPart * (firstArctan - secondArctan);
}

function getDistanceToMagnet() {
    return Math.sqrt(Math.pow((min(magnet.getMinX(), magnet.getMaxX()) - coilXMiddle) / pixelsPerM, 2) + Math.pow((magnet.getYMiddle() - coilYMiddle) / pixelsPerM, 2))
}

function getFi(B, S, angle) {
    return B * S * Math.cos(angle);
}

function getElectroMotoricForce(N, dFi, dTime) {
    return -(N * dFi) / dTime;
}

function updateInfoBox(E, dFi, B, z) {
    BValue.html("<div style=\"margin: 10px; padding: 10px; background-color: #f9e3;\">" + "Electromotoric Force: " + E + "<br/>Delta Fi: " + dFi + "<br/>B: " + B + "<br/>Z: " + z + "cm" + "</div>");
}