// src/core/transforms/filterTravels.ts

import type { Travel } from '../domain/Travel'
import type { FilterState, Predicate } from '../domain/Filter'
import { sortByIndex } from './sortByIndex'

const and = <T>(...predicates: Predicate<T>[]): Predicate<T> =>
  (item) => predicates.every(p => p(item))

const byCategory = (categories: FilterState['categories']): Predicate<Travel> =>
  categories.length === 0 ? () => true : (t) => categories.includes(t.category)

const byMood = (m: FilterState['mood']): Predicate<Travel> =>
  m === 'all' ? () => true : (t) => t.primaryMood === m || t.secondaryMood === m

const byBudget = (b: FilterState['budget']): Predicate<Travel> =>
  b === 'all' ? () => true : (t) => {
    const tiers: Array<'¥' | '¥¥' | '¥¥¥'> = ['¥', '¥¥', '¥¥¥']
    return tiers.indexOf(t.budget) <= tiers.indexOf(b)
  }

const byUnbelievableIndexMin = (min: number): Predicate<Travel> =>
  (t) => t.unbelievableIndex >= min

/** Apply filter to travels, return sorted results (pure function) */
export const applyFilter = (travels: Travel[], filter: FilterState): Travel[] => {
  const filtered = travels.filter(and(
    byCategory(filter.categories),
    byMood(filter.mood),
    byBudget(filter.budget),
    byUnbelievableIndexMin(filter.unbelievableIndexMin),
  ))
  return sortByIndex(filtered)
}
