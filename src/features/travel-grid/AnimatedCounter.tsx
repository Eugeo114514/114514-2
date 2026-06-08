// src/features/travel-grid/AnimatedCounter.tsx

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../shared/hooks/useReducedMotion'
import styles from './AnimatedCounter.module.css'

interface AnimatedCounterProps {
  value: number
}

export const AnimatedCounter = ({ value }: AnimatedCounterProps) => {
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(value)
  const prevRef = useRef(value)
  const rafRef = useRef<number>()

  useEffect(() => {
    if (reduced) {
      setDisplay(value)
      return
    }

    const from = prevRef.current
    const to = value
    const duration = 400
    const start = performance.now()

    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setDisplay(Math.round(from + (to - from) * eased))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    prevRef.current = value

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [value, reduced])

  return (
    <div className={styles.counter}>
      <span className={styles.number}>{display > 0 ? display : ''}</span>
      <span className={styles.label}>
        {display > 0 ? '种不可思议被你发现' : '探索每一种不可思议'}
      </span>
      <span className={styles.subtle}>—— 还有更多，在路上</span>
    </div>
  )
}
