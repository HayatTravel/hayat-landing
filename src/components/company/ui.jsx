import { useState } from 'react'
import { Link } from 'react-router'
import Icon from '../Icon'
import { PageHead } from '../Layout'
import { useI18n } from '../../lib/i18n'
import { newRef } from '../../lib/store'
import { mapsUrl } from '../../data/company'

/* Building blocks for the company pages (about, offices, contact, careers, news, legal, feedback). */

/** Small visible marker for a fact Hayat still has to confirm. */
export function Tbc({ className = '', dark }) {
  const { t } = useI18n()
  return <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 align-middle text-[11px] font-semibold whitespace-nowrap ${dark ? 'border-white/20 bg-white/10 text-white/80' : 'border-amber-300 bg-amber-50 text-amber-800'} ${className}`}><Icon name="info" className="size-3" />{t('co.tbc')}</span>
}

/** Sample content marker (careers, news). */
export function Sample() {
  const { t } = useI18n()
  return <span className="inline-flex items-center rounded bg-mist px-1.5 py-0.5 text-[11px] font-semibold text-ink/70 ring-1 ring-line">{t('cp.sample')}</span>
}

/** Dark page band with title, lede and optional crumb/back link. */
export function Hero({ title, lede, back, photo, children }) {
  const { t } = useI18n()
  return (
    <PageHead photo={photo}>
      {back && <Link to={back[0]} className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-white"><Icon name="arrow" className="size-4 ltr:-scale-x-100" /> {back[1] || t('back')}</Link>}
      <h1 className="max-w-3xl text-3xl font-bold sm:text-4xl">{title}</h1>
      {lede && <p className="mt-3 max-w-2xl leading-7 text-muted">{lede}</p>}
      {children}
    </PageHead>
  )
}

export function H2({ children, lede, id }) {
  return (
    <div className="mb-6">
      <h2 id={id} className="scroll-mt-24 text-2xl font-bold tracking-tight">{children}</h2>
      {lede && <p className="mt-2 max-w-2xl leading-7 text-muted">{lede}</p>}
    </div>
  )
}

/** Static map placeholder with a "Get directions" link that searches the area name. */
export function MapBox({ label, query }) {
  const { t } = useI18n()
  return (
    <div className="grid min-h-40 place-items-center content-center gap-2 rounded-md border border-line bg-mist p-5 text-center [background-image:linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] [background-size:24px_24px]">
      <span className="grid size-10 place-items-center rounded-full bg-ink text-white"><Icon name="pin" className="size-5" /></span>
      <b className="text-sm">{label}</b>
      <a href={mapsUrl(query)} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-brand hover:underline">{t('cp.directions')}</a>
    </div>
  )
}

/** A form that shows a reference number after a mock submit. `fields` renders inputs; required inputs are checked. */
export function MockForm({ children, submitLabel, doneTitle, doneText, className = '' }) {
  const { t } = useI18n()
  const [ref, setRef] = useState(null)
  const [err, setErr] = useState('')
  if (ref) {
    return (
      <div role="status" className={`card p-6 ${className}`}>
        <span className="grid size-11 place-items-center rounded-full bg-emerald-50 text-emerald-700"><Icon name="check" className="size-5" /></span>
        <h3 className="mt-4 text-lg font-bold">{doneTitle}</h3>
        <p className="mt-1 text-sm text-muted">{t('cp.ref')}: <bdi dir="ltr" className="font-mono font-bold tracking-wider text-ink">{ref}</bdi></p>
        <p className="mt-3 text-sm leading-6 text-ink/80">{doneText}</p>
        <p className="mt-3 text-xs text-muted">{t('co.mock')}</p>
      </div>
    )
  }
  const submit = (e) => {
    e.preventDefault()
    const missing = [...e.currentTarget.querySelectorAll('[required]')].filter((x) => !String(x.value).trim())
    if (missing.length) { setErr(t('co.missing')); missing[0].focus(); return }
    setErr(''); setRef(newRef().replace(/^HY/, 'HM'))
  }
  return (
    <form onSubmit={submit} noValidate className={`card space-y-4 p-6 ${className}`}>
      {children}
      {err && <p role="alert" className="text-sm font-medium text-red-600">{err}</p>}
      <button className="btn-primary w-full py-3 sm:w-auto sm:px-8">{submitLabel}</button>
    </form>
  )
}

/** Labelled input. `as` = 'input' | 'textarea' | 'select'. */
export function Input({ id, label, as: Tag = 'input', optional, children, ...rest }) {
  const { t } = useI18n()
  return (
    <div>
      <label className="label" htmlFor={id}>{label}{optional && <span className="font-normal"> ({t('cp.optional')})</span>}</label>
      <Tag id={id} name={id} className={`field ${Tag === 'textarea' ? 'min-h-32' : ''}`} {...rest}>{children}</Tag>
    </div>
  )
}
