import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import Icon from '../Icon'
import { Ltr } from '../ui'
import { useI18n } from '../../lib/i18n'
import { media } from '../../data/catalog'
import { BOARD_IC, FACT_IC, INC_IC, cityBy, depDates, freeUntil, minPP, plural, scoreWord, withQs } from './lib'

/* Small building blocks for hotels and holidays, in Layth's visual language (white cards, 6px corners). */

export const control = 'w-full appearance-none bg-transparent pt-0.5 text-[15px] font-semibold text-ink outline-none'

/** Labelled box in the search-field style. */
export function Field({ label, icon, children, className = '', as: Tag = 'label', ...rest }) {
  return (
    <Tag className={`block rounded-md border border-line bg-white px-4 pt-2.5 pb-2 transition focus-within:border-ink hover:border-ink/40 ${className}`} {...rest}>
      <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted"><Icon name={icon} className="size-3.5" /> {label}</span>
      {children}
    </Tag>
  )
}

/** − n + for one count (rooms, adults, children). */
export function Counter({ label, sub, value, min = 0, max = 9, onChange }) {
  const { t } = useI18n()
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span><span className="block text-sm font-semibold">{label}</span>{sub && <span className="text-xs text-muted">{sub}</span>}</span>
      <span className="flex items-center gap-3">
        <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={t('st.dec', { what: label })} className="grid size-8 place-items-center rounded-md border border-line hover:border-ink disabled:opacity-40"><Icon name="minus" className="size-4" /></button>
        <output className="w-5 text-center font-semibold" dir="ltr" aria-live="polite">{value}</output>
        <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={t('st.inc', { what: label })} className="grid size-8 place-items-center rounded-md border border-line hover:border-ink disabled:opacity-40"><Icon name="plus" className="size-4" /></button>
      </span>
    </div>
  )
}

/** A field that opens a small panel. Closes on outside click and Escape. */
export function Popover({ label, icon, value, children, className = '' }) {
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
    <div ref={box} className={`relative ${className}`}>
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

export function HStars({ n, className = 'size-3.5' }) {
  const { t } = useI18n()
  return (
    <span className="inline-flex text-amber-400" role="img" aria-label={t('stars', { n })}>
      {Array.from({ length: n }, (_, k) => <Icon key={k} name="star" className={className} fill="currentColor" strokeWidth={0} />)}
    </span>
  )
}

/** "8.9  Very good" */
export function Score({ s }) {
  const i = useI18n()
  return (
    <span className="inline-flex shrink-0 items-center gap-2">
      <Ltr className="grid h-8 min-w-10 place-items-center rounded-md rounded-es-sm bg-ink px-1.5 text-sm font-bold text-white">{s.toFixed(1)}</Ltr>
      <span className="text-sm font-semibold text-ink/75">{scoreWord(i, s)}</span>
    </span>
  )
}

export function Facts({ keys, className = '' }) {
  const { t } = useI18n()
  return (
    <ul className={`flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-ink/75 ${className}`}>
      {keys.map((k) => <li key={k} className="flex items-center gap-1.5"><Icon name={FACT_IC[k] || 'check'} className="size-4 text-muted" />{t(`ht.f.${k}`)}</li>)}
    </ul>
  )
}

export function BoardLine({ code }) {
  const { t } = useI18n()
  return <span className="flex items-center gap-1.5"><Icon name={BOARD_IC[code] || 'bed'} className="size-4 shrink-0 text-muted" />{t(`ht.board.${code}`)}</span>
}

export function CancelLine({ room, inIso }) {
  const i = useI18n()
  const d = freeUntil(room, inIso)
  return d
    ? <span className="flex items-center gap-1.5 text-emerald-700"><Icon name="check" className="size-4 shrink-0" />{i.t('ht.freeUntil', { date: i.date(d) })}</span>
    : <span className="flex items-center gap-1.5"><Icon name="info" className="size-4 shrink-0 text-muted" />{i.t('ht.freeGone')}</span>
}

/** "From $74 / per night" */
export function PriceFrom({ usd, unit, align = 'end' }) {
  const i = useI18n()
  return (
    <span className={`flex flex-col leading-tight ${align === 'end' ? 'items-end text-end' : 'items-start text-start'}`}>
      <span className="text-xs text-muted">{i.t('st.from')}</span>
      <span className="text-xl font-bold text-ink"><Ltr>{i.money(usd)}</Ltr></span>
      <span className="text-xs text-muted">{unit}</span>
    </span>
  )
}

export function FlightBadge({ p, dark }) {
  const { t } = useI18n()
  const charter = p.flight === 'charter'
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ${charter ? 'bg-ink text-white' : dark ? 'bg-white/10 text-white' : 'bg-white text-ink ring-1 ring-line'}`}>
      <Icon name="plane" className="size-3.5" />{t(`pk.flight.${p.flight}`)}
    </span>
  )
}

/** Holiday card: photo, city · nights, title, what's included, next departure, from price. */
export function PkgCard({ p, query = {}, month = '' }) {
  const i = useI18n(); const { t } = i
  const c = cityBy(p.city); const deps = depDates(p)
  const next = (month && deps.find((d) => d.startsWith(month))) || deps[0]
  return (
    <Link to={withQs(`/holidays/${p.id}`, { ad: query.ad, ch: query.ch, dep: month ? next : '' })} className="card card-hover group flex flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-mist">
        <img src={media(p.img)} alt="" loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-105" />
        <span className="absolute top-3 start-3"><FlightBadge p={p} /></span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-sm text-muted">{i.L(c?.name)} · {plural(i, 'st.nights', p.nights)}</p>
        <h3 className="text-lg font-bold leading-snug">{i.L(p.title)}</h3>
        <ul className="mt-1 flex flex-wrap gap-1.5" aria-label={t('pk.incL')}>
          {p.includes.map((k) => (
            <li key={k} title={t(`pk.inc.${k}`)} className="grid size-8 place-items-center rounded-md bg-mist text-ink/70">
              <Icon name={INC_IC[k] || 'check'} className="size-4" /><span className="sr-only">{t(`pk.inc.${k}`)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4">
          <span className="text-xs text-muted">{t('pk.next', { date: i.date(next) })}</span>
          <PriceFrom usd={minPP(p)} unit={t('pk.perPerson')} />
        </div>
      </div>
    </Link>
  )
}
