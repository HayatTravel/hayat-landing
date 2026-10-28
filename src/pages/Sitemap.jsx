import { Link } from 'react-router'
import { useI18n } from '../lib/i18n'
import { Hero } from '../components/company/ui'

/* Every page of the site, grouped. Labels reuse the menu strings where they exist. */
export const SITEMAP = [
  ['cp.map.book', [['/flights', 'nav.flights'], ['/hotels', 'nav.hotels'], ['/holidays', 'nav.holidays'], ['/cars', 'nav.cars'], ['/visa', 'nav.visa'], ['/esim', 'nav.esim'], ['/events', 'nav.events'], ['/transfers', 'nav.transfers'], ['/destinations', 'nav.destinations']]],
  ['cp.map.visit', [['/visit', 'in.nav.home'], ['/visit/places', 'in.nav.places'], ['/visit/tours', 'in.nav.tours'], ['/visit/visa', 'in.nav.visa'], ['/visit/hotels', 'in.nav.hotels'], ['/visit/plan', 'in.nav.plan']]],
  ['cp.map.company', [['/about', 'cp.nav.about'], ['/about/offices', 'cp.nav.offices'], ['/careers', 'cp.nav.careers'], ['/news', 'cp.nav.news'], ['/partners', 'cp.nav.partners']]],
  ['cp.map.help', [['/trips', 'nav.trips'], ['/help', 'nav.help'], ['/contact', 'cp.nav.contact'], ['/feedback', 'cp.nav.feedback']]],
  ['cp.map.legal', [['/legal/terms', 'cp.legal.terms'], ['/legal/privacy', 'cp.legal.privacy'], ['/legal/cookies', 'cp.legal.cookies'], ['/legal/payments', 'cp.legal.payments']]],
]

/** /sitemap */
export default function Sitemap() {
  const { t } = useI18n()
  return (
    <>
      <Hero title={t('cp.nav.sitemap')} />
      <div className="container-x grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-5">
        {SITEMAP.map(([title, links]) => (
          <section key={title}>
            <h2 className="mb-3 font-bold">{t(title)}</h2>
            <ul className="space-y-2 text-sm">{links.map(([to, k]) => <li key={to}><Link to={to} className="text-ink/75 hover:text-brand hover:underline">{t(k)}</Link></li>)}</ul>
          </section>
        ))}
      </div>
    </>
  )
}
