// src/features/travel-grid/HoneycombGrid.tsx

import { type ReactNode } from 'react'
import styles from './HoneycombGrid.module.css'

interface HoneycombGridProps {
  children: ReactNode
}

export const HoneycombGrid = ({ children }: HoneycombGridProps) => (
  <div className={styles.honeycomb}>
    {children}
  </div>
)
