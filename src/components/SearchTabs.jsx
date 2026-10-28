import { useRef, useState } from 'react'
import Icon from './Icon'
import { useI18n } from '../lib/i18n'
import { store } from '../lib/store'
import { useMode } from '../lib/mode'

/* Hosts every product's search form. Each area exports tabs from src/search/<area>.jsx:
   export default [{ id, icon, label, order, Form }] — Form({ initial }) renders the form and navigates on submit. */
/* A tab may set modes: ['out'] (default), ['in'] or ['out', 'in'] — which audience sees it. */
export const ALL_TABS = Object.values(import.meta.glob('../search/*.jsx', { eager: true }))
  .flatMap((m) => m.default)
  .sort((a, b) => a.order - b.order)

export default function SearchTabs({ initial, lock = false, query = {} }) {
  const { t, rtl } = useI18n()
  const { mode } = useMode()
  const TABS = ALL_TABS.filter((x) => (x.modes || ['out']).includes(mode) || x.id === initial)
  const [tab, setTab] = useState(() => (TABS.some((x) => x.id === initial) ? initial : store.get('tab', TABS[0]?.id)))
  const refs = useRef([])
  const active = TABS.find((x) => x.id === tab) || TABS[0]
  if (!active) return null
  const pick = (id) => { setTab(id); store.set('tab', id) }
  const keys = (e, k) => {
    const d = { ArrowRight: rtl ? -1 : 1, ArrowLeft: rtl ? 1 : -1 }[e.key]
    if (d == null) return
    e.preventDefault()
    const n = (k + d + TABS.length) % TABS.length
    refs.current[n]?.focus(); pick(TABS[n].id)
  }
  const { Form } = active
  return (
    <div className="search-host rounded-lg border border-line bg-white text-ink shadow-[0_30px_80px_-30px_rgba(11,18,32,.45)]">
      {!lock && (
        <div role="tablist" aria-label={t('search.tabs')} className="flex gap-1 overflow-x-auto border-b border-line px-3 [scrollbar-width:none]">
          {TABS.map((x, k) => (
            <button key={x.id} ref={(el) => { refs.current[k] = el }} role="tab" id={`tab-${x.id}`} aria-controls="search-panel" aria-selected={x.id === active.id} tabIndex={x.id === active.id ? 0 : -1}
              onClick={() => pick(x.id)} onKeyDown={(e) => keys(e, k)}
              className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-4 py-3.5 text-sm font-semibold transition ${x.id === active.id ? 'border-brand text-ink' : 'border-transparent text-muted hover:text-ink'}`}>
              <Icon name={x.icon} className="size-4" />{t(x.label)}
            </button>
          ))}
        </div>
      )}
      <div id="search-panel" role={lock ? 'region' : 'tabpanel'} aria-labelledby={lock ? undefined : `tab-${active.id}`} className="p-4 sm:p-6">
        <Form key={active.id} initial={query} />
      </div>
    </div>
  )
}
