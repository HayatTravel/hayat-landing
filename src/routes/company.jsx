import { lazy } from 'react'

/* Company area: who we are, offices, contact, careers, news, partners, legal, feedback, sitemap. Pages load on demand. */
const About = lazy(() => import('../pages/About'))
const AboutOffices = lazy(() => import('../pages/AboutOffices'))
const Contact = lazy(() => import('../pages/Contact'))
const Careers = lazy(() => import('../pages/Careers'))
const CareersDetail = lazy(() => import('../pages/CareersDetail'))
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
  { path: '/careers', element: <Careers /> },
  { path: '/careers/:id', element: <CareersDetail /> },
  { path: '/news', element: <News /> },
  { path: '/news/:id', element: <NewsDetail /> },
  { path: '/partners', element: <Partners /> },
  { path: '/legal/:doc', element: <Legal /> },
  { path: '/feedback', element: <Feedback /> },
  { path: '/sitemap', element: <Sitemap /> },
]
