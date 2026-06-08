// src/app/pages/BrowsePage.tsx

import { useEffect, useState } from 'react'
import { AtmosphereBackground } from './AtmosphereBackground'
import { Starfield } from '../../features/starfield/Starfield'
import { FilterBar } from '../../features/filter-bar/FilterBar'
import { TravelGrid } from '../../features/travel-grid/TravelGrid'
import { AnimatedCounter } from '../../features/travel-grid/AnimatedCounter'
import { AmbientAudio } from '../../features/ambient-audio/AmbientAudio'
import { ContributeModal } from '../../features/contribute/ContributeModal'
import { useSetTravels, useFilteredTravels } from '../../state/selectors'
import type { Travel } from '../../core/domain/Travel'
import rawData from '../../data/travels.json'
import styles from './BrowsePage.module.css'

export const BrowsePage = () => {
  const setTravels = useSetTravels()
  const travels = useFilteredTravels()
  const [loaded, setLoaded] = useState(false)
  const [showContribute, setShowContribute] = useState(false)

  useEffect(() => {
    document.title = '100种不可思议旅行 - 飞猪'

    // Load built-in data + any user-contributed travels
    const allTravels = [...(rawData as Travel[])]
    try {
      const contributed: Travel[] = JSON.parse(localStorage.getItem('flypig-contributed') ?? '[]')
      allTravels.push(...contributed)
    } catch { /* ignore */ }

    setTravels(allTravels)
    requestAnimationFrame(() => setLoaded(true))
  }, [setTravels])

  return (
    <div className={`${styles.page} ${loaded ? styles.loaded : ''}`}>
      <AtmosphereBackground />
      <Starfield />
      <div className={styles.content}>
        <FilterBar />
        <main className={styles.main}>
          <TravelGrid />
        </main>
        <AnimatedCounter value={travels.length} />
      </div>
      <AmbientAudio />

      {/* Contribute button */}
      <button
        className={styles.contributeBtn}
        onClick={() => setShowContribute(true)}
        aria-label="投稿分享"
        title="分享你的不可思议"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span className={styles.contributeLabel}>投稿</span>
      </button>

      {showContribute && (
        <ContributeModal onClose={() => setShowContribute(false)} />
      )}
    </div>
  )
}
