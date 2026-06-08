// src/shared/components/LikeButton.tsx

import { useSocialStore } from '../../state/social'
import styles from './LikeButton.module.css'

interface LikeButtonProps {
  travelId: string
  size?: 'sm' | 'md'
}

export const LikeButton = ({ travelId, size = 'sm' }: LikeButtonProps) => {
  const liked = useSocialStore((s) => !!s.userLikes[travelId])
  const count = useSocialStore((s) => s.likes[travelId] ?? 0)
  const toggleLike = useSocialStore((s) => s.toggleLike)

  return (
    <button
      className={`${styles.btn} ${liked ? styles.liked : ''} ${styles[size]}`}
      onClick={(e) => {
        e.stopPropagation()
        toggleLike(travelId)
      }}
      aria-label={liked ? '取消点赞' : '点赞'}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {count > 0 && <span className={styles.count}>{count}</span>}
    </button>
  )
}
