// src/shared/components/CommentSection.tsx

import { useState } from 'react'
import { useSocialStore } from '../../state/social'
import styles from './CommentSection.module.css'

interface CommentSectionProps {
  travelId: string
}

export const CommentSection = ({ travelId }: CommentSectionProps) => {
  const comments = useSocialStore((s) => s.comments[travelId] ?? [])
  const addComment = useSocialStore((s) => s.addComment)
  const [text, setText] = useState('')
  const [author, setAuthor] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!text.trim()) return
    addComment(travelId, author, text)
    setText('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 2000)
  }

  return (
    <section className={styles.section}>
      <h3 className={styles.heading}>
        旅人回声 {comments.length > 0 && `(${comments.length})`}
      </h3>

      {/* Input */}
      <div className={styles.inputBox}>
        <input
          className={styles.nameInput}
          placeholder="你的名字（选填）"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          maxLength={16}
        />
        <textarea
          className={styles.textInput}
          placeholder="分享你的感受…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          maxLength={300}
        />
        <button
          className={`${styles.submit} ${submitted ? styles.submitted : ''}`}
          onClick={handleSubmit}
          disabled={!text.trim()}
        >
          {submitted ? '✓ 已发送' : '留下回声'}
        </button>
      </div>

      {/* Comments list */}
      {comments.length > 0 && (
        <div className={styles.list}>
          {[...comments].reverse().map((c) => (
            <div key={c.id} className={styles.comment}>
              <div className={styles.commentMeta}>
                <span className={styles.commentAuthor}>{c.author}</span>
                <span className={styles.commentTime}>
                  {new Date(c.time).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className={styles.commentText}>{c.text}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
