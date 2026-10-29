import { route } from '@react-router/dev/routes'

/* Travel guides for both audiences (travelling from Iraq · visiting Iraq). */
export default [
  route('/guides', 'pages/Guides.jsx'),
  route('/guides/:slug', 'pages/GuidesDetail.jsx'),
]
