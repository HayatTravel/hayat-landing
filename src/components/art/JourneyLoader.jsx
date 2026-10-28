import { useEffect, useState } from 'react'

// Shows the loader for `ms` whenever `key` changes: a short, deliberate "we're searching" beat.
export function useJourney(key, ms = 1500) {
  const [busy, setBusy] = useState(true)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setBusy(false)
    setBusy(true)
    const t = setTimeout(() => setBusy(false), ms)
    return () => clearTimeout(t)
  }, [key, ms])
  return busy
}

const Cloud = ({ x, y, s = 1, o = 0.9 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity={o}>
    <ellipse cx="30" cy="20" rx="30" ry="12" /><ellipse cx="52" cy="14" rx="20" ry="14" /><ellipse cx="14" cy="16" rx="14" ry="10" />
  </g>
)

// wide strip of clouds duplicated so it can drift seamlessly
function Clouds({ y, speed, s, o }) {
  const row = [0, 170, 330, 520].map((x) => <Cloud key={x} x={x} y={y + (x % 3) * 6} s={s} o={o} />)
  return (
    <g style={{ animation: `drift ${speed}s linear infinite` }}>
      <g>{row}</g><g transform="translate(640 0)">{row}</g>
    </g>
  )
}

function FlightScene({ from, to }) {
  const path = 'M560 120 Q320 -10 80 120'
  return (
    <svg viewBox="0 0 640 180" className="w-full" aria-hidden="true">
      <Clouds y={20} speed={14} s={0.8} o={0.5} />
      <path d={path} fill="none" stroke="#3d7eff" strokeOpacity=".35" strokeWidth="2" strokeDasharray="3 7" />
      <path d={path} fill="none" stroke="#3d7eff" strokeWidth="2.5" pathLength="1" strokeDasharray="1" className="rm-draw" style={{ animationDuration: '1.4s' }} />
      {/* CSS motion path restarts on mount; SMIL would run on the page's clock */}
      <g style={{ offsetPath: `path('${path}')`, offsetRotate: 'auto', animation: 'fly 1.4s cubic-bezier(.4,0,.2,1) both' }}>
        <path d="M-12,-4 L12,0 L-12,4 L-8,0 Z M-2,0 L-8,-10 L-4,-10 L4,0 L-4,10 L-8,10 Z" fill="#0b1220" />
      </g>
      <Clouds y={120} speed={8} s={1.1} o={0.95} />
      {[[560, from], [80, to]].map(([x, c]) => (
        <g key={c}>
          <circle cx={x} cy="120" r="5" fill="#0b1220" />
          <text x={x} y="150" textAnchor="middle" fontSize="16" fontWeight="700" fill="#0b1220">{c}</text>
        </g>
      ))}
    </svg>
  )
}

function HotelScene() {
  const towers = [[40, 70, 60], [110, 40, 90], [190, 90, 40], [250, 55, 75], [320, 20, 110], [400, 75, 55], [470, 45, 85], [545, 85, 45]]
  return (
    <svg viewBox="0 0 640 180" className="w-full" aria-hidden="true">
      <circle cx="560" cy="40" r="18" fill="#9dbcff" />
      <circle cx="570" cy="34" r="16" fill="#f5f7fb" />
      {towers.map(([x, top, w], i) => (
        <g key={x}>
          <rect x={x} y={top} width={w * 0.8} height={170 - top} fill={i % 2 ? '#0b1220' : '#141c2e'} />
          {Array.from({ length: Math.floor((150 - top) / 18) }, (_, r) => [0, 1, 2].map((c) => (
            <rect key={`${r}-${c}`} x={x + 6 + c * (w * 0.8 - 12) / 3} y={top + 10 + r * 18} width="6" height="8" fill="#ffd27a"
              style={{ animation: `twinkle ${1.2 + ((r + c + i) % 4) * 0.4}s ease-in-out ${(r * 3 + c + i) * 0.07}s infinite` }} />
          )))}
        </g>
      ))}
      <rect x="0" y="168" width="640" height="12" fill="#0b1220" />
    </svg>
  )
}

function CarScene() {
  return (
    <svg viewBox="0 0 640 180" className="w-full" aria-hidden="true">
      <path d="M0 150 Q160 120 320 140 T640 130 V180 H0Z" fill="#e3e8f2" />
      <rect x="0" y="150" width="640" height="30" fill="#0b1220" />
      <path d="M0 165 H640" stroke="#fff" strokeWidth="3" strokeDasharray="24 24" style={{ animation: 'road .4s linear infinite' }} />
      <g style={{ animation: 'drive 1.5s cubic-bezier(.4,0,.2,1) forwards' }}>
        <g style={{ animation: 'bob .35s ease-in-out infinite' }}>
          <path d="M20 146 v-14 l10-18 a6 6 0 0 1 5-3 h46 a6 6 0 0 1 5 3 l10 18 v14z" fill="#3d7eff" />
          <path d="M38 116 h38 l7 15 H31z" fill="#9dbcff" />
        </g>
        {[40, 90].map((cx) => (
          <g key={cx} style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'wheel .3s linear infinite' }}>
            <circle cx={cx} cy="148" r="10" fill="#0b1220" stroke="#fff" strokeWidth="2" />
            <path d={`M${cx - 6} 148 H${cx + 6}`} stroke="#fff" strokeWidth="2" />
          </g>
        ))}
      </g>
    </svg>
  )
}

const copy = { flight: 'نبحث في مئات الرحلات عن أفضل سعر…', hotel: 'نجمع لك أفضل الفنادق…', car: 'نجهّز السيارات المتاحة…' }

export default function JourneyLoader({ variant = 'flight', from, to }) {
  return (
    <div role="status" className="card animate-fade overflow-hidden bg-gradient-to-b from-sky/45 to-white px-6 pt-6 pb-8 text-center">
      <div className="mx-auto max-w-xl">
        {variant === 'flight' && <FlightScene from={from} to={to} />}
        {variant === 'hotel' && <HotelScene />}
        {variant === 'car' && <CarScene />}
      </div>
      <p className="mt-4 text-sm font-medium text-ink/70">{copy[variant]}</p>
      <div className="mx-auto mt-3 h-0.5 w-40 overflow-hidden rounded-sm bg-line">
        <span className="block h-full origin-right animate-[grow_1.5s_ease-out_forwards] bg-brand" />
      </div>
    </div>
  )
}
