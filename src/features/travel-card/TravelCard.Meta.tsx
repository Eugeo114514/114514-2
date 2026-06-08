// src/features/travel-card/TravelCard.Meta.tsx

import { useTravelCard } from './TravelCard'
import styles from './TravelCard.module.css'

export const TravelCardMeta = () => {
  const { travel } = useTravelCard()

  return (
    <div className={styles.meta}>
      <span>{travel.destination}</span>
      <span aria-hidden="true">·</span>
      <span>{travel.duration}</span>
    </div>
  )
}
