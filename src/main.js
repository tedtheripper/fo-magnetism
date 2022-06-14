let magnet;
let slider;
let sliderValue;
let canvas;
let coilFrontImg;
let coilBackImg;
let coilPixDiff = 80;
let magnetWidth = 150;
let magnetHeight = 50;


function setup() {
    canvas = createCanvas(windowWidth, windowHeight * 3 / 4);
    magnet = new DraggableMagnet(magnetWidth, magnetHeight);
    slider = createSlider(-90, 90, 0, 10);
    sliderValue = createSpan(slider.value())
}

function draw() {
    background(220);
    image(coilBackImg, width / 2 - coilFrontImg.width / 2, height / 2 - coilFrontImg.height / 2, 250, 250);

    magnet.update();
    magnet.over();
    magnet.show();
    sliderValue.html(slider.value());
    image(coilFrontImg, width / 2 - coilFrontImg.width / 2 - coilPixDiff, height / 2 - coilFrontImg.height / 2, 250, 250);

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