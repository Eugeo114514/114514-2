// src/shared/hooks/useParallax.ts

import { useRef, useEffect, useCallback } from 'react'
import { useReducedMotion } from './useReducedMotion'

interface ParallaxOptions {
  intensity?: number
  maxOffset?: number
}

export const useParallax = (options: ParallaxOptions = {}) => {
  const { intensity = 0.05, maxOffset = 12 } = options
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = useCallback((e: MouseEvent) => {
    if (reduced || !ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    const offsetX = x * maxOffset * 2 * intensity / 0.05
    const offsetY = y * maxOffset * 2 * intensity / 0.05

    ref.current.style.transform = `perspective(1000px) translate3d(${offsetX}px, ${offsetY}px, 0)`
  }, [intensity, maxOffset, reduced])

  const handleLeave = useCallback(() => {
    if (!ref.current) return
    ref.current.style.transform = 'perspective(1000px) translate3d(0, 0, 0)'
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [handleMove, handleLeave])

  return ref
}
