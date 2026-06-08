// src/features/starfield/Starfield.tsx
// BanG Dream-style floating star/sparkle particles

import { useMemo } from 'react'
import { useReducedMotion } from '../../shared/hooks/useReducedMotion'
import styles from './Starfield.module.css'

interface Particle {
  id: number
  left: string
  top: string
  size: number
  delay: string
  duration: string
  opacity: number
  type: 'star' | 'dot' | 'sparkle'
}

const generate = (count: number): Particle[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 2 + Math.random() * 6,
    delay: `${Math.random() * 8}s`,
    duration: `${3 + Math.random() * 6}s`,
    opacity: 0.15 + Math.random() * 0.45,
    type: (['star', 'dot', 'dot', 'dot', 'sparkle'] as const)[
      Math.floor(Math.random() * 5)
    ],
  }))

export const Starfield = () => {
  const reduced = useReducedMotion()
  const particles = useMemo(() => generate(reduced ? 0 : 60), [reduced])

  return (
    <div className={styles.field} aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`${styles.particle} ${styles[p.type]}`}
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  )
}
