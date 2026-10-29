import { route } from '@react-router/dev/routes'

/* Account area: My trips, one booking, the customer account, help (with #terms / #privacy). */
export default [
  route('/trips', 'pages/Trips.jsx'),
  route('/trips/:ref', 'pages/TripsDetail.jsx'),
  route('/account', 'pages/Account.jsx'),
  route('/help', 'pages/HelpCenter.jsx'),
]
