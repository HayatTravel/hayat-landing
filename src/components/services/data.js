/* Services helpers (visa · eSIM · events · transfers), shared by pages, search tabs, home sections and orders.
   Everything takes the i18n object `i` from useI18n() when it produces text. */
import D, { media } from '../../data/catalog'
import { PURPOSES, PURPOSE_DOCS, PURPOSE_ICON, VISAS } from '../../data/visas-world'
import { img } from '../../lib/format'
import { inDays, iso } from '../../lib/i18n'

export const clamp = (n, a, b) => Math.min(b, Math.max(a, Number.isFinite(n) ? n : a))
export const validIso = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(new Date(s).getTime())
export const qs = (o) => { const s = new URLSearchParams(Object.entries(o).filter(([, v]) => v != null && v !== '')).toString(); return s ? `?${s}` : '' }

/** Plural-aware string: keys base.1, base.2, base.n (3–10), base.m (11+, falls back to .n). */
export const pl = (i, n, base) => {
  const v = { n: i.num(n) }
  const k = n === 1 ? '.1' : n === 2 ? '.2' : n > 10 ? '.m' : '.n'
  const s = i.t(base + k, v)
  return s === base + k ? i.t(`${base}.n`, v) : s
}

/* ---------- visa ---------- */
export const VISA_FLIGHT = { TR: 'IST', AE: 'DXB', AZ: 'GYD', EG: 'CAI', GE: 'TBS', MY: 'KUL', IR: 'IKA', MV: 'MLE' }
export const SERVICE_FEE = { evisa: 15, arrival: 10, embassy: 45, free: 0 }
export const ARRANGE = ['hotel', 'ticket', 'insurance']
export const KIND_TONE = {
  evisa: 'bg-[#e8f0ff] text-brand-600',
  arrival: 'bg-amber-50 text-amber-800',
  embassy: 'bg-[#efe9f7] text-plum',
  free: 'bg-emerald-50 text-emerald-700',
}
export const visa = (id) => VISAS.find((v) => v.id === String(id || '').toUpperCase())
export { VISAS, PURPOSES, PURPOSE_ICON }
/** Purposes we handle for this destination (transit only where a transit visa applies). */
export const purposesOf = (v) => [...v.purposes, ...(v.transit ? ['transit'] : [])]
export const purposeOk = (p) => PURPOSES.includes(p)
/** Documents for one destination and purpose: passport/photo/ID (+ insurance) and the purpose's own papers. */
export function docsFor(v, purpose = 'tourism') {
  const core = v.docs.filter((d) => ['passport', 'photo', 'id', 'insurance'].includes(d))
  const add = PURPOSE_DOCS[purpose] || v.docs
  return [...new Set(['passport', ...core, ...add])]
}
/** The visa case for a purpose: kind, processing days, illustrative fee and documents.
    Study usually needs a student visa through the embassy, even where visits are easier. */
export function caseOf(v, purpose) {
  const list = purposesOf(v)
  const p = list.includes(purpose) ? purpose : list[0]
  const docs = docsFor(v, p)
  if (p === 'transit') return { ...v.transit, purpose: p, docs }
  if (p === 'study' && v.kind !== 'embassy') return { kind: 'embassy', days: Math.max(v.days, 15), fee: Math.max(v.fee, 110), purpose: p, docs }
  return { kind: v.kind, days: v.days, fee: v.fee, purpose: p, docs }
}
/** Image source: a media name, an Unsplash photo id, or null (the caller shows a quiet placeholder). */
export const pic = (x, w = 900) => (!x ? null : x.startsWith('photo-') ? img(x, w) : media(x))
export const procTime = (i, v) => (v.kind === 'free' ? i.t('vi.kind.free') : v.kind === 'arrival' ? i.t('vi.atArrival') : pl(i, v.days, 'vi.wd'))
export const leadDays = (v) => v.days + 3
/** The requested travel date if it leaves enough time to apply, else a sensible default. */
export const visaDate = (v, s) => (validIso(s) && s >= inDays(leadDays(v)) ? s : inDays(Math.max(30, leadDays(v) + 7)))
export const airportCity = (i, code) => i.L(D.airports.find((a) => a.code === code)?.city) || code

/* ---------- eSIM ---------- */
export const ESIM_IMG = { tr: 'istanbul', ae: 'dubai', az: 'baku', ge: 'georgia', eg: 'dest-cairo', eu: 'dest-paris', my: 'dest-kl', mv: 'maldives' }
export const esim = (cc) => D.esim.find((c) => c.cc === String(cc || '').toLowerCase())
export const esDays = (i, n) => pl(i, n, 'es.d')
export const planLabel = (i, p) => `${p[1]} GB · ${esDays(i, p[0])}`
export const minPlan = (c) => Math.min(...c.plans.map((p) => p[2]))
/** Plan that matches the trip length: exact days, else the next longer one; -1 when none. */
export const fitIndex = (c, days) => {
  if (!days) return -1
  const exact = c.plans.findIndex((p) => p[0] === days)
  return exact >= 0 ? exact : c.plans.findIndex((p) => p[0] >= days)
}

/* ---------- events ---------- */
export const CATS = ['concert', 'sport', 'expo']
export const ev = (id) => D.events.find((e) => e.id === id)
export const evDate = (e) => inDays(e.inDays)
export const cityKey = (e) => e.city.en.toLowerCase()
export const evCities = () => [...new Map(D.events.map((e) => [cityKey(e), e.city])).entries()]
export const tiersOf = (e) => e.tiers.map(([id, name, usd, left]) => ({ id, name, usd, left }))
/** Tiers from the dearest (nearest the stage) to the cheapest. */
export const ranked = (e) => tiersOf(e).sort((a, b) => b.usd - a.usd)
export const evMin = (e) => Math.min(...e.tiers.map((x) => x[2]))
export const nextMonths = (n = 6) => Array.from({ length: n }, (_, k) => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() + k); return iso(d).slice(0, 7) })
export const monthText = (i, ym) => { const [y, m] = ym.split('-').map(Number); return `${i.monthName(m - 1)} ${y}` }

/* ---------- airport transfers ---------- */
export const IRAQ = ['BGW', 'EBL', 'BSR', 'NJF', 'ISU']
export const TIMES = Array.from({ length: 48 }, (_, k) => `${String(Math.floor(k / 2)).padStart(2, '0')}:${k % 2 ? '30' : '00'}`)
export const cars = (n) => Math.ceil(n / 4)
/** Shared shuttle is per person; a private car takes up to 4 passengers. */
export const trPrice = (v, n) => (v === 'sic' ? D.transfers.sic.price * n : D.transfers.vip.price * cars(n))
/** Normalise transfer params. lenient: fill defaults (for the form); otherwise null when incomplete or in the past. */
export function trState(q = {}, lenient = false) {
  const s = {
    ap: D.airports.some((a) => a.code === q.ap) ? q.ap : lenient ? 'IST' : null,
    dir: q.dir === 'dep' ? 'dep' : 'arr',
    date: validIso(q.date) && q.date >= inDays(0) ? q.date : lenient ? inDays(14) : null,
    time: TIMES.includes(q.time) ? q.time : lenient ? '14:00' : null,
    n: clamp(+q.n || 2, 1, 8),
    v: q.v === 'sic' ? 'sic' : 'vip',
  }
  return lenient || (s.ap && s.date && s.time) ? s : null
}
export const trVehicle = (i, s) => `${i.L(D.transfers[s.v].name)}${s.v === 'vip' && cars(s.n) > 1 ? ` · ${pl(i, cars(s.n), 'tr.c')}` : ''}`
export const trFacts = (i, s) => [
  [i.t('tr.airport'), `${airportCity(i, s.ap)} (${s.ap})`],
  [i.t('tr.dir'), i.t(s.dir === 'arr' ? 'tr.arrL' : 'tr.depL')],
  [i.t('tr.when'), `${i.date(s.date, { weekday: true })} · ${s.time}`],
  [i.t('tr.pax'), pl(i, s.n, 'tr.p')],
  [i.t('tr.vehicle'), trVehicle(i, s)],
]
export const trParams = (s) => ({ ap: s.ap, dir: s.dir, date: s.date, time: s.time, n: s.n, v: s.v })
