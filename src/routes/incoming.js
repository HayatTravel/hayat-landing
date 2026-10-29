import { route } from '@react-router/dev/routes'

/* Visiting Iraq (mode 'in'). Booking: tour → /checkout?type=tour · visa → type=ivisa · hotels reuse type=hotel. */
export default [
  route('/visit', 'pages/VisitHome.jsx'),
  route('/visit/places', 'pages/VisitPlaces.jsx'),
  route('/visit/places/:id', 'pages/VisitPlace.jsx'),
  route('/visit/tours', 'pages/VisitTours.jsx'),
  route('/visit/tours/:id', 'pages/VisitTour.jsx'),
  route('/visit/visa', 'pages/VisitVisa.jsx'),
  route('/visit/hotels', 'pages/VisitHotels.jsx'),
  route('/visit/plan', 'pages/VisitPlan.jsx'),
]
