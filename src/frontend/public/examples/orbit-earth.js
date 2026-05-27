// 地球绕太阳 — 初级案例
// 知识点：Group, 层级变换, OrbitControls

// 创建太阳
const sunGeometry = new THREE.SphereGeometry(0.6, 64, 64);
const sunMaterial = new THREE.MeshStandardMaterial({
  color: '#FFD700',
  emissive: '#FF8C00',
  emissiveIntensity: 0.5,
  roughness: 0.2,
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// 地球轨道组
const earthOrbit = new THREE.Group();
scene.add(earthOrbit);

// 地球
const earthGeometry = new THREE.SphereGeometry(0.25, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial({
  color: '#4ECDC4',
  roughness: 0.3,
  metalness: 0.1,
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.position.x = 2;
earthOrbit.add(earth);

// 月球轨道组
const moonOrbit = new THREE.Group();
earth.add(moonOrbit);

// 月球
const moonGeometry = new THREE.SphereGeometry(0.07, 16, 16);
const moonMaterial = new THREE.MeshStandardMaterial({
  color: '#CCCCCC',
  roughness: 0.5,
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.x = 0.4;
moonOrbit.add(moon);

// 轨道线
const orbitLineGeometry = new THREE.TorusGeometry(2, 0.01, 16, 100);
const orbitLineMaterial = new THREE.MeshBasicMaterial({ color: '#333355' });
const orbitLine = new THREE.Mesh(orbitLineGeometry, orbitLineMaterial);
orbitLine.rotation.x = Math.PI / 2;
scene.add(orbitLine);

// 动画：地球公转 + 月球公转
const originalTick = window.animate;
window.animate = function () {
  earthOrbit.rotation.y += 0.005;
  moonOrbit.rotation.y += 0.03;
  sun.rotation.y += 0.002;
};