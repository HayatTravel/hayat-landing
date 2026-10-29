import CarForm from '../components/cars/CarForm'
import CarsFeatured from '../components/featured/CarsFeatured'

/** Car rental tab of the shared search panel. `initial` may carry city/pick/pt/drop/dt/age. */
export default [{ id: 'cars', icon: 'car', label: 'nav.cars', order: 4, Form: ({ initial }) => <CarForm bare initial={initial || {}} />, Featured: CarsFeatured }]
