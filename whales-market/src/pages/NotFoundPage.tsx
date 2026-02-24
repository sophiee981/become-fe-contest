import { Link } from 'react-router-dom'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Home } from 'lucide-react'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-24">
      <PageWrapper>
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-[80px] font-bold text-text-muted opacity-30 leading-none mb-4">404</p>
          <h1 className="text-28 font-bold text-text-primary mb-2">Page not found</h1>
          <p className="text-16 text-text-secondary mb-8 max-w-sm">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/">
            <Button variant="primary" size="lg" icon={<Home size={18} />}>
              Back to Home
            </Button>
          </Link>
        </div>
      </PageWrapper>
    </div>
  )
}
