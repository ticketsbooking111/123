import React from 'react'
import { seed } from '@/data/seed'
import { useQueryClient } from '@tanstack/react-query'

export default function LoadDemoButton() {
  const qc = useQueryClient()
  if (import.meta.env.MODE !== 'development') return null

  const onClick = async () => {
    await seed()
    // invalidate caches
    qc.invalidateQueries()
  }
  return (
    <button onClick={onClick} className="text-xs px-3 py-1 rounded-lg border bg-slate-50 hover:bg-slate-100">
      טען דמו
    </button>
  )
}
