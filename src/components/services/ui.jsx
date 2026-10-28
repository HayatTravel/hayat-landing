/* Small building blocks for the services pages (visa · eSIM · events · transfers). */
import { Link } from 'react-router'
import Icon from '../Icon'
import { Ltr, Stepper } from '../ui'
import { PageHead } from '../Layout'
import { useI18n } from '../../lib/i18n'
import { openHelp } from '../../lib/store'
import { bookingSteps } from '../../pages/Checkout'
import { KIND_TONE, PURPOSE_ICON, pic } from './data'

/** Forward arrow that follows the reading direction. */
export const Arrow = ({ className = 'size-4' }) => <Icon name="arrow" className={`${className} rtl:-scale-x-100`} />

/** Dark page band: optional back link, booking steps, title and one line of context. */
export function Head({ title, sub, back, backLabel, children }) {
  const { t } = useI18n()
  return (
    <PageHead>
      {back && <Link to={back} className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-white"><Icon name="arrow" className="size-4 ltr:-scale-x-100" /> {backLabel || t('back')}</Link>}
      <Stepper steps={bookingSteps(t)} current={0} />
      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{title}</h1>
      {sub && <p className="mt-2 max-w-2xl text-muted">{sub}</p>}
      {children}
    </PageHead>
  )
}

export function NotFoundHere() {
  const { t } = useI18n()
  return (
    <>
      <PageHead><h1 className="text-3xl font-bold">{t('sv.notFound')}</h1><p className="mt-2 text-muted">{t('nf.body')}</p></PageHead>
      <div className="container-x py-16 text-center"><Link to="/" className="btn-primary">{t('nf.home')}</Link></div>
    </>
  )
}

export function HelpLine({ ctx }) {
  const { t } = useI18n()
  return (
    <button type="button" onClick={() => openHelp(ctx)} className="inline-flex items-center gap-2 py-2 text-sm font-semibold text-brand-600 hover:text-brand">
      <Icon name="chat" className="size-4" />{t('help.line')}
    </button>
  )
}

export function KindBadge({ kind, className = '' }) {
  const { t } = useI18n()
  return <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${KIND_TONE[kind]} ${className}`}>{t(`vi.kind.${kind}`)}</span>
}

export function FromPrice({ usd }) {
  const { t, money } = useI18n()
  return <span className="leading-tight"><span className="block text-xs text-muted">{t('sv.from')}</span><b className="text-lg"><Ltr>{money(usd)}</Ltr></b></span>
}

/** Three key facts in a row (stacked on phones). */
export function Stats({ items }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-3">
      {items.map(([k, v]) => (
        <div key={k} className="rounded-lg border border-line bg-white p-4"><dt className="text-xs text-muted">{k}</dt><dd className="mt-1 font-bold">{v}</dd></div>
      ))}
    </dl>
  )
}

/** Numbered steps. items: [[title, text]] */
export function Steps({ items }) {
  const { num } = useI18n()
  return (
    <ol className="grid gap-5 sm:grid-cols-2">
      {items.map(([title, text], k) => (
        <li key={title} className="flex items-start gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-mist text-sm font-bold text-brand-600">{num(k + 1)}</span>
          <span><b className="block">{title}</b><span className="text-sm text-muted">{text}</span></span>
        </li>
      ))}
    </ol>
  )
}

export function Block({ title, id, children, className = '' }) {
  return <section className={`mt-10 ${className}`} aria-labelledby={id}>{title && <h2 id={id} className="mb-4 text-xl font-bold">{title}</h2>}{children}</section>
}

export function Note({ icon = 'info', children, className = '' }) {
  return <p className={`flex items-start gap-2.5 rounded-md bg-mist p-3 text-sm text-ink/80 ${className}`}><Icon name={icon} className="mt-0.5 size-4 shrink-0 text-brand-600" /><span>{children}</span></p>
}

export function More({ title, children }) {
  return (
    <details className="group mt-4 border-t border-line pt-3">
      <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-brand-600 [&::-webkit-details-marker]:hidden">
        {title}<Icon name="chev" className="size-4 transition group-open:rotate-180" />
      </summary>
      <div className="pt-3 text-sm leading-7 text-ink/80">{children}</div>
    </details>
  )
}

export function Total({ usd }) {
  const { t, money } = useI18n()
  return <div className="flex items-end justify-between border-t border-dashed border-line pt-4"><span className="text-muted">{t('sv.total')}</span><b className="text-2xl"><Ltr>{money(usd)}</Ltr></b></div>
}

/** − value + stepper. */
export function Qty({ value, min, max, onChange, label }) {
  const { t, num } = useI18n()
  return (
    <div role="group" aria-label={label} className="inline-flex items-center gap-1 rounded-md border border-line p-1">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`${t('sv.less')}: ${label}`}
        className="grid size-9 place-items-center rounded-md bg-mist text-ink transition hover:bg-line disabled:opacity-40"><Icon name="minus" className="size-4" /></button>
      <output aria-live="polite" className="min-w-8 text-center font-bold">{num(value)}</output>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`${t('sv.more')}: ${label}`}
        className="grid size-9 place-items-center rounded-md bg-mist text-ink transition hover:bg-line disabled:opacity-40"><Icon name="plus" className="size-4" /></button>
    </div>
  )
}

/** Segmented choice. options: [{ value, label }] */
export function Seg({ options, value, onChange, label }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex max-w-full overflow-x-auto rounded-md border border-line bg-white p-1 [scrollbar-width:none]">
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={o.value === value} onClick={() => onChange(o.value)}
          className={`shrink-0 rounded-[3px] px-4 py-2 text-sm font-semibold transition ${o.value === value ? 'bg-ink text-white' : 'text-muted hover:text-ink'}`}>{o.label}</button>
      ))}
    </div>
  )
}

/* Search-form field shell, same look as the lead's search panel. */
export function Field({ label, icon, children, className = '' }) {
  return (
    <label className={`block rounded-md border border-line bg-white px-4 pt-2.5 pb-2 transition focus-within:border-ink hover:border-ink/40 ${className}`}>
      <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted"><Icon name={icon} className="size-3.5" /> {label}</span>
      {children}
    </label>
  )
}
export const control = 'w-full appearance-none bg-transparent pt-0.5 text-[15px] font-semibold text-ink outline-none'
export function Submit({ children }) {
  return <button className="btn-primary min-h-14 w-full px-8 text-base md:w-auto"><Icon name="search" className="size-5" />{children}</button>
}

/** Photo, or a quiet placeholder with the place name when we have no verified photo. */
export function Pic({ src, alt = '', label, className = '' }) {
  const s = pic(src)
  if (s) return <img src={s} alt={alt} loading="lazy" className={`object-cover ${className}`} />
  return (
    <div role={alt ? 'img' : undefined} aria-label={alt || undefined} className={`grid place-items-center bg-gradient-to-br from-mist to-[#e6ecf7] text-muted ${className}`}>
      <span className="flex flex-col items-center gap-2 px-4 text-center text-sm font-semibold text-ink/55"><Icon name="globe" className="size-7 text-brand/50" />{label}</span>
    </div>
  )
}

/** Purpose of travel as a row of choices. */
export function PurposeChips({ list, value, onChange, label }) {
  const { t } = useI18n()
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {list.map((p) => (
        <button key={p} type="button" role="radio" aria-checked={p === value} onClick={() => onChange(p)}
          className={`inline-flex items-center gap-1.5 rounded-md border px-3.5 py-2 text-sm font-medium transition ${p === value ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink/75 hover:border-ink/40'}`}>
          <Icon name={PURPOSE_ICON[p]} className="size-4" />{t(`vi.p.${p}`)}
        </button>
      ))}
    </div>
  )
}
