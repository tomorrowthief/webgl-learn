// Transform Feedback — WebGL 原生
// 知识点：TransformFeedback, 顶点写入, 物理模拟

var vsSource = `#version 300 es
layout(location = 0) in vec2 a_position;
layout(location = 1) in vec2 a_velocity;

uniform float uDt;

out vec2 v_position;
out vec2 v_velocity;

void main() {
  vec2 gravity = vec2(0.0, -9.8);
  vec2 newVel = a_velocity + gravity * uDt;
  vec2 newPos = a_position + newVel * uDt;

  // 碰到地面反弹
  if (newPos.y < -1.0) {
    newPos.y = -1.0;
    newVel.y = -newVel.y * 0.8; // 弹性系数
  }

  v_position = newPos;
  v_velocity = newVel;

  gl_Position = vec4(newPos, 0.0, 1.0);
  gl_PointSize = 8.0;
}`;

var fsSource = `#version 300 es
precision mediump float;
out vec4 fragColor;

void main() {
  fragColor = vec4(0.39, 0.4, 0.95, 1.0);
}`;

var program = createProgram(vsSource, fsSource);
gl.useProgram(program);

var uDt = gl.getUniformLocation(program, 'uDt');
gl.uniform1f(uDt, 0.016);

// 初始粒子数据
var numParticles = 100;
var positions = new Float32Array(numParticles * 2);
var velocities = new Float32Array(numParticles * 2);
for (var i = 0; i < numParticles; i++) {
  positions[i * 2] = (Math.random() - 0.5) * 2;
  positions[i * 2 + 1] = Math.random() * 2;
  velocities[i * 2] = (Math.random() - 0.5) * 0.5;
  velocities[i * 2 + 1] = 0;
}

// 创建两个缓冲对（ping-pong）
var posBuffers = [gl.createBuffer(), gl.createBuffer()];
var velBuffers = [gl.createBuffer(), gl.createBuffer()];
var currentBuf = 0;

// 初始化第一个缓冲
gl.bindBuffer(gl.ARRAY_BUFFER, posBuffers[0]);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, velBuffers[0]);
gl.bufferData(gl.ARRAY_BUFFER, velocities, gl.DYNAMIC_DRAW);

// 设置 attribute
var aPos = gl.getAttribLocation(program, 'a_position');
var aVel = gl.getAttribLocation(program, 'a_velocity');
gl.enableVertexAttribArray(aPos);
gl.enableVertexAttribArray(aVel);

// 创建 TransformFeedback 对象
var tf = gl.createTransformFeedback();

window.render = function(gl, canvas, dt) {
  // 设置 attribute 指向当前缓冲
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffers[currentBuf]);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, velBuffers[currentBuf]);
  gl.vertexAttribPointer(aVel, 2, gl.FLOAT, false, 0, 0);

  // 绑定目标缓冲
  var nextBuf = 1 - currentBuf;
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, posBuffers[nextBuf]);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, velBuffers[nextBuf]);

  // 执行变换反馈
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);
  gl.beginTransformFeedback(gl.POINTS);
  gl.drawArrays(gl.POINTS, 0, numParticles);
  gl.endTransformFeedback();
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

  // 交换缓冲
  currentBuf = nextBuf;

  // 渲染
  gl.clearColor(0.1, 0.1, 0.18, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 用当前缓冲渲染粒子
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffers[currentBuf]);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.POINTS, 0, numParticles);
};
