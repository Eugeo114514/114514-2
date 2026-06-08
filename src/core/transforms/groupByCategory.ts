// src/core/transforms/groupByCategory.ts

import type { Travel, TravelCategory } from '../domain/Travel'

/** Group travels by category (pure function) */
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
