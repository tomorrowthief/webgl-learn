// 彩色球体阵列 — 初级案例
// 知识点：SphereGeometry, MeshPhongMaterial, PointLight, 循环创建

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF8A5C', '#2EC4B6'];
const sphereCount = 20;
const radius = 3;

for (let i = 0; i < sphereCount; i++) {
  const angle = (i / sphereCount) * Math.PI * 2;
  const y = (Math.random() - 0.5) * 4;

  const geometry = new THREE.SphereGeometry(0.15 + Math.random() * 0.2, 32, 32);
  const material = new THREE.MeshPhongMaterial({
    color: colors[i % colors.length],
    shininess: 80,
    specular: '#ffffff',
  });
  const sphere = new THREE.Mesh(geometry, material);

  sphere.position.x = Math.cos(angle) * radius;
  sphere.position.y = y;
  sphere.position.z = Math.sin(angle) * radius;

  scene.add(sphere);
}

// 添加更多光源让球体更生动
const pointLight2 = new THREE.PointLight('#22D3EE', 0.5);
pointLight2.position.set(-3, 2, -2);
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight('#FF6B6B', 0.3);
pointLight3.position.set(2, -1, 2);
scene.add(pointLight3);