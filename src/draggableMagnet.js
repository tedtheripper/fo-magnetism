class DraggableMagnet {
    constructor(width, height) {

        this.dragging = false;
        this.rollover = false;

        this.x = 300;
        this.y = 300;
        this.w = width;
        this.h = height;
        this.img = loadImage('assets/magnet.png');

        this.r = Math.sqrt(Math.pow(this.w / 2, 2) + Math.pow(this.h / 2, 2))
        this.rotationInRadians = 0;
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
            if (newXPosition < 0) {
                this.x = 0;
            } else if (newXPosition + this.w > windowWidth) {
                this.x = windowWidth - this.w;
            } else {
                this.x = newXPosition;
            }

            if (newYPosition < 0) {
                this.y = 0;
            } else if (newYPosition + this.h > windowHeight * 3 / 4) {
                this.y = windowHeight * 3 / 4 - this.h;
            } else {
                this.y = newYPosition;
            }
        }
    }

    show() {
        push()
        translate(this.getXmiddle(), this.getYmiddle());
        rotate(this.rotationInRadians)
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
        let sign = isNorthPole? -1:  1;
        let x = (sign * this.w/2)*Math.cos(this.rotationInRadians);
        let y = (sign * this.w/2)*Math.sin(this.rotationInRadians);
        return [this.getXmiddle() + x, this.getYmiddle() + y];
    }
}