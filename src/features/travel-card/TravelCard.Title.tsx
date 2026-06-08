// src/features/travel-card/TravelCard.Title.tsx

import { useTravelCard } from './TravelCard'
import styles from './TravelCard.module.css'

export const TravelCardTitle = () => {
  const { travel } = useTravelCard()
  return <h3 className={styles.title}>{travel.title}</h3>
}

export const TravelCardSubtitle = () => {
  const { travel } = useTravelCard()
  return <p className={styles.subtitle}>{travel.subtitle}</p>
}
