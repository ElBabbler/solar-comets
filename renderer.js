const sun = new Image();
const moon = new Image();
const earth = new Image();

const CANVAS_SIZE = {width: 400, height: 400};

let isLookFromTop = true;

const objects = {};

var canvas;

function init() {
    sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
    moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
    earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';

    objects.moon = [moon, 0, 0];

    canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.strokeStyle = 'rgba(0,153,255,0.2)';
    ctx.save();
    setInterval(drawAllObjects, 10);
}

function replaceMoon() {
    randomMoon();
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
    ctx.drawImage(moon, objects.moon[1], objects.moon[2]);
}

function randomMoon() {
    objects.moon[1] = Math.random() * CANVAS_SIZE.width;
    objects.moon[2] = Math.random() * CANVAS_SIZE.height;
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