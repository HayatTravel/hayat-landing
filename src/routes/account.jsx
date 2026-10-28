import Trips from '../pages/Trips'
import TripsDetail from '../pages/TripsDetail'
import Account from '../pages/Account'
import HelpCenter from '../pages/HelpCenter'

/* Account area: My trips, one booking, the customer account, help (with #terms / #privacy). */
export default [
  { path: '/trips', element: <Trips /> },
  { path: '/trips/:ref', element: <TripsDetail /> },
  { path: '/account', element: <Account /> },
  { path: '/help', element: <HelpCenter /> },
]
