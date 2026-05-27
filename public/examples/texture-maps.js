// 纹理贴图 — 材质与光照
// 知识点：TextureLoader, DiffuseMap, NormalMap

// 使用 Canvas 生成程序化纹理
function createCheckerTexture(size, color1, color2) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const half = size / 2;
  ctx.fillStyle = color1;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = color2;
  ctx.fillRect(0, 0, half, half);
  ctx.fillRect(half, half, half, half);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function createNormalTexture(size) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const half = size / 2;
  ctx.fillStyle = '#8080ff';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#808000';
  ctx.fillRect(0, half, size, half);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

const diffuseMap = createCheckerTexture(256, '#6366F1', '#818CF8');
const normalMap = createNormalTexture(256);

const material = new THREE.MeshStandardMaterial({
  map: diffuseMap,
  normalMap: normalMap,
  normalScale: new THREE.Vector2(1, 1),
  roughness: 0.4,
  metalness: 0.2,
});

const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), material);
scene.add(sphere);

// 地面网格
const grid = new THREE.GridHelper(4, 8, '#444', '#333');
scene.add(grid);

window.animate = function () {
  sphere.rotation.y += 0.01;
};
