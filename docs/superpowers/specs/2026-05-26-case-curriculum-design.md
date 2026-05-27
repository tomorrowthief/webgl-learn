---
name: webgl-threejs-case-curriculum
description: 新增 12 个案例，将 26 个案例按知识体系分为 5 个模块，覆盖 Three.js 和 WebGL 核心知识点
metadata:
  type: project
---

# WebGL/Three.js 案例课程体系设计

## 目标

从现有 14 个案例扩展到 26 个案例，按知识体系分为 5 个模块，形成完整的 WebGL/Three.js 学习路径。

## 现有问题

- 现有 `level` 字段（beginner/advanced/webgl）是难度分类，不是知识体系分类
- 案例之间缺少递进关系，知识点覆盖有缺口（阴影、自定义shader、InstancedMesh等）
- Three.js 沙箱预注入参数不足（缺少 EffectComposer 等 addons）

## 案例清单（26 个，12 新增）

### 模块一：Three.js 基础（5 个）

| 案例 | 状态 | 核心知识点 |
|------|------|-----------|
| 旋转的立方体 | 已有 | Scene, Mesh, BoxGeometry, 动画循环 |
| 彩色球体阵列 | 已有 | SphereGeometry, MeshPhongMaterial, 多灯光 |
| 地球绕太阳 | 已有 | Group 层级变换, OrbitControls |
| 飘动的旗帜 | 已有 | BufferGeometry, 顶点操作 |
| **正交相机** | 新增 | OrthographicCamera, 等距视角 |

### 模块二：材质与光照（5 个）

| 案例 | 状态 | 核心知识点 |
|------|------|-----------|
| PBR 材质球 | 已有 | MeshStandardMaterial, 环境贴图 |
| **阴影映射** | 新增 | castShadow, receiveShadow, SpotLight, PCFSoftShadowMap |
| **纹理贴图** | 新增 | Diffuse/Normal/Roughness Map, TextureLoader |
| **自定义 ShaderMaterial** | 新增 | vertexShader + fragmentShader, uniform, 噪声 |
| **GLTF 模型加载** | 新增 | GLTFLoader, DRACOLoader, 模型动画 |

### 模块三：交互与动画（4 个）

| 案例 | 状态 | 核心知识点 |
|------|------|-----------|
| 鼠标拾取 | 已有 | Raycaster, 碰撞检测 |
| **骨骼动画** | 新增 | AnimationMixer, AnimationClip, 动作混合 |
| **十万实例** | 新增 | InstancedMesh, setMatrixAt, 批量渲染 |
| **Sprite/Billboard** | 新增 | Sprite, 文字标签, 粒子看板 |

### 模块四：高级特效（4 个）

| 案例 | 状态 | 核心知识点 |
|------|------|-----------|
| 后期特效 | 已有 | EffectComposer, UnrealBloomPass |
| **线框渲染** | 新增 | Line2, LineGeometry, 线宽, 描边 |
| **多后处理通道** | 新增 | SSAO + Bloom + FXAA 组合, 自定义 Pass |
| **WebXR** | 新增 | XRSession, VR 控制器 |

### 模块五：WebGL 原生（7 个）

| 案例 | 状态 | 核心知识点 |
|------|------|-----------|
| 彩色三角形 | 已有 | Shader/VBO/attribute |
| 旋转正方形 | 已有 | uniform mat4, 变换矩阵 |
| 纹理映射 | 已有 | UV, sampler2D |
| 3D 旋转立方体 | 已有 | MVP, 深度缓冲 |
| Blinn-Phong 光照 | 已有 | 法线, 光照计算 |
| 粒子星空 | 已有 | gl.POINTS, Blend |
| **UBO** | 新增 | Uniform Buffer Object, uniform 块共享 |
| **Transform Feedback** | 新增 | 变换反馈, 顶点缓冲写入 |

## 技术改动

### cases.ts

- 新增 `module` 字段（`'basics' | 'materials' | 'interaction' | 'effects' | 'webgl'`）
- 新增 `module` 对应的显示名称映射
- 更新 HomePage 筛选逻辑：支持按模块分组展示（手风琴折叠）
- 更新 Category 类型

### Three.js 沙箱 (sandbox.ts)

预注入参数扩展，除现有的 THREE/OrbitControls/EffectComposer/RenderPass/UnrealBloomPass 外新增：
- `InstancedMesh`
- `Sprite` / `SpriteMaterial`
- `GLTFLoader` / `DRACOLoader`（通过 CDN importmap 加载）
- `Line2` / `LineGeometry` / `LineMaterial`
- `SSAOPass` / `RenderPixelatedPass` / `FXAAShader`
- `AnimationMixer`

在 setup() 中默认开启 `renderer.shadowMap.enabled = true` 和 `renderer.shadowMap.type = THREE.PCFSoftShadowMap`。

### WebGL 沙箱 (sandbox-webgl.ts)

- 确保 `webgl2` 上下文优先获取
- 在 mat4 工具中新增 `lookAt` 函数（UBO 案例需要）

### 案例模板

新增 12 个模板文件到 `public/examples/`，每个模板使用 `window.animate`（Three.js）或 `window.render`（WebGL）作为动画钩子。

## 缩略图

每个新增案例需要一个 SVG 缩略图到 `public/thumbnails/`，使用简洁的几何图形示意。
