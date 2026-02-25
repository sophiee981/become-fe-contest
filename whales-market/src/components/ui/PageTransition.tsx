import { useRef, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

interface PageTransitionProps {
  children: React.ReactNode
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [stage, setStage] = useState<'enter' | 'exit'>('enter')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      // Start exit animation
      setStage('exit')

      const timeout = setTimeout(() => {
        // Scroll to top on route change
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
        setDisplayLocation(location)
        setStage('enter')
      }, 180) // exit duration

      return () => clearTimeout(timeout)
    }
  }, [location, displayLocation])

  return (
    <div
      ref={containerRef}
      className={stage === 'enter' ? 'page-enter' : 'page-exit'}
    >
      {children}
    </div>
  )
}
