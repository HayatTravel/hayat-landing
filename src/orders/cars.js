/* Checkout order for type=car. q: id (car class), city, pick, pt, drop, dt, age=25|u25. */
import { CATS, EXTRAS, YOUNG_FEE, carParams, location, normCar, rentalDays, searchCars } from '../components/cars/engine'
import { qs } from '../components/flights/engine'

function car(raw, i) {
  const { t } = i
  const q = normCar(raw)
  const c = searchCars(q).find((x) => x.id === raw.id)
  if (!c) return null
  const days = rentalDays(q)
  const dl = days === 1 ? t('car.days1') : t('car.daysN', { n: days })
  const loc = location(q.city)
  const price = [{ label: t('car.co.rental', { days: dl }), usd: c.daily * days }]
  if (q.age === 'u25') price.push({ label: t('car.co.young', { days: dl }), usd: YOUNG_FEE * days })
  return {
    title: i.L(c.name),
    sub: `${i.L(CATS[c.id])} · ${t('car.by', { name: i.L(c.supplier) })} · ${i.L(loc.name)}`,
    img: c.photoUrl,
    facts: [
      [t('car.pick'), `${i.date(q.pick, { weekday: true })} · ${q.pt}`],
      [t('car.drop'), `${i.date(q.drop, { weekday: true })} · ${q.dt}`],
      [t('car.co.place'), t('car.d.at', { city: i.L(loc.name) })],
      [t('car.co.driver'), q.age === 'u25' ? t('car.co.u25') : t('car.co.25')],
    ],
    price,
    travellers: { count: 1, fields: ['name', 'dob'], note: t('car.co.note') },
    extras: EXTRAS.map((x) => ({ id: x.id, label: t(x.name), sub: `${t(x.note)} · ${t('car.perDay', { amount: i.money(x.perDay) })}`, usd: x.perDay * days, per: 'booking' })),
    uploads: [],
    hold: 60,
    terms: t('car.co.terms'),
    docs: [t('car.doc.voucher'), t('car.doc.receipt')],
    back: `/cars?${qs(carParams(q))}`,
  }
}

export default { car }
