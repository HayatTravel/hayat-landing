import Hotels from '../pages/Hotels'
import HotelsResults from '../pages/HotelsResults'
import HotelsDetail from '../pages/HotelsDetail'
import Holidays from '../pages/Holidays'
import HolidaysDetail from '../pages/HolidaysDetail'

/* Stays: hotels and holidays. Booking is two steps: choose here → /checkout?type=hotel|package&… */
export default [
  { path: '/hotels', element: <Hotels /> },
  { path: '/hotels/results', element: <HotelsResults /> },
  { path: '/hotels/:id', element: <HotelsDetail /> },
  { path: '/holidays', element: <Holidays /> },
  { path: '/holidays/:id', element: <HolidaysDetail /> },
]
