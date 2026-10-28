import { lazy } from 'react'

/* Pages load on demand (see main.jsx: they are also warmed in the background after the first paint). */
const Guides = lazy(() => import('../pages/Guides'))
const GuidesDetail = lazy(() => import('../pages/GuidesDetail'))

/* Travel guides for both audiences (travelling from Iraq · visiting Iraq). */
export default [
  { path: '/guides', element: <Guides /> },
  { path: '/guides/:slug', element: <GuidesDetail /> },
]
