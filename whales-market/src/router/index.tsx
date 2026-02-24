import { Routes, Route } from 'react-router-dom'
import { LandingPage }      from '@/pages/LandingPage'
import { MarketListPage }   from '@/pages/MarketListPage'
import { MarketDetailPage } from '@/pages/MarketDetailPage'
import { PortfolioPage }    from '@/pages/PortfolioPage'
import { PointsPage }       from '@/pages/PointsPage'
import { NotFoundPage }     from '@/pages/NotFoundPage'

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/"           element={<LandingPage />} />
      <Route path="/market"     element={<MarketListPage />} />
      <Route path="/market/:id" element={<MarketDetailPage />} />
      <Route path="/portfolio"  element={<PortfolioPage />} />
      <Route path="/points"     element={<PointsPage />} />
      <Route path="*"           element={<NotFoundPage />} />
    </Routes>
  )
}
