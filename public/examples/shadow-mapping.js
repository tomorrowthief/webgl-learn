// 阴影映射 — 材质与光照
// 知识点：ShadowMap, SpotLight, PCFSoftShadowMap

// 地面
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({ color: '#2a2a3e' })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// 立方体
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: '#6366F1', roughness: 0.3, metalness: 0.5 })
);
cube.position.y = 0.5;
cube.castShadow = true;
scene.add(cube);

// 球体
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshStandardMaterial({ color: '#22D3EE', roughness: 0.2, metalness: 0.8 })
);
sphere.position.set(2, 0.5, 0);
sphere.castShadow = true;
scene.add(sphere);

// 聚光灯（产生阴影）
const spotLight = new THREE.SpotLight('#ffffff', 30);
spotLight.position.set(0, 5, 3);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 0.3;
spotLight.castShadow = true;
spotLight.shadow.mapSize.set(1024, 1024);
scene.add(spotLight);

// 聚光灯目标点
spotLight.target.position.set(0, 0, 0);
scene.add(spotLight.target);

// 可视化光源位置
const helper = new THREE.SpotLightHelper(spotLight);
scene.add(helper);

window.animate = function () {
  cube.rotation.y += 0.01;
  spotLight.position.x = Math.sin(Date.now() * 0.001) * 3;
  spotLight.position.z = Math.cos(Date.now() * 0.001) * 3;
  helper.update();
};
