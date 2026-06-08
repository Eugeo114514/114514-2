// src/features/travel-detail/TravelDetail.tsx

import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTravelById, useFilteredTravels } from '../../state/selectors'
import { analytics } from '../../lib/analytics'
import { BackButton } from './BackButton'
import { TravelDetailHero } from './TravelDetail.Hero'
import { TravelDetailNarrative } from './TravelDetail.Narrative'
import { TravelDetailAtmosphere } from './TravelDetail.Atmosphere'
import { LikeButton } from '../../shared/components/LikeButton'
import { CommentSection } from '../../shared/components/CommentSection'
import styles from './TravelDetail.module.css'

export const TravelDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const travel = useTravelById(id ?? '')
  const filteredTravels = useFilteredTravels()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const currentIdx = filteredTravels.findIndex((t) => t.id === id)
  const prevTravel = currentIdx > 0 ? filteredTravels[currentIdx - 1] : null
  const nextTravel = currentIdx < filteredTravels.length - 1 ? filteredTravels[currentIdx + 1] : null

  const goTo = useCallback((targetId: string) => {
    if (transitioning) return
    setTransitioning(true)
    // Scroll to top with smooth transition
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => {
      navigate(`/browse/${targetId}`, { replace: true })
      setTimeout(() => setTransitioning(false), 100)
    }, 300)
  }, [navigate, transitioning])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && prevTravel) goTo(prevTravel.id)
      if (e.key === 'ArrowRight' && nextTravel) goTo(nextTravel.id)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [prevTravel, nextTravel, goTo])

  useEffect(() => {
    if (travel) {
      document.title = `${travel.title} - 100种不可思议旅行`
      analytics.detailView(travel.id)
    }
    return () => { document.title = '100种不可思议旅行 - 飞猪' }
  }, [travel])

  useEffect(() => {
    const handleScroll = () => {
      const docScroll = document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docHeight > 0 ? docScroll / docHeight : 0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!travel) {
    return (
      <div className={styles.notFound}>
        <div className={styles.notFoundIcon}>✦</div>
        <p>这段不可思议的旅程似乎迷路了</p>
        <BackButton />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <TravelDetailAtmosphere travel={travel} scrollProgress={scrollProgress} />
      <BackButton />

      {/* Prev/Next navigation arrows */}
      {prevTravel && (
        <button
          className={`${styles.navArrow} ${styles.navArrowLeft}`}
          onClick={() => goTo(prevTravel.id)}
          aria-label={`上一个：${prevTravel.title}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M15 6L9 12L15 18" />
          </svg>
          <span className={styles.navLabel}>{prevTravel.title}</span>
        </button>
      )}
      {nextTravel && (
        <button
          className={`${styles.navArrow} ${styles.navArrowRight}`}
          onClick={() => goTo(nextTravel.id)}
          aria-label={`下一个：${nextTravel.title}`}
        >
          <span className={styles.navLabel}>{nextTravel.title}</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M9 6L15 12L9 18" />
          </svg>
        </button>
      )}

      {/* Progress dots */}
      <div className={styles.dots}>
        {filteredTravels.length > 1 && (
          <span className={styles.dotsText}>
            {currentIdx + 1} / {filteredTravels.length}
          </span>
        )}
      </div>

      <article className={styles.article}>
        <TravelDetailHero travel={travel} />
        <div className={styles.meta}>
          <span>{travel.destination}</span>
          <span aria-hidden="true">·</span>
          <span>{travel.duration}</span>
          <span aria-hidden="true">·</span>
          <span>{travel.bestSeason}</span>
          <span aria-hidden="true">·</span>
          <span>{travel.budget === '¥¥¥' ? '顶配' : travel.budget === '¥¥' ? '进阶' : '轻奢'}</span>
          <span aria-hidden="true">·</span>
          <LikeButton travelId={travel.id} size="md" />
        </div>
        <TravelDetailNarrative travel={travel} />
        <CommentSection travelId={travel.id} />
      </article>
    </div>
  )
}
