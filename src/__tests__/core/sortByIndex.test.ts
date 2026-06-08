// src/__tests__/core/sortByIndex.test.ts

import { describe, it, expect } from 'vitest'
import { sortByIndex } from '../../core/transforms/sortByIndex'
import type { Travel } from '../../core/domain/Travel'

const makeTravel = (id: string, index: number): Travel => ({
  id,
  title: `Travel ${id}`,
  subtitle: '',
  category: 'cultural',
  unbelievableIndex: index,
  indexBreakdown: { uniqueness: 30, depth: 30, visualImpact: index - 60 },
  primaryMood: '诗意',
  secondaryMood: '静谧',
  heroImage: '',
  cardImage: '',
  colorPalette: [],
  narrative: { intro: '', story: [], tip: '' },
  destination: '',
  duration: '',
  bestSeason: '',
  budget: '¥¥',
})

describe('sortByIndex', () => {
  it('sorts by unbelievableIndex descending', () => {
    const input = [
      makeTravel('a', 50),
      makeTravel('b', 90),
      makeTravel('c', 70),
    ]
    const result = sortByIndex(input)
    expect(result.map((t) => t.unbelievableIndex)).toEqual([90, 70, 50])
  })

  it('does not mutate the original array', () => {
    const input = [
      makeTravel('a', 50),
      makeTravel('b', 90),
    ]
    const original = [...input]
    sortByIndex(input)
    expect(input).toEqual(original)
  })

  it('returns empty array for empty input', () => {
    expect(sortByIndex([])).toEqual([])
  })

  it('returns single item unchanged', () => {
    const input = [makeTravel('a', 80)]
    expect(sortByIndex(input)).toEqual(input)
  })

  it('handles identical indices (stable-ish order)', () => {
    const input = [
      makeTravel('a', 80),
      makeTravel('b', 80),
    ]
    const result = sortByIndex(input)
    expect(result).toHaveLength(2)
  })
})
