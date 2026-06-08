// src/shared/components/MoodTag.tsx

import type { MoodTag as MoodTagType } from '../../core/domain/Travel'
import styles from './MoodTag.module.css'

interface MoodTagProps {
  mood: MoodTagType
  size?: 'sm' | 'md'
}

export const MoodTag = ({ mood, size = 'sm' }: MoodTagProps) => (
  <span className={`${styles.tag} ${styles[size]}`} data-mood={mood}>
    {mood}
  </span>
)
