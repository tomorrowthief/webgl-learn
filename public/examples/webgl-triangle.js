// WebGL Hello World — 彩色三角形
// 知识点：Shader编译、VBO、VAO、顶点颜色 attribute

var vsSource = 'attribute vec2 a_position;\nattribute vec3 a_color;\nvarying vec3 v_color;\nvoid main() {\n  gl_Position = vec4(a_position, 0.0, 1.0);\n  v_color = a_color;\n}';

var fsSource = 'precision mediump float;\nvarying vec3 v_color;\nvoid main() {\n  gl_FragColor = vec4(v_color, 1.0);\n}';

var program = createProgram(vsSource, fsSource);
gl.useProgram(program);

// 顶点数据：位置(x,y) + 颜色(r,g,b) 交错排列
var vertices = new Float32Array([
  0.0,  0.6,  1.0, 0.0, 0.0,
  -0.6, -0.4,  0.0, 1.0, 0.0,
   0.6, -0.4,  0.0, 0.0, 1.0,
]);

var vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

var aPos = gl.getAttribLocation(program, 'a_position');
var aColor = gl.getAttribLocation(program, 'a_color');

gl.enableVertexAttribArray(aPos);
gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 20, 0);

gl.enableVertexAttribArray(aColor);
gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 20, 8);

window.render = function(gl, canvas, dt) {
  gl.clearColor(0.1, 0.1, 0.18, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}