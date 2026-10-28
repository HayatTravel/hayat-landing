import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { PageHead } from '../components/Layout'
import Icon from '../components/Icon'
import TripBar from '../components/TripBar'
import { Stepper } from '../components/ui'
import { FlightRow } from './Flights'
import { airlines, findFlight, seatFee } from '../data/flights'
import { dateAr, iqd, seeded } from '../lib/format'
import { bagPrice, buildOrder, mealPrice, stepOf, steps } from '../lib/order'
import { loadPassengers, paxName } from '../lib/passengers'
import NotFound from './NotFound'

const cols = ['A', 'B', 'C', null, 'D', 'E', 'F']

export default function FlightSeats() {
  const { id } = useParams()
  const [sp] = useSearchParams()
  const go = useNavigate()
  const params = Object.fromEntries(sp)
  const f = findFlight(params, id)
  const pax = +params.pax || 1
  const people = useMemo(() => loadPassengers(pax), [pax])
  const taken = useMemo(() => {
    const r = seeded(id)
    return new Set(Array.from({ length: 70 }, () => `${1 + Math.floor(r() * 22)}${'ABCDEF'[Math.floor(r() * 6)]}`))
  }, [id])
  const [seats, setSeats] = useState(() => Array(pax).fill(null)) // one seat per passenger
  const [active, setActive] = useState(0)
  const [bag, setBag] = useState(0)
  const [meal, setMeal] = useState(false)
  if (!f) return <NotFound />

  const q = { ...params, type: 'flight', id, seats: seats.filter(Boolean).join(' '), bag, meal: meal ? 1 : 0 }
  const order = buildOrder(new URLSearchParams(q))
  const fare = order.fare

  const pick = (s) => {
    const owner = seats.indexOf(s)
    const next = [...seats]
    if (owner >= 0) { next[owner] = null; setSeats(next); setActive(owner); return }
    next[active] = s
    setSeats(next)
    const free = next.findIndex((x) => !x)
    if (free >= 0) setActive(free)
  }

  return (
    <>
      <PageHead>
        <Link to={`/flights/${id}/passengers?${sp}`} className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-brand"><Icon name="arrow" className="size-4" /> بيانات المسافرين</Link>
        <Stepper steps={steps.flight} current={stepOf('flight', 'المقاعد والإضافات')} />
      </PageHead>
      <TripBar order={order} action={{ label: 'المتابعة للدفع', onClick: () => go(`/checkout?${new URLSearchParams(q)}`) }} />

      <div className="container-x space-y-6 py-10">
        <div className="card animate-rise overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3 text-sm">
            <span className="font-semibold">{airlines[f.code].name} · <bdi dir="ltr">{f.number}</bdi> · {fare.name}</span>
            <span className="text-muted">{dateAr(f.date)} · <bdi dir="ltr">{f.aircraft}</bdi></span>
          </div>
          <FlightRow f={f} />
        </div>

        <div className="card grid animate-rise gap-8 p-6 [animation-delay:100ms] lg:grid-cols-[1fr_380px]">
          <div className="order-2 overflow-hidden lg:order-1">
            <div className="relative mx-auto max-w-sm">
            {/* wings + tailplane drawn behind the fuselage */}
            <svg viewBox="0 0 400 170" className="pointer-events-none absolute top-40 left-1/2 w-[190%] -translate-x-1/2" aria-hidden="true">
              <path d="M200 10 L10 120 L10 140 L200 90 L390 140 L390 120 Z" fill="#e3e8f2" />
              <path d="M200 16 L28 116 M200 16 L372 116" stroke="#fff" strokeWidth="1.5" />
              <rect x="78" y="92" width="16" height="30" rx="7" fill="#d3dbe8" />
              <rect x="306" y="92" width="16" height="30" rx="7" fill="#d3dbe8" />
            </svg>
            <div className="relative mx-auto max-w-sm overflow-hidden rounded-t-[120px] rounded-b-lg bg-mist px-6 pt-16 pb-6 ring-1 ring-line">
              <svg viewBox="0 0 120 30" className="absolute top-5 left-1/2 w-24 -translate-x-1/2" aria-hidden="true">
                <path d="M10 26 Q20 6 52 4 L56 22 Q30 22 10 26Z M110 26 Q100 6 68 4 L64 22 Q90 22 110 26Z" fill="#0b1220" opacity=".8" />
              </svg>
              <div dir="ltr" className="grid max-h-[440px] gap-1.5 overflow-y-auto pe-1" style={{ gridTemplateColumns: 'repeat(7, minmax(0,1fr))' }}>
                {cols.map((c, i) => <span key={i} className="text-center text-[11px] font-semibold text-muted">{c}</span>)}
                {Array.from({ length: 22 }, (_, r) => cols.map((c, i) => {
                  if (!c) return <span key={`${r}-${i}`} className="grid place-items-center text-[10px] text-muted">{r + 1}</span>
                  const s = `${r + 1}${c}`
                  const isTaken = taken.has(s)
                  const owner = seats.indexOf(s)
                  return (
                    <button key={s} disabled={isTaken} onClick={() => pick(s)} aria-label={`مقعد ${s}`} aria-pressed={owner >= 0}
                      className={`aspect-square rounded-md text-[10px] font-bold transition duration-200 ${owner >= 0 ? 'bg-brand text-white' : isTaken ? 'cursor-not-allowed bg-muted/30 text-transparent' : 'bg-white text-transparent ring-1 ring-line hover:bg-sky/40 hover:text-ink'}`}>
                      {owner >= 0 ? owner + 1 : s}
                    </button>
                  )
                }))}
              </div>
            </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-xl font-bold">اختر المقاعد</h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              {fare.seatFree ? `اختيار المقعد مشمول في سعر ${fare.name}.` : `في سعر ${fare.name} يكلّف اختيار المقعد ${iqd(seatFee)}، أو اتركه ليُخصص مجاناً عند تسجيل الوصول.`}
            </p>
            <ul className="mt-5 space-y-2">
              {people.map((p, i) => (
                <li key={i}>
                  <button onClick={() => setActive(i)} className={`flex w-full items-center gap-3 rounded-md border px-4 py-3 text-start transition ${active === i ? 'border-ink' : 'border-line hover:border-ink/40'}`}>
                    <span className="grid size-7 place-items-center rounded-full bg-mist text-xs font-bold">{i + 1}</span>
                    <span className="flex-1 truncate text-sm font-medium">{paxName(p, i)}</span>
                    <span className={`rounded-md px-2 py-1 text-xs font-bold ${seats[i] ? 'bg-brand text-white' : 'text-muted'}`} dir="ltr">{seats[i] || '—'}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted">
              <span className="flex items-center gap-2"><span className="size-4 rounded-md bg-white ring-1 ring-line" /> متاح</span>
              <span className="flex items-center gap-2"><span className="size-4 rounded-md bg-brand" /> مختار</span>
              <span className="flex items-center gap-2"><span className="size-4 rounded-md bg-muted/30" /> محجوز</span>
            </div>
          </div>
        </div>

        <div className="card animate-rise p-6 [animation-delay:200ms]">
          <h2 className="mb-5 text-xl font-bold">إضافات</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-md border border-line p-4">
              <div className="flex items-center gap-3"><Icon name="bag" className="size-5 text-brand" />
                <div><p className="font-semibold">حقيبة إضافية 23 كغ</p><p className="text-xs text-muted">{iqd(bagPrice)} للحقيبة · المشمول: {fare.bag}</p></div></div>
              <div className="mt-4 flex items-center justify-between rounded-md bg-mist p-1">
                <button onClick={() => setBag(Math.max(0, bag - 1))} className="grid size-9 place-items-center rounded-md bg-white text-lg font-bold" aria-label="إنقاص">−</button>
                <span className="font-bold">{bag}</span>
                <button onClick={() => setBag(Math.min(pax * 2, bag + 1))} className="grid size-9 place-items-center rounded-md bg-white text-lg font-bold" aria-label="زيادة">+</button>
              </div>
            </div>
            <button onClick={() => setMeal(!meal)} className={`rounded-md border p-4 text-start transition ${meal ? 'border-ink' : 'border-line hover:border-ink/40'}`}>
              <div className="flex items-center gap-3"><Icon name="meal" className="size-5 text-ember" />
                <div className="flex-1"><p className="font-semibold">وجبة مميزة ساخنة</p><p className="text-xs text-muted">{iqd(mealPrice)} للمسافر</p></div>
                <span className={`grid size-5 place-items-center rounded-sm transition ${meal ? 'bg-ink text-white' : 'ring-1 ring-line'}`}>{meal && <Icon name="check" className="size-3.5" strokeWidth={3} />}</span></div>
              <p className="mt-3 text-xs text-muted">مشاوي عراقية أو خيار نباتي، تُقدّم أولاً.</p>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
