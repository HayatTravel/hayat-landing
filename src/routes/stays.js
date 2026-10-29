import { route } from '@react-router/dev/routes'

/* Stays: hotels and holidays. Booking is two steps: choose here → /checkout?type=hotel|package&… */
export default [
  route('/hotels', 'pages/Hotels.jsx'),
  route('/hotels/results', 'pages/HotelsResults.jsx'),
  route('/hotels/:id', 'pages/HotelsDetail.jsx'),
  route('/holidays', 'pages/Holidays.jsx'),
  route('/holidays/:id', 'pages/HolidaysDetail.jsx'),
]
