const mathjs = require('mathjs');

exports.CoordinateConvertor = class CoordinateConvertor {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    xyToPlot(coords) {
        return [coords[0] + this.width / 2, this.height / 2 -  coords[1]];
    }

    xzToPlot(coords) {
        return [coords[0] + this.width / 2, this.height / 2 -  coords[2]];
    }

    turnLeft(coords) {
        const tMatrix = mathjs.matrix([[0, -1], [1, 0]]);
        const result =  mathjs.multiply(mathjs.matrix(coords), tMatrix).valueOf();
        console.log(result);
        return result;
    }
};
