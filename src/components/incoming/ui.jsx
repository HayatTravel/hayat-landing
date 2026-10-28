import { Link } from 'react-router'
import Icon from '../Icon'
import { Ltr } from '../ui'
import { useI18n } from '../../lib/i18n'
import { PHOTOS, photo } from '../../data/incoming'
import { plural, withQs } from '../stays/lib'
import { tourDates } from './lib'

/* Visual pieces of the "Visiting Iraq" site. Calm, editorial: big photography, plain words. */

/** Photo credit line (Wikimedia Commons). */
export function Credit({ k, className = '', light }) {
  const { t } = useI18n()
  const p = PHOTOS[k]
  if (!p) return null
  return <a href={p.page} target="_blank" rel="noopener noreferrer" className={`text-[11px] hover:underline ${light ? 'text-white/55' : 'text-muted'} ${className}`}>{t('iq.photo', { by: p.by, lic: p.lic })}</a>
}

export function Img({ k, className = '', alt = '', eager }) {
  return <img src={photo(k)} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" className={`bg-mist object-cover ${className}`} />
}

/** Section heading with optional lede and action. */
export function Head({ title, lede, action, eyebrow }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && <p className="mb-2 text-sm font-semibold tracking-wide text-brand uppercase">{eyebrow}</p>}
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        {lede && <p className="mt-2 leading-7 text-muted">{lede}</p>}
      </div>
      {action}
    </div>
  )
}

export function MoreLink({ to, children }) {
  return <Link to={to} className="btn-ghost py-2.5 text-sm">{children}<Icon name="arrow" className="size-4 rtl:-scale-x-100" /></Link>
}

export const regionLabel = (t, r) => t(r === 'krg' ? 'iq.region.krg' : 'iq.region.fed')

/** A place: tall photo card with name and one line. */
export function PlaceCard({ p, tall }) {
  const i = useI18n()
  return (
    <Link to={`/visit/places/${p.id}`} className={`group relative isolate flex overflow-hidden rounded-lg bg-ink ${tall ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
      <Img k={p.photo} className="absolute inset-0 -z-10 size-full transition duration-700 group-hover:scale-105" />
      <span className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
      <span className="mt-auto p-5 text-white">
        <span className="text-xs font-medium tracking-wide text-white/70 uppercase">{regionLabel(i.t, p.region)}</span>
        <span className="mt-1 block text-xl font-bold">{i.L(p.name)}</span>
        <span className="mt-1 block text-sm leading-6 text-white/80">{i.L(p.tagline)}</span>
      </span>
    </Link>
  )
}

/** A tour: photo, length, title, places, next date or "any day", price per person. */
export function TourCard({ tour, query = {} }) {
  const i = useI18n(); const { t } = i
  const d = tourDates(tour)
  return (
    <Link to={withQs(`/visit/tours/${tour.id}`, { ad: query.ad })} className="card card-hover group flex flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden"><Img k={tour.photo} className="size-full transition duration-700 group-hover:scale-105" />
        <span className="absolute top-3 start-3 rounded-md bg-white px-2 py-1 text-xs font-semibold text-ink">{tour.days === 1 ? t('iq.dayTrip') : plural(i, 'iq.days', tour.days)}</span></div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs font-medium text-muted">{t(`iq.theme.${tour.theme}`)} · {t(tour.type === 'group' ? 'iq.group' : 'iq.private')}</p>
        <h3 className="text-lg leading-snug font-bold">{i.L(tour.title)}</h3>
        <p className="line-clamp-2 text-sm leading-6 text-ink/70">{i.L(tour.summary)}</p>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4">
          <span className="text-xs text-muted">{d ? t('iq.nextDep', { date: i.date(d[0]) }) : t('iq.anyDay')}</span>
          <span className="text-end leading-tight"><span className="block text-xs text-muted">{t('st.from')}</span><span className="text-lg font-bold"><Ltr>{i.money(tour.price)}</Ltr></span><span className="block text-xs text-muted">{t('pk.perPerson')}</span></span>
        </div>
      </div>
    </Link>
  )
}

/** Tick list used for included / not included. */
export function Ticks({ items, no }) {
  return (
    <ul className={`space-y-2.5 ${no ? 'text-ink/70' : ''}`}>
      {items.map((x) => <li key={x} className="flex gap-2"><Icon name={no ? 'minus' : 'check'} className={`mt-0.5 size-4 shrink-0 ${no ? 'text-muted' : 'text-emerald-600'}`} />{x}</li>)}
    </ul>
  )
}
