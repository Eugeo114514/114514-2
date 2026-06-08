// src/features/travel-grid/MasonryLayout.tsx

import { type ReactNode } from 'react'
import styles from './MasonryLayout.module.css'

interface MasonryLayoutProps {
  children: ReactNode
}

export const MasonryLayout = ({ children }: MasonryLayoutProps) => (
  <div className={styles.masonry}>
    {children}
  </div>
)
