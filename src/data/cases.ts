import { type CaseMeta, type CaseModule } from '../types';

export const CASES: CaseMeta[] = [
  // === 模块一：Three.js 基础 ===
  {
    id: 'basic-cube', title: '旋转的立方体',
    description: '创建第一个 3D 场景：一个旋转的彩色立方体，学习基础几何体和材质',
    level: 'beginner', module: 'basics',
    thumbnail: '/thumbnails/basic-cube.svg',
    templateFile: '/examples/basic-cube.js',
    tags: ['Mesh', 'BoxGeometry', 'MeshStandardMaterial'],
  },
  {
    id: 'colorful-spheres', title: '彩色球体阵列',
    description: '多个不同颜色和位置的球体，学习材质属性与点光源',
    level: 'beginner', module: 'basics',
    thumbnail: '/thumbnails/colorful-spheres.svg',
    templateFile: '/examples/colorful-spheres.js',
    tags: ['SphereGeometry', 'MeshPhongMaterial', 'PointLight'],
  },
  {
    id: 'orbit-earth', title: '地球绕太阳',
    description: '模拟地球公转和月球绕转，学习层级变换与轨道控制',
    level: 'beginner', module: 'basics',
    thumbnail: '/thumbnails/orbit-earth.svg',
    templateFile: '/examples/orbit-earth.js',
    tags: ['Group', 'OrbitControls', '层次变换'],
  },
  {
    id: 'wave-flag', title: '飘动的旗帜',
    description: '利用顶点位移模拟旗帜飘动效果，学习 BufferGeometry 顶点操作',
    level: 'beginner', module: 'basics',
    thumbnail: '/thumbnails/wave-flag.svg',
    templateFile: '/examples/wave-flag.js',
    tags: ['BufferGeometry', '顶点着色', '正弦波'],
  },
  {
    id: 'ortho-camera', title: '正交相机',
    description: '使用正交相机实现等距视角，对比透视投影与正交投影的差异',
    level: 'beginner', module: 'basics',
    thumbnail: '/thumbnails/ortho-camera.svg',
    templateFile: '/examples/ortho-camera.js',
    tags: ['OrthographicCamera', '等距视角', '透视对比'],
  },

  // === 模块二：材质与光照 ===
  {
    id: 'pbr-sphere', title: 'PBR 材质球',
    description: '展示金属度/粗糙度对 PBR 材质的影响，学习物理渲染',
    level: 'advanced', module: 'materials',
    thumbnail: '/thumbnails/pbr-sphere.svg',
    templateFile: '/examples/pbr-sphere.js',
    tags: ['MeshStandardMaterial', 'PBR', 'metalness'],
  },
  {
    id: 'shadow-mapping', title: '阴影映射',
    description: '使用 SpotLight 投射阴影，理解 castShadow、receiveShadow 和阴影贴图',
    level: 'advanced', module: 'materials',
    thumbnail: '/thumbnails/shadow-mapping.svg',
    templateFile: '/examples/shadow-mapping.js',
    tags: ['ShadowMap', 'SpotLight', 'PCFSoftShadowMap'],
  },
  {
    id: 'texture-maps', title: '纹理贴图',
    description: '加载漫反射、法线、粗糙度贴图，学习纹理映射与多通道材质',
    level: 'advanced', module: 'materials',
    thumbnail: '/thumbnails/texture-maps.svg',
    templateFile: '/examples/texture-maps.js',
    tags: ['TextureLoader', 'NormalMap', 'RoughnessMap'],
  },
  {
    id: 'custom-shader', title: '自定义着色器',
    description: '手写 ShaderMaterial 实现噪声球体，理解顶点着色器和片元着色器',
    level: 'advanced', module: 'materials',
    thumbnail: '/thumbnails/custom-shader.svg',
    templateFile: '/examples/custom-shader.js',
    tags: ['ShaderMaterial', 'uniform', '噪声'],
  },
  {
    id: 'gltf-loader', title: 'GLTF 模型加载',
    description: '使用 GLTFLoader 加载外部 3D 模型，学习 DRACOLoader 压缩格式',
    level: 'advanced', module: 'materials',
    thumbnail: '/thumbnails/gltf-loader.svg',
    templateFile: '/examples/gltf-loader.js',
    tags: ['GLTFLoader', 'DRACOLoader', '模型加载'],
  },

  // === 模块三：交互与动画 ===
  {
    id: 'raycaster-pick', title: '鼠标拾取',
    description: '使用 Raycaster 实现鼠标悬停和点击拾取 3D 物体',
    level: 'advanced', module: 'interaction',
    thumbnail: '/thumbnails/raycaster-pick.svg',
    templateFile: '/examples/raycaster-pick.js',
    tags: ['Raycaster', '鼠标交互', 'Intersection'],
  },
  {
    id: 'skeletal-animation', title: '骨骼动画',
    description: '加载带骨骼动画的模型，使用 AnimationMixer 播放和混合动作',
    level: 'advanced', module: 'interaction',
    thumbnail: '/thumbnails/skeletal-animation.svg',
    templateFile: '/examples/skeletal-animation.js',
    tags: ['AnimationMixer', 'AnimationClip', '骨骼动画'],
  },
  {
    id: 'instanced-mesh', title: '十万实例',
    description: '使用 InstancedMesh 高效渲染十万个物体，学习批量渲染技术',
    level: 'advanced', module: 'interaction',
    thumbnail: '/thumbnails/instanced-mesh.svg',
    templateFile: '/examples/instanced-mesh.js',
    tags: ['InstancedMesh', '批量渲染', '性能优化'],
  },
  {
    id: 'sprite-billboard', title: 'Sprite 标签',
    description: '使用 Sprite 创建始终面向相机的文字标签和粒子效果',
    level: 'advanced', module: 'interaction',
    thumbnail: '/thumbnails/sprite-billboard.svg',
    templateFile: '/examples/sprite-billboard.js',
    tags: ['Sprite', 'SpriteMaterial', '看板'],
  },

  // === 模块四：高级特效 ===
  {
    id: 'postprocessing', title: '后期特效',
    description: '使用 EffectComposer 添加辉光和色彩偏移等后期处理效果',
    level: 'advanced', module: 'effects',
    thumbnail: '/thumbnails/postprocessing.svg',
    templateFile: '/examples/postprocessing.js',
    tags: ['EffectComposer', 'UnrealBloomPass', '后处理'],
  },
  {
    id: 'wireframe', title: '线框渲染',
    description: '使用 Line2 绘制带线宽的 3D 线框，学习几何体描边效果',
    level: 'advanced', module: 'effects',
    thumbnail: '/thumbnails/wireframe.svg',
    templateFile: '/examples/wireframe.js',
    tags: ['Line2', 'LineGeometry', '线框'],
  },
  {
    id: 'multi-pass', title: '多通道后处理',
    description: '组合 SSAO + Bloom + FXAA 多个后处理通道，构建完整后期管线',
    level: 'advanced', module: 'effects',
    thumbnail: '/thumbnails/multi-pass.svg',
    templateFile: '/examples/multi-pass.js',
    tags: ['SSAOPass', 'FXAA', '多通道'],
  },
  {
    id: 'webxr', title: 'WebXR 沉浸',
    description: '使用 WebXR API 进入 VR 模式，学习空间渲染和手柄交互',
    level: 'advanced', module: 'effects',
    thumbnail: '/thumbnails/webxr.svg',
    templateFile: '/examples/webxr.js',
    tags: ['XRSession', 'WebXR', 'VR'],
  },

  // === 模块五：WebGL 原生 ===
  {
    id: 'webgl-triangle', title: '彩色三角形',
    description: 'WebGL 入门第一课：手写 Shader、VBO、VAO，画一个彩色三角形',
    level: 'webgl', module: 'webgl',
    thumbnail: '/thumbnails/webgl-triangle.svg',
    templateFile: '/examples/webgl-triangle.js', sandboxType: 'webgl',
    tags: ['Shader', 'VBO', 'VAO', 'attribute'],
  },
  {
    id: 'webgl-rotating-square', title: '旋转正方形',
    description: '手写 mat4 矩阵变换，用 uniform 传 MVP 矩阵实现旋转和位移',
    level: 'webgl', module: 'webgl',
    thumbnail: '/thumbnails/webgl-rotating-square.svg',
    templateFile: '/examples/webgl-rotating-square.js', sandboxType: 'webgl',
    tags: ['mat4', 'uniform', '变换矩阵', '旋转'],
  },
  {
    id: 'webgl-texture', title: '纹理映射',
    description: '将程序化生成的棋盘图案贴到正方形，学习 UV 坐标和 Sampler2D',
    level: 'webgl', module: 'webgl',
    thumbnail: '/thumbnails/webgl-texture.svg',
    templateFile: '/examples/webgl-texture.js', sandboxType: 'webgl',
    tags: ['Texture', 'UV', 'Sampler2D', '程序化纹理'],
  },
  {
    id: 'webgl-3d-cube', title: '3D 旋转立方体',
    description: '用矩阵投影实现真正的 3D 立方体旋转，理解透视投影和深度测试',
    level: 'webgl', module: 'webgl',
    thumbnail: '/thumbnails/webgl-3d-cube.svg',
    templateFile: '/examples/webgl-3d-cube.js', sandboxType: 'webgl',
    tags: ['透视投影', 'MVP', '深度缓冲', '3D变换'],
  },
  {
    id: 'webgl-lighting', title: 'Blinn-Phong 光照',
    description: '在球体上实现环境光+漫反射+镜面高光，手写光照计算 Shader',
    level: 'webgl', module: 'webgl',
    thumbnail: '/thumbnails/webgl-lighting.svg',
    templateFile: '/examples/webgl-lighting.js', sandboxType: 'webgl',
    tags: ['法线', '漫反射', '镜面高光', '着色器光照'],
  },
  {
    id: 'webgl-particles', title: '粒子星空',
    description: '3000 个粒子构成的球壳星空，gl.POINTS + Blend 混合 + 鼠标缩放',
    level: 'webgl', module: 'webgl',
    thumbnail: '/thumbnails/webgl-particles.svg',
    templateFile: '/examples/webgl-particles.js', sandboxType: 'webgl',
    tags: ['POINTS', '粒子', 'Blend', 'gl_PointSize'],
  },
  {
    id: 'webgl-ubo', title: 'Uniform Buffer Object',
    description: '使用 UBO 在多个 Shader 间共享 uniform 数据，学习 WebGL2 缓冲机制',
    level: 'webgl', module: 'webgl',
    thumbnail: '/thumbnails/webgl-ubo.svg',
    templateFile: '/examples/webgl-ubo.js', sandboxType: 'webgl',
    tags: ['UBO', 'uniform 块', 'WebGL2'],
  },
  {
    id: 'webgl-transform-feedback', title: 'Transform Feedback',
    description: '使用变换反馈将顶点计算结果写回缓冲，实现 GPU 物理模拟',
    level: 'webgl', module: 'webgl',
    thumbnail: '/thumbnails/webgl-transform-feedback.svg',
    templateFile: '/examples/webgl-transform-feedback.js', sandboxType: 'webgl',
    tags: ['TransformFeedback', '顶点写入', '物理模拟'],
  },
];

/** 按 ID 获取案例元数据 */
export function getCaseById(id: string): CaseMeta | undefined {
  return CASES.find((c) => c.id === id);
}

/** 按模块获取案例列表 */
export function getCasesByModule(module: CaseModule | 'all'): CaseMeta[] {
  if (module === 'all') return CASES;
  return CASES.filter((c) => c.module === module);
}

/** 按模块分组（用于 HomePage 折叠展示） */
export function getCasesGroupedByModule(): Record<string, CaseMeta[]> {
  const modules: CaseModule[] = ['basics', 'materials', 'interaction', 'effects', 'webgl'];
  const result: Record<string, CaseMeta[]> = {};
  for (const mod of modules) {
    result[mod] = CASES.filter((c) => c.module === mod);
  }
  return result;
}

/** 加载模板代码文本 */
export async function loadTemplateCode(templateFile: string): Promise<string> {
  const resp = await fetch(templateFile);
  if (!resp.ok) throw new Error(`加载模板失败: ${resp.status} ${resp.statusText}`);
  return resp.text();
}
