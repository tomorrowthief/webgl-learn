// 线框渲染 — 高级特效
// 知识点：Line2, LineGeometry, 线宽, 描边

// 创建立方体线框
const s = 1;
const verts = [
  [-s,-s,-s],[s,-s,-s],[s,s,-s],[-s,s,-s],
  [-s,-s,s],[s,-s,s],[s,s,s],[-s,s,s]
];
const edgePairs = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
const positions = [];
for (const [a, b] of edgePairs) {
  positions.push(...verts[a], ...verts[b]);
}

const lineGeo = new LineGeometry();
lineGeo.setPositions(positions);

const lineMat = new LineMaterial({
  color: 0x6366F1,
  linewidth: 3,
  resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
});

const line = new Line2(lineGeo, lineMat);
scene.add(line);

// 添加实体立方体（半透明）
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(2, 2, 2),
  new THREE.MeshStandardMaterial({
    color: '#6366F1',
    transparent: true,
    opacity: 0.1,
  })
);
scene.add(cube);

window.animate = function () {
  line.rotation.y += 0.01;
  line.rotation.x += 0.005;
  cube.rotation.y = line.rotation.y;
  cube.rotation.x = line.rotation.x;
};