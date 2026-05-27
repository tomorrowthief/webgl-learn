// 飘动的旗帜 — 初级案例
// 知识点：BufferGeometry, 顶点操作, 正弦波

const width = 2;
const height = 1.5;
const segments = 80;

const geometry = new THREE.BufferGeometry();
const vertices = [];
const colors = [];
const indices = [];

// 创建网格顶点
for (let i = 0; i <= segments; i++) {
  const x = (i / segments - 0.5) * width;
  for (let j = 0; j <= segments; j++) {
    const y = (j / segments) * height;
    vertices.push(x, y, 0);
    colors.push(0.4, 0.3 + (j / segments) * 0.6, 0.8);
  }
}

// 创建索引
const rows = segments + 1;
for (let i = 0; i < segments; i++) {
  for (let j = 0; j < segments; j++) {
    const a = i * rows + j;
    const b = a + 1;
    const c = a + rows;
    const d = c + 1;
    indices.push(a, b, d);
    indices.push(a, d, c);
  }
}

geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
geometry.setIndex(indices);
geometry.computeVertexNormals();

const material = new THREE.MeshStandardMaterial({
  vertexColors: true,
  side: THREE.DoubleSide,
  roughness: 0.5,
});
const flag = new THREE.Mesh(geometry, material);
scene.add(flag);

// 动画：波动效果
const posAttr = geometry.attributes.position;
const originalY = new Float32Array(vertices.length / 3);

// 保存原始 Y 坐标
for (let i = 0; i < originalY.length; i++) {
  originalY[i] = vertices[i * 3 + 1];
}

window.animate = function () {
  const time = Date.now() * 0.002;
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    posAttr.setZ(i, Math.sin(x * 3 + time) * 0.15 + Math.cos(x * 5 + time * 0.8) * 0.05);
  }
  posAttr.needsUpdate = true;
};