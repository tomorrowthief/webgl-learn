// WebXR 沉浸 — 高级特效
// 知识点：XRSession, WebXR, VR 控制器

// 创建 VR 场景
const grid = new THREE.GridHelper(10, 20, '#444', '#333');
scene.add(grid);

// 浮动的几何体
const objects = [];
const geometries = [
  new THREE.IcosahedronGeometry(0.3, 0),
  new THREE.OctahedronGeometry(0.3, 0),
  new THREE.TetrahedronGeometry(0.3, 0),
];

for (let i = 0; i < 15; i++) {
  const geo = geometries[i % 3];
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5),
    roughness: 0.3,
    metalness: 0.5,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(
    (Math.random() - 0.5) * 6,
    0.5 + Math.random() * 2,
    (Math.random() - 0.5) * 6
  );
  mesh.userData.rotSpeed = {
    x: (Math.random() - 0.5) * 0.02,
    y: (Math.random() - 0.5) * 0.02,
  };
  scene.add(mesh);
  objects.push(mesh);
}

// 环境光
scene.add(new THREE.AmbientLight('#ffffff', 0.5));
const dirLight = new THREE.DirectionalLight('#ffffff', 1);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

// WebXR 支持检测
if ('xr' in navigator) {
  renderer.xr.enabled = true;
  const enterVR = document.createElement('button');
  enterVR.textContent = '进入 VR';
  enterVR.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);padding:12px 24px;background:#6366F1;color:#fff;border:none;border-radius:8px;font-size:16px;cursor:pointer;z-index:1000;';
  enterVR.addEventListener('click', () => {
    navigator.xr.requestSession('immersive-vr').then((session) => {
      renderer.xr.setSession(session);
      session.addEventListener('end', () => { enterVR.textContent = '进入 VR'; });
      enterVR.textContent = '退出 VR';
    });
  });
  document.body.appendChild(enterVR);
}

window.animate = function () {
  objects.forEach((obj) => {
    obj.rotation.x += obj.userData.rotSpeed.x;
    obj.rotation.y += obj.userData.rotSpeed.y;
    obj.position.y += Math.sin(Date.now() * 0.001 + obj.position.x) * 0.002;
  });
};