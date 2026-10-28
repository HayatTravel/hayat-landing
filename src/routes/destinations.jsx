import Destinations from '../pages/Destinations'
import DestinationsDetail from '../pages/DestinationsDetail'

/* Travelling from Iraq: the worldwide destination explorer. */
export default [
  { path: '/destinations', element: <Destinations /> },
  { path: '/destinations/:slug', element: <DestinationsDetail /> },
]
