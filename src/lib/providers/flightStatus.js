/* Flight status adapter — MOCK implementation for the design mockup.

   Real provider contract (to be implemented on the website server; the browser never calls a provider directly):
     GET /api/v1/flight-status?flight=IA233&date=YYYY-MM-DD        → FlightStatus | 404
     GET /api/v1/flight-status?from=BGW&to=IST&date=YYYY-MM-DD      → FlightStatus[]  (all departures of the day)
     POST /api/v1/flight-status/follow { flight, date, phone }      → 204  (updates are sent on WhatsApp)
   The server queries the flight-data provider chosen in production (schedules + live positions), caches results
   for about 60 s and normalises them to:
     FlightStatus = {
       id, flight: 'IA 233', carrier: 'IA', from: 'BGW', to: 'IST', date: 'YYYY-MM-DD',
       sched: { dep, arr },  est: { dep, arr },        // minutes after local midnight at each airport (arr may exceed 1440)
       status: 'scheduled'|'boarding'|'departed'|'air'|'landed'|'delayed'|'cancelled',
       delay: minutes, terminal: { dep, arr }, gate: string|null, aircraft: string|null,
       dur: minutes, progress: 0..1,                    // share of the flight flown (live position in production)
     }
   The client polls about every 30 s while a flight is between boarding and landing. Swap the functions below for
   fetch() calls; everything else in the UI stays the same. */
import { IRAQ, airport, clock, norm, searchFlights, seed } from '../../components/flights/engine'
import D from '../../data/catalog'
import { WORLD_ROUTES, WORLD_TZ } from '../../components/flights/world'

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

const ROUTE_DESTS = () => [...new Set([...D.routes.map((r) => r.to), ...WORLD_ROUTES.map((r) => r.to)])]
/** Every segment flown on a date, from the same generator as flight search (both directions). */
function segmentsOn(date) {
  const out = []
  for (const iq of IRAQ) for (const d of ROUTE_DESTS()) for (const [a, b] of [[iq, d], [d, iq]]) {
    if (!airport(a) || !airport(b)) continue
    searchFlights(norm({ from: a, to: b, d1: date, trip: 'ow' })).list.forEach((x) => x.legs[0].segs.forEach((s) => out.push(s)))
  }
  return out
}

/** Find one flight by number on a date. Resolves null when the number is not recognised. */
export async function findByNumber({ flight, date }) {
  const p = parseFlight(flight)
  if (!p) return null
  const label = flightLabel(p)
  const s = segmentsOn(date).find((x) => x.fn === label)
  if (s) return statusAt(fromSegment(s, date))
  // Not in the generated schedule: keep the number and place it on a route that carrier flies, so the design shows a result.
  const any = segmentsOn(date).find((x) => x.c === p.carrier)
  return any ? statusAt(fromSegment({ ...any, fn: label }, date)) : null
}

/** All flights of a day on a route (first segment of each option; connections show their first flight). */
export async function findByRoute({ from, to, date }) {
  const q = norm({ from, to, d1: date, trip: 'ow' })
  return searchFlights(q).list.map((x) => {
    const s = x.legs[0].segs[0]
    return { ...statusAt(fromSegment(s, date, x.legs[0])), via: x.legs[0].via, finalTo: x.legs[0].to, finalArr: x.legs[0].arr }
  }).sort((a, b) => a.sched.dep - b.sched.dep)
}

/** Departures from one airport on a date (first `limit` by time). Real: GET /api/v1/flight-status?airport=BGW&date=… */
export async function departures({ airport: code, date, limit = 6 }) {
  const seen = new Set()
  const all = segmentsOn(date).filter((x) => x.from === code && !seen.has(x.fn) && seen.add(x.fn)).sort((a, b) => a.dep - b.dep)
  // Today: start about an hour before now so the board shows what is boarding and leaving next.
  const now = baghdadNow()
  const from = now.iso === date ? Math.max(0, Math.min(all.findIndex((x) => x.dep >= now.min - 60), all.length - limit)) : 0
  return all.slice(from < 0 ? Math.max(0, all.length - limit) : from, (from < 0 ? all.length : from + limit)).map((x) => statusAt(fromSegment(x, date)))
}

/** Mock: the server would register the phone for WhatsApp updates. */
export async function follow() { return true }

export const fmt = (m) => clock(m)
