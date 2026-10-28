import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import './index.css'
import { I18nProvider } from './lib/i18n'
import Layout from './components/Layout'
import Home from './pages/Home'
import Checkout from './pages/Checkout'
import Done from './pages/Done'
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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nProvider>
      <RouterProvider router={router} />
    </I18nProvider>
  </StrictMode>,
)
