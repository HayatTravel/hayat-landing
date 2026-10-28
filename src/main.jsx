import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Navigate, createBrowserRouter, useLocation, useParams } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import './index.css'
import Layout from './components/Layout'
import Home from './pages/Home'
import Flights from './pages/Flights'
import FlightPassengers from './pages/FlightPassengers'
import FlightSeats from './pages/FlightSeats'
import Hotels from './pages/Hotels'
import HotelDetail from './pages/HotelDetail'
import { EsimCountries, EsimPlans } from './pages/Esim'
import { DealsList, DealDetail } from './pages/Deals'
import { CarExtras, CarList } from './pages/Cars'
import Transfers from './pages/Transfers'
import { Manage, Status } from './pages/Manage'
import Checkout from './pages/Checkout'
import Confirmation from './pages/Confirmation'
import NotFound from './pages/NotFound'

// old deep links (/flights/:id) now start at the passengers step
function ToPassengers() {
  const { id } = useParams()
  return <Navigate replace to={`/flights/${id}/passengers${useLocation().search}`} />
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/flights', element: <Flights /> },
      { path: '/flights/:id', element: <ToPassengers /> },
      { path: '/flights/:id/passengers', element: <FlightPassengers /> },
      { path: '/flights/:id/seats', element: <FlightSeats /> },
      { path: '/hotels', element: <Hotels /> },
      { path: '/hotels/:id', element: <HotelDetail /> },
      { path: '/esim', element: <EsimCountries /> },
      { path: '/esim/:cc', element: <EsimPlans /> },
      { path: '/deals', element: <DealsList /> },
      { path: '/deals/:id', element: <DealDetail /> },
      { path: '/cars', element: <CarList /> },
      { path: '/cars/:id', element: <CarExtras /> },
      { path: '/transfers', element: <Transfers /> },
      { path: '/manage', element: <Manage /> },
      { path: '/status', element: <Status /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/confirmation', element: <Confirmation /> },
      { path: '*', element: <NotFound /> },
    ],
  },
], { basename: import.meta.env.BASE_URL })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
