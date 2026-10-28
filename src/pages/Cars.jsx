import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { PageHead } from '../components/Layout'
import Icon from '../components/Icon'
import { Ltr, Photo, Stepper } from '../components/ui'
import CarForm from '../components/cars/CarForm'
import Sheet from '../components/flights/Sheet'
import { CATS, EXTRAS, YOUNG_FEE, carParams, location, normCar, rentalDays, searchCars } from '../components/cars/engine'
import { qs } from '../components/flights/engine'
import { media } from '../data/catalog'
import { useI18n } from '../lib/i18n'
import { openHelp } from '../lib/store'
import { bookingSteps } from './Checkout'

const SORTS = ['cheap', 'big']

function Specs({ c }) {
  const { t } = useI18n()
  const items = [['user', t('car.seatsN', { n: c.seats })], ['bag', t('car.bagsN', { n: c.bags })], ['steering', c.auto ? t('car.auto') : t('car.manual')],
    ['bolt', c.electric ? t('car.electric') : c.km ? t('car.kmDay', { n: c.km }) : t('car.unlimited')]]
  return <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">{items.map(([ic, s]) => <li key={s} className="flex items-center gap-1"><Icon name={ic} className="size-3.5" />{s}</li>)}</ul>
}

function CarDetails({ c, q, days, onClose }) {
  const i = useI18n(); const { t } = i
  if (!c) return null
  const loc = location(q.city)
  const dl = days === 1 ? t('car.days1') : t('car.daysN', { n: days })
  const total = c.daily * days + (q.age === 'u25' ? YOUNG_FEE * days : 0)
  const incl = [
    t('car.i.cover', { amount: i.money(c.excess) }), t('car.i.third'),
    c.electric ? t('car.i.charge') : t('car.i.fuel'),
    c.km ? t('car.kmDay', { n: c.km }) : t('car.unlimited'),
    t('car.i.deposit', { amount: i.money(c.deposit) }), t('car.freeCancel'),
  ]
  return (
    <Sheet open onClose={onClose} title={i.L(c.name)}
      foot={<>
        <span><span className="block text-xs text-muted">{t('car.d.total', { days: dl })}</span><span className="text-2xl font-bold"><Ltr>{i.money(total)}</Ltr></span></span>
        <Link to={`/checkout?${qs({ type: 'car', id: c.id, ...carParams(q) })}`} className="btn-primary px-6 py-3">{t('car.d.continue')}<Icon name="arrow" className="size-4 rtl:-scale-x-100" /></Link>
      </>}>
      <Photo id={c.photo} w={900} alt="" className="h-48 w-full rounded-md" />
      <p className="mt-4 text-xs font-medium text-brand">{i.L(CATS[c.id])} · {t('car.by', { name: i.L(c.supplier) })}</p>
      <div className="mt-2"><Specs c={c} /></div>
      <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4 text-sm">
        <div><dt className="text-xs text-muted">{t('car.pick')}</dt><dd className="font-semibold">{i.date(q.pick, { weekday: true })} · <Ltr>{q.pt}</Ltr></dd><dd className="text-xs text-muted">{t('car.d.at', { city: i.L(loc.name) })}</dd></div>
        <div><dt className="text-xs text-muted">{t('car.drop')}</dt><dd className="font-semibold">{i.date(q.drop, { weekday: true })} · <Ltr>{q.dt}</Ltr></dd><dd className="text-xs text-muted">{t('car.d.same')}</dd></div>
      </dl>
      <h3 className="mt-6 font-bold">{t('car.d.incl')}</h3>
      <ul className="mt-2 grid gap-1.5 text-sm">{incl.map((s) => <li key={s} className="flex items-start gap-2"><Icon name="check" className="mt-0.5 size-4 shrink-0 text-emerald-600" />{s}</li>)}</ul>
      {q.age === 'u25' && <p className="mt-4 rounded-md bg-amber-50 p-3 text-sm text-amber-800">{t('car.youngD', { amount: i.money(YOUNG_FEE) })}</p>}
      <h3 className="mt-6 font-bold">{t('car.d.extras')}</h3>
      <ul className="mt-2 divide-y divide-line rounded-md border border-line text-sm">
        {EXTRAS.map((x) => (
          <li key={x.id} className="flex items-start justify-between gap-4 p-3">
            <span><b className="block">{t(x.name)}</b><span className="text-xs text-muted">{t(x.note)}</span></span>
            <span className="text-end text-xs text-muted"><Ltr className="block text-sm font-semibold text-ink">{i.money(x.perDay * days)}</Ltr>{t('car.perDay', { amount: i.money(x.perDay) })}</span>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => openHelp(`${i.L(c.name)} · ${i.L(loc.name)} · ${i.date(q.pick)}`)} className="mt-6 flex items-center gap-2 text-sm font-medium text-brand"><Icon name="chat" className="size-4" />{t('help.line')}</button>
    </Sheet>
  )
}

/** /cars?city&pick&pt&drop&dt&age (+ view state cat, tr=auto|manual, seats=7, sort=cheap|big). Search, results and details. */
export default function Cars() {
  const i = useI18n(); const { t } = i
  const [sp, setSp] = useSearchParams()
  const raw = Object.fromEntries(sp)
  const q = normCar(raw)
  const key = qs(carParams(q))
  const loc = location(q.city)
  const days = rentalDays(q)
  const dl = days === 1 ? t('car.days1') : t('car.daysN', { n: days })
  const all = searchCars(q)
  const [busy, setBusy] = useState(true)
  useEffect(() => { setBusy(true); const tm = setTimeout(() => setBusy(false), 500); return () => clearTimeout(tm) }, [key])
  const [editing, setEditing] = useState(!raw.city)
  const [open, setOpen] = useState(null)

  const st = { cat: CATS[raw.cat] ? raw.cat : '', tr: ['auto', 'manual'].includes(raw.tr) ? raw.tr : '', seats: raw.seats === '7' ? '7' : '', sort: SORTS.includes(raw.sort) ? raw.sort : 'cheap' }
  const update = (p) => { const s = { ...st, ...p }; setSp(qs({ ...carParams(q), cat: s.cat, tr: s.tr, seats: s.seats, sort: s.sort === 'cheap' ? '' : s.sort }), { replace: true, preventScrollReset: true }) }
  const shown = all.filter((c) => (!st.cat || c.id === st.cat) && (!st.tr || (st.tr === 'auto') === c.auto) && (!st.seats || c.seats >= 7))
    .sort(st.sort === 'big' ? (a, b) => b.seats - a.seats || b.bags - a.bags || a.daily - b.daily : (a, b) => a.daily - b.daily)
  const chip = (on, label, onClick) => <button key={label} type="button" aria-pressed={on} onClick={onClick} className={`shrink-0 rounded-md border px-3.5 py-1.5 text-sm transition ${on ? 'border-ink bg-ink text-white' : 'border-line text-muted hover:border-ink/40 hover:text-ink'}`}>{label}</button>

  return (
    <>
      <PageHead photo={media(loc.img)}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{raw.city ? t('car.title', { city: i.L(loc.name) }) : t('car.land.t')}</h1>
            <p className="mt-1 text-sm text-muted">{raw.city ? `${i.date(q.pick, { weekday: true })} ${q.pt} – ${i.date(q.drop, { weekday: true })} ${q.dt} · ${dl}` : t('car.land.s')}</p>
          </div>
          {raw.city && <button type="button" onClick={() => setEditing(!editing)} aria-expanded={editing} className="btn-ghost px-4 py-2 text-sm"><Icon name={editing ? 'close' : 'edit'} className="size-4" />{editing ? t('close') : t('car.change')}</button>}
        </div>
        {editing && <div className="mt-5 animate-fade"><CarForm initial={raw.city ? carParams(q) : {}} onDone={() => setEditing(false)} /></div>}
        <div className="mt-6"><Stepper steps={bookingSteps(t)} current={0} /></div>
      </PageHead>

      <div className="container-x py-8">
        <div className="mb-5 grid gap-3">
          <div role="group" aria-label={t('car.f.cat')} className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
            {chip(!st.cat, t('car.f.all'), () => update({ cat: '' }))}
            {[...new Set(all.map((c) => c.id))].map((id) => chip(st.cat === id, i.L(CATS[id]), () => update({ cat: st.cat === id ? '' : id })))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="me-1 text-xs font-semibold text-muted">{t('car.f.trans')}</span>
              {chip(st.tr === 'auto', t('car.auto'), () => update({ tr: st.tr === 'auto' ? '' : 'auto' }))}
              {chip(st.tr === 'manual', t('car.manual'), () => update({ tr: st.tr === 'manual' ? '' : 'manual' }))}
              <span className="ms-3 me-1 text-xs font-semibold text-muted">{t('car.f.seats')}</span>
              {chip(st.seats === '7', t('car.f.seats7'), () => update({ seats: st.seats ? '' : '7' }))}
            </div>
            <div role="group" aria-label={t('car.sort')} className="inline-flex rounded-md bg-mist p-1">
              {SORTS.map((s) => <button key={s} type="button" aria-pressed={st.sort === s} onClick={() => update({ sort: s })} className={`rounded px-4 py-1.5 text-sm font-semibold transition ${st.sort === s ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'}`}>{t(`car.s.${s}`)}</button>)}
            </div>
          </div>
          {!busy && <p className="text-sm text-muted" aria-live="polite">{shown.length === 1 ? t('car.found1') : t('car.foundN', { n: shown.length })}</p>}
        </div>

        {busy ? (
          <div role="status" className="grid gap-3"><span className="sr-only">{t('car.loading')}</span>{[0, 1, 2].map((k) => <div key={k} className="h-44 animate-pulse rounded-lg bg-mist" />)}</div>
        ) : shown.length ? (
          <div className="grid gap-3">
            {shown.map((c) => (
              <button key={c.id} type="button" onClick={() => setOpen(c.id)} className="card card-hover grid w-full overflow-hidden text-start sm:grid-cols-[240px_1fr_auto]">
                <Photo id={c.photo} w={600} alt="" className="h-44 w-full sm:h-full sm:min-h-44" />
                <span className="block p-5">
                  <span className="block text-xs font-medium text-brand">{i.L(CATS[c.id])}</span>
                  <span className="mt-1 block text-lg font-bold">{i.L(c.name)}</span>
                  <span className="mt-3 block"><Specs c={c} /></span>
                  <span className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                    <span className="rounded-md border border-line px-2 py-1">{i.L(c.supplier)}</span>
                    <span className="text-emerald-700">{t('car.freeCancel')}</span>
                  </span>
                </span>
                <span className="flex items-center justify-between gap-4 border-t border-line p-5 sm:w-52 sm:flex-col sm:items-end sm:justify-center sm:border-t-0 sm:border-s">
                  <span className="sm:text-end"><span className="block text-xl font-bold"><Ltr>{i.money(c.daily * days)}</Ltr></span>
                    <span className="text-xs text-muted">{t('car.forDays', { days: dl })} · {t('car.perDay', { amount: i.money(c.daily) })}</span></span>
                  <span className="btn-primary px-6 py-2.5 text-sm">{t('car.select')}</span>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="card p-10 text-center"><h2 className="font-bold">{t('car.none')}</h2>
            <button type="button" onClick={() => update({ cat: '', tr: '', seats: '' })} className="btn-ghost mt-4 px-5 py-2 text-sm">{t('car.f.clear')}</button></div>
        )}
      </div>
      <CarDetails c={all.find((c) => c.id === open)} q={q} days={days} onClose={() => setOpen(null)} />
    </>
  )
}
