// src/core/domain/Filter.ts

import type { TravelCategory, MoodTag, Budget } from './Travel'

export interface FilterState {
  categories: TravelCategory[]  // multi-select: empty = all
  mood: MoodTag | 'all'
  budget: Budget | 'all'
  unbelievableIndexMin: number
}

export const DEFAULT_FILTER: FilterState = {
  categories: [],
  mood: 'all',
  budget: 'all',
  unbelievableIndexMin: 0,
}

export type Predicate<T> = (item: T) => boolean
