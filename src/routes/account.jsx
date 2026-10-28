import { lazy } from 'react'

/* Pages load on demand (see main.jsx: they are also warmed in the background after the first paint). */
const Trips = lazy(() => import('../pages/Trips'))
const TripsDetail = lazy(() => import('../pages/TripsDetail'))
const Account = lazy(() => import('../pages/Account'))
const HelpCenter = lazy(() => import('../pages/HelpCenter'))

/* Account area: My trips, one booking, the customer account, help (with #terms / #privacy). */
export default [
  { path: '/trips', element: <Trips /> },
  { path: '/trips/:ref', element: <TripsDetail /> },
  { path: '/account', element: <Account /> },
  { path: '/help', element: <HelpCenter /> },
]
