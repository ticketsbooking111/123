import Dexie, { Table } from 'dexie'
import type { Property, Tenant, Lease, Option, MetaKV } from '../domain/types'

class PMDatabase extends Dexie {
  properties!: Table<Property, string>
  tenants!: Table<Tenant, string>
  leases!: Table<Lease, string>
  options!: Table<Option, string>
  meta!: Table<MetaKV, string>

  constructor() {
    super('pm')
    this.version(1).stores({
      properties: 'id, name, type, status, updatedAt',
      tenants: 'id, fullName, status, propertyId, leaseId, updatedAt',
      leases: 'id, tenantId, propertyId, endDate, updatedAt',
      options: 'id, leaseId, endDate, updatedAt',
      meta: 'key',
    })
  }
}

let db: PMDatabase | null = null

export function getDB() {
  if (!db) db = new PMDatabase()
  return db
}

export async function resetDB() {
  if (db) {
    const name = db.name
    await db.delete()
    db = new PMDatabase()
    await db.open()
    return name
  } else {
    db = new PMDatabase()
    await db.open()
    return db.name
  }
}
