import { Link } from 'react-router'
import Icon from '../components/Icon'
import { useI18n } from '../lib/i18n'
import { PLAN, THEMES } from '../data/incoming'
import { PLACES, TOURS } from '../components/incoming/lib'
import { Head, Img, MoreLink, PlaceCard, TourCard } from '../components/incoming/ui'
import { VisaChecker } from '../components/incoming/Visa'

/* Sections of /visit (mode 'in'), top to bottom: where to go · ways to experience Iraq · featured tours · visa in 3 steps · before you travel. */

const FEATURED_PLACES = ['baghdad', 'babylon', 'karbala', 'erbil', 'marshes', 'ur']
function WhereToGo() {
  const { t } = useI18n()
  return (
    <section className="container-x py-20">
      <Head eyebrow={t('iq.where.eyebrow')} title={t('iq.where.title')} lede={t('iq.where.lede')} action={<MoreLink to="/visit/places">{t('iq.allPlaces')}</MoreLink>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_PLACES.map((id) => <PlaceCard key={id} p={PLACES.find((p) => p.id === id)} />)}
      </div>
    </section>
  )
}

function Ways() {
  const i = useI18n(); const { t } = i
  return (
    <section className="border-y border-line bg-mist/60 py-20">
      <div className="container-x">
        <Head title={t('iq.ways.title')} lede={t('iq.ways.lede')} />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {THEMES.map((x) => (
            <Link key={x.id} to={`/visit/tours?where=t:${x.id}`} className="card card-hover group overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden"><Img k={x.photo} className="size-full transition duration-700 group-hover:scale-105" /></div>
              <div className="p-5">
                <h3 className="flex items-center gap-2 text-lg font-bold"><Icon name={x.icon} className="size-5 text-brand" />{i.L(x.title)}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/70">{i.L(x.text)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function Featured() {
  const { t } = useI18n()
  const pick = ['mesopotamia', 'karbala-najaf', 'kurdistan-mountains'].map((id) => TOURS.find((x) => x.id === id))
  return (
    <section className="container-x py-20">
      <Head title={t('iq.featured.title')} lede={t('iq.featured.lede')} action={<MoreLink to="/visit/tours">{t('iq.allTours')}</MoreLink>} />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{pick.map((x) => <TourCard key={x.id} tour={x} />)}</div>
    </section>
  )
}

function VisaSteps() {
  const { t } = useI18n()
  return (
    <section className="bg-ink py-20 text-white">
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-start">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('iq.steps.title')}</h2>
          <ol className="mt-8 space-y-6">
            {[1, 2, 3].map((n) => (
              <li key={n} className="flex gap-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white font-bold text-ink">{n}</span>
                <span><b className="block">{t(`iq.steps.${n}`)}</b><span className="text-sm leading-6 text-white/70">{t(`iq.steps.${n}d`)}</span></span>
              </li>
            ))}
          </ol>
        </div>
        <div className="light-island rounded-lg bg-white p-5 text-ink sm:p-6"><VisaChecker /></div>
      </div>
    </section>
  )
}

const TIPS = ['seasons', 'money', 'dress', 'safety']
function BeforeYouGo() {
  const i = useI18n(); const { t } = i
  return (
    <section className="container-x py-20">
      <Head title={t('iq.before.title')} action={<MoreLink to="/visit/plan">{t('iq.before.all')}</MoreLink>} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TIPS.map((id) => { const s = PLAN.find((x) => x.id === id); return (
          <Link key={id} to={`/visit/plan#${id}`} className="card card-hover p-5">
            <Icon name={s.icon} className="size-6 text-brand" />
            <h3 className="mt-3 font-bold">{i.L(s.title)}</h3>
            <p className="mt-1.5 text-sm leading-6 text-ink/70">{i.L(s.body[0])}</p>
          </Link>
        ) })}
      </div>
    </section>
  )
}

export default [
  { id: 'iq-where', order: 10, mode: 'in', Component: WhereToGo },
  { id: 'iq-ways', order: 20, mode: 'in', Component: Ways },
  { id: 'iq-tours', order: 30, mode: 'in', Component: Featured },
  { id: 'iq-visa', order: 40, mode: 'in', Component: VisaSteps },
  { id: 'iq-before', order: 50, mode: 'in', Component: BeforeYouGo },
]
