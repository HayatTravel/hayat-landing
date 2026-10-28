import Icon from '../Icon'
import { Ltr } from '../ui'
import { useI18n } from '../../lib/i18n'
import { partnersFor } from '../../lib/providers/compare'

/** "Compare prices": Hayat's price first with what booking with us includes, then partner links (no invented prices).
    kind: 'flight' | 'hotel' | 'car'; params: the same search (see lib/providers/compare.js); hayatUsd: our total; hayatNote: what it covers. */
export default function ComparePanel({ kind, params, hayatUsd, hayatNote, className = '' }) {
  const i = useI18n(); const { t } = i
  const rows = partnersFor(kind, params)
  return (
    <section aria-labelledby={`cmp-${kind}`} className={`rounded-lg border border-line ${className}`}>
      <h3 id={`cmp-${kind}`} className="flex items-center gap-2 border-b border-line px-4 py-3 text-sm font-bold"><Icon name="sort" className="size-4 text-muted" />{t('cmp.title')}</h3>
      <div className="border-b border-line bg-brand/5 px-4 py-4">
        <div className="flex items-start justify-between gap-4">
          <div><p className="font-bold">{t('cmp.hayat')}</p>{hayatNote && <p className="text-xs text-muted">{hayatNote}</p>}</div>
          {hayatUsd != null && <p className="text-end"><span className="block text-[11px] text-muted">{t('cmp.hayatPrice')}</span><Ltr className="text-lg font-bold">{i.money(hayatUsd)}</Ltr></p>}
        </div>
        <ul className="mt-3 grid gap-1 text-xs text-ink/80">{['cmp.b1', 'cmp.b2', 'cmp.b3'].map((k) => <li key={k} className="flex items-start gap-2"><Icon name="check" className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />{t(k)}</li>)}</ul>
      </div>
      <ul className="divide-y divide-line">
        {rows.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3 text-sm">
            <span className="font-semibold">{r.name}</span>
            <span className="flex items-center gap-4">
              <span className="text-xs text-muted">{r.price != null ? <Ltr>{i.money(r.price)}</Ltr> : t('cmp.live')}</span>
              <a href={r.url} target="_blank" rel="noopener sponsored" className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline">{t('cmp.view', { name: r.name })}<Icon name="arrow" className="size-3.5 rtl:-scale-x-100" /></a>
            </span>
          </li>
        ))}
      </ul>
      <p className="border-t border-line px-4 py-3 text-[11px] leading-5 text-muted">{t('cmp.label')} · {t('cmp.note')}</p>
    </section>
  )
}
