/**
 * Sanity script:
 * - reset DB
 * - seed
 * - basic CRUD & relation checks
 * - print small stats
 *
 * Run with: npm run sanity
 */

import 'fake-indexeddb/auto' // Node env IndexedDB
import { resetDB } from '../data/db'
import { DataProvider } from '../data/DataProvider'
import { seed } from '../data/seed'

async function main() {
  await resetDB()

  const provider = new DataProvider()
  await provider.init()

  const seeded = await seed()
  console.log('[seeded]', {
    properties: seeded.properties.length,
    tenants: seeded.tenants.length,
    leases: seeded.leases.length,
  })

  // CRUD: update property name
  const p0 = seeded.properties[0]
  await provider.updateProperty(p0.id, { name: p0.name + ' (עודכן)' })

  // Relations & queries
  const expiring180 = await provider.getContractsExpiringWithin(200)
  const checks90 = await provider.getChecksEndingWithin(100)

  console.log('[stats]', {
    properties: (await provider.listProperties()).length,
    tenants: (await provider.listTenants()).length,
    leases: (await provider.listLeases()).length,
    expiringWithin200d: expiring180.map(l => l.id),
    checksEndingWithin100d: checks90.map(l => l.id),
  })

  // End first lease, verify property becomes vacant
  const l1 = seeded.leases[0]
  await provider.endLease(l1.id, new Date().toISOString())
  const props = await provider.listProperties()
  console.log('[after endLease]', props.map(p => ({ id: p.id, name: p.name, status: p.status })))

  console.log('Sanity OK ✅')
}

main().catch(err => {
  console.error('Sanity FAILED ❌', err)
  process.exit(1)
})
