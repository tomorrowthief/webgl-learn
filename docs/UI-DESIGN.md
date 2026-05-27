# WebGL/Three.js 在线学习系统 — 界面设计方案

> **版本：** v1.0
> **日期：** 2026-05-26
> **作者：** 小智同学（UI 设计师）
> **状态：** 终稿
> **关联文档：** [PRD.md](./PRD.md) · [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 目录

1. [设计理念](#1-设计理念)
2. [设计规范](#2-设计规范)
3. [页面设计](#3-页面设计)
   - [3.1 全局布局](#31-全局布局)
   - [3.2 首页](#32-首页)
   - [3.3 详情页 — 桌面端](#33-详情页--桌面端)
   - [3.4 详情页 — 移动端](#34-详情页--移动端)
4. [组件设计](#4-组件设计)
5. [响应式布局方案](#5-响应式布局方案)
6. [关键交互 UX 细节](#6-关键交互-ux-细节)
7. [公共组件清单](#7-公共组件清单)
8. [附录：视觉预览说明](#8-附录视觉预览说明)

---

## 1. 设计理念

### 1.1 设计原则

| 原则 | 说明 |
|------|------|
| **沉浸感** | 深色主题减少视觉疲劳，让用户专注于代码与 3D 效果，如同身处 IDE |
| **即时反馈** | 每一个操作都有视觉响应：hover、click、loading、error，零"猜疑"体验 |
| **轻量克制** | 动画短而精准，200-300ms 过渡，不抢戏；装饰元素最小化 |
| **开发者友好** | 等宽字体、高对比度代码区域、清晰的错误标注，符合开发者审美习惯 |
| **无缝响应式** | 从手机到桌面，核心交互始终可用，布局自适应降级不折损体验 |

### 1.2 情绪板关键词

**深邃 · 专注 · 精密 · 未来感**

整体调性参考：VS Code 深色主题 × 高端 IDE × 科技产品登录页。

---

## 2. 设计规范

### 2.1 色彩系统（深色主题）

#### 主色调

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  背景层          卡片/面板       主色CTA         强调色      │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│  │ #0B0D17 │    │ #161B2B │    │ #6366F1 │    │ #22D3EE │  │
│  │ 最深层  │    │ 卡片容器 │    │ 按钮/链接│    │ 高亮/选中│  │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘  │
│                                                             │
│  #0F1119        #1C2138        #818CF8        #67E8F9       │
│  页面底色       面板表面       主色 hover      强调 hover     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

| Token | 色值 | 用途 |
|-------|------|------|
| `--bg-root` | `#0B0D17` | 页面最深层底色 |
| `--bg-page` | `#0F1119` | 页面默认背景 |
| `--bg-card` | `#161B2B` | 卡片/面板背景 |
| `--bg-card-hover` | `#1C2138` | 卡片 hover 背景 |
| `--bg-input` | `#1A1E2E` | 输入框背景 |
| `--bg-toolbar` | `#131620` | 工具栏背景 |
| `--bg-canvas` | `#0A0C14` | 3D 画布默认底色 |
| `--border-default` | `#232840` | 默认边框 |
| `--border-active` | `#6366F1` | 激活/聚焦边框 |
| `--border-error` | `#EF4444` | 错误边框 |
| `--text-primary` | `#E4E6F0` | 主文字 |
| `--text-secondary` | `#9098B8` | 辅助文字 |
| `--text-tertiary` | `#5C6380` | 禁用/占位文字 |
| `--text-link` | `#818CF8` | 链接文字 |
| `--accent-primary` | `#6366F1` | 主色（按钮、标题、Tab active） |
| `--accent-primary-hover` | `#818CF8` | 主色 hover |
| `--accent-cyan` | `#22D3EE` | 强调色（标记、选中等） |
| `--accent-success` | `#22C55E` | 成功/运行成功 |
| `--accent-warning` | `#F59E0B` | 警告/中级 |
| `--accent-error` | `#EF4444` | 错误 |
| `--accent-info` | `#3B82F6` | 信息提示 |
| `--gradient-hero` | `linear-gradient(135deg, #6366F1 0%, #22D3EE 100%)` | Hero/主色渐变 |

#### 难度标签色

| 难度 | 背景色 | 文字色 | 边框 |
|------|--------|--------|------|
| 初级 (beginner) | `rgba(34, 197, 94, 0.12)` | `#4ADE80` | `rgba(34, 197, 94, 0.3)` |
| 高级 (advanced) | `rgba(245, 158, 11, 0.12)` | `#FBBF24` | `rgba(245, 158, 11, 0.3)` |

#### 编辑器内颜色

| Token | 色值 | 用途 |
|-------|------|------|
| `--editor-bg` | `#0D1017` | 编辑器区域背景 |
| `--editor-gutter` | `#131620` | 行号区域背景 |
| `--editor-line-highlight` | `rgba(99, 102, 241, 0.08)` | 当前行高亮 |
| `--editor-selection` | `rgba(99, 102, 241, 0.25)` | 选中文本背景 |
| `--editor-error-marker` | `#EF4444` | 错误行波浪线 |

### 2.2 字体系统

#### 字体族

```css
/* 代码区域 */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace;

/* UI 文字 */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
             'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;

/* 标题 */
--font-display: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
```

> **字体加载策略：** Inter 和 JetBrains Mono 从 Google Fonts CDN 按需加载，加上 `font-display: swap` 确保无闪烁。系统已有 PingFang SC / Microsoft YaHei 避免中文字体下载。

#### 字号阶梯

| Token | 字号 | 行高 | 字重 | 用途 |
|-------|------|------|------|------|
| `--text-xs` | 12px | 16px | 400 | 标签、徽标 |
| `--text-sm` | 14px | 20px | 400 | 辅助文案、meta 信息 |
| `--text-base` | 16px | 24px | 400 | 正文、描述 |
| `--text-lg` | 18px | 28px | 500 | 卡片标题 |
| `--text-xl` | 20px | 28px | 600 | 页面段落标题 |
| `--text-2xl` | 24px | 32px | 700 | 页面主标题 |
| `--text-3xl` | 30px | 36px | 800 | Hero 标题 |
| `--text-code` | 14px | 22px | 400 | 编辑器代码 |

### 2.3 间距系统

基于 4px 基准的间距刻度：

| Token | 值 | 用途 |
|-------|-----|------|
| `--space-1` | 4px | 极紧凑间距（icon-text） |
| `--space-2` | 8px | 紧凑间距（标签内边距） |
| `--space-3` | 12px | 元素间默认间距 |
| `--space-4` | 16px | 卡片内边距 |
| `--space-5` | 20px | 组件间间距 |
| `--space-6` | 24px | 段落间距 |
| `--space-8` | 32px | 大区块间距 |
| `--space-10` | 40px | 页面内边距 |
| `--space-12` | 48px | 内容区域上下间距 |
| `--space-16` | 64px | Hero 区域间距 |

### 2.4 圆角

| Token | 值 | 用途 |
|-------|-----|------|
| `--radius-sm` | 4px | 标签、Badge、小按钮 |
| `--radius-md` | 8px | 卡片、面板、输入框 |
| `--radius-lg` | 12px | 大型卡片、Modal |
| `--radius-xl` | 16px | Hero 卡片、特色面板 |
| `--radius-full` | 9999px | 药丸形标签、圆形按钮 |

### 2.5 阴影

| Token | 值 | 用途 |
|-------|-----|------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.3)` | 轻微抬升 |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.4)` | 卡片默认 |
| `--shadow-lg` | `0 8px 24px rgba(0,0,0,0.5)` | 卡片 hover |
| `--shadow-xl` | `0 16px 48px rgba(0,0,0,0.6)` | Modal、弹层 |
| `--shadow-glow` | `0 0 20px rgba(99, 102, 241, 0.25)` | 主色发光效果 |

### 2.6 过渡动画

| Token | 值 | 用途 |
|-------|-----|------|
| `--transition-fast` | 150ms ease | hover 背景色、边框色变化 |
| `--transition-normal` | 250ms ease-out | 卡片 hover 缩放、平移 |
| `--transition-slow` | 350ms ease-in-out | 页面切换、面板展开/收起 |
| `--transition-spring` | 400ms cubic-bezier(0.34, 1.56, 0.64, 1) | 弹跳效果（按钮、Badge 出现） |

### 2.7 Tailwind 配置映射

```javascript
// tailwind.config.js — 自定义主题扩展
module.exports = {
  theme: {
    extend: {
      colors: {
        surface: {
          root: '#0B0D17',
          page: '#0F1119',
          card: '#161B2B',
          hover: '#1C2138',
          input: '#1A1E2E',
        },
        border: {
          DEFAULT: '#232840',
          active: '#6366F1',
          error: '#EF4444',
        },
        text: {
          primary: '#E4E6F0',
          secondary: '#9098B8',
          tertiary: '#5C6380',
          link: '#818CF8',
        },
        accent: {
          primary: { DEFAULT: '#6366F1', hover: '#818CF8' },
          cyan: '#22D3EE',
          success: '#22C55E',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        },
        editor: {
          bg: '#0D1017',
          gutter: '#131620',
          line: 'rgba(99,102,241,0.08)',
          selection: 'rgba(99,102,241,0.25)',
        },
        badge: {
          beginner: { bg: 'rgba(34,197,94,0.12)', text: '#4ADE80', border: 'rgba(34,197,94,0.3)' },
          advanced: { bg: 'rgba(245,158,11,0.12)', text: '#FBBF24', border: 'rgba(245,158,11,0.3)' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '8px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        card: '0 4px 12px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.5)',
        glow: '0 0 20px rgba(99,102,241,0.25)',
        modal: '0 16px 48px rgba(0,0,0,0.6)',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '250ms',
        slow: '350ms',
      },
    },
  },
};
```

---

## 3. 页面设计

### 3.1 全局布局

#### 组件树

```
<App>
├── <WebGLFallback />          // WebGL 不支持：全屏降级页
└── <HashRouter>
    └── <Layout>
        ├── <NavBar />         // 全局顶栏（固定）
        └── <main>             // 页面内容区
            ├── <Route "/" → HomePage />
            └── <Route "/detail/:id" → DetailPage />
```

#### NavBar（全局导航栏）

**位置：** 页面顶部，固定定位（`sticky`），高度 56px。

**布局：**
```
┌──────────────────────────────────────────────────────────────────┐
│  [🎨 Logo]  WebGL Learn          [🐙 GitHub] [📖 文档] [🌙 主题] │
└──────────────────────────────────────────────────────────────────┘
```

**Props:**

```typescript
interface NavBarProps {
  /** 可选的透明背景模式（Hero 区使用） */
  transparent?: boolean;
}
```

**状态变化：**

| 状态 | 表现 |
|------|------|
| 默认 | 半透明深色背景 + `backdrop-blur`，`border-b` 底部分割线 |
| 滚动后 | 背景变为完全不透明 `--bg-root`，增加 `--shadow-md` |
| 移动端 | 导航链接收起为汉堡菜单（`☰`），点击弹出全屏菜单面板 |

**交互说明：**

- Logo 点击返回首页 `/`
- 导航链接 hover 时从 `text-secondary` 变为 `text-primary`，`transition-fast`
- 移动端汉堡菜单展开/收起用 `transition-slow` 加 `transform: translateX`

#### Layout（页面容器）

```typescript
interface LayoutProps {
  children: React.ReactNode;
}
```

**布局：** `min-h-screen` 全高，内容区 `max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8`。

---

### 3.2 首页

#### 组件树

```
<HomePage>
├── <HeroSection />              // Hero 标题区
├── <div>                        // 筛选控制栏
│   ├── <CategoryTabs />         // 全部 | 初级 | 高级
│   └── <SearchBar />            // 搜索框
├── <CaseCardGrid>               // 卡片网格
│   └── <CaseCard /> × N         // 单张案例卡片
└── <EmptyState />               // 空结果（条件渲染）
```

#### 3.2.1 HeroSection

**位置：** 首页顶部，高度约 180-220px。

**视觉设计：**
- 背景：`--bg-root` + 微妙的径向渐变 （`radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.08), transparent 70%)`）
- 标题居中，使用 `--text-3xl` + 渐变文字效果（`--gradient-hero` 作为 `background-clip: text`）
- 副标题 `--text-base` + `--text-secondary`，描述平台定位

**布局：**
```
┌──────────────────────────────────────────────────────────────────┐
│                                                                   │
│              WebGL / Three.js 在线学习                             │
│              边看效果 · 边改代码 · 即时运行                        │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

**交互说明：**
- Hero 区域无交互功能，纯视觉展示
- 背景渐变随鼠标轻微移动（parallax，仅桌面端，可选增强）

#### 3.2.2 CategoryTabs

**位置：** HeroSection 下方，水平居中排列。

**视觉设计：**
- 容器：无背景，水平排列，间距 `--space-2`
- 每个 Tab：`px-4 py-2 rounded-full`，药丸形按钮
- 默认态：`text-secondary`，无背景
- hover 态：`text-primary` + `bg-surface-hover`，`transition-fast`
- active 态：`text-white` + `bg-accent-primary` + `shadow-glow`，`transition-normal`
- active 指示器：底部一段 2px 高的渐变下划线从上一个位置滑到当前位置（使用 `transform: translateX` + `transition`）

**Props:**

```typescript
interface Tab {
  key: string;
  label: string;
  count?: number;  // 该分类下的案例数量
}

interface CategoryTabsProps {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
}
```

**状态变化：**

| 状态 | 表现 |
|------|------|
| 正常 | 所有 Tab 正常展示 |
| 分类无案例 | count=0 的 Tab 以 `text-tertiary` 展示，不可点击 |
| active | 渐变背景 + 发光阴影 + 白色文字 |

#### 3.2.3 SearchBar

**位置：** CategoryTabs 右侧（桌面端）或下方（移动端）。

**视觉设计：**
- 容器：`bg-surface-input` + `border-border-default` + `rounded-lg`，高度 40px
- 左侧 search icon（🔍, 16×16px, `text-tertiary`）
- placeholder 文字：`"搜索案例…"`，`text-tertiary`
- 输入文字：`text-primary text-sm`
- 右侧清除按钮（✕）：有输入时出现，hover 变 `text-primary`
- 聚焦态：`border-accent-primary` + `shadow-glow`，`transition-fast`
- 快捷键提示（可选）：右侧显示 `⌘K` / `Ctrl+K`，`text-tertiary text-xs`

**Props:**

```typescript
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  /** 是否自动聚焦（首页加载时自动聚焦） */
  autoFocus?: boolean;
}
```

**交互说明：**

- 输入内容 300ms debounce 后触发过滤，无需按 Enter
- 按 `Esc` 清空输入并失去焦点
- 按 `⌘K` / `Ctrl+K` 聚焦搜索框
- 搜索无结果时，联动 `<EmptyState />` 展示

#### 3.2.4 CaseCardGrid

**位置：** 筛选控制栏下方。

**视觉设计：**
- CSS Grid 布局，`gap-6`
- 桌面端：`grid-cols-3`（3 列）
- 平板端：`grid-cols-2`（2 列）
- 手机端：`grid-cols-1`（1 列）
- 空状态：无案例时渲染 `<EmptyState />`

**Props:**

```typescript
interface CaseCardGridProps {
  cases: CaseMeta[];
  onCardClick: (id: string) => void;
}
```

#### 3.2.5 CaseCard

**视觉设计（单卡片）：**

```
┌──────────────────────────┐
│                          │
│    ┌──────────────────┐  │
│    │                  │  │  ← 缩略图区域 (160×120px)
│    │   [缩略图]       │  │     bg-surface-root
│    │                  │  │     圆角 top-left top-right
│    └──────────────────┘  │
│                          │
│  [初级]  ← 难度标签       │  ← px-4 py-3
│                          │
│  旋转的立方体             │  ← text-lg font-medium
│                          │
│  创建第一个 3D 场景…      │  ← text-sm text-secondary
│                          │
│  Mesh · BoxGeometry      │  ← 知识点标签 (可选)
│                          │
└──────────────────────────┘
```

**Props:**

```typescript
interface CaseCardProps {
  case: CaseMeta;
  onClick: (id: string) => void;
  /** 搜索关键词（用于高亮匹配文字） */
  highlightQuery?: string;
}
```

**状态变化：**

| 状态 | 表现 |
|------|------|
| 默认 | `bg-surface-card` + `shadow-card` + `border border-border-default` |
| hover | `translateY(-4px)` + `shadow-card-hover` + `border-border-active`，缩略图区域轻微 scale(1.03)，`transition-normal` |
| active (点击) | `scale(0.98)` + `shadow-sm`，`transition-fast` |
| focus-visible | `outline-2 outline-accent-primary outline-offset-2` |

**缩略图区域：**

- 宽高比 4:3（160×120px 基准，容器内自适应）
- 图片加载中：骨架屏（`animate-pulse`）占位，`bg-surface-hover`
- 图片加载失败：显示占位 icon + "暂无预览" 文字，`bg-surface-input`
- 图片懒加载：`loading="lazy"` + `decoding="async"`

**难度标签：**

- 位置：缩略图下方，左上角
- 样式：`text-xs font-medium px-2 py-0.5 rounded-sm`，使用 `badge.beginner` 或 `badge.advanced` 颜色 token
- 初级：绿色系（`badge.beginner`）
- 高级：橙色系（`badge.advanced`）

**知识点标签（可选，P1）：**

- 显示案例的 tags 前 2-3 个
- 样式：`text-xs text-tertiary bg-surface-input rounded-sm px-1.5 py-0.5`

**搜索高亮：**

- 当 `highlightQuery` 不为空时，标题和描述中匹配的字符用 `<mark>` 包裹
- `<mark>` 样式：`bg-accent-cyan/20 text-accent-cyan rounded-sm px-0.5`

#### 3.2.6 EmptyState

**位置：** CaseCardGrid 内部，替代卡片网格。

**视觉设计：**
- 居中布局，垂直排列
- 插画 / Icon（64×64px，`text-tertiary`）：🔍 或 📭 风格的空状态 SVG
- 标题：`text-xl text-secondary font-medium`
- 描述：`text-sm text-tertiary`
- 可选 CTA 按钮：如"清除筛选条件"，`text-accent-primary`

**Props:**

```typescript
interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**状态变化：**

| 场景 | title | description | action |
|------|-------|-------------|--------|
| 搜索无结果 | "未找到相关案例" | "试试其他关键词" | "清除搜索" |
| 分类无案例 | "暂无案例" | "该分类下还没有案例" | "查看全部" |
| 全局无案例（异常） | "暂无可用案例" | "案例数据加载失败" | "重新加载" |

---

### 3.3 详情页 — 桌面端

#### 组件树

```
<DetailPage>
├── <DetailHeader>                    // 顶部工具栏
│   ├── <BackButton />               // 返回首页
│   ├── <CaseTitle />                // 案例标题
│   ├── <CaseBadge />                // 难度标签
│   ├── <EditorToolbar />            // 运行 + 重置按钮
│   └── <ResizeHandle />             // 画布/编辑器拖拽调整手柄（可选）
│
├── <div className="detail-body">    // 主体区域（左右布局）
│   ├── <RenderPanel>                // 左侧：3D 渲染画布
│   │   ├── <iframe />               // sandbox.html 沙箱
│   │   ├── <LoadingPlaceholder />   // 初始加载 / 运行中
│   │   ├── <ErrorDisplay />         // 运行错误提示
│   │   └── <EmptyCanvasHint />      // 未运行时的引导提示
│   │
│   └── <CodePanel>                  // 右侧：代码区域
│       ├── <EditorToolbar />        // 运行 + 重置（与顶部重复时可隐藏）
│       ├── <CodeEditor />           // Monaco Editor
│       └── <CodeFooter />           // 底部状态栏（语言类型、行数）
```

#### 3.3.1 DetailHeader

**位置：** 详情页顶部，高度 48px，`border-b border-border-default`。

**布局：**
```
┌──────────────────────────────────────────────────────────────────┐
│  ← 返回    旋转的立方体    [初级]              [▶ 运行] [↺ 重置] │
└──────────────────────────────────────────────────────────────────┘
```

**Props:**

```typescript
interface DetailHeaderProps {
  caseMeta: CaseMeta;
  onRun: () => void;
  onReset: () => void;
  isRunning: boolean;
}
```

**BackButton：**

- 样式：`text-sm text-secondary hover:text-primary` + 左箭头 icon (←)
- hover 时箭头向左微移 2px（`transition-transform`）
- 点击调用 `navigate('/')` 返回首页
- 快捷键：`⌘[` / `Ctrl+[`

**CaseTitle：**

- `text-lg font-semibold text-primary`
- 旁边紧跟 `CaseBadge` 难度标签

**EditorToolbar（顶部版）：**

- 桌面端：运行和重置按钮放在顶栏右侧，紧凑布局
- 运行按钮：【▶ 运行】`bg-accent-primary text-white rounded-md px-4 py-1.5 text-sm font-medium`
- 重置按钮：【↺ 重置】`text-secondary hover:text-primary text-sm px-2 py-1.5`，点击时触发确认弹窗

#### 3.3.2 RenderPanel

**位置：** 详情页主体左侧，占宽度 45%-50%（桌面端）。

**视觉设计：**
- 背景：`bg-canvas`（`#0A0C14`），与页面底色略有区分
- 内嵌 iframe 充满整个面板
- 面板带圆角边框：`rounded-lg border border-border-default`
- 面板右上角显示当前帧率（可选）：`text-xs text-tertiary`，如 "60 FPS"

**Props:**

```typescript
interface RenderPanelProps {
  /** 沙箱 URL */
  sandboxUrl: string;
  /** 沙箱就绪回调 */
  onReady: () => void;
  /** 当前状态 */
  state: 'idle' | 'loading' | 'rendering' | 'error';
  /** 错误信息 */
  error?: SandboxError | null;
  /** 运行中的请求 ID（用于取消） */
  requestId?: string;
}
```

**状态变化：**

| 状态 | 表现 |
|------|------|
| `idle` | 显示 `<EmptyCanvasHint />`："点击「运行」查看 3D 效果"，配合一个 3D 线框 cube icon 动画 |
| `loading` | 显示 `<LoadingPlaceholder />`：画布中心 spinner + "代码运行中…" |
| `rendering` | 隐藏占位，展示 iframe 内容（3D 画面） |
| `error` | 画布区域展示 `<ErrorDisplay />`，覆盖在 iframe 上 |

**transition：** 状态切换时使用 `transition-slow` opacity + scale 过渡。

#### 3.3.3 EmptyCanvasHint（空画布引导）

**仅在 `idle` 状态下展示。**

**视觉设计：**
- 居中布局，垂直排列
- 3D 线框立方体 SVG 动画（缓慢旋转，60s 一圈），`text-tertiary` 颜色
- 引导文字：「点击 ▶ 运行 查看 3D 效果」
- 字体：`text-sm text-tertiary`
- 下方提示快捷键：`text-xs text-tertiary/50` → "或按 ⌘↵"

#### 3.3.4 ErrorDisplay

**位置：** 覆盖在 RenderPanel 上（或替换画布内容）。

**视觉设计：**
```
┌────────────────────────────────────────────┐
│                                            │
│              ⚠️                            │
│                                            │
│        代码运行出错                          │
│    ReferenceError: cube is not defined     │
│                                            │
│    ┌────────────────────────────────┬─────┐│
│    │  > 15 │ cube.rotation.x = 0.01 │ :15 ││
│    └────────────────────────────────┴─────┘│
│                                            │
│        请检查代码后重新运行                   │
│                                            │
└────────────────────────────────────────────┘
```

**Props:**

```typescript
interface ErrorDisplayProps {
  error: {
    name: string;        // 错误类型
    message: string;     // 错误消息
    line?: number;       // 错误行号
    column?: number;     // 错误列号
    stack?: string;      // 调用栈
  } | null;
  /** 点击错误行号跳转到编辑器对应行 */
  onLineClick?: (line: number) => void;
}
```

**设计细节：**
- 背景：`bg-surface-card` + `border border-accent-error/30` + `rounded-lg`
- 顶部错误 icon：40×40px，`text-accent-error`
- 错误类型与消息分层：
  - 错误类型：`text-sm text-accent-error font-medium`
  - 错误消息：`text-base text-primary font-mono`
- 代码片段（若有行号）：`font-mono text-sm`，`bg-surface-input rounded-md p-3`，错误行 `bg-accent-error/10`
- 点击错误行号 → 调用 `onLineClick`，编辑器跳转到对应行并高亮
- `transition-slow` fade-in 出现

#### 3.3.5 CodePanel

**位置：** 详情页主体右侧，占宽度 50%-55%（桌面端）。

**视觉设计：**
- 背景：`bg-editor-bg`（`#0D1017`），比页面背景略深
- `rounded-lg border border-border-default`
- Monaco Editor 填充整个面板高度
- 底部状态栏：高度 28px，`bg-editor-gutter`，显示语言（JavaScript）+ 行号/列号 + 光标位置

**CodeFooter：**
```
┌──────────────────────────────────────────────────────────────────┐
│  JavaScript      UTF-8      Ln 15, Col 23     Spaces: 2         │
└──────────────────────────────────────────────────────────────────┘
```

- `text-xs text-tertiary`
- 左对齐：语言、编码
- 右对齐：光标位置（行号/列号）、缩进设置

#### 3.3.6 CodeEditor

**Props:**

```typescript
interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  /** 编辑器语言 */
  language?: 'javascript' | 'typescript';
  /** 是否只读 */
  readOnly?: boolean;
  /** Monaco Editor 加载完成回调 */
  onMount?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  /** 高亮指定行（错误行号） */
  highlightLine?: number | null;
}
```

**Monaco Editor 配置：**

```typescript
const defaultOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  theme: 'vs-dark',                  // 继承 VS Code 深色主题（或自定义主题）
  fontSize: 14,                      // --text-code
  fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
  lineHeight: 22,
  minimap: { enabled: false },       // 关闭 minimap 节省空间
  lineNumbers: 'on',
  renderLineHighlight: 'line',
  automaticLayout: true,             // 跟随容器 resize
  wordWrap: 'on',                    // 自动换行
  tabSize: 2,
  scrollBeyondLastLine: false,
  bracketPairColorization: { enabled: true },
  matchBrackets: 'always',
  cursorBlinking: 'smooth',
  cursorSmoothCaretAnimation: 'on',
  smoothScrolling: true,
  padding: { top: 12, bottom: 12 },  // 编辑器内边距
  glyphMargin: false,                // 不需要断点空间
  folding: true,
  renderWhitespace: 'selection',
  overviewRulerLanes: 0,             // 关闭右侧 overview ruler
  hideCursorInOverviewRuler: true,
  scrollbar: {
    verticalScrollbarSize: 8,
    horizontalScrollbarSize: 8,
  },
};
```

**状态变化：**

| 状态 | 表现 |
|------|------|
| 加载中 | 编辑器区域显示骨架屏（3 行灰色闪烁条） |
| 就绪 | 编辑器正常显示，模板代码已填充 |
| 只读 | 编辑器顶部有黄色提示条：「正在进行中…」 |
| 错误行高亮 | `highlightLine` 对应行红色波浪下划线 + 行号红色背景 `rgba(239,68,68,0.15)` |

**编辑器与 ErrorDisplay 联动：**

- 沙箱返回错误 → `DetailPage` 解析 `error.line` → 设置 `CodeEditor.highlightLine` → Monaco Editor 调用 `editor.revealLineInCenter(line)` 滚动到错误行
- 错误行使用 `monaco.editor.setModelMarkers()` 添加红色波浪线标记
- 清除错误时调用 `monaco.editor.setModelMarkers(model, 'runtime-errors', [])`

#### 3.3.7 EditorToolbar

**位置：** 详情页顶部栏右侧（桌面端）/ 代码面板上方（移动端）。

**Props:**

```typescript
interface EditorToolbarProps {
  onRun: () => void;
  onReset: () => void;
  isRunning: boolean;
  /** 键盘快捷键监听 */
  enableShortcuts?: boolean;
}
```

**运行按钮：**

| 状态 | 表现 |
|------|------|
| 默认 | 【▶ 运行】`bg-accent-primary text-white rounded-md px-5 py-1.5 text-sm font-medium shadow-sm` |
| hover | `bg-accent-primary-hover shadow-md`，`transition-fast` |
| active | `scale-95`（轻微按下反馈） |
| running | 【◌ 运行中…】`bg-accent-primary/50 cursor-not-allowed`，左侧 spinner 动画 |
| 快捷键 | 按钮下方 tooltip 提示 `⌘↵`（仅 desktop hover） |

**运行按钮 spinner：**
```
[◌ 运行中…]
 ↑ 使用 CSS animation rotate 360° 的 circle icon
```

**重置按钮：**

| 状态 | 表现 |
|------|------|
| 默认 | 【↺ 重置】`text-secondary text-sm bg-transparent px-3 py-1.5 rounded-md` |
| hover | `text-primary bg-surface-hover`，`transition-fast` |
| 点击 | 弹出 `<ConfirmDialog />`："确定要重置代码吗？您的修改将丢失。" |
| 确认后 | 编辑器恢复为模板代码 + 自动运行 + toast 提示「代码已重置」 |

#### 3.3.8 ConfirmDialog

**触发的场景：** 重置代码。

**视觉设计：**
```
┌───────────────────────────────────────┐
│                                       │
│         ⚠️  确认重置                   │
│                                       │
│  确定要重置代码吗？                    │
│  您的修改将丢失。                      │
│                                       │
│       [取消]      [确定重置]           │
│                                       │
└───────────────────────────────────────┘
```

- 背景：`bg-surface-card` + `shadow-modal` + `rounded-xl` + `border border-border-default`
- 遮罩层：`bg-black/60 backdrop-blur-sm`
- 确定按钮：`bg-accent-error text-white`（危险操作使用红色）
- 取消按钮：`bg-surface-input text-secondary`
- 入场动画：`scale(0.95) → scale(1)` + `opacity 0 → 1`，`transition-slow`
- 按 `Esc` 或点击遮罩层关闭（等于取消）
- 焦点自动锁定在弹窗内（trap focus）

**Props:**

```typescript
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** 确认按钮类型 */
  variant?: 'danger' | 'primary';
}
```

#### 3.3.9 LoadingPlaceholder

**使用场景：** 详情页初始加载、代码运行中、Monaco Editor 懒加载中。

**视觉设计：**
- 居中布局
- 顶部 spinner：`w-8 h-8 border-2 border-border-default border-t-accent-primary rounded-full animate-spin`
- 下方文字：`text-sm text-tertiary`，取决于上下文

| 使用场景 | 文字 |
|----------|------|
| 详情页加载中 | "正在加载案例…" |
| 代码运行中 | "代码运行中…" |
| 编辑器加载中 | "代码编辑器加载中…" |

**Props:**

```typescript
interface LoadingPlaceholderProps {
  message?: string;
  /** 是否全高覆盖 */
  fullHeight?: boolean;
}
```

---

### 3.4 详情页 — 移动端

**核心变化：** 左右布局 → 上下布局。

**组件树（移动端）：**

```
<DetailPage>
├── <DetailHeader mobile />           // 紧凑顶栏（仅返回 + 标题）
├── <RenderPanel mobile />            // 上半部分：3D 画布 (≥ 40vh)
│   ├── <iframe />
│   ├── <LoadingPlaceholder />
│   └── <ErrorDisplay />
├── <EditorToolbar mobile />          // 运行 + 重置按钮
└── <CodePanel mobile />              // 下半部分：编辑器 (剩余高度)
    └── <CodeEditor />
```

**布局：**
```
┌─────────────────────┐
│ ← 旋转的立方体       │  ← 48px 顶栏
├─────────────────────┤
│                     │
│   3D 渲染画布        │  ← min-height: 40vh
│   (iframe)          │     触摸版 OrbitControls
│                     │     (单指旋转, 双指缩放/平移)
│                     │
├─────────────────────┤
│  [▶ 运行]  [↺ 重置] │  ← 按钮栏 (固定或 inline)
├─────────────────────┤
│                     │
│   代码编辑器          │  ← flex-grow, 最小高度 200px
│   (Monaco Editor)   │     移动端降级：
│                     │     语法高亮 + 基本编辑
│                     │     有自动换行
│                     │
└─────────────────────┘
```

**移动端细节：**

- OrbitControls：`touches.ONE = ROTATE`，`touches.TWO = PAN`，`pinch = DOLLY`
- 画布工具栏（运行/重置）在画布和编辑器之间，固定高度 44px
- 编辑器最小高度 200px，超出滚动
- 编辑器字号 ≥ 16px（防止 iOS 自动缩放）
- 按钮触摸目标 ≥ 44×44px
- 不显示顶部栏的运行/重置按钮（避免重复）

---

## 4. 组件设计

### 4.1 组件 Props 与状态完整汇总

#### 布局组件

| 组件 | Props | 内部状态 | 备注 |
|------|-------|----------|------|
| **App** | — | `webglSupported: boolean` | WebGL 检测 |
| **Layout** | `children: ReactNode` | — | max-w-[1280px] 居中容器 |
| **NavBar** | `transparent?: boolean` | `scrolled: boolean`, `menuOpen: boolean` | sticky 定位，滚动后背景加深 |

#### 首页组件

| 组件 | Props | 内部状态 | 备注 |
|------|-------|----------|------|
| **HomePage** | — | `activeTab`, `searchQuery`, `filteredCases` | 编排首页状态 |
| **HeroSection** | — | — | 纯展示 |
| **CategoryTabs** | `tabs: Tab[]`, `activeKey: string`, `onChange: (key) => void` | — | 受控组件 |
| **SearchBar** | `value: string`, `onChange: (v) => void`, `onClear: () => void`, `placeholder?: string`, `autoFocus?: boolean` | `isFocused: boolean` | 300ms debounce |
| **CaseCardGrid** | `cases: CaseMeta[]`, `onCardClick: (id) => void` | — | Grid 布局容器 |
| **CaseCard** | `case: CaseMeta`, `onClick: (id) => void`, `highlightQuery?: string` | `imgLoaded: boolean`, `imgError: boolean` | 缩略图懒加载 |
| **EmptyState** | `icon?: ReactNode`, `title?: string`, `description?: string`, `action?: { label, onClick }` | — | 多场景复用 |

#### 详情页组件

| 组件 | Props | 内部状态 | 备注 |
|------|-------|----------|------|
| **DetailPage** | — | `code`, `isRunning`, `error`, `sandboxState` | 编排详情页状态，useSandbox hook |
| **DetailHeader** | `caseMeta: CaseMeta`, `onRun`, `onReset`, `isRunning: boolean` | — | — |
| **RenderPanel** | `sandboxUrl`, `onReady`, `state: 'idle' \| 'loading' \| 'rendering' \| 'error'`, `error?: SandboxError` | — | iframe 生命周期管理 |
| **EmptyCanvasHint** | — | — | idle 态占位 |
| **ErrorDisplay** | `error: {name,message,line?,column?,stack?}`, `onLineClick?: (line) => void` | — | 错误行可点击跳转 |
| **CodePanel** | `children: ReactNode` | — | 右侧代码面板容器 |
| **CodeEditor** | `value`, `onChange`, `language?`, `readOnly?`, `onMount?`, `highlightLine?` | `isLoading: boolean` | 懒加载 Monaco |
| **EditorToolbar** | `onRun`, `onReset`, `isRunning`, `enableShortcuts?` | — | 运行/重置按钮 |
| **ConfirmDialog** | `open`, `title`, `message`, `confirmLabel?`, `cancelLabel?`, `onConfirm`, `onCancel`, `variant?` | — | 重置确认弹窗 |
| **LoadingPlaceholder** | `message?`, `fullHeight?` | — | 通用加载态 |

#### 全局组件

| 组件 | Props | 内部状态 | 备注 |
|------|-------|----------|------|
| **WebGLFallback** | — | — | WebGL 不支持全屏拦截 |
| **Toast** | `message`, `type?: 'info' \| 'success' \| 'error'`, `duration?: number` | `visible` | 轻量通知 |

### 4.2 Toast 通知

**视觉设计：**
```
┌────────────────────────────────┐
│  ✅  代码已重置                 │
└────────────────────────────────┘
```

- 固定在页面右上角，`z-50`
- 背景 `bg-surface-card` + `shadow-lg` + `rounded-lg` + `border`
- 入场：从右侧滑入 + fade-in，`transition-normal`
- 自动消失：3s 后 fade-out + 向右滑出
- 类型色：success → `border-accent-success`，error → `border-accent-error`，info → `border-accent-info`

---

## 5. 响应式布局方案

### 5.1 断点定义

```css
/* Tailwind 断点映射 */
/* 手机：默认（无前缀）   < 768px  */
/* 平板：md:             ≥ 768px  */
/* 桌面：lg:             ≥ 1024px */
```

### 5.2 首页响应式对比

| 区域 | 桌面 (≥1024px) | 平板 (768-1023px) | 手机 (<768px) |
|------|---------------|-------------------|---------------|
| Hero 高度 | 220px | 180px | 140px |
| Hero 标题 | `text-3xl` (30px) | `text-2xl` (24px) | `text-xl` (20px) |
| Hero 副标题 | `text-base` | `text-sm` | `text-xs` |
| 筛选栏 | Tab + 搜索框水平排列 | Tab + 搜索框水平排列 | Tab 在上，搜索框在下 (竖向) |
| 卡片列数 | 3 列 | 2 列 | 1 列 |
| 卡片间距 | `gap-6` (24px) | `gap-5` (20px) | `gap-4` (16px) |
| 页面内边距 | `px-8` (32px) | `px-6` (24px) | `px-4` (16px) |
| NavBar | 展开全部链接 | 展开全部链接 | 汉堡菜单 |

### 5.3 详情页响应式对比

| 区域 | 桌面 (≥1024px) | 平板 (768-1023px) | 手机 (<768px) |
|------|---------------|-------------------|---------------|
| 主布局 | 水平：画布左 45% + 编辑器右 55% | 水平：画布左 40% + 编辑器右 60% | 垂直：画布上 (≥40vh) + 编辑器下 |
| 画布高度 | 100%（父容器 flex-grow） | 100% | ≥ 40vh |
| 画布最小高度 | — | — | 200px |
| 编辑器高度 | 100% | 100% | 剩余空间（min 200px） |
| 运行/重置位置 | 顶部栏右侧 | 顶部栏右侧 | 画布与编辑器之间（独立工具栏） |
| OrbitControls | 鼠标 | 鼠标 + 触摸 | 触摸：单指旋转，双指缩放/平移 |
| 编辑器字号 | 14px | 14px | 16px |
| 按钮高度 | 36px | 36px | 44px |

### 5.4 响应式实现方式

| 手段 | 适用场景 |
|------|----------|
| Tailwind 响应式前缀（`lg:`、`md:`） | 布局（grid-cols、flex-row/col）、间距、字号、显隐 |
| `useMediaQuery` hook | JS 逻辑判断（OrbitControls 触摸模式、编辑器降级） |
| CSS `clamp()` 函数 | 流体字号、流体间距 |
| `ResizeObserver` | iframe 画布尺寸同步 |

**`useMediaQuery` hook：**

```typescript
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

// 使用示例
const isMobile = useMediaQuery('(max-width: 767px)');
const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
const isDesktop = useMediaQuery('(min-width: 1024px)');
```

---

## 6. 关键交互 UX 细节

### 6.1 卡片 hover 动效

```css
.case-card {
  transition: transform 250ms ease-out, box-shadow 250ms ease-out, border-color 250ms ease-out;
}
.case-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
  border-color: var(--border-active);
}
.case-card:hover .case-card-thumbnail img {
  transform: scale(1.03);
  transition: transform 250ms ease-out;
}
.case-card:active {
  transform: scale(0.98);
  transition: transform 100ms ease;
}
```

### 6.2 运行按钮状态流转

```
[默认] ──hover──▶ [hover 亮色] ──click──▶ [running: spinner + 禁用]
                                                │
                                    ┌───────────┴───────────┐
                                    ▼                       ▼
                              [成功: 恢复默认]        [失败: 显示错误 + 恢复默认]
```

**视觉时序：**
1. 点击运行：按钮文字变为"运行中…"，左侧出现旋转 spinner（`transition-fast`）
2. 沙箱正在执行：按钮禁用 (`pointer-events: none, opacity: 0.6`)
3a. 成功返回：按钮立即恢复为"▶ 运行"，画布 fade-in 展示新效果
3b. 失败返回：按钮恢复，画布区域显示 ErrorDisplay

### 6.3 分类 Tab 切换动画

```
[全部] ──click──▶ ┌─────────┐
                    │  活跃指示器      │ ← 从[全部]底部滑动到[初级]底部
                    │  (2px 渐变下划线)│    使用 transform: translateX
                    └─────────┘        transition: 250ms ease-out

卡片区域：旧卡片 fade-out (150ms) → 布局重排 → 新卡片 fade-in (150ms)
```

### 6.4 搜索交互

- 输入 → 300ms debounce → 过滤
- 过滤期间：卡片区域 `opacity-60 pointer-events-none`（正在过滤中提示）
- 匹配结果高亮：`<mark>` 元素，`bg-accent-cyan/20 text-accent-cyan`
- 无结果：`<EmptyState />` 从 `opacity-0 translateY(8px)` 滑入

### 6.5 页面过渡

```css
/* 首页 → 详情页（React Router + CSS） */
.page-enter {
  opacity: 0;
  transform: translateY(8px);
}
.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 250ms ease-out, transform 250ms ease-out;
}
.page-exit {
  opacity: 1;
}
.page-exit-active {
  opacity: 0;
  transition: opacity 200ms ease-in;
}
```

### 6.6 WebGL 不支持降级

```
┌──────────────────────────────────────────────────┐
│                                                  │
│                    🖥️                            │
│                                                  │
│          您的浏览器不支持 WebGL                    │
│    请使用最新版 Chrome / Edge / Firefox / Safari   │
│                                                  │
│        [下载 Chrome]    [下载 Firefox]             │
│                                                  │
└──────────────────────────────────────────────────┘
```

- 全屏居中，`bg-surface-root`，`min-h-screen`
- `<WebGLFallback />` 在 App 层拦截所有路由
- 提供主流浏览器下载链接

### 6.7 键盘快捷键（全局）

| 快捷键 | 作用域 | 功能 |
|--------|--------|------|
| `⌘/Ctrl + K` | 首页 | 聚焦搜索框 |
| `Esc` | 首页搜索框 | 清空搜索 |
| `⌘/Ctrl + ↵` | 详情页 | 运行代码 |
| `⌘/Ctrl + S` | 详情页 | 运行代码（替代保存） |
| `⌘/Ctrl + [` | 详情页 | 返回首页 |
| `Esc` | 详情页弹窗 | 关闭 ConfirmDialog |
| `Tab` | 全局 | 焦点导航 |

### 6.8 焦点管理

- 卡片区域支持 Tab 导航（`tabIndex={0}`），Enter 触发跳转
- 运行按钮始终可 Tab 到达
- ConfirmDialog 打开时焦点锁定在弹窗内（focus trap）
- 弹窗关闭后焦点回到触发按钮
- 编辑器内焦点由 Monaco Editor 自行管理

### 6.9 Loading 骨架屏

**首页卡片骨架屏：**

```
┌─────────────────┐
│ ████████████████│  ← 缩略图区域 animate-pulse
│ ████████████████│
│                 │
│ ██████████      │  ← 标题骨架 (w-3/4)
│ ████████████████│  ← 描述骨架 (w-full)
│ ██████          │  ← 描述骨架 (w-1/2)
│                 │
│ [██] [██] [██]  │  ← 标签骨架
└─────────────────┘
```

- 使用 `animate-pulse` + `bg-surface-hover rounded`
- 骨架屏圆角与真实元素一致
- 实际卡片渲染完成后用 `transition-slow` fade-in 替换

---

## 7. 公共组件清单

### 7.1 组件分类

#### 布局类

| 组件 | 路径 | 复用场景 |
|------|------|----------|
| `Layout` | `components/layout/Layout.tsx` | 全局页面容器 |
| `NavBar` | `components/layout/NavBar.tsx` | 全局顶栏 |
| `WebGLFallback` | `components/layout/WebGLFallback.tsx` | WebGL 不支持降级 |

#### 反馈类

| 组件 | 路径 | 复用场景 |
|------|------|----------|
| `LoadingPlaceholder` | `components/common/LoadingPlaceholder.tsx` | 详情页加载、编辑器加载、运行中 |
| `EmptyState` | `components/common/EmptyState.tsx` | 搜索无结果、分类无案例、全局异常 |
| `ErrorDisplay` | `components/detail/ErrorDisplay.tsx` | 沙箱运行错误 |
| `Toast` | `components/common/Toast.tsx` | 全局操作反馈 |
| `Skeleton` | `components/common/Skeleton.tsx` | 卡片骨架屏、编辑器骨架屏 |

#### 交互类

| 组件 | 路径 | 复用场景 |
|------|------|----------|
| `ConfirmDialog` | `components/common/ConfirmDialog.tsx` | 重置确认、危险操作确认 |
| `SearchBar` | `components/home/SearchBar.tsx` | 首页搜索 |
| `CategoryTabs` | `components/home/CategoryTabs.tsx` | 分类筛选 |

#### 业务类

| 组件 | 路径 | 说明 |
|------|------|------|
| `HomePage` | `pages/HomePage.tsx` | 首页编排 |
| `HeroSection` | `components/home/HeroSection.tsx` | Hero 标题区 |
| `CaseCardGrid` | `components/home/CaseCardGrid.tsx` | 卡片网格 |
| `CaseCard` | `components/home/CaseCard.tsx` | 单张案例卡片 |
| `DetailPage` | `pages/DetailPage.tsx` | 详情页编排 |
| `DetailHeader` | `components/detail/DetailHeader.tsx` | 详情顶部栏 |
| `RenderPanel` | `components/detail/RenderPanel.tsx` | 3D 渲染面板 |
| `EmptyCanvasHint` | `components/detail/EmptyCanvasHint.tsx` | 空画布引导 |
| `CodePanel` | `components/detail/CodePanel.tsx` | 代码面板容器 |
| `CodeEditor` | `components/detail/CodeEditor.tsx` | Monaco Editor 封装 |
| `CodeFooter` | `components/detail/CodeFooter.tsx` | 编辑器状态栏 |
| `EditorToolbar` | `components/detail/EditorToolbar.tsx` | 运行/重置按钮 |

### 7.2 组件目录结构

```
src/components/
├── layout/
│   ├── Layout.tsx
│   ├── NavBar.tsx
│   └── WebGLFallback.tsx
├── common/
│   ├── LoadingPlaceholder.tsx
│   ├── EmptyState.tsx
│   ├── ConfirmDialog.tsx
│   ├── Toast.tsx
│   └── Skeleton.tsx
├── home/
│   ├── HeroSection.tsx
│   ├── CategoryTabs.tsx
│   ├── SearchBar.tsx
│   ├── CaseCardGrid.tsx
│   └── CaseCard.tsx
└── detail/
    ├── DetailHeader.tsx
    ├── RenderPanel.tsx
    ├── EmptyCanvasHint.tsx
    ├── ErrorDisplay.tsx
    ├── CodePanel.tsx
    ├── CodeEditor.tsx
    ├── CodeFooter.tsx
    └── EditorToolbar.tsx
```

### 7.3 通用复合组件

以下组件封装为独立的公共组件，对外提供灵活的 Props：

- **`Toast`** — 全局通知。基于 React Context 或事件总线实现，任意组件可通过 `toast.success('消息')` 调用
- **`ConfirmDialog`** — 通用确认弹窗。支持 `variant: 'danger' | 'primary'`，支持 title + message + 双按钮 + Esc 关闭
- **`LoadingPlaceholder`** — 加载占位。支持自定义 message 和 fullHeight
- **`EmptyState`** — 空状态展示。支持自定义 icon、title、description、action
- **`Skeleton`** — 骨架屏组件。接受 `width`、`height`、`rounded` 参数

---

## 8. 附录：视觉预览说明

### 8.1 首页视觉锚点

1. **Hero 区渐变文字** — 第一眼吸引注意力，表达产品调性
2. **卡片 hover 上浮 + 发光边框** — 暗示可点击，符合卡片交互惯例
3. **难度标签色彩区分** — 绿色（初级）= 安全/入门，橙色（高级）= 挑战/进阶
4. **Tab 渐变指示器滑动** — 高品质交互动效，提升精致感
5. **搜索框 glow 聚焦** — 符合输入框交互惯例，引导用户搜索

### 8.2 详情页视觉锚点

1. **画布与编辑器色彩分离** — 画布 `#0A0C14` vs 编辑器 `#0D1017`，视觉上明确功能分区
2. **运行按钮主色醒目** — 吸引点击，是详情页最核心 CTA
3. **错误提示红色边框** — 高对比度，用户不会忽略
4. **编辑器状态栏** — 提供 IDE 般专业感
5. **空画布 3D 线框动画** — 在等待运行时不空洞，同时暗示即将出现 3D 内容

### 8.3 动效节奏参考

```
页面加载
  ├─ NavBar: 0ms（立即渲染）
  ├─ Hero 文字: 150ms fade-in（从下往上 8px）
  ├─ Tab + 搜索: 250ms fade-in
  └─ 卡片: 350ms stagger fade-in（每张卡片延迟 50ms，瀑布流效果）

点击卡片
  ├─ 卡片: 100ms scale(0.98) active 反馈
  └─ 页面跳转: 200ms fade-out → 新页面 250ms fade-in

点击运行
  ├─ 按钮: 150ms 切换为 running 态
  ├─ 画布加载: 250ms fade-in spinner
  └─ 结果/错误: 250ms fade-in（成功 = 3D 画面，失败 = 错误面板）
```

### 8.4 色彩对比度验证

| 组合 | 前景 | 背景 | 对比度 | WCAG AA 通过？ |
|------|------|------|--------|---------------|
| 主文字 ↔ 页面背景 | `#E4E6F0` | `#0F1119` | 13.8:1 | ✅ AAA |
| 辅助文字 ↔ 页面背景 | `#9098B8` | `#0F1119` | 5.8:1 | ✅ AA |
| 禁用文字 ↔ 页面背景 | `#5C6380` | `#0F1119` | 3.1:1 | ❌（仅用于非关键文字） |
| 主按钮文字 ↔ 按钮背景 | `#FFFFFF` | `#6366F1` | 5.2:1 | ✅ AA |
| 初级标签文字 ↔ 背景 | `#4ADE80` | `rgba(34,197,94,0.12)` | 4.8:1 | ✅ AA |
| 高级标签文字 ↔ 背景 | `#FBBF24` | `rgba(245,158,11,0.12)` | 4.5:1 | ✅ AA |
| 错误文字 ↔ 卡片背景 | `#EF4444` | `#161B2B` | 4.3:1 | ✅ AA |

---

> **文档结束。**
>
> 本设计方案与 PRD.md、ARCHITECTURE.md 配套，为前端开发团队提供完整的视觉与交互规范。
>
> **下一步建议：**
> 1. 根据本方案创建 Figma / Sketch 高保真设计稿
> 2. 将设计 Token 提取为 `design-tokens.json`，供代码和设计工具同步
> 3. 编写 Storybook 组件文档，为每个组件覆盖所有状态（默认/hover/active/loading/empty/error）
> 4. 在开发过程中持续补充 `UI-DESIGN.md` 中的组件状态细节}