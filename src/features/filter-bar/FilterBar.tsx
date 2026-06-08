// src/features/filter-bar/FilterBar.tsx

import { useState, useRef, useCallback, useEffect } from 'react'
import { useFilter, useSetFilter, useResetFilter } from '../../state/selectors'
import { ALL_CATEGORIES, CATEGORY_LABELS, ALL_MOODS, BUDGET_LABELS } from '../../core/domain/Travel'
import type { TravelCategory, MoodTag, Budget } from '../../core/domain/Travel'
import { analytics } from '../../lib/analytics'
import { FilterBarDimension } from './FilterBar.Dimension'
import styles from './FilterBar.module.css'

export const FilterBar = () => {
  const filter = useFilter()
  const setFilter = useSetFilter()
  const resetFilter = useResetFilter()

  // Auto-hide on cursor proximity
  const [visible, setVisible] = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout>>()
  const barRef = useRef<HTMLDivElement>(null)

  const show = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    setVisible(true)
  }, [])

  const hideSoon = useCallback(() => {
    hideTimer.current = setTimeout(() => setVisible(false), 600)
  }, [])

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (e.clientY < 60) {
        show()
      } else if (e.clientY > 100 && visible) {
        hideSoon()
      }
    }
    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMove)
  }, [visible, show, hideSoon])

  const categoryOptions = ALL_CATEGORIES.map((c) => ({
    value: c,
    label: CATEGORY_LABELS[c],
  }))

  const moodOptions = [
    { value: 'all' as const, label: '全部' },
    ...ALL_MOODS.map((m) => ({ value: m, label: m })),
  ]

  const budgetOptions = [
    { value: 'all' as const, label: '不限' },
    ...(['¥', '¥¥', '¥¥¥'] as Budget[]).map((b) => ({
      value: b,
      label: BUDGET_LABELS[b],
    })),
  ]

  const toggleCategory = (cat: TravelCategory) => {
    const next = filter.categories.includes(cat)
      ? filter.categories.filter((c) => c !== cat)
      : [...filter.categories, cat]
    setFilter({ categories: next })
    analytics.filterChange('category', cat)
  }

  const handleMoodChange = (value: MoodTag | 'all') => {
    setFilter({ mood: value })
    analytics.filterChange('mood', value)
  }

  const handleBudgetChange = (value: Budget | 'all') => {
    setFilter({ budget: value })
    analytics.filterChange('budget', value)
  }

  const isFilterActive = filter.categories.length > 0 || filter.mood !== 'all' || filter.budget !== 'all'

  return (
    <>
      {/* Invisible sensor strip at top — 6px tall, catches cursor */}
      <div className={styles.sensor} onMouseEnter={show} />

      <div
        ref={barRef}
        className={`${styles.bar} ${visible ? styles.visible : ''}`}
        onMouseEnter={show}
        onMouseLeave={hideSoon}
      >
        <div className={styles.dimensions}>
          <div className={styles.dimension} role="group" aria-label="类型">
            <span className={styles.label}>类型</span>
            <div className={styles.options}>
              {categoryOptions.map((opt) => (
                <button
                  key={opt.value}
                  className={`${styles.option} ${filter.categories.includes(opt.value) ? styles.active : ''}`}
                  onClick={() => toggleCategory(opt.value)}
                  aria-pressed={filter.categories.includes(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <FilterBarDimension
            label="情绪"
            options={moodOptions}
            value={filter.mood}
            onChange={handleMoodChange}
            icon="🎭"
          />
          <FilterBarDimension
            label="预算"
            options={budgetOptions}
            value={filter.budget}
            onChange={handleBudgetChange}
            icon="💰"
          />
        </div>
        {isFilterActive && (
          <button className={styles.reset} onClick={resetFilter}>
            清除筛选
          </button>
        )}
      </div>

      {/* Subtle glow indicator at top edge when filter is hidden */}
      <div className={`${styles.edgeGlow} ${!visible ? styles.edgeVisible : ''}`} />
    </>
  )
}
