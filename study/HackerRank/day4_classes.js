class Polygon {
    constructor(intList){
        this.sides = intList;
    };
    perimeter() {
        return this.sides.reduce((a, b) => a + b, 0);
    };
}
