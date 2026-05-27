// 纹理映射 — 将图片贴到正方形上
// 知识点：Texture、UV坐标、Sampler2D

var vsSource = 'attribute vec2 a_position;\nattribute vec2 a_texcoord;\nvarying vec2 v_texcoord;\nvoid main() {\n  gl_Position = vec4(a_position, 0.0, 1.0);\n  v_texcoord = a_texcoord;\n}';

var fsSource = 'precision mediump float;\nvarying vec2 v_texcoord;\nuniform sampler2D u_texture;\nvoid main() {\n  gl_FragColor = texture2D(u_texture, v_texcoord);\n}';

var program = createProgram(vsSource, fsSource);
gl.useProgram(program);

// 正方形顶点：位置 + UV
var vertices = new Float32Array([
  -0.6, -0.6,  0.0, 1.0,
   0.6, -0.6,  1.0, 1.0,
   0.6,  0.6,  1.0, 0.0,
  -0.6, -0.6,  0.0, 1.0,
   0.6,  0.6,  1.0, 0.0,
  -0.6,  0.6,  0.0, 0.0,
]);

var vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

var aPos = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(aPos);
gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 16, 0);

var aTex = gl.getAttribLocation(program, 'a_texcoord');
gl.enableVertexAttribArray(aTex);
gl.vertexAttribPointer(aTex, 2, gl.FLOAT, false, 16, 8);

// 程序化生成棋盘纹理
var texCanvas = document.createElement('canvas');
texCanvas.width = 128; texCanvas.height = 128;
var ctx = texCanvas.getContext('2d');
for (var y = 0; y < 8; y++) {
  for (var x = 0; x < 8; x++) {
    ctx.fillStyle = (x + y) % 2 === 0 ? '#6366F1' : '#22D3EE';
    ctx.fillRect(x * 16, y * 16, 16, 16);
  }
}
// 加个圆形装饰
ctx.beginPath();
ctx.arc(64, 64, 40, 0, Math.PI * 2);
ctx.fillStyle = 'rgba(255,255,255,0.3)';
ctx.fill();

var texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texCanvas);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

window.render = function(gl, canvas, dt) {
  gl.clearColor(0.1, 0.1, 0.18, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}