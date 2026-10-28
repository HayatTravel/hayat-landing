import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import Icon from '../Icon'
import Combobox from '../Combobox'
import { Ltr } from '../ui'
import { inDays, useI18n } from '../../lib/i18n'
import { store } from '../../lib/store'
import { parseFlight } from '../../lib/providers/flightStatus'
import { Field, airportOptions, control } from './FlightForm'
import { qs, place } from './engine'
import { GEO } from './geo'

const RECENT = 'fs-recent'
export const recentSearches = () => store.get(RECENT, [])
export const remember = (s) => store.set(RECENT, [s, ...recentSearches().filter((x) => JSON.stringify(x) !== JSON.stringify(s))].slice(0, 5))
export const statusHref = (s) => `/flight-status?${qs(s)}`

/** Search by flight number, or by route + date. Navigates to /flight-status?flight=&date= or ?from=&to=&date=. */
export function StatusForm({ initial = {}, bare = false }) {
  const i = useI18n(); const { t } = i
  const go = useNavigate()
  const [mode, setMode] = useState(initial.from ? 'route' : 'no')
  const [no, setNo] = useState(initial.flight || '')
  const [from, setFrom] = useState(initial.from || 'BGW')
  const [to, setTo] = useState(initial.to || 'IST')
  const [date, setDate] = useState(initial.date || inDays(0))
  const [err, setErr] = useState('')
  const opts = airportOptions(i.L)
  const submit = (e) => {
    e.preventDefault()
    let s
    if (mode === 'no') { const p = parseFlight(no); if (!p) return setErr(t('fs.badNo')); s = { flight: `${p.carrier}${p.number}`, date } } else s = { from, to, date }
    setErr(''); remember(s); go(statusHref(s))
  }
  return (
    <form onSubmit={submit} noValidate className={`space-y-3 text-ink ${bare ? '' : 'rounded-lg border border-line bg-white p-4 sm:p-5'}`}>
      <div role="group" aria-label={t('fs.title')} className="inline-flex rounded-md bg-mist p-1">
        {[['no', 'fs.byNo'], ['route', 'fs.byRoute']].map(([v, k]) => (
          <button key={v} type="button" aria-pressed={mode === v} onClick={() => setMode(v)} className={`rounded px-4 py-1.5 text-sm font-semibold transition ${mode === v ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'}`}>{t(k)}</button>
        ))}
      </div>
      <div className={`grid gap-3 ${mode === 'no' ? 'md:grid-cols-[1.4fr_1fr_auto]' : 'md:grid-cols-[1fr_1fr_1fr_auto]'}`}>
        {mode === 'no' ? (
          <Field label={t('fs.no')} icon="plane"><input className={`${control} uppercase`} dir="ltr" value={no} onChange={(e) => setNo(e.target.value)} placeholder={t('fs.noPh')} autoComplete="off" /></Field>
        ) : (<>
          <Combobox label={t('fl.from')} icon="plane" value={from} onChange={setFrom} options={opts.filter((o) => o.value !== to)} placeholder={t('fl.cityPh')} />
          <Combobox label={t('fl.to')} icon="pin" value={to} onChange={setTo} options={opts.filter((o) => o.value !== from)} placeholder={t('fl.cityPh')} />
        </>)}
        <Field label={t('fs.date')} icon="calendar"><input type="date" className={control} value={date} min={inDays(-2)} max={inDays(330)} onChange={(e) => e.target.value && setDate(e.target.value)} /></Field>
        <button className="btn-primary min-h-14 w-full px-8 text-base md:w-auto"><Icon name="search" className="size-5" />{t('fs.go')}</button>
      </div>
      {err && <p role="alert" className="text-sm font-medium text-red-600">{err}</p>}
    </form>
  )
}

/** Recent searches as chips. */
export function RecentSearches() {
  const i = useI18n(); const { t } = i
  const list = recentSearches()
  if (!list.length) return null
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-xs text-muted">{t('fs.recent')}</span>
      {list.map((s) => (
        <Link key={JSON.stringify(s)} to={statusHref(s)} className="chip hover:border-brand hover:text-brand">
          {s.flight ? <Ltr>{s.flight.replace(/^(..)/, '$1 ')}</Ltr> : `${place(s.from, i.L)} – ${place(s.to, i.L)}`} · {i.date(s.date)}
        </Link>
      ))}
    </div>
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
