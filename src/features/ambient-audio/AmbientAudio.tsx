// src/features/ambient-audio/AmbientAudio.tsx
// Gentle ambient piano-like tones using Web Audio API

import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './AmbientAudio.module.css'

type PlayState = 'off' | 'on'

// Pentatonic scale — naturally soothing, no wrong notes
const SCALE = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25]

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const createAudioContext = (): AudioContext => {
  const ctx = new AudioContext()
  // Master gain — keep it gentle
  const master = ctx.createGain()
  master.gain.value = 0.08
  master.connect(ctx.destination)

  return ctx
}

export const AmbientAudio = () => {
  const [state, setState] = useState<PlayState>('off')
  const ctxRef = useRef<AudioContext | null>(null)
  const timerRef = useRef<number | null>(null)
  const masterRef = useRef<GainNode | null>(null)

  const playNote = useCallback(() => {
    const ctx = ctxRef.current
    const master = masterRef.current
    if (!ctx || !master) return

    if (ctx.state === 'suspended') {
      ctx.resume()
    }

    const freq = pick(SCALE)
    const now = ctx.currentTime

    // Oscillator — warm sine
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq

    // Gentle envelope via gain node
    const env = ctx.createGain()
    env.gain.setValueAtTime(0, now)
    env.gain.linearRampToValueAtTime(0.12, now + 0.3)   // attack
    env.gain.linearRampToValueAtTime(0.04, now + 1.5)    // sustain
    env.gain.linearRampToValueAtTime(0, now + 4.0)       // release

    osc.connect(env)
    env.connect(master)

    osc.start(now)
    osc.stop(now + 4.5)
  }, [])

  // Schedule notes at random intervals
  useEffect(() => {
    if (state === 'off') {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }

    const schedule = () => {
      playNote()
      // Random delay between 2-6 seconds
      const delay = 2000 + Math.random() * 4000
      timerRef.current = window.setTimeout(schedule, delay)
    }

    // Start first note after a short delay
    timerRef.current = window.setTimeout(schedule, 800)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [state, playNote])

  const toggle = useCallback(() => {
    setState((prev) => {
      const next: PlayState = prev === 'off' ? 'on' : 'off'

      if (next === 'on') {
        // Lazy init AudioContext (must happen after user gesture)
        if (!ctxRef.current) {
          const ctx = createAudioContext()
          const master = ctx.createGain()
          master.gain.value = 0.08
          master.connect(ctx.destination)
          ctxRef.current = ctx
          masterRef.current = master
        }
      } else {
        // Suspend to release resources
        ctxRef.current?.suspend()
      }

      return next
    })
  }, [])

  return (
    <button
      className={`${styles.toggle} ${state === 'on' ? styles.on : ''}`}
      onClick={toggle}
      aria-label={state === 'on' ? '暂停背景音乐' : '播放背景音乐'}
      title={state === 'on' ? '暂停背景音乐' : '播放背景音乐'}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {state === 'on' ? (
          <>
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
            <line x1="4" y1="20" x2="4" y2="20" />
          </>
        ) : (
          <>
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
            <line x1="1" y1="20" x2="8" y2="16" strokeWidth="2" />
          </>
        )}
      </svg>
      <span className={styles.label}>
        {state === 'on' ? '静音' : '灵韵'}
      </span>
    </button>
  )
}
