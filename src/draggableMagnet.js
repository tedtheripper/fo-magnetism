class DraggableMagnet {
    constructor(width, height) {

        this.dragging = false;
        this.rollover = false;

        this.x = 800;
        this.y = 300;
        this.w = width;
        this.h = height;
        this.img = loadImage('assets/magnet.png');

        this.r = Math.sqrt(Math.pow(this.w / 2, 2) + Math.pow(this.h / 2, 2))
        this.rotationInRadians = 0;

        this.drawFields = false;
    }

    over() {
        const d = Math.sqrt(Math.pow((mouseX - this.getXmiddle()), 2) + Math.pow((mouseY - this.getYmiddle()), 2))

        this.rollover = false;
        if (d < this.r) {
            this.rollover = true;
        }
    }

    update() {
        if (this.dragging) {
            const newXPosition = mouseX + this.offsetX;
            const newYPosition = mouseY + this.offsetY;
            this.x = this.between(newXPosition, windowWidth * 2 / 3 - this.w, 0);
            this.y = this.between(newYPosition, windowHeight * 3 / 4 - this.h, 0);
        }
    }

    between(value, maxValue, minValue) {
        return Math.min(maxValue, Math.max(minValue, value));
    }

    show() {
        push()
        translate(this.getXmiddle(), this.getYmiddle());
        rotate(this.rotationInRadians)
        if (this.drawFields) {
            push()
            noFill();
            ellipse(0, -this.h, 300, 100);
            ellipse(0, this.h, 300, 100);
            ellipse(0, -2 * this.h, 500, 200);
            ellipse(0, 2 * this.h, 500, 200);
            ellipse(0, -3 * this.h, 900, 300);
            ellipse(0, 3 * this.h, 900, 300);

            push();
            fill(0);
            triangle(10, -100, 0, -90, 0, -110);
            triangle(10, 100, 0, 90, 0, 110);
            triangle(10, -200, 0, -190, 0, -210);
            triangle(10, 200, 0, 190, 0, 210);
            triangle(10, -300, 0, -290, 0, -310);
            triangle(10, 300, 0, 290, 0, 310);
            pop();

            pop();
        }

        image(this.img, -this.w / 2, -this.h / 2, this.w, this.h);
        pop()
    }

    pressed() {
        if (this.rollover) {
            this.dragging = true;
            this.offsetX = this.x - mouseX;
            this.offsetY = this.y - mouseY;
        }
    }

    changeRotation(angle) {
        this.rotationInRadians = angle;
    }

    changeRotationInDegrees(angleInDegrees) {
        this.rotationInRadians = this.degreesToRadians(angleInDegrees);
    }

    degreesToRadians(degrees) {
        return degrees * (PI / 180);
    }

    released() {
        this.dragging = false;
    }

    getXmiddle() {
        return this.x + this.w / 2;
    }

    getYmiddle() {
        return this.y + this.h / 2;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getPoleCords(isNorthPole) {
        let sign = isNorthPole ? -1 : 1;
        let x = (sign * this.w / 2) * Math.cos(this.rotationInRadians);
        let y = (sign * this.w / 2) * Math.sin(this.rotationInRadians);
        return [this.getXmiddle() + x, this.getYmiddle() + y];
    }

    setDrawFields(canDraw) {
        this.drawFields = canDraw;
    }
}