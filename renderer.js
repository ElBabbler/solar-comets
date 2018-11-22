const {CoordinateConvertor} = require('./src/utils/moveCaclculator');

const sun = new Image();
const moon = new Image();
const earth = new Image();

const CANVAS_SIZE = {width: 400, height: 400};
const converter = new CoordinateConvertor(CANVAS_SIZE.width, CANVAS_SIZE.height);

let isLookFromTop = true;

const objects = {};

var canvas;

function init() {
    sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
    moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
    earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';

    objects.moon = [moon, 0, 0, 0];

    canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.strokeStyle = 'rgba(0,153,255,0.2)';
    ctx.save();
    setInterval(drawAllObjects, 10);
}

function placeMoon() {
    objects.moon[1] = parseInt(document.getElementById("x-coord").value);
    objects.moon[2] = parseInt(document.getElementById("y-coord").value);
    objects.moon[3] = parseInt(document.getElementById("z-coord").value);
    console.log(objects.moon)
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
}

function drawMoon() {
    var ctx = canvas.getContext('2d');
    const coords = isLookFromTop ? converter.xyToPlot(objects.moon.slice(1, 4)) : converter.xzToPlot(objects.moon.slice(1, 4));
    ctx.drawImage(moon, coords[0], coords[1]);
}

function randomMoon() {
    objects.moon[1] = Math.random() * CANVAS_SIZE.width - CANVAS_SIZE.width / 2;
    objects.moon[2] = Math.random() * CANVAS_SIZE.height - CANVAS_SIZE.height / 2;
    objects.moon[3] = Math.random() * CANVAS_SIZE.height - CANVAS_SIZE.width / 2;
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

function turnLeft() {
    const result = isLookFromTop ? converter.turnLeft(objects.moon.slice(1, 3)) : converter.turnLeft([objects.moon[1], objects.moon[3]]);
    objects.moon[1] = result[0];
    if (isLookFromTop) {
        objects.moon[2] = result[1];
    } else {
        objects.moon[3] = result[1];
    }
}