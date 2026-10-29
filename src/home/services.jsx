/* Home sections from services: a compact visa checker and the next events. eSIM and transfers have no home
   section on purpose (they live in the search tabs and as checkout extras). */
import { Link } from 'react-router'
import D from '../data/catalog'
import { useI18n } from '../lib/i18n'
import { Ltr, SectionTitle } from '../components/ui'
import Icon from '../components/Icon'
import { PURPOSES, PURPOSE_ICON, caseOf, procTime, visa } from '../components/services/data'
import { EventCard } from '../pages/Events'
import { Arrow, KindBadge } from '../components/services/ui'

const More = ({ to, children }) => <Link to={to} className="btn-ghost shrink-0 px-4 py-2 text-sm">{children}<Arrow /></Link>

/* Sits under the search box when the visa tab is chosen, so it complements the form (no second destination picker):
   start from a case, or from the countries people ask about most. */
const POPULAR_VISAS = ['TR', 'AE', 'GE', 'MY', 'JO', 'IN', 'SCH', 'UK']
function HomeVisa() {
  const i = useI18n(); const { t, L, money } = i
  return (
    <section className="container-x py-12" aria-labelledby="hVisa">
      <SectionTitle title={<span id="hVisa">{t('vi.home2T')}</span>} action={<More to="/visa">{t('vi.seeAll')}</More>} />
      <p className="-mt-5 mb-6 text-sm text-muted">{t('vi.home2S')}</p>
      <div role="group" aria-label={t('vi.cases')} className="flex flex-wrap gap-2">
        {PURPOSES.map((p) => (
          <Link key={p} to={`/visa?purpose=${p}`} className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white px-3.5 py-2 text-sm font-medium text-ink/75 transition hover:border-brand hover:text-brand">
            <Icon name={PURPOSE_ICON[p]} className="size-4" />{t(`vi.p.${p}`)}
          </Link>
        ))}
      </div>
      <h3 className="mt-8 mb-3 text-sm font-semibold text-muted">{t('vi.popular')}</h3>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {POPULAR_VISAS.map(visa).filter(Boolean).map((v) => {
          const c = caseOf(v, 'tourism')
          return (
            <li key={v.id}>
              <Link to={`/visa/${v.id}`} className="card card-hover group flex h-full items-center justify-between gap-3 p-4">
                <span className="min-w-0"><b className="block truncate">{L(v.country)}</b>
                  <span className="text-xs text-muted">{c.kind === 'free' ? t('vi.ofIraqi') : procTime(i, c)}</span></span>
                <span className="flex flex-col items-end gap-1.5"><KindBadge kind={c.kind} />{c.kind !== 'free' && <b className="text-sm"><Ltr>{money(c.fee)}</Ltr></b>}</span>
              </Link>
            </li>
          )
        })}
      </ul>
      <p className="mt-4 text-xs text-muted">{t('vi.guide')}</p>
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
