const mathjs = require('mathjs');

exports.CoordinateConvertor = class CoordinateConvertor {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    xyToPlot(coords) {
        return [coords[0] + this.width / 2, this.height / 2 - coords[1]];
    }

    xzToPlot(coords) {
        return [coords[0] + this.width / 2, this.height / 2 - coords[2]];
    }

    turnLeft(coords) {
        const tMatrix = mathjs.matrix([[0, -1], [1, 0]]);
        const result = mathjs.multiply(mathjs.matrix(coords), tMatrix).valueOf();
        console.log(result);
        return result;
    }
};

const muGrav = 39.47667;
const EPSILON = 0.001;
const REALLY_SMALL = 0.0000001;

exports.OrbitCalculator = class OrbitCalculator {
    constructor(start_time, sm_axis, pass_time, eccent, note_arg, per_arg, inclan) {
        this.sm_axis = sm_axis; // a
        this.eccent = eccent; // e
        this.pass_time = pass_time;
        this.n = Math.sqrt(muGrav / (sm_axis * sm_axis * sm_axis)); // angle velocity
        this.R_note_arg_Matrix = mathjs.matrix([[Math.cos(-note_arg), Math.sin(-note_arg), 0], [-Math.sin(-note_arg), Math.cos(-note_arg), 0], [0, 0, 1]]); // R(-OMEGA)
        this.R_per_arg_Matrix = mathjs.matrix([[Math.cos(-per_arg), Math.sin(-per_arg), 0], [-Math.sin(-per_arg), Math.cos(-per_arg), 0], [0, 0, 1]]); // R(-omega)
        this.P_inclan_Matrix = mathjs.matrix([[1, 0, 0], [0, Math.cos(-inclan), Math.sin(-inclan)], [0, -Math.sin(-inclan), Math.cos(-inclan)]]); // P(-I)
        this.orbitalCoords = [0, 0, 0];
    }

    calculateOrbitalCoords(current_time) {
        const anomaly = this.n * (current_time - this.pass_time);
        const ecentricAnomaly = OrbitCalculator.calcEcentricAnomaly(this.eccent, anomaly);
        if (this.eccent < 1) {
            this.orbitalCoords[0] = this.sm_axis * (Math.cos(ecentricAnomaly) - this.eccent);
            this.orbitalCoords[1] = this.sm_axis * Math.sqrt(1 - this.eccent * this.eccent) * Math.sin(ecentricAnomaly);
            this.orbitalCoords[2] = 0;
        } else {
            this.orbitalCoords[0] = this.sm_axis * (Math.cosh(ecentricAnomaly) - this.eccent);
            this.orbitalCoords[1] = this.sm_axis * Math.sqrt(this.eccent * this.eccent - 1) * Math.sinh(ecentricAnomaly);
            this.orbitalCoords[2] = 0;
        }
    }

    calculateResultEclipticsCoords() {
        const firstRes = mathjs.multiply(this.R_note_arg_Matrix, this.P_inclan_Matrix);
        const secRes = mathjs.multiply(firstRes, this.R_per_arg_Matrix);
        const totalRes = mathjs.multiply(secRes, this.orbitalCoords);
        return totalRes.valueOf();
    }

    getCurrentCoordinatesToPlot(current_time) {
        this.calculateOrbitalCoords(current_time);
        return this.calculateResultEclipticsCoords();
    }

    static calcEcentricAnomaly(ecc, anomaly) {
        let res = anomaly;
        let resNext;
        let error;

        let i = 0;
        do {
            resNext = ecc < 1 ? res - (res - ecc * Math.sin(res) - anomaly) / (1 - ecc * Math.cos(res)) : res - (ecc * Math.sinh(res) - res - anomaly) / (ecc * Math.cosh(res) - 1);
            error = ecc < 1 ? Math.abs((resNext - res) / resNext) : Math.abs((resNext - res) / resNext);
            res = resNext;
            i += 1;
            if (i > 100) { break; }
        } while (error < EPSILON && REALLY_SMALL < resNext);

        return res;
    }


};
