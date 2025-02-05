/** @type{HTMLCanvasElement} */
const canvas = document.getElementById("canv");
const canvas2d = document.getElementById("canvas2d");
const gl = canvas.getContext("webgl2");
const ctx = canvas2d.getContext("2d");
var canvasScale;
var canvasFont;

var render,camera, texture;

function start() {

    gl.enable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    canvasFont = new FontFace("pixelFont", "url(data/font.ttf)")
    document.fonts.add(canvasFont);
    
    render = new Renderer();
    texture = new TextureLoader();
    camera = new Camera();
    
    sfx.load();
    canvasResize();
    setupGame();
    setupSnowflakes();
    update();
}

function update() {
    sfx.loop();
    camera.update();
    updateFloor();
    draw();
    requestAnimationFrame(update);
}

function draw() {
    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    drawFloor();
    updateMenuElements();
}

function canvasResize() {
    if(window.innerWidth > window.innerHeight*1.8) {
        canvas.height = window.innerHeight;
        canvas.width = canvas.height * 1.8;
        canvasScale = canvas.height / 720;
    } else {
        canvas.width = window.innerWidth;
        canvas.height = canvas.width / 1.8;
        canvasScale = canvas.width / 1280;
    }
    canvas2d.width = canvas.width;
    canvas2d.height = canvas.height;
    gl.viewport(0,0,canvas.width, canvas.height);
    mat4.perspective(render.projectionMatrix, 1, canvas.width/canvas.height, 0.1, 100);
    gl.uniformMatrix4fv(gl.getUniformLocation(render.shader, "proj"), false, render.projectionMatrix);
}

function resetGame() {
    camera = new Camera();
    setupGame();
}

document.body.onresize = canvasResize;
document.body.onload = start;

var sfx = {
    interacted: false,
    backgroundMusic: document.createElement("audio"),
    die: document.createElement("audio"),
    collect: document.createElement("audio"),
    load() {
        this.backgroundMusic.src = "data/background_music.wav";
        this.die.src = "data/die.wav";
        this.collect.src = "data/collect.wav";
        this.backgroundMusic.volume = 0.5;
    },
    loop() {
        if(this.backgroundMusic.currentTime > 15.9) {
            this.backgroundMusic.currentTime = 0;
        }
    }
}