// src/features/travel-detail/TravelDetail.Hero.tsx

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../shared/hooks/useReducedMotion'
import type { Travel } from '../../core/domain/Travel'
import styles from './TravelDetail.module.css'

interface HeroProps {
  travel: Travel
}

export const TravelDetailHero = ({ travel }: HeroProps) => {
  const reduced = useReducedMotion()
  const [offset, setOffset] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced) return

    const handleScroll = () => {
      if (!heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      const h = rect.height + rect.top
      const progress = h > 0 ? Math.max(0, Math.min(1, 1 - rect.bottom / h)) : 0
      setOffset(progress * 60)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [reduced])

  return (
    <div ref={heroRef} className={styles.hero}>
      <div
        className={styles.heroImage}
        style={{ transform: `translate3d(0, ${offset}px, 0)` }}
      >
        <img src={travel.heroImage} alt="" />
      </div>
      <div className={styles.heroOverlay} />
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>{travel.title}</h1>
        <p className={styles.heroSubtitle}>{travel.narrative.intro}</p>
      </div>
    </div>
  )
}
