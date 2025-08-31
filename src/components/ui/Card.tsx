import React from 'react'

export default function Card({ title, children }: { title?: React.ReactNode, children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl shadow p-5 border">
      {title && <h2 className="text-lg font-semibold mb-3">{title}</h2>}
      {children}
    </section>
  )
}
