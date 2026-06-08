// src/features/filter-bar/FilterBar.Dimension.tsx

import { type ReactNode } from 'react'
import styles from './FilterBar.module.css'

interface DimensionOption<T extends string> {
  value: T
  label: string
}

interface FilterBarDimensionProps<T extends string> {
  label: string
  options: DimensionOption<T>[]
  value: T
  onChange: (value: T) => void
  icon?: ReactNode
}

export const FilterBarDimension = <T extends string>({
  label,
  options,
  value,
  onChange,
  icon,
}: FilterBarDimensionProps<T>) => (
  <div className={styles.dimension} role="radiogroup" aria-label={label}>
    {icon && <span className={styles.icon}>{icon}</span>}
    <span className={styles.label}>{label}</span>
    <div className={styles.options}>
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`${styles.option} ${value === opt.value ? styles.active : ''}`}
          role="radio"
          aria-checked={value === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
)
