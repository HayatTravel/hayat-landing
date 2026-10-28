import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { destination } from '../../data/places'
import { addDays, hm, iqd, seeded } from '../../lib/format'

const routes = [['DXB', 'EK'], ['IST', 'TK'], ['BEY', 'ME'], ['CAI', 'IA'], ['GYD', 'IF'], ['TBS', 'FZ'], ['AMM', 'RJ'], ['AYT', 'PC'], ['MLE', 'QR'], ['CDG', 'TK'], ['LHR', 'QR'], ['KUL', 'EY'], ['DPS', 'QR'], ['FCO', 'TK']]
const statuses = [['في الموعد', 'text-emerald-400'], ['الصعود', 'text-amber-300'], ['آخر نداء', 'text-ember']]
const statusLabels = statuses.map((s) => s[0])
const GLYPHS = '0123456789ABCDEFGHJKLMNPRSTUVWXYZ'
const cities = routes.map(([c]) => destination(c).city)
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

const clockFmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Baghdad', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' })
export function useBaghdadClock() {
  const [now, setNow] = useState(() => clockFmt.format(new Date()))
  useEffect(() => {
    const t = setInterval(() => setNow(clockFmt.format(new Date())), 1000)
    return () => clearInterval(t)
  }, [])
  return now
}

// One split-flap cell: rattles through random glyphs, then lands on `value`.
function Flap({ value, delay = 0, pool = GLYPHS, wide }) {
  const [shown, setShown] = useState(value)
  useEffect(() => {
    if (reduced()) return setShown(value)
    let n = 0
    let t
    const spin = () => {
      if (++n > 7) return setShown(value)
      setShown(pool[Math.floor(Math.random() * pool.length)])
      t = setTimeout(spin, 60)
    }
    t = setTimeout(spin, delay)
    return () => clearTimeout(t)
  }, [value, delay, pool])
  return <span className={`flap ${wide ? 'flap-wide' : ''}`}><span key={shown} className="flap-in">{shown || ' '}</span></span>
}

const Chars = ({ text, delay }) => <bdi dir="ltr" className="inline-flex gap-px">{[...text].map((c, i) => <Flap key={i} value={c === ' ' ? '' : c} delay={delay + i * 45} />)}</bdi>

function makeRow(k, at) {
  const r = seeded(`board-${k}`)
  const [to, al] = routes[k % routes.length]
  return { k, to, flight: `${al} ${100 + Math.floor(r() * 899)}`, gate: `${'ABC'[Math.floor(r() * 3)]}${1 + Math.floor(r() * 18)}`.padEnd(3, ' '), time: at, status: 0 }
}

export default function DepartureBoard() {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  const [rows, setRows] = useState(() => {
    const [h, m] = clockFmt.format(new Date()).split(':').map(Number)
    const start = Math.ceil((h * 60 + m + 10) / 5) * 5
    return Array.from({ length: 7 }, (_, i) => ({ ...makeRow(i, start + i * 20), status: i < 2 ? 2 - i : 0 }))
  })

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setOn(true), io.disconnect()), { threshold: 0.3 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  // The board lives: the first flight moves through boarding, then departs and a new one joins.
  useEffect(() => {
    if (!on || reduced()) return
    const t = setInterval(() => setRows((rs) => {
      const [first, ...rest] = rs
      if (first.status < 2) return [{ ...first, status: first.status + 1 }, ...rest]
      const last = rs.at(-1)
      const next = rest.map((r, i) => (i === 0 && r.status < 1 ? { ...r, status: 1 } : r))
      return [...next, makeRow(last.k + 1, last.time + 15 + (last.k % 3) * 10)]
    }), 4200)
    return () => clearInterval(t)
  }, [on])

  return (
    <div ref={ref} className="overflow-hidden rounded-lg border border-white/10 bg-[#07090f] shadow-[0_40px_120px_-30px_rgba(61,126,255,.35)]">
      <div className="grid grid-cols-[4.5rem_1fr_auto] sm:grid-cols-[5rem_1fr_6.5rem_7rem] items-center gap-3 border-b border-white/10 px-4 py-3 text-[11px] font-semibold tracking-wider text-white/40 sm:px-6 md:grid-cols-[5.5rem_1.4fr_7rem_4.5rem_8rem_1fr]">
        <span>الوقت</span><span>الوجهة</span><span className="max-sm:hidden">الرحلة</span><span className="max-md:hidden">البوابة</span><span>الحالة</span><span className="text-end max-md:hidden">ابتداءً من</span>
      </div>
      <ul>
        {rows.map((r, i) => {
          const d = destination(r.to)
          const [label, color] = statuses[r.status]
          const delay = on ? i * 110 : 0
          return (
            <li key={r.k} className="animate-[fade_.6s_ease_both]">
              <Link to={`/flights?from=BGW&to=${r.to}&date=${addDays(0)}&pax=1&cabin=economy`}
                className="group grid grid-cols-[4.5rem_1fr_auto] sm:grid-cols-[5rem_1fr_6.5rem_7rem] items-center gap-3 border-b border-white/5 px-4 py-2.5 text-white transition hover:bg-white/[.04] sm:px-6 md:grid-cols-[5.5rem_1.4fr_7rem_4.5rem_8rem_1fr]">
                <span className="font-mono text-base text-amber-200 sm:text-lg"><Chars text={on ? hm(r.time) : '     '} delay={delay} /></span>
                <span className="flex items-center gap-3 text-base font-semibold sm:text-lg">
                  <Flap value={on ? d.city : ''} pool={cities} delay={delay + 120} wide />
                  <span className="font-mono text-xs text-white/35 max-sm:hidden">{r.to}</span>
                </span>
                <span className="font-mono text-sm text-white/80 max-sm:hidden sm:text-base"><Chars text={on ? r.flight : '      '} delay={delay + 200} /></span>
                <span className="font-mono text-sm text-white/80 max-md:hidden sm:text-base"><Chars text={on ? r.gate : '   '} delay={delay + 260} /></span>
                <span className={`text-sm font-semibold ${color} ${r.status ? 'animate-pulse' : ''}`}><Flap value={on ? label : ''} pool={statusLabels} delay={delay + 300} wide /></span>
                <span className="flex items-center justify-end gap-2 text-sm text-sky max-md:hidden">
                  {iqd(d.from)}
                  <span className="text-white/30 transition group-hover:-translate-x-1 group-hover:text-white">←</span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
