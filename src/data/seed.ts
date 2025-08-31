import { DataProvider } from './DataProvider'

export async function seed() {
  const provider = new DataProvider()
  await provider.init()

  // Properties
  const apt = await provider.createProperty({
    name: 'דירה רח׳ המייסדים 10',
    type: 'apartment',
    address: 'רח׳ המייסדים 10, תל אביב',
    areaM2: 75,
    rooms: 3,
    status: 'vacant',
    tenantIds: [],
    attachmentIds: [],
  })
  const shop = await provider.createProperty({
    name: 'חנות קניון מרכזי',
    type: 'shop',
    address: 'קניון מרכזי, קומה 1',
    status: 'vacant',
    tenantIds: [],
    attachmentIds: [],
  })

  // Tenants
  const t1 = await provider.createTenant({ fullName: 'נועה כהן', status: 'active', propertyId: undefined, leaseId: undefined })
  const t2 = await provider.createTenant({ fullName: 'יוסי לוי',  status: 'active', propertyId: undefined, leaseId: undefined })
  const t3 = await provider.createTenant({ fullName: 'דנה ישראלי', status: 'inactive', propertyId: undefined, leaseId: undefined })

  // Assign & start leases
  await provider.assignTenantToProperty(t1.id, apt.id)
  const lease1 = await provider.startLeaseForTenant({
    tenantId: t1.id,
    propertyId: apt.id,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 180*24*60*60*1000).toISOString(), // 6 months
    rentAmount: 5800,
    currency: 'ILS',
  })
  // checksUntil in ~3 months
  const checks3m = new Date(Date.now() + 90*24*60*60*1000).toISOString()
  await (await import('./db')).getDB().leases.update(lease1.id, { checksUntil: checks3m })

  await provider.assignTenantToProperty(t2.id, shop.id)
  const lease2 = await provider.startLeaseForTenant({
    tenantId: t2.id,
    propertyId: shop.id,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 365*24*60*60*1000).toISOString(),
    rentAmount: 12000,
    currency: 'ILS',
  })

  // Options
  await provider.addOptionToLease(lease1.id, {
    startDate: new Date(Date.now() + 180*24*60*60*1000).toISOString(),
    endDate:   new Date(Date.now() + 360*24*60*60*1000).toISOString(),
    price: 6000,
  })
  await provider.addOptionToLease(lease2.id, {
    startDate: new Date(Date.now() + 365*24*60*60*1000).toISOString(),
    endDate:   new Date(Date.now() + 545*24*60*60*1000).toISOString(),
  })

  return { properties: [apt, shop], tenants: [t1, t2, t3], leases: [lease1, lease2] }
}
