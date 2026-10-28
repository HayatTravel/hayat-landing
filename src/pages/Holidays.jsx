import { useSearchParams } from 'react-router'
import { PageHead } from '../components/Layout'
import Icon from '../components/Icon'
import D, { media } from '../data/catalog'
import { useI18n } from '../lib/i18n'
import { PkgCard } from '../components/stays/ui'
import { THEMES, byNextDep, cityBy, depDates, monthOptions, plural, pq, qs } from '../components/stays/lib'

/** #/holidays?city&month&theme&ad&ch — flight + hotel + transfers, filtered by type and month. */
export default function Holidays() {
  const i = useI18n(); const { t } = i
  const [sp, setSp] = useSearchParams()
  const q = Object.fromEntries(sp)
  const months = monthOptions(i)
  const st = { city: cityBy(q.city) ? q.city : '', month: months.some((m) => m.value === q.month) ? q.month : '', theme: THEMES.includes(q.theme) ? q.theme : '' }
  const p = pq(q)
  const c = cityBy(st.city)
  const update = (patch) => setSp(qs({ ...st, ...patch, ad: q.ad, ch: q.ch }), { replace: true, preventScrollReset: true })
  const list = D.packages.filter((x) => (!st.city || x.city === st.city) && (!st.theme || x.theme === st.theme) && (!st.month || depDates(x).some((d) => d.startsWith(st.month)))).sort(byNextDep)

  const chip = (on, label, onClick, key) => (
    <button key={key} type="button" aria-pressed={on} onClick={onClick}
      className={`rounded-md border px-3.5 py-1.5 text-sm font-medium transition ${on ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink/75 hover:border-ink/40'}`}>{label}</button>
  )

  return (
    <>
      <PageHead photo={media('dest-antalya')}>
        <h1 className="text-3xl font-bold sm:text-4xl">{t('pk.title')}</h1>
        <p className="mt-2 max-w-2xl text-muted">{t('pk.lede')}</p>
      </PageHead>

      <div className="container-x py-10">
        <div className="space-y-3">
          <div role="group" aria-label={t('pk.typeL')} className="flex flex-wrap items-center gap-2">
            <span className="w-16 text-sm font-semibold text-muted">{t('pk.type')}</span>
            {chip(!st.theme, t('pk.all1'), () => update({ theme: '' }), 'all')}
            {THEMES.map((k) => chip(st.theme === k, t(`pk.theme.${k}`), () => update({ theme: k }), k))}
          </div>
          <div role="group" aria-label={t('pk.month')} className="flex flex-wrap items-center gap-2">
            <span className="w-16 text-sm font-semibold text-muted">{t('pk.month')}</span>
            {chip(!st.month, t('pk.anyMonth'), () => update({ month: '' }), 'any')}
            {months.map((m) => chip(st.month === m.value, m.label, () => update({ month: m.value }), m.value))}
          </div>
        </div>

        <div className="mt-8 mb-5 flex flex-wrap items-center justify-between gap-3">
          <p aria-live="polite"><b>{plural(i, 'st.holidays', list.length)}</b>{c && ` ${t('ht.inCity', { city: i.L(c.name) })}`}</p>
          {c && <button type="button" onClick={() => update({ city: '' })} className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-sm hover:border-ink/40"><Icon name="close" className="size-3.5" />{t('pk.clearCity', { city: i.L(c.name) })}</button>}
        </div>

        {list.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((x) => <PkgCard key={x.id} p={x} query={p} month={st.month} />)}</div>
        ) : (
          <div className="card grid justify-items-center gap-2 p-12 text-center">
            <Icon name="search" className="size-8 text-muted" />
            <h2 className="text-lg font-bold">{t('pk.none')}</h2><p className="text-sm text-muted">{t('pk.noneD')}</p>
            <button type="button" onClick={() => setSp(qs({ ad: q.ad, ch: q.ch }), { replace: true })} className="btn-ghost mt-2 py-2.5 text-sm">{t('pk.showAll')}</button>
          </div>
        )}
      </div>
    </>
  )
}
