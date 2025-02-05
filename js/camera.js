class Camera {
    constructor() {
        this.position = vec3.fromValues(0,20,0);
        this.front = vec3.fromValues(0,0,-1);
        this.up = vec3.fromValues(0.0,1.0,0);

        this.moving = false;
        this.dying = false;
        this.timeDying = 0;
        this.score = 0;
        this.control = 0.008;
        this.gameSpeed = 0.1;

        this.animatingFOVTick = 0;
        this.fov = 1;

        this.billboardMatrix = mat4.create();

        this.pitch = 0;
        this.yaw = -1.57;

        this.yawSpeed = 0;

        this.zMovement = 0;
        this.xMovement = 0;

        this.currentTile = 0;
    }
    update() {
        if(this.moving) {
            this.updateMovement();
            this.updateYPosition();
        }
        if(!this.dying) {
            this.updateRestrictions();
        }
        this.updateEffects();
        this.updateCameraAngle();
    }
    updateMovement() {
        this.yaw += this.yawSpeed;
        if(this.yawSpeed > 0) {
            //this.up = vec3.fromValues(0.1, 0.9, 0.0);
            this.up[1] -= 0.001;
            this.up[0] += 0.001;
        } else if(this.yawSpeed < 0) {
            //this.up = vec3.fromValues(-0.1, 0.9, 0.0);
            this.up[1] -= 0.001;
            this.up[0] -= 0.001;
        } else {
            //this.up = vec3.fromValues(0,1,0);
            if(this.up[0] > 0.01) {
                this.up[0] -= 0.005;
                this.up[1] -= 0.005;
            } else if (this.up[0] < -0.01) {
                this.up[0] += 0.005;
                this.up[1] += 0.005;
            } else {
                this.up[0] = 0;
                this.up[1] = 1;
            }
        }
        if(this.xMovement < Math.cos(this.yaw)) {
            this.xMovement += this.control;
        } else {
            this.xMovement -= this.control;
        }
        if(this.zMovement < Math.sin(this.yaw)) {
            this.zMovement += this.control;
        } else {
            this.zMovement -= this.control;
        }
        this.position[0] += this.xMovement * this.gameSpeed;
        this.zMovement = (this.zMovement + 1) * -this.gameSpeed;

    }
    updateYPosition() {
        var fy = (floorTiles[this.currentTile].position[1] + 21);
        var fz = floorTiles[this.currentTile].position[2];
        var final = fy + (this.position[2] - fz) * (-floorTiles[this.currentTile].grade*(1+this.gameSpeed/10));
        if(this.position[1] < final - 0.1) {
            this.position[1] += 0.05 * (this.gameSpeed*10);
        } else if (this.position[1] > final + 0.1) {
            this.position[1] -= 0.05 * (this.gameSpeed*10);
        } else {
            this.position[1] = final;
        }
        if(this.pitch > floorTiles[this.currentTile].grade + 0.1) {
            this.pitch-=0.005;
        }
        if (this.pitch < floorTiles[this.currentTile].grade + 0.1) {
            this.pitch+=0.005;
        }
    }
    updateRestrictions() {
        if(this.position[0] < -20) {
            this.position[0] = -20
        }
        if(this.position[0] > 19) {
            this.position[0] = 19;
        }
        if(this.yaw < -3) {
            this.yaw = -3;
        }
        if(this.yaw > 0) {
            this.yaw = 0;
        }
    }
    updateCameraAngle() {
        var direction = vec3.fromValues(0,0,0);
        direction[0] = Math.cos(this.yaw) * Math.cos(this.pitch);
        direction[1] = Math.sin(this.pitch);
        direction[2] = Math.sin(this.yaw) * Math.cos(this.pitch);
        vec3.normalize(this.front, direction);

        var viewMatrix = mat4.create();
        mat4.lookAt(viewMatrix, this.position, vec3.add(this, this.position, this.front), this.up);
        gl.uniformMatrix4fv(gl.getUniformLocation(render.shader, "view"), false, viewMatrix);

        var np = vec3.fromValues(0,0,0);
        this.billboardMatrix = mat4.lookAt(this, np, this.front, this.up);
        mat4.invert(this.billboardMatrix, this.billboardMatrix);
    }
    updateEffects() {
        this.score += Math.abs(this.yawSpeed) * 100;
        if(this.score > 300) {
            this.control = 0.005;
            if(this.score > 2500) {
                this.control = 0.003;
            }
        }
        if(this.animatingFOVTick > 0) {
            this.animatingFOVTick++;
            if(this.animatingFOVTick > 30 || this.animatingFOVTick < 5) {
                this.fov -= 0.02;
            } else {
                this.fov += 0.02;
            }
            if(this.animatingFOVTick > 50) {
                this.animatingFOVTick = false;
                this.fov = 1;
            }
            mat4.perspective(render.projectionMatrix, this.fov, canvas.width/canvas.height, 0.1, 100);
            gl.uniformMatrix4fv(gl.getUniformLocation(render.shader, "proj"), false, render.projectionMatrix);     
        }
        if(this.dying) {
            this.yawSpeed = 0.03;
            this.position[1]-=0.1;
            this.timeDying++;
            if(this.timeDying > 80) {
                previousScore = this.score;
                resetGame();
            }
        }
    }
}