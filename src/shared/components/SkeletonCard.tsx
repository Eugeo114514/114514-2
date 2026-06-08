// src/shared/components/SkeletonCard.tsx

import styles from './SkeletonCard.module.css'

export const SkeletonCard = () => (
  <div className={styles.card}>
    <div className={styles.image} />
    <div className={styles.body}>
      <div className={styles.tag} />
      <div className={styles.title} />
      <div className={styles.subtitle} />
    </div>
  </div>
)
