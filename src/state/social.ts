// src/state/social.ts
// Like & comment system with localStorage persistence

import { create } from 'zustand'

interface Comment {
  id: string
  author: string
  text: string
  time: number
}

interface SocialState {
  likes: Record<string, number>       // travelId → like count
  userLikes: Record<string, boolean>  // travelId → has current user liked
  comments: Record<string, Comment[]> // travelId → comments

  toggleLike: (travelId: string) => void
  addComment: (travelId: string, author: string, text: string) => void
  getLikeCount: (travelId: string) => number
  hasLiked: (travelId: string) => boolean
  getComments: (travelId: string) => Comment[]
}

const STORAGE_KEY = 'flypig-social'

const load = (): Partial<SocialState> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

const save = (state: Partial<SocialState>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      likes: state.likes,
      userLikes: state.userLikes,
      comments: state.comments,
    }))
  } catch { /* quota exceeded, silently fail */ }
}

const persisted = load()

export const useSocialStore = create<SocialState>((set, get) => ({
  likes: persisted.likes ?? {},
  userLikes: persisted.userLikes ?? {},
  comments: persisted.comments ?? {},

  toggleLike: (travelId: string) => {
    const { likes, userLikes } = get()
    const nextLikes = { ...likes }
    const nextUserLikes = { ...userLikes }

    if (nextUserLikes[travelId]) {
      delete nextUserLikes[travelId]
      nextLikes[travelId] = Math.max(0, (nextLikes[travelId] ?? 0) - 1)
    } else {
      nextUserLikes[travelId] = true
      nextLikes[travelId] = (nextLikes[travelId] ?? 0) + 1
    }

    set({ likes: nextLikes, userLikes: nextUserLikes })
    save({ likes: nextLikes, userLikes: nextUserLikes })
  },

  addComment: (travelId: string, author: string, text: string) => {
    const { comments } = get()
    const next = { ...comments }
    const list = [...(next[travelId] ?? [])]
    list.push({
      id: `${travelId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      author: author || '匿名旅人',
      text: text.trim(),
      time: Date.now(),
    })
    next[travelId] = list
    set({ comments: next })
    save({ comments: next })
  },

  getLikeCount: (travelId: string) => get().likes[travelId] ?? 0,
  hasLiked: (travelId: string) => !!get().userLikes[travelId],
  getComments: (travelId: string) => get().comments[travelId] ?? [],
}))
