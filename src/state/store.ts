// src/state/store.ts

import { create } from 'zustand'
import type { Travel } from '../core/domain/Travel'
import type { FilterState } from '../core/domain/Filter'
import { DEFAULT_FILTER } from '../core/domain/Filter'
import { applyFilter } from '../core/transforms/filterTravels'
import { logger } from '../lib/logger'

interface AppState {
  travels: Travel[]
  filter: FilterState
  filteredTravels: Travel[]

  setTravels: (travels: Travel[]) => void
  setFilter: (patch: Partial<FilterState>) => void
  resetFilter: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  travels: [],
  filter: { ...DEFAULT_FILTER },
  filteredTravels: [],

  setTravels: (travels: Travel[]) => {
    const { filter } = get()
    set({
      travels,
      filteredTravels: applyFilter(travels, filter),
    })
    logger.info(`Loaded ${travels.length} travels`)
  },

  setFilter: (patch: Partial<FilterState>) => {
    const { travels, filter } = get()
    const next = { ...filter, ...patch }
    set({
      filter: next,
      filteredTravels: applyFilter(travels, next),
    })
  },

  resetFilter: () => {
    const { travels } = get()
    set({
      filter: { ...DEFAULT_FILTER },
      filteredTravels: applyFilter(travels, DEFAULT_FILTER),
    })
  },
}))
