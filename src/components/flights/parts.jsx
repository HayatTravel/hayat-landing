import { Link } from 'react-router'
import Icon from '../Icon'
import { Ltr } from '../ui'
import D from '../../data/catalog'
import { airlineLogo } from '../../lib/format'
import { useI18n } from '../../lib/i18n'
import { openHelp } from '../../lib/store'
import Sheet from './Sheet'
import {
  airlineName, clock, fareName, nextCharterDate, norm, place, priceFor, qs, resultsHref, routeTitle, searchParams, season, travText, paxText,
} from './engine'

export const Logo = ({ c, className = 'h-6 w-14' }) => <img src={airlineLogo(c)} alt="" loading="lazy" className={`${className} shrink-0 object-contain`} onError={(e) => { e.currentTarget.style.visibility = 'hidden' }} />

/** "07:15" with a small +1 when the arrival is the next day. */
export function Time({ m, className = '' }) {
  const c = clock(m)
  return <Ltr className={className}>{c.hm}{c.day ? <sup className="ms-0.5 text-[10px] font-bold text-amber-600">{c.day > 0 ? '+' : ''}{c.day}</sup> : null}</Ltr>
}

/** One leg on a result card: dep · line · arr. */
export function LegRow({ l, tag }) {
  const i = useI18n()
  return (
    <div className={`grid items-center gap-3 ${tag ? 'grid-cols-[auto_minmax(48px,1fr)_auto] sm:grid-cols-[4.5rem_auto_minmax(64px,1fr)_auto]' : 'grid-cols-[auto_minmax(64px,1fr)_auto]'}`}>
      {tag && <span className="col-span-full text-xs font-semibold text-muted sm:col-span-1">{tag}</span>}
      <span className="grid leading-tight"><Time m={l.dep} className="text-xl font-bold" /><span className="text-xs text-muted" dir="ltr">{l.from}</span></span>
      <span className="grid gap-1 text-center text-xs text-muted">
        <span>{i.dur(l.dur)}</span>
        <span className="relative block h-3" aria-hidden="true">
          <span className="absolute inset-x-0 top-1/2 border-t border-dashed border-line" />
          {l.via && <span className="absolute top-1/2 left-1/2 size-2 -translate-1/2 rounded-full border border-amber-500 bg-white" />}
          <Icon name="plane" className="absolute -top-0.5 end-0 size-3.5 text-brand rtl:-scale-x-100" />
        </span>
        <span className={l.via ? 'font-semibold text-amber-700' : 'font-semibold text-emerald-700'}>{l.via ? `${i.t('fl.stop1')} · ${l.via}` : i.t('fl.direct')}</span>
      </span>
      <span className="grid text-end leading-tight"><Time m={l.arr} className="text-xl font-bold" /><span className="text-xs text-muted" dir="ltr">{l.to}</span></span>
    </div>
  )
}

export const ChBadge = () => { const { t } = useI18n(); return <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">{t('fl.badge.ch')}</span> }

export function ResultCard({ x, q, onOpen }) {
  const i = useI18n(); const { t } = i
  const rt = x.legs.length > 1; const f = x.fares[0]
  const who = x.kind === 'charter' ? t('fl.chOp', { name: airlineName(x.carrier, i.L) }) : airlineName(x.carrier, i.L)
  const n = q.ad + q.ch + q.inf
  return (
    <button type="button" onClick={() => onOpen(x)} className={`card card-hover grid w-full gap-4 p-5 text-start sm:grid-cols-[1fr_auto] ${x.kind === 'charter' ? 'border-s-4 border-s-amber-400' : ''}`}>
      <span className="grid min-w-0 gap-4">
        <span className="flex flex-wrap items-center gap-3"><Logo c={x.carrier} /><span className="text-sm font-semibold">{who}</span>{x.kind === 'charter' && <ChBadge />}</span>
        {x.legs.map((l, k) => <LegRow key={k} l={l} tag={rt ? (k ? t('fl.ret') : t('fl.out')) : ''} />)}
        <span className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5"><Icon name="luggage" className="size-4" />{f.bag ? t('fl.bagKg', { kg: f.bag }) : t('fl.handOnly')}</span>
          <span className="inline-flex items-center gap-1.5"><Icon name="clock" className="size-4" />{i.dur(x.total)}</span>
        </span>
      </span>
      <span className="flex items-center justify-between gap-3 border-t border-dashed border-line pt-4 sm:flex-col sm:items-end sm:justify-center sm:border-t-0 sm:border-s sm:ps-6 sm:pt-0 sm:text-end">
        <span><span className="block text-2xl font-bold"><Ltr>{i.money(x.from)}</Ltr></span><span className="text-xs text-muted">{rt ? t('fl.ppRt') : t('fl.pp')}</span>
          {n > 1 && <span className="block text-xs text-muted">{t('fl.totalFor', { amount: i.money(priceFor(x.from, q)), who: travText(q, i) })}</span>}</span>
        <span className="btn-primary px-6 py-2.5 text-sm">{t('fl.select')}</span>
      </span>
    </button>
  )
}

function LegDetail({ l, label, x }) {
  const i = useI18n(); const { t } = i
  return (
    <section className="rounded-md border border-line p-4">
      <h3 className="mb-3 flex flex-wrap items-baseline gap-2 text-sm font-bold">{label} · {i.date(l.date, { weekday: true })}<span className="text-xs font-normal text-muted">{i.dur(l.dur)}</span></h3>
      <ol className="grid gap-1 text-sm">
        {l.segs.map((s, k) => (
          <li key={k} className="grid gap-1">
            {s.lay && <p className="my-1 flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800"><Icon name="clock" className="size-4" />{t('fl.d.layover', { city: place(s.from, i.L), time: i.dur(s.lay) })}</p>}
            <p className="grid grid-cols-[3.5rem_1fr] gap-3"><Time m={s.dep} className="font-bold" /><span><b>{place(s.from, i.L)}</b> <span className="text-muted" dir="ltr">{s.from}</span></span></p>
            <p className="ms-6 flex min-h-10 items-center gap-2 border-s-2 border-line ps-10 text-xs text-muted">
              <Logo c={s.c} className="h-4 w-10" /><span>{airlineName(s.c, i.L)} · <Ltr>{s.fn}</Ltr> · <Ltr>{s.ac}</Ltr> · {i.dur(s.dur)}</span>
            </p>
            <p className="grid grid-cols-[3.5rem_1fr] gap-3"><Time m={s.arr} className="font-bold" /><span><b>{place(s.to, i.L)}</b> <span className="text-muted" dir="ltr">{s.to}</span></span></p>
          </li>
        ))}
      </ol>
      {x.kind === 'charter' && <p className="mt-3 text-xs text-muted">{t('fl.d.op', { name: airlineName(x.carrier, i.L) })}</p>}
    </section>
  )
}

function Tick({ ok, children }) {
  return <li className={`flex items-start gap-2 ${ok ? '' : 'text-muted'}`}><Icon name={ok ? 'check' : 'close'} className={`mt-0.5 size-4 shrink-0 ${ok ? 'text-emerald-600' : ''}`} />{children}</li>
}
export function FareTicks({ f }) {
  const { t } = useI18n()
  return (
    <ul className="mt-2 grid gap-1 text-sm">
      <Tick ok>{t('fl.i.hand', { kg: f.hand })}</Tick>
      <Tick ok={!!f.bag}>{f.bag ? t('fl.i.bag', { kg: f.bag }) : t('fl.i.noBag')}</Tick>
      {f.nameChange ? <Tick ok>{t('fl.i.chName')}</Tick> : <Tick ok={f.change}>{f.change ? (f.refund ? t('fl.i.changeFree') : t('fl.i.change')) : t('fl.i.noChange')}</Tick>}
      <Tick ok={f.refund}>{f.refund ? t('fl.i.refund') : t('fl.i.noRefund')}</Tick>
      {f.seat && <Tick ok>{t('fl.i.seat')}</Tick>}
    </ul>
  )
}

const optCls = (on) => `flex cursor-pointer items-start gap-3 rounded-md border p-4 transition ${on ? 'border-brand bg-brand/5' : 'border-line hover:border-brand/40'}`

/** Details: itinerary, fare choice (or seat / seat + hotel for a charter), total and Continue. */
export function FlightDetails({ x, q, fare, setFare, how, setHow, onClose }) {
  const i = useI18n(); const { t } = i
  if (!x) return <Sheet open={false} onClose={onClose} />
  const rt = x.legs.length > 1; const charter = x.kind === 'charter'
  const pkg = charter && x.ch.hotelPkg ? D.packages.find((p) => p.id === x.ch.hotelPkg) : null
  const f = x.fares.find((y) => y.id === fare) || x.fares[0]
  const hotel = pkg && how === 'hotel'
  const low = x.fares[0].ppa
  const total = hotel ? pkg.base * (q.ad + q.ch) : priceFor(f.ppa, q)
  const to = hotel ? `/holidays/${pkg.id}?${qs({ d1: q.d1, ad: q.ad, ch: q.ch || '' })}` : `/checkout?${qs({ type: 'flight', id: x.id, fare: f.id, ...searchParams(q), direct: '' })}`
  return (
    <Sheet open onClose={onClose} title={routeTitle(q.from, q.to, i)}
      foot={<>
        <span><span className="block text-xs text-muted">{t('fl.d.total', { who: travText(q, i) })}</span><span className="text-2xl font-bold"><Ltr>{i.money(total)}</Ltr></span></span>
        <Link to={to} className="btn-primary px-6 py-3">{hotel ? t('fl.d.seeHoliday') : t('fl.d.continue')}<Icon name="arrow" className="size-4 rtl:-scale-x-100" /></Link>
      </>}>
      <p className="text-sm text-muted">{charter ? t('fl.chOp', { name: airlineName(x.carrier, i.L) }) : airlineName(x.carrier, i.L)} · {paxText(q, i)} · {t(`fl.cab.${q.cabin}`)}</p>
      {charter && <p className="mt-2"><ChBadge /></p>}
      <div className="mt-5 grid gap-3">{x.legs.map((l, k) => <LegDetail key={k} l={l} x={x} label={rt && k ? t('fl.ret') : t('fl.out')} />)}</div>

      {pkg && (
        <fieldset className="mt-6">
          <legend className="mb-3 font-bold">{t('fl.d.how')}</legend>
          <div className="grid gap-3">
            <label className={optCls(!hotel)}><input type="radio" name="fl-how" checked={!hotel} onChange={() => setHow('seat')} className="mt-1 size-4 accent-[var(--color-brand)]" />
              <span><b className="block">{t('fl.d.seat')}</b><span className="text-sm text-muted">{t('fl.d.seatD')}</span></span></label>
            <label className={optCls(hotel)}><input type="radio" name="fl-how" checked={hotel} onChange={() => setHow('hotel')} className="mt-1 size-4 accent-[var(--color-brand)]" />
              <span><b className="block">{t('fl.d.hotel')}</b><span className="text-sm text-muted">{t('fl.d.hotelD', { title: i.L(pkg.title), n: pkg.nights, price: i.money(pkg.base) })}</span></span></label>
          </div>
        </fieldset>
      )}

      {!hotel && (
        <fieldset className="mt-6">
          <legend className="mb-3 font-bold">{t('fl.d.fare')}</legend>
          <div className="grid gap-3">
            {x.fares.map((y, k) => (
              <label key={y.id} className={optCls(y.id === f.id)}>
                <input type="radio" name="fl-fare" checked={y.id === f.id} onChange={() => setFare(y.id)} className="mt-1 size-4 accent-[var(--color-brand)]" />
                <span className="flex-1"><b className="block">{fareName(y, i)}</b><FareTicks f={y} /></span>
                <span className="text-end"><b className="block whitespace-nowrap"><Ltr>{k ? `+${i.money(y.ppa - low)}` : i.money(y.ppa)}</Ltr></b><span className="text-xs text-muted">{t('fl.pp')}</span></span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <button type="button" onClick={() => openHelp(`${routeTitle(q.from, q.to, i)} · ${i.date(q.d1)} · ${x.id}`)} className="mt-6 flex items-center gap-2 text-sm font-medium text-brand"><Icon name="chat" className="size-4" />{t('help.line')}</button>
    </Sheet>
  )
}

/** Short, calm "searching" beat: the route drawn once between the two codes. */
export function RouteLoader({ from, to }) {
  const { t } = useI18n()
  const path = 'M40 70 Q200 0 360 70'
  return (
    <div role="status" className="card animate-fade px-6 py-8 text-center">
      <svg viewBox="0 0 400 90" className="mx-auto w-full max-w-sm rtl:-scale-x-100" aria-hidden="true">
        <path d={path} fill="none" stroke="var(--color-line)" strokeWidth="2" strokeDasharray="3 6" />
        <path d={path} fill="none" stroke="var(--color-brand)" strokeWidth="2" pathLength="1" strokeDasharray="1" className="rm-draw" style={{ animationDuration: '.9s' }} />
        <circle cx="40" cy="70" r="4" fill="var(--color-ink)" /><circle cx="360" cy="70" r="4" fill="var(--color-ink)" />
      </svg>
      <p className="-mt-2 flex items-center justify-between px-[6%] font-mono text-sm font-bold" dir="ltr"><span>{from}</span><span>{to}</span></p>
      <p className="mt-3 text-sm text-muted">{t('fl.loading')}</p>
    </div>
  )
}

/** Hayat charter programmes as an honest weekly board: day, time, route, bag, season, from-price. */
export function CharterBoard() {
  const i = useI18n(); const { t } = i
  const rows = D.charters.map((ch) => ({ ch, d1: nextCharterDate(ch) })).filter((r) => r.d1).sort((a, b) => a.ch.weekday - b.ch.weekday)
  const cols = 'grid grid-cols-[4.5rem_1fr_auto] items-center gap-3 sm:grid-cols-[6rem_4.5rem_1.6fr_5rem_1fr_7rem]'
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-[#07090f] text-white">
      <div className={`${cols} border-b border-white/10 px-4 py-3 text-[11px] font-semibold tracking-wider text-white/45 sm:px-6`}>
        <span>{t('fl.b.day')}</span><span className="max-sm:hidden">{t('fl.b.time')}</span><span>{t('fl.b.route')}</span>
        <span className="max-sm:hidden">{t('fl.b.bag')}</span><span className="max-sm:hidden">{t('fl.b.season')}</span><span className="text-end">{t('fl.b.from')}</span>
      </div>
      <ul>
        {rows.map(({ ch, d1 }) => {
          const far = Math.round((new Date(d1) - new Date()) / 864e5) > 120
          return (
            <li key={ch.id}>
              <Link to={resultsHref(norm({ from: ch.from, to: ch.to, d1, d2: '', trip: 'rt' }))}
                className={`${cols} group border-b border-white/5 px-4 py-3 transition hover:bg-white/[.04] sm:px-6`}>
                <span className="text-sm font-semibold text-amber-200">{t(`fl.wd${ch.weekday}`)}</span>
                <span className="font-mono text-base text-amber-200 max-sm:hidden"><Ltr>{ch.dep}</Ltr></span>
                <span className="min-w-0">
                  <span className="block truncate text-base font-semibold">{routeTitle(ch.from, ch.to, i)}</span>
                  <span className="block text-xs text-white/50">{t('fl.next', { date: i.date(d1, { weekday: true, year: far }) })}<span className="sm:hidden"> · <Ltr>{ch.dep}</Ltr> · {t('fl.bagKg', { kg: ch.bag })}</span></span>
                </span>
                <span className="text-sm text-white/80 max-sm:hidden">{t('fl.bagKg', { kg: ch.bag })}</span>
                <span className="text-sm text-white/60 max-sm:hidden">{season(ch, i)}</span>
                <span className="flex items-center justify-end gap-2 text-sm font-semibold text-sky"><Ltr>{i.money(ch.seat)}</Ltr><Icon name="arrow" className="size-4 text-white/30 transition group-hover:text-white rtl:-scale-x-100" /></span>
              </Link>
            </li>
          )
        })}
      </ul>
      <p className="px-4 py-3 text-xs text-white/45 sm:px-6">{t('fl.b.note')}</p>
    </div>
  )
}

