import { useSearchParams } from 'react-router'
import { PageHead } from '../components/Layout'
import Icon from '../components/Icon'
import { useI18n } from '../lib/i18n'
import { THEMES, photo } from '../data/incoming'
import { TOURS, inMonth, placeBy, tourQ, useVisitMode } from '../components/incoming/lib'
import { TourCard } from '../components/incoming/ui'
import { monthOptions, plural, qs } from '../components/stays/lib'

/** /visit/tours?where=(t:<theme>|p:<place>)&month&ad — guided tours and day trips. */
export default function VisitTours() {
  useVisitMode()
  const i = useI18n(); const { t } = i
  const [sp, setSp] = useSearchParams()
  const q = Object.fromEntries(sp)
  const months = monthOptions(i)
  const where = q.where || ''
  const theme = where.startsWith('t:') && THEMES.some((x) => x.id === where.slice(2)) ? where.slice(2) : ''
  const place = where.startsWith('p:') ? placeBy(where.slice(2)) : null
  const month = months.some((m) => m.value === q.month) ? q.month : ''
  const { ad } = tourQ(q)
  const update = (patch) => setSp(qs({ where, month, ad: q.ad, ...patch }), { replace: true, preventScrollReset: true })
  const list = TOURS.filter((x) => (!theme || x.theme === theme) && (!place || x.places.includes(place.id)) && inMonth(x, month))
    .sort((a, b) => a.days - b.days)

  const chip = (on, label, onClick, key) => (
    <button key={key} type="button" aria-pressed={on} onClick={onClick}
      className={`rounded-md border px-3.5 py-1.5 text-sm font-medium transition ${on ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink/75 hover:border-ink/40'}`}>{label}</button>
  )
  return (
    <>
      <PageHead photo={photo('marshes')}>
        <h1 className="text-3xl font-bold sm:text-4xl">{t('iq.tours.title')}</h1>
        <p className="mt-2 max-w-2xl text-muted">{t('iq.tours.lede')}</p>
      </PageHead>
      <div className="container-x py-10">
        <div className="space-y-3">
          <div role="group" aria-label={t('iq.wayL')} className="flex flex-wrap items-center gap-2">
            <span className="w-20 text-sm font-semibold text-muted">{t('iq.wayS')}</span>
            {chip(!theme, t('pk.all1'), () => update({ where: place ? where : '' }), 'all')}
            {THEMES.map((x) => chip(theme === x.id, i.L(x.title), () => update({ where: `t:${x.id}` }), x.id))}
          </div>
          <div role="group" aria-label={t('pk.month')} className="flex flex-wrap items-center gap-2">
            <span className="w-20 text-sm font-semibold text-muted">{t('pk.month')}</span>
            {chip(!month, t('pk.anyMonth'), () => update({ month: '' }), 'any')}
            {months.map((m) => chip(month === m.value, m.label, () => update({ month: m.value }), m.value))}
          </div>
        </div>
        <div className="mt-8 mb-5 flex flex-wrap items-center justify-between gap-3">
          <p aria-live="polite"><b>{plural(i, 'iq.tours', list.length)}</b>{place && ` · ${i.L(place.name)}`}</p>
          {place && <button type="button" onClick={() => update({ where: '' })} className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-sm hover:border-ink/40"><Icon name="close" className="size-3.5" />{t('pk.clearCity', { city: i.L(place.name) })}</button>}
        </div>
        {list.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((x) => <TourCard key={x.id} tour={x} query={{ ad }} />)}</div> : (
          <div className="card grid justify-items-center gap-2 p-12 text-center">
            <Icon name="search" className="size-8 text-muted" /><h2 className="text-lg font-bold">{t('iq.tours.none')}</h2><p className="text-sm text-muted">{t('iq.tours.noneD')}</p>
            <button type="button" onClick={() => setSp({}, { replace: true })} className="btn-ghost mt-2 py-2.5 text-sm">{t('pk.showAll')}</button>
          </div>
        )}
        <p className="mt-10 flex gap-2 rounded-md bg-mist p-4 text-sm text-ink/80"><Icon name="info" className="mt-0.5 size-4 shrink-0 text-muted" />{t('iq.tours.private')}</p>
      </div>
    </>
  )
}
