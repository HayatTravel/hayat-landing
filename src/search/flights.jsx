import FlightForm from '../components/flights/FlightForm'

/** Flights tab of the shared search panel. `initial` may carry from/to/d1/d2/trip/ad/ch/inf/cabin/direct. */
export default [{ id: 'flights', icon: 'plane', label: 'nav.flights', order: 1, Form: ({ initial }) => <FlightForm initial={initial || {}} /> }]
