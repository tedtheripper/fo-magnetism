class Graph {
    constructor(pos_x, pos_y, w, h, n) {
        this.x = pos_x;
        this.y = pos_y;
        this.w = w;
        this.h = h;
        this.padding = 10;
        this.stepSize = (this.w - 2 * this.padding)/n;
    }

    show(values) {
        push();
        noStroke();
        let valuesMax = Math.max(...values);
        let valuesMin = Math.min(...values);
        translate(this.x, this.y);
        fill(255);
        rect(0, 0, this.w, this.h);
        fill(255, 153, 51);
        let i = 0;
        values.forEach(element => {
            let sampleHeight =  (element - valuesMin)/(valuesMax-valuesMin);
            rect(this.padding  + this.stepSize*i, this.h-this.padding , this.stepSize, -(this.h-2*this.padding) * sampleHeight);
            i++;
        });
        fill(0);
        textSize(12);
        text(valuesMin.toFixed(4) + " V", this.padding, this.h - this.padding);
        text(valuesMax.toFixed(4) + " V", this.padding, this.padding);
        pop();
    }
}