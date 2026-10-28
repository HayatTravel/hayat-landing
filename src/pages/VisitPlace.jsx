import { Link, useParams } from 'react-router'
import Icon from '../components/Icon'
import { useI18n } from '../lib/i18n'
import { openHelp } from '../lib/store'
import { THEMES } from '../data/incoming'
import { PLACES, placeBy, toursFor, useVisitMode } from '../components/incoming/lib'
import { Credit, Img, PlaceCard, TourCard, regionLabel } from '../components/incoming/ui'
import { ALL_HOTELS, plural, withQs } from '../components/stays/lib'
import NotFound from './NotFound'

/** /visit/places/:id — the story of a place, what to see, when to go, how long, how to get there, tours and hotels. */
export default function VisitPlace() {
  useVisitMode()
  const i = useI18n(); const { t } = i
  const { id } = useParams()
  const p = placeBy(id)
  if (!p) return <NotFound />
  const tours = toursFor(p.id)
  const hotels = ALL_HOTELS.filter((h) => h.city === p.hotelCity).length
  const near = PLACES.filter((x) => x.id !== p.id && x.region === p.region && x.themes.some((th) => p.themes.includes(th))).slice(0, 3)
  const days = p.days[0] === p.days[1] ? plural(i, 'iq.days', p.days[0]) : t('iq.rangeDays', { a: p.days[0], b: p.days[1] })

  return (
    <>
      <section className="relative isolate flex min-h-[420px] items-end overflow-hidden bg-ink pt-28 sm:min-h-[56svh] lg:pt-36">
        <Img k={p.photo} eager alt={i.L(p.name)} className="absolute inset-0 -z-20 size-full" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/30 to-ink/10" />
        <div className="container-x pb-10 text-white">
          <Link to="/visit/places" className="mb-4 inline-flex items-center gap-1 text-sm text-white/70 hover:text-white"><Icon name="arrow" className="size-4 ltr:-scale-x-100" /> {t('iq.allPlaces')}</Link>
          <p className="text-sm font-medium tracking-wide text-white/70 uppercase">{regionLabel(t, p.region)}</p>
          <h1 className="mt-1 text-4xl font-bold sm:text-5xl">{i.L(p.name)}</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/85">{i.L(p.tagline)}</p>
          <div className="mt-5 flex flex-wrap gap-2">{p.themes.map((th) => <Link key={th} to={`/visit/tours?where=t:${th}`} className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur hover:bg-white/20">{i.L(THEMES.find((x) => x.id === th).title)}</Link>)}</div>
        </div>
        <Credit k={p.photo} light className="absolute end-4 bottom-3" />
      </section>

      <div className="container-x grid gap-12 py-12 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-12">
          <section>
            <p className="max-w-3xl text-lg leading-9 text-ink/85">{i.L(p.story)}</p>
          </section>
          <section>
            <h2 className="mb-4 text-xl font-bold">{t('iq.place.see')}</h2>
            <ul className="grid gap-3 sm:grid-cols-2">{p.highlights.map((h, k) => <li key={k} className="flex gap-3 rounded-md border border-line bg-white p-4"><Icon name="pin" className="mt-0.5 size-4 shrink-0 text-brand" />{i.L(h)}</li>)}</ul>
          </section>
          {tours.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-bold">{t('iq.place.tours', { place: i.L(p.name) })}</h2>
              <div className="grid gap-5 md:grid-cols-2">{tours.map((x) => <TourCard key={x.id} tour={x} />)}</div>
            </section>
          )}
          {near.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-bold">{t('iq.place.near')}</h2>
              <div className="grid gap-4 sm:grid-cols-3">{near.map((x) => <PlaceCard key={x.id} p={x} />)}</div>
            </section>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <dl className="space-y-4 text-sm">
              <div><dt className="flex items-center gap-1.5 text-muted"><Icon name="calendar" className="size-4" />{t('iq.place.season')}</dt><dd className="mt-1 font-semibold">{i.L(p.season)}</dd></div>
              <div><dt className="flex items-center gap-1.5 text-muted"><Icon name="clock" className="size-4" />{t('iq.place.howLong')}</dt><dd className="mt-1 font-semibold">{days}</dd></div>
              <div><dt className="flex items-center gap-1.5 text-muted"><Icon name="plane" className="size-4" />{t('iq.place.reach')}</dt><dd className="mt-1 leading-6">{i.L(p.reach)}</dd></div>
            </dl>
            <div className="mt-6 grid gap-2">
              {hotels > 0 && <Link to={withQs('/hotels/results', { city: p.hotelCity })} className="btn-ghost w-full py-2.5 text-sm"><Icon name="bed" className="size-4" />{t('iq.place.hotels')}</Link>}
              <Link to="/visit/visa" className="btn-ghost w-full py-2.5 text-sm"><Icon name="passport" className="size-4" />{t('iq.place.visa')}</Link>
            </div>
          </div>
          <button type="button" onClick={() => openHelp(i.L(p.name))} className="flex items-center gap-2 text-sm font-medium text-brand"><Icon name="chat" className="size-4" />{t('iq.place.custom')}</button>
        </aside>
      </div>
    </>
  )
}
