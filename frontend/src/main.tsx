import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { Toaster } from '@/components/ui/toaster'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import MindScanPage from '@/pages/MindScanPage'

import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-mindscan-bg">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<MindScanPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  </React.StrictMode>
)
