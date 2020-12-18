const { request } = require("http");

var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    void main() {
        gl_Position = u_ModelMatrix * a_Position;
    }
`;
var FSHADER_SOURCE = `
    void main() {
        gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
    }
`;


var ANGLE_STEP = 45.0;

function main() {
    var canvas = document.getElementById('webgl')
    var gl = canvas.getContext('webgl')
    if (!gl) {
        console.log('1');
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('2');
        return;
    }
    var n = initVertexBuffer(gl);
    if(n < 0) {
        console.log('3');
        return;
    }
    // 设置清理颜色
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    // 从本地uniform缓存中读取u_ModelMatrix变量
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if(!u_ModelMatrix) {
        console.log('4');
        return;
    }

    var currentAngle = 0;
    var modelMatrix = new Matrix4()
    var tick = function() {
        currentAngle = animate(currentAngle)
        draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix)
        requestAnimationFrame(tick)
    }
    tick()
}

// 初始化缓冲区分区
function initVertexBuffer(gl) {
    // 缓冲区值
    var vertices = new Float32Array([
        0, 0.5,
        -0.5, -0.5,
        0.5, -0.5
    ])
    var n = 3;

    // 1. 创建缓冲区
    var vertixBuffer = gl.createBuffer()
    // 2. 绑定缓冲区
    gl.bindBuffer(gl.ARRAY_BUFFER, vertixBuffer)
    // 3. 填充缓冲区
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    // 将缓冲区对象分配给a_position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
    // 启用缓冲区
    gl.enableVertexAttribArray(a_Position)
    return n;
}

function animate(angle) {

}

function draw() {

}

main();