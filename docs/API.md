# API 文档 — 数据访问层接口

> MVP 阶段数据源为静态 JSON + localStorage，本文档定义数据访问接口规范，后续切换至飞猪真实 API 时仅需替换 adapter 实现。

---

## 1. 核心接口：ITravelDataSource

```typescript
// src/core/ports/ITravelDataSource.ts

interface ITravelDataSource {
  getAll(): Travel[]
  getById(id: string): Travel | undefined
}
```

### 1.1 当前实现：StaticJsonDataSource

**数据源**：`src/data/travels.json` + `localStorage('flypig-contributed')`

| 方法 | 返回 | 说明 |
|---|---|---|
| `getAll()` | `Travel[]` | 合并 JSON 数据 + 用户投稿 |
| `getById(id)` | `Travel \| undefined` | 按 ID 查找单条 |

### 1.2 未来实现：FliggyApiDataSource

```typescript
// 示例 adapter（待实现）
class FliggyApiDataSource implements ITravelDataSource {
  constructor(private baseUrl: string, private apiKey: string) {}

  async getAll(): Promise<Travel[]> {
    const res = await fetch(`${this.baseUrl}/api/v1/travels`, {
      headers: { Authorization: `Bearer ${this.apiKey}` }
    })
    return res.json()
  }

  async getById(id: string): Promise<Travel | undefined> {
    const res = await fetch(`${this.baseUrl}/api/v1/travels/${id}`, {
      headers: { Authorization: `Bearer ${this.apiKey}` }
    })
    if (!res.ok) return undefined
    return res.json()
  }
}
```

---

## 2. 状态管理 API（Zustand Store）

### 2.1 App Store

```typescript
// src/state/store.ts

interface AppState {
  travels: Travel[]               // 原始数据
  filter: FilterState             // 当前筛选条件
  filteredTravels: Travel[]       // 派生：筛选 + 排序后的数据

  setTravels(travels: Travel[]): void
  setFilter(patch: Partial<FilterState>): void
  resetFilter(): void
}
```

### 2.2 Selectors

| Selector | 返回类型 | 说明 |
|---|---|---|
| `useFilteredTravels()` | `Travel[]` | 当前筛选后的旅行列表 |
| `useTravelCount()` | `{ filtered, total }` | 数量统计 |
| `useFilter()` | `FilterState` | 当前筛选条件 |
| `useTravelById(id)` | `Travel \| undefined` | 按 ID 查找 |
| `useSetFilter()` | `(patch) => void` | 更新筛选条件 |
| `useResetFilter()` | `() => void` | 重置筛选 |

### 2.3 Social Store

```typescript
// src/state/social.ts

interface SocialState {
  likes: Record<string, number>
  userLikes: Record<string, boolean>
  comments: Record<string, Comment[]>

  toggleLike(travelId: string): void
  addComment(travelId: string, author: string, text: string): void
  getLikeCount(travelId: string): number
  hasLiked(travelId: string): boolean
  getComments(travelId: string): Comment[]
}
```

---

## 3. 领域变换 API（纯函数）

### 3.1 filterTravels

```typescript
// src/core/transforms/filterTravels.ts

/**
 * 对旅行列表应用筛选条件，返回排序后的结果
 * 纯函数，不修改输入
 */
applyFilter(travels: Travel[], filter: FilterState): Travel[]
```

**筛选谓词组合**：
```
applyFilter = and(
  byCategory(categories),     // 空数组 = 全部；有值 = includes 匹配
  byMood(mood),               // 'all' = 全部；否则匹配 primaryMood 或 secondaryMood
  byBudget(budget),           // 'all' = 全部；否则 ≤ 预算档位
  byUnbelievableIndexMin(n)   // index ≥ n
) → sortByIndex
```

### 3.2 sortByIndex

```typescript
sortByIndex(travels: Travel[]): Travel[]
// 按 unbelievableIndex 降序排列，返回新数组
```

### 3.3 groupByCategory

```typescript
groupByCategory(travels: Travel[]): Record<TravelCategory, Travel[]>
// 按 5 个类别分组
```

---

## 4. FilterState 数据结构

```typescript
interface FilterState {
  categories: TravelCategory[]   // 多选：[] = 全部
  mood: MoodTag | 'all'          // 单选：'all' = 全部
  budget: Budget | 'all'         // 单选（≤）：'all' = 不限
  unbelievableIndexMin: number   // 最低不可思议指数 0-100
}
```

**默认值**：
```typescript
DEFAULT_FILTER = {
  categories: [],
  mood: 'all',
  budget: 'all',
  unbelievableIndexMin: 0,
}
```

---

## 5. 本地存储 Key 约定

| Key | 内容 | 类型 |
|---|---|---|
| `flypig-social` | `{ likes, userLikes, comments }` | JSON |
| `flypig-contributed` | `Travel[]` (用户投稿列表) | JSON |
