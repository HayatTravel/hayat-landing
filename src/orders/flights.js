/* Checkout order for type=flight. Rebuilds the chosen result from the search params (same generator as the results page).
   q: id (carrier-n or charter id), fare, from, to, d1, d2, trip, ad, ch, inf, cabin. */
import D from '../data/catalog'
import {
  ESIM_CC, IRAQ, airlineName, airport, clockText, fareName, imgFor, norm, paxText, place, qs, routeTitle, searchFlights, searchParams,
} from '../components/flights/engine'

const SEAT_FEE = 6
const BAG_FEE = 30

function flight(raw, i) {
  const { t } = i
  const q = norm(raw)
  const x = searchFlights(q).list.find((y) => y.id === raw.id)
  if (!x) return null
  const f = x.fares.find((y) => y.id === raw.fare) || x.fares[0]
  const rt = x.legs.length > 1
  const seated = q.ad + q.ch // infants travel on a lap: no seat, bag, transfer seat or eSIM
  const segs = x.legs.reduce((a, l) => a + l.segs.length, 0)
  const legFact = (l) => `${i.date(l.date, { weekday: true })} · ${clockText(l.dep)} – ${clockText(l.arr)} · ${l.via ? t('fl.stopIn', { city: place(l.via, i.L) }) : t('fl.direct')}`
  const price = [{ label: t('fl.co.adults', { n: q.ad }), usd: Math.round(f.ppa * q.ad) }]
  if (q.ch) price.push({ label: t('fl.co.children', { n: q.ch }), usd: Math.round(f.ppa * 0.75 * q.ch) })
  if (q.inf) price.push({ label: t('fl.co.infants', { n: q.inf }), usd: Math.round(f.ppa * 0.1 * q.inf) })

  const extras = [{ id: 'seat', label: t('fl.x.seat'), sub: f.seat ? t('fl.x.seatFree') : t('fl.x.seatD'), usd: f.seat ? 0 : SEAT_FEE * segs, per: 'traveller', count: seated, checked: !!f.seat }]
  if (!f.bag) extras.push({ id: 'bag', label: t('fl.x.bag'), sub: rt ? t('fl.x.bagRt') : t('fl.x.bagD'), usd: BAG_FEE * x.legs.length, per: 'traveller', count: seated })
  const dest = IRAQ.includes(q.to) ? null : q.to
  extras.push({ id: 'transfer', label: t('fl.x.tr', { city: place(q.to, i.L) }), sub: t('fl.x.trD'), usd: D.transfers.sic.price, per: 'traveller', count: seated })
  const es = dest && D.esim.find((e) => e.cc === ESIM_CC[airport(dest)?.country.en])
  if (es) {
    const plan = es.plans.filter((p) => p[0] === 7).sort((a, b) => a[2] - b[2])[0] || es.plans[0]
    extras.push({ id: 'esim', label: t('fl.x.esim', { country: i.L(es.name) }), sub: t('fl.x.esimD', { gb: plan[1], days: plan[0], net: es.net }), usd: plan[2], per: 'traveller', count: seated })
  }

  return {
    title: routeTitle(q.from, q.to, i),
    sub: `${airlineName(x.carrier, i.L)} · ${fareName(f, i)} · ${t(`fl.cab.${q.cabin}`)}`,
    img: imgFor(dest || q.from),
    facts: [
      [t('fl.out'), legFact(x.legs[0])],
      ...(rt ? [[t('fl.ret'), legFact(x.legs[1])]] : []),
      [t('fl.co.trav'), paxText(q, i)],
      [t('fl.co.bag'), `${f.bag ? t('fl.i.bag', { kg: f.bag }) : t('fl.i.noBag')} · ${t('fl.i.hand', { kg: f.hand })}`],
    ],
    price,
    travellers: { count: q.ad + q.ch + q.inf, fields: ['name', 'dob', 'nationality', 'passport'], note: t('fl.co.note') },
    extras,
    uploads: [],
    hold: 30,
    terms: x.kind === 'charter' ? t('fl.t.charter') : t(`fl.t.${f.id}`),
    docs: [t('fl.doc.ticket'), t('fl.doc.receipt')],
    back: `/flights/results?${qs(searchParams(q))}`,
  }
}

export default { flight }
