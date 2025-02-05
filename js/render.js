class Renderer {
    constructor() {
        this.planeVAO = this.createVAO(
          [-0.5, -0.5, -0.5,  1.0, 1.0,
            0.5, -0.5, -0.5,  0.0, 1.0,
            0.5,  0.5, -0.5,  0.0, 0.0,
            0.5,  0.5, -0.5,  0.0, 0.0,
           -0.5,  0.5, -0.5,  1.0, 0.0,
           -0.5, -0.5, -0.5,  1.0, 1.0]
        );
        this.shader = this.createShader(vertexShaderSource, fragmentShaderSource);
        gl.useProgram(this.shader);

        this.projectionMatrix = mat4.create();
        mat4.perspective(this.projectionMatrix, 1, canvas.width/canvas.height, 0.1, 100);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.shader, "proj"), false, this.projectionMatrix);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.shader, "view"), false, mat4.create());
        gl.uniformMatrix4fv(gl.getUniformLocation(this.shader, "model"), false, mat4.create());

    }
    createVAO(vertices) {
        var vbo = gl.createBuffer();
        var vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 20, 0);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 20, 12);
        gl.enableVertexAttribArray(1);
        return vao;
    }
    createShader(vsource, fsource) {
        var vs = gl.createShader(gl.VERTEX_SHADER);
        var fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(vs, vsource);
        gl.shaderSource(fs, fsource);
        gl.compileShader(vs);
        gl.compileShader(fs);
        console.log(gl.getShaderInfoLog(vs) + "__________" + gl.getShaderInfoLog(fs));
        var program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        return program;
    }
}

class TextureLoader {
    constructor() {
        this.tree = [this.loadTexture("data/tree1.png"), this.loadTexture("data/tree2.png"), this.loadTexture("data/tree3.png")];
        this.floor = this.loadTexture("data/floor.png");
        this.background = this.loadTexture("data/background.png");
        this.cane = this.loadTexture("data/cane.png");
    }
    loadTexture(src) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        var image = new Image();
        image.onload = function() {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        image.src = src;
        return texture;
    }
}

var vertexShaderSource = `#version 300 es

layout (location = 0) in vec3 aPos;
layout (location = 1) in vec2 aTexCoord;

out highp vec2 texCoord;

uniform highp mat4 proj;
uniform highp mat4 view;
uniform highp mat4 model;

void main() {
    texCoord = aTexCoord;
    gl_Position = proj * view * model * vec4(aPos, 1.0);
}

`

var fragmentShaderSource = `#version 300 es

out highp vec4 FragColor;

in highp vec2 texCoord;
uniform sampler2D aTexture;

void main() {
    FragColor = texture(aTexture, texCoord);
    if(FragColor.a < 0.5) {
        discard;
    }
}

`