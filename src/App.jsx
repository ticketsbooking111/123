import React from 'react'

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-8 space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold">מערכת ניהול נכסים ודיירים</h1>
          <p className="text-slate-600">Baseline-0 — תשתית: Vite + React + Electron + Tailwind</p>
        </header>

        <section className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border p-4">
            <h2 className="font-semibold mb-2">סטטוס סביבת פיתוח</h2>
            <ul className="list-disc pr-5 space-y-1 text-slate-700">
              <li>Vite רץ כשרת פיתוח</li>
              <li>React עולה תקין</li>
              <li>Tailwind פעיל</li>
              <li>Electron נטען על חלון דסקטופ</li>
            </ul>
          </div>
          <div className="rounded-xl border p-4">
            <h2 className="font-semibold mb-2">Roadmap</h2>
            <ol className="list-decimal pr-5 space-y-1 text-slate-700">
              <li>מודל נתונים ושירות (baseline-1)</li>
              <li>UI בסיסי רשימות/פרטים (baseline-2)</li>
              <li>עריכה מלאה + קבצים (baseline-3)</li>
              <li>חיפוש/סינון/אוטוקומפליט (baseline-4)</li>
              <li>ייבוא CSV/Excel (baseline-5)</li>
              <li>דשבורד ודוחות (baseline-6)</li>
              <li>אריזה ושחרור (release-1.0.0)</li>
            </ol>
          </div>
        </section>

        <footer className="text-xs text-slate-500">
          נבנה כדי לגדול בצורה מודולרית. כל שלב יגיע כ־ZIP מוכן להרצה.
        </footer>
      </div>
    </div>
  )
}
