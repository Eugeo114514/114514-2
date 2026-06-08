// src/features/travel-detail/BackButton.tsx

import { useNavigate } from 'react-router-dom'
import styles from './TravelDetail.module.css'

export const BackButton = () => {
  const navigate = useNavigate()

  return (
    <button
      className={styles.backButton}
      onClick={() => navigate(-1)}
      aria-label="返回"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span>返回</span>
    </button>
  )
}
