import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProperty, useTenantsList } from '@/hooks/useData'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Table from '@/components/ui/Table'
import { DataProvider } from '@/data/DataProvider'

export default function PropertyDetails() {
  const { id = '' } = useParams()
  const { data: property, isLoading, isError } = useProperty(id)
  const { data: tenants } = useTenantsList()

  if (isLoading) return <p className="p-4">טוען…</p>
  if (isError || !property) return <p className="p-4">לא נמצא נכס.</p>

  const dp = new DataProvider()
  // leases by property
  const [leases, setLeases] = React.useState<any[]>([])
  React.useEffect(() => {
    (async () => {
      await dp.init()
      const all = await dp.listLeases()
      setLeases(all.filter(l => l.propertyId === property.id))
    })()
  }, [id])

  const tenantRows = (tenants ?? [])
    .filter(t => property.tenantIds.includes(t.id))
    .map(t => [<Link to={`/tenants/${t.id}`} className="text-blue-700 underline">{t.fullName}</Link>, t.status])

  const leaseRows = leases.map(l => [
    l.startDate.slice(0,10),
    l.endDate.slice(0,10),
    `${l.rentAmount} ${l.currency}`,
    l.checksUntil ? l.checksUntil.slice(0,10) : '—',
  ])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">{property.name}</h2>
        <Badge variant={property.status as any}>{property.status}</Badge>
      </div>

      <Card title="פרטי נכס">
        <div className="grid md:grid-cols-2 gap-2 text-sm">
          <div><span className="text-slate-500">סוג:</span> {property.type}</div>
          <div><span className="text-slate-500">כתובת:</span> {property.address ?? '—'}</div>
          <div><span className="text-slate-500">שטח:</span> {property.areaM2 ? `${property.areaM2} מ״ר` : '—'}</div>
          <div><span className="text-slate-500">חדרים:</span> {property.rooms ?? '—'}</div>
        </div>
      </Card>

      <Card title="דיירים משויכים">
        <Table headers={['שם', 'סטטוס']} rows={tenantRows} empty="אין דיירים" />
      </Card>

      <Card title="חוזים">
        <Table headers={['התחלה', 'סיום', 'שכ״ד', 'צ׳קים עד']} rows={leaseRows} empty="אין חוזים" />
      </Card>

      <Card title="קבצים מצורפים">
        <ul className="list-disc pr-6 text-sm text-slate-600">
          {(property.attachmentIds ?? []).map(a => <li key={a}>{a}</li>)}
          {property.attachmentIds?.length === 0 && <li>—</li>}
        </ul>
      </Card>

      <div><Link to="/properties" className="text-blue-700 underline">← חזרה לרשימת נכסים</Link></div>
    </div>
  )
}
