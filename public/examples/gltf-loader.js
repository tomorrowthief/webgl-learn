// GLTF 模型加载 — 材质与光照
// 知识点：GLTFLoader, DRACOLoader, 模型加载

// 注意：沙箱已预注入 GLTFLoader 和 DRACOLoader
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/');
loader.setDRACOLoader(dracoLoader);

// 加载示例模型
loader.load(
  'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
  function (gltf) {
    const model = gltf.scene;
    model.scale.set(2, 2, 2);
    scene.add(model);

    if (gltf.animations && gltf.animations.length > 0) {
      window.mixer = new AnimationMixer(model);
      window.mixer.clipAction(gltf.animations[0]).play();
    }
  },
  undefined,
  function (error) {
    console.error('GLTF load error:', error);
  }
);

// 环境光 + 方向光
const ambient = new THREE.AmbientLight('#ffffff', 0.5);
scene.add(ambient);
const dirLight = new THREE.DirectionalLight('#ffffff', 1);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

window.animate = function () {
  if (window.mixer) window.mixer.update(0.016);
};
