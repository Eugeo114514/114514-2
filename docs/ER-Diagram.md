# 数据模型 & ER 图

> 对应源码：`src/core/domain/Travel.ts`、`src/core/domain/Filter.ts`、`src/state/social.ts`

---

## 实体关系图

```mermaid
erDiagram
    Travel ||--o{ Like : "被点赞"
    Travel ||--o{ Comment : "被评论"
    Travel }o--|| TravelCategory : "属于"
    Travel }o--o{ MoodTag : "标记"

    Travel {
        string id PK "唯一标识，如 'cultural-3'"
        string title "标题"
        string subtitle "副标题"
        string category "FK → TravelCategory"
        int unbelievableIndex "不可思议指数 0-100"
        json indexBreakdown "独特性/深度/视觉冲击力"
        string primaryMood "主情绪 FK → MoodTag"
        string secondaryMood "副情绪 FK → MoodTag"
        string heroImage "详情页全屏大图 URL"
        string cardImage "卡片缩略图 URL"
        json colorPalette "3-5色数组，驱动氛围渐变"
        json narrative "叙事对象：intro/story/tip/quote"
        string destination "目的地"
        string duration "时长"
        string bestSeason "最佳季节"
        string budget "预算档位：¥/¥¥/¥¥¥"
    }

    TravelCategory {
        string value PK "adventure|healing|cultural|extreme|mystery"
        string label "冒险|治愈|人文|极限|秘境"
    }

    MoodTag {
        string value PK "自由|震撼|治愈|孤独|热血|诗意|荒诞|静谧|复古|未来感"
    }

    Like {
        string travelId FK "Travel.id"
        int count "点赞数"
        bool userLiked "当前用户是否已点赞"
    }

    Comment {
        string id PK "UUID"
        string travelId FK "Travel.id"
        string author "作者名"
        string text "评论正文"
        int time "Unix timestamp"
    }
```

---

## 数据存储策略

| 数据层 | 存储方式 | 说明 |
|---|---|---|
| 基础旅行数据 | `src/data/travels.json` | 50 条精选 + 用户投稿（localStorage） |
| 点赞数据 | `localStorage` (key: `flypig-social`) | 持久化在浏览器端 |
| 评论数据 | `localStorage` (key: `flypig-social`) | 持久化在浏览器端 |
| 用户投稿 | `localStorage` (key: `flypig-contributed`) | 与基础数据合并展示 |
| 筛选状态 | Zustand store（内存） | 会话级，不持久化 |

---

## 数据流

```mermaid
flowchart LR
    JSON[travels.json<br/>50条精选] --> Store[Zustand Store]
    LS[localStorage<br/>用户投稿] --> Store
    Store --> Filter[applyFilter<br/>纯函数]
    Filter --> Grid[TravelGrid<br/>轮播渲染]
    Grid --> Card[TravelCard]
    Card --> Detail[TravelDetail]

    Like[点赞操作] --> Social[Social Store]
    Comment[评论操作] --> Social
    Social --> LS2[localStorage<br/>flypig-social]
```

---

## 索引设计

由于当前为前端 MVP（静态 JSON），数据量 < 200 条，不使用数据库索引。

**后续接入飞猪 API 时的建议索引：**

```sql
-- 按类别筛选
CREATE INDEX idx_travel_category ON travels(category);

-- 按不可思议指数排序
CREATE INDEX idx_travel_unbelievable ON travels(unbelievable_index DESC);

-- 全文搜索
CREATE INDEX idx_travel_fts ON travels USING GIN(to_tsvector('chinese', title || ' ' || destination));
```
