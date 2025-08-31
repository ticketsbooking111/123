import React from 'react'

export default function Table({ headers, rows, empty }: { headers: React.ReactNode[], rows: React.ReactNode[][], empty?: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            {headers.map((h, i) => (
              <th key={i} scope="col" className="text-right font-semibold px-3 py-2 border-b">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td className="px-3 py-4 text-slate-500" colSpan={headers.length}>{empty ?? 'אין רשומות עדיין'}</td></tr>
          )}
          {rows.map((r, i) => (
            <tr key={i} className="odd:bg-white even:bg-slate-50">
              {r.map((c, j) => <td key={j} className="px-3 py-2 border-b align-top">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
