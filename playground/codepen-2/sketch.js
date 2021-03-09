/*
  Johan Karlsson, 2021
  https://twitter.com/DonKarlssonSan
  MIT License, see Details View
  
  Can you find the "secret"?
*/

let canvas;
let ctx;
let w, h;
let prng;

class Walker {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.angle = prng() * Math.PI * 2;
        this.direction = prng() * Math.PI * 2;
        this.baseHue = Math.round(prng() * 8) * 45;
        this.tick = 0;
        this.stepSize = prng() * 0.2 + 0.1;
        this.width = prng() * 80 + 20;
    }

    walk() {
        this.direction += (prng() - 0.5) * Math.PI / 6;
        let deltaAngle = prng() * Math.PI / 6;
        this.angle += deltaAngle;
        this.x += Math.cos(this.direction) * this.stepSize;
        this.y += Math.sin(this.direction) * this.stepSize;
        this.tick++;
    }

    drawEyes(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        let length = this.width * 0.3;
        let r = length * (prng() * 0.5 + 0.3);
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.arc(-length, 0, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(length, 0, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();

        r *= 0.5;
        ctx.fillStyle = "black";
        ctx.beginPath();
        let xOffset = (prng() - 0.5) * r;
        let yOffset = (prng() - 0.5) * r;
        ctx.arc(-length + xOffset, yOffset, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
        ctx.beginPath();
        xOffset = (prng() - 0.5) * r;
        yOffset = (prng() - 0.5) * r;
        ctx.arc(length + xOffset, yOffset, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();

        let angleOffset = Math.PI;
        ctx.beginPath();
        ctx.arc(0, -length * 0.5, r, angleOffset, Math.PI + angleOffset);
        ctx.stroke();

        ctx.restore();
    }

    draw(ctx) {
        let length = this.width;
        let angle1 = this.angle - Math.PI / 2;
        let x1 = Math.cos(angle1) * length + this.x;
        let y1 = Math.sin(angle1) * length + this.y;
        let angle2 = this.angle + Math.PI / 2;
        let x2 = Math.cos(angle2) * length + this.x;
        let y2 = Math.sin(angle2) * length + this.y;
        let hue = (Math.sin(this.tick / 1000) + 1) * 20 + this.baseHue;
        ctx.strokeStyle = `hsla(${hue}, 80%, 60%, 0.3)`;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    update(ctx) {
        this.walk();
        this.draw(ctx);
    }
}



function setup() {
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");
    resize();
    window.addEventListener("resize", () => {
        resize();
        draw();
    });
    canvas.addEventListener("click", draw);
}

function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}

function drawText(text) {
    ctx.save();
    let fontSize = w * 0.02;
    ctx.font = fontSize + "px monospace";
    ctx.fillStyle = "black";
    ctx.fillText(text, w * 0.03, h * 0.97);
    ctx.restore();
}

function draw() {
    let urlString = window.location.href;
    let url = new URL(urlString);
    let seed = url.searchParams.get("seed");
    prng = new Math.seedrandom(seed);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);
    let nrOfWalkers = Math.round(prng() * 16 + 2);
    let walkers = [];
    for (let i = 0; i < nrOfWalkers; i++) {
        let x = prng() * w;
        let y = prng() * h;
        let walker = new Walker(x, y);
        walkers.push(walker);
    }
    walkers.forEach(walker => {
        let nrOfSteps = prng() * 18000 + 1000;
        for (let i = 0; i < nrOfSteps; i++) {
            walker.update(ctx);
        }
        walker.drawEyes(ctx);
    });
    if (seed) {
        drawText(seed);
    }
}

setup();
draw();