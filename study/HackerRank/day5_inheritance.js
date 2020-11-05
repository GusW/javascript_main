class Rectangle {
    constructor(w, h) {
        this.w = w;
        this.h = h;
    }
}

Rectangle.prototype.area = function() {
    return Number(this.w) * Number(this.h);
}

class Square extends Rectangle {
    constructor(l) {
        super(l, l);
    }
}
