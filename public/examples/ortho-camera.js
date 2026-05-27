// 正交相机 — Three.js 基础
// 知识点：OrthographicCamera, 等距视角, 透视对比

// 创建正交相机
const frustumSize = 5;
const aspect = 1;
const orthoCamera = new THREE.OrthographicCamera(
  -frustumSize * aspect / 2, frustumSize * aspect / 2,
  frustumSize / 2, -frustumSize / 2,
  0.1, 100
);
orthoCamera.position.set(3, 3, 3);
orthoCamera.lookAt(0, 0, 0);

// 替换默认相机
camera.copy(orthoCamera);
camera.position.copy(orthoCamera.position);
camera.quaternion.copy(orthoCamera.quaternion);
camera.updateProjectionMatrix();

// 共享场景内容
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 1.5, 1.5),
  new THREE.MeshStandardMaterial({ color: '#6366F1', roughness: 0.3, metalness: 0.1 })
);
scene.add(cube);

// 添加网格地面
const grid = new THREE.GridHelper(4, 8, '#444', '#333');
scene.add(grid);

window.animate = function () {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.015;
};
