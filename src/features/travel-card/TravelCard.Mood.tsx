// src/features/travel-card/TravelCard.Mood.tsx

import { useTravelCard } from './TravelCard'
import { MoodTag } from '../../shared/components/MoodTag'
import styles from './TravelCard.module.css'

export const TravelCardMood = () => {
  const { travel } = useTravelCard()

  return (
    <div className={styles.moodRow}>
      <MoodTag mood={travel.primaryMood} />
      <MoodTag mood={travel.secondaryMood} />
    </div>
  )
}
