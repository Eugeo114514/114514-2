# 🦋 100种不可思议旅行 — 飞猪

> 为 Z 世代打造的沉浸式旅行灵感发现平台 | 飞猪旅行旗下子品牌

![Tech Stack](https://img.shields.io/badge/React-18-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript) ![Vite](https://img.shields.io/badge/Vite-5.4-purple?logo=vite) ![Tests](https://img.shields.io/badge/tests-19%2F19-green)

---

## ✨ 功能特性

| 功能 | 说明 |
|---|---|
| 🎠 **水平流动轮播** | BanG Dream embla 风格，scroll-snap 水平吸附 |
| 🫧 **有机 blob 卡片** | CSS @keyframes 驱动，5 种形态 + 4 种漂移路径 |
| ✦ **粒子星芒背景** | 60 个粒子（dot / star / sparkle），浮动+闪烁 |
| 🎛️ **多维筛选** | 类型（多选）× 情绪 × 预算，纯函数谓词组合子 |
| 📖 **沉浸式详情页** | 全屏 Hero 视差 + IntersectionObserver 段落淡入 |
| ◀▶ **详情页导航** | 左右箭头 + 键盘 ← →，无需返回轮播 |
| ❤️ **点赞 + 评论** | localStorage 持久化，评论时间倒序 |
| ✚ **用户投稿** | 弹窗表单，提交后即时加入轮播 + localStorage |
| 🎹 **背景音乐** | Web Audio API 五声音阶，随机音符 2-6 秒间隔 |
| 👁️ **光标感应筛选栏** | 默认隐藏，光标移至顶部 60px 区域滑入 |
| ♿ **可访问性** | prefers-reduced-motion / 键盘导航 / ARIA |
| 📱 **响应式** | 四档断点：≤480 / 481-767 / 768-1199 / 1200+ |

---

## 🚀 快速开始

### 环境要求

- Node.js ≥ 18
- npm ≥ 9

### 安装 & 运行

```bash
# 1. 克隆项目
git clone <repo-url>
cd flypig-100-travels

# 2. 安装依赖
npm install

# 3. 初始化数据（可选，已有预置数据）
node scripts/init-data.cjs

# 4. 启动开发服务器
npm run dev
# → http://localhost:5173

# 5. 运行测试
npm test

# 6. 生产构建
npm run build
# → dist/
```

---

## 🧪 测试

```bash
npm test           # 单次运行
npm run test:watch # 监听模式
```

```
✅ src/__tests__/core/filterTravels.test.ts  (11 tests)
✅ src/__tests__/core/sortByIndex.test.ts     (5 tests)
✅ src/__tests__/core/groupByCategory.test.ts (3 tests)
```

---

## 🏗️ 技术架构

```
多范式融合架构：
┌──────────────────────────────────────────────┐
│  core/          FP 函数式编程                 │
│  ├─ domain/     Travel · Filter 类型定义      │
│  ├─ transforms/ 纯函数：筛选/排序/分组          │
│  └─ ports/      数据源接口（后期接 API 换 adapter）│
├──────────────────────────────────────────────┤
│  features/      OOP Compound Components       │
│  ├─ travel-card/     <TravelCard.Image /> 等  │
│  ├─ filter-bar/      多维筛选栏               │
│  ├─ travel-grid/     FlowCarousel 水平轮播     │
│  ├─ travel-detail/   沉浸式详情页              │
│  ├─ starfield/       粒子系统                 │
│  ├─ ambient-audio/   背景音乐                 │
│  └─ contribute/      投稿模态框               │
├──────────────────────────────────────────────┤
│  state/         Reactive / Event-driven       │
│  ├─ store.ts         Zustand 主 store         │
│  ├─ selectors.ts     派生选择器               │
│  └─ social.ts        点赞/评论 store           │
├──────────────────────────────────────────────┤
│  shared/        UI Kit + Hooks + Tokens       │
│  lib/           AOP: ErrorBoundary / Logger    │
│  app/           入口 / 路由 / Provider         │
└──────────────────────────────────────────────┘
```

### 技术选型说明

| 技术 | 版本 | 选型理由 |
|---|---|---|
| React | 18.3 | 生态成熟，Compound Components 天然支持 |
| TypeScript | 5.5 (strict) | 类型安全，ADT 建模 |
| Vite | 5.4 | 极速 HMR，CSS Modules 一等公民 |
| Zustand | 4.5 | 轻量响应式，selector 自动派生 |
| React Router | 6.26 | 声明式路由，嵌套路由支持 |
| Vitest | 4.1 | 与 Vite 共享配置，零配置测试 |
| CSS Modules | — | 样式隔离，零运行时开销 |
| Web Audio API | — | 浏览器原生，零依赖音频生成 |

### 范式映射

| 层 | 范式 | 关键特征 |
|---|---|---|
| `core/` | 函数式编程 | 纯函数、不可变数据、谓词组合子、零副作用 |
| `features/` | OOP Compound Components | Context 驱动子组件、接口隔离 |
| `state/` | 响应式 / Event-driven | Zustand selector 自动派生、UI 订阅状态 |
| `lib/` | AOP 横切关注点 | ErrorBoundary 装饰器、分析埋点注入 |

---

## 📂 项目结构

```
flypig-100-travels/
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── .gitignore
├── docs/
│   ├── PRD.md              # 产品需求文档（含 mermaid 图）
│   ├── ER-Diagram.md        # 数据模型 & ER 图（含 mermaid 图）
│   ├── Architecture.md      # 架构设计文档（含 mermaid 图）
│   └── API.md               # 数据访问层接口文档
├── scripts/
│   └── init-data.cjs        # 数据初始化脚本（50 条精选数据）
├── src/
│   ├── main.tsx
│   ├── vite-env.d.ts
│   ├── app/                 # 入口 · 路由 · Provider
│   ├── core/                # 领域层（FP）
│   ├── features/            # 功能模块（OOP Compound）
│   ├── state/               # 状态管理（Reactive）
│   ├── shared/              # 共享 UI Kit
│   ├── lib/                 # 横切关注点（AOP）
│   ├── data/                # 静态数据
│   └── __tests__/           # 测试代码
└── public/
    └── favicon.svg
```

---

## 🗄️ 数据模型

见 [`docs/ER-Diagram.md`](./docs/ER-Diagram.md) — 包含完整 Mermaid ER 图、数据流图、存储策略。

### 样例数据（≥5 条高质量）

所有 50 条数据均为手工精选，每条包含：

```json
{
  "id": "cultural-13",
  "title": "在敦煌莫高窟的壁画前与千年前对视",
  "destination": "中国·敦煌",
  "category": "cultural",
  "unbelievableIndex": 88,
  "primaryMood": "静谧",
  "secondaryMood": "震撼",
  "narrative": { "intro": "...", "story": [...], "travelerQuote": "...", "tip": "..." },
  "colorPalette": ["#2d1b00", "#5c3d1a", "#b8860b", "#f5d08c", "#fff8e7"]
}
```

覆盖 5 大洲 30+ 国家/地区，60% 人文类内容。

---

## 📡 API / 数据接口

见 [`docs/API.md`](./docs/API.md) — 包含 `ITravelDataSource` 接口、Zustand Store API、Filter 谓词系统。

### 后续接入飞猪 API

仅需实现 adapter：

```typescript
class FliggyApiDataSource implements ITravelDataSource {
  async getAll(): Promise<Travel[]> {
    const res = await fetch('https://api.fliggy.com/v1/travels', { ... })
    return res.json()
  }
}
```

其余层（领域变换、状态管理、UI 组件）**零改动**。

---

## 🎨 设计系统

| Token | 值 |
|---|---|
| 背景最深色 | `#0a0a0f` |
| 毛玻璃背景 | `rgba(18, 18, 26, 0.6)` |
| 主文字 | `#f0ede8`（暖白） |
| 标题字体 | Space Grotesk |
| 正文字体 | Noto Serif SC（思源宋体） |
| 毛玻璃模糊 | `blur(20px)` |

---

## 🔒 后台账号

本 MVP 为纯前端项目，无后台管理系统。用户生成的互动数据（点赞/评论/投稿）存储在浏览器 `localStorage` 中。

> **注意**：清除浏览器数据会丢失互动记录。后续接入飞猪后端后，数据将持久化至服务端数据库。

---

## 📝 Git 提交规范

```
docs:    文档变更 (PRD, ER, Architecture, API)
schema:  数据模型 & 初始化脚本
core:    领域层（类型、变换、接口）
styles:  设计令牌 & 全局样式
ui-components: 共享 UI 组件
state:   状态管理
feat:    功能模块
tests:   测试代码
chore:   脚手架 & 构建配置
```

---

## 📄 License

Internal — 飞猪旅行
