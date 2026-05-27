// 旋转的立方体 — 初级案例
// 知识点：Scene, Mesh, BoxGeometry, MeshStandardMaterial, 动画循环

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
  color: '#6366F1',
  roughness: 0.3,
  metalness: 0.1,
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 旋转动画
window.animate = function () {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.015;
};