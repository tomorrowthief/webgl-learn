// 后期特效 — 高级案例
// 知识点：EffectComposer, UnrealBloomPass, 后处理管线
// EffectComposer / RenderPass / UnrealBloomPass 由沙箱注入

// 创建场景物体
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.4, 0.15, 128, 32),
  new THREE.MeshStandardMaterial({
    color: '#6366F1',
    emissive: '#6366F1',
    emissiveIntensity: 0.5,
    roughness: 0.2,
    metalness: 0.5,
  })
);
scene.add(torusKnot);

// 环绕粒子
const ringParticles = new THREE.Points(
  new THREE.BufferGeometry().setFromPoints(
    Array.from({ length: 200 }, (_, i) => {
      const angle = (i / 200) * Math.PI * 2;
      const radius = 1.2;
      return new THREE.Vector3(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 0.3,
        Math.sin(angle) * radius
      );
    })
  ),
  new THREE.PointsMaterial({
    size: 0.02,
    color: '#22D3EE',
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
);
scene.add(ringParticles);

// 设置后处理管线
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,   // strength
  0.4,   // radius
  0.85   // threshold
);
composer.addPass(bloomPass);

// 覆写渲染为后处理渲染
renderer.render = function () {
  composer.render();
};

// 动画
window.animate = function () {
  torusKnot.rotation.x += 0.005;
  torusKnot.rotation.y += 0.01;
  ringParticles.rotation.y += 0.003;
  ringParticles.rotation.z += 0.002;
};