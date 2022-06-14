let magnet;
let testRect;

function setup() {
    createCanvas(windowWidth, windowHeight);
    magnet = new DraggableMagnet();
    testRect = new Rectangle();
}

function draw() {
    background(220);
    magnet.update();
    magnet.over();
    magnet.show();
    testRect.update();
    testRect.over();
    testRect.show();
}

function mousePressed() {
    magnet.pressed();
    testRect.pressed();
}

function mouseReleased() {
    magnet.released();
    testRect.released();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}