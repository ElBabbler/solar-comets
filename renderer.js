const sun = new Image();
const moon = new Image();
const earth = new Image();

const objects = {};

function init() {
    sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
    moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
    earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';

    objects.earth = {rotateDiv: [60, 60000], translate: [105, 0], drawImage: [earth, -12, -12]};
    objects.moon = {rotateDiv: [6, 6000], translate: [0, 28.5], drawImage: [moon, -3.5, -3.5]};


    setInterval(drawAllObjects, 10);
}

function drawAllObjects() {
    var ctx = document.getElementById('canvas').getContext('2d');

    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, 300, 300); // clear canvas

    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.strokeStyle = 'rgba(0,153,255,0.4)';
    ctx.save();
    ctx.translate(150, 150);

    var time = new Date();
    Object.keys(objects).forEach(k => drawObject(ctx, objects[k], time));

    ctx.restore();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(150, 150, 105, 0, Math.PI * 2, false); // Earth orbit
    ctx.stroke();

    ctx.drawImage(sun, 0, 0, 300, 300);
}

function drawObject(ctx, body, time) {
    ctx.rotate(((2 * Math.PI) / body.rotateDiv[0]) * time.getSeconds() + ((2 * Math.PI) / body.rotateDiv[1]) * time.getMilliseconds());
    ctx.translate(body.translate[0], body.translate[1]);
    ctx.drawImage(body.drawImage[0], body.drawImage[1], body.drawImage[2]);
}