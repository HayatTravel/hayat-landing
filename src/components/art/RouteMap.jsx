import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { addDays, flag, iqd } from '../../lib/format'
import { destination } from '../../data/places'
import { landRows, STEP } from '../../data/worldDots'
import { Photo } from '../ui'

// City coordinates [lon, lat]; plotted with a plain equirectangular projection.
const geo = {
  BGW: [44.4, 33.3], DXB: [55.3, 25.2], IST: [29, 41], BEY: [35.5, 33.9], CAI: [31.2, 30], AMM: [35.9, 31.9],
  GYD: [49.9, 40.4], TBS: [44.8, 41.7], KUL: [101.7, 3.1], MLE: [73.5, 4.2], DPS: [115.2, -8.7],
  CDG: [2.35, 48.9], LHR: [-0.45, 51.5], FCO: [12.5, 41.9], HKT: [98.3, 7.9], AYT: [30.7, 36.9],
}
const W = 1200
const H = 620
const x = (lon) => ((lon + 8) / 132) * W
const y = (lat) => ((57 - lat) / 70) * H
const pt = (c) => [x(geo[c][0]), y(geo[c][1])]

// Quadratic arc bowed "upward" relative to travel direction.
function arc(from, to) {
  const [x1, y1] = pt(from)
  const [x2, y2] = pt(to)
  const len = Math.hypot(x2 - x1, y2 - y1)
  const bend = Math.min(160, len * 0.35)
  const nx = -(y2 - y1) / len
  const ny = (x2 - x1) / len
  const s = ny > 0 ? -1 : 1
  return `M${x1},${y1} Q${(x1 + x2) / 2 + nx * bend * s},${(y1 + y2) / 2 + ny * bend * s} ${x2},${y2}`
}

// Every land dot as a zero-length round-capped segment: one <path> instead of thousands of circles.
const landPath = landRows.map((runs, j) => {
  let d = ''
  for (let k = 0; k < runs.length; k += 2) for (let i = runs[k]; i <= runs[k + 1]; i++) d += `M${i * STEP + (j % 2) * (STEP / 2)} ${j * STEP}h0`
  return d
}).join('')

// small nudges so neighbouring labels don't collide
const labelAt = { AMM: [16, 14], BEY: [-18, -6], CAI: [-4, 22], AYT: [-20, -6], IST: [0, -12], HKT: [-22, 4], KUL: [22, 6] }
const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
const dests = Object.keys(geo).filter((c) => c !== 'BGW')
const byPrice = [...dests].sort((a, b) => destination(a).from - destination(b).from)
const href = (c) => `/flights?from=BGW&to=${c}&date=${addDays(14)}&pax=1&cabin=economy`

export default function RouteMap() {
  const [hover, setHoverNow] = useState(null)
  const timer = useRef()
  // small grace period so the pointer can travel from the dot to its card
  const setHover = (c) => { clearTimeout(timer.current); if (c) setHoverNow(c); else timer.current = setTimeout(() => setHoverNow(null), 220) }
  const still = useMemo(reduced, [])
  const [bx, by] = pt('BGW')

  return (
    <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
      {/* destination index: hovering a row lights its route */}
      <ul className="order-2 grid max-h-[560px] grid-cols-2 gap-1 overflow-y-auto pe-1 [scrollbar-width:thin] sm:grid-cols-3 lg:order-none lg:grid-cols-1" onMouseLeave={() => setHover(null)}>
        {byPrice.map((c) => {
          const d = destination(c)
          const on = hover === c
          return (
            <li key={c}>
              <Link to={href(c)} onMouseEnter={() => setHover(c)} onFocus={() => setHover(c)}
                className={`group flex items-center gap-3 rounded-md border px-3 py-2.5 transition duration-300 ${on ? 'border-sky/40 bg-white/[.07]' : 'border-transparent hover:bg-white/[.04]'}`}>
                <img src={flag(d.cc)} alt="" className="size-7 rounded-full object-cover ring-1 ring-white/15" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{d.city}</span>
                  <span className="block font-mono text-[10px] text-white/40">BGW → {c}</span>
                </span>
                <span className={`text-xs font-semibold whitespace-nowrap transition ${on ? 'text-sky' : 'text-white/55'}`}>{iqd(d.from)}</span>
              </Link>
            </li>
          )
        })}
      </ul>

      <div className="relative overflow-hidden rounded-lg border border-white/10 bg-[radial-gradient(ellipse_at_45%_45%,#14244d_0%,#0b1220_70%)] shadow-[inset_0_0_120px_rgba(0,0,0,.5)]">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="خريطة الوجهات من بغداد">
          <defs>
            <radialGradient id="rm-light" cx={bx / W} cy={by / H} r="0.6">
              <stop offset="0" stopColor="#fff" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <mask id="rm-mask"><rect width={W} height={H} fill="url(#rm-light)" /></mask>
            <linearGradient id="rm-arc" gradientUnits="userSpaceOnUse" x1="0" x2={W}>
              <stop offset="0" stopColor="#c9b8ff" />
              <stop offset=".5" stopColor="#9dbcff" />
              <stop offset="1" stopColor="#ffc6a8" />
            </linearGradient>
            <filter id="rm-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" /></filter>
            <radialGradient id="rm-hub"><stop offset="0" stopColor="#3d7eff" stopOpacity=".55" /><stop offset="1" stopColor="#3d7eff" stopOpacity="0" /></radialGradient>
          </defs>

          {/* land: dim everywhere, lit up around Baghdad */}
          <path d={landPath} stroke="#24345c" strokeWidth="3.2" strokeLinecap="round" />
          <path d={landPath} stroke="#9dbcff" strokeWidth="3.2" strokeLinecap="round" mask="url(#rm-mask)" opacity=".75" />
          <circle cx={bx} cy={by} r="170" fill="url(#rm-hub)" />

          {dests.map((c, i) => {
            const d = arc('BGW', c)
            const on = hover === c
            const dim = hover && !on
            return (
              <g key={c} opacity={dim ? 0.12 : 1} className="transition-opacity duration-500">
                <path d={d} fill="none" stroke="url(#rm-arc)" strokeWidth={on ? 2 : 1} strokeOpacity={on ? 1 : 0.35}
                  pathLength="1" strokeDasharray="1" className="rm-draw transition-[stroke-width]" style={{ animationDelay: `${i * 80}ms` }} />
                {!still && (
                  <>
                    {/* comet: a bright dash running out from Baghdad */}
                    <path d={d} fill="none" stroke="#fff" strokeWidth={on ? 4 : 2.5} strokeLinecap="round" pathLength="1" strokeDasharray="0.14 1.3" filter="url(#rm-glow)"
                      style={{ animation: `comet ${3 + (i % 4) * 0.7}s linear ${i * 0.4}s infinite both` }} />
                    <path d={d} fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" pathLength="1" strokeDasharray="0.14 1.3"
                      style={{ animation: `comet ${3 + (i % 4) * 0.7}s linear ${i * 0.4}s infinite both` }} />
                  </>
                )}
              </g>
            )
          })}

          {dests.map((c) => {
            const [cx, cy] = pt(c)
            const on = hover === c
            const [lx, ly] = labelAt[c] || [0, -12]
            return (
              <g key={c} className="cursor-pointer" opacity={hover && !on ? 0.35 : 1} onMouseEnter={() => setHover(c)} onMouseLeave={() => setHover(null)}>
                <circle cx={cx} cy={cy} r="16" fill="transparent" />
                <circle cx={cx} cy={cy} r={on ? 12 : 7} fill="#9dbcff" fillOpacity=".18" className="transition-all duration-300" />
                <circle cx={cx} cy={cy} r={on ? 4.5 : 3} fill={on ? '#fff' : '#cfe0ff'} className="transition-all duration-300" />
                <text x={cx + lx} y={cy + ly} textAnchor="middle" fontSize={on ? 15 : 11} fontWeight="600" fill="#fff" fillOpacity={on ? 1 : 0.6}
                  fontFamily={on ? 'inherit' : 'ui-monospace, monospace'} className="pointer-events-none select-none transition-all">{on ? destination(c).city : c}</text>
              </g>
            )
          })}

          {/* Baghdad hub */}
          <circle cx={bx} cy={by} r="7" fill="#3d7eff" stroke="#fff" strokeWidth="2" />
          {[0, 0.8, 1.6].map((d) => (
            <circle key={d} cx={bx} cy={by} r="7" fill="none" stroke="#3d7eff" strokeWidth="1.5" className="rm-pulse" style={{ transformOrigin: `${bx}px ${by}px`, animationDelay: `${d}s` }} />
          ))}
          <text x={bx + 14} y={by + 26} fontSize="17" fontWeight="700" fill="#fff">بغداد</text>
        </svg>

        <div className="pointer-events-none absolute bottom-4 start-4 flex flex-wrap gap-2 text-[11px] text-white/60">
          <span className="rounded-full border border-white/10 bg-ink/60 px-3 py-1 backdrop-blur">{dests.length} وجهة من بغداد</span>
          <span className="rounded-full border border-white/10 bg-ink/60 px-3 py-1 backdrop-blur">رحلات يومية</span>
        </div>

        {/* hover card */}
        {hover && (() => {
          const d = destination(hover)
          const [cx, cy] = pt(hover)
          const below = cy < 200
          return (
            <Link to={href(hover)} onMouseEnter={() => setHover(hover)} onMouseLeave={() => setHover(null)}
              className={`absolute z-10 w-56 -translate-x-1/2 animate-fade overflow-hidden rounded-lg border border-white/15 bg-ink/90 text-white shadow-2xl backdrop-blur ${below ? 'translate-y-6' : '-translate-y-[calc(100%+24px)]'}`}
              style={{ left: `${Math.min(Math.max((cx / W) * 100, 12), 88)}%`, top: `${(cy / H) * 100}%` }}>
              <div className="relative h-24 bg-ink-2">
                <Photo id={d.img} w={500} alt={d.city} className="size-full" />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/90 to-transparent" />
                <span className="absolute bottom-2 start-3 font-mono text-[11px] text-white/80">BGW → {hover}</span>
              </div>
              <div className="flex items-end justify-between p-3">
                <div><p className="font-bold">{d.city}</p><p className="text-xs text-white/55">{d.country}</p></div>
                <p className="text-end text-[10px] text-white/50">ابتداءً من<span className="block text-sm font-bold text-sky">{iqd(d.from)}</span></p>
              </div>
            </Link>
          )
        })()}
      </div>
    </div>
  )
}
