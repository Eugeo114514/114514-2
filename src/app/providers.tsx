// src/app/providers.tsx

import { type ReactNode } from 'react'
import { ErrorBoundary } from '../lib/ErrorBoundary'

interface ProvidersProps {
  children: ReactNode
}

export const Providers = ({ children }: ProvidersProps) => (
  <ErrorBoundary>
    {children}
  </ErrorBoundary>
)
