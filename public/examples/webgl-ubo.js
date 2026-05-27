// Uniform Buffer Object — WebGL 原生
// 知识点：UBO, uniform 块, WebGL2 缓冲机制

var vsSource = `#version 300 es
layout(location = 0) in vec2 a_position;
layout(location = 1) in vec3 a_color;

uniform SceneData {
  mat4 u_projection;
  mat4 u_view;
};

out vec3 v_color;

void main() {
  gl_Position = u_projection * u_view * vec4(a_position, 0.0, 1.0);
  v_color = a_color;
}`;

var fsSource = `#version 300 es
precision mediump float;
in vec3 v_color;
out vec4 fragColor;

void main() {
  fragColor = vec4(v_color, 1.0);
}`;

var program = createProgram(vsSource, fsSource);
gl.useProgram(program);

// 创建 UBO
var ubo = gl.createBuffer();
gl.bindBuffer(gl.UNIFORM_BUFFER, ubo);
// 分配两个 mat4 (32 floats * 4 bytes = 128 bytes)
gl.bufferData(gl.UNIFORM_BUFFER, 128, gl.DYNAMIC_DRAW);
gl.bindBuffer(gl.UNIFORM_BUFFER, null);

// 绑定 UBO 到 binding point 0
var sceneBlockIndex = gl.getUniformBlockIndex(program, 'SceneData');
gl.uniformBlockBinding(program, sceneBlockIndex, 0);
gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, ubo);

// 顶点数据
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

// 矩阵工具
var projMat = mat4.identity();
var viewMat = mat4.identity();

window.render = function(gl, canvas, dt) {
  // 更新投影矩阵（UBO offset 0）
  var fovy = Math.PI / 4;
  var aspect = canvas.width / canvas.height;
  projMat = mat4.perspective(fovy, aspect, 0.1, 100);

  // 更新视图矩阵（UBO offset 64）
  viewMat = mat4.identity();
  var t = Date.now() * 0.001;
  viewMat = mat4.translate(viewMat, 0, 0, -3);
  viewMat = mat4.rotateY(viewMat, t * 0.3);

  // 写入 UBO
  gl.bindBuffer(gl.UNIFORM_BUFFER, ubo);
  gl.bufferSubData(gl.UNIFORM_BUFFER, 0, new Float32Array(projMat));
  gl.bufferSubData(gl.UNIFORM_BUFFER, 64, new Float32Array(viewMat));

  gl.clearColor(0.1, 0.1, 0.18, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
};
