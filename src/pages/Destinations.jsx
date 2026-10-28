import { Link, useSearchParams } from 'react-router'
import Icon from '../components/Icon'
import { THEMES, WORLD } from '../data/world'
import { useI18n } from '../lib/i18n'
import { caseOf, pl, visa } from '../components/services/data'
import { Arrow, Head, HelpLine, KindBadge, Pic } from '../components/services/ui'

export const KINDS = ['free', 'arrival', 'evisa', 'embassy']
/** Tourism visa kind for an Iraqi passport. */
export const kindOf = (d) => { const v = visa(d.visa); return v ? caseOf(v, 'tourism').kind : 'embassy' }
export const Budget = ({ n, className = '' }) => {
  const { t } = useI18n()
  return <span className={`inline-flex items-center gap-1 ${className}`} title={t(`ds.b.${n}`)}><span aria-hidden="true" dir="ltr" className="font-bold tracking-wider"><span className="text-ink">{'$'.repeat(n)}</span><span className="text-line">{'$'.repeat(3 - n)}</span></span><span className="sr-only">{t(`ds.b.${n}`)}</span></span>
}

export function DestCard({ d, theme }) {
  const i = useI18n(); const { t, L } = i
  const city = L(d.city); const country = L(d.country)
  const tags = (theme ? [theme, ...d.themes.filter((x) => x !== theme)] : d.themes).slice(0, 2)
  return (
    <Link to={`/destinations/${d.slug}`} className="card card-hover group flex flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-mist">
        <Pic src={d.img} label={city} className="size-full transition duration-700 group-hover:scale-105" />
        <KindBadge kind={kindOf(d)} className="absolute top-3 start-3 shadow-sm" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold">{city}</h3>
        {country !== city && <p className="text-sm text-muted">{country}</p>}
        <p className="mt-2 flex items-center gap-1.5 text-sm text-ink/75"><Icon name="plane" className="size-3.5 text-muted rtl:-scale-x-100" />{i.dur(d.mins)} · {t(d.stops ? 'ds.stop' : 'ds.direct')}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <span className="flex flex-wrap gap-1.5">{tags.map((x) => <span key={x} className="chip">{t(`ds.th.${x}`)}</span>)}</span>
          <span className="flex items-center gap-3 text-sm"><Budget n={d.budget} /><Arrow className="size-4 text-muted transition group-hover:text-brand" /></span>
        </div>
      </div>
    </Link>
  )
}

/** /destinations?theme&visa&direct&budget&month — the explorer. */
export default function Destinations() {
  const i = useI18n(); const { t } = i
  const [sp, setSp] = useSearchParams()
  const q = { theme: sp.get('theme') || '', visa: sp.get('visa') || '', direct: sp.get('direct') === '1', budget: +sp.get('budget') || 0, month: +sp.get('month') || 0 }
  const set = (k, v) => setSp((s) => { const n = new URLSearchParams(s); v ? n.set(k, String(v)) : n.delete(k); return n }, { replace: true, preventScrollReset: true })
  const list = WORLD.filter((d) => (!q.theme || d.themes.includes(q.theme)) && (!q.visa || kindOf(d) === q.visa) && (!q.direct || !d.stops)
    && (!q.budget || d.budget === q.budget) && (!q.month || d.best.includes(q.month)))
  const sel = 'w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm font-medium text-ink outline-none focus:border-brand'
  const chip = (v, label) => (
    <button key={v || 'all'} type="button" aria-pressed={q.theme === v} onClick={() => set('theme', v)}
      className={`rounded-md border px-3.5 py-1.5 text-sm font-medium transition ${q.theme === v ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink/70 hover:border-ink/40'}`}>{label}</button>
  )
  const filtered = sp.toString() !== ''
  return (
    <>
      <Head title={t('ds.title')} sub={t('ds.sub')} />
      <div className="container-x py-10">
        <div role="group" aria-label={t('ds.f.theme')} className="flex flex-wrap gap-2">{chip('', t('ds.all'))}{THEMES.map((x) => chip(x, t(`ds.th.${x}`)))}</div>
        <div className="mt-4 grid gap-3 rounded-lg border border-line bg-mist/60 p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
          <label><span className="label">{t('ds.f.visa')}</span>
            <select className={sel} value={q.visa} onChange={(e) => set('visa', e.target.value)}><option value="">{t('ds.anyVisa')}</option>{KINDS.map((k) => <option key={k} value={k}>{t(`vi.kind.${k}`)}</option>)}</select></label>
          <label><span className="label">{t('ds.f.budget')}</span>
            <select className={sel} value={q.budget || ''} onChange={(e) => set('budget', e.target.value)}><option value="">{t('ds.anyBudget')}</option>{[1, 2, 3].map((n) => <option key={n} value={n}>{t(`ds.b.${n}`)}</option>)}</select></label>
          <label><span className="label">{t('ds.f.month')}</span>
            <select className={sel} value={q.month || ''} onChange={(e) => set('month', e.target.value)}><option value="">{t('ds.anyMonth')}</option>{Array.from({ length: 12 }, (_, m) => <option key={m} value={m + 1}>{i.monthName(m)}</option>)}</select></label>
          <label className="flex cursor-pointer items-center gap-2.5 py-2.5 text-sm font-medium"><input type="checkbox" checked={q.direct} onChange={(e) => set('direct', e.target.checked ? 1 : '')} className="size-4 accent-[var(--color-brand)]" />{t('ds.f.direct')}</label>
        </div>
        <div className="mt-6 mb-4 flex flex-wrap items-center justify-between gap-3">
          <p aria-live="polite" className="text-sm text-muted">{pl(i, list.length, 'vi.cn')}</p>
          {filtered && <button type="button" onClick={() => setSp({}, { replace: true })} className="text-sm font-semibold text-brand-600 hover:text-brand">{t('ds.clear')}</button>}
        </div>
        {list.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{list.map((d) => <DestCard key={d.slug} d={d} theme={q.theme} />)}</div>
        ) : (
          <div className="card grid justify-items-center gap-3 p-12 text-center">
            <Icon name="globe" className="size-9 text-muted" /><h3 className="text-lg font-bold">{t('ds.none')}</h3><p className="text-sm text-muted">{t('ds.noneD')}</p>
            <button type="button" onClick={() => setSp({}, { replace: true })} className="btn-ghost px-5 py-2.5 text-sm">{t('ds.clear')}</button>
          </div>
        )}
        <p className="mt-8 text-center text-xs text-muted">{t('ds.guide')}</p>
        <div className="mt-4 text-center"><HelpLine ctx={t('ds.title')} /></div>
      </div>
    </>
  )
}
