import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { PageHead } from '../components/Layout'
import Icon from '../components/Icon'
import { Ltr, Stepper } from '../components/ui'
import FlightForm from '../components/flights/FlightForm'
import { FlightDetails, Logo, ResultCard, RouteLoader } from '../components/flights/parts'
import {
  BANDS, airlineName, cheapest, daysFromToday, nextCharterDate, norm, parse, qs, routeTitle, searchFlights, searchParams, tomorrow, paxText,
} from '../components/flights/engine'
import { addDaysIso, useI18n } from '../lib/i18n'
import { bookingSteps } from './Checkout'

const csv = (s) => (s ? String(s).split(',').filter(Boolean) : [])
const SORTS = ['cheap', 'fast', 'early']
const cmp = { cheap: (a, b) => a.from - b.from || a.total - b.total, fast: (a, b) => a.total - b.total || a.from - b.from, early: (a, b) => a.dep - b.dep }

function Box({ checked, onChange, children, aside }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-[var(--color-brand)]" />
      <span className="flex flex-1 items-center gap-2">{children}</span>{aside && <span className="text-xs text-muted">{aside}</span>}
    </label>
  )
}

/** /flights/results?from&to&d1&d2&trip=rt|ow&ad&ch&inf&cabin&direct (+ view state sort, stops, tb, air, bag). */
export default function FlightsResults() {
  const i = useI18n(); const { t } = i
  const [sp, setSp] = useSearchParams()
  const go = useNavigate()
  const raw = Object.fromEntries(sp)
  const q = norm(raw)
  const rt = q.trip === 'rt'
  const key = qs(searchParams(q))
  const res = useMemo(() => searchFlights(q), [key]) // eslint-disable-line react-hooks/exhaustive-deps
  const [busy, setBusy] = useState(true)
  useEffect(() => { setBusy(true); const tm = setTimeout(() => setBusy(false), 600); return () => clearTimeout(tm) }, [key])
  const [editing, setEditing] = useState(false)
  const [open, setOpen] = useState(null)
  const [fare, setFare] = useState(null)
  const [how, setHow] = useState('seat')
  const [filtersOpen, setFiltersOpen] = useState(() => typeof matchMedia === 'undefined' || matchMedia('(min-width: 1024px)').matches)

  const all = res.list
  const airlines = [...new Set(all.map((x) => x.carrier))]
  const st = {
    sort: SORTS.includes(raw.sort) ? raw.sort : 'cheap',
    stops: new Set(raw.stops ? csv(raw.stops) : q.direct ? ['0'] : []),
    tb: new Set(csv(raw.tb)), air: new Set(csv(raw.air).filter((c) => airlines.includes(c))), bag: raw.bag === '1',
  }
  const update = (patch) => {
    const s = { ...st, ...patch }
    const view = { sort: s.sort === 'cheap' ? '' : s.sort, stops: [...s.stops].join(',') || (q.direct ? '0,1' : ''), tb: [...s.tb].join(','), air: [...s.air].join(','), bag: s.bag ? '1' : '' }
    setSp(qs({ ...searchParams(q), ...view }), { replace: true, preventScrollReset: true })
  }
  const toggle = (group, v, on) => { const s = new Set(st[group]); on ? s.add(v) : s.delete(v); update({ [group]: s }) }
  const pass = (x) => (!st.stops.size || st.stops.has(String(x.stops)))
    && (!st.tb.size || BANDS.some(([k, a, b]) => st.tb.has(k) && x.dep >= a && x.dep < b))
    && (!st.air.size || st.air.has(x.carrier)) && (!st.bag || x.bagIn)
  const shown = all.filter(pass).sort(cmp[st.sort])
  const minOf = (arr) => (arr.length ? <Ltr>{i.money(Math.min(...arr.map((x) => x.from)))}</Ltr> : null)
  const len = rt ? Math.round((parse(q.d2) - parse(q.d1)) / 864e5) : 0
  const openX = all.find((x) => x.id === open)

  const head = (
    <PageHead>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{routeTitle(q.from, q.to, i)}</h1>
          <p className="mt-1 text-sm text-muted">{i.date(q.d1, { weekday: true })}{rt && ` – ${i.date(q.d2, { weekday: true })}`} · {paxText(q, i)} · {t(`fl.cab.${q.cabin}`)}</p>
        </div>
        <button type="button" onClick={() => setEditing(!editing)} aria-expanded={editing} className="btn-ghost px-4 py-2 text-sm">
          <Icon name={editing ? 'close' : 'edit'} className="size-4" />{editing ? t('close') : t('fl.change')}
        </button>
      </div>
      {editing && <div className="mt-5 animate-fade"><FlightForm initial={searchParams(q)} onDone={() => setEditing(false)} /></div>}
      <div className="mt-6"><Stepper steps={bookingSteps(t)} current={0} /></div>
    </PageHead>
  )
  const emptyBox = (title, body, action) => (
    <div className="container-x py-16 text-center">
      <Icon name="search" className="mx-auto size-9 text-muted" />
      <h2 className="mt-3 text-xl font-bold">{title}</h2>{body && <p className="mt-1 text-muted">{body}</p>}
      <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div>
    </div>
  )
  const changeBtn = (cls = 'btn-primary') => <button type="button" onClick={() => { setEditing(true); scrollTo({ top: 0, behavior: 'smooth' }) }} className={cls}>{t('fl.change')}</button>

  if (!res.ok) return <>{head}{emptyBox(t('fl.none'), t('fl.noneD'), changeBtn())}</>
  if (parse(q.d1) < parse(tomorrow())) return <>{head}{emptyBox(t('fl.past'), '', changeBtn())}</>
  if (!all.length) {
    const ch = res.charterHint
    const d1 = ch && nextCharterDate(ch, Math.max(1, daysFromToday(q.d1)))
    const far = d1 && daysFromToday(d1) > 120
    return <>{head}{emptyBox(t('fl.none'), ch ? t('fl.noneCh', { day: t(`fl.wd${ch.weekday}`) }) : t('fl.noneD'), <>
      {d1 && <Link className="btn-primary" to={`/flights/results?${qs(searchParams({ ...q, cabin: 'economy', d1, d2: rt ? addDaysIso(d1, len || 7) : '' }))}`}>{t('fl.goNext', { date: i.date(d1, { weekday: true, year: far }) })}</Link>}
      {changeBtn(d1 ? 'btn-ghost' : 'btn-primary')}
    </>)}</>
  }

  const days = [-3, -2, -1, 0, 1, 2, 3].map((o) => {
    const d1 = addDaysIso(q.d1, o); const off = parse(d1) < parse(tomorrow())
    return { o, d1, off, p: off ? null : cheapest({ ...q, d1, d2: rt ? addDaysIso(d1, len) : '' }) }
  })

  return (
    <>
      {head}
      <div className="container-x py-8">
        <nav aria-label={t('fl.nearby')} className="mb-6 grid auto-cols-[minmax(6.5rem,1fr)] grid-flow-col gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {days.map((d) => (
            <button key={d.d1} type="button" disabled={d.off} aria-pressed={d.o === 0}
              onClick={() => d.o && go(`/flights/results?${qs({ ...searchParams(q), d1: d.d1, d2: rt ? addDaysIso(d.d1, len) : '' })}`)}
              className={`grid justify-items-center gap-0.5 rounded-md border px-2 py-2.5 text-xs transition disabled:opacity-40 ${d.o === 0 ? 'border-brand bg-brand/5 text-brand shadow-[inset_0_-3px_0_var(--color-brand)]' : 'border-line text-muted hover:border-ink/40'}`}>
              <span>{i.date(d.d1, { weekday: true })}</span>
              <b className={`text-sm ${d.o === 0 ? 'text-brand' : 'text-ink'}`}>{d.p == null ? '—' : <Ltr>{i.money(d.p)}</Ltr>}</b>
            </button>
          ))}
        </nav>

        <div className="grid items-start gap-6 lg:grid-cols-[270px_1fr]">
          <aside className="card lg:sticky lg:top-24">
            <details open={filtersOpen} onToggle={(e) => setFiltersOpen(e.currentTarget.open)}>
              <summary className="flex cursor-pointer list-none items-center gap-2 p-4 font-bold [&::-webkit-details-marker]:hidden">
                <Icon name="filter" className="size-4" /><span className="flex-1">{t('fl.filters')}</span><Icon name="chev" className={`size-4 transition ${filtersOpen ? 'rotate-180' : ''}`} />
              </summary>
              <div className="grid gap-5 border-t border-line p-4">
                <fieldset><legend className="mb-1 text-sm font-bold text-ink/80">{t('fl.f.stops')}</legend>
                  <Box checked={st.stops.has('0')} onChange={(on) => toggle('stops', '0', on)} aside={minOf(all.filter((x) => !x.stops))}>{t('fl.direct')}</Box>
                  <Box checked={st.stops.has('1')} onChange={(on) => toggle('stops', '1', on)} aside={minOf(all.filter((x) => x.stops))}>{t('fl.stop1')}</Box>
                </fieldset>
                <fieldset><legend className="mb-1 text-sm font-bold text-ink/80">{t('fl.f.time')}</legend>
                  {BANDS.map(([k]) => <Box key={k} checked={st.tb.has(k)} onChange={(on) => toggle('tb', k, on)}>{t(`fl.tb.${k}`)}</Box>)}
                </fieldset>
                <fieldset><legend className="mb-1 text-sm font-bold text-ink/80">{t('fl.f.air')}</legend>
                  {airlines.map((c) => <Box key={c} checked={st.air.has(c)} onChange={(on) => toggle('air', c, on)} aside={minOf(all.filter((x) => x.carrier === c))}><Logo c={c} className="h-4 w-9" />{airlineName(c, i.L)}</Box>)}
                </fieldset>
                <fieldset><legend className="mb-1 text-sm font-bold text-ink/80">{t('fl.f.bag')}</legend>
                  <Box checked={st.bag} onChange={(on) => update({ bag: on })}>{t('fl.f.bagIn')}</Box>
                </fieldset>
              </div>
            </details>
          </aside>

          <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted" aria-live="polite">{busy ? '' : shown.length === 1 ? t('fl.found1') : t('fl.foundN', { n: shown.length })}</p>
              <div role="group" aria-label={t('fl.sort')} className="inline-flex rounded-md bg-mist p-1">
                {SORTS.map((s) => (
                  <button key={s} type="button" aria-pressed={st.sort === s} onClick={() => update({ sort: s })}
                    className={`rounded px-4 py-1.5 text-sm font-semibold transition ${st.sort === s ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'}`}>{t(`fl.s.${s}`)}</button>
                ))}
              </div>
            </div>
            {busy ? <RouteLoader from={q.from} to={q.to} /> : shown.length ? (
              <div className="grid gap-3">{shown.map((x) => <ResultCard key={x.id} x={x} q={q} onOpen={(y) => { setFare(y.fares[0].id); setHow('seat'); setOpen(y.id) }} />)}</div>
            ) : (
              <div className="card p-10 text-center">
                <h2 className="font-bold">{t('fl.noMatch')}</h2>
                <button type="button" onClick={() => update({ stops: new Set(q.direct ? ['0', '1'] : []), tb: new Set(), air: new Set(), bag: false })} className="btn-ghost mt-4 px-5 py-2 text-sm">{t('fl.f.clear')}</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <FlightDetails x={openX} q={q} fare={fare} setFare={setFare} how={how} setHow={setHow} onClose={() => setOpen(null)} />
    </>
  )
}
