import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Import React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Créer une instance de QueryClient (gestionnaire de cache/requêtes)
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* On englobe App dans QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
