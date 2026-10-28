import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import Icon from '../Icon'
import Combobox from '../Combobox'
import { addDaysIso, useI18n } from '../../lib/i18n'
import { store } from '../../lib/store'
import { AIRPORTS, CABINS, IRAQ, airport, norm, parse, qs, searchParams, tomorrow, travText } from './engine'
import { INBOUND_FROM } from './world'

export const control = 'w-full min-w-0 appearance-none bg-transparent pt-0.5 text-[14px] sm:text-[15px] font-semibold text-ink outline-none'

/** Labelled box in Layth's search-field style. */
export function Field({ label, icon, children, className = '', as: Tag = 'label', ...rest }) {
  return (
    <Tag className={`block rounded-md border border-line bg-white px-4 pt-2.5 pb-2 transition focus-within:border-ink hover:border-ink/40 ${className}`} {...rest}>
      <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted"><Icon name={icon} className="size-3.5" /> {label}</span>
      {children}
    </Tag>
  )
}

/** − n + for one traveller type. */
export function Counter({ label, sub, value, min = 0, max = 9, onChange }) {
  const { t } = useI18n()
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span><span className="block text-sm font-semibold">{label}</span>{sub && <span className="text-xs text-muted">{sub}</span>}</span>
      <span className="flex items-center gap-3">
        <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`${t('fl.less')}: ${label}`} className="grid size-8 place-items-center rounded-md border border-line hover:border-ink disabled:opacity-40"><Icon name="minus" className="size-4" /></button>
        <output className="w-5 text-center font-semibold" dir="ltr">{value}</output>
        <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`${t('fl.more')}: ${label}`} className="grid size-8 place-items-center rounded-md border border-line hover:border-ink disabled:opacity-40"><Icon name="plus" className="size-4" /></button>
      </span>
    </div>
  )
}

/** A field that opens a small panel (travellers). Closes on outside click and Escape. */
export function Popover({ label, icon, value, children }) {
  const [open, setOpen] = useState(false)
  const box = useRef(null)
  useEffect(() => {
    if (!open) return undefined
    const out = (e) => { if (!box.current?.contains(e.target)) setOpen(false) }
    const key = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', out); document.addEventListener('keydown', key)
    return () => { document.removeEventListener('pointerdown', out); document.removeEventListener('keydown', key) }
  }, [open])
  return (
    <div ref={box} className="relative">
      <Field as="button" type="button" label={label} icon={icon} aria-expanded={open} onClick={() => setOpen(!open)} className="w-full text-start">
        <span className={`${control} block truncate`}>{value}</span>
      </Field>
      {open && (
        <div role="dialog" aria-label={label} className="absolute inset-x-0 top-full z-40 mt-1 min-w-72 animate-fade rounded-md border border-line bg-white p-4 shadow-[0_24px_50px_-28px_rgba(11,18,32,.45)] sm:inset-x-auto sm:end-0">
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  )
}

const option = (L) => (c) => { const a = airport(c); return { value: c, code: c, title: L(a.city), sub: L(a.country) } }
export const airportOptions = (L) => [...IRAQ, ...AIRPORTS.map((a) => a.code).filter((c) => !IRAQ.includes(c))].map(option(L))

/** Last search, if its dates are still ahead. Inbound (visitors) keeps its own memory and defaults (Istanbul → Baghdad). */
function defaults(initial = {}, inbound = false) {
  const last = store.get(inbound ? 'fl-in-last' : 'fl-last', null)
  const base = initial.from || initial.to ? initial : last && last.d1 && parse(last.d1) >= parse(tomorrow()) ? last : {}
  const q = norm({ ...(inbound ? { from: 'IST', to: 'BGW' } : {}), ...base, to: initial.to || base.to || (inbound ? 'BGW' : undefined) })
  if (inbound) { if (!INBOUND_FROM.includes(q.from)) q.from = 'IST'; if (!IRAQ.includes(q.to)) q.to = 'BGW' }
  return q
}

/** Flights search. Navigates to /flights/results; `onDone` runs after submit (close an inline editor).
    `inbound`: "Flights to Iraq" (from abroad to an Iraqi airport). `bare`: no own card frame (inside SearchTabs). */
export default function FlightForm({ initial, onDone, inbound = false, bare = false }) {
  const i = useI18n(); const { t } = i
  const go = useNavigate()
  const [f, setF] = useState(() => defaults(initial, inbound))
  const [err, setErr] = useState('')
  const set = (patch) => setF((x) => ({ ...x, ...patch }))
  const all = airportOptions(i.L)
  const fromOpts = inbound ? INBOUND_FROM.filter((c) => airport(c)).map(option(i.L)) : all
  const toOpts = inbound ? IRAQ.map(option(i.L)) : all
  const rt = f.trip === 'rt'

  const submit = (e) => {
    e.preventDefault()
    if (f.from === f.to) return setErr(t('fl.same'))
    setErr('')
    const next = norm({ ...f, inf: Math.min(f.inf, f.ad) })
    store.set(inbound ? 'fl-in-last' : 'fl-last', next)
    onDone?.()
    go(`/flights/results?${qs(searchParams(next))}`)
  }

  return (
    <form onSubmit={submit} noValidate className={`space-y-3 text-ink ${bare ? '' : 'rounded-lg border border-line bg-white p-4 sm:p-5'}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label={t('fl.tab')} className="inline-flex rounded-md bg-mist p-1">
          {['rt', 'ow'].map((v) => (
            <button key={v} type="button" aria-pressed={f.trip === v} onClick={() => set({ trip: v, d2: v === 'rt' ? (f.d2 && f.d2 > f.d1 ? f.d2 : addDaysIso(f.d1, 7)) : f.d2 })}
              className={`rounded px-4 py-1.5 text-sm font-semibold transition ${f.trip === v ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'}`}>{t(`fl.${v}`)}</button>
          ))}
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink/80">
          <input type="checkbox" checked={!!f.direct} onChange={(e) => set({ direct: e.target.checked ? '1' : '' })} className="size-4 accent-[var(--color-brand)]" />{t('fl.directOnly')}
        </label>
      </div>

      <div className="grid gap-3 lg:grid-cols-[2fr_1.3fr_1fr_auto]">
        <div className="relative grid gap-3 sm:grid-cols-2">
          <Combobox label={inbound ? t('fl.in.from') : t('fl.from')} icon="plane" value={f.from} onChange={(v) => set({ from: v })} options={fromOpts.filter((o) => o.value !== f.to)} placeholder={t('fl.cityPh')} />
          {!inbound && <button type="button" onClick={() => set({ from: f.to, to: f.from })} aria-label={t('fl.swap')}
            className="absolute top-1/2 left-1/2 z-10 hidden size-9 -translate-1/2 place-items-center rounded-md border border-line bg-white text-brand transition hover:rotate-180 sm:grid">
            <Icon name="swap" className="size-4" />
          </button>}
          <Combobox label={inbound ? t('fl.in.to') : t('fl.to')} icon="pin" value={f.to} onChange={(v) => set({ to: v })} options={toOpts.filter((o) => o.value !== f.from)} placeholder={t('fl.cityPh')} />
        </div>
        <div className={`grid gap-3 ${rt ? 'grid-cols-2' : ''}`}>
          <Field label={t('fl.date')} icon="calendar">
            <input type="date" className={control} value={f.d1} min={tomorrow()} required
              onChange={(e) => { const d1 = e.target.value; if (d1) set({ d1, d2: rt && (!f.d2 || f.d2 <= d1) ? addDaysIso(d1, 7) : f.d2 }) }} />
          </Field>
          {rt && <Field label={t('fl.ret')} icon="calendar">
            <input type="date" className={control} value={f.d2} min={addDaysIso(f.d1, 1)} required onChange={(e) => e.target.value && set({ d2: e.target.value })} />
          </Field>}
        </div>
        <Popover label={t('fl.who')} icon="users" value={`${travText(f, i)} · ${t(`fl.cab.${f.cabin}`)}`}>
          {(close) => (
            <div>
              <Counter label={t('fl.adult')} sub={t('fl.adultS')} value={f.ad} min={1} max={9} onChange={(v) => set({ ad: v, inf: Math.min(f.inf, v) })} />
              <Counter label={t('fl.child')} sub={t('fl.childS')} value={f.ch} max={8} onChange={(v) => set({ ch: v })} />
              <Counter label={t('fl.infant')} sub={t('fl.infantS')} value={f.inf} max={Math.min(4, f.ad)} onChange={(v) => set({ inf: v })} />
              <label className="label mt-3" htmlFor="fl-cabin">{t('fl.cabin')}</label>
              <select id="fl-cabin" className="field py-2.5" value={f.cabin} onChange={(e) => set({ cabin: e.target.value })}>
                {CABINS.map((c) => <option key={c} value={c}>{t(`fl.cab.${c}`)}</option>)}
              </select>
              <button type="button" onClick={close} className="btn-ghost mt-4 w-full py-2.5 text-sm">{t('fl.done')}</button>
            </div>
          )}
        </Popover>
        <button className="btn-primary min-h-14 w-full px-8 text-base lg:w-auto"><Icon name="search" className="size-5" />{t('fl.go')}</button>
      </div>
      {err && <p role="alert" className="text-sm font-medium text-red-600">{err}</p>}
    </form>
  )
}
