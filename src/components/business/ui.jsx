/* Hayat for business: shared pieces (sub-navigation, feature grid, the "to be confirmed" chip, request forms). */
import { useId, useState } from 'react'
import { NavLink } from 'react-router'
import Icon from '../Icon'
import { PageHead } from '../Layout'
import { useI18n } from '../../lib/i18n'
import { newRef, store } from '../../lib/store'

export const BIZ = [
  { id: 'overview', to: '/business', icon: 'building' },
  { id: 'corporate', to: '/business/corporate', icon: 'users' },
  { id: 'agents', to: '/business/agents', icon: 'globe' },
  { id: 'groups', to: '/business/groups', icon: 'plane' },
  { id: 'government', to: '/business/government', icon: 'shield' },
]
export const PORTAL = 'https://booking.hayat.iq'

/** A fact we do not know yet: shown openly, never invented. */
export function Tbc({ className = '' }) {
  const { t } = useI18n()
  return <span className={`inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-200 ${className}`}><Icon name="info" className="size-3" />{t('co.tbc')}</span>
}

export function BizHead({ title, sub, photo, children }) {
  const { t } = useI18n()
  return (
    <PageHead photo={photo}>
      <p className="mb-3 text-sm font-semibold text-sky">{t('bz.title')}</p>
      <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
      {sub && <p className="mt-3 max-w-2xl leading-7 text-muted">{sub}</p>}
      {children}
    </PageHead>
  )
}

/** Links between the business pages. */
export function BizNav() {
  const { t } = useI18n()
  return (
    <nav aria-label={t('bz.sections')} className="border-b border-line bg-white">
      <div className="container-x flex gap-1 overflow-x-auto [scrollbar-width:none]">
        {BIZ.map((b) => (
          <NavLink key={b.id} to={b.to} end className={({ isActive }) => `-mb-px flex shrink-0 items-center gap-2 border-b-2 px-4 py-3.5 text-sm font-semibold transition ${isActive ? 'border-brand text-ink' : 'border-transparent text-muted hover:text-ink'}`}>
            <Icon name={b.icon} className="size-4" />{t(`bz.tab.${b.id}`)}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

/** items: [[icon, titleKey, textKey, extra?]] */
export function Features({ items, cols = 'lg:grid-cols-3' }) {
  const { t } = useI18n()
  return (
    <div className={`grid gap-4 sm:grid-cols-2 ${cols}`}>
      {items.map(([ic, h, d, extra]) => (
        <div key={h} className="rounded-lg border border-line bg-white p-5">
          <span className="grid size-10 place-items-center rounded-md bg-mist text-brand-600"><Icon name={ic} className="size-5" /></span>
          <h3 className="mt-4 flex flex-wrap items-center gap-2 font-bold">{t(h)}{extra}</h3>
          <p className="mt-1 text-sm leading-6 text-muted">{t(d)}</p>
        </div>
      ))}
    </div>
  )
}

export const SecTitle = ({ id, title, sub }) => (
  <div className="mb-6"><h2 id={id} className="text-2xl font-bold">{title}</h2>{sub && <p className="mt-1 max-w-2xl text-sm text-muted">{sub}</p>}</div>
)

/** Request form. fields: [{ id, label, type: text|email|tel|number|date|select|checks|textarea, options:[[value,label]], required, wide }]
    On submit it keeps the request locally (mock) and shows a reference number. */
export function RequestForm({ kind, title, sub, fields }) {
  const { t } = useI18n()
  const uid = useId()
  const [ref, setRef] = useState('')
  const [err, setErr] = useState('')
  const submit = (e) => {
    e.preventDefault()
    const f = e.currentTarget
    const missing = fields.filter((x) => x.required && !String(f[x.id]?.value || '').trim())
    if (missing.length) { setErr(t('bz.f.required')); f[missing[0].id]?.focus(); return }
    const data = Object.fromEntries(fields.map((x) => [x.id, x.type === 'checks' ? [...f.querySelectorAll(`[name="${x.id}"]:checked`)].map((c) => c.value) : f[x.id]?.value]))
    const r = newRef().replace(/^HY/, 'BZ')
    store.set('bz-requests', [{ ref: r, kind, data, created: Date.now() }, ...store.get('bz-requests', [])].slice(0, 20))
    setErr(''); setRef(r)
  }
  if (ref) {
    return (
      <div aria-live="polite" className="card animate-fade p-8 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-500 text-white"><Icon name="check" className="size-7" strokeWidth={2.6} /></span>
        <h3 className="mt-4 text-xl font-bold">{t('bz.f.doneT')}</h3>
        <p className="mt-2 text-sm">{t('bz.f.ref')}: <b dir="ltr" className="font-mono tracking-widest text-brand">{ref}</b></p>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted">{t('bz.f.doneD')}</p>
        <button type="button" onClick={() => setRef('')} className="btn-ghost mt-6 px-5 py-2.5 text-sm">{t('bz.f.again')}</button>
      </div>
    )
  }
  const input = (x) => {
    const id = `${uid}-${x.id}`
    const common = { id, name: x.id, required: x.required, className: 'field' }
    if (x.type === 'select') return <select {...common}><option value="">—</option>{x.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
    if (x.type === 'textarea') return <textarea {...common} rows={3} />
    if (x.type === 'checks') return (
      <div className="flex flex-wrap gap-2">{x.options.map(([v, l]) => (
        <label key={v} className="flex cursor-pointer items-center gap-2 rounded-md border border-line px-3 py-2 text-sm has-[:checked]:border-brand has-[:checked]:bg-brand/5">
          <input type="checkbox" name={x.id} value={v} className="size-4 accent-[var(--color-brand)]" />{l}</label>))}</div>
    )
    if (x.type === 'tel') return (
      <div className="flex items-center rounded-md border border-line bg-white focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10" dir="ltr">
        <span className="border-e border-line px-3 text-sm text-muted">+964</span>
        <input id={id} name={x.id} required={x.required} inputMode="tel" placeholder="770 000 0000" className="w-full bg-transparent px-3 py-3 outline-none" />
      </div>
    )
    return <input {...common} type={x.type || 'text'} dir={x.type === 'email' ? 'ltr' : undefined} min={x.type === 'number' ? 1 : undefined} />
  }
  return (
    <form onSubmit={submit} noValidate className="card p-6 sm:p-8">
      {title && <h3 className="text-xl font-bold">{title}</h3>}
      {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {fields.map((x) => (
          <div key={x.id} className={x.wide || x.type === 'textarea' || x.type === 'checks' ? 'sm:col-span-2' : ''}>
            {x.type === 'checks' ? <p className="label">{x.label}</p> : <label className="label" htmlFor={`${uid}-${x.id}`}>{x.label}{x.required && <span aria-hidden="true" className="text-ember"> *</span>}</label>}
            {input(x)}
          </div>
        ))}
      </div>
      {err && <p role="alert" className="mt-4 text-sm font-medium text-red-600">{err}</p>}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted">{t('bz.mock')}</p>
        <button className="btn-primary px-8">{t('bz.f.send')}</button>
      </div>
    </form>
  )
}

/** The contact fields every business form ends with. */
export const contactFields = (t, first = []) => [...first,
  { id: 'contact', label: t('bz.f.contact'), required: true }, { id: 'phone', label: t('bz.f.phone'), type: 'tel', required: true },
  { id: 'email', label: t('bz.f.email'), type: 'email', required: true }]
