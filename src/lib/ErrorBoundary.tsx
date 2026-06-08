// src/lib/ErrorBoundary.tsx

import { Component, type ErrorInfo, type ReactNode } from 'react'
import { logger } from './logger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error('ErrorBoundary caught error', {
      error: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'var(--bg-deep)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-body)',
          padding: '2rem',
          gap: '1.5rem',
          textAlign: 'center',
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.08), transparent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
          }}>
            ✦
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>
            有些不可思议出了点意外
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 400 }}>
            刷新一下，奇迹可能就回来了
          </p>
          <button
            onClick={this.handleReset}
            style={{
              padding: '10px 24px',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '100px',
              background: 'rgba(255,255,255,0.06)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
              cursor: 'pointer',
            }}
          >
            再试一次
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
