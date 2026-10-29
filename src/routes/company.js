import { route } from '@react-router/dev/routes'

/* Company area: who we are, offices, contact, news, partners, legal, feedback, sitemap. Careers and HR are in routes/hr.js. */
export default [
  route('/about', 'pages/About.jsx'),
  route('/about/offices', 'pages/AboutOffices.jsx'),
  route('/contact', 'pages/Contact.jsx'),
  route('/news', 'pages/News.jsx'),
  route('/news/:id', 'pages/NewsDetail.jsx'),
  route('/partners', 'pages/Partners.jsx'),
  route('/legal/:doc', 'pages/Legal.jsx'),
  route('/feedback', 'pages/Feedback.jsx'),
  route('/sitemap', 'pages/Sitemap.jsx'),
]
