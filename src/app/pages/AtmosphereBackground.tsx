// src/app/pages/AtmosphereBackground.tsx

import { useFilteredTravels } from '../../state/selectors'
import styles from './AtmosphereBackground.module.css'

export const AtmosphereBackground = () => {
  const travels = useFilteredTravels()
  const palette = travels[0]?.colorPalette ?? ['#0a0a0f', '#12121a', '#1a1a26']

  return (
    <div
      className={styles.atmosphere}
      style={{
        '--atmo-1': palette[0] ?? '#0a0a0f',
        '--atmo-2': palette[1] ?? palette[0] ?? '#12121a',
        '--atmo-3': palette[2] ?? palette[1] ?? palette[0] ?? '#1a1a26',
      } as React.CSSProperties}
      aria-hidden="true"
    />
  )
}
