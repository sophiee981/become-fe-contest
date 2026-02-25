import { Routes, Route } from 'react-router-dom'
import { LandingPage }         from '@/pages/LandingPage'
import { MarketListPage }      from '@/pages/MarketListPage'
import { MarketDetailPage }    from '@/pages/MarketDetailPage'
import { PortfolioPage }       from '@/pages/PortfolioPage'
import { PointsPage }          from '@/pages/PointsPage'
import { CreateListingPage }   from '@/pages/CreateListingPage'
import { ProfilePage }         from '@/pages/ProfilePage'
import { NotFoundPage }        from '@/pages/NotFoundPage'
import { MarketDetailV2Page }  from '@/pages/MarketDetailV2Page'

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/"           element={<LandingPage />} />
      <Route path="/market"     element={<MarketListPage />} />
      <Route path="/market/:id" element={<MarketDetailPage />} />
      <Route path="/market-v2/:id" element={<MarketDetailV2Page />} />
      <Route path="/portfolio"  element={<PortfolioPage />} />
      <Route path="/points"     element={<PointsPage />} />
      <Route path="/create"     element={<CreateListingPage />} />
      <Route path="/profile"    element={<ProfilePage />} />
      <Route path="*"           element={<NotFoundPage />} />
    </Routes>
  )
}
