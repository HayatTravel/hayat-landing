import { lazy } from 'react'

/* Pages load on demand (see main.jsx: they are also warmed in the background after the first paint). */
const Document = lazy(() => import('../pages/Document'))

export default [{ path: '/trips/:ref/doc/:kind', element: <Document /> }]
