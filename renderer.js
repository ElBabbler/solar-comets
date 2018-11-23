const { CoordinateConvertor } = require('./src/utils/moveCaclculator');
const { OrbitCalculator } = require('./src/utils/moveCaclculator');

const sun = new Image();
const moon = new Image();
const earth = new Image();

const CANVAS_SIZE = {width: 400, height: 400};
const converter = new CoordinateConvertor(CANVAS_SIZE.width, CANVAS_SIZE.height);

let isLookFromTop = true;

const objects = {};

var canvas;

let currentTime = 1996;

function init() {
    sun.src = 'src/resources/Canvas_sun.png';
    moon.src = 'src/resources/Canvas_moon.png';
    earth.src = 'src/resources/Canvas_earth.png';

    objects.moon = [moon, 0, 0, 0, {orbit: {}}];
    objects.moon.calculator = new OrbitCalculator(1996, 100, 1995, 0.8, 0, 0, 0);

    canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.strokeStyle = 'rgba(0,153,255,0.2)';
    ctx.save();
    setInterval(drawAllObjects, 10);
}

function placeMoon() {
    objects.moon.orbit = {};
    const sm_axis = parseFloat(document.getElementById("sm-axis").value);
    const pass_time = parseFloat(document.getElementById("pass-time").value);
    const eccent = parseFloat(document.getElementById("eccent").value);
    const note_arg = parseFloat(document.getElementById("note-arg").value);
    const per_arg = parseFloat(document.getElementById("per-arg").value);
    const inclan = parseFloat(document.getElementById("inclan").value);

    objects.moon.orbit.sm_axis = sm_axis;
    objects.moon.orbit.eccent = eccent;
    objects.moon.orbit.pass_time = pass_time;
    objects.moon.orbit.inclan = inclan;
    objects.moon.orbit.per_arg = per_arg;
    objects.moon.orbit.note_arg = note_arg;

    console.log(objects.moon);
    objects.moon.calculator = new OrbitCalculator(currentTime, sm_axis, pass_time, eccent, note_arg, per_arg, inclan);
}

function replaceMoon() {
    // randomMoon();
    placeMoon();
}

function drawAllObjects() {
    const ctx = canvas.getContext('2d');

    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height); // clear canvas
    drawEarthOrbit();
    drawMoon();
    ctx.drawImage(sun, 0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);

    currentTime += 0.3;
}

function drawMoon() {
    var ctx = canvas.getContext('2d');
    const currentCoords = objects.moon.calculator.getCurrentCoordinatesToPlot(currentTime);
    for (let i = 0; i < 3; i++) {
        objects.moon[i + 1] = currentCoords[i]
    }
    const coords = isLookFromTop ? converter.xyToPlot(currentCoords) : converter.xzToPlot(currentCoords);
    ctx.drawImage(moon, coords[0], coords[1]);
}

function changeSight() {
    isLookFromTop = !isLookFromTop;
}

function drawEarthOrbit() {
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    if (isLookFromTop) {
        ctx.arc(CANVAS_SIZE.width / 2, CANVAS_SIZE.height / 2, CANVAS_SIZE.height / 4, 0, Math.PI * 2, false); // Earth orbit
    } else {
        ctx.rect(CANVAS_SIZE.height / 4, CANVAS_SIZE.width / 2, CANVAS_SIZE.width / 2, 1);
    }
    ctx.stroke();
}

function consoleCoords() {
    console.log(objects.moon);
}