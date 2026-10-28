/* Home (travelling from Iraq): "Where Iraqis travel" — theme chips and six destinations.
   Places already shown in the popular-flights section are left out, so nothing repeats. */
import { useState } from 'react'
import { Link } from 'react-router'
import { SectionTitle } from '../components/ui'
import { HOME_DEST } from '../components/flights/engine'
import { THEMES, WORLD } from '../data/world'
import { useI18n } from '../lib/i18n'
import { Arrow } from '../components/services/ui'
import { DestCard } from '../pages/Destinations'

const POOL = WORLD.filter((d) => !HOME_DEST.includes(d.ap))
const HOME_THEMES = THEMES.filter((x) => POOL.filter((d) => d.themes.includes(x)).length >= 3)

function WhereIraqisTravel() {
  const { t } = useI18n()
  const [theme, setTheme] = useState('')
  const list = POOL.filter((d) => !theme || d.themes.includes(theme)).slice(0, 6)
  const chip = (v, label) => (
    <button key={v || 'all'} type="button" aria-pressed={theme === v} onClick={() => setTheme(v)}
      className={`shrink-0 rounded-md border px-3.5 py-1.5 text-sm font-medium transition ${theme === v ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink/70 hover:border-ink/40'}`}>{label}</button>
  )
  return (
    <section className="container-x py-16" aria-labelledby="hDest">
      <SectionTitle title={<span id="hDest">{t('ds.title')}</span>} action={<Link to={`/destinations${theme ? `?theme=${theme}` : ''}`} className="btn-ghost shrink-0 px-4 py-2 text-sm">{t('ds.home.all')}<Arrow /></Link>} />
      <p className="-mt-5 mb-5 text-sm text-muted">{t('ds.home.s')}</p>
      <div role="group" aria-label={t('ds.f.theme')} className="mb-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">{chip('', t('ds.all'))}{HOME_THEMES.map((x) => chip(x, t(`ds.th.${x}`)))}</div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((d) => <DestCard key={d.slug} d={d} theme={theme} />)}</div>
    </section>
  )
}

export default [{ id: 'destinations', order: 15, mode: 'out', Component: WhereIraqisTravel }]
