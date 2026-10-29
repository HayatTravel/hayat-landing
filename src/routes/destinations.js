import { route } from '@react-router/dev/routes'

/* Travelling from Iraq: the worldwide destination explorer. */
export default [
  route('/destinations', 'pages/Destinations.jsx'),
  route('/destinations/:slug', 'pages/DestinationsDetail.jsx'),
]
