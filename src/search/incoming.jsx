import { IqHotelSearch, TourSearch, VisaSearch } from '../components/incoming/Forms'

/** Visiting Iraq tabs. Tours: where (p:<place> | t:<theme>)/month/ad · Visa: nat/region · Hotels in Iraq: city/in/out/rooms/ad/ch. */
export default [
  { id: 'iq-tours', icon: 'luggage', label: 'iq.tab.tours', order: 1, modes: ['in'], Form: ({ initial }) => <TourSearch initial={initial || {}} /> },
  { id: 'iq-visa', icon: 'passport', label: 'iq.tab.visa', order: 3, modes: ['in'], Form: ({ initial }) => <VisaSearch initial={initial || {}} /> },
  { id: 'iq-hotels', icon: 'bed', label: 'iq.tab.hotels', order: 4, modes: ['in'], Form: ({ initial }) => <IqHotelSearch initial={initial || {}} /> },
]
