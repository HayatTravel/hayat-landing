import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { PageHead } from '../components/Layout'
import { SearchSummary } from '../components/SearchPanel'
import Icon from '../components/Icon'
import { Photo, Stars, Stepper } from '../components/ui'
import { searchHotels } from '../data/hotels'
import { destination } from '../data/places'
import { addDays, dateAr, iqd } from '../lib/format'
import { steps } from '../lib/order'
import JourneyLoader, { useJourney } from '../components/art/JourneyLoader'

export const stayParams = (sp) => {
  const p = { city: sp.get('city') || 'DXB', in: sp.get('in') || addDays(14), out: sp.get('out') || addDays(17), guests: sp.get('guests') || '2' }
  return { ...p, nights: Math.max(1, Math.round((new Date(p.out) - new Date(p.in)) / 864e5)) }
}

export default function Hotels() {
  const [sp] = useSearchParams()
  const p = stayParams(sp)
  const [minStars, setMinStars] = useState(0)
  const hotels = searchHotels(p).filter((h) => h.stars >= minStars)
  const d = destination(p.city)
  const qs = new URLSearchParams({ city: p.city, in: p.in, out: p.out, guests: p.guests }).toString()
  const busy = useJourney(qs)

  return (
    <>
      <PageHead photo={d.img}>
        <SearchSummary key={qs} initial="hotels" defaults={p} title={`فنادق في ${d.city}`}
          meta={`${dateAr(p.in)} — ${dateAr(p.out)} · ${p.guests} ضيوف`} />
        <div className="mt-6"><Stepper steps={steps.hotel} current={0} /></div>
      </PageHead>

      <div className="container-x py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">{hotels.length} مكان إقامة · السعر لـ {p.nights} ليالٍ</p>
          <div className="flex gap-1 rounded-md bg-white p-1 text-sm ring-1 ring-line">
            {[[0, 'الكل'], [4, '4+ نجوم'], [5, '5 نجوم']].map(([n, l]) => (
              <button key={n} onClick={() => setMinStars(n)} className={`rounded-md px-4 py-1.5 transition ${minStars === n ? 'bg-ink text-white' : 'text-muted hover:text-ink'}`}>{l}</button>
            ))}
          </div>
        </div>
        {busy ? <JourneyLoader variant="hotel" /> : <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {hotels.map((h, i) => (
            <Link key={h.id} to={`/hotels/${h.id}?${qs}`} style={{ animationDelay: `${i * 70}ms` }} className="card card-hover group animate-rise overflow-hidden">
              <div className="relative h-60 overflow-hidden">
                <Photo id={h.gallery[0]} w={800} alt={h.name} className="size-full transition duration-[1.2s] group-hover:scale-105" />
                <span dir="ltr" className="absolute top-4 end-4 rounded-xl bg-white/95 px-2.5 py-1 text-sm font-bold backdrop-blur">{h.score}<span className="text-xs font-normal text-muted">/10</span></span>
                {h.freeCancel && <span className="absolute bottom-4 start-4 rounded-md bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">إلغاء مجاني</span>}
              </div>
              <div className="p-5">
                <Stars n={h.stars} />
                <h3 className="mt-1.5 text-lg font-bold">{h.name}</h3>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted"><Icon name="pin" className="size-3.5" /> {h.area} · {h.reviews.toLocaleString('en')} تقييم</p>
                <div className="mt-3 flex flex-wrap gap-1.5">{h.amenities.slice(0, 3).map((a) => <span key={a} className="chip">{a}</span>)}</div>
                <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
                  <div><p className="text-xl font-bold">{iqd(h.nightly * p.nights)}</p><p className="text-xs text-muted">{iqd(h.nightly)} / لليلة</p></div>
                  <span className="grid size-10 place-items-center rounded-md bg-mist transition group-hover:bg-brand group-hover:text-white"><Icon name="arrow" className="size-4 -scale-x-100" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>}
      </div>
    </>
  )
}
