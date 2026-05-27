// 粒子系统 — 数千个点 + 鼠标交互缩放
// 知识点：DrawArrays POINTS、随机位置、gl_PointSize、Blend

var vsSource = 'attribute vec3 a_position;\nattribute float a_size;\nuniform mat4 u_mvp;\nvoid main() {\n  gl_Position = u_mvp * vec4(a_position, 1.0);\n  gl_PointSize = a_size * (200.0 / gl_Position.w);\n}';

var fsSource = 'precision mediump float;\nvoid main() {\n  float d = length(gl_PointCoord - vec2(0.5));\n  if (d > 0.5) discard;\n  float alpha = smoothstep(0.5, 0.0, d);\n  gl_FragColor = vec4(0.39, 0.80, 0.93, alpha * 0.8);\n}';

var program = createProgram(vsSource, fsSource);
gl.useProgram(program);

// 生成粒子数据
var count = 3000;
var vData = new Float32Array(count * 4);
for (var i = 0; i < count; i++) {
  // 球壳分布
  var r = 2 + Math.random() * 3;
  var phi = Math.acos(2 * Math.random() - 1);
  var theta = Math.random() * Math.PI * 2;
  vData[i * 4]     = r * Math.sin(phi) * Math.cos(theta);
  vData[i * 4 + 1] = r * Math.sin(phi) * Math.sin(theta);
  vData[i * 4 + 2] = r * Math.cos(phi);
  vData[i * 4 + 3] = 2 + Math.random() * 4;
}

var vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vData, gl.STATIC_DRAW);

var aPos = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(aPos);
gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 16, 0);

var aSize = gl.getAttribLocation(program, 'a_size');
gl.enableVertexAttribArray(aSize);
gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, 16, 12);

var uMvp = gl.getUniformLocation(program, 'u_mvp');

// 开启混合模式
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
gl.depthMask(false);

var angle = 0;
var zoom = 5;

window.render = function(gl, canvas, dt) {
  angle += dt * 0.2;
  // 滚轮缩放
  if (mouse.wheel !== 0) {
    zoom += mouse.wheel * 5;
    zoom = Math.max(3, Math.min(12, zoom));
    mouse.wheel = 0;
  }

  gl.clearColor(0.1, 0.1, 0.18, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var proj = mat4.perspective(45 * M.PI / 180, canvas.width / canvas.height, 0.1, 100);
  var model = mat4.identity();
  model = mat4.rotateX(model, angle * 0.3);
  model = mat4.rotateY(model, angle);
  model = mat4.translate(model, 0, 0, -zoom);

  var mvp = mat4.multiply(proj, model);
  gl.uniformMatrix4fv(uMvp, false, mvp);
  gl.drawArrays(gl.POINTS, 0, count);
}