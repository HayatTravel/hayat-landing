import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import Icon from '../components/Icon'
import { PageHead } from '../components/Layout'
import { Photo, Reveal, morphStyle, useMorph } from '../components/ui'
import { deals, findDeal } from '../data/deals'
import { destination } from '../data/places'
import { addDays, img, iqd } from '../lib/format'
import NotFound from './NotFound'

const off = (d) => Math.round((1 - d.price / d.was) * 100)

export function DealsList() {
  const [hero, ...rest] = deals
  const morph = useMorph()
  return (
    <>
    <PageHead className="pb-14">
      <div className="mb-10">
        <p className="flex items-center gap-2 font-semibold text-ember"><Icon name="flame" className="size-5 animate-[flicker_1.2s_ease-in-out_infinite]" /> عروض ساخنة</p>
        <h1 className="mt-3 max-w-3xl text-4xl leading-tight font-bold sm:text-6xl">باقات مختارة بعناية، <span className="text-shimmer">بأسعار لن تتكرر</span></h1>
      </div>

      <Link to={`/deals/${hero.id}`} {...morph.trigger(hero.id)} className="group relative block h-[460px] overflow-hidden rounded-lg shadow-[0_40px_100px_-40px_rgba(61,126,255,.5)] ring-1 ring-white/10">
        <div className="absolute inset-0" style={morph.target(hero.id)}><Photo id={hero.img} w={2000} eager alt={hero.title} className="size-full transition duration-[1.6s] group-hover:scale-105" /></div>
        <div className="absolute inset-0 bg-gradient-to-l from-[#0b1220]/90 via-[#0b1220]/40 to-transparent" />
        <div className="relative flex h-full max-w-lg flex-col justify-end p-8 text-white sm:p-12">
          <span className="w-fit rounded-md bg-ember px-3 py-1 text-sm font-bold">وفّر {off(hero)}%</span>
          <h2 className="mt-4 text-4xl font-bold">{hero.title}</h2>
          <p className="mt-2 text-white/75">{hero.sub}</p>
          <div className="mt-6 flex items-center gap-5">
            <p className="text-3xl font-bold">{iqd(hero.price)}</p>
            <span className="btn bg-white text-[#0b1220] group-hover:bg-sky">اكتشف العرض <Icon name="arrow" className="size-4 -scale-x-100" /></span>
          </div>
        </div>
      </Link>
    </PageHead>

    <div className="container-x pt-12 pb-20">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((d, i) => (
          <Reveal key={d.id} delay={i * 80}>
            <Link to={`/deals/${d.id}`} {...morph.trigger(d.id)} className="card card-hover group block overflow-hidden">
              <div className="relative h-64 overflow-hidden" style={morph.target(d.id)}>
                <Photo id={d.img} w={800} alt={d.title} className="size-full transition duration-[1.2s] group-hover:scale-105" />
                <span className="absolute top-4 start-4 rounded-md bg-ember px-3 py-1 text-xs font-bold text-white">-{off(d)}%</span>
                <span className="absolute bottom-4 end-4 rounded-md bg-white/90 px-3 py-1 text-xs font-medium backdrop-blur">{destination(d.to).city}</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold">{d.title}</h3>
                <p className="mt-1 text-sm text-muted">{d.sub}</p>
                <ul className="mt-4 space-y-1.5 text-sm text-ink/70">{d.includes.slice(0, 3).map((x) => <li key={x} className="flex items-center gap-2"><Icon name="check" className="size-4 text-emerald-500" />{x}</li>)}</ul>
                <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
                  <div><p className="text-xs text-muted line-through">{iqd(d.was)}</p><p className="text-xl font-bold">{iqd(d.price)}</p></div>
                  <span className="flex items-center gap-1 text-xs text-ember"><Icon name="clock" className="size-3.5" /> {d.ends} أيام متبقية</span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
    </>
  )
}

export function DealDetail() {
  const { id } = useParams()
  const go = useNavigate()
  const d = findDeal(id)
  const [date, setDate] = useState(addDays(21))
  const [pax, setPax] = useState(2)
  if (!d) return <NotFound />
  const dest = destination(d.to)
  const days = ['الوصول والاستقبال في المطار ثم الانتقال إلى الفندق', 'جولة في أبرز معالم المدينة مع مرشد عربي', 'يوم حر للتسوق والاستكشاف', 'تجربة محلية مميزة وعشاء خاص', 'الإفطار ثم المغادرة إلى المطار']

  return (
    <>
      <section className="relative isolate flex h-[70vh] min-h-[460px] items-end overflow-hidden bg-ink">
        <div className="absolute inset-0 -z-10" style={morphStyle(d.id)}>
          {/* card-sized image is already cached, so the morph lands on a picture, not a blank box */}
          <img src={img(d.img, 800)} alt="" className="absolute inset-0 size-full object-cover" />
          <Photo id={d.img} w={2200} eager alt={d.title} className="absolute inset-0 size-full" />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/30 to-ink/40" />
        <div className="container-x pb-12 text-white">
          <Link to="/deals" viewTransition className="mb-6 inline-flex items-center gap-1 text-sm text-white/70 hover:text-white"><Icon name="arrow" className="size-4" /> كل العروض</Link>
          <span className="block w-fit animate-rise rounded-md bg-ember px-3 py-1 text-sm font-bold">وفّر {off(d)}% · ينتهي خلال {d.ends} أيام</span>
          <h1 className="mt-4 animate-rise text-4xl font-bold [animation-delay:100ms] sm:text-6xl">{d.title}</h1>
          <p className="mt-3 animate-rise text-lg text-white/75 [animation-delay:200ms]">{d.sub}</p>
        </div>
      </section>

      <div className="container-x grid gap-10 py-12 lg:grid-cols-[1fr_380px]">
        <div>
          <h2 className="text-2xl font-bold">ماذا يشمل العرض</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {d.includes.map((x, i) => (
              <Reveal key={x} delay={i * 60} className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-line">
                <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><Icon name="check" /></span>{x}
              </Reveal>
            ))}
          </div>
          <h2 className="mt-12 text-2xl font-bold">برنامج الرحلة</h2>
          <ol className="relative mt-6 space-y-6 border-s-2 border-dashed border-line ps-8">
            {days.slice(0, Math.min(d.nights + 1, 5)).map((t, i) => (
              <Reveal as="li" key={i} delay={i * 80} className="relative">
                <span className="absolute top-0 -start-[43px] grid size-7 place-items-center rounded-full bg-brand text-xs font-bold text-white ring-4 ring-mist">{i + 1}</span>
                <p className="font-semibold">اليوم {i + 1}</p>
                <p className="mt-1 text-sm text-muted">{t}</p>
              </Reveal>
            ))}
          </ol>
          <div className="mt-12 flex flex-wrap gap-3 text-sm">
            <span className="text-muted">تفضّل الحجز المنفصل؟</span>
            <Link to={`/flights?from=BGW&to=${d.to}&date=${date}&pax=${pax}&cabin=economy`} className="font-semibold text-brand hover:underline">الطيران فقط إلى {dest.city}</Link>
            <Link to={`/hotels/${d.hotel}?city=${d.to}&in=${date}&out=${addDays(d.nights, date)}&guests=${pax}`} className="font-semibold text-brand hover:underline">الفندق فقط</Link>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <p className="text-sm text-muted line-through">{iqd(d.was)}</p>
            <p className="text-3xl font-bold">{iqd(d.price)} <span className="text-sm font-normal text-muted">/ للشخص</span></p>
            <label className="label mt-6">تاريخ السفر</label>
            <input type="date" className="field" value={date} min={addDays(1)} onChange={(e) => setDate(e.target.value)} />
            <label className="label mt-4">عدد المسافرين</label>
            <div className="flex items-center justify-between rounded-2xl border border-line p-1.5">
              <button onClick={() => setPax(Math.max(1, pax - 1))} className="grid size-10 place-items-center rounded-xl bg-mist text-lg font-bold">−</button>
              <span className="font-bold">{pax}</span>
              <button onClick={() => setPax(Math.min(8, pax + 1))} className="grid size-10 place-items-center rounded-xl bg-mist text-lg font-bold">+</button>
            </div>
            <div className="my-5 border-t border-dashed border-line" />
            <div className="flex items-end justify-between"><span className="text-muted">الإجمالي</span><span className="text-2xl font-bold">{iqd(d.price * pax)}</span></div>
            <button onClick={() => go(`/checkout?type=deal&id=${d.id}&date=${date}&pax=${pax}`)} className="btn-primary mt-6 w-full py-4">احجز العرض <Icon name="arrow" className="size-4 -scale-x-100" /></button>
            <p className="mt-3 text-center text-xs text-muted">ادفع 25% الآن والباقي قبل السفر بأسبوع</p>
          </div>
        </aside>
      </div>
    </>
  )
}
