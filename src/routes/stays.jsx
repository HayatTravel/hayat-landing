import { lazy } from 'react'

/* Pages load on demand (see main.jsx: they are also warmed in the background after the first paint). */
const Hotels = lazy(() => import('../pages/Hotels'))
const HotelsResults = lazy(() => import('../pages/HotelsResults'))
const HotelsDetail = lazy(() => import('../pages/HotelsDetail'))
const Holidays = lazy(() => import('../pages/Holidays'))
const HolidaysDetail = lazy(() => import('../pages/HolidaysDetail'))

/* Stays: hotels and holidays. Booking is two steps: choose here → /checkout?type=hotel|package&… */
export default [
  { path: '/hotels', element: <Hotels /> },
  { path: '/hotels/results', element: <HotelsResults /> },
  { path: '/hotels/:id', element: <HotelsDetail /> },
  { path: '/holidays', element: <Holidays /> },
  { path: '/holidays/:id', element: <HolidaysDetail /> },
]
