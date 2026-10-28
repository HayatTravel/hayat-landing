import { lazy } from 'react'

/* Pages load on demand (see main.jsx: they are also warmed in the background after the first paint). */
const Cars = lazy(() => import('../pages/Cars'))

export default [{ path: '/cars', element: <Cars /> }]
