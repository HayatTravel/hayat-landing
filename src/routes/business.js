import { route } from '@react-router/dev/routes'

/* Hayat for business: corporate travel, travel agencies (B2B), groups and events, delegations and NGOs. */
export default [
  route('/business', 'pages/Business.jsx'),
  route('/business/corporate', 'pages/BusinessCorporate.jsx'),
  route('/business/agents', 'pages/BusinessAgents.jsx'),
  route('/business/groups', 'pages/BusinessGroups.jsx'),
  route('/business/government', 'pages/BusinessGovernment.jsx'),
]
