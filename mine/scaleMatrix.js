// 顶点着色器
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_xformMatrix;
    void main() {
        gl_Position = u_xformMatrix * a_Position;
    }
`;

// 片元着色器代码
var FSHADER_SOURCE = `
    void main(){
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`

var ANGLE = 90.0

function main() {
    var canvas = document.getElementById('webgl')

    var gl = getWebGLContext(canvas)

    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('初始化着色器失败');
        return
    }

    var n = initVertexBuffers(gl)
    if(n < 0) {
        console.log('设置失败');
        return;
    }
    
    var sx = 1.5, sy = 1.5, sz = 1.0;
    // 声明一个4x4矩阵
    var xformMatrix = new Float32Array([
        sx, 0.0, 0.0, 0.0,
        0.0, sy, 0.0, 0.0,
        0.0, 0.0, sz, 0.0, 
        0.0, 0.0, 0.0, 1.0
    ])
    // 或者u_xformMatrix变量
    var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix')
    // 将u_xformMatrix变量值设置为xforMatrix
    gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix)

    // 设置清理canvas背景颜色
    gl.clearColor(0, 0, 0, 1)
    // 执行清理背景色
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, n)
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0, 0.5,  -0.5, -0.5,  0.5, -0.5
    ])

    var n = 3;
    var vertexBuffer = gl.createBuffer()
    if(!vertexBuffer) {
        console.log('创建缓冲区失败！');
        return false;
    }

    // 绑定缓冲区
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

    // 向缓冲区写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    // 获取a_Position变量
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    if(a_Position < 0) {
        console.log('获取a_Position变量失败！');
        return -1;
    }

    // 向变量a_Position写入值
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT,false, 0, 0)// Pointer后缀可以写入多个值

    // 启用a_Position变量
    gl.enableVertexAttribArray(a_Position)
    return n;
}

main()