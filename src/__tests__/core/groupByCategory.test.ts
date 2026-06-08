// src/__tests__/core/groupByCategory.test.ts

import { describe, it, expect } from 'vitest'
import { groupByCategory } from '../../core/transforms/groupByCategory'
import type { Travel } from '../../core/domain/Travel'

const makeTravel = (id: string, category: Travel['category']): Travel => ({
  id,
  title: `Travel ${id}`,
  subtitle: '',
  category,
  unbelievableIndex: 80,
  indexBreakdown: { uniqueness: 30, depth: 30, visualImpact: 20 },
  primaryMood: '自由',
  secondaryMood: '诗意',
  heroImage: '',
  cardImage: '',
  colorPalette: [],
  narrative: { intro: '', story: [], tip: '' },
  destination: '',
  duration: '',
  bestSeason: '',
  budget: '¥¥',
})

describe('groupByCategory', () => {
  it('groups travels by category', () => {
    const input = [
      makeTravel('c1', 'cultural'),
      makeTravel('a1', 'adventure'),
      makeTravel('c2', 'cultural'),
      makeTravel('h1', 'healing'),
    ]
    const result = groupByCategory(input)
    expect(result.cultural).toHaveLength(2)
    expect(result.adventure).toHaveLength(1)
    expect(result.healing).toHaveLength(1)
    expect(result.extreme).toHaveLength(0)
    expect(result.mystery).toHaveLength(0)
  })

  it('returns all empty arrays for empty input', () => {
    const result = groupByCategory([])
    expect(result.cultural).toEqual([])
    expect(result.adventure).toEqual([])
    expect(result.healing).toEqual([])
    expect(result.extreme).toEqual([])
    expect(result.mystery).toEqual([])
  })

  it('has all five categories in result keys', () => {
    const result = groupByCategory([makeTravel('a', 'adventure')])
    expect(Object.keys(result)).toEqual([
      'adventure', 'healing', 'cultural', 'extreme', 'mystery',
    ])
  })
})
