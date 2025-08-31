import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import PropertiesList from '@/pages/Properties/List'
import PropertyDetails from '@/pages/Properties/Details'
import TenantsList from '@/pages/Tenants/List'
import TenantDetails from '@/pages/Tenants/Details'
import App from '@/App'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/properties" replace /> },
      { path: 'properties', element: <PropertiesList /> },
      { path: 'properties/:id', element: <PropertyDetails /> },
      { path: 'tenants', element: <TenantsList /> },
      { path: 'tenants/:id', element: <TenantDetails /> },
    ]
  }
])

export default router
