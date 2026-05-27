// PBR 材质球 — 高级案例
// 知识点：MeshStandardMaterial, PBR, roughness, metalness, EnvironmentMap

// 生成程序化环境贴图
const envCanvas = document.createElement('canvas');
envCanvas.width = 256;
envCanvas.height = 128;
const ectx = envCanvas.getContext('2d');

// 渐变背景模拟环境光
const bgGrad = ectx.createLinearGradient(0, 0, 0, 128);
bgGrad.addColorStop(0, '#6366F1');
bgGrad.addColorStop(0.4, '#22D3EE');
bgGrad.addColorStop(0.7, '#1a1a2e');
bgGrad.addColorStop(1, '#0f0f1a');
ectx.fillStyle = bgGrad;
ectx.fillRect(0, 0, 256, 128);

// 添加亮斑点模拟环境反射
for (let i = 0; i < 30; i++) {
  ectx.fillStyle = `rgba(255,255,255,${0.1 + Math.random() * 0.4})`;
  const x = Math.random() * 256;
  const y = Math.random() * 128;
  const r = 2 + Math.random() * 8;
  ectx.beginPath();
  ectx.arc(x, y, r, 0, Math.PI * 2);
  ectx.fill();
}

const envTexture = new THREE.CanvasTexture(envCanvas);
envTexture.mapping = THREE.EquirectangularReflectionMapping;
scene.environment = envTexture;
scene.background = envTexture;

// 创建 5 个球体展示不同的 roughness/metalness
const rows = 3;
const cols = 5;
const spacing = 0.8;

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const roughness = col / (cols - 1);
    const metalness = row / (rows - 1);

    const geometry = new THREE.SphereGeometry(0.22, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      color: '#6366F1',
      roughness,
      metalness,
    });
    const sphere = new THREE.Mesh(geometry, material);

    sphere.position.x = (col - (cols - 1) / 2) * spacing;
    sphere.position.y = (row - (rows - 1) / 2) * spacing;

    scene.add(sphere);
  }
}

// 标签地板
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(4.5, 3),
  new THREE.MeshStandardMaterial({ color: '#1a1a2e', roughness: 0.8, metalness: 0.1 })
);
floor.position.y = -1.2;
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

camera.position.set(2, 0.5, 3);