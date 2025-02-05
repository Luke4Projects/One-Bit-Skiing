var toggleFlash = false;
var flashOpacity = 0.0;

function updateMenuElements() {
    ctx.clearRect(0,0,canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = 32*canvasScale + "px pixelFont";
    if(!camera.moving) {
        ctx.fillText("USE 'A' & 'D' TO CONTROL", 450*canvasScale, 300*canvasScale);
        if(previousScore != 0) {
            ctx.fillText("LAST SCORE: " + previousScore, 500*canvasScale, 348*canvasScale);
        }
    } else {
        ctx.fillText(camera.score, 10*canvasScale, 32*canvasScale);
    }

    displaySnowFlakes();
    deathWhiteFlash();

}

function deathWhiteFlash() {
    if(camera.timeDying > 40) {
        toggleFlash = true;
    }
    if(toggleFlash) {
        if(flashOpacity < 1.0) {
            flashOpacity+=0.04;
        } else {
            toggleFlash = false;
        }
    } else {
        if(flashOpacity > 0.04) {
            flashOpacity-=0.04;
        } else {
            flashOpacity = 0.0;
        }
    }
    ctx.globalAlpha = flashOpacity;
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.globalAlpha = 1.0;
}

var snowflakes = [];

function setupSnowflakes() {
    for(let i = 0; i < 10; i++) {
        var flake = {
            x: Math.floor(Math.random() * 1280),
            y: Math.floor(Math.random() * 720),
            size: Math.floor(Math.random() * 9) + 1 
        };
        snowflakes.push(flake);
    }
}

function displaySnowFlakes() {
    for(let i = 0; i < snowflakes.length; i++) {
        snowflakes[i].y += snowflakes[i].size;
        if(snowflakes[i].y > 720-snowflakes[i].size) {
            snowflakes[i].y = 0;
            snowflakes[i].x = Math.floor(Math.random() * 1280);
            snowflakes[i].size = Math.floor(Math.random() * 9) + 1;
        }
        snowflakes[i].x -= camera.yawSpeed*snowflakes[i].size*100;
        if(snowflakes[i].x > 1280) {
            snowflakes[i].x = 0;
        }
        if(snowflakes[i].x < 0) {
            snowflakes[i].x = 1280;
        }
        ctx.fillStyle = "white";
        ctx.fillRect(snowflakes[i].x*canvasScale, snowflakes[i].y*canvasScale, snowflakes[i].size*canvasScale, snowflakes[i].size*canvasScale);
    }
}