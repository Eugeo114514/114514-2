// src/shared/components/GlassCard.tsx

import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import styles from './GlassCard.module.css'

type GlassCardProps = ComponentPropsWithoutRef<'div'> & {
  interactive?: boolean
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ interactive = false, className = '', children, ...props }, ref) => {
    const cls = [
      styles.card,
      interactive ? styles.interactive : '',
      className,
    ].filter(Boolean).join(' ')

    return (
      <div ref={ref} className={cls} {...props}>
        {children}
      </div>
    )
  }
)

GlassCard.displayName = 'GlassCard'
