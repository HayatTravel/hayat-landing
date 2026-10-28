import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { PageHead } from '../components/Layout'
import Icon from '../components/Icon'
import { Ltr } from '../components/ui'
import { Logo } from '../components/flights/parts'
import { FlightMap, RecentSearches, StatusForm, remember, statusHref } from '../components/flights/Status'
import { airlineName, clock, place } from '../components/flights/engine'
import { inDays, useI18n } from '../lib/i18n'
import { findByNumber, findByRoute, follow, parseFlight, statusAt } from '../lib/providers/flightStatus'

const TONE = {
  scheduled: 'bg-mist text-ink/75', boarding: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200', departed: 'bg-brand/10 text-brand', air: 'bg-brand/10 text-brand',
  landed: 'bg-emerald-50 text-emerald-800', delayed: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200', cancelled: 'bg-red-50 text-red-700',
}
export const Pill = ({ s }) => { const { t } = useI18n(); return <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold ${TONE[s]}`}>{(s === 'air' || s === 'boarding') && <span className="size-1.5 rounded-full bg-current" />}{t(`fs.s.${s}`)}</span> }
const T = ({ m, className = '' }) => { const c = clock(m); return <Ltr className={className}>{c.hm}{c.day ? <sup className="ms-0.5 text-[10px]">{c.day > 0 ? '+' : ''}{c.day}</sup> : null}</Ltr> }
const useNow = (ms = 30000) => { const [n, setN] = useState(Date.now()); useEffect(() => { const x = setInterval(() => setN(Date.now()), ms); return () => clearInterval(x) }, [ms]); return n }

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

function Result({ f0, onToast }) {
  const i = useI18n(); const { t } = i
  const now = useNow()
  const f = statusAt(f0, now)
  const pct = Math.round(f.progress * 100)
  const left = Math.max(0, Math.round(f.dur * (1 - f.progress)))
  const share = async () => {
    const url = location.href
    try { if (navigator.share) await navigator.share({ title: `${f.flight} · ${t(`fs.s.${f.status}`)}`, url }); else { await navigator.clipboard.writeText(url); onToast(t('fs.copied')) } } catch { /* dismissed */ }
  }
  const hhmm = (ms) => { const d = new Date(ms); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` }
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
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
            <span className="absolute top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-brand transition-[inset-inline-start] duration-1000 ltr:-translate-x-1/2 rtl:translate-x-1/2" style={{ insetInlineStart: `${pct}%` }}>
              <Icon name="plane" className="size-3.5 rtl:-scale-x-100" /></span>
          </div>
          <p className="mt-3 flex justify-between text-xs text-muted"><span>{t('fs.flown', { pct })}</span>{f.status === 'air' && <span>{t('fs.left', { time: i.dur(left) })}</span>}</p>
        </div>
        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4 text-sm">
          <div><dt className="text-xs text-muted">{t('fs.aircraft')}</dt><dd className="font-semibold"><Ltr>{f.aircraft}</Ltr></dd></div>
          <div><dt className="text-xs text-muted">{t('fs.dur')}</dt><dd className="font-semibold">{i.dur(f.dur)}</dd></div>
        </dl>
        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" onClick={async () => { await follow({ flight: f.flight, date: f.date }); onToast(t('fs.followed')) }} className="btn-primary px-5 py-2.5 text-sm"><Icon name="bell" className="size-4" />{t('fs.follow')}</button>
          <button type="button" onClick={share} className="btn-ghost px-5 py-2.5 text-sm"><Icon name="send" className="size-4" />{t('fs.share')}</button>
        </div>
        <p className="mt-4 text-xs text-muted">{t('fs.updated', { time: hhmm(now) })}</p>
      </section>
      <section className="card p-6">
        <h2 className="mb-3 flex items-center gap-2 font-bold"><Icon name="map" className="size-4 text-muted" />{t('fs.map')}</h2>
        <FlightMap from={f.from} to={f.to} progress={f.progress} status={f.status} />
        <p className="mt-3 text-xs text-muted">{t('fs.mapNote')}</p>
      </section>
    </div>
  )
}

function DayList({ list }) {
  const i = useI18n(); const { t } = i
  const now = useNow()
  return (
    <ul className="grid gap-2">
      {list.map((f0) => {
        const f = statusAt(f0, now)
        return (
          <li key={f.id}>
            <Link to={statusHref({ flight: f.flight.replace(' ', ''), date: f.date })} onClick={() => remember({ flight: f.flight.replace(' ', ''), date: f.date })}
              className="card card-hover grid grid-cols-[auto_1fr_auto] items-center gap-4 p-4">
              <Logo c={f.carrier} className="h-6 w-14" />
              <span className="grid gap-0.5">
                <span className="font-semibold"><Ltr>{f.flight}</Ltr> · {airlineName(f.carrier, i.L)}</span>
                <span className="text-sm text-muted"><T m={f.est.dep} /> <Ltr>{f.from}</Ltr> – <T m={f.est.arr} /> <Ltr>{f.to}</Ltr>{f.via ? ` · ${t('fs.via', { city: place(f.via, i.L) })}` : ''}</span>
              </span>
              <Pill s={f.status} />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

/** /flight-status?flight=IA233&date=  or  ?from=BGW&to=IST&date= */
export default function FlightStatus() {
  const i = useI18n(); const { t } = i
  const [sp] = useSearchParams()
  const q = Object.fromEntries(sp)
  const date = /^\d{4}-\d{2}-\d{2}$/.test(q.date || '') ? q.date : inDays(0)
  const key = `${q.flight || ''}|${q.from || ''}|${q.to || ''}|${date}`
  const [state, setState] = useState({ key: '', busy: false, one: null, list: null })
  const [toast, setToast] = useState('')
  useEffect(() => {
    let live = true
    if (!q.flight && !(q.from && q.to)) { setState({ key, busy: false, one: null, list: null }); return undefined }
    setState({ key, busy: true, one: null, list: null })
    const job = q.flight ? findByNumber({ flight: q.flight, date }).then((one) => ({ one })) : findByRoute({ from: q.from, to: q.to, date }).then((list) => ({ list }))
    job.then((r) => live && setState({ key, busy: false, one: null, list: null, ...r }))
    return () => { live = false }
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (!toast) return undefined; const x = setTimeout(() => setToast(''), 2600); return () => clearTimeout(x) }, [toast])
  const searched = !!(q.flight || (q.from && q.to))
  const p = parseFlight(q.flight)

  return (
    <>
      <PageHead>
        <h1 className="text-3xl font-bold sm:text-4xl">{t('fs.title')}</h1>
        <p className="mt-2 max-w-2xl text-muted">{t('fs.sub')}</p>
        <div className="mt-8"><StatusForm key={key} initial={{ ...q, flight: p ? `${p.carrier} ${p.number}` : q.flight, date }} /></div>
      </PageHead>
      <div className="container-x grid gap-6 py-10">
        <RecentSearches />
        {searched && state.busy && <p role="status" className="card p-8 text-center text-sm text-muted">{t('fs.loading')}</p>}
        {searched && !state.busy && q.flight && (state.one ? <Result f0={state.one} onToast={setToast} />
          : <div className="card p-10 text-center"><h2 className="text-lg font-bold">{t('fs.notFound')}</h2><p className="mt-1 text-sm text-muted">{t('fs.notFoundD')}</p></div>)}
        {searched && !state.busy && !q.flight && state.list && (
          <section><h2 className="mb-3 font-bold">{t('fs.dayList', { date: i.date(date, { weekday: true }) })} · {place(q.from, i.L)} – {place(q.to, i.L)}</h2>
            {state.list.length ? <DayList list={state.list} /> : <p className="card p-8 text-center text-sm text-muted">{t('fs.noRoute')}</p>}</section>
        )}
        <p className="text-xs text-muted">{t('fs.source')}</p>
      </div>
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex justify-center px-4 print:hidden">
        {toast && <p className="animate-rise rounded-md bg-ink px-4 py-3 text-sm text-white shadow-xl">{toast}</p>}
      </div>
    </>
  )
}
