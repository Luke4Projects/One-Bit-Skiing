function keyDown(e) {
    camera.moving = true;
    if(!sfx.interacted) {
        sfx.backgroundMusic.play();
        sfx.interacted = true;
    }
    switch(e.code) {
        case "KeyD":
            camera.yawSpeed = 0.01;
            break;
        case "KeyA":
            camera.yawSpeed = -0.01;
            break;
    }
}

function keyUp(e) {
    switch(e.code) {
        case "KeyD":
        case "KeyA":
            camera.yawSpeed = 0;
            break;
    }
}

document.onkeydown = keyDown;
document.onkeyup = keyUp;