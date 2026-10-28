/* Home: "Travel guides" rail with the articles for the current audience (out on /, in on /visit). */
import { Link } from 'react-router'
import { SectionTitle } from '../components/ui'
import { GUIDES } from '../data/guides'
import { useI18n } from '../lib/i18n'
import { Arrow } from '../components/services/ui'
import { GuideCard } from '../components/business/guides'

function rail(mode) {
  return function GuidesRail() {
    const { t } = useI18n()
    const list = GUIDES.filter((g) => g.mode === mode).slice(0, 4)
    return (
      <section className="container-x py-16" aria-label={t('gd.title')}>
        <SectionTitle title={t('gd.title')} action={<Link to={`/guides?tab=${mode}`} className="btn-ghost shrink-0 px-4 py-2 text-sm">{t('gd.all')}<Arrow /></Link>} />
        <p className="-mt-5 mb-6 text-sm text-muted">{t('gd.home.s')}</p>
        <div className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {list.map((g) => <GuideCard key={g.slug} g={g} className="w-[78%] shrink-0 snap-start sm:w-auto" />)}
        </div>
      </section>
    )
  }
}

export default [
  { id: 'guides', order: 35, mode: 'out', Component: rail('out') },
  { id: 'guides-in', order: 45, mode: 'in', Component: rail('in') },
]
