import { route } from '@react-router/dev/routes'

/* Careers and HR: open roles, how we hire, life at Hayat, students, application tracking, onboarding for new joiners.
   Data comes through lib/providers/hr.js (mock today; the HR platform's Recruitment module later). */

export default [
  route('/careers', 'pages/Careers.jsx'),
  route('/careers/how-we-hire', 'pages/CareersHow.jsx'),
  route('/careers/life', 'pages/CareersLife.jsx'),
  route('/careers/students', 'pages/CareersStudents.jsx'),
  route('/careers/track', 'pages/CareersTrack.jsx'),
  route('/careers/onboarding', 'pages/CareersOnboarding.jsx'),
  route('/careers/:id', 'pages/CareersDetail.jsx'),
]
