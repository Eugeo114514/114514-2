// src/features/travel-grid/TravelGrid.tsx

import { useNavigate } from 'react-router-dom'
import { useFilteredTravels } from '../../state/selectors'
import { analytics } from '../../lib/analytics'
import { TravelCard } from '../travel-card/TravelCard'
import { TravelCardImage } from '../travel-card/TravelCard.Image'
import { TravelCardMood } from '../travel-card/TravelCard.Mood'
import { TravelCardMeta } from '../travel-card/TravelCard.Meta'
import { TravelCardTitle, TravelCardSubtitle } from '../travel-card/TravelCard.Title'
import { EmptyState } from '../../shared/components/EmptyState'
import { LikeButton } from '../../shared/components/LikeButton'
import { FlowCarousel } from './FlowCarousel'
import styles from './TravelGrid.module.css'

export const TravelGrid = () => {
  const travels = useFilteredTravels()
  const navigate = useNavigate()

  const handleCardClick = (id: string, title: string) => {
    analytics.cardClick(id, title)
    navigate(`/browse/${id}`)
  }

  return (
    <div className={styles.container}>
      {travels.length === 0 ? (
        <div className={styles.emptyWrap}>
          <EmptyState />
        </div>
      ) : (
        <FlowCarousel>
          {travels.map((travel) => (
            <TravelCard
              key={travel.id}
              travel={travel}
              onClick={() => handleCardClick(travel.id, travel.title)}
            >
              <TravelCardImage />
              <div className={styles.cardBody}>
                <TravelCardMood />
                <TravelCardTitle />
                <TravelCardSubtitle />
                <TravelCardMeta />
                <LikeButton travelId={travel.id} size="sm" />
              </div>
            </TravelCard>
          ))}
        </FlowCarousel>
      )}
    </div>
  )
}
