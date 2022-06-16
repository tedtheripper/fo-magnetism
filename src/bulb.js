class Bulb {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.r = radius;
    }

    show(intensity) {
        stroke(0);
        fill(255, 255, max(255 - Math.abs(intensity), 0));
        circle(this.x, this.y, this.r);
    }
}