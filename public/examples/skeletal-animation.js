// 骨骼动画 — 交互与动画
// 知识点：AnimationMixer, AnimationClip, 动作混合

// 地面
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({ color: '#2a2a3e' })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// 使用简单几何体模拟角色
// 身体
const bodyGeo = new THREE.CylinderGeometry(0.2, 0.15, 0.8, 8);
const bodyMat = new THREE.MeshStandardMaterial({ color: '#6366F1' });
const body = new THREE.Mesh(bodyGeo, bodyMat);
body.position.y = 1.2;
scene.add(body);

// 头
const head = new THREE.Mesh(
  new THREE.SphereGeometry(0.2, 16, 16),
  new THREE.MeshStandardMaterial({ color: '#818CF8' })
);
head.position.y = 1.8;
scene.add(head);

// 左臂
const armGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.6, 8);
const armMat = new THREE.MeshStandardMaterial({ color: '#6366F1' });
const leftArm = new THREE.Mesh(armGeo, armMat);
leftArm.position.set(-0.35, 1.2, 0);
scene.add(leftArm);

// 右臂
const rightArm = new THREE.Mesh(armGeo, armMat);
rightArm.position.set(0.35, 1.2, 0);
scene.add(rightArm);

// 左腿
const legGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.7, 8);
const legMat = new THREE.MeshStandardMaterial({ color: '#4F46E5' });
const leftLeg = new THREE.Mesh(legGeo, legMat);
leftLeg.position.set(-0.12, 0.45, 0);
scene.add(leftLeg);

// 右腿
const rightLeg = new THREE.Mesh(legGeo, legMat);
rightLeg.position.set(0.12, 0.45, 0);
scene.add(rightLeg);

// 用 AnimationMixer 手动驱动动画（模拟骨骼）
const time = { value: 0 };
window.animate = function () {
  time.value += 0.05;
  const t = time.value;

  // 行走动画
  leftArm.rotation.x = Math.sin(t) * 0.6;
  rightArm.rotation.x = -Math.sin(t) * 0.6;
  leftLeg.rotation.x = -Math.sin(t) * 0.5;
  rightLeg.rotation.x = Math.sin(t) * 0.5;

  // 身体上下起伏
  body.position.y = 1.2 + Math.abs(Math.sin(t * 2)) * 0.05;
  head.position.y = 1.8 + Math.abs(Math.sin(t * 2)) * 0.05;

  // 整体移动
  body.position.x = (t * 0.5) % 6 - 3;
  head.position.x = body.position.x;
  leftArm.position.x = body.position.x - 0.35;
  rightArm.position.x = body.position.x + 0.35;
  leftLeg.position.x = body.position.x - 0.12;
  rightLeg.position.x = body.position.x + 0.12;
};