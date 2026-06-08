// src/__tests__/core/filterTravels.test.ts

import { describe, it, expect } from 'vitest'
import { applyFilter } from '../../core/transforms/filterTravels'
import type { Travel } from '../../core/domain/Travel'
import type { FilterState } from '../../core/domain/Filter'
import { DEFAULT_FILTER } from '../../core/domain/Filter'

const makeTravel = (overrides: Partial<Travel> = {}): Travel => ({
  id: 'test-1',
  title: '测试旅行',
  subtitle: '测试副标题',
  category: 'cultural',
  unbelievableIndex: 85,
  indexBreakdown: { uniqueness: 30, depth: 30, visualImpact: 25 },
  primaryMood: '诗意',
  secondaryMood: '静谧',
  heroImage: '',
  cardImage: '',
  colorPalette: ['#000', '#111', '#222'],
  narrative: { intro: '', story: [], tip: '' },
  destination: '测试目的地',
  duration: '3天',
  bestSeason: '全年',
  budget: '¥¥',
  ...overrides,
})

const travels: Travel[] = [
  makeTravel({ id: 'c1', category: 'cultural', unbelievableIndex: 90, budget: '¥' }),
  makeTravel({ id: 'a1', category: 'adventure', unbelievableIndex: 80, budget: '¥¥' }),
  makeTravel({ id: 'c2', category: 'cultural', unbelievableIndex: 70, budget: '¥¥¥' }),
  makeTravel({ id: 'h1', category: 'healing', unbelievableIndex: 95, budget: '¥¥' }),
  makeTravel({ id: 'e1', category: 'extreme', unbelievableIndex: 60, budget: '¥¥¥' }),
  makeTravel({ id: 'm1', category: 'mystery', unbelievableIndex: 88, budget: '¥' }),
  makeTravel({ id: 'c3', category: 'cultural', unbelievableIndex: 75, primaryMood: '震撼', budget: '¥¥' }),
  makeTravel({ id: 'a2', category: 'adventure', unbelievableIndex: 50, primaryMood: '热血', budget: '¥' }),
]

describe('applyFilter', () => {
  it('returns all travels sorted by index with default filter', () => {
    const result = applyFilter(travels, DEFAULT_FILTER)
    expect(result).toHaveLength(travels.length)
    // Should be sorted descending by unbelievableIndex
    for (let i = 1; i < result.length; i++) {
      expect(result[i].unbelievableIndex).toBeLessThanOrEqual(result[i - 1].unbelievableIndex)
    }
  })

  it('filters by single category', () => {
    const filter: FilterState = { ...DEFAULT_FILTER, categories: ['cultural'] }
    const result = applyFilter(travels, filter)
    expect(result.every((t) => t.category === 'cultural')).toBe(true)
    expect(result).toHaveLength(3)
  })

  it('filters by multiple categories', () => {
    const filter: FilterState = { ...DEFAULT_FILTER, categories: ['cultural', 'adventure'] }
    const result = applyFilter(travels, filter)
    expect(result.every((t) => ['cultural', 'adventure'].includes(t.category))).toBe(true)
    expect(result).toHaveLength(5)
  })

  it('returns all when categories is empty array', () => {
    const filter: FilterState = { ...DEFAULT_FILTER, categories: [] }
    const result = applyFilter(travels, filter)
    expect(result).toHaveLength(travels.length)
  })

  it('filters by mood (matches primary or secondary)', () => {
    const filter: FilterState = { ...DEFAULT_FILTER, mood: '震撼' }
    const result = applyFilter(travels, filter)
    expect(result.every((t) => t.primaryMood === '震撼' || t.secondaryMood === '震撼')).toBe(true)
  })

  it('filters by budget (≤ selected tier)', () => {
    const filter: FilterState = { ...DEFAULT_FILTER, budget: '¥' }
    const result = applyFilter(travels, filter)
    expect(result.every((t) => t.budget === '¥')).toBe(true)
  })

  it('filters by minimum unbelievable index', () => {
    const filter: FilterState = { ...DEFAULT_FILTER, unbelievableIndexMin: 80 }
    const result = applyFilter(travels, filter)
    expect(result.every((t) => t.unbelievableIndex >= 80)).toBe(true)
  })

  it('combines multiple filters', () => {
    const filter: FilterState = {
      categories: ['cultural', 'healing'],
      mood: '诗意',
      budget: '¥¥',
      unbelievableIndexMin: 70,
    }
    const result = applyFilter(travels, filter)
    expect(result.every(
      (t) => ['cultural', 'healing'].includes(t.category)
        && (t.primaryMood === '诗意' || t.secondaryMood === '诗意')
        && ['¥', '¥¥'].includes(t.budget)
        && t.unbelievableIndex >= 70
    )).toBe(true)
  })

  it('returns empty array when no travels match', () => {
    const filter: FilterState = {
      ...DEFAULT_FILTER,
      categories: ['extreme'],
      mood: '治愈',
      unbelievableIndexMin: 95,
    }
    const result = applyFilter(travels, filter)
    expect(result).toHaveLength(0)
  })

  it('does not mutate the original array', () => {
    const original = [...travels]
    applyFilter(travels, { ...DEFAULT_FILTER, categories: ['cultural'] })
    expect(travels).toEqual(original)
  })

  it('sorts by unbelievableIndex descending', () => {
    const result = applyFilter(travels, DEFAULT_FILTER)
    const indices = result.map((t) => t.unbelievableIndex)
    expect(indices).toEqual([...indices].sort((a, b) => b - a))
  })
})
