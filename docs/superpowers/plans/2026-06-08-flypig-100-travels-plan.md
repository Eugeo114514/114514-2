# 飞猪「100种不可思议旅行」MVP — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个极简但生产级质感的旅行内容展示 MVP——多维筛选 + 卡片瀑布流浏览 + 沉浸式详情页。

**Architecture:** 多范式融合：core/ 层用函数式编程处理领域数据和筛选逻辑；features/ 层用 Compound Components 构建可组合 UI；state/ 层用 Zustand 响应式管理；lib/ 层 AOP 横切关注点。

**Tech Stack:** React 18 + TypeScript (strict) + Vite 5 + React Router v6 + Zustand + CSS Modules + CSS Custom Properties

---

## 文件结构映射

```
flypig-100-travels/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/favicon.svg
└── src/
    ├── main.tsx
    ├── vite-env.d.ts
    ├── app/
    │   ├── App.tsx
    │   ├── App.module.css
    │   ├── router.tsx
    │   ├── providers.tsx
    │   ├── pages/
    │   │   ├── BrowsePage.tsx
    │   │   ├── BrowsePage.module.css
    │   │   ├── AtmosphereBackground.tsx
    │   │   └── AtmosphereBackground.module.css
    │   (NotFound handled inline in TravelDetail)
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
    ├── data/
    │   └── travels.json
    ├── state/
    │   ├── store.ts
    │   └── selectors.ts
    ├── shared/
    │   ├── styles/
    │   │   ├── tokens.css
    │   │   ├── global.css
    │   │   └── glassmorphism.css
    │   ├── hooks/
    │   │   ├── useParallax.ts
    │   │   ├── useReducedMotion.ts
    │   │   └── useInView.ts
    │   └── components/
    │       ├── GlassCard.tsx
    │       ├── GlassCard.module.css
    │       ├── MoodTag.tsx
    │       ├── MoodTag.module.css
    │       ├── EmptyState.tsx
    │       ├── EmptyState.module.css
    │       ├── SkeletonCard.tsx
    │       └── SkeletonCard.module.css
    ├── features/
    │   ├── travel-card/
    │   │   ├── TravelCard.tsx
    │   │   ├── TravelCard.module.css
    │   │   ├── TravelCard.Image.tsx
    │   │   ├── TravelCard.Mood.tsx
    │   │   └── TravelCard.Meta.tsx
    │   │   ├── TravelCard.Title.tsx
    │   ├── filter-bar/
    │   │   ├── FilterBar.tsx
    │   │   ├── FilterBar.module.css
    │   │   └── FilterBar.Dimension.tsx
    │   ├── travel-grid/
    │   │   ├── TravelGrid.tsx
    │   │   ├── TravelGrid.module.css
    │   │   ├── MasonryLayout.tsx
    │   │   ├── MasonryLayout.module.css
    │   │   ├── AnimatedCounter.tsx
    │   │   └── AnimatedCounter.module.css
    │   └── travel-detail/
    │       ├── TravelDetail.tsx
    │       ├── TravelDetail.module.css
    │       ├── TravelDetail.Hero.tsx
    │       ├── TravelDetail.Narrative.tsx
    │       ├── TravelDetail.Atmosphere.tsx
    │       └── BackButton.tsx
    └── lib/
        ├── ErrorBoundary.tsx
        ├── analytics.ts
        └── logger.ts
```

---

### Task 1: 项目脚手架 — Vite + React + TypeScript 初始化

**Files:**
- Create: `package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `index.html`, `src/main.tsx`, `src/vite-env.d.ts`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "flypig-100-travels",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "zustand": "^4.5.4"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.4",
    "vite": "^5.4.0"
  }
}
```

- [ ] **Step 2: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: 创建 vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
})
```

- [ ] **Step 4: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="飞猪旅行 - 100种不可思议旅行" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Noto+Serif+SC:wght@400;600;700&display=swap" rel="stylesheet" />
    <title>100种不可思议旅行 - 飞猪</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: 创建 src/vite-env.d.ts**

```typescript
/// <reference types="vite/client" />

declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}
```

- [ ] **Step 6: 创建 src/main.tsx（最小入口）**

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 7: 安装依赖并验证启动**

Run: `cd flypig-100-travels && npm install`
Expected: dependencies installed

Run: `npm run dev`
Expected: Vite dev server starts, no compilation errors (App.tsx may have a placeholder error — that's fine, we create it next)

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React + TypeScript project"
```

---

### Task 2: 领域类型 — Travel 实体 & Filter 谓词系统

**Files:**
- Create: `src/core/domain/Travel.ts`, `src/core/domain/Filter.ts`

- [ ] **Step 1: 创建 Travel.ts — 实体类型与品牌类型**

```typescript
// src/core/domain/Travel.ts

export type TravelCategory = 'adventure' | 'healing' | 'cultural' | 'extreme' | 'mystery'

export const CATEGORY_LABELS: Record<TravelCategory, string> = {
  adventure: '冒险',
  healing: '治愈',
  cultural: '人文',
  extreme: '极限',
  mystery: '秘境',
}

export const ALL_CATEGORIES: TravelCategory[] = [
  'adventure', 'healing', 'cultural', 'extreme', 'mystery',
]

export type MoodTag =
  | '自由' | '震撼' | '治愈' | '孤独' | '热血'
  | '诗意' | '荒诞' | '静谧' | '复古' | '未来感'

export const ALL_MOODS: MoodTag[] = [
  '自由', '震撼', '治愈', '孤独', '热血',
  '诗意', '荒诞', '静谧', '复古', '未来感',
]

export type Budget = '¥' | '¥¥' | '¥¥¥'

export const BUDGET_LABELS: Record<Budget, string> = {
  '¥': '轻奢',
  '¥¥': '进阶',
  '¥¥¥': '顶配',
}

export interface Travel {
  id: string
  title: string
  subtitle: string
  category: TravelCategory

  unbelievableIndex: number
  indexBreakdown: {
    uniqueness: number
    depth: number
    visualImpact: number
  }

  primaryMood: MoodTag
  secondaryMood: MoodTag

  heroImage: string
  cardImage: string
  colorPalette: string[]

  narrative: {
    intro: string
    story: string[]
    travelerQuote?: string
    tip: string
  }

  destination: string
  duration: string
  bestSeason: string
  budget: Budget
}
```

- [ ] **Step 2: 创建 Filter.ts — 筛选状态与谓词类型**

```typescript
// src/core/domain/Filter.ts

import type { TravelCategory, MoodTag, Budget } from './Travel'

export interface FilterState {
  category: TravelCategory | 'all'
  mood: MoodTag | 'all'
  budget: Budget | 'all'
  unbelievableIndexMin: number
}

export const DEFAULT_FILTER: FilterState = {
  category: 'all',
  mood: 'all',
  budget: 'all',
  unbelievableIndexMin: 0,
}

export type Predicate<T> = (item: T) => boolean
```

- [ ] **Step 3: 验证编译**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/core/domain/
git commit -m "feat: define Travel entity and Filter domain types"
```

---

### Task 3: 领域变换 — 纯函数筛选/排序/分组

**Files:**
- Create: `src/core/transforms/sortByIndex.ts`, `src/core/transforms/filterTravels.ts`, `src/core/transforms/groupByCategory.ts`

- [ ] **Step 1: 创建 sortByIndex.ts**

```typescript
// src/core/transforms/sortByIndex.ts

import type { Travel } from '../domain/Travel'

/**
 * 按不可思议指数降序排列（纯函数，返回新数组）
 */
export const sortByIndex = (travels: Travel[]): Travel[] =>
  [...travels].sort((a, b) => b.unbelievableIndex - a.unbelievableIndex)
```

- [ ] **Step 2: 创建 filterTravels.ts**

```typescript
// src/core/transforms/filterTravels.ts

import type { Travel } from '../domain/Travel'
import type { FilterState, Predicate } from '../domain/Filter'
import { sortByIndex } from './sortByIndex'

const and = <T>(...predicates: Predicate<T>[]): Predicate<T> =>
  (item) => predicates.every(p => p(item))

const byCategory = (c: FilterState['category']): Predicate<Travel> =>
  c === 'all' ? () => true : (t) => t.category === c

const byMood = (m: FilterState['mood']): Predicate<Travel> =>
  m === 'all' ? () => true : (t) => t.primaryMood === m || t.secondaryMood === m

const byBudget = (b: FilterState['budget']): Predicate<Travel> =>
  b === 'all' ? () => true : (t) => {
    const tiers: Array<'¥' | '¥¥' | '¥¥¥'> = ['¥', '¥¥', '¥¥¥']
    return tiers.indexOf(t.budget) <= tiers.indexOf(b)
  }

const byUnbelievableIndexMin = (min: number): Predicate<Travel> =>
  (t) => t.unbelievableIndex >= min

/**
 * 应用筛选条件，返回排序后的结果（纯函数）
 */
export const applyFilter = (travels: Travel[], filter: FilterState): Travel[] => {
  const filtered = travels.filter(and(
    byCategory(filter.category),
    byMood(filter.mood),
    byBudget(filter.budget),
    byUnbelievableIndexMin(filter.unbelievableIndexMin),
  ))
  return sortByIndex(filtered)
}
```

- [ ] **Step 3: 创建 groupByCategory.ts**

```typescript
// src/core/transforms/groupByCategory.ts

import type { Travel, TravelCategory } from '../domain/Travel'

/**
 * 按类别分组旅行（纯函数）
 */
export const groupByCategory = (travels: Travel[]): Record<TravelCategory, Travel[]> => {
  const groups: Record<TravelCategory, Travel[]> = {
    adventure: [],
    healing: [],
    cultural: [],
    extreme: [],
    mystery: [],
  }
  for (const t of travels) {
    groups[t.category].push(t)
  }
  return groups
}
```

- [ ] **Step 4: 验证编译**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/core/transforms/
git commit -m "feat: add pure function transforms for filter/sort/group"
```

---

### Task 4: 数据源端口 & Mock 数据

**Files:**
- Create: `src/core/ports/ITravelDataSource.ts`, `src/data/travels.json`

- [ ] **Step 1: 创建数据源接口**

```typescript
// src/core/ports/ITravelDataSource.ts

import type { Travel } from '../domain/Travel'

export interface ITravelDataSource {
  getAll(): Travel[]
  getById(id: string): Travel | undefined
}
```

- [ ] **Step 2: 创建 travels.json（首条样本 + 生成脚本说明）**

创建 `src/data/travels.json`，包含以下结构。手工写入 8 条真实感数据（覆盖 5 个 category + 多样 mood），其余由脚本模板生成至 100 条：

```json
[
  {
    "id": "aurora-glass-house",
    "title": "在北极圈的玻璃屋里等一场极光",
    "subtitle": "躺在暖气里，看绿色光河在天花板上流淌",
    "category": "healing",
    "unbelievableIndex": 94,
    "indexBreakdown": { "uniqueness": 38, "depth": 32, "visualImpact": 24 },
    "primaryMood": "静谧",
    "secondaryMood": "震撼",
    "heroImage": "https://picsum.photos/seed/aurora1/1200/800",
    "cardImage": "https://picsum.photos/seed/aurora1/600/800",
    "colorPalette": ["#0a2a1a", "#1a4a3a", "#7ab89a", "#c8f0d8", "#e8fff0"],
    "narrative": {
      "intro": "挪威·特罗姆瑟 | 当极光在头顶舞动，时间变得不再重要",
      "story": [
        "飞机降落在特罗姆瑟时，气温是零下 18 度。你裹着厚重的羽绒服走出机场，呼出的白气在黑暗中消散。",
        "来接你的当地人说，今晚 KP 指数很高——意思是极光会很活跃。",
        "玻璃屋坐落在峡湾边的山坡上，四周无人，只有风和雪。你躺下来，天花板是透明的。",
        "凌晨 1 点，它出现了。不是突然的——先是一条淡绿色的丝带，慢慢变宽，变成流淌的河。",
        "你在暖气里看着它在头顶翻涌，觉得有些东西在手机屏幕里永远感受不到。"
      ],
      "travelerQuote": "我不是来看极光的，我是来确认有些美还存在。",
      "tip": "12月到次年3月是最佳观测期，玻璃屋需提前3个月预订。记得带一本可以读很久的书——等待本身就是体验的一部分。"
    },
    "destination": "挪威·特罗姆瑟",
    "duration": "5天4晚",
    "bestSeason": "12月-3月",
    "budget": "¥¥¥"
  }
]
```

> **注意**：完整的 `travels.json` 需包含 100 条记录。此处提供首条完整样本作为模板。后续 Step 2b 用 Node.js 脚本生成剩余 92 条（手工写 8 条高质感种子 + 脚本批量扩展），确保每个 category ~20 条、覆盖所有 MoodTag。

- [ ] **Step 2b: 编写数据生成脚本（gen-travels.mjs，项目根目录，用完即弃）**

```javascript
// gen-travels.mjs — 基于 8 条种子数据 + 模板变体生成 100 条 travels.json
// Run: node gen-travels.mjs

import { writeFileSync } from 'fs'

const CATEGORIES = ['adventure','healing','cultural','extreme','mystery']
const MOODS = ['自由','震撼','治愈','孤独','热血','诗意','荒诞','静谧','复古','未来感']
const BUDGETS = ['¥','¥¥','¥¥¥']
const TITLES_BY_CAT = {
  adventure: [
    '在撒哈拉的星空下听一场沙漠交响','徒步穿越冰岛火山熔岩隧道',
    '划独木舟穿越越南下龙湾的迷雾','在纳米比亚沙漠追逐濒危黑犀牛',
    '骑着摩托穿越阿尔巴尼亚被遗忘的山路',
  ],
  healing: [
    '在北极圈的玻璃屋里等一场极光','在日本白川乡合掌造醒来听雪落下的声音',
    '在巴厘岛丛林深处的竹屋里练习冥想','在冰岛蓝湖的蒸汽中看极光漫舞',
    '在云南沙溪古镇跟着马帮走一段茶马古道',
  ],
  cultural: [
    '在摩洛哥菲斯古城跟老匠人学一天皮革染制','在缅甸蒲甘的千塔之间坐一次热气球',
    '在秘鲁的马丘比丘等一场云开雾散的日出','在土耳其卡帕多奇亚的洞穴里住一晚',
    '在乌兹别克斯坦的丝绸之路驿站听一段史诗',
  ],
  extreme: [
    '在南极的冰盖上露营，听冰川崩裂的声音','在挪威峡湾的悬崖上搭帐篷过夜',
    '在玻利维亚的天空之镜追逐一场雷暴','在阿拉斯加冰川洞穴里划皮划艇',
    '在瓦努阿图火山口边缘看岩浆喷涌',
  ],
  mystery: [
    '在格鲁吉亚的梅斯蒂亚寻找失落的塔楼村庄','在老挝琅勃拉邦的清晨布施中寻找平静',
    '在埃塞俄比亚的拉利贝拉地下教堂里沉思','在马达加斯加的猴面包树大道上漫步',
    '在吉尔吉斯斯坦的雪山牧场里做一周牧民',
  ],
}
const PALETTES = [
  ['#0a2a1a','#1a4a3a','#7ab89a','#c8f0d8','#e8fff0'],
  ['#1a1a2e','#16213e','#0f3460','#533483','#e94560'],
  ['#2d1b00','#5c3d1a','#b8860b','#f5d08c','#fff8e7'],
  ['#0d1b2a','#1b2838','#415a77','#778da9','#e0e1dd'],
  ['#1a0a0a','#3d1111','#8b1a1a','#d44a2a','#f0a060'],
]

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function seed(id) { return `${id}-${Date.now()}-${Math.random()}` }

const travels = []
let idx = 1
for (const cat of CATEGORIES) {
  const titles = TITLES_BY_CAT[cat]
  for (let i = 0; i < 20; i++) {
    const title = titles[i % titles.length] + (i >= titles.length ? ` (${Math.floor(i/titles.length)+1})` : '')
    const m1 = pick(MOODS)
    let m2 = pick(MOODS); while (m2 === m1) m2 = pick(MOODS)
    const palette = PALETTES[idx % PALETTES.length]
    const budget = BUDGETS[idx % BUDGETS.length]
    const uniqueness = 25 + Math.floor(Math.random() * 15)
    const depth = 20 + Math.floor(Math.random() * 15)
    const visualImpact = 15 + Math.floor(Math.random() * 10)

    travels.push({
      id: `${cat}-${idx}`,
      title,
      subtitle: `一种让你重新认识${cat === 'adventure' ? '勇气' : cat === 'healing' ? '宁静' : cat === 'cultural' ? '文明' : cat === 'extreme' ? '极限' : '未知'}的旅行方式`,
      category: cat,
      unbelievableIndex: uniqueness + depth + visualImpact,
      indexBreakdown: { uniqueness, depth, visualImpact },
      primaryMood: m1,
      secondaryMood: m2,
      heroImage: `https://picsum.photos/seed/flypig${idx}h/1200/800`,
      cardImage: `https://picsum.photos/seed/flypig${idx}c/600/800`,
      colorPalette: palette,
      narrative: {
        intro: `目的地 #${idx} | 有些体验无法被算法推荐`,
        story: [
          `第 ${idx} 段旅程开始于一个偶然的决定。`,
          '有时候最不可思议的，不是目的地，而是你在路上重新认识了自己。',
          '当地人告诉你一个秘密：游客永远不会知道的地方。',
          '你去了。然后明白了一些事。',
          '回来之后，你发现自己不再是出发时的那个人。',
        ],
        travelerQuote: pick(['不走出去，以为眼前就是世界。','旅行的意义不在于抵达，而在于出发。','有些风景，必须亲自去看。']),
        tip: `最佳季节：${pick(['3-5月','6-8月','9-11月','12-2月'])}，建议${pick(['提前1个月','提前3个月','提前半年'])}预订。`,
      },
      destination: pick(['挪威','日本','摩洛哥','冰岛','秘鲁','玻利维亚','格鲁吉亚','埃塞俄比亚','乌兹别克斯坦','老挝','缅甸','马达加斯加','纳米比亚','吉尔吉斯斯坦','阿尔巴尼亚','越南','土耳其','瓦努阿图','阿拉斯加','南极']) + pick(['','·北部','·南部','·东部','·西部']),
      duration: pick(['3天2晚','5天4晚','7天6晚','10天9晚','14天13晚']),
      bestSeason: pick(['3-5月','6-8月','9-11月','12-2月','全年皆宜']),
      budget,
    })
    idx++
  }
}

// 用 8 条手工种子数据替换前 8 条（保留生成结构但标题/叙事手工打磨）
// 手工数据以第一条 aurora-glass-house 为模板，其余 7 条在实现时手工编写

writeFileSync('src/data/travels.json', JSON.stringify(travels, null, 2), 'utf8')
console.log(`Generated ${travels.length} travels → src/data/travels.json`)
```

Run: `node gen-travels.mjs`
Expected: `Generated 100 travels → src/data/travels.json`

Then replace the first 8 entries with hand-crafted narratives following the aurora-glass-house template.

- [ ] **Step 3: 验证 JSON 格式**

Run: `node -e "JSON.parse(require('fs').readFileSync('src/data/travels.json','utf8')); console.log('Valid JSON')"`
Expected: Valid JSON

- [ ] **Step 4: 验证编译**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/core/ports/ src/data/
git commit -m "feat: add data source port interface and mock travel data"
```

---

### Task 5: Design Tokens & 全局样式

**Files:**
- Create: `src/shared/styles/tokens.css`, `src/shared/styles/global.css`, `src/shared/styles/glassmorphism.css`

- [ ] **Step 1: 创建 tokens.css**

```css
/* src/shared/styles/tokens.css */

:root {
  /* ———— 暗色基底 ———— */
  --bg-deep: #0a0a0f;
  --bg-surface: #12121a;
  --bg-elevated: #1a1a26;

  /* ———— 毛玻璃 ———— */
  --glass-bg: rgba(18, 18, 26, 0.6);
  --glass-bg-hover: rgba(18, 18, 26, 0.8);
  --glass-border: rgba(255, 255, 255, 0.06);
  --glass-border-hover: rgba(255, 255, 255, 0.12);
  --glass-blur: 20px;

  /* ———— 文字 ———— */
  --text-primary: #f0ede8;
  --text-secondary: rgba(240, 237, 232, 0.6);
  --text-tertiary: rgba(240, 237, 232, 0.35);

  /* ———— 排版 ———— */
  --font-display: 'Space Grotesk', system-ui, sans-serif;
  --font-body: 'Noto Serif SC', 'Source Han Serif SC', serif;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.25rem;
  --text-xl: 1.5rem;
  --text-2xl: 2rem;
  --text-3xl: 3rem;

  /* ———— 间距 ———— */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* ———— 圆角 ———— */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  /* ———— 动效 ———— */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
  --duration-fast: 200ms;
  --duration-normal: 400ms;
  --duration-slow: 800ms;

  /* ———— 动态颜色（由 JS 注入） ———— */
  --color-1: #1a1a2e;
  --color-2: #16213e;
  --color-3: #0f3460;
}
```

- [ ] **Step 2: 创建 global.css**

```css
/* src/shared/styles/global.css */

@import './tokens.css';
@import './glassmorphism.css';

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

body {
  font-family: var(--font-body);
  background: var(--bg-deep);
  color: var(--text-primary);
  line-height: 1.6;
  overflow-x: hidden;
  min-height: 100vh;
}

#root {
  min-height: 100vh;
  isolation: isolate;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  font-weight: 600;
  line-height: 1.2;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  display: block;
  max-width: 100%;
}

button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
  color: inherit;
}

/* 减少动效偏好 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* 滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
```

- [ ] **Step 3: 创建 glassmorphism.css**

```css
/* src/shared/styles/glassmorphism.css */

.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
}

.glass-hover {
  transition: background var(--duration-fast) var(--ease-out-expo),
              border-color var(--duration-fast) var(--ease-out-expo),
              transform var(--duration-normal) var(--ease-out-quint);
}

.glass-hover:hover {
  background: var(--glass-bg-hover);
  border-color: var(--glass-border-hover);
}

.glass-flat {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}
```

- [ ] **Step 4: 验证编译**

Run: `npx tsc --noEmit`
Expected: no errors (CSS files don't affect TS)

- [ ] **Step 5: Commit**

```bash
git add src/shared/styles/
git commit -m "feat: add design tokens, global styles, and glassmorphism utilities"
```

---

### Task 6: 自定义 Hooks

**Files:**
- Create: `src/shared/hooks/useReducedMotion.ts`, `src/shared/hooks/useParallax.ts`, `src/shared/hooks/useInView.ts`

- [ ] **Step 1: 创建 useReducedMotion.ts**

```typescript
// src/shared/hooks/useReducedMotion.ts

import { useEffect, useState } from 'react'

export const useReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return reduced
}
```

- [ ] **Step 2: 创建 useParallax.ts**

```typescript
// src/shared/hooks/useParallax.ts

import { useRef, useEffect, useCallback } from 'react'
import { useReducedMotion } from './useReducedMotion'

interface ParallaxOptions {
  intensity?: number    // 默认 0.05，值越大偏移越大
  maxOffset?: number    // 最大偏移像素，默认 12
}

/**
 * 返回 ref 绑定到元素，hover/move 时产生微视差偏移
 */
export const useParallax = (options: ParallaxOptions = {}) => {
  const { intensity = 0.05, maxOffset = 12 } = options
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = useCallback((e: MouseEvent) => {
    if (reduced || !ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5   // -0.5 ~ 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    const offsetX = x * maxOffset * 2 * intensity / 0.05
    const offsetY = y * maxOffset * 2 * intensity / 0.05

    ref.current.style.transform = `perspective(1000px) translate3d(${offsetX}px, ${offsetY}px, 0)`
  }, [intensity, maxOffset, reduced])

  const handleLeave = useCallback(() => {
    if (!ref.current) return
    ref.current.style.transform = 'perspective(1000px) translate3d(0, 0, 0)'
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [handleMove, handleLeave])

  return ref
}
```

- [ ] **Step 3: 创建 useInView.ts**

```typescript
// src/shared/hooks/useInView.ts

import { useEffect, useRef, useState } from 'react'

interface UseInViewOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

/**
 * 元素进入视口时返回 true
 */
export const useInView = (options: UseInViewOptions = {}) => {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (triggerOnce) observer.unobserve(el)
        } else if (!triggerOnce) {
          setInView(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, triggerOnce])

  return { ref, inView }
}
```

- [ ] **Step 4: 验证编译**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/shared/hooks/
git commit -m "feat: add useReducedMotion, useParallax, useInView hooks"
```

---

### Task 7: 共享 UI 组件

**Files:**
- Create: `src/shared/components/GlassCard.tsx`, `src/shared/components/GlassCard.module.css`, `src/shared/components/MoodTag.tsx`, `src/shared/components/MoodTag.module.css`, `src/shared/components/EmptyState.tsx`, `src/shared/components/EmptyState.module.css`, `src/shared/components/SkeletonCard.tsx`, `src/shared/components/SkeletonCard.module.css`

- [ ] **Step 1: 创建 GlassCard.tsx + CSS Module**

```typescript
// src/shared/components/GlassCard.tsx

import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import styles from './GlassCard.module.css'

type GlassCardProps = ComponentPropsWithoutRef<'div'> & {
  interactive?: boolean
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ interactive = false, className = '', children, ...props }, ref) => {
    const cls = [
      styles.card,
      interactive ? styles.interactive : '',
      className,
    ].filter(Boolean).join(' ')

    return (
      <div ref={ref} className={cls} {...props}>
        {children}
      </div>
    )
  }
)

GlassCard.displayName = 'GlassCard'
```

```css
/* src/shared/components/GlassCard.module.css */

.card {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.interactive {
  transition: background var(--duration-fast) var(--ease-out-expo),
              border-color var(--duration-fast) var(--ease-out-expo),
              transform var(--duration-normal) var(--ease-out-quint),
              box-shadow var(--duration-normal) var(--ease-out-quint);
  cursor: pointer;
}

.interactive:hover {
  background: var(--glass-bg-hover);
  border-color: var(--glass-border-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}
```

- [ ] **Step 2: 创建 MoodTag.tsx + CSS Module**

```typescript
// src/shared/components/MoodTag.tsx

import type { MoodTag as MoodTagType } from '../../core/domain/Travel'
import styles from './MoodTag.module.css'

interface MoodTagProps {
  mood: MoodTagType
  size?: 'sm' | 'md'
}

export const MoodTag = ({ mood, size = 'sm' }: MoodTagProps) => (
  <span className={`${styles.tag} ${styles[size]}`} data-mood={mood}>
    {mood}
  </span>
)
```

```css
/* src/shared/components/MoodTag.module.css */

.tag {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-display);
  font-weight: 500;
  letter-spacing: 0.02em;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  color: var(--text-secondary);
  white-space: nowrap;
}

.sm {
  padding: 2px 10px;
  font-size: var(--text-xs);
}

.md {
  padding: 4px 14px;
  font-size: var(--text-sm);
}
```

- [ ] **Step 3: 创建 EmptyState.tsx + CSS Module**

```typescript
// src/shared/components/EmptyState.tsx

import styles from './EmptyState.module.css'

interface EmptyStateProps {
  message?: string
}

export const EmptyState = ({
  message = '这个维度下的不可思议还在探索中…',
}: EmptyStateProps) => (
  <div className={styles.container}>
    <div className={styles.gradient} />
    <p className={styles.message}>{message}</p>
  </div>
)
```

```css
/* src/shared/components/EmptyState.module.css */

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16);
  min-height: 300px;
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
}

.gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    var(--color-2) 0%,
    transparent 70%
  );
  opacity: 0.3;
  animation: pulse 3s ease-in-out infinite;
}

.message {
  position: relative;
  font-family: var(--font-display);
  font-size: var(--text-lg);
  color: var(--text-secondary);
  text-align: center;
}

@keyframes pulse {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.4; }
}
```

- [ ] **Step 4: 创建 SkeletonCard.tsx + CSS Module**

```typescript
// src/shared/components/SkeletonCard.tsx

import styles from './SkeletonCard.module.css'

export const SkeletonCard = () => (
  <div className={styles.card}>
    <div className={styles.image} />
    <div className={styles.body}>
      <div className={styles.tag} />
      <div className={styles.title} />
      <div className={styles.subtitle} />
    </div>
  </div>
)
```

```css
/* src/shared/components/SkeletonCard.module.css */

.card {
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--bg-surface);
  break-inside: avoid;
  margin-bottom: var(--space-4);
  animation: pulse 2s ease-in-out infinite;
}

.image {
  width: 100%;
  aspect-ratio: 3 / 4;
  background: linear-gradient(
    135deg,
    var(--color-1),
    var(--color-2),
    var(--color-3)
  );
}

.body {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.tag {
  width: 40px;
  height: 20px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.06);
}

.title {
  width: 80%;
  height: 18px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.06);
}

.subtitle {
  width: 60%;
  height: 14px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.04);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

- [ ] **Step 5: 验证编译**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/shared/components/
git commit -m "feat: add GlassCard, MoodTag, EmptyState, SkeletonCard shared components"
```

---

### Task 8: Lib 层 — ErrorBoundary & 横切关注点

**Files:**
- Create: `src/lib/logger.ts`, `src/lib/analytics.ts`, `src/lib/ErrorBoundary.tsx`

- [ ] **Step 1: 创建 logger.ts**

```typescript
// src/lib/logger.ts

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  data?: unknown
  timestamp: string
}

const formatEntry = (entry: LogEntry): string =>
  `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`

const createLogger = () => {
  const log = (level: LogLevel, message: string, data?: unknown) => {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    }

    if (import.meta.env.DEV) {
      const formatted = formatEntry(entry)
      switch (level) {
        case 'debug': console.debug(formatted, data ?? ''); break
        case 'info': console.info(formatted, data ?? ''); break
        case 'warn': console.warn(formatted, data ?? ''); break
        case 'error': console.error(formatted, data ?? ''); break
      }
    }
    // 生产环境可接入远程日志服务
  }

  return {
    debug: (msg: string, data?: unknown) => log('debug', msg, data),
    info: (msg: string, data?: unknown) => log('info', msg, data),
    warn: (msg: string, data?: unknown) => log('warn', msg, data),
    error: (msg: string, data?: unknown) => log('error', msg, data),
  }
}

export const logger = createLogger()
```

- [ ] **Step 2: 创建 analytics.ts**

```typescript
// src/lib/analytics.ts

type EventName =
  | 'filter_change'
  | 'card_click'
  | 'detail_view'
  | 'back_navigate'

interface AnalyticsEvent {
  name: EventName
  properties?: Record<string, string | number>
}

const track = (event: AnalyticsEvent) => {
  if (import.meta.env.DEV) {
    console.debug(`[Analytics] ${event.name}`, event.properties ?? {})
  }
  // 生产环境接入飞猪埋点 SDK
}

export const analytics = {
  filterChange: (dimension: string, value: string) =>
    track({ name: 'filter_change', properties: { dimension, value } }),

  cardClick: (travelId: string, travelTitle: string) =>
    track({ name: 'card_click', properties: { travelId, travelTitle } }),

  detailView: (travelId: string) =>
    track({ name: 'detail_view', properties: { travelId } }),

  backNavigate: (from: string) =>
    track({ name: 'back_navigate', properties: { from } }),
}
```

- [ ] **Step 3: 创建 ErrorBoundary.tsx**

```typescript
// src/lib/ErrorBoundary.tsx

import { Component, type ErrorInfo, type ReactNode } from 'react'
import { logger } from './logger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error('ErrorBoundary caught error', {
      error: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'var(--bg-deep)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-body)',
          padding: '2rem',
          gap: '1.5rem',
          textAlign: 'center',
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.08), transparent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
          }}>
            ✦
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>
            有些不可思议出了点意外
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 400 }}>
            刷新一下，奇迹可能就回来了
          </p>
          <button
            onClick={this.handleReset}
            style={{
              padding: '10px 24px',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '100px',
              background: 'rgba(255,255,255,0.06)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
              cursor: 'pointer',
            }}
          >
            再试一次
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

- [ ] **Step 4: 验证编译**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/lib/
git commit -m "feat: add ErrorBoundary, logger, and analytics cross-cutting concerns"
```

---

### Task 9: Zustand 状态管理

**Files:**
- Create: `src/state/store.ts`, `src/state/selectors.ts`

- [ ] **Step 1: 创建 store.ts**

```typescript
// src/state/store.ts

import { create } from 'zustand'
import type { Travel } from '../core/domain/Travel'
import type { FilterState } from '../core/domain/Filter'
import { DEFAULT_FILTER } from '../core/domain/Filter'
import { applyFilter } from '../core/transforms/filterTravels'
import { logger } from '../lib/logger'

interface AppState {
  // 原始数据
  travels: Travel[]

  // 筛选状态
  filter: FilterState

  // 派生数据
  filteredTravels: Travel[]

  // 操作
  setTravels: (travels: Travel[]) => void
  setFilter: (patch: Partial<FilterState>) => void
  resetFilter: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  travels: [],
  filter: { ...DEFAULT_FILTER },
  filteredTravels: [],

  setTravels: (travels: Travel[]) => {
    const { filter } = get()
    set({
      travels,
      filteredTravels: applyFilter(travels, filter),
    })
    logger.info(`Loaded ${travels.length} travels`)
  },

  setFilter: (patch: Partial<FilterState>) => {
    const { travels, filter } = get()
    const next = { ...filter, ...patch }
    set({
      filter: next,
      filteredTravels: applyFilter(travels, next),
    })
  },

  resetFilter: () => {
    const { travels } = get()
    set({
      filter: { ...DEFAULT_FILTER },
      filteredTravels: applyFilter(travels, DEFAULT_FILTER),
    })
  },
}))
```

- [ ] **Step 2: 创建 selectors.ts**

```typescript
// src/state/selectors.ts

import { useAppStore } from './store'
import type { Travel } from '../core/domain/Travel'

export const useFilteredTravels = (): Travel[] =>
  useAppStore((s) => s.filteredTravels)

export const useTravelCount = (): { filtered: number; total: number } =>
  useAppStore((s) => ({
    filtered: s.filteredTravels.length,
    total: s.travels.length,
  }))

export const useFilter = () => useAppStore((s) => s.filter)

export const useTravelById = (id: string): Travel | undefined =>
  useAppStore((s) => s.travels.find((t) => t.id === id))

export const useSetFilter = () => useAppStore((s) => s.setFilter)
export const useResetFilter = () => useAppStore((s) => s.resetFilter)
export const useSetTravels = () => useAppStore((s) => s.setTravels)
```

- [ ] **Step 3: 验证编译**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/state/
git commit -m "feat: add Zustand store with derived selectors"
```

---

### Task 10: TravelCard 组件族（Compound Components）

**Files:**
- Create: `src/features/travel-card/TravelCard.tsx`, `src/features/travel-card/TravelCard.module.css`, `src/features/travel-card/TravelCard.Image.tsx`, `src/features/travel-card/TravelCard.Mood.tsx`, `src/features/travel-card/TravelCard.Meta.tsx`

- [ ] **Step 1: 创建 TravelCard.tsx（根组件 + Context）**

```typescript
// src/features/travel-card/TravelCard.tsx

import { createContext, useContext, type ReactNode } from 'react'
import type { Travel } from '../../core/domain/Travel'
import { useParallax } from '../../shared/hooks/useParallax'
import styles from './TravelCard.module.css'

interface TravelCardContextValue {
  travel: Travel
}

const TravelCardContext = createContext<TravelCardContextValue | null>(null)

const useTravelCard = () => {
  const ctx = useContext(TravelCardContext)
  if (!ctx) throw new Error('TravelCard sub-components must be used inside <TravelCard>')
  return ctx
}

interface TravelCardProps {
  travel: Travel
  children: ReactNode
  onClick?: () => void
}

export const TravelCard = ({ travel, children, onClick }: TravelCardProps) => {
  const parallaxRef = useParallax({ intensity: 0.03, maxOffset: 8 })

  const handleClick = () => {
    // 注入 CSS 变量用于氛围色
    const root = document.documentElement
    root.style.setProperty('--color-1', travel.colorPalette[0] ?? '#1a1a2e')
    root.style.setProperty('--color-2', travel.colorPalette[1] ?? '#16213e')
    root.style.setProperty('--color-3', travel.colorPalette[2] ?? '#0f3460')
    onClick?.()
  }

  return (
    <TravelCardContext.Provider value={{ travel }}>
      <div
        ref={parallaxRef}
        className={styles.card}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') handleClick() }}
      >
        {children}
      </div>
    </TravelCardContext.Provider>
  )
}

export { useTravelCard }
```

- [ ] **Step 2: 创建 TravelCard.module.css**

```css
/* src/features/travel-card/TravelCard.module.css */

.card {
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  cursor: pointer;
  transition: transform var(--duration-normal) var(--ease-out-quint),
              border-color var(--duration-fast) var(--ease-out-expo),
              box-shadow var(--duration-normal) var(--ease-out-quint);
  transition-property: transform, border-color, box-shadow;
  break-inside: avoid;
  margin-bottom: var(--space-4);
  will-change: transform;
}

.card:hover {
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
}

.card:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.3);
  outline-offset: 2px;
}

.imageWrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.image {
  width: 100%;
  display: block;
  transition: transform var(--duration-slow) var(--ease-out-expo);
}

.card:hover .image {
  transform: scale(1.03);
}

.imageFallback {
  width: 100%;
  aspect-ratio: 3 / 4;
  background: linear-gradient(
    135deg,
    var(--color-1),
    var(--color-2),
    var(--color-3)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  color: rgba(255, 255, 255, 0.2);
}

.body {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.title {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.subtitle {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  font-family: var(--font-display);
}

.moodRow {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}
```

- [ ] **Step 3: 创建子组件**

```typescript
// src/features/travel-card/TravelCard.Image.tsx

import { useState } from 'react'
import { useTravelCard } from './TravelCard'
import styles from './TravelCard.module.css'

export const TravelCardImage = () => {
  const { travel } = useTravelCard()
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={styles.imageFallback}
        style={{
          background: `linear-gradient(135deg, ${travel.colorPalette[0] ?? '#1a1a2e'}, ${travel.colorPalette[2] ?? '#0f3460'})`,
        }}
      >
        ✦
      </div>
    )
  }

  return (
    <div className={styles.imageWrapper}>
      <img
        src={travel.cardImage}
        alt={travel.title}
        className={styles.image}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  )
}
```

```typescript
// src/features/travel-card/TravelCard.Mood.tsx

import { useTravelCard } from './TravelCard'
import { MoodTag } from '../../shared/components/MoodTag'
import styles from './TravelCard.module.css'

export const TravelCardMood = () => {
  const { travel } = useTravelCard()

  return (
    <div className={styles.moodRow}>
      <MoodTag mood={travel.primaryMood} />
      <MoodTag mood={travel.secondaryMood} />
    </div>
  )
}
```

```typescript
// src/features/travel-card/TravelCard.Meta.tsx

import { useTravelCard } from './TravelCard'
import styles from './TravelCard.module.css'

export const TravelCardMeta = () => {
  const { travel } = useTravelCard()

  return (
    <div className={styles.meta}>
      <span>{travel.destination}</span>
      <span aria-hidden="true">·</span>
      <span>{travel.duration}</span>
    </div>
  )
}
```

```typescript
// src/features/travel-card/TravelCard.Title.tsx

import { useTravelCard } from './TravelCard'
import styles from './TravelCard.module.css'

export const TravelCardTitle = () => {
  const { travel } = useTravelCard()
  return <h3 className={styles.title}>{travel.title}</h3>
}

export const TravelCardSubtitle = () => {
  const { travel } = useTravelCard()
  return <p className={styles.subtitle}>{travel.subtitle}</p>
}
```

- [ ] **Step 4: 验证编译**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/features/travel-card/
git commit -m "feat: add TravelCard compound component family"
```

---

### Task 11: FilterBar 组件

**Files:**
- Create: `src/features/filter-bar/FilterBar.tsx`, `src/features/filter-bar/FilterBar.module.css`, `src/features/filter-bar/FilterBar.Dimension.tsx`

- [ ] **Step 1: 创建 FilterBar.Dimension.tsx**

```typescript
// src/features/filter-bar/FilterBar.Dimension.tsx

import { type ReactNode } from 'react'
import styles from './FilterBar.module.css'

interface DimensionOption<T extends string> {
  value: T
  label: string
}

interface FilterBarDimensionProps<T extends string> {
  label: string
  options: DimensionOption<T>[]
  value: T
  onChange: (value: T) => void
  icon?: ReactNode
}

export const FilterBarDimension = <T extends string>({
  label,
  options,
  value,
  onChange,
  icon,
}: FilterBarDimensionProps<T>) => (
  <div className={styles.dimension} role="radiogroup" aria-label={label}>
    {icon && <span className={styles.icon}>{icon}</span>}
    <span className={styles.label}>{label}</span>
    <div className={styles.options}>
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`${styles.option} ${value === opt.value ? styles.active : ''}`}
          role="radio"
          aria-checked={value === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
)
```

- [ ] **Step 2: 创建 FilterBar.tsx**

```typescript
// src/features/filter-bar/FilterBar.tsx

import { useFilter, useSetFilter, useResetFilter } from '../../state/selectors'
import { ALL_CATEGORIES, CATEGORY_LABELS, ALL_MOODS, BUDGET_LABELS } from '../../core/domain/Travel'
import type { TravelCategory, MoodTag, Budget } from '../../core/domain/Travel'
import type { FilterState } from '../../core/domain/Filter'
import { analytics } from '../../lib/analytics'
import { FilterBarDimension } from './FilterBar.Dimension'
import styles from './FilterBar.module.css'

export const FilterBar = () => {
  const filter = useFilter()
  const setFilter = useSetFilter()
  const resetFilter = useResetFilter()

  const categoryOptions = [
    { value: 'all' as const, label: '全部' },
    ...ALL_CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABELS[c] })),
  ]

  const moodOptions = [
    { value: 'all' as const, label: '全部' },
    ...ALL_MOODS.map((m) => ({ value: m, label: m })),
  ]

  const budgetOptions = [
    { value: 'all' as const, label: '不限' },
    ...(['¥', '¥¥', '¥¥¥'] as Budget[]).map((b) => ({
      value: b,
      label: BUDGET_LABELS[b],
    })),
  ]

  const handleCategoryChange = (value: TravelCategory | 'all') => {
    setFilter({ category: value })
    analytics.filterChange('category', value)
  }

  const handleMoodChange = (value: MoodTag | 'all') => {
    setFilter({ mood: value })
    analytics.filterChange('mood', value)
  }

  const handleBudgetChange = (value: Budget | 'all') => {
    setFilter({ budget: value })
    analytics.filterChange('budget', value)
  }

  const isFilterActive = filter.category !== 'all' || filter.mood !== 'all' || filter.budget !== 'all'

  return (
    <div className={styles.bar}>
      <div className={styles.dimensions}>
        <FilterBarDimension
          label="类型"
          options={categoryOptions}
          value={filter.category}
          onChange={handleCategoryChange}
        />
        <FilterBarDimension
          label="情绪"
          options={moodOptions}
          value={filter.mood}
          onChange={handleMoodChange}
          icon="🎭"
        />
        <FilterBarDimension
          label="预算"
          options={budgetOptions}
          value={filter.budget}
          onChange={handleBudgetChange}
          icon="💰"
        />
      </div>
      {isFilterActive && (
        <button className={styles.reset} onClick={resetFilter}>
          清除筛选
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 3: 创建 FilterBar.module.css**

```css
/* src/features/filter-bar/FilterBar.module.css */

.bar {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: var(--space-4) var(--space-6);
  background: rgba(10, 10, 15, 0.8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.dimensions {
  display: flex;
  gap: var(--space-6);
  flex-wrap: wrap;
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.dimensions::-webkit-scrollbar {
  display: none;
}

.dimension {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}

.icon {
  font-size: var(--text-sm);
  opacity: 0.7;
}

.label {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-right: var(--space-2);
}

.options {
  display: flex;
  gap: var(--space-1);
}

.option {
  padding: 4px 12px;
  border-radius: 100px;
  font-family: var(--font-display);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid transparent;
  transition: all var(--duration-fast) var(--ease-out-expo);
  cursor: pointer;
  white-space: nowrap;
}

.option:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.active {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.1);
}

.reset {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  padding: 4px 12px;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all var(--duration-fast) var(--ease-out-expo);
  flex-shrink: 0;
}

.reset:hover {
  color: var(--text-primary);
  border-color: rgba(255, 255, 255, 0.2);
}
```

- [ ] **Step 4: 验证编译**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/features/filter-bar/
git commit -m "feat: add FilterBar with category/mood/budget dimensions"
```

---

### Task 12: TravelGrid & AnimatedCounter & MasonryLayout

**Files:**
- Create: `src/features/travel-grid/MasonryLayout.tsx`, `src/features/travel-grid/MasonryLayout.module.css`, `src/features/travel-grid/AnimatedCounter.tsx`, `src/features/travel-grid/AnimatedCounter.module.css`, `src/features/travel-grid/TravelGrid.tsx`, `src/features/travel-grid/TravelGrid.module.css`

- [ ] **Step 1: 创建 MasonryLayout.tsx**

```typescript
// src/features/travel-grid/MasonryLayout.tsx

import { type ReactNode } from 'react'
import styles from './MasonryLayout.module.css'

interface MasonryLayoutProps {
  children: ReactNode
}

export const MasonryLayout = ({ children }: MasonryLayoutProps) => (
  <div className={styles.masonry}>
    {children}
  </div>
)
```

```css
/* src/features/travel-grid/MasonryLayout.module.css */

.masonry {
  column-count: auto;
  column-width: 320px;
  column-gap: var(--space-4);
  padding: 0 var(--space-4);
}

@media (min-width: 768px) {
  .masonry {
    column-width: 340px;
    padding: 0 var(--space-6);
  }
}

@media (min-width: 1200px) {
  .masonry {
    column-width: 360px;
    padding: 0 var(--space-8);
  }
}
```

- [ ] **Step 2: 创建 AnimatedCounter.tsx**

```typescript
// src/features/travel-grid/AnimatedCounter.tsx

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../shared/hooks/useReducedMotion'
import styles from './AnimatedCounter.module.css'

interface AnimatedCounterProps {
  value: number
  total: number
}

export const AnimatedCounter = ({ value, total }: AnimatedCounterProps) => {
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(value)
  const prevRef = useRef(value)
  const rafRef = useRef<number>()

  useEffect(() => {
    if (reduced) {
      setDisplay(value)
      return
    }

    const from = prevRef.current
    const to = value
    const duration = 400
    const start = performance.now()

    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // ease-out-expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setDisplay(Math.round(from + (to - from) * eased))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    prevRef.current = value

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [value, reduced])

  return (
    <div className={styles.counter}>
      <span className={styles.number}>{display}</span>
      <span className={styles.sep}>/</span>
      <span className={styles.total}>{total}</span>
      <span className={styles.label}>种不可思议</span>
    </div>
  )
}
```

```css
/* src/features/travel-grid/AnimatedCounter.module.css */

.counter {
  display: flex;
  align-items: baseline;
  gap: var(--space-1);
  padding: var(--space-4) var(--space-4);
  font-family: var(--font-display);
}

.number {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.sep {
  font-size: var(--text-lg);
  color: var(--text-tertiary);
  font-weight: 400;
}

.total {
  font-size: var(--text-lg);
  color: var(--text-tertiary);
  font-weight: 400;
}

.label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-left: var(--space-1);
}

@media (min-width: 768px) {
  .counter {
    padding: var(--space-6) var(--space-6);
  }
  .number {
    font-size: var(--text-3xl);
  }
}
```

- [ ] **Step 3: 创建 TravelGrid.tsx**

```typescript
// src/features/travel-grid/TravelGrid.tsx

import { useNavigate } from 'react-router-dom'
import { useFilteredTravels, useTravelCount } from '../../state/selectors'
import { analytics } from '../../lib/analytics'
import { TravelCard } from '../travel-card/TravelCard'
import { TravelCardImage } from '../travel-card/TravelCard.Image'
import { TravelCardMood } from '../travel-card/TravelCard.Mood'
import { TravelCardMeta } from '../travel-card/TravelCard.Meta'
import { TravelCardTitle, TravelCardSubtitle } from '../travel-card/TravelCard.Title'
import { EmptyState } from '../../shared/components/EmptyState'
import { MasonryLayout } from './MasonryLayout'
import { AnimatedCounter } from './AnimatedCounter'
import styles from './TravelGrid.module.css'

export const TravelGrid = () => {
  const travels = useFilteredTravels()
  const { total } = useTravelCount()
  const navigate = useNavigate()

  const handleCardClick = (id: string, title: string) => {
    analytics.cardClick(id, title)
    navigate(`/browse/${id}`)
  }

  return (
    <div className={styles.container}>
      <AnimatedCounter value={travels.length} total={total} />
      {travels.length === 0 ? (
        <EmptyState />
      ) : (
        <MasonryLayout>
          {travels.map((travel) => (
            <TravelCard
              key={travel.id}
              travel={travel}
              onClick={() => handleCardClick(travel.id, travel.title)}
            >
              <TravelCardImage />
              <div className={styles.cardBody}>
                <TravelCardMood />
                <TravelCardTitle />
                <TravelCardSubtitle />
                <TravelCardMeta />
              </div>
            </TravelCard>
          ))}
        </MasonryLayout>
      )}
    </div>
  )
}
```

```css
/* src/features/travel-grid/TravelGrid.module.css */

.container {
  padding-bottom: var(--space-16);
}

.cardBody {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
```

- [ ] **Step 4: 验证编译**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/features/travel-grid/
git commit -m "feat: add TravelGrid with MasonryLayout and AnimatedCounter"
```

---

### Task 13: BrowsePage 页面 & AtmosphereBackground

**Files:**
- Create: `src/app/pages/BrowsePage.tsx`, `src/app/pages/BrowsePage.module.css`, `src/app/pages/AtmosphereBackground.tsx`, `src/app/pages/AtmosphereBackground.module.css`

- [ ] **Step 1: 创建 AtmosphereBackground.tsx**

```typescript
// src/app/pages/AtmosphereBackground.tsx

import { useFilteredTravels } from '../../state/selectors'
import styles from './AtmosphereBackground.module.css'

export const AtmosphereBackground = () => {
  const travels = useFilteredTravels()
  const palette = travels[0]?.colorPalette ?? ['#0a0a0f', '#12121a', '#1a1a26']

  return (
    <div
      className={styles.atmosphere}
      style={{
        '--atmo-1': palette[0] ?? '#0a0a0f',
        '--atmo-2': palette[1] ?? palette[0] ?? '#12121a',
        '--atmo-3': palette[2] ?? palette[1] ?? palette[0] ?? '#1a1a26',
      } as React.CSSProperties}
      aria-hidden="true"
    />
  )
}
```

```css
/* src/app/pages/AtmosphereBackground.module.css */

.atmosphere {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(
      ellipse 80% 60% at 50% 30%,
      var(--atmo-2, #12121a) 0%,
      transparent 60%
    ),
    radial-gradient(
      ellipse 60% 50% at 80% 70%,
      var(--atmo-3, #1a1a26) 0%,
      transparent 50%
    ),
    var(--bg-deep, #0a0a0f);
  transition: background 800ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

- [ ] **Step 2: 创建 BrowsePage.tsx**

```typescript
// src/app/pages/BrowsePage.tsx

import { useEffect } from 'react'
import { AtmosphereBackground } from './AtmosphereBackground'
import { FilterBar } from '../../features/filter-bar/FilterBar'
import { TravelGrid } from '../../features/travel-grid/TravelGrid'
import { useSetTravels } from '../../state/selectors'
import type { Travel } from '../../core/domain/Travel'
import rawData from '../../data/travels.json'
import styles from './BrowsePage.module.css'

export const BrowsePage = () => {
  const setTravels = useSetTravels()

  useEffect(() => {
    setTravels(rawData as Travel[])
  }, [setTravels])

  return (
    <div className={styles.page}>
      <AtmosphereBackground />
      <div className={styles.content}>
        <FilterBar />
        <main className={styles.main}>
          <TravelGrid />
        </main>
      </div>
    </div>
  )
}
```

```css
/* src/app/pages/BrowsePage.module.css */

.page {
  position: relative;
  min-height: 100vh;
}

.content {
  position: relative;
  z-index: 1;
}

.main {
  padding-top: var(--space-2);
}
```

- [ ] **Step 3: 验证编译**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/app/pages/
git commit -m "feat: add BrowsePage with AtmosphereBackground"
```

---

### Task 14: TravelDetail 沉浸式详情页

**Files:**
- Create: `src/features/travel-detail/TravelDetail.tsx`, `src/features/travel-detail/TravelDetail.module.css`, `src/features/travel-detail/TravelDetail.Hero.tsx`, `src/features/travel-detail/TravelDetail.Narrative.tsx`, `src/features/travel-detail/TravelDetail.Atmosphere.tsx`, `src/features/travel-detail/BackButton.tsx`

- [ ] **Step 1: 创建 TravelDetail.Hero.tsx**

```typescript
// src/features/travel-detail/TravelDetail.Hero.tsx

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../shared/hooks/useReducedMotion'
import type { Travel } from '../../core/domain/Travel'
import styles from './TravelDetail.module.css'

interface HeroProps {
  travel: Travel
}

export const TravelDetailHero = ({ travel }: HeroProps) => {
  const reduced = useReducedMotion()
  const [offset, setOffset] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced) return

    const handleScroll = () => {
      if (!heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, 1 - (rect.bottom / (rect.height + rect.top))))
      setOffset(progress * 60) // max 60px parallax
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [reduced])

  return (
    <div ref={heroRef} className={styles.hero}>
      <div
        className={styles.heroImage}
        style={{ transform: `translate3d(0, ${offset}px, 0)` }}
      >
        <img src={travel.heroImage} alt="" />
      </div>
      <div className={styles.heroOverlay} />
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>{travel.title}</h1>
        <p className={styles.heroSubtitle}>{travel.narrative.intro}</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 创建 TravelDetail.Narrative.tsx**

```typescript
// src/features/travel-detail/TravelDetail.Narrative.tsx

import type { Travel } from '../../core/domain/Travel'
import { useInView } from '../../shared/hooks/useInView'
import { useReducedMotion } from '../../shared/hooks/useReducedMotion'
import styles from './TravelDetail.module.css'

interface NarrativeProps {
  travel: Travel
}

const NarrativeBlock = ({ text, index }: { text: string; index: number }) => {
  const { ref, inView } = useInView({ threshold: 0.2 })
  const reduced = useReducedMotion()

  return (
    <p
      ref={ref}
      className={styles.paragraph}
      style={{
        opacity: reduced ? 1 : (inView ? 1 : 0),
        transform: reduced ? 'none' : (inView ? 'translateY(0)' : 'translateY(32px)'),
        transition: `opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 100}ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 100}ms`,
      }}
    >
      {text}
    </p>
  )
}

export const TravelDetailNarrative = ({ travel }: NarrativeProps) => (
  <section className={styles.narrative}>
    <div className={styles.narrativeInner}>
      {travel.narrative.story.map((text, i) => (
        <NarrativeBlock key={i} text={text} index={i} />
      ))}
      {travel.narrative.travelerQuote && (
        <blockquote className={styles.quote}>
          "{travel.narrative.travelerQuote}"
        </blockquote>
      )}
      <div className={styles.tip}>
        <span className={styles.tipLabel}>旅行贴士</span>
        <p>{travel.narrative.tip}</p>
      </div>
    </div>
  </section>
)
```

- [ ] **Step 3: 创建 TravelDetail.Atmosphere.tsx**

```typescript
// src/features/travel-detail/TravelDetail.Atmosphere.tsx

import type { Travel } from '../../core/domain/Travel'
import styles from './TravelDetail.module.css'

interface AtmosphereProps {
  travel: Travel
  scrollProgress: number
}

export const TravelDetailAtmosphere = ({ travel, scrollProgress }: AtmosphereProps) => {
  const [c1, c2, c3] = travel.colorPalette

  return (
    <div
      className={styles.atmosphere}
      style={{
        background: `
          radial-gradient(
            ellipse 70% 50% at 50% ${30 + scrollProgress * 20}%,
            ${c2 ?? '#12121a'} 0%,
            transparent 60%
          ),
          radial-gradient(
            ellipse 50% 40% at 20% ${70 - scrollProgress * 30}%,
            ${c3 ?? '#1a1a26'} 0%,
            transparent 50%
          ),
          ${c1 ?? '#0a0a0f'}
        `,
      }}
      aria-hidden="true"
    />
  )
}
```

- [ ] **Step 4: 创建 BackButton.tsx**

```typescript
// src/features/travel-detail/BackButton.tsx

import { useNavigate } from 'react-router-dom'
import styles from './TravelDetail.module.css'

export const BackButton = () => {
  const navigate = useNavigate()

  return (
    <button
      className={styles.backButton}
      onClick={() => navigate(-1)}
      aria-label="返回"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span>返回</span>
    </button>
  )
}
```

- [ ] **Step 5: 创建 TravelDetail.tsx（主组件）**

```typescript
// src/features/travel-detail/TravelDetail.tsx

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTravelById } from '../../state/selectors'
import { analytics } from '../../lib/analytics'
import { BackButton } from './BackButton'
import { TravelDetailHero } from './TravelDetail.Hero'
import { TravelDetailNarrative } from './TravelDetail.Narrative'
import { TravelDetailAtmosphere } from './TravelDetail.Atmosphere'
import styles from './TravelDetail.module.css'

export const TravelDetail = () => {
  const { id } = useParams<{ id: string }>()
  const travel = useTravelById(id ?? '')
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    if (travel) {
      analytics.detailView(travel.id)
    }
  }, [travel])

  useEffect(() => {
    const handleScroll = () => {
      const docScroll = document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docHeight > 0 ? docScroll / docHeight : 0)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!travel) {
    return (
      <div className={styles.notFound}>
        <p>这段不可思议的旅程似乎迷路了</p>
        <BackButton />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <TravelDetailAtmosphere travel={travel} scrollProgress={scrollProgress} />
      <BackButton />
      <article className={styles.article}>
        <TravelDetailHero travel={travel} />
        <div className={styles.meta}>
          <span>{travel.destination}</span>
          <span aria-hidden="true">·</span>
          <span>{travel.duration}</span>
          <span aria-hidden="true">·</span>
          <span>{travel.bestSeason}</span>
          <span aria-hidden="true">·</span>
          <span>{travel.budget === '¥¥¥' ? '顶配' : travel.budget === '¥¥' ? '进阶' : '轻奢'}</span>
        </div>
        <TravelDetailNarrative travel={travel} />
      </article>
    </div>
  )
}
```

- [ ] **Step 6: 创建 TravelDetail.module.css**

```css
/* src/features/travel-detail/TravelDetail.module.css */

/* ———— Page ———— */
.page {
  position: relative;
  min-height: 100vh;
  background: var(--bg-deep);
}

.article {
  position: relative;
  z-index: 1;
}

/* ———— Atmosphere ———— */
.atmosphere {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  transition: background 200ms ease-out;
}

/* ———— Back Button ———— */
.backButton {
  position: fixed;
  top: var(--space-4);
  left: var(--space-4);
  z-index: 200;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 8px 16px;
  border-radius: 100px;
  background: rgba(18, 18, 26, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  transition: background var(--duration-fast), border-color var(--duration-fast);
}

.backButton:hover {
  background: rgba(18, 18, 26, 0.85);
  border-color: rgba(255, 255, 255, 0.15);
}

/* ———— Hero ———— */
.hero {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 500px;
  overflow: hidden;
}

.heroImage {
  position: absolute;
  inset: -20px;
  will-change: transform;
}

.heroImage img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.heroOverlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 40%,
    var(--bg-deep) 100%
  );
}

.heroContent {
  position: absolute;
  bottom: var(--space-12);
  left: var(--space-6);
  right: var(--space-6);
  max-width: 720px;
}

.heroTitle {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: #fff;
  margin-bottom: var(--space-3);
  line-height: 1.2;
}

.heroSubtitle {
  font-size: var(--text-base);
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

@media (min-width: 768px) {
  .heroContent {
    left: var(--space-12);
    right: var(--space-12);
    bottom: var(--space-16);
  }
  .heroTitle {
    font-size: var(--text-3xl);
  }
}

/* ———— Meta ———— */
.meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

@media (min-width: 768px) {
  .meta {
    padding: var(--space-4) var(--space-12);
  }
}

/* ———— Narrative ———— */
.narrative {
  padding: var(--space-8) var(--space-6);
  max-width: 720px;
  margin: 0 auto;
}

.narrativeInner {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.paragraph {
  font-size: var(--text-base);
  line-height: 2;
  color: var(--text-secondary);
  text-align: justify;
}

.quote {
  margin: var(--space-4) 0;
  padding: var(--space-6);
  border-left: 2px solid rgba(255, 255, 255, 0.1);
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-style: normal;
  color: var(--text-primary);
  line-height: 1.6;
}

.tip {
  margin-top: var(--space-6);
  padding: var(--space-6);
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.tipLabel {
  display: inline-block;
  font-family: var(--font-display);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--space-2);
}

.tip p {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.8;
}

@media (min-width: 768px) {
  .narrative {
    padding: var(--space-12) var(--space-12);
  }
  .paragraph {
    font-size: var(--text-lg);
  }
}

/* ———— Not Found ———— */
.notFound {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: var(--space-6);
  color: var(--text-secondary);
  font-family: var(--font-display);
}
```

- [ ] **Step 7: 验证编译**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 8: Commit**

```bash
git add src/features/travel-detail/
git commit -m "feat: add TravelDetail immersive detail page"
```

---

### Task 15: App 装配 — 路由 & Provider

**Files:**
- Create: `src/app/providers.tsx`, `src/app/router.tsx`, `src/app/App.tsx`, `src/app/App.module.css`

- [ ] **Step 1: 创建 providers.tsx**

```typescript
// src/app/providers.tsx

import { type ReactNode } from 'react'
import { ErrorBoundary } from '../lib/ErrorBoundary'

interface ProvidersProps {
  children: ReactNode
}

export const Providers = ({ children }: ProvidersProps) => (
  <ErrorBoundary>
    {children}
  </ErrorBoundary>
)
```

- [ ] **Step 2: 创建 router.tsx**

```typescript
// src/app/router.tsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { BrowsePage } from './pages/BrowsePage'
import { TravelDetail } from '../features/travel-detail/TravelDetail'

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/browse" replace />} />
      <Route path="/browse" element={<BrowsePage />} />
      <Route path="/browse/:id" element={<TravelDetail />} />
    </Routes>
  </BrowserRouter>
)
```

- [ ] **Step 3: 创建 App.tsx**

```typescript
// src/app/App.tsx

import { Providers } from './providers'
import { AppRouter } from './router'
import '../shared/styles/global.css'

export const App = () => (
  <Providers>
    <AppRouter />
  </Providers>
)
```

- [ ] **Step 4: 验证完整编译 + 启动**

Run: `npx tsc --noEmit`
Expected: no errors

Run: `npm run dev`
Expected: dev server starts, navigate to http://localhost:5173 → redirects to /browse → renders grid

- [ ] **Step 5: Commit**

```bash
git add src/app/
git commit -m "feat: assemble App with routing, providers, and error boundary"
```

---

### Task 16: 边缘场景打磨 & 最终验证

**Files:**
- Verify existing files, test edge cases manually

- [ ] **Step 1: 验证所有边缘场景**

启动 `npm run dev` 后手动验证：

1. **筛选结果为空**：选择 category='adventure' + mood='静谧'（不存在组合）→ 应显示 EmptyState
2. **图片加载失败**：使用浏览器 DevTools 阻止某张 picsum 图片 → 应显示 colorPalette 渐变色 fallback
3. **不存在的路由**：访问 `/browse/nonexistent-id` → 应显示"旅程迷路了"提示
4. **筛选状态保持**：在 `/browse` 设置筛选 → 点击卡片进入详情 → 点返回 → 筛选状态应保留
5. **返回重新加载**：应用启动时 `/` 应重定向到 `/browse`
6. **prefers-reduced-motion**：在浏览器 DevTools 中模拟 `prefers-reduced-motion: reduce` → 视差效果应关闭，动画应瞬切

- [ ] **Step 2: 补充细节 — 设置页面 title**

修改 `src/features/travel-detail/TravelDetail.tsx`，在 `useEffect` 中添加 title：

（文件已创建，此处确认现有 useEffect 包含 document.title 设置。如未包含，添加以下代码到 TravelDetail 组件的第一个 useEffect 中）

```typescript
useEffect(() => {
  if (travel) {
    document.title = `${travel.title} - 100种不可思议旅行`
    analytics.detailView(travel.id)
  }
  return () => { document.title = '100种不可思议旅行 - 飞猪' }
}, [travel])
```

修改 `src/app/pages/BrowsePage.tsx`，添加 title：

在 useEffect 中添加:
```typescript
useEffect(() => {
  document.title = '100种不可思议旅行 - 飞猪'
  setTravels(rawData as Travel[])
}, [setTravels])
```

- [ ] **Step 3: 构建验证**

Run: `npm run build`
Expected: TypeScript compilation + Vite build succeed, output in `dist/`

- [ ] **Step 4: 最终 Commit**

```bash
git add -A
git commit -m "feat: polish edge cases, page titles, and final build verification"
```

---

## 实现顺序依赖图

```
Task 1 (脚手架)
  └─> Task 2 (领域类型)
        ├─> Task 3 (领域变换)
        ├─> Task 4 (Mock 数据)
        └─> Task 9 (Zustand Store) ──> Task 11 (FilterBar)
              │                            │
              │                            └─> Task 13 (BrowsePage)
              │                                      │
Task 5 (Design Tokens)                               │
  └─> Task 6 (Hooks)                                 │
        └─> Task 7 (Shared Components)               │
              ├─> Task 8 (Lib 层)                    │
              └─> Task 10 (TravelCard)              │
                    └─> Task 12 (TravelGrid) ────────┘
                                                  │
Task 14 (TravelDetail) ───────────────────────────┘
  └─> Task 15 (App Assembly)
        └─> Task 16 (Polish & Verify)
```

- 并行组：Task 2+5  →  Task 3+4+5  →  Task 6+9  →  Task 7+8+10
- 串行尾：Task 11 → 12 → 13 → 14 → 15 → 16
