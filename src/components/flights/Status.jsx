import { useState } from 'react'
import { useNavigate } from 'react-router'
import Icon from '../Icon'
import { useI18n } from '../../lib/i18n'
import { trips } from '../../lib/store'
import { parseFlight } from '../../lib/providers/flightStatus'
import { Field, control } from './FlightForm'
import { place } from './engine'
import { GEO } from './geo'
import { AIRLINE_SITES } from './world'

const TONE = {
  scheduled: 'bg-mist text-ink/75', boarding: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200', departed: 'bg-brand/10 text-brand', air: 'bg-brand/10 text-brand',
  landed: 'bg-emerald-50 text-emerald-800', delayed: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200', cancelled: 'bg-red-50 text-red-700',
}
/** Status pill used on the status page, the home departures boards and lists. */
export const Pill = ({ s }) => { const { t } = useI18n(); return <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold ${TONE[s]}`}>{(s === 'air' || s === 'boarding') && <span className="size-1.5 rounded-full bg-current" />}{t(`fs.s.${s}`)}</span> }
const digits = (v) => String(v || '').replace(/\D/g, '').slice(-9)
/** Find a saved booking by number + phone (same rule as My trips). Returns the booking or an error key. */
export function lookupBooking(ref, phone) {
  const r = String(ref || '').replace(/\s/g, '').toUpperCase(); const ph = digits(phone)
  if (r.length < 6 || ph.length < 9) return { err: 'fs.lookup.need' }
  const b = trips.find(r)
  return b && digits(b.phone) === ph ? { b } : { err: 'fs.lookup.err' }
}

/** Booking number + phone → /flight-status with the booking (passed in router state, never in the URL). */
export function BookingLookup({ bare = false, onFound }) {
  const { t } = useI18n()
  const go = useNavigate()
  const [err, setErr] = useState('')
  const submit = (e) => {
    e.preventDefault()
    const f = e.currentTarget
    const r = lookupBooking(f.ref.value, f.phone.value)
    if (r.err) return setErr(t(r.err))
    setErr('')
    if (onFound) onFound(r.b); else go('/flight-status', { state: { ref: r.b.ref } })
  }
  return (
    <form onSubmit={submit} noValidate className={`space-y-3 text-ink ${bare ? '' : 'rounded-lg border border-line bg-white p-4 sm:p-5'}`}>
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <Field label={t('fs.lookup.ref')} icon="ticket"><input name="ref" className={`${control} uppercase`} dir="ltr" placeholder="HY…" autoComplete="off" maxLength={10} /></Field>
        <Field label={t('fs.lookup.phone')} icon="phone">
          <span className="flex items-center gap-2" dir="ltr"><span className="text-sm text-muted">+964</span><input name="phone" type="tel" inputMode="tel" className={control} placeholder="770 000 0000" autoComplete="tel-national" /></span>
        </Field>
        <button className="btn-primary min-h-14 w-full px-8 text-base md:w-auto"><Icon name="search" className="size-5" />{t('fs.lookup.go')}</button>
      </div>
      {err && <p role="alert" className="text-sm font-medium text-red-600">{err}</p>}
    </form>
  )
}

/** Any other flight: link out to free public sources (no paid tracker). */
export function OtherFlight() {
  const { t } = useI18n()
  const [no, setNo] = useState('')
  const p = parseFlight(no)
  const ident = p ? `${p.carrier}${p.number}` : ''
  const airline = p && AIRLINE_SITES[p.carrier] ? AIRLINE_SITES[p.carrier] : `https://www.google.com/search?q=${encodeURIComponent(`${ident} flight status`)}`
  const off = 'pointer-events-none opacity-50'
  return (
    <section className="card p-6">
      <h2 className="font-bold">{t('fs.other.t')}</h2>
      <p className="mt-1 text-sm text-muted">{t('fs.other.s')}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
        <Field label={t('fs.no')} icon="plane"><input className={`${control} uppercase`} dir="ltr" value={no} onChange={(e) => setNo(e.target.value)} placeholder={t('fs.noPh')} autoComplete="off" /></Field>
        <a href={p ? `https://www.flightradar24.com/data/flights/${ident.toLowerCase()}` : undefined} target="_blank" rel="noopener" aria-disabled={!p} className={`btn-ghost px-5 py-3 text-sm ${p ? '' : off}`}>{t('fs.other.fr24')}<Icon name="arrow" className="size-4 rtl:-scale-x-100" /></a>
        <a href={p ? airline : undefined} target="_blank" rel="noopener" aria-disabled={!p} className={`btn-ghost px-5 py-3 text-sm ${p ? '' : off}`}>{t('fs.other.airline')}<Icon name="arrow" className="size-4 rtl:-scale-x-100" /></a>
      </div>
      {no && !p && <p className="mt-2 text-sm text-red-600">{t('fs.badNo')}</p>}
      <p className="mt-3 text-xs text-muted">{t('fs.other.note')}</p>
    </section>
  )
}

/* ---------- map ---------- */
/** Calm route map: graticule, nearby airports as faint dots, a bowed arc and the plane at `progress`. */
export function FlightMap({ from, to, progress = 0, status }) {
  const { L } = useI18n()
  const a = GEO[from]; const b = GEO[to]
  if (!a || !b) return null
  const W = 640; const H = 300; const pad = 48
  const midLat = (a[1] + b[1]) / 2; const k = Math.cos((midLat * Math.PI) / 180)
  const span = Math.max(Math.abs(a[0] - b[0]) * k, Math.abs(a[1] - b[1]) * 2, 6)
  const cx = (a[0] + b[0]) / 2; const cy = midLat
  const sc = Math.min((W - pad * 2) / span, (H - pad * 2) / Math.max(Math.abs(a[1] - b[1]), span / 2.2))
  const P = ([lon, lat]) => [W / 2 + (lon - cx) * k * sc, H / 2 - (lat - cy) * sc]
  const [x1, y1] = P(a); const [x2, y2] = P(b)
  const len = Math.hypot(x2 - x1, y2 - y1) || 1
  const bend = Math.min(70, len * 0.22)
  const qx = (x1 + x2) / 2 + (-(y2 - y1) / len) * bend * (x2 > x1 ? 1 : -1) * -1
  const qy = (y1 + y2) / 2 + ((x2 - x1) / len) * bend * (x2 > x1 ? 1 : -1) * -1
  const pt = (s) => [(1 - s) ** 2 * x1 + 2 * (1 - s) * s * qx + s ** 2 * x2, (1 - s) ** 2 * y1 + 2 * (1 - s) * s * qy + s ** 2 * y2]
  const tangent = (s) => [2 * (1 - s) * (qx - x1) + 2 * s * (x2 - qx), 2 * (1 - s) * (qy - y1) + 2 * s * (y2 - qy)]
  const p = Math.min(1, Math.max(0, progress))
  const [px, py] = pt(p); const [tx, ty] = tangent(p)
  const ang = (Math.atan2(ty, tx) * 180) / Math.PI
  const path = `M${x1},${y1} Q${qx},${qy} ${x2},${y2}`
  // flown part: split the curve at p (de Casteljau)
  const fx = (1 - p) * x1 + p * qx; const fy = (1 - p) * y1 + p * qy
  const flown = `M${x1},${y1} Q${fx},${fy} ${px},${py}`
  const lines = []
  const lon0 = cx - W / (2 * k * sc); const lon1 = cx + W / (2 * k * sc); const lat0 = cy - H / (2 * sc); const lat1 = cy + H / (2 * sc)
  const stepDeg = span > 40 ? 10 : 5
  for (let lon = Math.ceil(lon0 / stepDeg) * stepDeg; lon <= lon1; lon += stepDeg) { const [x] = P([lon, 0]); lines.push(`M${x},0V${H}`) }
  for (let lat = Math.ceil(lat0 / stepDeg) * stepDeg; lat <= lat1; lat += stepDeg) { const [, y] = P([0, lat]); lines.push(`M0,${y}H${W}`) }
  const others = Object.entries(GEO).filter(([c]) => c !== from && c !== to).map(([c, g]) => [c, ...P(g)]).filter(([, x, y]) => x > 0 && x < W && y > 0 && y < H)
  const show = status !== 'cancelled' && p > 0 && p < 1
  const label = (x, y, c, name) => (
    <g>
      <circle cx={x} cy={y} r="5" fill="#0b1220" /><circle cx={x} cy={y} r="9" fill="none" stroke="#0b1220" strokeOpacity=".15" />
      <text x={x} y={y + 22} textAnchor="middle" fontSize="13" fontWeight="700" fill="#0b1220">{c}</text>
      <text x={x} y={y + 37} textAnchor="middle" fontSize="11" fill="#8f9bb3">{name}</text>
    </g>
  )
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-md bg-[#f5f7fb]" role="img" aria-label={`${from} → ${to}`} direction="ltr">
      <path d={lines.join('')} stroke="#e3e8f2" strokeWidth="1" fill="none" />
      {others.map(([c, x, y]) => <circle key={c} cx={x} cy={y} r="2" fill="#8f9bb3" opacity=".45" />)}
      <path d={path} fill="none" stroke="#9dbcff" strokeWidth="2" strokeDasharray="4 6" />
      {p > 0 && <path d={flown} fill="none" stroke="#3d7eff" strokeWidth="2.5" />}
      {label(x1, y1, from, place(from, L))}{label(x2, y2, to, place(to, L))}
      {show && (
        <g transform={`translate(${px} ${py}) rotate(${ang})`} style={{ transition: 'transform 1.2s ease' }}>
          <circle r="13" fill="#fff" stroke="#3d7eff" strokeOpacity=".35" />
          <path d="M-9,-3 L9,0 L-9,3 L-6,0 Z M-2,0 L-7,-8 L-4,-8 L4,0 L-4,8 L-7,8 Z" fill="#0b1220" />
        </g>
      )}
    </svg>
  )
}
