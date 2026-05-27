// 3D旋转立方体 — MVP矩阵 + 深度测试
// 知识点：透视投影、Model-View-Projection矩阵、深度缓冲

var vsSource = 'attribute vec3 a_position;\nattribute vec3 a_color;\nuniform mat4 u_mvp;\nvarying vec3 v_color;\nvoid main() {\n  gl_Position = u_mvp * vec4(a_position, 1.0);\n  v_color = a_color;\n}';

var fsSource = 'precision mediump float;\nvarying vec3 v_color;\nvoid main() {\n  gl_FragColor = vec4(v_color, 1.0);\n}';

var program = createProgram(vsSource, fsSource);
gl.useProgram(program);

// 6个面 × 2个三角形 × 3顶点 = 36顶点，每面不同颜色
function faceVerts(x, y, z, sx, sy, sz, r, g, b) {
  var hx = sx/2, hy = sy/2, hz = sz/2;
  return [
    x-hx,y-hy,z-hz,r,g,b,  x+hx,y-hy,z-hz,r,g,b,  x+hx,y+hy,z-hz,r,g,b,
    x-hx,y-hy,z-hz,r,g,b,  x+hx,y+hy,z-hz,r,g,b,  x-hx,y+hy,z-hz,r,g,b,
  ];
}
var vData = [];
vData.push.apply(vData, faceVerts(0,0,0.5, 1,1,0,  0.39,0.40,0.95));
vData.push.apply(vData, faceVerts(0,0,-0.5,1,1,0,  0.13,0.80,0.80));
vData.push.apply(vData, faceVerts(0,0.5,0, 1,0,1,  0.38,0.78,0.96));
vData.push.apply(vData, faceVerts(0,-0.5,0,1,0,1,  0.58,0.70,0.27));
vData.push.apply(vData, faceVerts(0.5,0,0, 0,1,1,  0.93,0.27,0.42));
vData.push.apply(vData, faceVerts(-0.5,0,0,0,1,1, 0.93,0.53,0.14));

var vertices = new Float32Array(vData);
var vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

var stride = 24;
var aPos = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(aPos);
gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, stride, 0);

var aColor = gl.getAttribLocation(program, 'a_color');
gl.enableVertexAttribArray(aColor);
gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, stride, 12);

var uMvp = gl.getUniformLocation(program, 'u_mvp');
var angle = 0;

window.render = function(gl, canvas, dt) {
  angle += dt * 0.8;
  gl.clearColor(0.1, 0.1, 0.18, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var proj = mat4.perspective(45 * M.PI / 180, canvas.width / canvas.height, 0.1, 100);
  var model = mat4.identity();
  model = mat4.rotateX(model, angle * 0.7);
  model = mat4.rotateY(model, angle);
  model = mat4.translate(model, 0, 0, -3);
  var mvp = mat4.multiply(proj, model);

  gl.uniformMatrix4fv(uMvp, false, mvp);
  gl.drawArrays(gl.TRIANGLES, 0, 36);
}