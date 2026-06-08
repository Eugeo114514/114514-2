// src/state/selectors.ts

import { useAppStore } from './store'
import type { Travel } from '../core/domain/Travel'

export const useFilteredTravels = (): Travel[] =>
  useAppStore((s) => s.filteredTravels)

export const useTravelCount = (): { filtered: number; total: number } =>
  useAppStore((s) => ({
    filtered: s.filteredTravels.length,
    total: s.travels.length,
  }))

export const useFilter = () => useAppStore((s) => s.filter)

export const useTravelById = (id: string): Travel | undefined =>
  useAppStore((s) => s.travels.find((t) => t.id === id))

export const useSetFilter = () => useAppStore((s) => s.setFilter)
export const useResetFilter = () => useAppStore((s) => s.resetFilter)
export const useSetTravels = () => useAppStore((s) => s.setTravels)
