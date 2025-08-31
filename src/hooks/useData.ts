import { useQuery } from '@tanstack/react-query'
import { DataProvider } from '@/data/DataProvider'

const provider = new DataProvider()

async function ensure() {
  await provider.init()
  return provider
}

export function usePropertiesList() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => (await ensure()).listProperties(),
  })
}
export function useProperty(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => (await ensure()).getPropertyById(id),
    enabled: !!id,
  })
}

export function useTenantsList() {
  return useQuery({
    queryKey: ['tenants'],
    queryFn: async () => (await ensure()).listTenants(),
  })
}
export function useTenant(id: string) {
  return useQuery({
    queryKey: ['tenant', id],
    queryFn: async () => (await ensure()).getTenantById(id),
    enabled: !!id,
  })
}
