function initShaders(gl, vertexShaderSource, fragmentShaderSource){
	var vertexShader = gl.createShader(gl.VERTEX_SHADER)
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(vertexShader,vertexShaderSource);
	gl.shaderSource(fragmentShader,fragmentShaderSource);
	
	gl.compileShader(vertexShader);
	gl.compileShader(fragmentShader);
	
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	
	gl.linkProgram(program);
	console.log(program)
	gl.useProgram(program);
	gl.program = program;
	return program;
}

function main() {
	//通过getElementById()方法获取canvas画布
	var canvas=document.getElementById('webgl');
	//通过方法getContext()获取WebGL上下文
	var gl=canvas.getContext('webgl');
	//顶点着色器源码
	var vertexShaderSource = `
		attribute vec4 a_Position;
		attribute float a_PointSize;
		void main() {
			// 顶点位置，位于坐标原点
			gl_Position = a_Position;
			// 给内置变量gl_PointSize赋值像素大小
			gl_PointSize=a_PointSize;
		}
	`;
	//片元着色器源码
	var fragShaderSource = `
		precision mediump float;
	    uniform vec4 u_FragColor;
		void main(){
			gl_FragColor = u_FragColor;
		}
	`;
	// 初始化着色器
	initShaders(gl,vertexShaderSource,fragShaderSource);

	var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
	if(!a_Position < 0) {
		console.log('Failed to get the storage location of a_Position');
		return;
	}
	
	var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize')
	if(!a_PointSize < 0) {
		console.log('Failed to get the storage location of a_PointSize');
		return;
	}
	
	

	var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')
	if (!u_FragColor) {
		console.log('Failed to get the storage location of u_FragColor');
		return;
    }

	// 注册鼠标点击事件
	canvas.onmousedown = function(ev) {
		click(ev, gl, canvas, a_Position, a_PointSize, u_FragColor)
	}

	var g_points=[]//鼠标点击位置按钮
    var g_colors=[]
	function click(ev, gl, canvas, a_Position, a_PointSize, u_FragColor) {
		var x = ev.clientX;
		var y = ev.clientY;
		var rect = ev.target.getBoundingClientRect();
		x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
		y = (canvas.height/2 - (y-rect.top))/(canvas.height/2);
		g_points.push([x, y])

        if (x >= 0.0 && y >= 0.0) {      // First quadrant
		  g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
	    } else if (x < 0.0 && y < 0.0) { // Third quadrant
		  g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
	    } else {                         // Others
		  g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
	    }
        
        // 清理canvas		
		gl.clear(gl.COLOR_BUFFER_BIT);
		// 为变量a_PointSize设置具体值
		gl.vertexAttrib1f(a_PointSize, 10)
		
		var len = g_points.length
		for(var i = 0; i<len; i++) {
            var xy = g_points[i];
			var rgba = g_colors[i];
			console.log(rgba)
			// 为变量a_Position设置具体值
			gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0)
			// 为变量u_FragColor设置具体值
			gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
			// 画
			gl.drawArrays(gl.POINTS, 0, 1)
		}
	}

	gl.clearColor(0, 0, 0, 0.5)// 设置清理背景色
	gl.clear(gl.COLOR_BUFFER_BIT) // 清理背景
}
main()




