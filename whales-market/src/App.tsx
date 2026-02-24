import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Navbar }        from '@/components/layout/Navbar'
import { Footer }        from '@/components/layout/Footer'
import { ToastProvider } from '@/components/ui/Toast'
import { AppRouter }     from '@/router'

export const App: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="min-h-screen bg-bg-base flex flex-col">
          <Navbar
            walletAddress={walletAddress}
            onConnect={setWalletAddress}
            onDisconnect={() => setWalletAddress(null)}
          />
          <main className="flex-1">
            <AppRouter />
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
