import FlightForm from '../components/flights/FlightForm'
import AirportsFeatured from '../components/featured/AirportsFeatured'

/** Flights tabs of the shared search panel. `initial` may carry from/to/d1/d2/trip/ad/ch/inf/cabin/direct.
    'flights' = travelling from Iraq; 'flights-in' = visitors flying to Iraq (from abroad to an Iraqi airport). */
export default [
  { id: 'flights', icon: 'plane', label: 'nav.flights', order: 1, Form: ({ initial }) => <FlightForm bare initial={initial || {}} /> },
  { id: 'flights-in', icon: 'plane', label: 'fl.in.tab', order: 1, modes: ['in'], Form: ({ initial }) => <FlightForm bare inbound initial={initial || {}} />, Featured: AirportsFeatured },
]
