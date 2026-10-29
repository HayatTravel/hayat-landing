import { useState } from 'react'
import { Link } from 'react-router'
import Icon from '../Icon'
import { Ltr, Photo, SectionTitle } from '../ui'
import { useI18n } from '../../lib/i18n'
import { CATS, carParams, location, normCar, searchCars } from '../cars/engine'
import { qs } from '../flights/engine'

const CITIES = ['bgw', 'ebl', 'bsr', 'istanbul', 'dubai', 'baku', 'georgia']
const SHOWN = ['eco', 'sed', 'suv', 'van']

/** Home, under the search box when the Car rental tab is selected: pick-up city chips and four car classes. */
export default function CarsFeatured() {
  const i = useI18n(); const { t } = i
  const [city, setCity] = useState('ebl')
  const q = normCar({ city })
  const cars = searchCars(q).filter((c) => SHOWN.includes(c.id))
  const to = `/cars?${qs(carParams(q))}`
  const name = i.L(location(city).name)
  return (
    <section className="container-x py-12">
      <SectionTitle title={t('car.feat.t')} action={<Link to={to} className="btn-ghost shrink-0 px-4 py-2 text-sm">{t('car.feat.all', { city: name })}<Icon name="arrow" className="size-4 rtl:-scale-x-100" /></Link>} />
      <p className="-mt-5 mb-5 text-sm text-muted">{t('car.feat.s')}</p>
      <div role="group" aria-label={t('car.city')} className="mb-5 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
        {CITIES.map((c) => (
          <button key={c} type="button" aria-pressed={c === city} onClick={() => setCity(c)}
            className={`shrink-0 rounded-md border px-3.5 py-1.5 text-sm transition ${c === city ? 'border-ink bg-ink text-white' : 'border-line text-muted hover:border-ink/40 hover:text-ink'}`}>{i.L(location(c).name)}</button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cars.map((c) => (
          <Link key={c.id} to={`${to}&cat=${c.id}`} className="card card-hover group overflow-hidden">
            <Photo id={c.photo} w={600} alt="" className="aspect-[16/10] w-full" />
            <div className="p-4">
              <p className="text-xs font-medium text-brand">{i.L(CATS[c.id])}</p>
              <h3 className="mt-0.5 font-bold">{i.L(c.name)}</h3>
              <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
                <span className="inline-flex items-center gap-1"><Icon name="user" className="size-3.5" />{t('car.seatsN', { n: c.seats })}</span>
                <span className="inline-flex items-center gap-1"><Icon name="steering" className="size-3.5" />{c.auto ? t('car.auto') : t('car.manual')}</span>
              </p>
              <p className="mt-3 flex items-end justify-between gap-2">
                <span><span className="block font-bold"><Ltr>{t('car.feat.from', { amount: i.money(c.daily) })}</Ltr></span><span className="text-xs text-emerald-700">{t('car.feat.free')}</span></span>
                <Icon name="arrow" className="size-4 text-brand rtl:-scale-x-100" />
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
