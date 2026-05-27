// WebGL 原生沙箱 — blob URL，提供原始 WebGL 环境
// 和 Three.js 沙箱不同，这里暴露的是 WebGL 原生 API
export function getWebGLSandboxHtml(): string {
  return '<!DOCTYPE html>\n<html><head>\n<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">\n<style>\n*{margin:0;padding:0;box-sizing:border-box}\nhtml,body{width:100%;height:100%;overflow:hidden;background:#1a1a2e}\ncanvas{display:block}\n#err{display:none;position:fixed;top:0;left:0;right:0;background:rgba(239,68,68,.95);color:#fff;padding:12px 16px;font:13px monospace;line-height:1.5;z-index:1000;white-space:pre-wrap}\n</style>\n</head><body>\n<div id="err"></div>\n<script>\n' + `

// ========== WebGL 原生沙箱环境 ==========
var canvas, gl, animId = null;
var c = document.body, err = document.getElementById('err');
var M = Math;
var now = 0, then = 0, delta = 0;

// 工具函数
function createShader(type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    var info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error('Shader编译失败: ' + info);
  }
  return shader;
}

function createProgram(vsSource, fsSource) {
  var vs = createShader(gl.VERTEX_SHADER, vsSource);
  var fs = createShader(gl.FRAGMENT_SHADER, fsSource);
  var program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    var info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error('Program链接失败: ' + info);
  }
  return program;
}

function resizeCanvas() {
  canvas.width = c.clientWidth * window.devicePixelRatio;
  canvas.height = c.clientHeight * window.devicePixelRatio;
  canvas.style.width = c.clientWidth + 'px';
  canvas.style.height = c.clientHeight + 'px';
  if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
}

// 初始化 WebGL 环境
function initWebGL() {
  if (canvas) { canvas.remove(); }
  canvas = document.createElement('canvas');
  c.appendChild(canvas);

  gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    throw new Error('你的浏览器不支持 WebGL，请使用最新版 Chrome/Edge/Firefox');
  }

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  resizeCanvas();
}

// 矩阵工具
var mat4 = {
  identity: function() {
    return [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
  },
  perspective: function(fov, aspect, near, far) {
    var f = 1.0 / M.tan(fov / 2);
    var nf = 1 / (near - far);
    return [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, (2 * far * near) * nf, 0
    ];
  },
  multiply: function(a, b) {
    var r = new Array(16);
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        r[j*4+i] = a[i] * b[j*4] + a[4+i] * b[j*4+1] + a[8+i] * b[j*4+2] + a[12+i] * b[j*4+3];
      }
    }
    return r;
  },
  translate: function(m, x, y, z) {
    return mat4.multiply(m, [1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1]);
  },
  rotateX: function(m, angle) {
    var s = M.sin(angle), cs = M.cos(angle);
    return mat4.multiply(m, [1,0,0,0, 0,cs,s,0, 0,-s,cs,0, 0,0,0,1]);
  },
  rotateY: function(m, angle) {
    var s = M.sin(angle), cs = M.cos(angle);
    return mat4.multiply(m, [cs,0,-s,0, 0,1,0,0, s,0,cs,0, 0,0,0,1]);
  },
  rotateZ: function(m, angle) {
    var s = M.sin(angle), cs = M.cos(angle);
    return mat4.multiply(m, [cs,s,0,0, -s,cs,0,0, 0,0,1,0, 0,0,0,1]);
  },
  scale: function(m, x, y, z) {
    return mat4.multiply(m, [x,0,0,0, 0,y,0,0, 0,0,z,0, 0,0,0,1]);
  },
  lookAt: function(eye, center, up) {
    var zx = eye[0]-center[0], zy = eye[1]-center[1], zz = eye[2]-center[2];
    var len = 1/Math.sqrt(zx*zx+zy*zy+zz*zz);
    var fz = [zx*len, zy*len, zz*len];
    var sx = up[1]*fz[2]-up[2]*fz[1], sy = up[2]*fz[0]-up[0]*fz[2], sz = up[0]*fz[1]-up[1]*fz[0];
    len = 1/Math.sqrt(sx*sx+sy*sy+sz*sz);
    var fs = [sx*len, sy*len, sz*len];
    var ux = fz[1]*fs[2]-fz[2]*fs[1], uy = fz[2]*fs[0]-fz[0]*fs[2], uz = fz[0]*fs[1]-fz[1]*fs[0];
    return [
      fs[0], ux, fz[0], 0,
      fs[1], uy, fz[1], 0,
      fs[2], uz, fz[2], 0,
      -(fs[0]*eye[0]+fs[1]*eye[1]+fs[2]*eye[2]),
      -(ux*eye[0]+uy*eye[1]+uz*eye[2]),
      -(fz[0]*eye[0]+fz[1]*eye[1]+fz[2]*eye[2]),
      1
    ];
  }
};

function anim() {
  animId = requestAnimationFrame(anim);
  now = Date.now();
  delta = then ? (now - then) * 0.001 : 0;
  then = now;
  if (typeof window.render === 'function') window.render(gl, canvas, delta);
}

function cleanup() {
  if (animId !== null) { cancelAnimationFrame(animId); animId = null; }
  if (gl) {
    var ext = gl.getExtension('WEBGL_lose_context');
    if (ext) ext.loseContext();
  }
  gl = null;
  if (canvas) { canvas.remove(); canvas = null; }
  now = then = delta = 0;
}

window.addEventListener('resize', function() {
  resizeCanvas();
  if (typeof window.onResize === 'function') window.onResize(gl, canvas);
});

var mouse = { isDown: false, x: 0, y: 0, lastX: 0, lastY: 0, wheel: 0 };
window.mouse = mouse;

window.addEventListener('mouseup', function() { mouse.isDown = false; });
window.addEventListener('mousemove', function(e) {
  if (mouse.isDown) {
    mouse.lastX = mouse.x; mouse.lastY = mouse.y;
    mouse.x = e.clientX; mouse.y = e.clientY;
  }
});
window.addEventListener('wheel', function(e) { mouse.wheel = e.deltaY * 0.01; });

// 接收消息
window.addEventListener('message', function(e) {
  var d = e.data;
  if (!d || typeof d !== 'object') return;
  if (d.type === 'run') {
    try {
      err.style.display = 'none';
      cleanup();
      initWebGL();
      anim();
      new Function('gl', 'canvas', 'mat4', 'mouse', 'M', d.code)(gl, canvas, mat4, mouse, M);
      window.parent.postMessage({ type: 'result', success: true }, '*');
    } catch(ex) {
      err.style.display = 'block';
      err.textContent = ex.name + ': ' + ex.message;
      window.parent.postMessage({ type: 'result', success: false, error: { type: ex.name || 'Error', message: ex.message || 'Unknown' } }, '*');
    }
  }
});

window.parent.postMessage({ type: 'ready' }, '*');
` + '\n<' + '/script>\n</body></html>';
}

let webglBlobUrl: string | null = null;

export function getWebGLSandboxBlobUrl(): string {
  if (!webglBlobUrl) {
    const html = getWebGLSandboxHtml();
    const blob = new Blob([html], { type: 'text/html' });
    webglBlobUrl = URL.createObjectURL(blob);
  }
  return webglBlobUrl;
}

export function revokeWebGLSandboxBlobUrl(): void {
  if (webglBlobUrl) {
    URL.revokeObjectURL(webglBlobUrl);
    webglBlobUrl = null;
  }
}