import { StrictMode, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import './index.css'
import { I18nProvider } from './lib/i18n'
import { ModeProvider } from './lib/mode'
import Layout from './components/Layout'
import Home from './pages/Home'
const Checkout = lazy(() => import('./pages/Checkout'))
const Done = lazy(() => import('./pages/Done'))
import NotFound from './pages/NotFound'

/* Each product area adds its pages in src/routes/<area>.jsx (export default [{ path, element }]). */
const areaRoutes = Object.values(import.meta.glob('./routes/*.jsx', { eager: true })).flatMap((m) => m.default)

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { path: '/', element: <Home /> },
      ...areaRoutes,
      { path: '/checkout', element: <Checkout /> },
      { path: '/done/:ref', element: <Done /> },
      { path: '*', element: <NotFound /> },
    ],
  },
], { basename: import.meta.env.BASE_URL })

/* Warm every page in the background once the first page is on screen, so moving around never waits on the network. */
// all at once (the browser fetches them in parallel), shortly after the first page has drawn
const warm = () => Object.values(import.meta.glob('./pages/*.jsx')).forEach((load) => load())
window.addEventListener('load', () => setTimeout(warm, 300), { once: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nProvider>
      <ModeProvider>
        <RouterProvider router={router} />
      </ModeProvider>
    </I18nProvider>
  </StrictMode>,
)
