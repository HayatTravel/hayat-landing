import { lazy } from 'react'

/* Pages load on demand (see main.jsx: they are also warmed in the background after the first paint). */
const Flights = lazy(() => import('../pages/Flights'))
const FlightsResults = lazy(() => import('../pages/FlightsResults'))

export default [
  { path: '/flights', element: <Flights /> },
  { path: '/flights/results', element: <FlightsResults /> },
]
