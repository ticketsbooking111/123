import { z } from 'zod'

export const idSchema = z.string().min(1)

export const propertySchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  type: z.enum(['apartment', 'shop', 'building']),
  address: z.string().optional(),
  areaM2: z.number().positive().optional(),
  rooms: z.number().int().positive().optional(),
  status: z.enum(['vacant', 'occupied', 'in_progress']),
  tenantIds: z.array(z.string()),
  attachmentIds: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const tenantSchema = z.object({
  id: idSchema,
  fullName: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  idNumber: z.string().optional(),
  status: z.enum(['active', 'inactive']),
  propertyId: z.string().optional(),
  leaseId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const leaseSchema = z.object({
  id: idSchema,
  tenantId: z.string().min(1),
  propertyId: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  rentAmount: z.number(),
  currency: z.enum(['ILS', 'USD', 'EUR']),
  checksUntil: z.string().optional(),
  optionIds: z.array(z.string()),
  contractAttachmentId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const optionSchema = z.object({
  id: idSchema,
  leaseId: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  price: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type PropertyInput = Omit<z.infer<typeof propertySchema>, 'id' | 'createdAt' | 'updatedAt'>
export type TenantInput   = Omit<z.infer<typeof tenantSchema>, 'id' | 'createdAt' | 'updatedAt'>
export type LeaseInput    = Omit<z.infer<typeof leaseSchema>, 'id' | 'createdAt' | 'updatedAt'>
export type OptionInput   = Omit<z.infer<typeof optionSchema>, 'id' | 'createdAt' | 'updatedAt'>

export function validate<T>(schema: z.ZodType<T>, data: unknown): T {
  return schema.parse(data)
}
