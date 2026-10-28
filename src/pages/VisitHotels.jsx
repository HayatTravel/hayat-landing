import { Link, useSearchParams } from 'react-router'
import { PageHead } from '../components/Layout'
import { useI18n } from '../lib/i18n'
import { IN_CITIES, IN_HOTELS, photo } from '../data/incoming'
import { useVisitMode } from '../components/incoming/lib'
import { HotelForm } from '../components/stays/Forms'
import { HStars, PriceFrom, Score } from '../components/stays/ui'
import { baseQ, cheapest, hq, imgSrc, plural, withQs } from '../components/stays/lib'

/** /visit/hotels — hotels in Iraqi cities. Search and booking use the shared hotel engine (/hotels/results, /hotels/:id, checkout type=hotel). */
export default function VisitHotels() {
  useVisitMode()
  const i = useI18n(); const { t } = i
  const [sp] = useSearchParams()
  const q = Object.fromEntries(sp)
  const h = hq(q)
  return (
    <>
      <PageHead photo={photo('kadhimiya')}>
        <h1 className="text-3xl font-bold sm:text-4xl">{t('iq.hotels.title')}</h1>
        <p className="mt-2 max-w-2xl text-muted">{t('iq.hotels.lede')}</p>
        <div className="search-host mt-8 rounded-lg border border-line bg-white p-4 text-ink sm:p-6"><HotelForm initial={q} scope="iq" /></div>
      </PageHead>
      <div className="container-x space-y-14 py-12">
        {IN_CITIES.map((c) => {
          const hs = IN_HOTELS.filter((x) => x.city === c.slug)
          if (!hs.length) return null
          return (
            <section key={c.slug}>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div><h2 className="text-xl font-bold">{i.L(c.name)}</h2><p className="text-sm text-muted">{plural(i, 'st.hotels', hs.length)}</p></div>
                <Link to={withQs('/hotels/results', baseQ({ ...h, city: c.slug }))} className="text-sm font-semibold text-brand hover:underline">{t('iq.hotels.all', { city: i.L(c.name) })}</Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {hs.map((x) => (
                  <Link key={x.id} to={withQs(`/hotels/${x.id}`, baseQ({ ...h, city: c.slug }))} className="card card-hover group overflow-hidden">
                    <div className="aspect-[16/10] overflow-hidden bg-mist"><img src={imgSrc(x.img)} alt="" loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-105" /></div>
                    <div className="grid gap-2 p-5">
                      <div className="flex items-start justify-between gap-3"><div><HStars n={x.stars} /><h3 className="mt-1 font-bold">{i.L(x.name)}</h3></div><Score s={x.score} /></div>
                      <p className="text-sm text-muted">{i.L(x.area)}</p>
                      <div className="mt-2 flex justify-end border-t border-line pt-3"><PriceFrom usd={cheapest(x).base} unit={t('ht.perNightS')} /></div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}
