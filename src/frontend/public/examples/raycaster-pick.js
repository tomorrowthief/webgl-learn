// 鼠标拾取 — 高级案例
// 知识点：Raycaster, 鼠标交互, Intersection

// 创建场景物体
const objects = [];
const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

// 随机生成几何体
const geometries = [
  new THREE.BoxGeometry(0.4, 0.4, 0.4),
  new THREE.SphereGeometry(0.25, 32, 32),
  new THREE.CylinderGeometry(0.2, 0.2, 0.5, 32),
  new THREE.TorusGeometry(0.25, 0.1, 16, 32),
  new THREE.ConeGeometry(0.25, 0.5, 32),
];

for (let i = 0; i < 12; i++) {
  const geoIdx = i % geometries.length;
  const material = new THREE.MeshStandardMaterial({
    color: colors[i % colors.length],
    roughness: 0.4,
    metalness: 0.2,
  });
  const mesh = new THREE.Mesh(geometries[geoIdx], material);

  mesh.position.x = (Math.random() - 0.5) * 3;
  mesh.position.y = (Math.random() - 0.5) * 2.5;
  mesh.position.z = (Math.random() - 0.5) * 2;

  mesh.userData = {
    originalColor: colors[i % colors.length],
    originalEmissive: '#000000',
  };

  scene.add(mesh);
  objects.push(mesh);
}

// 设置 Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let currentHovered = null;
let currentSelected = null;

// 高亮效果
function highlight(obj, color) {
  obj.material.emissive = new THREE.Color(color);
  obj.material.emissiveIntensity = 0.3;
}

function unhighlight(obj) {
  if (obj && obj.material) {
    obj.material.emissive = new THREE.Color('#000000');
    obj.material.emissiveIntensity = 0;
  }
}

// 监听 iframe 接收鼠标事件通过 postMessage
// 这里通过内建的 pointer 事件直接处理
renderer.domElement.addEventListener('pointermove', (event) => {
  mouse.x = (event.offsetX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(event.offsetY / renderer.domElement.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(objects);

  if (intersects.length > 0) {
    const obj = intersects[0].object;
    if (currentHovered !== obj) {
      unhighlight(currentHovered);
      currentHovered = obj;
      if (obj !== currentSelected) {
        highlight(obj, '#22D3EE');
      }
    }
    renderer.domElement.style.cursor = 'pointer';
  } else {
    unhighlight(currentHovered);
    currentHovered = null;
    renderer.domElement.style.cursor = 'grab';
  }
});

renderer.domElement.addEventListener('click', (event) => {
  mouse.x = (event.offsetX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(event.offsetY / renderer.domElement.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(objects);

  // Reset previous selection
  if (currentSelected) {
    unhighlight(currentSelected);
    currentSelected = null;
  }

  if (intersects.length > 0) {
    currentSelected = intersects[0].object;
    highlight(currentSelected, '#FF6B6B');
  }
});