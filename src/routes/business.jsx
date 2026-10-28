import { lazy } from 'react'

/* Pages load on demand (see main.jsx: they are also warmed in the background after the first paint). */
const Business = lazy(() => import('../pages/Business'))
const BusinessCorporate = lazy(() => import('../pages/BusinessCorporate'))
const BusinessAgents = lazy(() => import('../pages/BusinessAgents'))
const BusinessGroups = lazy(() => import('../pages/BusinessGroups'))
const BusinessGovernment = lazy(() => import('../pages/BusinessGovernment'))

/* Hayat for business: corporate travel, travel agencies (B2B), groups and events, delegations and NGOs. */
export default [
  { path: '/business', element: <Business /> },
  { path: '/business/corporate', element: <BusinessCorporate /> },
  { path: '/business/agents', element: <BusinessAgents /> },
  { path: '/business/groups', element: <BusinessGroups /> },
  { path: '/business/government', element: <BusinessGovernment /> },
]
