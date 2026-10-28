/* Flights generator (ported from tathkara flights.js). Scheduled results come from D.routes, Hayat charter
   programmes from D.charters, both deterministic for a given search. Result ids are stable:
   scheduled `${carrier}-${n}`, charter = programme id (e.g. CH-SSH). Prices are USD. */
import D from '../../data/catalog'
import { addDaysIso, inDays } from '../../lib/i18n'
import { WORLD_AIRLINES, WORLD_AIRPORTS, WORLD_IMG, WORLD_ROUTES, WORLD_TZ } from './world'

export const IRAQ = ['BGW', 'EBL', 'BSR', 'NJF', 'ISU']
const ORIGIN_F = { BGW: 1, EBL: 1.04, BSR: 1.03, NJF: 1.06, ISU: 1.08 }
const ORIGIN_D = { BGW: 0, EBL: -10, BSR: 15, NJF: 5, ISU: -5 }
export const CABIN_F = { economy: 1, premium: 1.6, business: 2.6, first: 4 }
export const CABINS = Object.keys(CABIN_F)
/** Hours relative to Iraq, for local arrival times. */
const TZ = { ...WORLD_TZ, IST: 0, AYT: 0, TZX: 0, DXB: 1, SHJ: 1, DOH: 0, GYD: 1, TBS: 1, BUS: 1, SSH: -1, CAI: -1, AMM: 0, BEY: -1, KUL: 5, MLE: 2 }
/** Connection airports that are not bookable destinations. */
const VIA = { DOH: { ar: 'الدوحة', en: 'Doha', ku: 'دۆحە' }, SHJ: { ar: 'الشارقة', en: 'Sharjah', ku: 'شارجە' } }
/** Network carriers sell from Classic (bag included); low-cost carriers also sell Light. */
const LOW_COST = new Set(['PC', 'FZ', 'G9'])
const AIRCRAFT = ['Airbus A320neo', 'Boeing 737 MAX 8', 'Airbus A321neo', 'Airbus A320']
const WIDE = ['Boeing 787-9', 'Airbus A330-300', 'Boeing 777-300ER', 'Airbus A350-900']
export const ESIM_CC = { 'Türkiye': 'tr', UAE: 'ae', Azerbaijan: 'az', Georgia: 'ge', Egypt: 'eg', Malaysia: 'my', Maldives: 'mv' }
export const BANDS = [['night', 0, 360], ['am', 360, 720], ['pm', 720, 1080], ['eve', 1080, 1440]]
export const HOME_DEST = ['IST', 'DXB', 'AYT', 'GYD', 'TZX', 'SSH', 'TBS', 'CAI']
export const HOME_ORIGINS = ['BGW', 'EBL', 'BSR', 'NJF']

export const seed = (s) => { let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0) / 4294967296) }
const r5 = (n) => Math.round(n / 5) * 5
const pad = (n) => String(n).padStart(2, '0')
export const toMin = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m }
/** "07:15" and a day offset (+1 / -1) for a minute count that may cross midnight. */
export const clock = (m) => { const x = ((m % 1440) + 1440) % 1440; return { hm: `${pad(Math.floor(x / 60))}:${pad(x % 60)}`, day: Math.floor(m / 1440) } }
export const clockText = (m) => { const c = clock(m); return `${c.hm}${c.day ? ` (${c.day > 0 ? '+' : ''}${c.day})` : ''}` }
export const isIso = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || '')
export const parse = (s) => { const [y, m, d] = String(s).split('-').map(Number); return new Date(y, (m || 1) - 1, d || 1) }
export const tomorrow = () => inDays(1)
export const AIRPORTS = [...D.airports, ...WORLD_AIRPORTS.filter((w) => !D.airports.some((a) => a.code === w.code))]
export const airport = (c) => AIRPORTS.find((a) => a.code === c)
const ROUTES = [...D.routes, ...WORLD_ROUTES.filter((w) => !D.routes.some((r) => r.to === w.to))]
const AIRLINES = { ...WORLD_AIRLINES, ...D.airlines }
export const place = (c, L) => (airport(c) ? L(airport(c).city) : VIA[c] ? L(VIA[c]) : c)
export const routeTitle = (a, b, i) => `${place(a, i.L)} ${i.rtl ? '←' : '→'} ${place(b, i.L)}`
export const airlineName = (c, L) => L(AIRLINES[c]) || c
/** Visitors: from abroad into an Iraqi airport. */
export const isInbound = (q) => IRAQ.includes(q.to) && !IRAQ.includes(q.from)
export const imgFor = (code) => {
  if (WORLD_IMG[code]) return WORLD_IMG[code]
  const a = airport(code); if (!a) return 'hero-wing'
  const c = D.cities.find((x) => x.name.en === a.city.en) || D.cities.find((x) => x.country.en === a.country.en && !IRAQ.includes(code))
  return c ? c.img : 'hero-wing'
}
export const flies = (ch, s) => { const d = parse(s); return d.getDay() === ch.weekday && ch.months.includes(d.getMonth() + 1) }
/** Next date (from `fromDays` ahead) on which a programme flies. */
export function nextCharterDate(ch, fromDays = 1) {
  for (let k = fromDays; k < fromDays + 400; k += 1) { const s = inDays(k); if (flies(ch, s)) return s }
  return null
}
export const daysFromToday = (s) => Math.round((parse(s) - parse(inDays(0))) / 864e5)

/* ---------- query ---------- */
export function norm(q = {}) {
  const int = (v, d, lo, hi) => { const n = parseInt(v, 10); return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : d }
  const ad = int(q.ad, 1, 1, 9)
  const trip = q.trip === 'ow' ? 'ow' : 'rt'
  const d1 = isIso(q.d1) ? q.d1 : inDays(14)
  let d2 = trip === 'rt' ? (isIso(q.d2) ? q.d2 : addDaysIso(d1, 7)) : ''
  if (d2 && d2 <= d1) d2 = addDaysIso(d1, 1)
  return {
    from: String(q.from || 'BGW').toUpperCase(), to: String(q.to || 'IST').toUpperCase(), d1, d2, trip, ad, ch: int(q.ch, 0, 0, 8), inf: Math.min(ad, int(q.inf, 0, 0, 4)),
    cabin: CABINS.includes(q.cabin) ? q.cabin : 'economy', direct: q.direct === '1' ? '1' : '',
  }
}
/** URL params for a search (empty values dropped). */
export const searchParams = (q) => clean({ from: q.from, to: q.to, d1: q.d1, d2: q.trip === 'rt' ? q.d2 : '', trip: q.trip, ad: q.ad, ch: q.ch || '', inf: q.inf || '', cabin: q.cabin === 'economy' ? '' : q.cabin, direct: q.direct })
export const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v != null && v !== '').map(([k, v]) => [k, String(v)]))
export const qs = (o) => new URLSearchParams(clean(o)).toString()
export const resultsHref = (q, extra) => `/flights/results?${qs({ ...searchParams(q), ...extra })}`

/* ---------- generator ---------- */
function routeOf(from, to) {
  if (IRAQ.includes(from) && !IRAQ.includes(to)) { const r = ROUTES.find((x) => x.to === to); return r && { r, iraqi: from } }
  if (IRAQ.includes(to) && !IRAQ.includes(from)) { const r = ROUTES.find((x) => x.to === from); return r && { r, iraqi: to } }
  return null
}
/** Departures per carrier depend on the route only, so outbound and return pair up. */
const depsPerCarrier = (iraqi, dest, c, via) => (via === 'direct' && seed(`${iraqi}${dest}${c}n`)() < 0.55 ? 2 : 1)
const tz = (code) => TZ[code] ?? 0

function scheduledLeg(from, to, date, info, [c, off, via], k, n, cabin) {
  const rnd = seed(`${from}${to}${date}${c}${k}`)
  const fnR = seed(`${c}${from}${to}${k}`)
  const dep = n === 1 ? 90 + Math.floor(rnd() * 80) * 15 : k === 0 ? 300 + Math.floor(rnd() * 28) * 15 : 780 + Math.floor(rnd() * 36) * 15
  const stop = via !== 'direct'
  const extra = stop ? 90 + Math.floor(rnd() * 13) * 5 : 0
  const dur = Math.max(60, info.r.dur + ORIGIN_D[info.iraqi] + Math.floor(rnd() * 4) * 5 - 5 + extra)
  const fleet = info.r.dur > 300 ? WIDE : AIRCRAFT
  const fn = () => `${c} ${100 + Math.floor(fnR() * 880)}`
  const ac = () => fleet[Math.floor(fnR() * fleet.length)]
  let segs
  if (!stop) segs = [{ from, to, dep, arr: dep + dur + (tz(to) - tz(from)) * 60, dur, fn: fn(), ac: ac(), c }]
  else {
    const lay = 60 + Math.floor(rnd() * 7) * 10
    const s1 = r5((dur - lay) * 0.45); const s2 = dur - lay - s1
    const a1 = dep + s1 + (tz(via) - tz(from)) * 60
    segs = [{ from, to: via, dep, arr: a1, dur: s1, fn: fn(), ac: ac(), c }, { from: via, to, dep: a1 + lay, arr: a1 + lay + s2 + (tz(to) - tz(via)) * 60, dur: s2, fn: fn(), ac: ac(), c, lay }]
  }
  const dayF = 0.92 + seed(`${from}${to}${date}`)() * 0.22
  const unit = Math.round((info.r.base + off) * ORIGIN_F[info.iraqi] * dayF * (0.97 + rnd() * 0.08) * CABIN_F[cabin])
  return { from, to, date, dep, arr: segs[segs.length - 1].arr, dur, via: stop ? via : null, segs, unit }
}

export const charterOperator = (ch) => (seed(ch.id)() < 0.5 ? 'IF' : 'IA')
function charterLeg(ch, outbound, date) {
  const op = charterOperator(ch)
  const base = 7000 + Math.floor(seed(`${ch.id}fn`)() * 900)
  const z = tz(ch.to)
  const depOut = toMin(ch.dep)
  const arrOut = depOut + ch.dur + z * 60
  const dep = outbound ? depOut : arrOut + 75
  const from = outbound ? ch.from : ch.to; const to = outbound ? ch.to : ch.from
  const arr = outbound ? arrOut : dep + ch.dur - z * 60
  return { from, to, date, dep, arr, dur: ch.dur, via: null, segs: [{ from, to, dep, arr, dur: ch.dur, fn: `${op} ${base + (outbound ? 0 : 1)}`, ac: 'Airbus A320', c: op }], unit: ch.seat, op }
}

const fareRow = (f, ppa) => ({ id: f.id, name: f.name, bag: f.bag, hand: f.hand, change: f.change, refund: f.refund, seat: f.id === 'flex', ppa })

/** All results for a normalised query: { ok, list, charterHint }. Fare names are catalogue objects ({ar,en,ku}) or null for charter. */
export function searchFlights(q) {
  if (!airport(q.from) || !airport(q.to) || q.from === q.to) return { ok: false, list: [] }
  const rt = q.trip === 'rt'
  const list = []
  const info = routeOf(q.from, q.to)
  if (info) {
    const dest = info.r.to
    info.r.carriers.filter((cr) => !cr[3] || cr[3].includes(info.iraqi)).forEach((cr) => {
      const n = depsPerCarrier(info.iraqi, dest, cr[0], cr[2])
      for (let k = 0; k < n; k += 1) {
        const legs = [scheduledLeg(q.from, q.to, q.d1, info, cr, k, n, q.cabin)]
        if (rt) legs.push(scheduledLeg(q.to, q.from, q.d2, info, cr, k, n, q.cabin))
        const unit = legs.reduce((a, l) => a + l.unit, 0)
        const fams = D.fares.filter((f) => LOW_COST.has(cr[0]) || f.id !== 'light')
        list.push({ id: `${cr[0]}-${k}`, kind: 'sched', carrier: cr[0], legs, fares: fams.map((f) => fareRow(f, unit + f.add * legs.length)) })
      }
    })
  }
  let charterHint = null
  D.charters.forEach((ch) => {
    const outbound = ch.from === q.from && ch.to === q.to; const inbound = ch.to === q.from && ch.from === q.to
    if (!outbound && !inbound) return
    const ok = q.cabin === 'economy' && flies(ch, q.d1) && (!rt || flies(ch, q.d2))
    if (!ok) { charterHint = ch; return }
    const legs = [charterLeg(ch, outbound, q.d1)]; if (rt) legs.push(charterLeg(ch, !outbound, q.d2))
    const f = { id: 'charter', name: null, bag: ch.bag, hand: 7, change: false, refund: false }
    list.push({ id: ch.id, kind: 'charter', carrier: legs[0].op, ch, legs, fares: [{ ...fareRow(f, ch.seat * legs.length), nameChange: true }] })
  })
  list.forEach((x) => {
    x.from = x.fares[0].ppa; x.bagIn = x.fares[0].bag > 0
    x.stops = Math.max(...x.legs.map((l) => (l.via ? 1 : 0)))
    x.total = x.legs.reduce((a, l) => a + l.dur, 0); x.dep = x.legs[0].dep
  })
  return { ok: true, list, charterHint }
}
export const fareName = (f, i) => (f.name ? i.L(f.name) : i.t('fl.fare.charter'))
/** Price for everyone: children 75%, infants 10% of the adult fare. */
export const priceFor = (ppa, q) => Math.round(ppa * q.ad) + Math.round(ppa * 0.75 * q.ch) + Math.round(ppa * 0.1 * q.inf)
export const cheapest = (q) => { const { list } = searchFlights(q); return list.length ? Math.min(...list.map((x) => x.from)) : null }

/* ---------- people ---------- */
const plural = (i, n, one, many) => (n === 1 ? i.t(one) : i.t(many, { n }))
export const paxText = (q, i) => [plural(i, q.ad, 'fl.ad1', 'fl.adN'), q.ch ? plural(i, q.ch, 'fl.ch1', 'fl.chN') : '', q.inf ? plural(i, q.inf, 'fl.inf1', 'fl.infN') : ''].filter(Boolean).join(' · ')
export const travText = (q, i) => plural(i, q.ad + q.ch + q.inf, 'fl.trav1', 'fl.travN')
export const season = (ch, i) => (ch.months.length === 12 ? i.t('fl.allYear') : `${i.monthName(Math.min(...ch.months) - 1)} – ${i.monthName(Math.max(...ch.months) - 1)}`)
