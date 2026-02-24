import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Navbar }        from '@/components/layout/Navbar'
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
        </div>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
