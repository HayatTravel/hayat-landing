/* Customer documents per booking type. docKinds(b, i) → [{ kind, label, icon, ready }].
   A document is "ready" once the booking is paid; the receipt is always available (it shows the amount due). */
import D from '../../data/catalog'
import { addDaysIso, nightsBetween } from '../../lib/i18n'
import { charterOf, cityBy, pkgBy, pq } from '../stays/lib'
import { airport, norm, searchFlights } from '../flights/engine'
import { normCar } from '../cars/engine'
import { ev, evDate, trState } from '../services/data'
import { tourBy } from '../../data/incoming'
import { tourEnd } from '../incoming/lib'

export const KINDS = {
  flight: ['eticket', 'receipt'],
  hotel: ['voucher', 'receipt'],
  package: ['eticket', 'voucher', 'programme', 'receipt'],
  car: ['voucher', 'receipt'],
  event: ['tickets', 'receipt'],
  esim: ['esim', 'receipt'],
  visa: ['application', 'receipt'],
  ivisa: ['application', 'receipt'],
  transfer: ['voucher', 'receipt'],
  tour: ['voucher', 'programme', 'receipt'],
}
export const DOC_ICON = { eticket: 'plane', receipt: 'documents', voucher: 'ticket', programme: 'calendar', tickets: 'ticket', esim: 'sim', application: 'passport' }

export function docKinds(b, i) {
  const paid = b?.status === 'paid'
  return (KINDS[b?.type] || ['receipt']).map((kind) => ({ kind, label: i.t(`doc.k.${kind}`), icon: DOC_ICON[kind], ready: paid || kind === 'receipt' }))
}

/* ---------- data a document needs beyond the order ---------- */
/** The booked flight (same generator as results/checkout). */
export function flightOf(b) {
  const q = norm(b.q || {})
  const x = searchFlights(q).list.find((y) => y.id === b.q?.id)
  if (!x) return null
  return { q, x, fare: x.fares.find((f) => f.id === b.q.fare) || x.fares[0] }
}
/** Flights of a holiday: the Hayat charter when the programme has one, otherwise the cheapest scheduled option from Baghdad. */
export function packageFlight(b) {
  const p = pkgBy(b.q?.id); const dep = b.q?.dep
  if (!p || !dep) return null
  const { ad, ch } = pq(b.q)
  const back = addDaysIso(dep, p.nights)
  const c = charterOf(p)
  const tryQ = (from, to) => { const q = norm({ from, to, d1: dep, d2: back, trip: 'rt', ad, ch }); return { q, list: searchFlights(q).list } }
  let r = c && tryQ(c.from, c.to)
  let x = r?.list.find((y) => y.kind === 'charter')
  if (!x) {
    const city = cityBy(p.city); const ap = D.airports.find((a) => a.city.en === city?.name.en)
    if (ap && airport(ap.code)) { r = tryQ('BGW', ap.code); x = r.list.slice().sort((a, z) => a.from - z.from)[0] }
  }
  return x ? { q: r.q, x, fare: x.fares[0] } : null
}

/* ---------- calendar (.ics) ---------- */
const stamp = (iso, hm) => `${iso.replace(/-/g, '')}${hm ? `T${hm.replace(':', '')}00` : ''}`
const plusMin = (iso, hm, mins) => { const [h, m] = hm.split(':').map(Number); const d = new Date(`${iso}T00:00:00`); d.setMinutes(h * 60 + m + mins); const p = (n) => String(n).padStart(2, '0'); return [`${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`, `${p(d.getHours())}:${p(d.getMinutes())}`] }
const toHm = (mins) => { const x = ((mins % 1440) + 1440) % 1440; return `${String(Math.floor(x / 60)).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}` }

/** Calendar entries for a booking: [{ title, start: [iso, hm?], end: [iso, hm?] }]. Times are local (floating). */
export function calEvents(b, i) {
  const q = b.q || {}; const title = b.title
  const timed = (iso, hm, mins, name = title) => ({ title: name, start: [iso, hm], end: plusMin(iso, hm, mins) })
  const allDay = (a, z, name = title) => ({ title: name, start: [a], end: [addDaysIso(z, 1)] })
  if (b.type === 'flight' || b.type === 'package') {
    const f = b.type === 'flight' ? flightOf(b) : packageFlight(b)
    const legs = f ? f.x.legs.map((l) => timed(l.date, toHm(l.dep), l.dur, `${l.from} → ${l.to} · ${l.segs[0].fn}`)) : []
    if (b.type === 'package' && q.dep) { const p = pkgBy(q.id); legs.push(allDay(q.dep, addDaysIso(q.dep, p ? p.nights : 1))) }
    return legs
  }
  if (b.type === 'hotel' && q.in && q.out) return [allDay(q.in, addDaysIso(q.out, -1))]
  if (b.type === 'car') { const c = normCar(q); return [{ title, start: [c.pick, c.pt], end: [c.drop, c.dt] }] }
  if (b.type === 'event') { const e = ev(q.id); return e ? [timed(evDate(e), e.time, 180)] : [] }
  if (b.type === 'transfer') { const s = trState(q, true); return [timed(s.date, s.time, 60)] }
  if (b.type === 'tour') { const x = tourBy(q.id); return x && q.date ? [allDay(q.date, tourEnd(x, q.date))] : [] }
  return b.date ? [allDay(b.date, b.date)] : []
}
export function icsText(b, i) {
  const esc = (s) => String(s).replace(/[\\,;]/g, (m) => `\\${m}`).replace(/\n/g, '\\n')
  const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '')
  const ev2 = calEvents(b, i).map((e, k) => [
    'BEGIN:VEVENT', `UID:${b.ref}-${k}@hayat.iq`, `DTSTAMP:${now}`,
    e.start[1] ? `DTSTART:${stamp(...e.start)}` : `DTSTART;VALUE=DATE:${stamp(e.start[0])}`,
    e.end[1] ? `DTEND:${stamp(...e.end)}` : `DTEND;VALUE=DATE:${stamp(e.end[0])}`,
    `SUMMARY:${esc(e.title)}`, `DESCRIPTION:${esc(`${i.t('doc.ref')}: ${b.ref}`)}`, 'END:VEVENT',
  ].join('\r\n'))
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Hayat Travel//Bookings//EN', 'CALSCALE:GREGORIAN', ...ev2, 'END:VCALENDAR'].join('\r\n')
}
export const hasCalendar = (b, i) => calEvents(b, i).length > 0
export { nightsBetween }

/** /flight-status link for a booking's first flight (flights and holidays), or null. */
export function flightStatusHref(b) {
  const f = b?.type === 'flight' ? flightOf(b) : b?.type === 'package' ? packageFlight(b) : null
  const s = f?.x.legs[0].segs[0]
  return s ? `/flight-status?flight=${s.fn.replace(' ', '')}&date=${f.x.legs[0].date}` : null
}
