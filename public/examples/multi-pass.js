// 多通道后处理 — 高级特效
// 知识点：SSAOPass, Bloom, FXAA 组合管线

const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.5, 0.15, 128, 32),
  new THREE.MeshStandardMaterial({
    color: '#6366F1',
    emissive: '#6366F1',
    emissiveIntensity: 0.3,
    roughness: 0.2,
    metalness: 0.8,
  })
);
scene.add(torusKnot);

// 多通道后处理管线
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

// SSAO — 屏幕空间环境光遮蔽
const ssaoPass = new SSAOPass(scene, camera, window.innerWidth, window.innerHeight);
ssaoPass.kernelRadius = 16;
ssaoPass.minDistance = 0.005;
ssaoPass.maxDistance = 0.1;
composer.addPass(ssaoPass);

// Bloom — 辉光
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.8, 0.4, 0.85
);
composer.addPass(bloomPass);

// FXAA — 抗锯齿
const fxaaPass = new ShaderPass(FXAAShader);
fxaaPass.uniforms['resolution'].value.set(
  1 / (window.innerWidth * renderer.getPixelRatio()),
  1 / (window.innerHeight * renderer.getPixelRatio())
);
composer.addPass(fxaaPass);

// Output pass
composer.addPass(new OutputPass());

renderer.render = function () {
  composer.render();
};

window.animate = function () {
  torusKnot.rotation.x += 0.005;
  torusKnot.rotation.y += 0.01;
};