// src/features/travel-detail/TravelDetail.Narrative.tsx

import type { Travel } from '../../core/domain/Travel'
import { useInView } from '../../shared/hooks/useInView'
import { useReducedMotion } from '../../shared/hooks/useReducedMotion'
import styles from './TravelDetail.module.css'

interface NarrativeProps {
  travel: Travel
}

const NarrativeBlock = ({ text, index }: { text: string; index: number }) => {
  const { ref, inView } = useInView({ threshold: 0.2 })
  const reduced = useReducedMotion()

  return (
    <p
      ref={ref}
      className={styles.paragraph}
      style={{
        opacity: reduced ? 1 : (inView ? 1 : 0),
        transform: reduced ? 'none' : (inView ? 'translateY(0)' : 'translateY(32px)'),
        transition: `opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 100}ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 100}ms`,
      }}
    >
      {text}
    </p>
  )
}

export const TravelDetailNarrative = ({ travel }: NarrativeProps) => (
  <section className={styles.narrative}>
    <div className={styles.narrativeInner}>
      {travel.narrative.story.map((text, i) => (
        <NarrativeBlock key={i} text={text} index={i} />
      ))}
      {travel.narrative.travelerQuote && (
        <blockquote className={styles.quote}>
          "{travel.narrative.travelerQuote}"
        </blockquote>
      )}
      <div className={styles.tip}>
        <span className={styles.tipLabel}>旅行贴士</span>
        <p>{travel.narrative.tip}</p>
      </div>
    </div>
  </section>
)
