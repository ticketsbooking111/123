import React from 'react'
import { Link } from 'react-router-dom'
import { useTenantsList, usePropertiesList } from '@/hooks/useData'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import Badge from '@/components/ui/Badge'
import LoadDemoButton from '@/components/Dev/LoadDemoButton'

export default function TenantsList() {
  const { data: tenants, isLoading, isError, refetch } = useTenantsList()
  const { data: properties } = usePropertiesList()

  if (isLoading) return <p className="p-4">טוען…</p>
  if (isError) return <div className="p-4 space-y-2"><p>אירעה שגיאה.</p><button onClick={() => refetch()} className="px-3 py-1 rounded-lg border">נסה שוב</button></div>

  const propById = new Map((properties ?? []).map(p => [p.id, p]))

  const rows = (tenants ?? []).map(t => [
    <Link to={`/tenants/${t.id}`} className="text-blue-700 underline">{t.fullName}</Link>,
    <Badge variant={t.status as any}>{t.status}</Badge>,
    [t.phone, t.email].filter(Boolean).join(' · ') || '—',
    t.propertyId ? <Link to={`/properties/${t.propertyId}`} className="text-blue-700 underline">{propById.get(t.propertyId)?.name ?? t.propertyId}</Link> : '—',
    t.updatedAt?.slice(0,10) ?? '',
    <Link to={`/tenants/${t.id}`} className="text-blue-700 underline">פרטים</Link>,
  ])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">דיירים</h2>
        <LoadDemoButton />
      </div>
      <Card>
        <Table
          headers={['שם', 'סטטוס', 'טלפון/אימייל', 'נכס משויך', 'עודכן', '']}
          rows={rows}
          empty={<span>אין רשומות. <em className="text-slate-500">טיפ DEV: לחץ "טען דמו"</em></span>}
        />
      </Card>
    </div>
  )
}
