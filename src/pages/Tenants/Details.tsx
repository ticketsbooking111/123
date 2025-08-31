import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTenant, usePropertiesList } from '@/hooks/useData'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Table from '@/components/ui/Table'
import { DataProvider } from '@/data/DataProvider'

export default function TenantDetails() {
  const { id = '' } = useParams()
  const { data: tenant, isLoading, isError } = useTenant(id)
  const { data: properties } = usePropertiesList()

  if (isLoading) return <p className="p-4">טוען…</p>
  if (isError || !tenant) return <p className="p-4">לא נמצא דייר.</p>

  const pName = properties?.find(p => p.id === tenant.propertyId)?.name

  const dp = new DataProvider()
  const [leases, setLeases] = React.useState<any[]>([])
  const [options, setOptions] = React.useState<any[]>([])
  React.useEffect(() => {
    ;(async () => {
      await dp.init()
      const L = await dp.listLeases()
      const O = await dp.listOptions()
      const myLeases = L.filter(l => l.tenantId === tenant.id)
      setLeases(myLeases)
      setOptions(O.filter(o => myLeases.some(l => l.id === o.leaseId)))
    })()
  }, [id])

  const leaseRows = leases.map(l => [
    l.startDate.slice(0,10),
    l.endDate.slice(0,10),
    `${l.rentAmount} ${l.currency}`,
    l.checksUntil ? l.checksUntil.slice(0,10) : '—',
  ])

  const optionRows = options.map(o => [o.startDate.slice(0,10), o.endDate.slice(0,10), o.price ?? '—'])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">{tenant.fullName}</h2>
        <Badge variant={tenant.status as any}>{tenant.status}</Badge>
      </div>

      <Card title="פרטי דייר">
        <div className="grid md:grid-cols-2 gap-2 text-sm">
          <div><span className="text-slate-500">טלפון:</span> {tenant.phone ?? '—'}</div>
          <div><span className="text-slate-500">אימייל:</span> {tenant.email ?? '—'}</div>
          <div><span className="text-slate-500">ת.ז./ח.פ:</span> {tenant.idNumber ?? '—'}</div>
        </div>
      </Card>

      <Card title="נכס משויך">
        {tenant.propertyId ? (
          <Link to={`/properties/${tenant.propertyId}`} className="text-blue-700 underline">{pName ?? tenant.propertyId}</Link>
        ) : '—'}
      </Card>

      <Card title="חוזה פעיל / היסטוריה">
        <Table headers={['התחלה', 'סיום', 'שכ״ד', 'צ׳קים עד']} rows={leaseRows} empty="אין חוזים" />
      </Card>

      <Card title="אופציות">
        <Table headers={['התחלה', 'סיום', 'מחיר']} rows={optionRows} empty="אין אופציות" />
      </Card>

      <div><Link to="/tenants" className="text-blue-700 underline">← חזרה לרשימת דיירים</Link></div>
    </div>
  )
}
