// src/features/contribute/ContributeModal.tsx

import { useState, type FormEvent } from 'react'
import { useAppStore } from '../../state/store'
import type { Travel, TravelCategory, MoodTag, Budget } from '../../core/domain/Travel'
import { logger } from '../../lib/logger'
import styles from './ContributeModal.module.css'

const CATEGORIES: TravelCategory[] = ['adventure', 'healing', 'cultural', 'extreme', 'mystery']
const CAT_LABELS: Record<TravelCategory, string> = {
  adventure: '冒险', healing: '治愈', cultural: '人文', extreme: '极限', mystery: '秘境',
}
const MOODS: MoodTag[] = ['自由','震撼','治愈','孤独','热血','诗意','荒诞','静谧','复古','未来感']
const PALETTES = [
  ['#1a0a0a','#3d1a1a','#8b3a3a','#d4a06a'], ['#0a1a2e','#162a4e','#2a5a9e','#7ab8e0'],
  ['#1a1a0a','#3a3a1a','#7a7a2a','#baba5a'], ['#0d1b2a','#1b2a3d','#3a5a7a','#7a9aba'],
  ['#2d1b00','#5c3d1a','#b8860b','#f5d08c'],
]

interface ContributeModalProps {
  onClose: () => void
}

export const ContributeModal = ({ onClose }: ContributeModalProps) => {
  const [title, setTitle] = useState('')
  const [destination, setDest] = useState('')
  const [category, setCat] = useState<TravelCategory>('cultural')
  const [mood, setMood] = useState<MoodTag>('诗意')
  const [intro, setIntro] = useState('')
  const [story, setStory] = useState('')
  const [budget, setBudget] = useState<Budget>('¥¥')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !destination.trim()) return

    const travelId = `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)]

    const newTravel: Travel = {
      id: travelId,
      title: title.trim(),
      subtitle: intro.trim() || `在${destination.trim()}，发现一种不可思议`,
      category,
      unbelievableIndex: 60 + Math.floor(Math.random() * 25),
      indexBreakdown: { uniqueness: 22, depth: 20, visualImpact: 18 },
      primaryMood: mood,
      secondaryMood: '自由',
      heroImage: `https://picsum.photos/seed/${travelId}h/1200/800`,
      cardImage: `https://picsum.photos/seed/${travelId}c/600/800`,
      colorPalette: [...palette, '#ffffff'],
      narrative: {
        intro: `${destination.trim()} | 由旅人投稿`,
        story: story.trim()
          ? story.trim().split('\n').filter(Boolean)
          : [
              `一位旅人分享了${destination.trim()}的体验。`,
              '这个地方不在任何主流攻略上。',
              '但来过的人都说——值得。',
              '也许下一个发现它的人，就是你。',
            ],
        tip: `由社区旅人推荐，出发前建议多做功课。`,
      },
      destination: destination.trim(),
      duration: '3-7天',
      bestSeason: '全年皆宜',
      budget,
    }

    // Add to store
    const store = useAppStore.getState()
    const newTravels = [...store.travels, newTravel]
    store.setTravels(newTravels)

    // Also persist to localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('flypig-contributed') ?? '[]')
      stored.push(newTravel)
      localStorage.setItem('flypig-contributed', JSON.stringify(stored))
    } catch { /* quota exceeded */ }

    logger.info(`User contributed travel: ${newTravel.title}`)
    setSubmitted(true)
    setTimeout(() => {
      onClose()
      setSubmitted(false)
    }, 1500)
  }

  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className={styles.modal}>
        {submitted ? (
          <div className={styles.success}>
            <div className={styles.successIcon}>✦</div>
            <h3>感谢你的分享</h3>
            <p>这片不可思议已加入探索地图</p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <h2 className={styles.formTitle}>分享你的不可思议</h2>
            <p className={styles.formSub}>每个小众角落，都值得被看见</p>

            <input className={styles.input} placeholder="目的地名称 *" value={destination} onChange={(e) => setDest(e.target.value)} maxLength={30} required />
            <input className={styles.input} placeholder="给它一个诗意的标题 *" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={60} required />

            <div className={styles.row}>
              <select className={styles.select} value={category} onChange={(e) => setCat(e.target.value as TravelCategory)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
              </select>
              <select className={styles.select} value={mood} onChange={(e) => setMood(e.target.value as MoodTag)}>
                {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <select className={styles.select} value={budget} onChange={(e) => setBudget(e.target.value as Budget)}>
                <option value="¥">轻奢</option>
                <option value="¥¥">进阶</option>
                <option value="¥¥¥">顶配</option>
              </select>
            </div>

            <input className={styles.input} placeholder="一句话描述（选填）" value={intro} onChange={(e) => setIntro(e.target.value)} maxLength={100} />
            <textarea className={styles.textarea} placeholder="说说那里的故事…（选填，支持换行分段）" value={story} onChange={(e) => setStory(e.target.value)} rows={4} maxLength={600} />

            <div className={styles.actions}>
              <button type="button" className={styles.cancel} onClick={onClose}>取消</button>
              <button type="submit" className={styles.submitBtn} disabled={!title.trim() || !destination.trim()}>
                提交投稿
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
