class DraggableMagnet {
    constructor() {

        this.dragging = false;
        this.rollover = false;

        this.x = 300;
        this.y = 300;
        this.w = 150;
        this.h = 50;
        this.northChild = null;
        this.southChild = null;
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
            this.x = mouseX + this.offsetX;
            this.y = mouseY + this.offsetY;
        }
    }

    show() {
        stroke(0);
        if (this.dragging) {
            fill(50);
        } else if (this.rollover) {
            fill(100);
        } else {
            fill(175, 200);
        }
        rect(this.x, this.y, this.w, this.h);
    }

    pressed() {
        if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
            this.dragging = true;
            this.offsetX = this.x - mouseX;
            this.offsetY = this.y - mouseY;
        }
        rotate(90)

    }

    released() {
        this.dragging = false;
    }
}