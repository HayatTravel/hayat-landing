import { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router'
import { PageHead } from '../components/Layout'
import Icon from '../components/Icon'
import { Ltr } from '../components/ui'
import { Logo } from '../components/flights/parts'
import { BookingLookup, FlightMap, OtherFlight, Pill } from '../components/flights/Status'
import { airlineName, clock, place } from '../components/flights/engine'
import { flightOf, packageFlight } from '../components/docs/index'
import { useI18n } from '../lib/i18n'
import { openSignIn, trips, useStore } from '../lib/store'
import { follow, forBooking, statusAt } from '../lib/providers/flightStatus'

const T = ({ m, className = '' }) => { const c = clock(m); return <Ltr className={className}>{c.hm}{c.day ? <sup className="ms-0.5 text-[10px]">{c.day > 0 ? '+' : ''}{c.day}</sup> : null}</Ltr> }
const useNow = (ms = 30000) => { const [n, setN] = useState(Date.now()); useEffect(() => { const x = setInterval(() => setN(Date.now()), ms); return () => clearInterval(x) }, [ms]); return n }
const legsOf = (b) => (b.type === 'flight' ? flightOf(b) : b.type === 'package' ? packageFlight(b) : null)
const FLIGHT_TYPES = ['flight', 'package']

function End({ f, side }) {
  const i = useI18n(); const { t } = i
  const dep = side === 'dep'
  const code = dep ? f.from : f.to
  const sch = dep ? f.sched.dep : f.sched.arr; const est = dep ? f.est.dep : f.est.arr
  const done = dep ? ['departed', 'air', 'landed'].includes(f.status) : f.status === 'landed'
  return (
    <div className={dep ? '' : 'sm:text-end'}>
      <p className="text-xs font-semibold text-muted">{t(dep ? 'fs.dep' : 'fs.arr')}</p>
      <p className="mt-1 text-3xl font-bold" dir="ltr">{code}</p>
      <p className="text-sm text-muted">{place(code, i.L)}</p>
      <dl className={`mt-3 grid gap-1 text-sm ${dep ? '' : 'sm:justify-items-end'}`}>
        <div className="flex gap-2"><dt className="text-muted">{t('fs.sched')}</dt><dd className={`font-semibold ${f.delay ? 'line-through decoration-ink/30' : ''}`}><T m={sch} /></dd></div>
        {f.status !== 'cancelled' && (f.delay > 0 || done) && <div className="flex gap-2"><dt className="text-muted">{t(done ? 'fs.actual' : 'fs.est')}</dt><dd className={`font-bold ${f.delay ? 'text-amber-700' : ''}`}><T m={est} /></dd></div>}
        <div className="flex gap-2"><dt className="text-muted">{t('fs.terminal')}</dt><dd className="font-semibold"><Ltr>{dep ? f.terminal.dep : f.terminal.arr}</Ltr></dd>
          {dep && <><dt className="ms-2 text-muted">{t('fs.gate')}</dt><dd className="font-semibold"><Ltr>{f.gate}</Ltr></dd></>}</div>
      </dl>
    </div>
  )
}

/** One flight segment of a Hayat booking: status, times, progress, live map, follow. */
function Leg({ f0, onToast }) {
  const i = useI18n(); const { t } = i
  const now = useNow()
  const f = statusAt(f0, now)
  const pct = Math.round(f.progress * 100)
  const left = Math.max(0, Math.round(f.dur * (1 - f.progress)))
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3"><Logo c={f.carrier} className="h-7 w-16" />
            <div><p className="text-xl font-bold"><Ltr>{f.flight}</Ltr></p><p className="text-sm text-muted">{airlineName(f.carrier, i.L)} · {i.date(f.date, { weekday: true })}</p></div></div>
          <Pill s={f.status} />
        </div>
        {f.delay > 0 && f.status !== 'landed' && <p className="mt-3 text-sm font-semibold text-amber-700">{t('fs.delayBy', { time: i.dur(f.delay) })}</p>}
        <div className="mt-6 grid gap-6 sm:grid-cols-2"><End f={f} side="dep" /><End f={f} side="arr" /></div>
        <div className="mt-6">
          <div className="relative h-2 rounded-full bg-mist" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={t('fs.flown', { pct })}>
            <span className="absolute inset-y-0 start-0 rounded-full bg-brand transition-[width] duration-1000" style={{ width: `${pct}%` }} />
            <span className="absolute top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-brand ltr:-translate-x-1/2 rtl:translate-x-1/2" style={{ insetInlineStart: `${pct}%` }}>
              <Icon name="plane" className="size-3.5 rtl:-scale-x-100" /></span>
          </div>
          <p className="mt-3 flex justify-between text-xs text-muted"><span>{t('fs.flown', { pct })}</span>{f.status === 'air' && <span>{t('fs.left', { time: i.dur(left) })}</span>}</p>
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4 text-sm">
          <div><dt className="text-xs text-muted">{t('fs.aircraft')}</dt><dd className="font-semibold"><Ltr>{f.aircraft}</Ltr></dd></div>
          <div><dt className="text-xs text-muted">{t('fs.dur')}</dt><dd className="font-semibold">{i.dur(f.dur)}</dd></div>
        </dl>
        <button type="button" onClick={async () => { await follow({ ref: f.ref, flight: f.flight }); onToast(t('fs.followed')) }} className="btn-primary mt-6 px-5 py-2.5 text-sm"><Icon name="bell" className="size-4" />{t('fs.follow')}</button>
      </section>
      <section className="card p-6">
        <h3 className="mb-3 flex items-center gap-2 font-bold"><Icon name="map" className="size-4 text-muted" />{t('fs.map')}</h3>
        <FlightMap from={f.from} to={f.to} progress={f.progress} status={f.status} />
        <p className="mt-3 text-xs text-muted">{t('fs.mapNote')}</p>
      </section>
    </div>
  )
}

/** All flight segments of one booking. */
function BookingFlights({ b, onToast }) {
  const { t } = useI18n()
  const [legs, setLegs] = useState(null)
  useEffect(() => { let live = true; forBooking(b, legsOf).then((r) => live && setLegs(r)); return () => { live = false } }, [b.ref])
  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-bold">{t('fs.mine.bk', { ref: '' })}<Ltr className="font-mono">{b.ref}</Ltr> · <span className="font-normal text-muted">{b.title}</span></h3>
        <Link to={`/trips/${b.ref}`} className="text-sm font-semibold text-brand">{t('fs.mine.open')}</Link>
      </div>
      {!legs ? <p role="status" className="card p-6 text-center text-sm text-muted">{t('fs.loading')}</p>
        : legs.length ? legs.map((f) => <Leg key={f.id} f0={f} onToast={onToast} />)
          : <p className="card p-6 text-center text-sm text-muted">{t('fs.lookup.noFlights')}</p>}
    </section>
  )
}

/** /flight-status (?booking=REF from My trips): status of Hayat bookings; other flights link out to free sources. */
export default function FlightStatus() {
  useStore()
  const { t } = useI18n()
  const [sp] = useSearchParams()
  const loc = useLocation()
  const [found, setFound] = useState(() => trips.find(loc.state?.ref || sp.get('booking') || ''))
  useEffect(() => { const b = trips.find(loc.state?.ref || sp.get('booking') || ''); if (b) setFound(b) }, [loc.key]) // eslint-disable-line react-hooks/exhaustive-deps
  const [toast, setToast] = useState('')
  useEffect(() => { if (!toast) return undefined; const x = setTimeout(() => setToast(''), 2600); return () => clearTimeout(x) }, [toast])
  const mine = trips.list().filter((b) => FLIGHT_TYPES.includes(b.type) && b.status !== 'cancelled' && b.ref !== found?.ref)

  return (
    <>
      <PageHead>
        <h1 className="text-3xl font-bold sm:text-4xl">{t('fs.title')}</h1>
        <p className="mt-2 max-w-2xl text-muted">{t('fs.sub')}</p>
        <div className="mt-8"><BookingLookup onFound={setFound} /></div>
      </PageHead>
      <div className="container-x grid gap-10 py-10">
        {found && <BookingFlights b={found} onToast={setToast} />}
        {(mine.length > 0 || !found) && <section className="grid gap-6">
          <h2 className="text-xl font-bold">{t('fs.mine.t')}</h2>
          {mine.length ? mine.map((b) => <BookingFlights key={b.ref} b={b} onToast={setToast} />) : !found && (
            <div className="card flex flex-wrap items-center justify-between gap-4 p-6">
              <p className="text-sm text-ink/80">{t('fs.mine.none')}</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => openSignIn()} className="btn-primary px-5 py-2.5 text-sm"><Icon name="user" className="size-4" />{t('nav.signin')}</button>
                <Link to="/trips" className="btn-ghost px-5 py-2.5 text-sm">{t('fs.lookup.t')}</Link>
              </div>
            </div>
          )}
        </section>}
        <OtherFlight />
        <p className="text-xs text-muted">{t('fs.source')}</p>
      </div>
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex justify-center px-4 print:hidden">
        {toast && <p className="animate-rise rounded-md bg-ink px-4 py-3 text-sm text-white shadow-xl">{toast}</p>}
      </div>
    </>
  )
}
