// src/shared/components/EmptyState.tsx

import styles from './EmptyState.module.css'

interface EmptyStateProps {
  message?: string
}

export const EmptyState = ({
  message = '这个维度下的不可思议还在探索中…',
}: EmptyStateProps) => (
  <div className={styles.container}>
    <div className={styles.gradient} />
    <p className={styles.message}>{message}</p>
  </div>
)
