import { Link, useSearchParams } from 'react-router'
import { PageHead } from '../components/Layout'
import SearchTabs from '../components/SearchTabs'
import D, { media } from '../data/catalog'
import { useI18n } from '../lib/i18n'
import { PriceFrom } from '../components/stays/ui'
import { baseQ, cheapest, hotelCities, hq, plural, withQs } from '../components/stays/lib'

/** #/hotels — search (tab fixed) and the cities we book most, each leading to its results. */
export default function Hotels() {
  const i = useI18n(); const { t } = i
  const [sp] = useSearchParams()
  const q = Object.fromEntries(sp)
  const h = hq()
  return (
    <>
      <PageHead photo={media('hotel')}>
        <h1 className="text-3xl font-bold sm:text-4xl">{t('ht.title')}</h1>
        <p className="mt-2 max-w-2xl text-muted">{t('ht.lede')}</p>
        <div className="mt-8"><SearchTabs initial="hotels" lock query={q} /></div>
      </PageHead>
      <section className="container-x py-16">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('ht.where')}</h2>
        <p className="mt-2 text-muted">{t('ht.whereD')}</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hotelCities().map((c) => {
            const hs = D.hotels.filter((x) => x.city === c.slug)
            return (
              <Link key={c.slug} to={withQs('/hotels/results', baseQ({ ...h, city: c.slug }))} className="card card-hover group overflow-hidden">
                <div className="aspect-[16/10] overflow-hidden bg-mist"><img src={media(c.img)} alt="" loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-105" /></div>
                <div className="flex items-end justify-between gap-4 p-5">
                  <div><h3 className="text-lg font-bold">{i.L(c.name)}</h3><p className="text-sm text-muted">{i.L(c.country)} · {plural(i, 'st.hotels', hs.length)}</p></div>
                  <PriceFrom usd={Math.min(...hs.map((x) => cheapest(x).base))} unit={t('ht.perNightS')} />
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </>
  )
}
