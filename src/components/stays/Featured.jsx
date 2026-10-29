import { useState } from 'react'
import { Link } from 'react-router'
import Icon from '../Icon'
import { useI18n } from '../../lib/i18n'
import { Ltr } from '../ui'
import { HStars } from './ui'
import { ALL_HOTELS, baseQ, cheapest, cityBy, hq, imgSrc, withQs } from './lib'

/** Hotel card for the home page: photo, name, stars, city, board, free cancellation, from price per night. */
function HotelCard({ h }) {
  const i = useI18n(); const { t } = i
  const r = cheapest(h)
  return (
    <Link to={withQs(`/hotels/${h.id}`, baseQ({ ...hq(), city: h.city }))} className="card card-hover group flex flex-col overflow-hidden">
      <div className="aspect-[16/10] overflow-hidden bg-mist"><img src={imgSrc(h.img)} alt="" loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-105" /></div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <HStars n={h.stars} />
        <h3 className="font-bold leading-snug">{i.L(h.name)}</h3>
        <p className="text-sm text-muted">{i.L(cityBy(h.city)?.name)} · {t(`ht.board.${r.board}`)}</p>
        <p className="flex items-center gap-1 text-xs text-emerald-700"><Icon name="check" className="size-3.5" />{t('ht.freeCancel')}</p>
        <p className="mt-auto pt-3 text-sm"><span className="text-muted">{t('st.from')} </span><b className="text-base"><Ltr>{i.money(r.base)}</Ltr></b><span className="text-muted"> {t('ht.perNightS')}</span></p>
      </div>
    </Link>
  )
}

/** Featured hotels under the home search: city chips switch the cards. `all` = show a mix first ("All cities"). */
export default function FeaturedHotels({ cities, title, lede, more, all = true, per = 4 }) {
  const i = useI18n(); const { t } = i
  const [city, setCity] = useState(all ? '' : cities[0])
  const pool = ALL_HOTELS.filter((h) => cities.includes(h.city))
  const list = city
    ? pool.filter((h) => h.city === city).sort((a, b) => b.score - a.score).slice(0, per)
    : cities.map((c) => pool.filter((h) => h.city === c).sort((a, b) => b.score - a.score)[0]).filter(Boolean).slice(0, 6)
  const chip = (v, label) => (
    <button key={v || 'all'} type="button" aria-pressed={city === v} onClick={() => setCity(v)}
      className={`rounded-md border px-3.5 py-1.5 text-sm font-medium transition ${city === v ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink/75 hover:border-ink/40'}`}>{label}</button>
  )
  return (
    <section className="container-x py-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>{lede && <p className="mt-2 text-muted">{lede}</p>}</div>
        <Link to={more[0]} className="btn-ghost py-2.5 text-sm">{more[1]}<Icon name="arrow" className="size-4 rtl:-scale-x-100" /></Link>
      </div>
      <div role="group" aria-label={t('ht.feat.cities')} className="mb-6 flex flex-wrap gap-2">
        {all && chip('', t('ht.feat.allCities'))}
        {cities.map((c) => chip(c, i.L(cityBy(c)?.name)))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{list.map((h) => <HotelCard key={h.id} h={h} />)}</div>
    </section>
  )
}

/** Hotels tab (travelling from Iraq). */
export function FeaturedAbroad() {
  const { t } = useI18n()
  return <FeaturedHotels cities={['istanbul', 'dubai', 'baku', 'antalya', 'trabzon', 'sharm']} title={t('ht.feat.title')} lede={t('ht.feat.lede')} more={['/hotels', t('ht.feat.all')]} />
}

/** Hotels-in-Iraq tab (visitors). */
export function FeaturedIraq() {
  const { t } = useI18n()
  return <FeaturedHotels all={false} per={4} cities={['karbala', 'najaf', 'baghdad', 'erbil', 'basra', 'sulaymaniyah']} title={t('iq.hotels.title')} lede={t('iq.feat.lede')} more={['/visit/hotels', t('iq.feat.all')]} />
}
