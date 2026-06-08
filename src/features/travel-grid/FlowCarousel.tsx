// src/features/travel-grid/FlowCarousel.tsx
// Horizontal flowing carousel — inspired by BanG Dream's embla slider

import { type ReactNode, useEffect, useRef, useState, useCallback } from 'react'
import styles from './FlowCarousel.module.css'

interface FlowCarouselProps {
  children: ReactNode
}

export const FlowCarousel = ({ children }: FlowCarouselProps) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll, { passive: true })
    checkScroll()
    return () => el.removeEventListener('scroll', checkScroll)
  }, [checkScroll, children])

  const scrollBy = (dir: 'left' | 'right') => {
    const el = trackRef.current
    if (!el) return
    const amount = el.clientWidth * 0.75
    el.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  return (
    <div className={styles.carousel}>
      <div ref={trackRef} className={styles.track}>
        {children}
      </div>

      {/* Arrow buttons — like embla__button */}
      {canScrollLeft && (
        <button
          className={`${styles.arrow} ${styles.arrowLeft}`}
          onClick={() => scrollBy('left')}
          aria-label="上一个"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M15 6L9 12L15 18" />
          </svg>
        </button>
      )}
      {canScrollRight && (
        <button
          className={`${styles.arrow} ${styles.arrowRight}`}
          onClick={() => scrollBy('right')}
          aria-label="下一个"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M9 6L15 12L9 18" />
          </svg>
        </button>
      )}

      {/* Gradient fade indicators on edges */}
      <div className={`${styles.fade} ${styles.fadeLeft} ${canScrollLeft ? styles.fadeVisible : ''}`} />
      <div className={`${styles.fade} ${styles.fadeRight} ${canScrollRight ? styles.fadeVisible : ''}`} />
    </div>
  )
}
