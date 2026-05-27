# WebGL/Three.js 在线学习系统 — 技术架构文档

> **版本：** v1.0  
> **日期：** 2026-05-26  
> **作者：** 小智同学（架构师）  
> **状态：** 终稿  
> **关联文档：** [PRD.md](./PRD.md)

---

## 目录

1. [技术选型](#1-技术选型)
2. [完整目录结构](#2-完整目录结构)
3. [组件树设计](#3-组件树设计)
4. [数据流设计](#4-数据流设计)
5. [路由设计](#5-路由设计)
6. [关键设计决策](#6-关键设计决策)
7. [代码沙箱方案详细说明](#7-代码沙箱方案详细说明)
8. [构建与部署](#8-构建与部署)
9. [性能优化策略](#9-性能优化策略)
10. [附录：模块接口约定](#10-附录模块接口约定)

---

## 1. 技术选型

### 1.1 核心技术栈一览

| 层面 | 选型 | 版本 | 角色 |
|------|------|------|------|
| 前端框架 | React | 18.x | UI 构建与状态管理 |
| 类型系统 | TypeScript | 5.x | 类型安全，IDE 智能提示 |
| 构建工具 | Vite | 5.x / 6.x | 开发服务器 + 生产构建 |
| 路由 | react-router-dom (HashRouter) | 6.x | 客户端路由 |
| 3D 渲染引擎 | Three.js | ≥ r160（CDN） | 3D 场景渲染 |
| 相机控制 | OrbitControls | Three.js addon（CDN） | 旋转/缩放/平移 |
| 代码编辑器 | Monaco Editor | latest（`@monaco-editor/react`） | 在线代码编辑 |
| 代码沙箱 | iframe + sandbox + postMessage | 浏览器原生 API | 隔离执行用户代码 |
| 样式方案 | Tailwind CSS | 3.x | 原子化 CSS |
| 代码规范 | ESLint + Prettier | latest | 代码质量控制 |

### 1.2 每项技术选型理由

#### React 18 + TypeScript

- **React 18**：函数组件 + Hooks 模式成熟，社区生态最大，`@monaco-editor/react` 和 Three.js 的 React 封装（`@react-three/fiber` 或原生集成）均有良好支持
- **TypeScript**：案例元数据、组件 Props、沙箱通信协议等均有复杂类型结构，类型系统减少运行时错误；Monaco Editor 本身对 TS 有原生支持，模板代码也可写类型声明
- **不选 Vue 3 / Svelte**：Monaco Editor 的 React 封装最成熟（`@monaco-editor/react` 是官方推荐），Three.js 社区 React 方案最丰富

#### Vite

- 开发服务器基于原生 ESM，启动 < 1s，HMR < 100ms
- 生产构建基于 Rollup，产物优化好
- TypeScript 原生支持（esbuild 编译），无需额外配置
- **不选 Webpack**：配置复杂，启动慢，对 ESM 支持不如 Vite

#### Three.js（CDN 引入）

- **为何选 CDN 而非 npm？** 见 [6.3 Three.js 引入方式](#63-threejs-引入方式-cdn-importmap-方案)
- 主页面和沙箱页面统一通过 CDN importmap 引入，避免重复打包
- 版本固定（如 `r160`），保证稳定性

#### Monaco Editor

- VS Code 内核，功能最完善（语法高亮、智能提示、错误标记、代码折叠）
- `@monaco-editor/react` 封装好 React 生命周期，支持 lazy load
- 配合 Vite 的 `vite-plugin-monaco-editor` 插件做 worker 分包
- **不选 CodeMirror 6**：功能完整度不及 Monaco（特别是错误行高亮和 diff 展示），但保留作为轻量降级方案

#### iframe + sandbox + postMessage

- 浏览器原生 API，零依赖，安全边界最清晰
- `sandbox="allow-scripts"` 完全隔离 DOM 访问，天然防御 XSS
- postMessage 实现主页面 ↔ 沙箱的双向通信
- 详细方案见 [第 7 章](#7-代码沙箱方案详细说明)

#### Tailwind CSS

- 原子化 CSS，避免样式冲突，组件样式内聚
- 配合 `@apply` 可抽取公共样式
- 响应式断点内置（`md:`、`lg:` 等），直接映射 PRD 断点需求
- **不选 CSS Modules / Styled Components**：原子化方案对小型项目更轻量，无需额外运行时

---

## 2. 完整目录结构

```
webgl-learn/
├── index.html                     # 入口 HTML（importmap 声明）
├── sandbox.html                   # 沙箱 iframe 页面
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── .eslintrc.cjs
├── .prettierrc
│
├── public/
│   ├── favicon.ico
│   └── thumbnails/                # 案例缩略图（静态资源）
│       ├── basic-cube.png
│       ├── colorful-spheres.png
│       ├── orbit-earth.png
│       ├── wave-flag.png
│       ├── particle-galaxy.png
│       ├── pbr-sphere.png
│       ├── raycaster-pick.png
│       └── postprocessing.png
│
├── src/
│   ├── main.tsx                   # 应用入口
│   ├── App.tsx                    # 根组件（路由容器）
│   ├── index.css                  # Tailwind 指令 + 全局样式
│   │
│   ├── router/
│   │   └── index.tsx              # 路由配置（HashRouter）
│   │
│   ├── pages/
│   │   ├── HomePage.tsx           # 首页
│   │   └── DetailPage.tsx         # 详情页
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx         # 顶部导航栏
│   │   │   ├── Layout.tsx         # 页面布局容器
│   │   │   └── WebGLFallback.tsx  # WebGL 不支持时的降级提示
│   │   │
│   │   ├── home/
│   │   │   ├── CaseCard.tsx       # 案例卡片
│   │   │   ├── CaseCardGrid.tsx   # 卡片网格容器
│   │   │   ├── CategoryTabs.tsx   # 分类 Tab（全部/初级/高级）
│   │   │   ├── SearchBar.tsx      # 搜索框
│   │   │   └── EmptyState.tsx     # 空状态提示
│   │   │
│   │   └── detail/
│   │       ├── RenderPanel.tsx    # 3D 渲染画布容器（管理 iframe）
│   │       ├── CodeEditor.tsx     # Monaco Editor 封装
│   │       ├── EditorToolbar.tsx  # 编辑器工具栏（运行/重置按钮）
│   │       ├── ErrorDisplay.tsx   # 错误信息展示面板
│   │       └── LoadingPlaceholder.tsx  # 加载占位
│   │
│   ├── sandbox/
│   │   ├── sandbox-entry.ts       # 沙箱入口（挂载到 sandbox.html）
│   │   ├── sandbox-runtime.ts     # 沙箱运行时：接收代码 → 执行 → 回传结果
│   │   └── sandbox-preload.ts     # 预加载 Three.js 等依赖
│   │
│   ├── examples/                  # 案例模板代码
│   │   ├── index.ts               # 案例注册表（元数据 + 模板引用）
│   │   ├── types.ts               # 案例类型定义
│   │   ├── basic-cube/
│   │   │   └── template.js        # 旋转立方体模板
│   │   ├── colorful-spheres/
│   │   │   └── template.js
│   │   ├── orbit-earth/
│   │   │   └── template.js
│   │   ├── wave-flag/
│   │   │   └── template.js
│   │   ├── particle-galaxy/
│   │   │   └── template.js
│   │   ├── pbr-sphere/
│   │   │   └── template.js
│   │   ├── raycaster-pick/
│   │   │   └── template.js
│   │   └── postprocessing/
│   │       └── template.js
│   │
│   ├── hooks/
│   │   ├── useWebGLSupport.ts     # WebGL 可用性检测
│   │   ├── useSandbox.ts          # 沙箱通信 hook（postMessage 收发）
│   │   ├── useDebounce.ts         # 防抖 hook（搜索用）
│   │   └── useMediaQuery.ts       # 响应式断点 hook
│   │
│   ├── types/
│   │   ├── case.ts                # 案例类型定义（CaseMeta, CaseLevel）
│   │   └── sandbox.ts             # 沙箱通信协议类型
│   │
│   ├── utils/
│   │   ├── webgl-detect.ts        # WebGL 兼容性检测
│   │   ├── code-template.ts       # 模板代码加载与包装（importmap → iframe）
│   │   └── highlight-text.ts      # 搜索结果高亮工具
│   │
│   └── constants/
│       └── index.ts               # 全局常量（断点值、CDN 地址等）
│
└── docs/
    ├── PRD.md
    └── ARCHITECTURE.md            # 本文档
```

---

## 3. 组件树设计

### 3.1 整体组件树

```
<App>                                    # HashRouter 容器
├── <Layout>                             # 全局布局（Header + 内容区）
│   └── <Header />                       # Logo + 导航
│
├── Route "/"
│   └── <HomePage>
│       ├── <SearchBar />                # 搜索输入框
│       ├── <CategoryTabs />             # 全部/初级/高级 Tab
│       ├── <CaseCardGrid>               # 卡片网格容器
│       │   └── <CaseCard /> × N         # 案例卡片 × N（按筛选 + 搜索过滤）
│       └── <EmptyState />               # 无结果时展示
│
├── Route "/detail/:id"
│   └── <DetailPage>
│       ├── <RenderPanel>                # 左侧：3D 渲染区域
│       │   ├── <iframe />               # sandbox.html 沙箱
│       │   ├── <LoadingPlaceholder />   # 初始加载态
│       │   └── <ErrorDisplay />         # 运行错误态
│       ├── <EditorToolbar />            # 运行 + 重置按钮
│       └── <CodeEditor />               # 右侧：Monaco Editor
│
└── <WebGLFallback />                    # WebGL 不支持时全局拦截
```

### 3.2 每个组件职责详情

| 组件 | 职责 | 关键 Props | 内部状态 | 依赖 |
|------|------|-----------|----------|------|
| **App** | 路由容器，WebGL 检测 | — | webglSupported: boolean | useWebGLSupport |
| **Layout** | 全局布局壳（max-width 居中） | children | — | — |
| **Header** | 品牌展示 + 首页返回链接 | — | — | react-router Link |
| **HomePage** | 首页编排：管理过滤状态、搜索词、案例列表 | — | activeTab, searchQuery | useDebounce, examples/index |
| **SearchBar** | 受控搜索输入框，emit onChange | value, onChange, onClear | — | — |
| **CategoryTabs** | Tab 切换 UI，emit onTabChange | activeTab, tabs, onChange | — | — |
| **CaseCardGrid** | 卡片网格布局（响应式列数） | cases: CaseMeta[] | — | — |
| **CaseCard** | 单张卡片：缩略图、标题、描述、难度标签 | case: CaseMeta, onClick | hover 状态 | react-router useNavigate |
| **EmptyState** | 空搜索结果占位图 + 文案 | message?: string | — | — |
| **DetailPage** | 详情页编排：管理沙箱通信、代码运行状态 | — | code, isRunning, error | useSandbox, examples/index, useParams |
| **RenderPanel** | iframe 生命周期管理 + 错误渲染 | sandboxUrl, onReady | isLoading, hasError | — |
| **CodeEditor** | Monaco Editor 封装，暴露 value/onChange | value, onChange, language, readOnly | monaco 实例 | @monaco-editor/react |
| **EditorToolbar** | 运行/重置按钮 + 快捷键监听 | onRun, onReset, isRunning | — | — |
| **ErrorDisplay** | 渲染错误信息（错误类型 + 消息 + 行号） | error: SandboxError | — | — |
| **LoadingPlaceholder** | 骨架屏 / spinner 占位 | — | — | — |
| **WebGLFallback** | WebGL 不支持全屏降级提示 | — | — | — |

---

## 4. 数据流设计

### 4.1 案例数据模型

```typescript
// src/examples/types.ts

/** 案例难度等级 */
type CaseLevel = 'beginner' | 'advanced';

/** 案例元数据 */
interface CaseMeta {
  /** 唯一标识，也用作路由 param */
  id: string;
  /** 案例标题（≤ 20 字） */
  title: string;
  /** 简短描述（≤ 60 字） */
  description: string;
  /** 难度等级 */
  level: CaseLevel;
  /** 缩略图路径（相对于 public/） */
  thumbnail: string;
  /** 模板代码文件路径（相对于 src/examples/） */
  templatePath: string;
  /** 核心知识点标签 */
  tags: string[];
}

/** 案例完整数据（元数据 + 代码内容） */
interface CaseData extends CaseMeta {
  /** 模板代码原始文本 */
  templateCode: string;
}
```

### 4.2 案例注册表

```typescript
// src/examples/index.ts

import { CaseMeta } from './types';

/**
 * 所有案例的元数据集中定义。
 * 新增案例只需：1) 添加模板文件  2) 在此注册
 */
const CASES: CaseMeta[] = [
  {
    id: 'basic-cube',
    title: '旋转的立方体',
    description: '创建第一个 3D 场景：一个旋转的彩色立方体',
    level: 'beginner',
    thumbnail: '/thumbnails/basic-cube.png',
    templatePath: 'basic-cube/template.js',
    tags: ['Mesh', 'BoxGeometry', 'MeshStandardMaterial'],
  },
  {
    id: 'colorful-spheres',
    title: '彩色球体阵列',
    description: '多个不同颜色和位置的球体，学习材质与光照',
    level: 'beginner',
    thumbnail: '/thumbnails/colorful-spheres.png',
    templatePath: 'colorful-spheres/template.js',
    tags: ['SphereGeometry', 'MeshPhongMaterial', 'PointLight'],
  },
  // ... 其余 6 个案例
];

/** 按 ID 获取案例元数据 */
export function getCaseById(id: string): CaseMeta | undefined;
/** 获取所有案例（可指定 level 筛选） */
export function getCases(level?: CaseLevel): CaseMeta[];
/** 搜索案例（标题 + 描述模糊匹配） */
export function searchCases(query: string): CaseMeta[];
/** 加载模板代码（动态 import 或 fetch） */
export function loadTemplateCode(meta: CaseMeta): Promise<string>;
```

### 4.3 数据流图

```
┌──────────────────────────────────────────────────────────────────────┐
│                        数据流全景                                      │
│                                                                      │
│  src/examples/index.ts                                              │
│  ┌──────────────────────┐                                            │
│  │  CASES 元数据数组      │───静态导入──→  HomePage                    │
│  │  (CaseMeta[])         │                  │                        │
│  └──────────────────────┘                  │ 筛选 + 搜索              │
│                                            ▼                        │
│  src/examples/*/template.js           CaseCardGrid                  │
│  ┌──────────────────────┐            │ 过滤后的 CaseMeta[]           │
│  │  模板代码 .js 文件     │            ▼                            │
│  └──────────┬───────────┘         CaseCard[] × N                    │
│             │                         │ 用户点击                    │
│             │ 动态 import()            ▼                            │
│             │                    navigate(`/detail/${id}`)          │
│             ▼                                                       │
│        DetailPage                                                   │
│        ┌─────────────────────────────────────────────┐              │
│        │  1. useParams() 获取 id                      │              │
│        │  2. getCaseById(id) → 获取元数据              │              │
│        │  3. loadTemplateCode(meta) → 获取模板代码     │              │
│        │  4. 模板代码 → CodeEditor (value)             │              │
│        │  5. 用户编辑 → onChange → 更新本地 code 状态   │              │
│        │  6. 点击运行 → useSandbox.runCode(code)       │              │
│        │                    │                          │              │
│        │                    ▼                          │              │
│        │      postMessage ──────────────────┐         │              │
│        │                                    │         │              │
│        └────────────────────────────────────┼─────────┘              │
│                                              │                       │
│  sandbox.html (iframe)                       │                       │
│  ┌──────────────────────────────────────────▼──────────┐            │
│  │  sandbox-runtime.ts                                  │            │
│  │  1. 接收代码字符串                                    │            │
│  │  2. 包装为可执行模块（importmap + THREE 映射）         │            │
│  │  3. 执行代码（try/catch + 超时保护）                   │            │
│  │  4. 渲染到沙箱内 <canvas>                             │            │
│  │  5. 结果/错误 → postMessage 回主页面                  │            │
│  └──────────────────────────────────────────────────────┘            │
└──────────────────────────────────────────────────────────────────────┘
```

### 4.4 案例模板代码格式约定

每份模板代码是一个标准的 ES 模块，遵循固定接口：

```javascript
// src/examples/basic-cube/template.js

// 依赖通过 importmap 注入，无需显式声明
// 沙箱运行时已预设 importmap: { "three": "https://unpkg.com/three@0.160.0/build/three.module.js" }

import * as THREE from 'three';

/**
 * 必须导出的场景构建函数
 * 沙箱调用此函数并传入 renderer.domElement 的容器信息
 * 函数需返回一个包含 animate 方法的对象，由沙箱驱动渲染循环
 */
export function createScene({ canvas, width, height }) {
  // === 场景初始化 ===
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(width, height);

  // === 案例核心逻辑 ===
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);

  camera.position.z = 3;

  // === 动画循环 ===
  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  animate();

  // === 返回清理句柄（可选）===
  return {
    dispose() {
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
```

**设计要点：**

- 模板代码**不包含**非标准 API 调用（如 `document`、`localStorage`、`fetch`），安全合规
- 导出 `createScene` 函数，参数化 canvas 和尺寸，沙箱控制生命周期
- 返回 `dispose()` 用于清理 GPU 资源，防止内存泄漏
- 模板中不写 `importmap` 声明，由沙箱运行时统一注入

---

## 5. 路由设计

### 5.1 路由表

| 路径 | 页面组件 | 说明 |
|------|---------|------|
| `/#/` | HomePage | 首页，展示全部案例 |
| `/#/detail/:id` | DetailPage | 案例详情页，`:id` 对应 `CaseMeta.id` |

### 5.2 路由实现

```typescript
// src/router/index.tsx
import { HashRouter, Routes, Route } from 'react-router-dom';

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/detail/:id" element={<DetailPage />} />
        {/* 404 回退到首页 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
```

### 5.3 选型理由：Hash 路由 vs History 路由

| 对比维度 | Hash 路由 (`#/path`) | History 路由 (`/path`) |
|----------|---------------------|------------------------|
| 静态部署兼容性 | ✅ 零配置，任意静态服务器 | ❌ 需服务端配置 fallback |
| SEO | ❌ hash 不被爬虫索引 | ✅ 标准 URL |
| GitHub Pages | ✅ 开箱即用 | ❌ 需 404.html hack |
| 本项目适配 | ✅ 纯前端，无需 SEO | — |

**结论：选 Hash 路由。** 本项目为学习工具，无 SEO 需求；需要支持 GitHub Pages 等静态托管，Hash 路由零部署成本。

### 5.4 路由守卫

- **WebGL 支持检测**：App 根组件挂载时检测 WebGL 支持，不支持则全局展示 `<WebGLFallback />` 拦截所有路由
- **案例 ID 有效性**：DetailPage 中 `getCaseById(id)` 返回 undefined 时，重定向回首页并 toast 提示

---

## 6. 关键设计决策

### 6.1 代码编辑器：Monaco Editor 选型

**决策：使用 Monaco Editor，非 CodeMirror。**

**理由：**

1. **功能完整性**：Monaco 原生支持错误标记（`setModelMarkers`），可直接在编辑器内标注语法错误的红色波浪线 + 行号高亮，这正是 PRD AC7.3 的需求
2. **TypeScript 支持**：Monaco 对 TS/JS 的类型推断和智能提示优于 CodeMirror
3. **成熟度**：`@monaco-editor/react` 封装了完整的 React 生命周期，lazy load 成熟
4. **体积控制**：
   - Monaco Editor 本体 ~5MB，通过 Vite 的 `vite-plugin-monaco-editor` 将 workers 分包为独立 chunk
   - 采用 `React.lazy()` + `Suspense` 懒加载编辑器，首屏不阻塞
   - 方案详情见 [9.2 代码分割](#92-代码分割--懒加载)

### 6.2 加载方案

```typescript
// src/components/detail/CodeEditor.tsx（核心结构）

import React, { Suspense } from 'react';

// Monaco Editor 懒加载，首屏不下载
const MonacoEditor = React.lazy(() => import('@monaco-editor/react'));

export function CodeEditor({ value, onChange }: CodeEditorProps) {
  return (
    <Suspense fallback={<LoadingPlaceholder />}>
      <MonacoEditor
        height="100%"
        language="javascript"
        theme="vs-dark"
        value={value}
        onChange={(v) => onChange(v ?? '')}
        options={{
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          minimap: { enabled: false },      // 关闭 minimap 节省空间
          lineNumbers: 'on',
          automaticLayout: true,            // 自动跟随容器 resize
          wordWrap: 'on',
          tabSize: 2,
          scrollBeyondLastLine: false,
        }}
      />
    </Suspense>
  );
}
```

### 6.3 Three.js 引入方式：CDN importmap 方案

**决策：全站统一使用 `<script type="importmap">` 从 CDN 引入 Three.js，不通过 npm 打包。**

**importmap 声明：**

```html
<!-- index.html 和 sandbox.html 均包含 -->
<script type="importmap">
{
  "imports": {
    "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
    "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
  }
}
</script>
```

**理由：**

1. **构建产物体积**：Three.js 本体 ~600KB（min+gzip），不打包可减小产物 > 60%
2. **沙箱兼容**：沙箱 iframe 中也需要 Three.js，CDN importmap 让主页面和沙箱共享同一份浏览器缓存
3. **版本一致性**：主页面和沙箱 importmap 指向同一 CDN URL，天然保证版本一致
4. **模板代码语感**：用户代码写 `import * as THREE from 'three'` 是标准 ES 模块写法，学习价值高
5. **缓存优势**：unpkg/jsdelivr CDN 全球节点，用户首次访问后浏览器缓存，后续页面秒开
6. **不选 npm 打包的原因**：
   - 打包进 bundle 会导致产物膨胀
   - 沙箱 iframe 无法共享主页面打包后的 Three.js 实例（跨域隔离）
   - 需要额外配置 external，增加复杂度

### 6.4 代码沙箱：iframe sandbox 方案

**决策：使用 `<iframe sandbox="allow-scripts">` + `postMessage`，非 Web Worker。**

**理由：**

1. **渲染需求**：Three.js 需要 DOM 访问（`<canvas>`），Web Worker 不能操作 DOM，无法满足
2. **安全隔离**：`sandbox="allow-scripts"` 禁止同源访问、表单提交、弹窗等危险行为，安全边界清晰
3. **错误隔离**：iframe 中代码崩溃不影响主页面，天然进程隔离
4. **资源清理**：通过替换 `iframe.src` 或 `iframe.remove()` 即可彻底销毁场景和渲染上下文
5. **postMessage 双工通信**：主页面发代码 → iframe，iframe 回传结果/错误 → 主页面，协议简单

**安全配置：**

```html
<iframe
  src="/sandbox.html"
  sandbox="allow-scripts"          <!-- 仅允许脚本执行 -->
  <!-- 明确不设置 allow-same-origin，防止越权访问主页 DOM/Cookie -->
  <!-- 明确不设置 allow-forms / allow-popups / allow-top-navigation -->
  title="代码沙箱"
/>
```

**完整沙箱方案见 [第 7 章](#7-代码沙箱方案详细说明)。**

### 6.5 样式方案：Tailwind CSS

**决策：使用 Tailwind CSS，非 CSS-in-JS / CSS Modules。**

**理由：**

1. **零运行时**：Tailwind 在构建时生成静态 CSS，无 JS 运行时开销
2. **响应式内置**：`sm:` / `md:` / `lg:` 断点直接映射 PRD 响应式需求
3. **主题一致性**：`tailwind.config.js` 集中管理颜色、间距、字体，深色主题全局统一
4. **协同友好**：原子类可读性好，团队成员无需理解复杂样式继承链

**Tailwind 配置关键项：**

```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 深色主题主色调
        surface: '#1a1a2e',    // 画布背景
        card: '#16213e',       // 卡片背景
        accent: '#0f3460',     // 强调色
        primary: '#e94560',    // 主按钮色
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
};
```

### 6.6 响应式断点

| 断点名称 | 宽度范围 | 首页布局 | 详情页布局 |
|----------|----------|---------|-----------|
| Desktop | ≥ 1024px | 3 列卡片 | 左右布局（45% / 55%） |
| Tablet | 768px – 1023px | 2 列卡片 | 左右布局（编辑器缩窄） |
| Mobile | < 768px | 1 列卡片 | 上下布局（画布 40vh + 编辑器） |

实现方式：Tailwind 响应式前缀（`lg:grid-cols-3`、`md:grid-cols-2`、`grid-cols-1`） + `useMediaQuery` hook 用于需要 JS 判断的场景（如 OrbitControls 触摸适配）。

---

## 7. 代码沙箱方案详细说明

### 7.1 架构概览

```
┌──── 主页面 (React App) ────┐          ┌─── sandbox.html (iframe) ───┐
│                              │          │                               │
│  DetailPage                  │          │  sandbox-entry.ts             │
│  ┌────────────────────────┐  │          │  ┌─────────────────────────┐  │
│  │ useSandbox() hook      │  │ postMsg  │  │ sandbox-runtime.ts      │  │
│  │ ┌────────────────────┐ │  │ ───────→ │  │ ┌─────────────────────┐ │  │
│  │ │ runCode(code)      │ │  │          │  │ │ handleExecute(payload)│ │  │
│  │ │ stopRun()          │ │  │          │  │ │  1. 包装代码          │ │  │
│  │ │ reset()            │ │  │          │  │ │  2. 注入 importmap    │ │  │
│  │ │ isRunning          │ │  │          │  │ │  3. 执行 + 超时保护   │ │  │
│  │ │ error              │ │  │          │  │ │  4. 结果回传          │ │  │
│  │ └────────────────────┘ │  │ ←─────── │  │ └─────────────────────┘ │  │
│  └────────────────────────┘  │ postMsg  │  └─────────────────────────┘  │
│                              │          │                               │
│  RenderPanel                 │          │  <canvas id="render-target">  │
│  ┌────────────────────────┐  │          │  ↑ Three.js 渲染到这里        │
│  │ <iframe src=sandbox /> │  │          │                               │
│  └────────────────────────┘  │          └───────────────────────────────┘
└──────────────────────────────┘
```

### 7.2 通信协议

```typescript
// src/types/sandbox.ts

/** ===== 主页面 → 沙箱 ===== */

type MainToSandboxMessage =
  | {
      type: 'EXECUTE_CODE';
      payload: {
        code: string;          // 用户代码字符串
        requestId: string;     // 请求 ID，用于回传匹配
        width: number;         // 画布宽度
        height: number;        // 画布高度
      };
    }
  | {
      type: 'STOP_EXECUTION';
      payload: { requestId: string };
    }
  | {
      type: 'RESIZE';
      payload: { width: number; height: number };
    };

/** ===== 沙箱 → 主页面 ===== */

type SandboxToMainMessage =
  | {
      type: 'EXECUTION_RESULT';
      payload: {
        requestId: string;
        success: true;
        fps?: number;         // 当前帧率（可选）
      };
    }
  | {
      type: 'EXECUTION_ERROR';
      payload: {
        requestId: string;
        success: false;
        error: {
          name: string;       // 错误类型：SyntaxError | ReferenceError | TypeError | TimeoutError | RuntimeError
          message: string;     // 错误消息
          line?: number;       // 错误行号（源码行号）
          column?: number;     // 错误列号
          stack?: string;      // 调用栈（可选，截断前 5 层）
        };
      };
    }
  | {
      type: 'SANDBOX_READY';
      payload: { timestamp: number };
    }
  | {
      type: 'RUNTIME_ERROR';   // 渲染循环中的异步错误
      payload: { message: string };
    };
```

### 7.3 沙箱运行时核心逻辑

```typescript
// src/sandbox/sandbox-runtime.ts（伪代码，描述核心逻辑）

let currentDispose: (() => void) | null = null;
let executionTimer: ReturnType<typeof setTimeout> | null = null;

/** 执行超时阈值（毫秒） */
const EXECUTION_TIMEOUT = 5000;
/** 循环检测阈值（指令数近似保护） */
const INFINITE_LOOP_GUARD = true;

async function handleExecute(code: string, requestId: string, width: number, height: number) {
  // 1. 清理上一次执行
  disposePrevious();

  // 2. 注入超时保护
  const timeoutPromise = new Promise((_, reject) => {
    executionTimer = setTimeout(() => {
      reject(new Error('TIMEOUT: 代码执行超过 5 秒'));
    }, EXECUTION_TIMEOUT);
  });

  // 3. 获取 canvas
  const canvas = document.getElementById('render-target') as HTMLCanvasElement;
  if (!canvas) {
    postError(requestId, 'Canvas 元素未找到');
    return;
  }

  try {
    // 4. 包装用户代码为可执行函数
    //    将用户代码注入到一个闭包中，通过 importmap 解析 'three' 依赖
    const wrappedCode = `
      ${code}
      // 自动调用 createScene 并启动渲染
      if (typeof createScene === 'function') {
        const result = createScene({
          canvas: document.getElementById('render-target'),
          width: ${width},
          height: ${height}
        });
        window.__currentDispose = result?.dispose ?? null;
      } else {
        throw new Error('代码中缺少 createScene 导出函数');
      }
    `;

    // 5. 创建 Blob URL 动态加载（绕过 eval，保持模块上下文）
    //    注意：sandbox="allow-scripts" 允许 Blob URL 创建
    const blob = new Blob([wrappedCode], { type: 'application/javascript' });
    const blobUrl = URL.createObjectURL(blob);

    // 6. 使用 race 模式：用户代码 vs 超时
    await Promise.race([
      import(/* @vite-ignore */ blobUrl),
      timeoutPromise,
    ]);

    // 7. 成功回传
    URL.revokeObjectURL(blobUrl);
    if (executionTimer) clearTimeout(executionTimer);
    postResult(requestId);

  } catch (err) {
    // 8. 错误处理
    if (executionTimer) clearTimeout(executionTimer);
    const error = normalizeError(err, code);
    postError(requestId, error);
  }
}

function disposePrevious() {
  if (currentDispose) {
    try { currentDispose(); } catch { /* 忽略清理错误 */ }
    currentDispose = null;
  }
  if (executionTimer) {
    clearTimeout(executionTimer);
    executionTimer = null;
  }
  // 清理 canvas 上下文
  const canvas = document.getElementById('render-target') as HTMLCanvasElement;
  if (canvas) {
    const ctx = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (ctx) {
      const ext = ctx.getExtension('WEBGL_lose_context');
      ext?.loseContext();
    }
  }
}

/** 错误信息标准化 */
function normalizeError(err: unknown, sourceCode: string) {
  const message = err instanceof Error ? err.message : String(err);
  const name = err instanceof Error ? err.name : 'Error';

  // 从错误栈中提取行号（需映射回原始源码行号）
  const stack = err instanceof Error ? err.stack : '';
  let line: number | undefined;
  const match = stack.match(/:([0-9]+):[0-9]+/);
  if (match) {
    // Blob URL 行号需要减去包装代码的行数偏移
    line = Math.max(1, parseInt(match[1], 10) - 8); // 8 为包装代码行数
  }

  return { name, message, line, stack };
}
```

### 7.4 安全边界清单

| 安全措施 | 实现方式 | 覆盖风险 |
|----------|----------|----------|
| DOM 隔离 | `sandbox="allow-scripts"`（不含 `allow-same-origin`） | 防止访问主页面 DOM、Cookie、localStorage |
| 网络隔离 | sandbox 默认禁止 `fetch`/`XMLHttpRequest` | 防止数据外泄 |
| 弹窗防护 | 不设置 `allow-popups` | 防止恶意弹窗 |
| 导航劫持 | 不设置 `allow-top-navigation` | 防止修改主页面 URL |
| 表单劫持 | 不设置 `allow-forms` | 防止伪造表单提交 |
| 执行超时 | `Promise.race()` + setTimeout 5s | 防止无限循环卡死 |
| 内存保护 | 跑新场景前 dispose 旧场景（geometry/material/texture/renderer） | 防止 GPU 内存泄漏 |
| 上下文恢复 | 监听 `webglcontextlost` 事件，丢失时通知主页面 | 设备休眠/GPU 崩溃恢复 |

### 7.5 错误处理流程

```
用户点击 [运行]
    │
    ├─→ 沙箱接收代码
    │     │
    │     ├─→ 语法错误 (SyntaxError)
    │     │     └─→ postError(requestId, { name: 'SyntaxError', message, line })
    │     │           ├─→ 主页面 ErrorDisplay 展示错误
    │     │           └─→ Monaco Editor setModelMarkers 标记错误行
    │     │
    │     ├─→ 运行时错误 (ReferenceError / TypeError)
    │     │     └─→ postError(...) 同上
    │     │
    │     ├─→ 超时 (TimeoutError)
    │     │     └─→ postError(requestId, { name: 'TimeoutError', message: '执行超时' })
    │     │           └─→ 主页面提示 + 建议检查循环逻辑
    │     │
    │     └─→ 成功
    │           └─→ postResult(requestId, { success: true, fps })
    │                 └─→ 主页面隐藏 loading，展示渲染结果
    │
    └─→ 连续点击 [运行]
          └─→ useSandbox 中维护 currentRequestId
                ├─→ 新请求到达时，发送 STOP_EXECUTION 到旧请求
                └─→ 忽略过期请求的回传（通过 requestId 匹配）
```

### 7.6 沙箱内 resize 处理

```typescript
// 主页面监听容器 resize → 通知沙箱调整渲染尺寸
window.addEventListener('resize', () => {
  const { width, height } = renderPanelRef.current.getBoundingClientRect();
  sandboxRef.current.contentWindow?.postMessage(
    { type: 'RESIZE', payload: { width, height } },
    '*' // sandbox 无同源，targetOrigin 用 *
  );
});
```

---

## 8. 构建与部署

### 8.1 Vite 配置关键项

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';

export default defineConfig({
  plugins: [
    react(),
    // Monaco Editor workers 分包为独立文件
    monacoEditorPlugin.default({
      languageWorkers: ['editorWorkerService', 'typescript', 'json'],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        sandbox: 'sandbox.html',   // 多页面构建
      },
      output: {
        manualChunks: {
          // Monaco 独立 chunk
          monaco: ['@monaco-editor/react'],
          // React 独立 chunk（利于缓存）
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
```

### 8.2 部署流程

```bash
# 1. 安装依赖
npm install

# 2. 开发模式（HMR）
npm run dev

# 3. 构建生产产物
npm run build
# 产物输出到 dist/

# 4. 本地预览
npm run preview

# 5. 部署到 GitHub Pages
# dist/ 目录下所有文件推送到 gh-pages 分支即可
```

### 8.3 importmap index.html 示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>WebGL/Three.js 在线学习</title>
  <!-- Three.js CDN importmap -->
  <script type="importmap">
  {
    "imports": {
      "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
      "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
    }
  }
  </script>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

---

## 9. 性能优化策略

### 9.1 首屏加载优化

| 优化点 | 策略 | 目标 |
|--------|------|------|
| Three.js CDN | 不打包，浏览器独立缓存 | 减少 bundle ~600KB |
| Monaco 懒加载 | `React.lazy()` + `Suspense` | 首页不加载编辑器 ~5MB |
| 缩略图优化 | WebP 格式 + 懒加载 (`loading="lazy"`) | 首屏图片延迟加载 |
| React 分包 | vendor chunk 独立缓存 | 更新业务代码不影响框架缓存 |
| 预连接 CDN | `<link rel="preconnect" href="https://unpkg.com">` | 减少 DNS/TLS 握手延迟 |

### 9.2 代码分割 & 懒加载

```typescript
// 首页不加载 Monaco Editor 和详情页组件
const DetailPage = React.lazy(() => import('./pages/DetailPage'));

// 路由中包裹 Suspense
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route
    path="/detail/:id"
    element={
      <Suspense fallback={<LoadingPlaceholder />}>
        <DetailPage />
      </Suspense>
    }
  />
</Routes>
```

### 9.3 渲染性能

- Three.js 渲染帧率控制在 60fps（`requestAnimationFrame` 自然限制）
- 沙箱支持 resize 时调整 `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` 防止高分屏过绘
- 页面不可见时（`document.hidden`）暂停 requestAnimationFrame，减少资源消耗

---

## 10. 附录：模块接口约定

### 10.1 `useSandbox` Hook 接口

```typescript
// src/hooks/useSandbox.ts

interface UseSandboxReturn {
  /** 沙箱 iframe ref（挂载到 <iframe> 元素） */
  iframeRef: React.RefObject<HTMLIFrameElement>;
  /** 沙箱是否就绪（sandbox.html 加载完成） */
  isReady: boolean;
  /** 当前是否正在执行 */
  isRunning: boolean;
  /** 最近一次错误信息 */
  error: SandboxError | null;
  /**
   * 运行代码
   * @returns requestId，用于追踪本次运行
   */
  runCode: (code: string) => string;
  /** 停止当前运行 */
  stopRun: () => void;
  /** 清除错误状态 */
  clearError: () => void;
}

function useSandbox(options?: { onResult?: () => void; onError?: (err: SandboxError) => void }): UseSandboxReturn;
```

### 10.2 案例元数据与代码加载

```typescript
// src/examples/index.ts

/** 获取所有案例 */
export function getCases(level?: CaseLevel): CaseMeta[];

/** 按 ID 获取单个案例 */
export function getCaseById(id: string): CaseMeta | undefined;

/** 搜索案例（模糊匹配标题 + 描述） */
export function searchCases(query: string, cases: CaseMeta[]): CaseMeta[];

/**
 * 加载模板代码（动态 import .js 文件）
 * Vite 编译时会将 template.js 作为模块处理
 */
export async function loadTemplateCode(meta: CaseMeta): Promise<string> {
  // 使用 Vite 的动态 import glob
  const modules = import.meta.glob('./*/template.js', {
    query: '?raw',          // 以原始文本导入
    import: 'default',
  });
  const key = `./${meta.templatePath}`;
  const code = await modules[key]();
  return code as string;
}
```

### 10.3 WebGL 检测

```typescript
// src/utils/webgl-detect.ts

export function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl2') || canvas.getContext('webgl')
    );
  } catch {
    return false;
  }
}
```

---

> **文档结束。** 本文档与 PRD.md 配套，为开发团队提供完整的技术方案参考。有任何疑问请通过项目仓库 Issue 或 PR 进行讨论。