import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { BrowserRouter } from 'react-router-dom'
// 1. IMPORTAR as ferramentas do React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 2. CRIAR uma instância do cliente
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            {/* 3. ENVELOPAR o <App /> com o Provider */}
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>,
)