import { route } from '@react-router/dev/routes'

/* Services: visa · eSIM · events · airport transfers. Booking continues at /checkout?type=visa|esim|event|transfer. */
export default [
  route('/visa', 'pages/Visa.jsx'),
  route('/visa/:id', 'pages/VisaDetail.jsx'),
  route('/esim', 'pages/Esim.jsx'),
  route('/esim/:cc', 'pages/EsimPlans.jsx'),
  route('/events', 'pages/Events.jsx'),
  route('/events/:id', 'pages/EventsDetail.jsx'),
  route('/transfers', 'pages/Transfers.jsx'),
]
