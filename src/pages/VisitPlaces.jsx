import { useSearchParams } from 'react-router'
import { PageHead } from '../components/Layout'
import { useI18n } from '../lib/i18n'
import { THEMES, photo } from '../data/incoming'
import { PLACES, useVisitMode } from '../components/incoming/lib'
import { PlaceCard } from '../components/incoming/ui'

/** /visit/places?theme&region — every place, grouped by region, filterable by way of travel. */
export default function VisitPlaces() {
  useVisitMode()
  const i = useI18n(); const { t } = i
  const [sp, setSp] = useSearchParams()
  const theme = THEMES.some((x) => x.id === sp.get('theme')) ? sp.get('theme') : ''
  const list = PLACES.filter((p) => !theme || p.themes.includes(theme))
  const chip = (on, label, value) => (
    <button key={value || 'all'} type="button" aria-pressed={on} onClick={() => setSp(value ? { theme: value } : {}, { replace: true, preventScrollReset: true })}
      className={`rounded-md border px-3.5 py-1.5 text-sm font-medium transition ${on ? 'border-white bg-white text-ink' : 'border-white/25 text-white/85 hover:border-white/60'}`}>{label}</button>
  )
  return (
    <>
      <PageHead photo={photo('babylon')}>
        <h1 className="text-3xl font-bold sm:text-4xl">{t('iq.places.title')}</h1>
        <p className="mt-2 max-w-2xl text-muted">{t('iq.places.lede')}</p>
        <div role="group" aria-label={t('iq.wayL')} className="mt-6 flex flex-wrap gap-2">
          {chip(!theme, t('pk.all1'), '')}
          {THEMES.map((x) => chip(theme === x.id, i.L(x.title), x.id))}
        </div>
      </PageHead>
      <div className="container-x space-y-14 py-12">
        {['fed', 'krg'].map((r) => {
          const items = list.filter((p) => p.region === (r === 'krg' ? 'krg' : 'federal'))
          if (!items.length) return null
          return (
            <section key={r}>
              <h2 className="text-xl font-bold">{t(`iq.region.${r}`)}</h2>
              <p className="mt-1 text-sm text-muted">{t(`iq.region.${r}.lede`)}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map((p) => <PlaceCard key={p.id} p={p} />)}</div>
            </section>
          )
        })}
      </div>
    </>
  )
}
