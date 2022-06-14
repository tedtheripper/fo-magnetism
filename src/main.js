let magnet;
let slider;
let sliderValue;
let canvas;
let coilFrontImg;
let coilBackImg;
let coilPixDiff = 70;
let magnetWidth = 150;
let magnetHeight = 50;

let coilXMiddle;
let coilYMiddle;
let BValue;

let coilArea = 10;
let Br = 1.42; // data from the table

let magnetLengthInM = 0.10;
let magnetWidthInM = 0.10;
let magnetThicknessInM = 0.25;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight * 3 / 4);
    magnet = new DraggableMagnet(magnetWidth, magnetHeight);
    slider = createSlider(-90, 90, 0, 10);
    sliderValue = createSpan(slider.value())
    BValue = createSpan("Value: 0");
    BValue.position(0, canvas.height + 40)
}

function draw() {
    background(220);
    image(coilBackImg, width / 2 - coilBackImg.width / 2, height / 2 - coilBackImg.height / 2, 250, 250);
    magnet.update();
    magnet.over();
    magnet.show();
    sliderValue.html(slider.value());
    image(coilFrontImg, width / 2 - coilFrontImg.width / 2 - coilPixDiff, height / 2 - coilFrontImg.height / 2, 250, 250);
    coilXMiddle = (width / 2 - coilFrontImg.width / 2) - (width / 2 - coilFrontImg.width / 2 - coilPixDiff);
    coilYMiddle = (height / 2 - coilBackImg.height / 2); // TODO: this is not correct
    BValue.html("Value: " + getB());
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
    return Math.sqrt(Math.pow((magnet.getMinX() - coilXMiddle), 2) + Math.pow(magnet.getYMiddle() - coilYMiddle, 2))
}