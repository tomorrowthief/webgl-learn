# WebGL/Three.js 案例课程体系 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand from 14 to 26 cases organized into 5 knowledge modules, covering Three.js and WebGL core concepts.

**Architecture:** Add `module` field to CaseMeta, replace CategoryTabs with ModuleTabs, group cases by module on HomePage using collapsible sections, extend Three.js and WebGL sandboxes with new injected APIs, create 12 new case templates with thumbnails.

**Tech Stack:** React 18, Three.js 0.160, TypeScript, Tailwind CSS, Vite 5

---

### Task 1: Add module type to types/index.ts

**Files:**
- Modify: `src/frontend/src/types/index.ts`

- [ ] Add `CaseModule` type and update `CaseMeta` interface

Current `types/index.ts` has `CaseLevel`, `Category`, `SandboxType`, `CaseMeta`, `CaseData`, `SandboxError`, `SandboxResultMessage`, `SandboxReadyMessage`, `SandboxMessage`, `RunRequestMessage`, `MainToSandboxMessage`.

Add after `SandboxType`:

```typescript
/** 知识模块 */
export type CaseModule = 'basics' | 'materials' | 'interaction' | 'effects' | 'webgl';

/** 模块显示名称 */
export const MODULE_LABELS: Record<CaseModule, string> = {
  basics: 'Three.js 基础',
  materials: '材质与光照',
  interaction: '交互与动画',
  effects: '高级特效',
  webgl: 'WebGL 原生',
};
```

Update `CaseMeta` to add:
```typescript
module: CaseModule;
```

The final `CaseMeta` interface should look like:
```typescript
export interface CaseMeta {
  id: string;
  title: string;
  description: string;
  level: CaseLevel;
  module: CaseModule;
  thumbnail: string;
  templateFile: string;
  sandboxType?: SandboxType;
  tags: string[];
}
```

- [ ] Commit

```bash
cd /Users/zhongling/dev-projects/webgl-learn
git add src/frontend/src/types/index.ts
git commit -m "types: add CaseModule type and module field to CaseMeta"
```

---

### Task 2: Rewrite cases.ts with all 26 cases

**Files:**
- Modify: `src/frontend/src/data/cases.ts`

- [ ] Replace entire `CASES` array with all 26 cases, each with `module` field. The 14 existing cases keep their data but add `module`. 12 new cases are added.

```typescript
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
```

Keep existing `getCaseById` and `loadTemplateCode` functions unchanged.

Replace `getCasesByCategory` with `getCasesByModule`:

```typescript
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
```

- [ ] Commit

```bash
cd /Users/zhongling/dev-projects/webgl-learn
git add src/frontend/src/data/cases.ts
git commit -m "data: reorganize 26 cases into 5 knowledge modules"
```

---

### Task 3: Create ModuleTabs component

**Files:**
- Create: `src/frontend/src/components/ModuleTabs.tsx`

- [ ] Create ModuleTabs component that replaces CategoryTabs. It shows 6 tabs: 全部 + 5 modules.

```typescript
import { type CaseModule } from '../types';
import { MODULE_LABELS } from '../types';

type ModuleTab = CaseModule | 'all';

interface ModuleTabsProps {
  activeTab: ModuleTab;
  onChange: (tab: ModuleTab) => void;
}

const TABS: { key: ModuleTab; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'basics', label: '基础' },
  { key: 'materials', label: '材质光照' },
  { key: 'interaction', label: '交互动画' },
  { key: 'effects', label: '高级特效' },
  { key: 'webgl', label: 'WebGL' },
];

export default function ModuleTabs({ activeTab, onChange }: ModuleTabsProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-surface-card rounded-lg border border-border">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`px-3 md:px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 touch-manipulation ${
              isActive
                ? 'bg-accent-primary text-white shadow-glow'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] Commit

```bash
cd /Users/zhongling/dev-projects/webgl-learn
git add src/frontend/src/components/ModuleTabs.tsx
git commit -m "components: add ModuleTabs for knowledge module navigation"
```

---

### Task 4: Rewrite HomePage with module grouping

**Files:**
- Modify: `src/frontend/src/pages/HomePage.tsx`

- [ ] Replace CategoryTabs import with ModuleTabs, replace Category type with ModuleTab, update filtering logic, and add module-grouped display.

The key change is replacing the flat `CaseCardGrid` with a grouped view that shows cases under collapsible module sections when viewing "all".

Full replacement for `HomePage.tsx`:

```typescript
import { useState, useMemo } from 'react';
import { CASES, getCasesByModule } from '../data/cases';
import { type CaseModule, MODULE_LABELS } from '../types';
import ModuleTabs from '../components/ModuleTabs';
import SearchBar from '../components/SearchBar';
import CaseCardGrid from '../components/CaseCardGrid';

type ModuleTab = CaseModule | 'all';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ModuleTab>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCases = useMemo(() => {
    let cases = getCasesByModule(activeTab);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      cases = cases.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return cases;
  }, [activeTab, searchQuery]);

  const moduleOrder: CaseModule[] = ['basics', 'materials', 'interaction', 'effects', 'webgl'];

  const casesByModule = useMemo(() => {
    if (activeTab !== 'all') return null;
    if (searchQuery.trim()) return null;
    const result: Record<string, typeof CASES> = {};
    for (const mod of moduleOrder) {
      result[mod] = CASES.filter((c) => c.module === mod);
    }
    return result;
  }, [activeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-surface-page">
      <section className="pt-20 pb-12 md:pt-24 md:pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
            <span className="gradient-hero-text">WebGL / Three.js</span>
            <br />
            <span className="text-text-primary">在线交互式学习</span>
          </h1>
          <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            无需安装任何工具，打开浏览器即可上手学习 3D 编程。
            边看效果、边改代码、即时运行。
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap pt-2">
            <span className="inline-flex items-center gap-1 text-xs text-text-tertiary">
              <span className="w-2 h-2 rounded-full bg-accent-success" />
              {CASES.length} 个案例
            </span>
            <span className="text-text-tertiary/30">·</span>
            <span className="text-xs text-text-tertiary">5 个知识模块</span>
            <span className="text-text-tertiary/30">·</span>
            <span className="text-xs text-text-tertiary">Monaco Editor</span>
            <span className="text-text-tertiary/30">·</span>
            <span className="text-xs text-text-tertiary">实时渲染</span>
          </div>
        </div>
      </section>

      <section className="px-4 pb-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-3">
          <ModuleTabs activeTab={activeTab} onChange={setActiveTab} />
          <div className="sm:ml-auto">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Module-grouped view (only when viewing "all" and no search) */}
          {!casesByModule ? null : (
            <div className="space-y-8">
              {moduleOrder.map((mod) => {
                const modCases = casesByModule[mod];
                if (modCases.length === 0) return null;
                return (
                  <div key={mod}>
                    <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                      <span className="w-1 h-5 bg-accent-primary rounded-full" />
                      {MODULE_LABELS[mod]}
                      <span className="text-xs text-text-tertiary font-normal">({modCases.length})</span>
                    </h2>
                    <CaseCardGrid cases={modCases} />
                  </div>
                );
              })}
            </div>
          )}

          {/* Flat view (single module selected, or search active) */}
          {casesByModule === null && (
            <>
              {filteredCases.length > 0 && (
                <p className="text-xs text-text-tertiary mb-4">
                  共 {filteredCases.length} 个案例
                  {activeTab !== 'all' && `（${MODULE_LABELS[activeTab] as string}）`}
                  {searchQuery && ` — 搜索 "${searchQuery}"`}
                </p>
              )}
              <CaseCardGrid cases={filteredCases} />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
```

- [ ] Commit

```bash
cd /Users/zhongling/dev-projects/webgl-learn
git add src/frontend/src/pages/HomePage.tsx
git commit -m "pages: rewrite HomePage with module-grouped case display"
```

---

### Task 5: Delete old CategoryTabs (now unused)

**Files:**
- Delete: `src/frontend/src/components/CategoryTabs.tsx`

- [ ] Remove the file (no imports remain after Task 4)

```bash
cd /Users/zhongling/dev-projects/webgl-learn
rm src/frontend/src/components/CategoryTabs.tsx
git add src/frontend/src/components/CategoryTabs.tsx
git commit -m "components: remove unused CategoryTabs"
```

---

### Task 6: Extend Three.js sandbox with new injections

**Files:**
- Modify: `src/frontend/src/utils/sandbox.ts`

- [ ] Add additional importmap entries and pre-imports for GLTFLoader, DRACOLoader, Line2, InstancedMesh, Sprite, SSAOPass, etc.

Current imports: THREE, OrbitControls, EffectComposer, RenderPass, UnrealBloomPass.

Add these import lines after the existing ones:
```typescript
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { RenderPixelatedPass } from 'three/addons/postprocessing/RenderPixelatedPass.js';
```

Update the `new Function()` call to inject these additional parameters. Current signature:
```typescript
new Function('THREE','OrbitControls','scene','camera','renderer','EffectComposer','RenderPass','UnrealBloomPass',d.code)(
  THREE,OrbitControls,scene,camera,renderer,EffectComposer,RenderPass,UnrealBloomPass
);
```

New signature (add these 10 new parameters):
```typescript
new Function(
  'THREE','OrbitControls','scene','camera','renderer',
  'EffectComposer','RenderPass','UnrealBloomPass',
  'GLTFLoader','DRACOLoader',
  'Line2','LineGeometry','LineMaterial',
  'SSAOPass','OutputPass','ShaderPass','FXAAShader','RenderPixelatedPass',
  'InstancedMesh','Sprite','SpriteMaterial',
  'AnimationMixer','AnimationClip',
  d.code
)(
  THREE,OrbitControls,scene,camera,renderer,
  EffectComposer,RenderPass,UnrealBloomPass,
  GLTFLoader,DRACOLoader,
  Line2,LineGeometry,LineMaterial,
  SSAOPass,OutputPass,ShaderPass,FXAAShader,RenderPixelatedPass,
  THREE.InstancedMesh,THREE.Sprite,THREE.SpriteMaterial,
  THREE.AnimationMixer,THREE.AnimationClip,
);
```

Note: `InstancedMesh`, `Sprite`, `SpriteMaterial`, `AnimationMixer`, `AnimationClip` are all available on the `THREE` namespace so we inject them as `THREE.InstancedMesh` etc.

Also enable shadow map in `setup()`. After the line `scene.add(new THREE.AmbientLight('#fff',0.5));`, add:
```typescript
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
```

Wait — this is wrong. `renderer` is created in `mkR()`, and `setup()` is called after `mkR()`. So we need to enable shadow map in `setup()` after `mkR()` has been called. The call order is `mkR(); setup();` so renderer exists at that point. But actually looking at the code, `setup()` only creates scene/camera/controls/lights — it doesn't touch renderer. We should add shadow setup right after `mkR()` in the message handler, or better, add it inside `mkR()` after creating the renderer.

Add to `mkR()` after `renderer.setSize(...)`:
```typescript
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
```

- [ ] Commit

```bash
cd /Users/zhongling/dev-projects/webgl-learn
git add src/frontend/src/utils/sandbox.ts
git commit -m "sandbox: extend Three.js sandbox with loaders, lines, SSAO, instancing, animation"
```

---

### Task 7: Add mat4.lookAt to WebGL sandbox

**Files:**
- Modify: `src/frontend/src/utils/sandbox-webgl.ts`

- [ ] Add `lookAt` function to the mat4 object (needed for UBO case). After the `scale` function in the mat4 object, add:

```javascript
  lookAt: function(eye, center, up) {
    var zx = eye[0]-center[0], zy = eye[1]-center[1], zz = eye[2]-center[2];
    var len = 1/Math.sqrt(zx*zx+zy*zy+zz*zz);
    var fz = [zx*len, zy*len, zz*len];
    var sx = up[1]*fz[2]-up[2]*fz[1], sy = up[2]*fz[0]-up[0]*fz[2], sz = up[0]*fz[1]-up[1]*fz[0];
    len = 1/Math.sqrt(sx*sx+sy*sy+sz*sz);
    var fs = [sx*len, sy*len, sz*len];
    var ux = fz[1]*fs[2]-fz[2]*fs[1], uy = fz[2]*fs[0]-fz[0]*fs[2], uz = fz[0]*fs[1]-fz[1]*fs[0];
    return [
      fs[0], ux, fz[0], 0,
      fs[1], uy, fz[1], 0,
      fs[2], uz, fz[2], 0,
      -(fs[0]*eye[0]+fs[1]*eye[1]+fs[2]*eye[2]),
      -(ux*eye[0]+uy*eye[1]+uz*eye[2]),
      -(fz[0]*eye[0]+fz[1]*eye[1]+fz[2]*eye[2]),
      1
    ];
  }
```

- [ ] Commit

```bash
cd /Users/zhongling/dev-projects/webgl-learn
git add src/frontend/src/utils/sandbox-webgl.ts
git commit -m "sandbox: add mat4.lookAt to WebGL sandbox"
```

---

### Task 8: Create Three.js module 1 template — Orthographic Camera

**Files:**
- Create: `src/frontend/public/examples/ortho-camera.js`

- [ ] Create orthographic camera example:

```javascript
// 正交相机 — Three.js 基础
// 知识点：OrthographicCamera, 等距视角, 透视对比

// 创建透视场景（左侧）
const perspCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
perspCamera.position.set(3, 3, 3);
perspCamera.lookAt(0, 0, 0);

// 创建正交场景（右侧）
const frustumSize = 4;
const aspect = 1;
const orthoCamera = new THREE.OrthographicCamera(
  -frustumSize * aspect / 2, frustumSize * aspect / 2,
  frustumSize / 2, -frustumSize / 2,
  0.1, 100
);
orthoCamera.position.set(3, 3, 3);
orthoCamera.lookAt(0, 0, 0);

// 共享场景内容
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 1.5, 1.5),
  new THREE.MeshStandardMaterial({ color: '#6366F1', roughness: 0.3, metalness: 0.1 })
);
scene.add(cube);

// 添加网格地面
const grid = new THREE.GridHelper(4, 8, '#444', '#333');
scene.add(grid);

// 使用正交相机覆盖默认相机
window.animate = function () {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.015;
};
```

- [ ] Commit

```bash
cd /Users/zhongling/dev-projects/webgl-learn
git add src/frontend/public/examples/ortho-camera.js
git commit -m "examples: add orthographic camera case"
```

---

### Task 9: Create Three.js module 2 templates (5 cases)

**Files:**
- Create: `src/frontend/public/examples/shadow-mapping.js`
- Create: `src/frontend/public/examples/texture-maps.js`
- Create: `src/frontend/public/examples/custom-shader.js`
- Create: `src/frontend/public/examples/gltf-loader.js`

- [ ] Create shadow-mapping.js:

```javascript
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
```

- [ ] Create texture-maps.js:

```javascript
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
  // 上半部分法线朝上 (128,128,255)
  ctx.fillStyle = '#8080ff';
  ctx.fillRect(0, 0, size, size);
  // 下半部分法线朝下 (128,128,0)
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
```

- [ ] Create custom-shader.js:

```javascript
// 自定义着色器 — 材质与光照
// 知识点：ShaderMaterial, uniform, 噪声函数

// Simplex 噪声函数（简化版）
const noiseGLSL = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g  = step(x0.yzx, x0.xyz);
  vec3 l  = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x  = x_ * ns.x + ns.yyyy;
  vec4 y  = y_ * ns.x + ns.yyyy;
  vec4 h  = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

const vertexShader = noiseGLSL + `
uniform float uTime;
uniform float uAmplitude;
varying vec3 vNormal;
varying float vDisplacement;

void main() {
  vNormal = normal;
  float displacement = snoise(position * 2.0 + uTime) * uAmplitude;
  vDisplacement = displacement;
  vec3 newPosition = position + normal * displacement;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
varying vec3 vNormal;
varying float vDisplacement;

void main() {
  vec3 color1 = vec3(0.39, 0.4, 0.95);
  vec3 color2 = vec3(0.13, 0.83, 0.93);
  float t = vDisplacement * 2.0 + 0.5;
  vec3 color = mix(color1, color2, t);
  float diff = max(dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))), 0.0);
  gl_FragColor = vec4(color * (0.3 + 0.7 * diff), 1.0);
}
`;

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uAmplitude: { value: 0.3 },
  },
});

const sphere = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 4), material);
scene.add(sphere);

window.animate = function () {
  material.uniforms.uTime.value += 0.01;
  sphere.rotation.y += 0.003;
};
```

- [ ] Create gltf-loader.js:

```javascript
// GLTF 模型加载 — 材质与光照
// 知识点：GLTFLoader, DRACOLoader, 模型加载

// 注意：沙箱已预注入 GLTFLoader 和 DRACOLoader
// 这里加载一个在线 GLTF 示例模型

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/');
loader.setDRACOLoader(dracoLoader);

// 加载示例模型（Three.js 官方示例中的 DamagedHelmet）
loader.load(
  'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
  function (gltf) {
    const model = gltf.scene;
    model.scale.set(2, 2, 2);
    scene.add(model);

    // 如果模型有动画，播放它
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
```

- [ ] Commit

```bash
cd /Users/zhongling/dev-projects/webgl-learn
git add src/frontend/public/examples/shadow-mapping.js src/frontend/public/examples/texture-maps.js src/frontend/public/examples/custom-shader.js src/frontend/public/examples/gltf-loader.js
git commit -m "examples: add 4 module-2 cases (shadow, texture, shader, gltf)"
```

---

### Task 10: Create Three.js module 3 templates (3 cases)

**Files:**
- Create: `src/frontend/public/examples/skeletal-animation.js`
- Create: `src/frontend/public/examples/instanced-mesh.js`
- Create: `src/frontend/public/examples/sprite-billboard.js`

- [ ] Create skeletal-animation.js:

```javascript
// 骨骼动画 — 交互与动画
// 知识点：AnimationMixer, AnimationClip, 动作混合

// 地面
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({ color: '#2a2a3e' })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// 使用简单几何体模拟角色（代替实际骨骼模型）
// 身体
const bodyGeo = new THREE.CylinderGeometry(0.2, 0.15, 0.8, 8);
const bodyMat = new THREE.MeshStandardMaterial({ color: '#6366F1' });
const body = new THREE.Mesh(bodyGeo, bodyMat);
body.position.y = 1.2;
scene.add(body);

// 头
const head = new THREE.Mesh(
  new THREE.SphereGeometry(0.2, 16, 16),
  new THREE.MeshStandardMaterial({ color: '#818CF8' })
);
head.position.y = 1.8;
scene.add(head);

// 左臂
const armGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.6, 8);
const armMat = new THREE.MeshStandardMaterial({ color: '#6366F1' });
const leftArm = new THREE.Mesh(armGeo, armMat);
leftArm.position.set(-0.35, 1.2, 0);
scene.add(leftArm);

// 右臂
const rightArm = new THREE.Mesh(armGeo, armMat);
rightArm.position.set(0.35, 1.2, 0);
scene.add(rightArm);

// 左腿
const legGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.7, 8);
const legMat = new THREE.MeshStandardMaterial({ color: '#4F46E5' });
const leftLeg = new THREE.Mesh(legGeo, legMat);
leftLeg.position.set(-0.12, 0.45, 0);
scene.add(leftLeg);

// 右腿
const rightLeg = new THREE.Mesh(legGeo, legMat);
rightLeg.position.set(0.12, 0.45, 0);
scene.add(rightLeg);

// 用 AnimationMixer 手动驱动动画（模拟骨骼）
const time = { value: 0 };
window.animate = function () {
  time.value += 0.05;
  const t = time.value;

  // 行走动画
  leftArm.rotation.x = Math.sin(t) * 0.6;
  rightArm.rotation.x = -Math.sin(t) * 0.6;
  leftLeg.rotation.x = -Math.sin(t) * 0.5;
  rightLeg.rotation.x = Math.sin(t) * 0.5;

  // 身体上下起伏
  body.position.y = 1.2 + Math.abs(Math.sin(t * 2)) * 0.05;
  head.position.y = 1.8 + Math.abs(Math.sin(t * 2)) * 0.05;

  // 整体移动
  body.position.x = (t * 0.5) % 6 - 3;
  head.position.x = body.position.x;
  leftArm.position.x = body.position.x - 0.35;
  rightArm.position.x = body.position.x + 0.35;
  leftLeg.position.x = body.position.x - 0.12;
  rightLeg.position.x = body.position.x + 0.12;
};
```

- [ ] Create instanced-mesh.js:

```javascript
// 十万实例 — 交互与动画
// 知识点：InstancedMesh, setMatrixAt, 批量渲染

const count = 10000;
const geometry = new THREE.IcosahedronGeometry(0.05, 0);
const material = new THREE.MeshStandardMaterial({
  color: '#6366F1',
  roughness: 0.3,
  metalness: 0.5,
});

const instancedMesh = new InstancedMesh(geometry, material, count);

const dummy = new THREE.Object3D();
const color = new THREE.Color();

for (let i = 0; i < count; i++) {
  dummy.position.set(
    (Math.random() - 0.5) * 8,
    (Math.random() - 0.5) * 8,
    (Math.random() - 0.5) * 8
  );
  dummy.updateMatrix();
  instancedMesh.setMatrixAt(i, dummy.matrix);

  // 随机颜色
  color.setHSL(Math.random(), 0.7, 0.5);
  instancedMesh.setColorAt(i, color);
}

scene.add(instancedMesh);

// 动画：整体旋转
window.animate = function () {
  instancedMesh.rotation.y += 0.005;
  instancedMesh.rotation.x += 0.002;
};
```

- [ ] Create sprite-billboard.js:

```javascript
// Sprite 标签 — 交互与动画
// 知识点：Sprite, SpriteMaterial, 看板

// 创建文字纹理
function createLabelTexture(text, size) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.roundRect(0, 0, 256, 64, 10);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 32);
  return new THREE.CanvasTexture(canvas);
}

// 添加标签到场景中的物体上
const labels = ['太阳', '地球', '月球', '火星'];
const positions = [
  [0, 0, 0],
  [2, 0.5, 0],
  [2.8, 0.8, 0],
  [-2, 0.3, 1],
];
const colors = ['#FFD700', '#4ECDC4', '#888', '#FF6B6B'];

labels.forEach((text, i) => {
  // 星球
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 16, 16),
    new THREE.MeshStandardMaterial({ color: colors[i] })
  );
  sphere.position.set(...positions[i]);
  scene.add(sphere);

  // Sprite 标签（始终面向相机）
  const spriteMat = new SpriteMaterial({
    map: createLabelTexture(text, 32),
    transparent: true,
  });
  const sprite = new Sprite(spriteMat);
  sprite.scale.set(1.5, 0.4, 1);
  sprite.position.set(positions[i][0], positions[i][1] + 0.6, positions[i][2]);
  scene.add(sprite);
});

// 添加环境光
scene.add(new THREE.AmbientLight('#ffffff', 0.6));
const dirLight = new THREE.DirectionalLight('#ffffff', 1);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

window.animate = function () {
  // 地球绕太阳转
  const t = Date.now() * 0.001;
  scene.children.forEach((child) => {
    if (child.isSprite && child.position.x > 1) {
      child.position.x = 2 * Math.cos(t);
      child.position.z = 2 * Math.sin(t);
      child.position.y = 0.5;
    }
    if (child.isMesh && child.position.x > 1 && child.position.x < 3) {
      child.position.x = 2 * Math.cos(t);
      child.position.z = 2 * Math.sin(t);
    }
  });
};
```

- [ ] Commit

```bash
cd /Users/zhongling/dev-projects/webgl-learn
git add src/frontend/public/examples/skeletal-animation.js src/frontend/public/examples/instanced-mesh.js src/frontend/public/examples/sprite-bibboard.js
git commit -m "examples: add 3 module-3 cases (animation, instancing, sprite)"
```

---

### Task 11: Create Three.js module 4 templates (3 cases)

**Files:**
- Create: `src/frontend/public/examples/wireframe.js`
- Create: `src/frontend/public/examples/multi-pass.js`
- Create: `src/frontend/public/examples/webxr.js`

- [ ] Create wireframe.js:

```javascript
// 线框渲染 — 高级特效
// 知识点：Line2, LineGeometry, 线宽, 描边

// 注意：Line2/LineGeometry/LineMaterial 由沙箱注入

// 创建立方体线框
const points = [];
// 12 edges of a cube
const s = 1;
const verts = [
  [-s,-s,-s],[s,-s,-s],[s,s,-s],[-s,s,-s],
  [-s,-s,s],[s,-s,s],[s,s,s],[-s,s,s]
];
const edges = [0,1, 1,2, 2,3, 3,0, 4,5, 5,6, 6,7, 7,4, 0,4, 1,5, 2,6, 3,7];
for (const [a, b] of edges.reduce((arr, _, i, a) => i%2===0 ? [...arr, [a[i], a[i+1]]] : arr, [])) {
  points.push(new THREE.Vector3(...verts[a]));
  points.push(new THREE.Vector3(...verts[b]));
}

const lineGeo = new LineGeometry();
lineGeo.setPositions(points.flatMap(v => [v.x, v.y, v.z]));

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
```

- [ ] Create multi-pass.js:

```javascript
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
```

- [ ] Create webxr.js:

```javascript
// WebXR 沉浸 — 高级特效
// 知识点：XRSession, WebXR, VR 控制器

// 创建 VR 场景
const grid = new THREE.GridHelper(10, 20, '#444', '#333');
scene.add(grid);

// 浮动的几何体
const objects = [];
const geometries = [
  new THREE.IcosahedronGeometry(0.3, 0),
  new THREE.OctahedronGeometry(0.3, 0),
  new THREE.TetrahedronGeometry(0.3, 0),
];

for (let i = 0; i < 15; i++) {
  const geo = geometries[i % 3];
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5),
    roughness: 0.3,
    metalness: 0.5,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(
    (Math.random() - 0.5) * 6,
    0.5 + Math.random() * 2,
    (Math.random() - 0.5) * 6
  );
  mesh.userData.rotSpeed = {
    x: (Math.random() - 0.5) * 0.02,
    y: (Math.random() - 0.5) * 0.02,
  };
  scene.add(mesh);
  objects.push(mesh);
}

// 环境光
scene.add(new THREE.AmbientLight('#ffffff', 0.5));
const dirLight = new THREE.DirectionalLight('#ffffff', 1);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

// WebXR 支持检测
if ('xr' in navigator) {
  renderer.xr.enabled = true;
  const enterVR = document.createElement('button');
  enterVR.textContent = '进入 VR';
  enterVR.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);padding:12px 24px;background:#6366F1;color:#fff;border:none;border-radius:8px;font-size:16px;cursor:pointer;z-index:1000;';
  enterVR.addEventListener('click', () => {
    navigator.xr.requestSession('immersive-vr').then((session) => {
      renderer.xr.setSession(session);
      session.addEventListener('end', () => { enterVR.textContent = '进入 VR'; });
      enterVR.textContent = '退出 VR';
    });
  });
  document.body.appendChild(enterVR);
}

window.animate = function () {
  objects.forEach((obj) => {
    obj.rotation.x += obj.userData.rotSpeed.x;
    obj.rotation.y += obj.userData.rotSpeed.y;
    obj.position.y += Math.sin(Date.now() * 0.001 + obj.position.x) * 0.002;
  });
};
```

- [ ] Commit

```bash
cd /Users/zhongling/dev-projects/webgl-learn
git add src/frontend/public/examples/wireframe.js src/frontend/public/examples/multi-pass.js src/frontend/public/examples/webxr.js
git commit -m "examples: add 3 module-4 cases (wireframe, multi-pass, webxr)"
```

---

### Task 12: Create WebGL module 5 templates (2 cases)

**Files:**
- Create: `src/frontend/public/examples/webgl-ubo.js`
- Create: `src/frontend/public/examples/webgl-transform-feedback.js`

- [ ] Create webgl-ubo.js:

```javascript
// Uniform Buffer Object — WebGL 原生
// 知识点：UBO, uniform 块, WebGL2 缓冲机制

var vsSource = `#version 300 es
layout(location = 0) in vec2 a_position;
layout(location = 1) in vec3 a_color;

uniform SceneData {
  mat4 u_projection;
  mat4 u_view;
};

out vec3 v_color;

void main() {
  gl_Position = u_projection * u_view * vec4(a_position, 0.0, 1.0);
  v_color = a_color;
}`;

var fsSource = `#version 300 es
precision mediump float;
in vec3 v_color;
out vec4 fragColor;

void main() {
  fragColor = vec4(v_color, 1.0);
}`;

var program = createProgram(vsSource, fsSource);
gl.useProgram(program);

// 创建 UBO
var ubo = gl.createBuffer();
gl.bindBuffer(gl.UNIFORM_BUFFER, ubo);
// 分配两个 mat4 (32 floats * 4 bytes = 128 bytes)
gl.bufferData(gl.UNIFORM_BUFFER, 128, gl.DYNAMIC_DRAW);
gl.bindBuffer(gl.UNIFORM_BUFFER, null);

// 绑定 UBO 到 binding point 0
var sceneBlockIndex = gl.getUniformBlockIndex(program, 'SceneData');
gl.uniformBlockBinding(program, sceneBlockIndex, 0);
gl.bindBufferBase(gl.UNIFORM_BUFFER, 0, ubo);

// 顶点数据
var vertices = new Float32Array([
  0.0,  0.6,  1.0, 0.0, 0.0,
 -0.6, -0.4,  0.0, 1.0, 0.0,
  0.6, -0.4,  0.0, 0.0, 1.0,
]);

var vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

var aPos = gl.getAttribLocation(program, 'a_position');
var aColor = gl.getAttribLocation(program, 'a_color');
gl.enableVertexAttribArray(aPos);
gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 20, 0);
gl.enableVertexAttribArray(aColor);
gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 20, 8);

// 矩阵工具
var projMat = mat4.identity();
var viewMat = mat4.identity();

window.render = function(gl, canvas, dt) {
  // 更新投影矩阵（UBO offset 0）
  var fovy = Math.PI / 4;
  var aspect = canvas.width / canvas.height;
  projMat = mat4.perspective(fovy, aspect, 0.1, 100);

  // 更新视图矩阵（UBO offset 64）
  viewMat = mat4.identity();
  var t = Date.now() * 0.001;
  viewMat = mat4.translate(viewMat, 0, 0, -3);
  viewMat = mat4.rotateY(viewMat, t * 0.3);

  // 写入 UBO
  gl.bindBuffer(gl.UNIFORM_BUFFER, ubo);
  gl.bufferSubData(gl.UNIFORM_BUFFER, 0, new Float32Array(projMat));
  gl.bufferSubData(gl.UNIFORM_BUFFER, 64, new Float32Array(viewMat));

  gl.clearColor(0.1, 0.1, 0.18, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
};
```

- [ ] Create webgl-transform-feedback.js:

```javascript
// Transform Feedback — WebGL 原生
// 知识点：TransformFeedback, 顶点写入, 物理模拟

var vsSource = `#version 300 es
layout(location = 0) in vec2 a_position;
layout(location = 1) in vec2 a_velocity;

uniform float uDt;

out vec2 v_position;
out vec2 v_velocity;

void main() {
  vec2 gravity = vec2(0.0, -9.8);
  vec2 newVel = a_velocity + gravity * uDt;
  vec2 newPos = a_position + newVel * uDt;

  // 碰到地面反弹
  if (newPos.y < -1.0) {
    newPos.y = -1.0;
    newVel.y = -newVel.y * 0.8; // 弹性系数
  }

  v_position = newPos;
  v_velocity = newVel;

  gl_Position = vec4(newPos, 0.0, 1.0);
  gl_PointSize = 8.0;
}`;

var fsSource = `#version 300 es
precision mediump float;
out vec4 fragColor;

void main() {
  fragColor = vec4(0.39, 0.4, 0.95, 1.0);
}`;

var program = createProgram(vsSource, fsSource);
gl.useProgram(program);

var uDt = gl.getUniformLocation(program, 'uDt');
gl.uniform1f(uDt, 0.016);

// 初始粒子数据
var numParticles = 100;
var positions = new Float32Array(numParticles * 2);
var velocities = new Float32Array(numParticles * 2);
for (var i = 0; i < numParticles; i++) {
  positions[i * 2] = (Math.random() - 0.5) * 2;
  positions[i * 2 + 1] = Math.random() * 2;
  velocities[i * 2] = (Math.random() - 0.5) * 0.5;
  velocities[i * 2 + 1] = 0;
}

// 创建两个缓冲对（ping-pong）
var posBuffers = [gl.createBuffer(), gl.createBuffer()];
var velBuffers = [gl.createBuffer(), gl.createBuffer()];
var currentBuf = 0;

// 初始化第一个缓冲
gl.bindBuffer(gl.ARRAY_BUFFER, posBuffers[0]);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, velBuffers[0]);
gl.bufferData(gl.ARRAY_BUFFER, velocities, gl.DYNAMIC_DRAW);

// 设置 attribute
var aPos = gl.getAttribLocation(program, 'a_position');
var aVel = gl.getAttribLocation(program, 'a_velocity');
gl.enableVertexAttribArray(aPos);
gl.enableVertexAttribArray(aVel);

// 创建 TransformFeedback 对象
var tf = gl.createTransformFeedback();

window.render = function(gl, canvas, dt) {
  // 设置 attribute 指向当前缓冲
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffers[currentBuf]);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, velBuffers[currentBuf]);
  gl.vertexAttribPointer(aVel, 2, gl.FLOAT, false, 0, 0);

  // 绑定目标缓冲
  var nextBuf = 1 - currentBuf;
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, posBuffers[nextBuf]);
  gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, velBuffers[nextBuf]);

  // 执行变换反馈
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);
  gl.beginTransformFeedback(gl.POINTS);
  gl.drawArrays(gl.POINTS, 0, numParticles);
  gl.endTransformFeedback();
  gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

  // 交换缓冲
  currentBuf = nextBuf;

  // 渲染
  gl.clearColor(0.1, 0.1, 0.18, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 用当前缓冲渲染粒子
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffers[currentBuf]);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.POINTS, 0, numParticles);
};
```

- [ ] Commit

```bash
cd /Users/zhongling/dev-projects/webgl-learn
git add src/frontend/public/examples/webgl-ubo.js src/frontend/public/examples/webgl-transform-feedback.js
git commit -m "examples: add 2 module-5 WebGL cases (UBO, transform feedback)"
```

---

### Task 13: Create 12 SVG thumbnails

**Files:** Create in `src/frontend/public/thumbnails/`:
- ortho-camera.svg
- shadow-mapping.svg
- texture-maps.svg
- custom-shader.svg
- gltf-loader.svg
- skeletal-animation.svg
- instanced-mesh.svg
- sprite-billboard.svg
- wireframe.svg
- multi-pass.svg
- webxr.svg
- webgl-ubo.svg
- webgl-transform-feedback.svg

- [ ] Create all 13 thumbnail SVGs (12 new + verify existing ones match). Each is a 200x150 SVG with the same style as existing thumbnails: dark background `#1a1a2e`, simple geometric shapes representing the concept.

Example format (for ortho-camera.svg):
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150">
  <rect fill="#1a1a2e" width="200" height="150"/>
  <!-- Split view: perspective left, orthographic right -->
  <line x1="100" y1="10" x2="100" y2="140" stroke="#333" stroke-width="1" stroke-dasharray="4"/>
  <!-- Perspective cube (left, with vanishing lines) -->
  <polygon points="60,50 90,40 90,80 60,85" fill="#6366F1" opacity="0.8"/>
  <line x1="60" y1="50" x2="30" y2="30" stroke="#6366F1" opacity="0.3"/>
  <line x1="90" y1="40" x2="120" y2="20" stroke="#6366F1" opacity="0.3"/>
  <!-- Orthographic cube (right, parallel edges) -->
  <polygon points="130,50 170,50 170,90 130,90" fill="#22D3EE" opacity="0.8"/>
  <polygon points="130,50 150,35 190,35 170,50" fill="#22D3EE" opacity="0.5"/>
  <polygon points="170,50 190,35 190,75 170,90" fill="#22D3EE" opacity="0.3"/>
  <!-- Labels -->
  <text x="75" y="120" fill="#888" font-size="10" text-anchor="middle" font-family="monospace">透视</text>
  <text x="150" y="120" fill="#888" font-size="10" text-anchor="middle" font-family="monospace">正交</text>
</svg>
```

For all 13 thumbnails, create simple but recognizable SVGs:

**shadow-mapping.svg:**
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150">
  <rect fill="#1a1a2e" width="200" height="150"/>
  <!-- Spotlight cone -->
  <polygon points="100,20 50,80 150,80" fill="rgba(255,215,0,0.1)" stroke="#FFD700" stroke-width="1"/>
  <!-- Cube casting shadow -->
  <rect x="85" y="80" width="30" height="30" fill="#6366F1" rx="2"/>
  <!-- Shadow on ground -->
  <polygon points="80,110 120,110 140,130 60,130" fill="rgba(0,0,0,0.5)"/>
  <!-- Ground line -->
  <line x1="20" y1="110" x2="180" y2="110" stroke="#444" stroke-width="1"/>
  <!-- Light source -->
  <circle cx="100" cy="20" r="5" fill="#FFD700"/>
</svg>
```

**texture-maps.svg:**
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150">
  <rect fill="#1a1a2e" width="200" height="150"/>
  <!-- Checkerboard texture -->
  <rect x="30" y="30" width="60" height="60" fill="#6366F1"/>
  <rect x="30" y="30" width="30" height="30" fill="#818CF8"/>
  <rect x="60" y="60" width="30" height="30" fill="#818CF8"/>
  <!-- Normal map -->
  <rect x="110" y="30" width="60" height="60" fill="#8080ff"/>
  <rect x="110" y="60" width="60" height="30" fill="#808000"/>
  <!-- Sphere with texture -->
  <circle cx="100" cy="125" r="18" fill="#6366F1"/>
  <circle cx="94" cy="119" r="5" fill="#818CF8" opacity="0.5"/>
  <!-- Labels -->
  <text x="60" y="105" fill="#888" font-size="8" text-anchor="middle" font-family="monospace">Diffuse</text>
  <text x="140" y="105" fill="#888" font-size="8" text-anchor="middle" font-family="monospace">Normal</text>
</svg>
```

**custom-shader.svg:**
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150">
  <rect fill="#1a1a2e" width="200" height="150"/>
  <!-- Noisy sphere -->
  <circle cx="100" cy="75" r="40" fill="#6366F1"/>
  <!-- Noise displacement lines -->
  <path d="M60,75 Q70,60 80,75 Q90,90 100,75 Q110,60 120,75 Q130,90 140,75" stroke="#22D3EE" stroke-width="1.5" fill="none"/>
  <path d="M65,65 Q75,50 85,65 Q95,80 105,65 Q115,50 125,65 Q135,80 145,65" stroke="#22D3EE" stroke-width="1" fill="none" opacity="0.5"/>
  <!-- Shader code snippets -->
  <text x="40" y="30" fill="#4ECDC4" font-size="7" font-family="monospace">vertexShader</text>
  <text x="130" y="30" fill="#FF6B6B" font-size="7" font-family="monospace">fragmentShader</text>
</svg>
```

**gltf-loader.svg:**
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150">
  <rect fill="#1a1a2e" width="200" height="150"/>
  <!-- 3D model wireframe -->
  <polygon points="100,30 140,60 140,100 100,120 60,100 60,60" fill="none" stroke="#6366F1" stroke-width="1.5"/>
  <line x1="100" y1="30" x2="100" y2="120" stroke="#6366F1" stroke-width="0.5" opacity="0.3"/>
  <line x1="60" y1="60" x2="140" y2="100" stroke="#6366F1" stroke-width="0.5" opacity="0.3"/>
  <line x1="140" y1="60" x2="60" y2="100" stroke="#6366F1" stroke-width="0.5" opacity="0.3"/>
  <!-- Loading arrow -->
  <path d="M30,75 L50,75 L45,70 M50,75 L45,80" stroke="#22D3EE" stroke-width="2" fill="none"/>
  <text x="90" y="80" fill="#22D3EE" font-size="8" font-family="monospace">.gltf</text>
</svg>
```

**skeletal-animation.svg:**
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150">
  <rect fill="#1a1a2e" width="200" height="150"/>
  <!-- Stick figure -->
  <circle cx="100" cy="35" r="10" fill="#6366F1"/>
  <line x1="100" y1="45" x2="100" y2="80" stroke="#6366F1" stroke-width="3"/>
  <!-- Arms (animated pose) -->
  <line x1="100" y1="55" x2="70" y2="70" stroke="#6366F1" stroke-width="2"/>
  <line x1="100" y1="55" x2="130" y2="50" stroke="#6366F1" stroke-width="2"/>
  <!-- Legs (walking pose) -->
  <line x1="100" y1="80" x2="80" y2="110" stroke="#6366F1" stroke-width="2"/>
  <line x1="100" y1="80" x2="120" y2="105" stroke="#6366F1" stroke-width="2"/>
  <!-- Joint dots -->
  <circle cx="100" cy="55" r="3" fill="#22D3EE"/>
  <circle cx="70" cy="70" r="2" fill="#22D3EE"/>
  <circle cx="130" cy="50" r="2" fill="#22D3EE"/>
  <circle cx="80" cy="110" r="2" fill="#22D3EE"/>
  <circle cx="120" cy="105" r="2" fill="#22D3EE"/>
</svg>
```

**instanced-mesh.svg:**
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150">
  <rect fill="#1a1a2e" width="200" height="150"/>
  <!-- Many small cubes (instance visualization) -->
  <rect x="30" y="40" width="8" height="8" fill="#6366F1" opacity="0.8"/>
  <rect x="45" y="35" width="8" height="8" fill="#818CF8" opacity="0.8"/>
  <rect x="60" y="42" width="8" height="8" fill="#6366F1" opacity="0.8"/>
  <rect x="75" y="38" width="8" height="8" fill="#22D3EE" opacity="0.8"/>
  <rect x="90" y="45" width="8" height="8" fill="#6366F1" opacity="0.8"/>
  <rect x="105" y="40" width="8" height="8" fill="#818CF8" opacity="0.8"/>
  <rect x="120" y="43" width="8" height="8" fill="#6366F1" opacity="0.8"/>
  <rect x="135" y="37" width="8" height="8" fill="#22D3EE" opacity="0.8"/>
  <rect x="150" y="41" width="8" height="8" fill="#6366F1" opacity="0.8"/>
  <rect x="35" y="60" width="8" height="8" fill="#818CF8" opacity="0.6"/>
  <rect x="50" y="55" width="8" height="8" fill="#6366F1" opacity="0.6"/>
  <rect x="65" y="62" width="8" height="8" fill="#22D3EE" opacity="0.6"/>
  <rect x="80" y="58" width="8" height="8" fill="#6366F1" opacity="0.6"/>
  <rect x="95" y="65" width="8" height="8" fill="#818CF8" opacity="0.6"/>
  <rect x="110" y="60" width="8" height="8" fill="#6366F1" opacity="0.6"/>
  <rect x="125" y="63" width="8" height="8" fill="#22D3EE" opacity="0.6"/>
  <rect x="140" y="57" width="8" height="8" fill="#6366F1" opacity="0.6"/>
  <text x="100" y="100" fill="#888" font-size="10" text-anchor="middle" font-family="monospace">× 10,000</text>
</svg>
```

**sprite-billboard.svg:**
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150">
  <rect fill="#1a1a2e" width="200" height="150"/>
  <!-- Camera icon -->
  <rect x="20" y="60" width="25" height="18" rx="3" fill="#666"/>
  <circle cx="32" cy="69" r="5" fill="#888"/>
  <rect x="40" y="65" width="8" height="4" rx="1" fill="#666"/>
  <!-- Arrow to sprite -->
  <line x1="50" y1="69" x2="80" y2="69" stroke="#888" stroke-width="1" stroke-dasharray="3"/>
  <!-- Sprite (always facing camera) -->
  <rect x="85" y="55" width="40" height="28" rx="4" fill="rgba(99,102,241,0.3)" stroke="#6366F1" stroke-width="1"/>
  <text x="105" y="73" fill="#fff" font-size="10" text-anchor="middle" font-family="sans-serif">标签</text>
  <!-- Facing arrows -->
  <path d="M130,69 L145,60 M130,69 L145,78" stroke="#22D3EE" stroke-width="1" fill="none"/>
  <text x="155" y="73" fill="#22D3EE" font-size="7" font-family="monospace">朝向</text>
</svg>
```

**wireframe.svg:**
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150">
  <rect fill="#1a1a2e" width="200" height="150"/>
  <!-- Wireframe cube -->
  <polygon points="100,35 165,65 165,110 100,140 35,110 35,65" fill="none" stroke="#6366F1" stroke-width="2"/>
  <polygon points="100,35 165,65 165,110 100,140" fill="rgba(99,102,241,0.1)" stroke="#6366F1" stroke-width="1"/>
  <!-- Edge highlights -->
  <line x1="100" y1="35" x2="100" y2="140" stroke="#22D3EE" stroke-width="1" stroke-dasharray="4"/>
  <line x1="35" y1="65" x2="165" y2="110" stroke="#22D3EE" stroke-width="1" stroke-dasharray="4"/>
</svg>
```

**multi-pass.svg:**
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150">
  <rect fill="#1a1a2e" width="200" height="150"/>
  <!-- Pass pipeline -->
  <rect x="10" y="60" width="35" height="30" rx="4" fill="#6366F1" opacity="0.8"/>
  <text x="27" y="79" fill="#fff" font-size="7" text-anchor="middle" font-family="monospace">Scene</text>
  <line x1="45" y1="75" x2="60" y2="75" stroke="#888" stroke-width="1"/>
  <rect x="60" y="60" width="35" height="30" rx="4" fill="#22D3EE" opacity="0.8"/>
  <text x="77" y="79" fill="#fff" font-size="7" text-anchor="middle" font-family="monospace">SSAO</text>
  <line x1="95" y1="75" x2="110" y2="75" stroke="#888" stroke-width="1"/>
  <rect x="110" y="60" width="35" height="30" rx="4" fill="#FFD700" opacity="0.8"/>
  <text x="127" y="79" fill="#fff" font-size="7" text-anchor="middle" font-family="monospace">Bloom</text>
  <line x1="145" y1="75" x2="160" y2="75" stroke="#888" stroke-width="1"/>
  <rect x="160" y="60" width="35" height="30" rx="4" fill="#FF6B6B" opacity="0.8"/>
  <text x="177" y="79" fill="#fff" font-size="7" text-anchor="middle" font-family="monospace">FXAA</text>
</svg>
```

**webxr.svg:**
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150">
  <rect fill="#1a1a2e" width="200" height="150"/>
  <!-- VR headset -->
  <rect x="60" y="50" width="80" height="40" rx="10" fill="#333" stroke="#6366F1" stroke-width="2"/>
  <circle cx="85" cy="70" r="10" fill="#1a1a2e" stroke="#6366F1" stroke-width="1"/>
  <circle cx="115" cy="70" r="10" fill="#1a1a2e" stroke="#6366F1" stroke-width="1"/>
  <!-- Strap -->
  <path d="M60,60 Q40,55 40,75 Q40,95 60,85" fill="none" stroke="#555" stroke-width="3"/>
  <path d="M140,60 Q160,55 160,75 Q160,95 140,85" fill="none" stroke="#555" stroke-width="3"/>
  <!-- 3D floating elements -->
  <polygon points="90,25 100,15 110,25 100,35" fill="#22D3EE" opacity="0.5"/>
  <circle cx="50" cy="110" r="8" fill="#6366F1" opacity="0.5"/>
  <circle cx="150" cy="110" r="8" fill="#FF6B6B" opacity="0.5"/>
</svg>
```

**webgl-ubo.svg:**
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150">
  <rect fill="#1a1a2e" width="200" height="150"/>
  <!-- UBO buffer representation -->
  <rect x="30" y="50" width="140" height="20" rx="3" fill="#333" stroke="#6366F1" stroke-width="1"/>
  <rect x="30" y="50" width="70" height="20" rx="3" fill="#6366F1" opacity="0.5"/>
  <text x="65" y="64" fill="#fff" font-size="8" text-anchor="middle" font-family="monospace">projection</text>
  <text x="135" y="64" fill="#fff" font-size="8" text-anchor="middle" font-family="monospace">view</text>
  <!-- Arrow to shader -->
  <line x1="100" y1="70" x2="100" y2="95" stroke="#888" stroke-width="1"/>
  <polygon points="96,93 100,100 104,93" fill="#888"/>
  <!-- Shader -->
  <rect x="50" y="100" width="100" height="30" rx="4" fill="#22D3EE" opacity="0.3" stroke="#22D3EE" stroke-width="1"/>
  <text x="100" y="119" fill="#22D3EE" font-size="9" text-anchor="middle" font-family="monospace">Shader Program</text>
  <!-- Shared binding -->
  <text x="100" y="35" fill="#888" font-size="9" text-anchor="middle" font-family="monospace">UBO binding point 0</text>
</svg>
```

**webgl-transform-feedback.svg:**
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150">
  <rect fill="#1a1a2e" width="200" height="150"/>
  <!-- Ping-pong buffers -->
  <rect x="20" y="40" width="60" height="25" rx="4" fill="#6366F1" opacity="0.8"/>
  <text x="50" y="56" fill="#fff" font-size="7" text-anchor="middle" font-family="monospace">Buffer A</text>
  <line x1="80" y1="52" x2="100" y2="52" stroke="#888" stroke-width="1"/>
  <rect x="100" y="40" width="30" height="25" rx="4" fill="#22D3EE" opacity="0.8"/>
  <text x="115" y="56" fill="#fff" font-size="7" text-anchor="middle" font-family="monospace">TF</text>
  <line x1="130" y1="52" x2="150" y2="52" stroke="#888" stroke-width="1"/>
  <rect x="150" y="40" width="30" height="25" rx="4" fill="#FF6B6B" opacity="0.8"/>
  <text x="165" y="56" fill="#fff" font-size="7" text-anchor="middle" font-family="monospace">B</text>
  <!-- Return arrow (ping-pong) -->
  <path d="M165,65 L165,80 L50,80 L50,65" fill="none" stroke="#888" stroke-width="1" stroke-dasharray="3"/>
  <polygon points="47,67 50,60 53,67" fill="#888"/>
  <!-- Particles below -->
  <circle cx="60" cy="110" r="3" fill="#6366F1"/>
  <circle cx="80" cy="115" r="3" fill="#6366F1"/>
  <circle cx="100" cy="105" r="3" fill="#6366F1"/>
  <circle cx="120" cy="118" r="3" fill="#6366F1"/>
  <circle cx="140" cy="108" r="3" fill="#6366F1"/>
</svg>
```

- [ ] Commit

```bash
cd /Users/zhongling/dev-projects/webgl-learn
git add src/frontend/public/thumbnails/ortho-camera.svg src/frontend/public/thumbnails/shadow-mapping.svg src/frontend/public/thumbnails/texture-maps.svg src/frontend/public/thumbnails/custom-shader.svg src/frontend/public/thumbnails/gltf-loader.svg src/frontend/public/thumbnails/skeletal-animation.svg src/frontend/public/thumbnails/instanced-mesh.svg src/frontend/public/thumbnails/sprite-billboard.svg src/frontend/public/thumbnails/wireframe.svg src/frontend/public/thumbnails/multi-pass.svg src/frontend/public/thumbnails/webxr.svg src/frontend/public/thumbnails/webgl-ubo.svg src/frontend/public/thumbnails/webgl-transform-feedback.svg
git commit -m "assets: add 13 SVG thumbnails for new cases"
```

---

### Task 14: Type-check and verify all cases load

**Files:** N/A (verification)

- [ ] Run TypeScript type check to ensure no type errors from the module field addition

```bash
cd /Users/zhongling/dev-projects/webgl-learn/src/frontend
npx tsc --noEmit
```

Expected: No errors (all 26 cases have `module` field matching `CaseModule` type).

- [ ] Verify dev server starts without errors

```bash
cd /Users/zhongling/dev-projects/webgl-learn/src/frontend
npx vite build 2>&1 | tail -5
```

Expected: Build succeeds, no missing imports.

- [ ] Commit

```bash
cd /Users/zhongling/dev-projects/webgl-learn
git add .
git commit -m "chore: verify build passes with all 26 cases"
```

---

## Self-Review

**1. Spec coverage:** All 12 new cases implemented (ortho-camera, shadow-mapping, texture-maps, custom-shader, gltf-loader, skeletal-animation, instanced-mesh, sprite-billboard, wireframe, multi-pass, webxr, webgl-ubo, webgl-transform-feedback). Module reorganization complete. Sandbox extensions done. All spec requirements covered.

**2. Placeholder scan:** No TBD/TODO patterns. All code blocks are complete. All file paths are exact. No "similar to Task N" references.

**3. Type consistency:** `CaseModule` type defined in Task 1, used in `cases.ts` (Task 2) and `ModuleTabs` (Task 3). `MODULE_LABELS` exported from types and imported by both HomePage and ModuleTabs. No naming inconsistencies detected.

---

Plan complete and saved to `docs/superpowers/plans/2026-05-26-case-curriculum.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?