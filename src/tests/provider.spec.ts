import 'fake-indexeddb/auto'
import { resetDB } from '../data/db'
import { DataProvider } from '../data/DataProvider'

describe('DataProvider baseline-1', () => {
  const provider = new DataProvider()

  beforeEach(async () => {
    await resetDB()
    await provider.init()
  })

  it('creates/updates/deletes Property', async () => {
    const p = await provider.createProperty({ name: 'P1', type: 'apartment', status: 'vacant', tenantIds: [], attachmentIds: [] })
    const upd = await provider.updateProperty(p.id, { status: 'in_progress' })
    expect(upd.status).toBe('in_progress')

    // can't delete if tenant linked
    const t = await provider.createTenant({ fullName: 'T1', status: 'active' })
    await provider.assignTenantToProperty(t.id, p.id)
    await expect(provider.removeProperty(p.id)).rejects.toThrow()

    // remove tenant, then property deletable
    await provider.removeTenant(t.id)
    await provider.removeProperty(p.id)
    const list = await provider.listProperties()
    expect(list.find(x => x.id === p.id)).toBeUndefined()
  })

  it('creates/updates/deletes Tenant', async () => {
    const t = await provider.createTenant({ fullName: 'Alice', status: 'active' })
    const u = await provider.updateTenant(t.id, { status: 'inactive' })
    expect(u.status).toBe('inactive')
    await provider.removeTenant(t.id)
    const list = await provider.listTenants()
    expect(list.find(x => x.id === t.id)).toBeUndefined()
  })

  it('startLeaseForTenant links tenant & property', async () => {
    const p = await provider.createProperty({ name: 'P2', type: 'shop', status: 'vacant', tenantIds: [], attachmentIds: [] })
    const t = await provider.createTenant({ fullName: 'Bob', status: 'active' })
    const lease = await provider.startLeaseForTenant({
      tenantId: t.id, propertyId: p.id,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString(),
      rentAmount: 100, currency: 'ILS'
    })
    const p2 = (await provider.getPropertyById(p.id))!
    expect(p2.status).toBe('occupied')
    const t2 = (await provider.getTenantById(t.id))!
    expect(t2.leaseId).toBe(lease.id)
  })

  it('getContractsExpiringWithin returns expected leases', async () => {
    const p = await provider.createProperty({ name: 'P3', type: 'apartment', status: 'vacant', tenantIds: [], attachmentIds: [] })
    const t = await provider.createTenant({ fullName: 'Charlie', status: 'active' })
    await provider.assignTenantToProperty(t.id, p.id)
    const lease = await provider.startLeaseForTenant({
      tenantId: t.id, propertyId: p.id,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 3*24*60*60*1000).toISOString(),
      rentAmount: 300, currency: 'USD'
    })
    const soon = await provider.getContractsExpiringWithin(5)
    expect(soon.map(l => l.id)).toContain(lease.id)
  })

  it('getChecksEndingWithin returns expected leases', async () => {
    const p = await provider.createProperty({ name: 'P4', type: 'apartment', status: 'vacant', tenantIds: [], attachmentIds: [] })
    const t = await provider.createTenant({ fullName: 'Dana', status: 'active' })
    await provider.assignTenantToProperty(t.id, p.id)
    const lease = await provider.startLeaseForTenant({
      tenantId: t.id, propertyId: p.id,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 60*24*60*60*1000).toISOString(),
      rentAmount: 400, currency: 'EUR'
    })
    // set checksUntil ~10 days
    const { getDB } = await import('../data/db')
    await getDB().leases.update(lease.id, { checksUntil: new Date(Date.now() + 10*24*60*60*1000).toISOString() })
    const res = await provider.getChecksEndingWithin(15)
    expect(res.map(l => l.id)).toContain(lease.id)
  })

  it('endLease unlinks tenant and sets property vacant', async () => {
    const p = await provider.createProperty({ name: 'P5', type: 'apartment', status: 'vacant', tenantIds: [], attachmentIds: [] })
    const t = await provider.createTenant({ fullName: 'Eve', status: 'active' })
    await provider.assignTenantToProperty(t.id, p.id)
    const lease = await provider.startLeaseForTenant({
      tenantId: t.id, propertyId: p.id,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString(),
      rentAmount: 200, currency: 'ILS'
    })
    await provider.endLease(lease.id, new Date().toISOString())
    const tt = (await provider.getTenantById(t.id))!
    const pp = (await provider.getPropertyById(p.id))!
    expect(tt.leaseId).toBeUndefined()
    expect(pp.status).toBe('vacant')
  })
})
