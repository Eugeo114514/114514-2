// src/app/router.tsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { BrowsePage } from './pages/BrowsePage'
import { TravelDetail } from '../features/travel-detail/TravelDetail'

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/browse" replace />} />
      <Route path="/browse" element={<BrowsePage />} />
      <Route path="/browse/:id" element={<TravelDetail />} />
    </Routes>
  </BrowserRouter>
)
