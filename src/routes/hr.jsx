import { lazy } from 'react'

/* Careers and HR: open roles, how we hire, life at Hayat, students, application tracking, onboarding for new joiners.
   Data comes through lib/providers/hr.js (mock today; the HR platform's Recruitment module later). */
const Careers = lazy(() => import('../pages/Careers'))
const CareersDetail = lazy(() => import('../pages/CareersDetail'))
const CareersHow = lazy(() => import('../pages/CareersHow'))
const CareersLife = lazy(() => import('../pages/CareersLife'))
const CareersStudents = lazy(() => import('../pages/CareersStudents'))
const CareersTrack = lazy(() => import('../pages/CareersTrack'))
const CareersOnboarding = lazy(() => import('../pages/CareersOnboarding'))

export default [
  { path: '/careers', element: <Careers /> },
  { path: '/careers/how-we-hire', element: <CareersHow /> },
  { path: '/careers/life', element: <CareersLife /> },
  { path: '/careers/students', element: <CareersStudents /> },
  { path: '/careers/track', element: <CareersTrack /> },
  { path: '/careers/onboarding', element: <CareersOnboarding /> },
  { path: '/careers/:id', element: <CareersDetail /> },
]
