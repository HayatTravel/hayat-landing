/* Stays (hotels + holidays): pure helpers shared by pages, search forms, home section and orders.
   Ported from the tathkara v2 mockup (stays.js). `i` is the useI18n() value. */
import D from '../../data/catalog'
import { addDaysIso, inDays, nightsBetween } from '../../lib/i18n'

/** Counted phrase: plural(i, 'st.nights', 5) → "5 ليالٍ" / "5 nights" / "5 شەو". */
export function plural(i, base, n) {
  const suf = i.lang === 'ar' ? (n === 1 ? '.1' : n === 2 ? '.2' : n > 10 ? '.m' : '') : i.lang === 'en' && n === 1 ? '.1' : ''
  const k = `${base}${suf}`
  return i.t(i.t(k) === k ? base : k, { n: i.num(n) })
}

export const int = (v, d, lo, hi) => { const n = parseInt(v, 10); return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : d }
export const isoOk = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && s >= inDays(0)
export const cityBy = (slug) => D.cities.find((c) => c.slug === slug)
export const hotelBy = (id) => D.hotels.find((h) => h.id === id)
export const pkgBy = (id) => D.packages.find((p) => p.id === id)
export const hotelCities = () => D.cities.filter((c) => D.hotels.some((h) => h.city === c.slug))
export const pkgCities = () => D.cities.filter((c) => D.packages.some((p) => p.city === c.slug))
export const cheapest = (h) => h.rooms.reduce((a, r) => (r.base < a.base ? r : a), h.rooms[0])
export const qs = (o) => new URLSearchParams(Object.entries(o).filter(([, v]) => v != null && v !== '')).toString()
export const withQs = (path, o) => { const s = qs(o); return s ? `${path}?${s}` : path }

/** "City, Country" with the right comma; the country is dropped when it repeats the city (Maldives). */
export const place = (i, c) => { if (!c) return ''; const a = i.L(c.name); const b = i.L(c.country); return a === b ? a : `${a}${i.lang === 'en' ? ', ' : '، '}${b}` }

export const FACT_IC = { wifi: 'wifi', breakfast: 'meal', pool: 'sparkle', family: 'users', beach: 'globe', metro: 'truck', allinc: 'meal' }
export const BOARD_IC = { RO: 'bed', BB: 'meal', HB: 'meal', AI: 'meal' }
export const INC_IC = { flight: 'plane', hotel: 'bed', transfer: 'car', tour: 'map', 'visa-help': 'passport', allinc: 'meal', halfboard: 'meal', lunch: 'meal', tips: 'ticket', visa: 'passport' }
export const THEMES = ['city', 'family', 'nature', 'beach', 'honeymoon']
export const BOARD_ORDER = ['RO', 'BB', 'HB', 'AI']
export const scoreWord = (i, s) => i.t(s >= 9 ? 'ht.score.ex' : s >= 8 ? 'ht.score.vg' : 'ht.score.g')

/** Normalised hotel search (defaults: +14 → +19, 1 room, 2 adults). */
export function hq(q = {}) {
  const a = isoOk(q.in) ? q.in : inDays(14)
  let b = isoOk(q.out) && q.out > a ? q.out : addDaysIso(a, 5)
  if (nightsBetween(a, b) > 30) b = addDaysIso(a, 30)
  const rooms = int(q.rooms, 1, 1, 5)
  const city = cityBy(q.city) && D.hotels.some((h) => h.city === q.city) ? q.city : ''
  return { city, in: a, out: b, rooms, ad: Math.max(rooms, int(q.ad, 2, 1, 10)), ch: int(q.ch, 0, 0, 6), n: nightsBetween(a, b) }
}
export const baseQ = (h) => ({ city: h.city, in: h.in, out: h.out, rooms: h.rooms, ad: h.ad, ch: h.ch })

/** Last day a room can be cancelled free (ISO), or null once passed. */
export const freeUntil = (room, inIso) => { const d = addDaysIso(inIso, -room.cancelDays); return d >= inDays(0) ? d : null }
export const guestsText = (i, v) => [plural(i, 'st.adults', v.ad), v.ch ? plural(i, 'st.children', v.ch) : '', plural(i, 'st.rooms', v.rooms)].filter(Boolean).join(' · ')
export const travText = (i, v) => [plural(i, 'st.adults', v.ad), v.ch ? plural(i, 'st.children', v.ch) : ''].filter(Boolean).join(' · ')
export const stayText = (i, h) => `${plural(i, 'st.nights', h.n)}${h.rooms > 1 ? ` × ${plural(i, 'st.rooms', h.rooms)}` : ''}`

/* ---------- holidays ---------- */
export const charterOf = (p) => (p.flight === 'charter' ? D.charters.find((c) => c.hotelPkg === p.id) || null : null)
const dow = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d).getDay() }
/** Departure dates (ISO, sorted). Charter departures fall on the charter's weekday. */
export function depDates(p) {
  const ch = charterOf(p)
  const out = p.departures.map((o) => { let d = inDays(o); if (ch) while (dow(d) !== ch.weekday) d = addDaysIso(d, 1); return d })
  return [...new Set(out)].sort()
}
/** The departure closest to an ISO date (used when flights link "Seat + hotel" with d1). */
const gap = (a, b) => Math.abs(new Date(a) - new Date(b))
export const closestDep = (deps, d1) => (!/^\d{4}-\d{2}-\d{2}$/.test(d1 || '') ? null : deps.reduce((best, d) => (gap(d, d1) < gap(best, d1) ? d : best), deps[0]))
export const perPerson = (p, lay) => p.base + (lay?.add || 0)
export const minPP = (p) => Math.min(...p.layouts.map((l) => perPerson(p, l)))
export const pkgTotal = (p, lay, ad, ch) => Math.round(perPerson(p, lay) * ad + perPerson(p, lay) * 0.7 * ch)
export const pq = (q = {}) => ({ ad: int(q.ad, 2, 1, 9), ch: int(q.ch, 0, 0, 6) })
export const byNextDep = (a, b) => (depDates(a)[0] < depDates(b)[0] ? -1 : 1)

/** Months offered by the holiday search: this month and the next three, as YYYY-MM. */
export function monthOptions(i) {
  const now = new Date()
  return Array.from({ length: 4 }, (_, k) => {
    const d = new Date(now.getFullYear(), now.getMonth() + k, 1)
    return { value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, label: `${i.monthName(d.getMonth())} ${d.getFullYear()}` }
  })
}

/** Itinerary labels: with fewer entries than days, the last-but-one entry spans the free days ("2–7"). */
export function dayLabels(i, p) {
  const total = p.nights + 1; const n = p.days.length
  return p.days.map((_, k) => {
    if (k === n - 1) return i.num(total)
    if (k === n - 2 && n < total) return k + 1 === total - 1 ? i.num(k + 1) : `${i.num(k + 1)}–${i.num(total - 1)}`
    return i.num(k + 1)
  })
}
