# 飞猪旅行「100种不可思议旅行」内容展示 MVP — 设计规格说明书

> 日期：2026-06-08 | 状态：待审核

---

## 1. 产品概述

**品牌**：飞猪旅行旗下子品牌「100种不可思议旅行」
**产品定位**：为 Z 世代（95后-00后）追求个性化、差异化旅行方式的用户提供灵感与发现渠道的内容展示 MVP
**核心差异**：拒绝同质化，以视觉氛围与情绪共鸣驱动内容发现

---

## 2. 用户画像

- 95后至00后 Z 世代
- 追求小众、反常规生活方式
- 视觉内容消费者
- 追求个性表达，想寻找能凸显个性的独特旅行方式
- 拒绝千篇一律，想发现有深度、有意义的旅行体验
- 注重审美表达，想获得视觉体验

---

## 3. 技术选型

| 层 | 选型 |
|---|---|
| 框架 | React 18+ |
| 语言 | TypeScript（strict mode） |
| 构建 | Vite 5+ |
| 路由 | React Router v6 |
| 状态管理 | Zustand |
| 样式 | CSS Modules + CSS 自定义属性（design tokens） |
| 动效 | CSS transitions + IntersectionObserver + 原生 parallax |
| 数据 | 静态 JSON（100 条 mock 数据） |
| 图片 | 外部 CDN 链接（Unsplash 风格） |

---

## 4. 架构：多范式融合

```
src/
├── core/           # 领域层 — 函数式编程（纯函数、不可变数据、谓词组合子）
│   ├── domain/     # Travel 实体、Filter 类型
│   ├── transforms/ # 筛选/排序/分组纯函数
│   └── ports/      # 数据源接口（后期接 API 只需新增 adapter）
│
├── features/       # 功能模块 — Compound Components（OOP 组合模式）
│   ├── travel-card/      # 卡片组件族
│   ├── filter-bar/       # 多维筛选栏
│   ├── travel-grid/      # 瀑布流
│   └── travel-detail/    # 沉浸式详情页
│
├── state/          # 响应式状态 — Event-driven（Zustand store + 事件总线）
│
├── shared/         # 共享 UI Kit + Hooks + Design Tokens
│
├── lib/            # AOP 横切关注点（ErrorBoundary、埋点装饰器、logger）
│
├── app/            # 入口、路由、Provider 装配
│
├── data/           # 静态 Mock 数据
│   └── travels.json  # 100 条旅行记录
│
└── main.tsx
```

### 范式融合映射

| 层 | 范式 | 职责 |
|---|---|---|
| core/ | 函数式编程 | Travel 实体、Filter 谓词组合子、不可变数据转换，零副作用 |
| features/ | OOP Compound Components | `<TravelCard.Image />` `<TravelCard.Mood />` 等组合式 API |
| state/ | 响应式事件驱动 | Zustand store + 事件总线，UI 订阅状态变更 |
| lib/ | AOP 横切 | ErrorBoundary 装饰器、分析埋点注入、性能监控 |

---

## 5. 领域模型

### 5.1 Travel 实体

```typescript
type TravelCategory = 'adventure' | 'healing' | 'cultural' | 'extreme' | 'mystery'

type MoodTag = '自由' | '震撼' | '治愈' | '孤独' | '热血' | '诗意' | '荒诞' | '静谧' | '复古' | '未来感'

interface Travel {
  id: string
  title: string
  subtitle: string
  category: TravelCategory
  unbelievableIndex: number           // 0-100
  indexBreakdown: {
    uniqueness: number                 // 独特性 40%
    depth: number                      // 深度 35%
    visualImpact: number               // 视觉冲击力 25%
  }
  primaryMood: MoodTag
  secondaryMood: MoodTag
  heroImage: string
  cardImage: string
  colorPalette: string[]              // 3-5色，用于氛围渲染
  narrative: {
    intro: string
    story: string[]
    travelerQuote?: string
    tip: string
  }
  destination: string
  duration: string
  bestSeason: string
  budget: '¥' | '¥¥' | '¥¥¥'
}
```

### 5.2 Filter 谓词系统

```typescript
interface FilterState {
  category: TravelCategory | 'all'
  mood: MoodTag | 'all'
  budget: ('¥' | '¥¥' | '¥¥¥') | 'all'
  unbelievableIndexMin: number
}

// 纯函数谓词组合子
type Predicate<T> = (item: T) => boolean
const and = <T>(...predicates: Predicate<T>[]): Predicate<T> => ...
const applyFilter = (travels: Travel[], filter: FilterState): Travel[]
```

---

## 6. 路由设计

| 路径 | 页面 | 说明 |
|---|---|---|
| `/browse` | 浏览页 | 筛选栏 + 卡片瀑布流 |
| `/browse/:id` | 详情页 | 沉浸式全屏叙事 |

- 详情页在 `/browse` 语境下打开，返回时保留筛选状态和滚动位置
- 根路径 `/` 重定向到 `/browse`

---

## 7. 组件树

```
<App>
  <ErrorBoundary>
    <StoreProvider>
      <BrowserRouter>
        <Route path="/browse">
          <BrowsePage>
            <AtmosphereBackground />
            <FilterBar>
              <FilterBar.Dimension />   // ×4
            </FilterBar>
            <TravelGrid>
              <AnimatedCounter />
              <MasonryLayout>
                <TravelCard>
                  <TravelCard.Image />
                  <TravelCard.Mood />
                  <TravelCard.Meta />
                </TravelCard>
              </MasonryLayout>
            </TravelGrid>
          </BrowsePage>
        </Route>
        <Route path="/browse/:id">
          <TravelDetail>
            <TravelDetail.Hero />
            <TravelDetail.Narrative />
            <TravelDetail.Atmosphere />
            <BackButton />
          </TravelDetail>
        </Route>
      </BrowserRouter>
    </StoreProvider>
  </ErrorBoundary>
</App>
```

---

## 8. 视觉设计系统

### 8.1 情绪方向

**C 类 — 情绪氛围流**：Apple TV 屏保 / Monument Valley 风格，暗色模式、渐变、毛玻璃、慢速视差滚动。

### 8.2 Design Tokens

```css
--bg-deep:       #0a0a0f;     /* 最深背景 */
--bg-surface:    #12121a;     /* 卡片表面 */
--glass-bg:      rgba(18,18,26,0.6);
--glass-border:  rgba(255,255,255,0.06);
--text-primary:  #f0ede8;     /* 暖白 */
--text-secondary: rgba(240,237,232,0.6);
/* 动态注入：--color-1, --color-2, --color-3 来自 Travel.colorPalette */
```

### 8.3 排版

- 标题字体：Space Grotesk（几何无衬线，有个性）
- 正文字体：Noto Serif SC（思源宋体，叙事感）
- 字号阶梯：12 / 14 / 16 / 20 / 32 / 48px

### 8.4 毛玻璃规范

```css
.glass {
  background: rgba(18, 18, 26, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
}
```

### 8.5 颜色表达

每张卡片/详情页从 `colorPalette` 提取颜色动态注入 CSS 变量，驱动：
- 卡片 hover 时的渐变发光边框
- 详情页背景氛围渐变
- 情绪标签颜色
- 瀑布流滚动时 AtmosphereBackground 全局渐变偏移

---

## 9. 状态管理

```typescript
interface AppState {
  filter: FilterState
  travels: Travel[]
  filteredTravels: Travel[]    // selector 派生
  setFilter: (patch: Partial<FilterState>) => void
  resetFilter: () => void
}
```

- Zustand 单一 store
- `filteredTravels` 由 selector 自动派生，过滤 + 排序
- 筛选变更不触发网络请求（纯内存计算）

---

## 10. 关键交互

| 交互 | 实现 |
|---|---|
| 筛选维度切换 | Zustand → selector 重算 → Grid 过渡动画 |
| 卡片 hover 视差 | `useParallax` hook，`translate3d()` GPU 合成 |
| 详情页入场/退场 | React Router + CSS `@keyframes`，`AnimatePresence` |
| 叙事段落淡入 | IntersectionObserver → `opacity` + `translateY` transition |
| 详情背景氛围 | `colorPalette` 渐变，随滚动位置偏移 |
| 返回保持状态 | Zustand 缓存 filter + 滚动位置 |
| `prefers-reduced-motion` | 全局检测，关闭视差和入场动效 |

---

## 11. 边界与异常处理

| 场景 | 策略 |
|---|---|
| 筛选结果为空 | EmptyState 组件 — "这个维度下的不可思议还在探索中…" + 渐变占位 |
| 图片加载失败 | 用 `colorPalette` 渲染渐变色占位图（fallback） |
| 路由 `:id` 不存在 | NotFound 组件 — 优雅返回，无技术感错误 |
| 全局异常 | ErrorBoundary → 氛围化错误页，不崩白屏 |
| 后期网络抖动 | 骨架屏（skeleton card），脉冲动画 |
| 图片懒加载 | IntersectionObserver + `loading="lazy"` |

---

## 12. 不在 MVP 范围

- 用户系统（注册/登录）
- 收藏/点赞/分享
- 后端 API / CMS
- SSR / SEO
- CI/CD
- E2E 测试
- 性能监控看板

---

## 13. 目录结构总览

```
flypig-100-travels/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
│   └── favicon.svg
└── src/
    ├── main.tsx
    ├── app/
    │   ├── App.tsx
    │   ├── router.tsx
    │   └── providers.tsx
    ├── core/
    │   ├── domain/
    │   │   ├── Travel.ts
    │   │   └── Filter.ts
    │   ├── transforms/
    │   │   ├── filterTravels.ts
    │   │   ├── sortByIndex.ts
    │   │   └── groupByCategory.ts
    │   └── ports/
    │       └── ITravelDataSource.ts
    ├── features/
    │   ├── travel-card/
    │   ├── filter-bar/
    │   ├── travel-grid/
    │   └── travel-detail/
    ├── state/
    │   ├── store.ts
    │   ├── events.ts
    │   └── selectors.ts
    ├── shared/
    │   ├── components/
    │   │   ├── GlassCard.tsx
    │   │   ├── GradientText.tsx
    │   │   ├── ParallaxLayer.tsx
    │   │   └── MoodTag.tsx
    │   ├── hooks/
    │   │   ├── useParallax.ts
    │   │   └── useMediaQuery.ts
    │   └── styles/
    │       ├── tokens.css
    │       └── glassmorphism.css
    ├── lib/
    │   ├── ErrorBoundary.tsx
    │   ├── analytics.ts
    │   └── logger.ts
    └── data/
        └── travels.json
```

---

## 14. 实现澄清（自审修正）

- **瀑布流**：使用 CSS `columns` 方案（`column-count: auto; column-width: 320px`），不引入 Masonry.js 等第三方库，MVP 足够。图片高度不一用 `column-break-inside: avoid`
- **AtmosphereBackground**：全屏 fixed 定位的 `<div>`，背景由当前筛选结果中第一张卡片的 `colorPalette` 驱动渲染径向渐变。筛选变化时 CSS `transition: background 800ms ease` 平滑过渡
- **AnimatedCounter**：`<AnimatedCounter />` 显示 "探索 N/100 种不可思议"，其中 N = `filteredTravels.length`，数字变化用 `requestAnimationFrame` 做缓动计数动画
- **骨架屏**：虽不在 MVP 数据请求路径上（静态 JSON），但 `<TravelCard.Skeleton />` 以 Compound Component 形式预留，内部用 `colorPalette` 渐变做脉冲
- **Mock 图片**：使用 `picsum.photos` 或 `unsplash` 的占位 URL 格式（如 `https://picsum.photos/seed/{id}/800/1000`），保证 100 张卡片视觉不重复
