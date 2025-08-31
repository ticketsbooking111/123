import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '@/components/Layout/Header'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const qc = new QueryClient()

export default function AppLayout() {
  return (
    <QueryClientProvider client={qc}>
      <Header />
      <main className="max-w-6xl mx-auto p-6">
        <Outlet />
      </main>
      <footer className="text-xs text-slate-500 text-center py-6">Baseline-2 — תצוגה בלבד</footer>
    </QueryClientProvider>
  )
}
