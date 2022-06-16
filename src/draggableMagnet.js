class DraggableMagnet {
    constructor(width, height) {

        this.dragging = false;
        this.rollover = false;

        this.x = 300;
        this.y = 300;
        this.w = width;
        this.h = height;
        this.colors = [
            [255, 0, 0],
            [0, 70, 255]
        ];
        this.img = loadImage('assets/magnet.png');

        this.rotationInRadians = 0;
    }

    over() {
        if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
            this.rollover = true;
        } else {
            this.rollover = false;
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
        translate(this.x + this.w / 2, this.y + this.h / 2);
        rotate(this.rotationInRadians)
        image(this.img, -this.w / 2, -this.h / 2, this.w, this.h);
        // translate(-(this.x + this.w / 2), -(this.y + this.h / 2));
        pop()
            // rotate(-this.degreesToRadians(this.rotationInDegrees));
    }

    pressed() {
        if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
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

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getMinX() {
        return this.x;
    }

    getMaxX() {
        return this.x + this.w;
    }

    getYMiddle() {
        return this.y + this.h / 2;
    }
}