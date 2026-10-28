/* Checkout orders for visa, eSIM, event tickets and airport transfers (contract: src/lib/products.js). */
import {
  ESIM_IMG, clamp, esDays, esim, ev, evDate, pl, planLabel, procTime, qs, tiersOf, trFacts, trParams, trPrice, trState, airportCity, cars, visa, visaDate,
} from '../components/services/data'
import D from '../data/catalog'

export default {
  /** /checkout?type=visa&id&n&date */
  visa: (q, i) => {
    const { t, L } = i
    const v = visa(q.id)
    if (!v || v.kind === 'free') return null
    const n = clamp(+q.n || 1, 1, 9)
    const d = visaDate(v, q.date)
    const schengen = v.id === 'SCH'
    const country = L(v.country)
    return {
      title: t('vi.orderTitle', { country }), sub: t(`vi.kind.${v.kind}`), img: v.img,
      facts: [[t('vi.dest'), country], [t('vi.kindL'), t(`vi.kind.${v.kind}`)], [t('vi.date'), i.date(d, { weekday: true, year: true })],
        [t('vi.travellers'), pl(i, n, 'vi.t')], [t('vi.time'), procTime(i, v)]],
      price: [{ label: n > 1 ? `${t('vi.fee')} × ${i.num(n)}` : t('vi.fee'), usd: v.fee * n }],
      travellers: { count: n, fields: ['name', 'dob', 'nationality', 'passport'] },
      extras: [
        v.kind === 'evisa' && { id: 'express', label: t('vi.express'), sub: t('vi.expressD'), usd: 25, per: 'traveller' },
        { id: 'insurance', label: t('vi.ins'), sub: schengen ? t('vi.insReq') : t('vi.insD'), usd: 15, per: 'traveller', checked: schengen, required: schengen },
      ].filter(Boolean),
      uploads: v.docs.map((k) => ({ id: k, label: t(`vi.d.${k}`) })),
      hold: null,
      terms: t('vi.terms'),
      docs: [t('vi.doc1'), t('vi.doc2'), t('vi.doc3')],
      back: `/visa/${v.id}${qs({ n, date: d })}`,
    }
  },

  /** /checkout?type=esim&cc&plan=<index> */
  esim: (q, i) => {
    const { t, L } = i
    const c = esim(q.cc)
    const k = Number.parseInt(q.plan, 10)
    const p = c?.plans[k]
    if (!p) return null
    return {
      title: t('es.orderTitle', { country: L(c.name) }), sub: planLabel(i, p), img: ESIM_IMG[c.cc] || 'esim-phone',
      facts: [[t('es.country'), L(c.name)], [t('es.net'), c.net], [t('es.validity'), esDays(i, p[0])], [t('es.data'), `${p[1]} GB`]],
      price: [{ label: planLabel(i, p), usd: p[2] }],
      travellers: null,
      extras: [{ id: 'second', label: t('es.second'), sub: t('es.secondD'), usd: p[2], per: 'booking' }],
      uploads: [],
      hold: null,
      terms: t('es.terms'),
      docs: [t('es.doc1'), t('es.doc2'), t('es.doc3')],
      back: `/esim/${c.cc}${qs({ days: p[0] })}`,
    }
  },

  /** /checkout?type=event&id&tier&qty (&date, for My trips) */
  event: (q, i) => {
    const { t, L } = i
    const e = ev(q.id)
    const x = e && tiersOf(e).find((z) => z.id === q.tier)
    if (!x) return null
    const n = clamp(+q.qty || 1, 1, Math.min(8, x.left))
    return {
      title: L(e.title), sub: `${L(e.venue)} · ${L(e.city)}`, img: e.img,
      facts: [[t('ev.date'), i.date(evDate(e), { weekday: true, year: true })], [t('ev.time'), e.time], [t('ev.venue'), L(e.venue)],
        [t('ev.tier'), L(x.name)], [t('ev.qty'), pl(i, n, 'ev.t')]],
      price: [{ label: `${L(x.name)} × ${i.num(n)}`, usd: x.usd * n }],
      travellers: { count: 1, fields: ['name'], note: t('ev.namesNote') },
      extras: e.cat === 'expo' ? [] : [{ id: 'parking', label: t('ev.parking'), sub: t('ev.parkingD'), usd: 5, per: 'booking' }],
      uploads: [],
      hold: null,
      terms: t('ev.terms'),
      docs: [t('ev.doc1'), t('ev.doc2')],
      back: `/events/${e.id}${qs({ tier: x.id, qty: n })}`,
    }
  },

  /** /checkout?type=transfer&ap&dir=arr|dep&date&time&n&v=sic|vip */
  transfer: (q, i) => {
    const { t, L } = i
    const s = trState(q)
    if (!s) return null
    const veh = L(D.transfers[s.v].name)
    return {
      title: t('tr.orderTitle', { city: airportCity(i, s.ap) }), sub: t(s.dir === 'arr' ? 'tr.arrL' : 'tr.depL'), img: 'transfer-car',
      facts: trFacts(i, s),
      price: [{ label: `${veh} × ${i.num(s.v === 'sic' ? s.n : cars(s.n))}`, usd: trPrice(s.v, s.n) }],
      travellers: { count: 1, fields: ['name'], note: t('tr.leadNote') },
      extras: [
        s.dir === 'arr' && { id: 'sign', label: t('tr.sign'), sub: t('tr.signD'), usd: 5, per: 'booking' },
        s.v === 'vip' && { id: 'child', label: t('tr.child'), sub: t('tr.childD'), usd: 6, per: 'booking' },
      ].filter(Boolean),
      uploads: [],
      hold: null,
      terms: t('tr.terms'),
      docs: [t('tr.doc1')],
      back: `/transfers${qs(trParams(s))}`,
    }
  },
}
