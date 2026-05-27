// 十万实例 — 交互与动画
// 知识点：InstancedMesh, setMatrixAt, 批量渲染

const count = 10000;
const geometry = new THREE.IcosahedronGeometry(0.05, 0);
const material = new THREE.MeshStandardMaterial({
  color: '#6366F1',
  roughness: 0.3,
  metalness: 0.5,
});

const instancedMesh = new InstancedMesh(geometry, material, count);

const dummy = new THREE.Object3D();
const color = new THREE.Color();

for (let i = 0; i < count; i++) {
  dummy.position.set(
    (Math.random() - 0.5) * 8,
    (Math.random() - 0.5) * 8,
    (Math.random() - 0.5) * 8
  );
  dummy.updateMatrix();
  instancedMesh.setMatrixAt(i, dummy.matrix);

  // 随机颜色
  color.setHSL(Math.random(), 0.7, 0.5);
  instancedMesh.setColorAt(i, color);
}

scene.add(instancedMesh);

// 动画：整体旋转
window.animate = function () {
  instancedMesh.rotation.y += 0.005;
  instancedMesh.rotation.x += 0.002;
};