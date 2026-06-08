// src/features/travel-detail/TravelDetail.Atmosphere.tsx

import type { Travel } from '../../core/domain/Travel'
import styles from './TravelDetail.module.css'

interface AtmosphereProps {
  travel: Travel
  scrollProgress: number
}

export const TravelDetailAtmosphere = ({ travel, scrollProgress }: AtmosphereProps) => {
  const [c1, c2, c3] = travel.colorPalette

  return (
    <div
      className={styles.atmosphere}
      style={{
        background: `
          radial-gradient(
            ellipse 70% 50% at 50% ${30 + scrollProgress * 20}%,
            ${c2 ?? '#12121a'} 0%,
            transparent 60%
          ),
          radial-gradient(
            ellipse 50% 40% at 20% ${70 - scrollProgress * 30}%,
            ${c3 ?? '#1a1a26'} 0%,
            transparent 50%
          ),
          ${c1 ?? '#0a0a0f'}
        `,
      }}
      aria-hidden="true"
    />
  )
}
