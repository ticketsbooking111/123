export type ID = string;

export type PropertyType = 'apartment' | 'shop' | 'building';
export type PropertyStatus = 'vacant' | 'occupied' | 'in_progress';

export interface Property {
  id: ID;
  name: string;
  type: PropertyType;
  address?: string;
  areaM2?: number;
  rooms?: number;
  status: PropertyStatus;
  tenantIds: ID[];
  attachmentIds: ID[];
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export type TenantStatus = 'active' | 'inactive';

export interface Tenant {
  id: ID;
  fullName: string;
  phone?: string;
  email?: string;
  idNumber?: string; // ת.ז./ח.פ.
  status: TenantStatus;
  propertyId?: ID;
  leaseId?: ID;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export type Currency = 'ILS' | 'USD' | 'EUR';

export interface Lease {
  id: ID;
  tenantId: ID;
  propertyId: ID;
  startDate: string;       // ISO
  endDate: string;         // ISO
  rentAmount: number;
  currency: Currency;
  checksUntil?: string;    // ISO – "צ'קים עד"
  optionIds: ID[];
  contractAttachmentId?: ID;
  createdAt: string;
  updatedAt: string;
}

export interface Option {
  id: ID;
  leaseId: ID;
  startDate: string;
  endDate: string;
  price?: number;
  createdAt: string;
  updatedAt: string;
}

// Meta key-value store (for schema version etc.)
export interface MetaKV {
  key: string;
  value: string;
}
