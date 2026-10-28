import { lazy } from 'react'

/* Pages load on demand (see main.jsx). */
const FlightStatus = lazy(() => import('../pages/FlightStatus'))

export default [{ path: '/flight-status', element: <FlightStatus /> }]
