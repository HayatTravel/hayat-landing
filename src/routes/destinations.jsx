import { lazy } from 'react'

/* Pages load on demand (see main.jsx: they are also warmed in the background after the first paint). */
const Destinations = lazy(() => import('../pages/Destinations'))
const DestinationsDetail = lazy(() => import('../pages/DestinationsDetail'))

/* Travelling from Iraq: the worldwide destination explorer. */
export default [
  { path: '/destinations', element: <Destinations /> },
  { path: '/destinations/:slug', element: <DestinationsDetail /> },
]
