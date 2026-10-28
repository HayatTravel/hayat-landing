import Visa from '../pages/Visa'
import VisaDetail from '../pages/VisaDetail'
import Esim from '../pages/Esim'
import EsimPlans from '../pages/EsimPlans'
import Events from '../pages/Events'
import EventsDetail from '../pages/EventsDetail'
import Transfers from '../pages/Transfers'

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
