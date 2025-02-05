class Tree {
    constructor(position) {
        this.position = position;
        this.texture = Math.floor(Math.random() * 3);
    }
    draw() {
        var model = mat4.create();
        mat4.translate(model, model, this.position);
        mat4.multiply(model, model, camera.billboardMatrix);
        mat4.scale(model, model, vec3.fromValues(2,4,1));
        gl.uniformMatrix4fv(gl.getUniformLocation(render.shader, "model"), false, model);
        gl.bindTexture(gl.TEXTURE_2D, texture.tree[this.texture]);
        gl.bindVertexArray(render.planeVAO);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    update() {
        this.position[2] -= camera.zMovement;

        if(camera.position[0] > this.position[0] - 1 && camera.position[0] < this.position[0] + 1) {
            if(camera.position[2] > this.position[2] - 0.5 && camera.position[2] < this.position[2] + 0.5) {
                if(!camera.dying) {
                    sfx.die.play();
                    camera.dying = true;
                }
            }
        }
    }
}

class CandyCane {
    constructor(position) {
        this.position = position;
        this.animationTick = 0;
        this.collected = false;
    }
    draw() {
        if(!this.collected) {
            var model = mat4.create();
            mat4.translate(model, model, this.position);
            mat4.multiply(model, model, camera.billboardMatrix);
            mat4.scale(model, model, vec3.fromValues(1.5, 3.6, 1));
            gl.uniformMatrix4fv(gl.getUniformLocation(render.shader, "model"), false, model);
            gl.bindTexture(gl.TEXTURE_2D, texture.cane);
            gl.bindVertexArray(render.planeVAO);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
    }
    update() {
        if(!this.collected) {
            this.position[2] -= camera.zMovement;
            this.animationTick = (this.animationTick + 1) % 100;
            this.position[1] += (this.animationTick < 50) ? -0.015 : 0.015;
            if(camera.position[0] > this.position[0] - 0.75 && camera.position[0] < this.position[0] + 0.75) {
                if(camera.position[2] > this.position[2] - 0.5 && camera.position[2] < this.position[2] + 0.5) {
                    camera.gameSpeed+=0.01;
                    camera.animatingFOVTick = 1.0;
                    sfx.collect.play();
                    this.collected = true;
                }
            }
        }
    }
}