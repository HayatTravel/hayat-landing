import { lazy } from 'react'

/* Pages load on demand (see main.jsx: they are also warmed in the background after the first paint). */
const VisitHome = lazy(() => import('../pages/VisitHome'))
const VisitPlaces = lazy(() => import('../pages/VisitPlaces'))
const VisitPlace = lazy(() => import('../pages/VisitPlace'))
const VisitTours = lazy(() => import('../pages/VisitTours'))
const VisitTour = lazy(() => import('../pages/VisitTour'))
const VisitVisa = lazy(() => import('../pages/VisitVisa'))
const VisitHotels = lazy(() => import('../pages/VisitHotels'))
const VisitPlan = lazy(() => import('../pages/VisitPlan'))

/* Visiting Iraq (mode 'in'). Booking: tour → /checkout?type=tour · visa → type=ivisa · hotels reuse type=hotel. */
export default [
  { path: '/visit', element: <VisitHome /> },
  { path: '/visit/places', element: <VisitPlaces /> },
  { path: '/visit/places/:id', element: <VisitPlace /> },
  { path: '/visit/tours', element: <VisitTours /> },
  { path: '/visit/tours/:id', element: <VisitTour /> },
  { path: '/visit/visa', element: <VisitVisa /> },
  { path: '/visit/hotels', element: <VisitHotels /> },
  { path: '/visit/plan', element: <VisitPlan /> },
]
