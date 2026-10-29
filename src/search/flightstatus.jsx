import { StatusForm } from '../components/flights/Status'
import StatusFeatured from '../components/featured/StatusFeatured'

/** Flight status tab, for both audiences. `initial` may carry flight/from/to/date. */
export default [{ id: 'status', icon: 'clock', label: 'fs.tab', order: 9, modes: ['out', 'in'], Form: ({ initial }) => <StatusForm bare initial={initial || {}} />, Featured: StatusFeatured }]
