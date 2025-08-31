import React from 'react'

type Variant = 'vacant' | 'occupied' | 'in_progress' | 'active' | 'inactive' | 'default'

export default function Badge({ variant, children }: { variant?: Variant, children: React.ReactNode }) {
  const map: Record<Variant, string> = {
    vacant: 'bg-emerald-100 text-emerald-800',
    occupied: 'bg-rose-100 text-rose-800',
    in_progress: 'bg-amber-100 text-amber-800',
    active: 'bg-emerald-100 text-emerald-800',
    inactive: 'bg-slate-200 text-slate-700',
    default: 'bg-slate-100 text-slate-800',
  }
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[variant ?? 'default']}`}>{children}</span>
}
