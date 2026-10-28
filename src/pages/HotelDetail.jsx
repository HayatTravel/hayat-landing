import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { PageHead } from '../components/Layout'
import Icon from '../components/Icon'
import { Photo, Stars, Stepper } from '../components/ui'
import { findHotel, cityName } from '../data/hotels'
import { dateAr, iqd } from '../lib/format'
import { steps } from '../lib/order'
import { stayParams } from './Hotels'
import NotFound from './NotFound'

const amenityIcon = { 'واي فاي مجاني': 'wifi', 'مسبح': 'globe', 'إفطار': 'meal', 'موقف سيارات': 'pin', 'نادي رياضي': 'bolt', 'سبا': 'star', 'نقل من المطار': 'plane', 'مطعم': 'meal' }

export default function HotelDetail() {
  const { id } = useParams()
  const [sp] = useSearchParams()
  const h = findHotel(id)
  const p = stayParams(sp)
  const [active, setActive] = useState(0)
  if (!h) return <NotFound />
  const qs = (room) => new URLSearchParams({ type: 'hotel', id, room, in: p.in, out: p.out, guests: p.guests })

  return (
    <>
      <PageHead>
        <Link to={`/hotels?${new URLSearchParams({ city: h.city, in: p.in, out: p.out, guests: p.guests })}`} className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-brand"><Icon name="arrow" className="size-4" /> كل الفنادق في {cityName(h.city)}</Link>
        <Stepper steps={steps.hotel} current={1} />
      </PageHead>

      <div className="container-x py-10">
        <div className="grid h-[420px] animate-fade grid-cols-4 grid-rows-2 gap-3 overflow-hidden rounded-lg">
          <div className="relative col-span-4 row-span-2 overflow-hidden md:col-span-2">
            <Photo key={active} id={h.gallery[active]} w={1400} eager alt={h.name} className="size-full animate-fade" />
          </div>
          {h.gallery.slice(0, 4).map((g, i) => (
            <button key={g} onClick={() => setActive(i)} className={`relative hidden overflow-hidden md:block ${active === i ? 'ring-4 ring-brand ring-inset' : ''}`}>
              <Photo id={g} w={600} alt="" className="size-full transition duration-700 hover:scale-110" />
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
          <div>
            <Stars n={h.stars} className="size-4" />
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{h.name}</h1>
            <p className="mt-2 flex items-center gap-1 text-muted"><Icon name="pin" className="size-4" /> {h.area}، {cityName(h.city)}</p>
            <p className="mt-6 max-w-2xl leading-8 text-ink/75">
              ملاذ هادئ يجمع بين الضيافة العربية والتصميم العصري، على بُعد دقائق من أبرز معالم {cityName(h.city)}. غرف واسعة بإضاءة طبيعية، ومطعم يقدّم أطباقاً عالمية ومحلية، وفريق يتحدث العربية لخدمتك على مدار الساعة.
            </p>
            <h2 className="mt-10 mb-4 text-xl font-bold">المرافق</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {h.amenities.map((a) => (
                <div key={a} className="flex items-center gap-2 rounded-2xl bg-white p-3 text-sm ring-1 ring-line"><Icon name={amenityIcon[a]} className="size-4 text-brand" />{a}</div>
              ))}
            </div>

            <h2 className="mt-12 mb-4 text-xl font-bold">اختر غرفتك</h2>
            <div className="space-y-4">
              {h.rooms.map((r, i) => (
                <div key={r.id} style={{ animationDelay: `${i * 80}ms` }} className="card card-hover flex animate-rise flex-col overflow-hidden sm:flex-row">
                  <Photo id={r.img} w={600} alt={r.name} className="h-48 w-full sm:h-auto sm:w-56" />
                  <div className="flex flex-1 flex-col justify-between gap-4 p-5 sm:flex-row sm:items-end">
                    <div>
                      <h3 className="text-lg font-bold">{r.name}</h3>
                      <p className="mt-1 text-sm text-muted">{r.bed} · <bdi dir="ltr">{r.size} m²</bdi></p>
                      <ul className="mt-3 space-y-1.5 text-sm">
                        {r.perks.map((k) => <li key={k} className="flex items-center gap-2 text-emerald-600"><Icon name="check" className="size-4" />{k}</li>)}
                        {h.freeCancel && <li className="flex items-center gap-2 text-emerald-600"><Icon name="check" className="size-4" />إلغاء مجاني</li>}
                      </ul>
                    </div>
                    <div className="sm:text-end">
                      <p className="text-2xl font-bold">{iqd(r.price * p.nights)}</p>
                      <p className="text-xs text-muted">{p.nights} ليالٍ · {iqd(r.price)} لليلة</p>
                      <Link to={`/checkout?${qs(r.id)}`} className="btn-primary mt-3 px-6 py-2.5 text-sm">احجز هذه الغرفة</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <div className="flex items-center gap-4">
                <span className="grid size-14 place-items-center rounded-2xl bg-brand text-xl font-bold text-white"><bdi dir="ltr">{h.score}</bdi></span>
                <div><p className="font-bold">{+h.score >= 9 ? 'استثنائي' : +h.score >= 8.5 ? 'رائع جداً' : 'ممتاز'}</p><p className="text-sm text-muted">{h.reviews.toLocaleString('en')} تقييم موثّق</p></div>
              </div>
              <blockquote className="mt-5 rounded-2xl bg-mist p-4 text-sm leading-7 text-ink/75">"الموقع ممتاز والخدمة راقية، والإفطار من أجمل ما جربت. سأعود بالتأكيد." <span className="mt-2 block text-xs text-muted">— زينب، بغداد</span></blockquote>
            </div>
            <div className="card p-6 text-sm">
              <div className="flex justify-between"><span className="text-muted">الوصول</span><span className="font-semibold">{dateAr(p.in)}</span></div>
              <div className="mt-3 flex justify-between"><span className="text-muted">المغادرة</span><span className="font-semibold">{dateAr(p.out)}</span></div>
              <div className="mt-3 flex justify-between"><span className="text-muted">الضيوف</span><span className="font-semibold">{p.guests}</span></div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
