import { nanoid } from 'nanoid'
import { getDB } from './db'
import { migrate } from './migrations'
import type { Property, Tenant, Lease, Option } from '../domain/types'
import { propertySchema, tenantSchema, leaseSchema, optionSchema, type OptionInput } from '../domain/schemas'

const nowISO = () => new Date().toISOString()

export class ValidationError extends Error {}
export class ReferentialIntegrityError extends Error {}
export class NotFoundError extends Error {}

export interface IDataProvider {
  // Properties
  listProperties(): Promise<Property[]>
  getPropertyById(id: string): Promise<Property | undefined>
  createProperty(input: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property>
  updateProperty(id: string, patch: Partial<Property>): Promise<Property>
  removeProperty(id: string): Promise<void>

  // Tenants
  listTenants(): Promise<Tenant[]>
  getTenantById(id: string): Promise<Tenant | undefined>
  createTenant(input: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tenant>
  updateTenant(id: string, patch: Partial<Tenant>): Promise<Tenant>
  removeTenant(id: string): Promise<void>

  // Leases
  listLeases(): Promise<Lease[]>
  getLeaseById(id: string): Promise<Lease | undefined>
  createLease(input: Omit<Lease, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lease>
  updateLease(id: string, patch: Partial<Lease>): Promise<Lease>
  removeLease(id: string): Promise<void>

  // Options
  listOptions(): Promise<Option[]>
  getOptionById(id: string): Promise<Option | undefined>
  createOption(input: Omit<Option, 'id' | 'createdAt' | 'updatedAt'>): Promise<Option>
  updateOption(id: string, patch: Partial<Option>): Promise<Option>
  removeOption(id: string): Promise<void>

  // Relations
  assignTenantToProperty(tenantId: string, propertyId: string): Promise<void>
  startLeaseForTenant(args: { tenantId: string, propertyId: string, startDate: string, endDate: string, rentAmount: number, currency: 'ILS'|'USD'|'EUR' }): Promise<Lease>
  addOptionToLease(leaseId: string, optionInput: Omit<Option, 'id'|'createdAt'|'updatedAt'|'leaseId'> & { leaseId?: string }): Promise<Option>
  endLease(leaseId: string, endDate: string): Promise<void>
  getContractsExpiringWithin(days: number): Promise<Lease[]>
  getChecksEndingWithin(days: number): Promise<Lease[]>
}

// Implementation
export class DataProvider implements IDataProvider {
  async init() {
    const db = getDB()
    await db.open()
    // Ensure meta version initialized and run migrations to version 2 (example)
    await migrate(2)
  }

  // ---------- Property CRUD ----------
  async listProperties() {
    const db = getDB()
    return db.properties.toArray()
  }
  async getPropertyById(id: string) {
    const db = getDB(); return db.properties.get(id)
  }
  async createProperty(input: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) {
    const db = getDB()
    const now = nowISO()
    const value: Property = {
      id: nanoid(),
      createdAt: now,
      updatedAt: now,
      ...input,
    }
    propertySchema.parse(value)
    await db.properties.add(value)
    return value
  }
  async updateProperty(id: string, patch: Partial<Property>) {
    const db = getDB()
    const current = await db.properties.get(id)
    if (!current) throw new NotFoundError('Property not found')
    const next: Property = { ...current, ...patch, id, updatedAt: nowISO() }
    propertySchema.parse(next)
    await db.properties.put(next)
    return next
  }
  async removeProperty(id: string) {
    const db = getDB()
    const tenants = await db.tenants.where('propertyId').equals(id).count()
    const leases = await db.leases.where('propertyId').equals(id).count()
    if (tenants > 0 || leases > 0) {
      throw new ReferentialIntegrityError('Cannot delete property with related tenants or leases')
    }
    await db.properties.delete(id)
  }

  // ---------- Tenant CRUD ----------
  async listTenants() { return getDB().tenants.toArray() }
  async getTenantById(id: string) { return getDB().tenants.get(id) }
  async createTenant(input: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>) {
    const db = getDB()
    const now = nowISO()
    const value: Tenant = { id: nanoid(), createdAt: now, updatedAt: now, ...input }
    tenantSchema.parse(value)
    await db.tenants.add(value)
    return value
  }
  async updateTenant(id: string, patch: Partial<Tenant>) {
    const db = getDB()
    const current = await db.tenants.get(id)
    if (!current) throw new NotFoundError('Tenant not found')
    const next: Tenant = { ...current, ...patch, id, updatedAt: nowISO() }
    tenantSchema.parse(next)
    await db.tenants.put(next)
    return next
  }
  async removeTenant(id: string) {
    const db = getDB()
    const t = await db.tenants.get(id)
    if (!t) return
    if (t.leaseId) throw new ReferentialIntegrityError('Cannot delete tenant with active lease')
    await db.tenants.delete(id)
    if (t.propertyId) {
      // remove from property's tenantIds
      const p = await db.properties.get(t.propertyId)
      if (p) {
        p.tenantIds = p.tenantIds.filter(x => x !== id)
        p.updatedAt = nowISO()
        await db.properties.put(p)
      }
    }
  }

  // ---------- Lease CRUD ----------
  async listLeases() { return getDB().leases.toArray() }
  async getLeaseById(id: string) { return getDB().leases.get(id) }
  async createLease(input: Omit<Lease, 'id' | 'createdAt' | 'updatedAt'>) {
    const db = getDB()
    const now = nowISO()
    const value: Lease = { id: nanoid(), createdAt: now, updatedAt: now, ...input }
    leaseSchema.parse(value)
    await db.leases.add(value)
    return value
  }
  async updateLease(id: string, patch: Partial<Lease>) {
    const db = getDB()
    const current = await db.leases.get(id)
    if (!current) throw new NotFoundError('Lease not found')
    const next: Lease = { ...current, ...patch, id, updatedAt: nowISO() }
    leaseSchema.parse(next)
    await db.leases.put(next)
    return next
  }
  async removeLease(id: string) {
    const db = getDB()
    const lease = await db.leases.get(id)
    if (!lease) return
    // unlink from tenant
    const tenant = await db.tenants.get(lease.tenantId)
    if (tenant && tenant.leaseId === id) {
      tenant.leaseId = undefined
      tenant.updatedAt = nowISO()
      await db.tenants.put(tenant)
    }
    // delete options
    const opts = await db.options.where('leaseId').equals(id).toArray()
    await Promise.all(opts.map(o => db.options.delete(o.id)))
    // update property status -> vacant (simple rule for baseline-1)
    const prop = await db.properties.get(lease.propertyId)
    if (prop) {
      prop.status = 'vacant'
      prop.updatedAt = nowISO()
      await db.properties.put(prop)
    }
    await db.leases.delete(id)
  }

  // ---------- Option CRUD ----------
  async listOptions() { return getDB().options.toArray() }
  async getOptionById(id: string) { return getDB().options.get(id) }
  async createOption(input: Omit<Option, 'id' | 'createdAt' | 'updatedAt'>) {
    const db = getDB()
    const now = nowISO()
    const value: Option = { id: nanoid(), createdAt: now, updatedAt: now, ...input }
    optionSchema.parse(value)
    await db.options.add(value)
    return value
  }
  async updateOption(id: string, patch: Partial<Option>) {
    const db = getDB()
    const current = await db.options.get(id)
    if (!current) throw new NotFoundError('Option not found')
    const next: Option = { ...current, ...patch, id, updatedAt: nowISO() }
    optionSchema.parse(next)
    await db.options.put(next)
    return next
  }
  async removeOption(id: string) {
    await getDB().options.delete(id)
  }

  // ---------- Relations ----------
  async assignTenantToProperty(tenantId: string, propertyId: string) {
    const db = getDB()
    const [t, p] = await Promise.all([db.tenants.get(tenantId), db.properties.get(propertyId)])
    if (!t) throw new NotFoundError('Tenant not found')
    if (!p) throw new NotFoundError('Property not found')
    t.propertyId = propertyId
    t.updatedAt = nowISO()
    await db.tenants.put(t)
    if (!p.tenantIds.includes(tenantId)) p.tenantIds.push(tenantId)
    p.updatedAt = nowISO()
    await db.properties.put(p)
  }

  async startLeaseForTenant(args: { tenantId: string, propertyId: string, startDate: string, endDate: string, rentAmount: number, currency: 'ILS'|'USD'|'EUR' }) {
    const db = getDB()
    const [t, p] = await Promise.all([db.tenants.get(args.tenantId), db.properties.get(args.propertyId)])
    if (!t) throw new NotFoundError('Tenant not found')
    if (!p) throw new NotFoundError('Property not found')

    // Create lease
    const lease: Lease = {
      id: nanoid(),
      tenantId: args.tenantId,
      propertyId: args.propertyId,
      startDate: args.startDate,
      endDate: args.endDate,
      rentAmount: args.rentAmount,
      currency: args.currency,
      checksUntil: undefined,
      optionIds: [],
      contractAttachmentId: undefined,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }
    // Validate and persist
    leaseSchema.parse(lease)
    await db.leases.add(lease)

    // link tenant & property
    t.leaseId = lease.id
    t.propertyId = args.propertyId
    t.updatedAt = nowISO()
    await db.tenants.put(t)

    if (!p.tenantIds.includes(t.id)) p.tenantIds.push(t.id)
    p.status = 'occupied'
    p.updatedAt = nowISO()
    await db.properties.put(p)

    return lease
  }

  async addOptionToLease(leaseId: string, optionInput: Omit<Option, 'id'|'createdAt'|'updatedAt'|'leaseId'> & { leaseId?: string }) {
    const db = getDB()
    const lease = await db.leases.get(leaseId)
    if (!lease) throw new NotFoundError('Lease not found')
    const opt: Option = {
      id: nanoid(),
      leaseId,
      startDate: optionInput.startDate,
      endDate: optionInput.endDate,
      price: optionInput.price,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }
    optionSchema.parse(opt)
    await db.options.add(opt)
    lease.optionIds.push(opt.id)
    lease.updatedAt = nowISO()
    await db.leases.put(lease)
    return opt
  }

  async endLease(leaseId: string, endDate: string) {
    const db = getDB()
    const lease = await db.leases.get(leaseId)
    if (!lease) throw new NotFoundError('Lease not found')
    lease.endDate = endDate
    lease.updatedAt = nowISO()
    await db.leases.put(lease)

    // unlink tenant
    const t = await db.tenants.get(lease.tenantId)
    if (t) {
      t.leaseId = undefined
      t.updatedAt = nowISO()
      await db.tenants.put(t)
    }
    // set property vacant
    const p = await db.properties.get(lease.propertyId)
    if (p) {
      p.status = 'vacant'
      p.updatedAt = nowISO()
      await db.properties.put(p)
    }
  }

  async getContractsExpiringWithin(days: number) {
    const db = getDB()
    const limit = new Date(Date.now() + days * 86400000)
    const all = await db.leases.toArray()
    return all.filter(l => new Date(l.endDate) <= limit)
  }

  async getChecksEndingWithin(days: number) {
    const db = getDB()
    const limit = new Date(Date.now() + days * 86400000)
    const all = await db.leases.toArray()
    return all.filter(l => l.checksUntil && new Date(l.checksUntil) <= limit)
  }
}
