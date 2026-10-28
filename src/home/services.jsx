/* Home sections from services: a compact visa checker and the next events. eSIM and transfers have no home
   section on purpose (they live in the search tabs and as checkout extras). */
import { Link } from 'react-router'
import D from '../data/catalog'
import { useI18n } from '../lib/i18n'
import { SectionTitle } from '../components/ui'
import VisaChecker from '../components/services/VisaChecker'
import { EventCard } from '../pages/Events'
import { Arrow } from '../components/services/ui'

const More = ({ to, children }) => <Link to={to} className="btn-ghost shrink-0 px-4 py-2 text-sm">{children}<Arrow /></Link>

function HomeVisa() {
  const { t } = useI18n()
  return (
    <section className="container-x py-16" aria-label={t('vi.homeTitle')}>
      <SectionTitle title={t('vi.homeTitle')} action={<More to="/visa">{t('vi.seeAll')}</More>} />
      <VisaChecker withNat={false} sub={t('vi.checkerSub')} />
    </section>
  )
}

function HomeEvents() {
  const { t } = useI18n()
  const list = [...D.events].sort((a, b) => a.inDays - b.inDays).slice(0, 4)
  return (
    <section className="container-x py-16" aria-label={t('ev.homeTitle')}>
      <SectionTitle title={t('ev.homeTitle')} action={<More to="/events">{t('ev.seeAll')}</More>} />
      <div className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {list.map((e) => <EventCard key={e.id} e={e} className="w-[78%] shrink-0 snap-start sm:w-auto" />)}
      </div>
    </section>
  )
}

export default [
  { id: 'visa', order: 30, Component: HomeVisa },
  { id: 'events', order: 40, Component: HomeEvents },
]
