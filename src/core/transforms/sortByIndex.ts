// src/core/transforms/sortByIndex.ts

import type { Travel } from '../domain/Travel'

/** Sort by unbelievableIndex descending (pure function, returns new array) */
export const sortByIndex = (travels: Travel[]): Travel[] =>
  [...travels].sort((a, b) => b.unbelievableIndex - a.unbelievableIndex)
