// Blinn-Phong 光照 — 漫反射 + 镜面高光
// 知识点：法线变换、光照计算、uniform光源参数

var vsSource = 'attribute vec3 a_position;\nattribute vec3 a_normal;\nattribute vec3 a_color;\nuniform mat4 u_mvp;\nuniform mat4 u_model;\nvarying vec3 v_normal;\nvarying vec3 v_pos;\nvarying vec3 v_color;\nvoid main() {\n  gl_Position = u_mvp * vec4(a_position, 1.0);\n  v_normal = mat3(u_model) * a_normal;\n  v_pos = (u_model * vec4(a_position, 1.0)).xyz;\n  v_color = a_color;\n}';

var fsSource = 'precision mediump float;\nvarying vec3 v_normal;\nvarying vec3 v_pos;\nvarying vec3 v_color;\nuniform vec3 u_lightDir;\nuniform vec3 u_viewPos;\nvoid main() {\n  vec3 normal = normalize(v_normal);\n  vec3 lightDir = normalize(u_lightDir);\n  float diff = max(dot(normal, lightDir), 0.0);\n  vec3 viewDir = normalize(u_viewPos - v_pos);\n  vec3 halfDir = normalize(lightDir + viewDir);\n  float spec = pow(max(dot(normal, halfDir), 0.0), 32.0);\n  vec3 ambient = v_color * 0.15;\n  vec3 diffuse = v_color * diff * 0.7;\n  vec3 specular = vec3(1.0) * spec * 0.4;\n  gl_FragColor = vec4(ambient + diffuse + specular, 1.0);\n}';

var program = createProgram(vsSource, fsSource);
gl.useProgram(program);

// 球体近似 - 分段经纬度网格
var segments = 30, rings = 30;
var R = 0.8;
var vData = [];
for (var ring = 0; ring < rings; ring++) {
  var phi1 = (ring / rings) * Math.PI - Math.PI/2;
  var phi2 = ((ring + 1) / rings) * Math.PI - Math.PI/2;
  for (var seg = 0; seg < segments; seg++) {
    var theta1 = (seg / segments) * Math.PI * 2;
    var theta2 = ((seg + 1) / segments) * Math.PI * 2;

    function vertex(phi, theta) {
      var x = R * Math.cos(phi) * Math.cos(theta);
      var y = R * Math.sin(phi);
      var z = R * Math.cos(phi) * Math.sin(theta);
      var nx = x / R, ny = y / R, nz = z / R;
      return [x, y, z, nx, ny, nz, 0.39, 0.40, 0.95];
    }

    // 2 triangles per quad
    vData.push.apply(vData, vertex(phi1, theta1));
    vData.push.apply(vData, vertex(phi2, theta1));
    vData.push.apply(vData, vertex(phi1, theta2));
    vData.push.apply(vData, vertex(phi1, theta2));
    vData.push.apply(vData, vertex(phi2, theta1));
    vData.push.apply(vData, vertex(phi2, theta2));
  }
}

var vertices = new Float32Array(vData);
var vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

var stride = 36;
var aPos = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(aPos);
gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, stride, 0);

var aNormal = gl.getAttribLocation(program, 'a_normal');
gl.enableVertexAttribArray(aNormal);
gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, stride, 12);

var aColor = gl.getAttribLocation(program, 'a_color');
gl.enableVertexAttribArray(aColor);
gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, stride, 24);

var uMvp = gl.getUniformLocation(program, 'u_mvp');
var uModel = gl.getUniformLocation(program, 'u_model');
var uLightDir = gl.getUniformLocation(program, 'u_lightDir');
var uViewPos = gl.getUniformLocation(program, 'u_viewPos');

var lightAngle = 0;
var totalVerts = rings * segments * 6;

window.render = function(gl, canvas, dt) {
  lightAngle += dt * 0.5;
  gl.clearColor(0.1, 0.1, 0.18, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var proj = mat4.perspective(45 * M.PI / 180, canvas.width / canvas.height, 0.1, 100);
  var model = mat4.identity();
  model = mat4.rotateY(model, lightAngle * 0.3);
  model = mat4.translate(model, 0, 0, -3);

  var mvp = mat4.multiply(proj, model);
  gl.uniformMatrix4fv(uMvp, false, mvp);
  gl.uniformMatrix4fv(uModel, false, model);

  var lx = M.cos(lightAngle) * 2, ly = 2, lz = M.sin(lightAngle) * 2;
  gl.uniform3f(uLightDir, lx, ly, lz);
  gl.uniform3f(uViewPos, 0, 0, 3);

  gl.drawArrays(gl.TRIANGLES, 0, totalVerts);
}