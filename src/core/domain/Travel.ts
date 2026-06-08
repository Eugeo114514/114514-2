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
