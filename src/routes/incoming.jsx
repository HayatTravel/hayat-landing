import VisitHome from '../pages/VisitHome'
import VisitPlaces from '../pages/VisitPlaces'
import VisitPlace from '../pages/VisitPlace'
import VisitTours from '../pages/VisitTours'
import VisitTour from '../pages/VisitTour'
import VisitVisa from '../pages/VisitVisa'
import VisitHotels from '../pages/VisitHotels'
import VisitPlan from '../pages/VisitPlan'

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
