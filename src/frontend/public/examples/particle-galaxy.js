// 粒子星系 — 高级案例
// 知识点：Points, BufferGeometry, ShaderMaterial, 粒子系统

const particleCount = 8000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const particleColors = new Float32Array(particleCount * 3);

const color1 = new THREE.Color('#6366F1'); // Indigo
const color2 = new THREE.Color('#22D3EE'); // Cyan
const color3 = new THREE.Color('#F43F5E'); // Rose

// 螺旋星系分布
for (let i = 0; i < particleCount; i++) {
  const radius = 1.5 + Math.random() * 3.5;
  const spinAngle = radius * 3;
  const branchAngle = (i % 3) * ((Math.PI * 2) / 3);

  const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.4;
  const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.2;
  const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.4;

  positions[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
  positions[i * 3 + 1] = randomY;
  positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

  // Colors based on radius
  const mixColor = color1.clone();
  mixColor.lerp(color2, radius / 5);
  if (radius > 3.5) mixColor.lerp(color3, (radius - 3.5) / 1.5);

  particleColors[i * 3] = mixColor.r;
  particleColors[i * 3 + 1] = mixColor.g;
  particleColors[i * 3 + 2] = mixColor.b;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

// 圆形粒子纹理
const canvas = document.createElement('canvas');
canvas.width = 32;
canvas.height = 32;
const ctx = canvas.getContext('2d');
const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
gradient.addColorStop(0, 'rgba(255,255,255,1)');
gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
gradient.addColorStop(0.5, 'rgba(255,255,255,0.3)');
gradient.addColorStop(1, 'rgba(255,255,255,0)');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 32, 32);

const particleTexture = new THREE.CanvasTexture(canvas);

const material = new THREE.PointsMaterial({
  size: 0.04,
  map: particleTexture,
  vertexColors: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// 旋转动画
window.animate = function () {
  particles.rotation.y += 0.001;
  particles.rotation.x += 0.0005;
};