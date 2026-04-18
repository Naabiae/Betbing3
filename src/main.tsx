import { Buffer } from 'buffer';
(window as any).Buffer = (window as any).Buffer || Buffer;

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { WalletWidgetProvider } from '@initia/react-wallet-widget'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <WalletWidgetProvider theme="dark">
        <App />
      </WalletWidgetProvider>
    </QueryClientProvider>
  </StrictMode>,
)