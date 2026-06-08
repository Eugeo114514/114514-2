// src/app/App.tsx

import { Providers } from './providers'
import { AppRouter } from './router'
import '../shared/styles/global.css'

export const App = () => (
  <Providers>
    <AppRouter />
  </Providers>
)
