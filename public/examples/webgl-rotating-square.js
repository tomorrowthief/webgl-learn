// 旋转正方形 — 矩阵变换
// 知识点：Model矩阵、旋转、缩放、uniform传参

var vsSource = 'attribute vec2 a_position;\nuniform mat4 u_matrix;\nvoid main() {\n  gl_Position = u_matrix * vec4(a_position, 0.0, 1.0);\n}';

var fsSource = 'precision mediump float;\nvoid main() {\n  gl_FragColor = vec4(0.39, 0.40, 0.95, 1.0);\n}';

var program = createProgram(vsSource, fsSource);
gl.useProgram(program);

// 单位正方形的4个三角形（6个顶点）
var vertices = new Float32Array([
  -0.5, -0.5,   0.5, -0.5,   0.5, 0.5,
  -0.5, -0.5,   0.5,  0.5,  -0.5, 0.5,
]);

var vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

var aPos = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(aPos);
gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

var uMatrix = gl.getUniformLocation(program, 'u_matrix');
var angle = 0;

window.render = function(gl, canvas, dt) {
  angle += dt * 1.0;

  gl.clearColor(0.1, 0.1, 0.18, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  for (var row = 0; row < 3; row++) {
    for (var col = 0; col < 3; col++) {
      var model = mat4.identity();
      model = mat4.translate(model, (col - 1) * 0.6, (row - 1) * 0.6, 0);
      model = mat4.rotateZ(model, angle * (1 + row * 0.3 + col * 0.5));
      model = mat4.scale(model, 0.4, 0.4, 1);

      gl.uniformMatrix4fv(uMatrix, false, model);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  }
}