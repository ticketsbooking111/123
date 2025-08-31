import React from 'react'
import { Link } from 'react-router-dom'
import { usePropertiesList } from '@/hooks/useData'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import Badge from '@/components/ui/Badge'
import LoadDemoButton from '@/components/Dev/LoadDemoButton'

export default function PropertiesList() {
  const { data, isLoading, isError, refetch } = usePropertiesList()
  if (isLoading) return <p className="p-4">טוען…</p>
  if (isError) return <div className="p-4 space-y-2"><p>אירעה שגיאה.</p><button onClick={() => refetch()} className="px-3 py-1 rounded-lg border">נסה שוב</button></div>

  const rows = (data ?? []).map(p => [
    <Link to={`/properties/${p.id}`} className="text-blue-700 underline">{p.name}</Link>,
    p.type,
    <Badge variant={p.status as any}>{p.status}</Badge>,
    [p.address, p.areaM2 ? `• ${p.areaM2} מ״ר` : ''].filter(Boolean).join(' '),
    p.updatedAt?.slice(0,10) ?? '',
    <Link to={`/properties/${p.id}`} className="text-blue-700 underline">פרטים</Link>,
  ])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">נכסים</h2>
        <LoadDemoButton />
      </div>
      <Card>
        <Table
          headers={['שם', 'סוג', 'סטטוס', 'כתובת/שטח', 'עודכן', '']}
          rows={rows}
          empty={<span>אין רשומות. <em className="text-slate-500">טיפ DEV: לחץ "טען דמו"</em></span>}
        />
      </Card>
    </div>
  )
}
