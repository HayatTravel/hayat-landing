import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { PageHead } from '../components/Layout'
import { SearchSummary } from '../components/SearchPanel'
import Icon from '../components/Icon'
import TripBar from '../components/TripBar'
import { Photo, Stepper } from '../components/ui'
import { carExtras, findCar, rentalDays, searchCars } from '../data/cars'
import { cityName } from '../data/hotels'
import { destinations } from '../data/places'
import { addDays, dateAr, iqd } from '../lib/format'
import { buildOrder, stepOf, steps } from '../lib/order'
import NotFound from './NotFound'
import JourneyLoader, { useJourney } from '../components/art/JourneyLoader'

const rentParams = (sp) => ({ city: sp.get('city') || 'DXB', pick: sp.get('pick') || addDays(14), drop: sp.get('drop') || addDays(18) })

function Specs({ c }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
      <li className="flex items-center gap-1"><Icon name="user" className="size-3.5" />{c.seats} مقاعد</li>
      <li className="flex items-center gap-1"><Icon name="bag" className="size-3.5" />{c.bags} حقائب</li>
      <li className="flex items-center gap-1"><Icon name="steering" className="size-3.5" />{c.auto ? 'أوتوماتيك' : 'يدوي'}</li>
      <li className="flex items-center gap-1"><Icon name="bolt" className="size-3.5" />{c.id === 'ev' ? 'كهرباء' : 'كيلومترات غير محدودة'}</li>
    </ul>
  )
}

export function CarList() {
  const [sp] = useSearchParams()
  const p = rentParams(sp)
  const days = rentalDays(p.pick, p.drop)
  const all = searchCars(p)
  const cats = ['الكل', ...new Set(all.map((c) => c.cat))]
  const [cat, setCat] = useState('الكل')
  const list = all.filter((c) => cat === 'الكل' || c.cat === cat).sort((a, b) => a.daily - b.daily)
  const qs = new URLSearchParams(p).toString()
  const busy = useJourney(qs)

  return (
    <>
      <PageHead photo={destinations.find((d) => d.code === p.city)?.img}>
        <SearchSummary key={qs} initial="cars" defaults={p} title={`سيارات للإيجار في ${cityName(p.city)}`}
          meta={`${dateAr(p.pick)} — ${dateAr(p.drop)} · ${days} أيام`} />
        <div className="mt-6"><Stepper steps={steps.car} current={0} /></div>
      </PageHead>
      <div className="container-x py-8">
        <div className="mb-6 flex gap-1 overflow-x-auto [scrollbar-width:none]">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`shrink-0 rounded-md border px-4 py-2 text-sm transition ${cat === c ? 'border-ink bg-ink text-white' : 'border-line text-muted hover:border-ink/40 hover:text-ink'}`}>{c}</button>
          ))}
        </div>
        {busy ? <JourneyLoader variant="car" /> : <div className="space-y-3">
          {list.map((c, i) => (
            <article key={c.id} style={{ animationDelay: `${i * 50}ms` }} className="card card-hover grid animate-rise overflow-hidden sm:h-48 sm:grid-cols-[240px_1fr_auto]">
              <Photo id={c.img} w={600} alt={c.name} className="h-44 w-full sm:h-full sm:min-h-44 sm:max-h-48" />
              <div className="p-5">
                <p className="text-xs font-medium text-brand">{c.cat}</p>
                <h3 className="mt-1 text-lg font-bold">{c.name}</h3>
                <div className="mt-3"><Specs c={c} /></div>
                <p className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                  <span className="rounded-md border border-line px-2 py-1">{c.supplier} · <bdi dir="ltr">{c.rating}</bdi></span>
                  {c.freeCancel && <span className="text-emerald-600">✓ إلغاء مجاني حتى 48 ساعة</span>}
                </p>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-line p-5 sm:w-52 sm:flex-col sm:items-end sm:justify-center sm:border-t-0 sm:border-s">
                <div className="sm:text-end">
                  <p className="text-xl font-bold">{iqd(c.daily * days)}</p>
                  <p className="text-xs text-muted">{iqd(c.daily)} / يوم</p>
                </div>
                <Link to={`/cars/${c.id}?${qs}`} className="btn-primary px-6 py-2.5 text-sm">اختيار</Link>
              </div>
            </article>
          ))}
        </div>}
      </div>
    </>
  )
}

export function CarExtras() {
  const { id } = useParams()
  const [sp] = useSearchParams()
  const go = useNavigate()
  const p = rentParams(sp)
  const c = findCar(p.city, id)
  const [picked, setPicked] = useState([])
  if (!c) return <NotFound />
  const q = new URLSearchParams({ ...p, type: 'car', id, extras: picked.join(',') })
  const order = buildOrder(q)
  const days = rentalDays(p.pick, p.drop)
  const toggle = (x) => setPicked(picked.includes(x) ? picked.filter((y) => y !== x) : [...picked, x])

  return (
    <>
      <PageHead>
        <Link to={`/cars?${new URLSearchParams(p)}`} className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-brand"><Icon name="arrow" className="size-4" /> كل السيارات</Link>
        <Stepper steps={steps.car} current={stepOf('car', 'الإضافات')} />
      </PageHead>
      <TripBar order={order} action={{ label: 'المتابعة للدفع', onClick: () => go(`/checkout?${q}`) }} />
      <div className="container-x space-y-6 py-10">
        <div className="card grid animate-rise overflow-hidden md:grid-cols-[1.2fr_1fr]">
          <Photo id={c.img} w={1000} eager alt={c.name} className="h-64 w-full md:h-full" />
          <div className="p-6">
            <p className="text-xs font-medium text-brand">{c.cat}</p>
            <h1 className="mt-1 text-2xl font-bold">{c.name}</h1>
            <div className="mt-3"><Specs c={c} /></div>
            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 text-sm">
              <div><dt className="text-xs text-muted">الاستلام</dt><dd className="font-semibold">{dateAr(p.pick)} · 10:00</dd><dd className="text-xs text-muted">مطار {cityName(p.city)}</dd></div>
              <div><dt className="text-xs text-muted">التسليم</dt><dd className="font-semibold">{dateAr(p.drop)} · 10:00</dd><dd className="text-xs text-muted">نفس المكان</dd></div>
            </dl>
            <ul className="mt-5 space-y-1.5 text-sm text-ink/80">
              {['سياسة الوقود: ممتلئ ← ممتلئ', 'تأمين أساسي ضد الغير مشمول', c.freeCancel ? 'إلغاء مجاني حتى 48 ساعة قبل الاستلام' : 'رسوم إلغاء 25%'].map((t) => (
                <li key={t} className="flex items-center gap-2"><Icon name="check" className="size-4 text-emerald-500" />{t}</li>
              ))}
            </ul>
          </div>
        </div>

        <section className="card animate-rise p-6 [animation-delay:100ms]">
          <h2 className="text-xl font-bold">إضافات</h2>
          <p className="mt-1 text-sm text-muted">السعر لكامل مدة الإيجار ({days} أيام).</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {carExtras.map((x) => {
              const on = picked.includes(x.id)
              return (
                <button key={x.id} onClick={() => toggle(x.id)} aria-pressed={on} className={`flex items-center gap-4 rounded-md border p-4 text-start transition ${on ? 'border-ink' : 'border-line hover:border-ink/40'}`}>
                  <span className={`grid size-5 shrink-0 place-items-center rounded-sm transition ${on ? 'bg-ink text-white' : 'ring-1 ring-line'}`}>{on && <Icon name="check" className="size-3.5" strokeWidth={3} />}</span>
                  <span className="flex-1"><span className="block font-semibold">{x.name}</span><span className="text-xs text-muted">{x.note}</span></span>
                  <span className="text-sm font-semibold">{iqd(x.perDay * days)}</span>
                </button>
              )
            })}
          </div>
        </section>
      </div>
    </>
  )
}
