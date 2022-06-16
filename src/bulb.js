class Bulb {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.r = radius;
        this.maxVoltage = 0;
    }

    show(intensity) {
        push();
        stroke(0);
        fill(255, 255, (max(this.maxVoltage - Math.abs(intensity), 0) * 255) / this.maxVoltage);
        circle(this.x, this.y, this.r);
        pop();
    }

    setMaxVoltage(newVoltage) {
        this.maxVoltage = newVoltage;
    }
}