import { BookingLookup } from '../components/flights/Status'
import StatusFeatured from '../components/featured/StatusFeatured'

/** Flight status tab (both audiences): own bookings only, found by booking number + phone. */
export default [{ id: 'status', icon: 'clock', label: 'fs.tab', order: 9, modes: ['out', 'in'], Form: () => <BookingLookup bare />, Featured: StatusFeatured }]
