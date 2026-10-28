import { lazy } from 'react'

/* Company area: who we are, offices, contact, news, partners, legal, feedback, sitemap. Careers and HR are in routes/hr.jsx. Pages load on demand. */
const About = lazy(() => import('../pages/About'))
const AboutOffices = lazy(() => import('../pages/AboutOffices'))
const Contact = lazy(() => import('../pages/Contact'))
const News = lazy(() => import('../pages/News'))
const NewsDetail = lazy(() => import('../pages/NewsDetail'))
const Partners = lazy(() => import('../pages/Partners'))
const Legal = lazy(() => import('../pages/Legal'))
const Feedback = lazy(() => import('../pages/Feedback'))
const Sitemap = lazy(() => import('../pages/Sitemap'))

export default [
  { path: '/about', element: <About /> },
  { path: '/about/offices', element: <AboutOffices /> },
  { path: '/contact', element: <Contact /> },
  { path: '/news', element: <News /> },
  { path: '/news/:id', element: <NewsDetail /> },
  { path: '/partners', element: <Partners /> },
  { path: '/legal/:doc', element: <Legal /> },
  { path: '/feedback', element: <Feedback /> },
  { path: '/sitemap', element: <Sitemap /> },
]
