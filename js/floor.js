class FloorTile {
    constructor(position) {
        this.position = position;
        this.trees = [];
        this.candycanes = [];
        this.grade = -0.3;
    }
    draw() {
        var model = mat4.create();
        mat4.translate(model, model, vec3.fromValues(this.position[0], this.position[1]+20, this.position[2]));
        mat4.rotateX(model, model, this.grade);
        mat4.rotateX(model, model, 1.57);
        mat4.translate(model, model, vec3.fromValues(0, -20, 0));
        mat4.scale(model, model, vec3.fromValues(41,41,1));
        gl.uniformMatrix4fv(gl.getUniformLocation(render.shader, "model"), false, model);
        gl.bindTexture(gl.TEXTURE_2D, texture.floor);
        gl.bindVertexArray(render.planeVAO);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        for(let i = 0; i < 2; i++) {
            model = mat4.create();
            mat4.translate(model, model, vec3.fromValues(this.position[0] - 20 + i*40, this.position[1] + 20, this.position[2] - 20));
            mat4.rotateY(model, model, 1.57);
            mat4.scale(model, model, vec3.fromValues(50, 40, 1));
            gl.uniformMatrix4fv(gl.getUniformLocation(render.shader, "model"), false, model);
            gl.bindTexture(gl.TEXTURE_2D, texture.background);
            gl.bindVertexArray(render.planeVAO);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }

        for(let i = 0; i < this.trees.length; i++) {
            this.trees[i].draw();
        }
        for(let i = 0; i < this.candycanes.length; i++) {
            this.candycanes[i].draw();
        }
    }
    update() {
        this.position[2] -= camera.zMovement;

        for(let i = 0; i < this.trees.length; i++) {
            this.trees[i].update();
        }
        for(let i = 0; i < this.candycanes.length; i++) {
            this.candycanes[i].update();
        }
    }
    createTrees() {
        this.trees = [];
        for(let i = 0; i < 20; i++) {
            var x = Math.floor(Math.random() * 40) - 20;
            var tree = new Tree(vec3.fromValues(x, (this.position[1]+22.25) + i*2*(this.grade*1.01), this.position[2] - i*2));
            this.trees.push(tree);
        }

        var candycaneChance = Math.floor(Math.random() * 3);
        if(candycaneChance == 1) {
            var x = Math.floor(Math.random() * 40) - 20;
            var cane = new CandyCane(vec3.fromValues(x, (this.position[1]+23) + 10*(this.grade*1.01), this.position[2] - 10));
            this.candycanes.push(cane);
        }
    }
}