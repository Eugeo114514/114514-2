// src/features/travel-card/TravelCard.tsx

import { createContext, useContext, type ReactNode } from 'react'
import type { Travel } from '../../core/domain/Travel'
import { useParallax } from '../../shared/hooks/useParallax'
import styles from './TravelCard.module.css'

interface TravelCardContextValue {
  travel: Travel
}

const TravelCardContext = createContext<TravelCardContextValue | null>(null)

const useTravelCard = () => {
  const ctx = useContext(TravelCardContext)
  if (!ctx) throw new Error('TravelCard sub-components must be used inside <TravelCard>')
  return ctx
}

interface TravelCardProps {
  travel: Travel
  children: ReactNode
  onClick?: () => void
}

export const TravelCard = ({ travel, children, onClick }: TravelCardProps) => {
  const parallaxRef = useParallax({ intensity: 0.03, maxOffset: 8 })

  const handleClick = () => {
    onClick?.()
  }

  return (
    <TravelCardContext.Provider value={{ travel }}>
      <div
        className={styles.card}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') handleClick() }}
      >
        <div ref={parallaxRef} className={styles.cardInner}>
          {children}
        </div>
      </div>
    </TravelCardContext.Provider>
  )
}

export { useTravelCard }
