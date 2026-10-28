import { lazy } from 'react'

/* Pages load on demand (see main.jsx: they are also warmed in the background after the first paint). */
const Visa = lazy(() => import('../pages/Visa'))
const VisaDetail = lazy(() => import('../pages/VisaDetail'))
const Esim = lazy(() => import('../pages/Esim'))
const EsimPlans = lazy(() => import('../pages/EsimPlans'))
const Events = lazy(() => import('../pages/Events'))
const EventsDetail = lazy(() => import('../pages/EventsDetail'))
const Transfers = lazy(() => import('../pages/Transfers'))

/* Services: visa · eSIM · events · airport transfers. Booking continues at /checkout?type=visa|esim|event|transfer. */
export default [
  { path: '/visa', element: <Visa /> },
  { path: '/visa/:id', element: <VisaDetail /> },
  { path: '/esim', element: <Esim /> },
  { path: '/esim/:cc', element: <EsimPlans /> },
  { path: '/events', element: <Events /> },
  { path: '/events/:id', element: <EventsDetail /> },
  { path: '/transfers', element: <Transfers /> },
]
