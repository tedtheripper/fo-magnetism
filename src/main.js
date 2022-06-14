let magnet;
let slider;
let sliderValue;

function setup() {
    createCanvas(windowWidth, windowHeight * 3 / 4);
    magnet = new DraggableMagnet();
    slider = createSlider(-90, 90, 0, 10);
    sliderValue = createSpan(slider.value())
}

function draw() {
    background(220);
    magnet.update();
    magnet.over();
    magnet.show();
    sliderValue.html(slider.value());
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