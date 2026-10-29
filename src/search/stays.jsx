import { HolidayForm, HotelForm } from '../components/stays/Forms'
import { FeaturedAbroad } from '../components/stays/Featured'

/** Hotels and holidays tabs of the shared search panel. Hotels: city/in/out/rooms/ad/ch · Holidays: city/month/ad/ch. */
export default [
  { id: 'hotels', icon: 'bed', label: 'nav.hotels', order: 2, Form: ({ initial }) => <HotelForm initial={initial || {}} />, Featured: FeaturedAbroad },
  { id: 'holidays', icon: 'luggage', label: 'nav.holidays', order: 3, Form: ({ initial }) => <HolidayForm initial={initial || {}} /> },
]
