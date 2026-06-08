# 架构设计文档

> 对应源码：`src/` 下全部文件

---

## 1. 多范式融合架构

```mermaid
graph TB
    subgraph "App Shell"
        APP[App.tsx]
        ROUTER[Router]
        PROVIDERS[Providers/ErrorBoundary]
    end

    subgraph "Features 功能层 — OOP Compound Components"
        CARD[TravelCard 组件族]
        FILTER[FilterBar]
        GRID[TravelGrid/FlowCarousel]
        DETAIL[TravelDetail]
        STAR[Starfield]
        AUDIO[AmbientAudio]
        CONTRIB[ContributeModal]
    end

    subgraph "State 状态层 — Reactive/Event-driven"
        STORE[Zustand Store]
        SELECTORS[Selectors]
        SOCIAL[Social Store]
    end

    subgraph "Core 领域层 — FP 函数式"
        DOMAIN[Travel/Filter 类型]
        TRANSFORMS[filterTravels/sortByIndex/groupByCategory]
        PORTS[ITravelDataSource]
    end

    subgraph "Shared 共享层"
        COMPONENTS[GlassCard/MoodTag/LikeButton]
        HOOKS[useParallax/useInView/useReducedMotion]
        STYLES[tokens/global/glassmorphism]
    end

    subgraph "Lib 横切层 — AOP"
        ERROR[ErrorBoundary]
        LOG[Logger]
        ANALYTICS[Analytics]
    end

    APP --> PROVIDERS
    APP --> ROUTER
    ROUTER --> GRID
    ROUTER --> DETAIL

    GRID --> CARD
    GRID --> FILTER
    GRID --> STAR
    GRID --> AUDIO
    GRID --> CONTRIB

    CARD --> COMPONENTS
    DETAIL --> COMPONENTS
    FILTER --> STORE
    GRID --> STORE
    CARD --> HOOKS
    DETAIL --> HOOKS

    STORE --> TRANSFORMS
    TRANSFORMS --> DOMAIN

    PROVIDERS --> ERROR
    ERROR --> LOG
```

---

## 2. 范式映射

| 层 | 范式 | 核心特征 | 示例 |
|---|---|---|---|
| `core/` | **函数式编程** | 纯函数、不可变数据、谓词组合子、零副作用 | `applyFilter(travels, filter)` 返回新数组 |
| `features/` | **OOP Compound Components** | Context 驱动的子组件组合、接口隔离 | `<TravelCard.Image />` `<TravelCard.Mood />` |
| `state/` | **响应式/事件驱动** | Zustand selector 自动派生、UI 订阅状态 | `useFilteredTravels()` 自动重算 |
| `lib/` | **AOP 横切关注点** | ErrorBoundary 装饰器、分析埋点注入 | `analytics.cardClick()` 不侵入业务代码 |
| `shared/` | **工具包模式** | UI Kit + Hooks + Design Tokens，纯展示无业务逻辑 | `GlassCard`、`useParallax` |

---

## 3. 组件树

```mermaid
graph TD
    App --> ErrorBoundary
    ErrorBoundary --> BrowserRouter
    BrowserRouter --> BrowsePage
    BrowserRouter --> TravelDetail
    BrowsePage --> AtmosphereBackground
    BrowsePage --> Starfield
    BrowsePage --> FilterBar
    BrowsePage --> FlowCarousel
    BrowsePage --> AnimatedCounter
    BrowsePage --> AmbientAudio
    BrowsePage --> ContributeModal
    FlowCarousel --> TravelCard["TravelCard (×N)"]
    TravelCard --> TravelCardImage["TravelCard.Image"]
    TravelCard --> TravelCardMood["TravelCard.Mood"]
    TravelCard --> TravelCardTitle["TravelCard.Title"]
    TravelCard --> TravelCardMeta["TravelCard.Meta"]
    TravelCard --> LikeButton
    TravelDetail --> TravelDetailAtmosphere
    TravelDetail --> TravelDetailHero
    TravelDetail --> TravelDetailNarrative
    TravelDetail --> LikeButton
    TravelDetail --> CommentSection
```

---

## 4. 数据流

```mermaid
sequenceDiagram
    participant User
    participant BrowsePage
    participant Store as Zustand Store
    participant Transform as filterTravels (FP)
    participant Grid as TravelGrid/FlowCarousel

    User->>BrowsePage: 打开页面
    BrowsePage->>Store: setTravels(travels.json)
    Store->>Transform: applyFilter(travels, DEFAULT_FILTER)
    Transform-->>Store: sorted & filtered Travel[]
    Store-->>Grid: filteredTravels (via selector)
    Grid->>Grid: 渲染卡片轮播

    User->>BrowsePage: 切换筛选维度
    BrowsePage->>Store: setFilter({ categories: ['cultural'] })
    Store->>Transform: applyFilter(travels, newFilter)
    Transform-->>Store: new filtered list
    Store-->>Grid: re-render
```

---

## 5. 路由设计

| 路径 | 组件 | 说明 |
|---|---|---|
| `/` | Navigate | 重定向到 `/browse` |
| `/browse` | BrowsePage | 主浏览页 |
| `/browse/:id` | TravelDetail | 沉浸式详情页 |

---

## 6. 关键设计决策

```mermaid
flowchart TD
    Q1{数据存储?} -->|MVP 阶段| A1[静态 JSON + localStorage]
    Q1 -->|后续| A2[飞猪 API + PostgreSQL]

    Q2{动画方案?} -->|MVP 阶段| B1[CSS-only @keyframes + GPU composite]
    Q2 -->|后续| B2[Framer Motion / GSAP]

    Q3{瀑布流 vs 轮播?} -->|经历迭代| C1[CSS columns → 蜂窝 grid → 水平轮播]
    C1 --> C2[最终：BanG Dream 风格 FlowCarousel]

    Q4{筛选器展示?} -->|最终方案| D1[默认隐藏 + 光标顶部 60px 触发]
    D1 --> D2[保证全屏沉浸感]
```

---

## 7. 目录结构

```
flypig-100-travels/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
├── README.md
├── docs/
│   ├── PRD.md
│   ├── ER-Diagram.md
│   ├── Architecture.md
│   └── API.md
├── scripts/
│   └── init-data.js          # 数据初始化脚本
├── src/
│   ├── main.tsx
│   ├── vite-env.d.ts
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   ├── providers.tsx
│   │   └── pages/
│   │       ├── BrowsePage.tsx
│   │       └── AtmosphereBackground.tsx
│   ├── core/
│   │   ├── domain/
│   │   │   ├── Travel.ts
│   │   │   └── Filter.ts
│   │   ├── transforms/
│   │   │   ├── filterTravels.ts
│   │   │   ├── sortByIndex.ts
│   │   │   └── groupByCategory.ts
│   │   └── ports/
│   │       └── ITravelDataSource.ts
│   ├── features/
│   │   ├── travel-card/
│   │   ├── filter-bar/
│   │   ├── travel-grid/
│   │   ├── travel-detail/
│   │   ├── ambient-audio/
│   │   ├── starfield/
│   │   └── contribute/
│   ├── state/
│   │   ├── store.ts
│   │   ├── selectors.ts
│   │   └── social.ts
│   ├── shared/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── styles/
│   ├── lib/
│   │   ├── ErrorBoundary.tsx
│   │   ├── analytics.ts
│   │   └── logger.ts
│   └── data/
│       └── travels.json
└── src/__tests__/
    └── core/
        ├── filterTravels.test.ts
        ├── sortByIndex.test.ts
        └── groupByCategory.test.ts
```
