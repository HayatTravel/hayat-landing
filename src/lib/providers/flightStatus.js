/* Flight status adapter — MOCK implementation for the design mockup. Hayat shows status for its OWN bookings only;
   any other flight is linked out to free public sites (no paid public tracker for now).

   Data sources in production (behind the website server; the browser never calls them directly):
     - Hayat charter programmes: Products / Charter operations status (departure, delay, gate, landed).
     - GDS bookings: Sabre FLIFO (flight information) for the booked segments.
     - Iraqi Airways NDC bookings: IA NDC flight status.
     - Later, only for transfers / notifications at volume: a paid feed (e.g. FlightAware Standard).
   Server contract:
     GET /api/v1/customer/orders/:ref/flight-status       → FlightStatus[]  (one per segment of the booking)
     GET /api/v1/charter/departures?from=YYYY-MM-DD&days=7 → FlightStatus[]  (Hayat charter week)
     POST /api/v1/customer/orders/:ref/follow             → 204  (status updates sent on WhatsApp through the CRM)
   FlightStatus = {
     id, flight: 'IA 233', carrier, from, to, date: 'YYYY-MM-DD',
     sched: { dep, arr }, est: { dep, arr },              // minutes after local midnight at each airport (arr may exceed 1440)
     status: 'scheduled'|'boarding'|'departed'|'air'|'landed'|'delayed'|'cancelled',
     delay, terminal: { dep, arr }, gate, aircraft, dur, progress: 0..1,
   }
   The client re-reads about every 30 s between boarding and landing. Swap the functions below for fetch() calls. */
import { IRAQ, clock, norm, searchFlights, seed } from '../../components/flights/engine'
import D from '../../data/catalog'
import { WORLD_TZ } from '../../components/flights/world'

const TZ = { IST: 0, AYT: 0, TZX: 0, DXB: 1, SHJ: 1, DOH: 0, GYD: 1, TBS: 1, BUS: 1, SSH: -1, CAI: -1, AMM: 0, BEY: -1, KUL: 5, MLE: 2, ...WORLD_TZ }
const tz = (c) => (IRAQ.includes(c) ? 0 : TZ[c] ?? 0)

/** Normalise "ia233", "IA 233", "ia-0233" → { carrier: 'IA', number: '233' } or null. */
export function parseFlight(s) {
  const m = String(s || '').toUpperCase().replace(/[\s-]/g, '').match(/^([A-Z][A-Z0-9])(\d{1,4})$/)
  return m ? { carrier: m[1], number: String(parseInt(m[2], 10)) } : null
}
export const flightLabel = (p) => `${p.carrier} ${p.number}`

/** Baghdad local minutes now, and today's date there (Iraq has no daylight saving). */
export function baghdadNow(at = Date.now()) {
  const d = new Date(at + (3 * 60 + new Date(at).getTimezoneOffset()) * 60000)
  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  return { iso, min: d.getHours() * 60 + d.getMinutes() }
}
const dayDiff = (a, b) => Math.round((new Date(`${b}T00:00:00`) - new Date(`${a}T00:00:00`)) / 864e5)

/** Recompute the live part (status, progress) for a moment in time — the mock's stand-in for polling. */
export function statusAt(f, at = Date.now()) {
  const r = seed(`fs-${f.flight}-${f.date}`)
  const cancelled = r() < 0.03
  const delay = cancelled ? 0 : r() < 0.2 ? 15 + Math.floor(r() * 12) * 5 : 0
  const now = baghdadNow(at)
  const t0 = dayDiff(f.date, now.iso) * 1440 + now.min // minutes since the flight day's midnight, Iraq time
  const dep = f.sched.dep - tz(f.from) * 60 + delay // departure in Iraq time
  const end = dep + f.dur
  let status = delay ? 'delayed' : 'scheduled'; let progress = 0
  if (cancelled) status = 'cancelled'
  else if (t0 >= end) { status = 'landed'; progress = 1 }
  else if (t0 >= dep + 10) { status = 'air'; progress = (t0 - dep) / f.dur }
  else if (t0 >= dep) { status = 'departed'; progress = Math.max(0.01, (t0 - dep) / f.dur) }
  else if (t0 >= dep - 40) status = 'boarding'
  return { ...f, status, delay, progress: Math.min(1, Math.max(0, progress)), est: { dep: f.sched.dep + delay, arr: f.sched.arr + delay } }
}

function fromSegment(s, date, leg) {
  const r = seed(`gate-${s.fn}-${date}`)
  const term = (c) => (['IST', 'DXB', 'DOH', 'LHR', 'CDG', 'FRA'].includes(c) ? `T${1 + Math.floor(r() * 3)}` : c === 'BGW' ? `C${1 + Math.floor(r() * 2)}` : 'T1')
  return {
    id: `${s.fn.replace(' ', '')}-${date}`, flight: s.fn, carrier: s.c, from: s.from, to: s.to, date,
    sched: { dep: s.dep, arr: s.arr }, dur: s.dur, aircraft: s.ac,
    terminal: { dep: term(s.from), arr: term(s.to) }, gate: `${'ABCD'[Math.floor(r() * 4)]}${1 + Math.floor(r() * 24)}`,
    legDur: leg?.dur,
  }
}

/** Status for every flight segment of a saved booking (flights and holidays). `legsOf(b)` returns the booked legs. */
export async function forBooking(b, legsOf) {
  const f = legsOf(b)
  if (!f) return []
  return f.x.legs.flatMap((l) => l.segs.map((sg) => ({ ...statusAt(fromSegment(sg, l.date)), ref: b.ref })))
}

/** Hayat charter departures in the next `days` days, both directions of each programme. */
export async function charterWeek(days = 7, at = Date.now()) {
  const start = baghdadNow(at).iso
  const out = []
  for (let k = 0; k < days; k += 1) {
    const d = new Date(`${start}T00:00:00`); d.setDate(d.getDate() + k)
    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    D.charters.forEach((ch) => [[ch.from, ch.to], [ch.to, ch.from]].forEach(([a, z]) => {
      const x = searchFlights(norm({ from: a, to: z, d1: date, trip: 'ow' })).list.find((y) => y.kind === 'charter' && y.id === ch.id)
      if (x) out.push({ ...statusAt(fromSegment(x.legs[0].segs[0], date)), programme: ch.id })
    }))
  }
  return out.sort((a, b) => (a.date === b.date ? a.sched.dep - b.sched.dep : a.date < b.date ? -1 : 1))
}

/** Mock: own bookings only — the server registers the booking for WhatsApp updates through the CRM. */
export async function follow() { return true }

export const fmt = (m) => clock(m)
