// src/features/travel-card/TravelCard.Image.tsx

import { useState } from 'react'
import { useTravelCard } from './TravelCard'
import styles from './TravelCard.module.css'

export const TravelCardImage = () => {
  const { travel } = useTravelCard()
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={styles.imageFallback}
        style={{
          background: `linear-gradient(135deg, ${travel.colorPalette[0] ?? '#1a1a2e'}, ${travel.colorPalette[2] ?? '#0f3460'})`,
        }}
      >
        ✦
      </div>
    )
  }

  return (
    <div className={styles.imageWrapper}>
      <img
        src={travel.cardImage}
        alt={travel.title}
        className={styles.image}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  )
}
