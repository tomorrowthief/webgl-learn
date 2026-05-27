// Sprite 标签 — 交互与动画
// 知识点：Sprite, SpriteMaterial, 看板

// 创建文字纹理
function createLabelTexture(text, size) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.roundRect(0, 0, 256, 64, 10);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 32);
  return new THREE.CanvasTexture(canvas);
}

// 添加标签到场景中的物体上
const labels = ['太阳', '地球', '月球', '火星'];
const positions = [
  [0, 0, 0],
  [2, 0.5, 0],
  [2.8, 0.8, 0],
  [-2, 0.3, 1],
];
const colors = ['#FFD700', '#4ECDC4', '#888', '#FF6B6B'];

labels.forEach((text, i) => {
  // 星球
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 16, 16),
    new THREE.MeshStandardMaterial({ color: colors[i] })
  );
  sphere.position.set(...positions[i]);
  scene.add(sphere);

  // Sprite 标签（始终面向相机）
  const spriteMat = new SpriteMaterial({
    map: createLabelTexture(text, 32),
    transparent: true,
  });
  const sprite = new Sprite(spriteMat);
  sprite.scale.set(1.5, 0.4, 1);
  sprite.position.set(positions[i][0], positions[i][1] + 0.6, positions[i][2]);
  scene.add(sprite);
});

// 添加环境光
scene.add(new THREE.AmbientLight('#ffffff', 0.6));
const dirLight = new THREE.DirectionalLight('#ffffff', 1);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

window.animate = function () {
  // 地球绕太阳转
  const t = Date.now() * 0.001;
  scene.children.forEach((child) => {
    if (child.isSprite && child.position.x > 1) {
      child.position.x = 2 * Math.cos(t);
      child.position.z = 2 * Math.sin(t);
      child.position.y = 0.5;
    }
    if (child.isMesh && child.position.x > 1 && child.position.x < 3) {
      child.position.x = 2 * Math.cos(t);
      child.position.z = 2 * Math.sin(t);
    }
  });
};