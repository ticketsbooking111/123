import React from 'react'
import { NavLink } from 'react-router-dom'

function NavItem({ to, children }: { to: string, children: React.ReactNode }) {
  return (
    <NavLink to={to} className={({ isActive }) =>
      `px-3 py-1 rounded-lg ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-200'}`
    }>
      {children}
    </NavLink>
  )
}

export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
        <h1 className="font-bold">מערכת ניהול נכסים ודיירים</h1>
        <nav className="flex gap-2">
          <NavItem to="/properties">נכסים</NavItem>
          <NavItem to="/tenants">דיירים</NavItem>
        </nav>
      </div>
    </header>
  )
}
