import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { PageHead } from '../components/Layout'
import { SearchSummary } from '../components/SearchPanel'
import Icon from '../components/Icon'
import { Ltr, Stepper } from '../components/ui'
import { airlines, airports, cheapestOn, farePrice, fares, searchFlights } from '../data/flights'
import { addDays, airlineLogo, dateAr, dur, hm, iqd } from '../lib/format'
import { steps } from '../lib/order'
import { destinations } from '../data/places'
import JourneyLoader, { useJourney } from '../components/art/JourneyLoader'

const dayFmt = new Intl.DateTimeFormat('ar-IQ-u-nu-latn', { weekday: 'short', day: 'numeric' })
const dayAr = (iso) => dayFmt.format(new Date(iso))

export function FlightRow({ f, action }) {
  return (
    <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:gap-8">
      <div className="flex items-center gap-3 sm:w-44">
        <img src={airlineLogo(f.code)} alt={airlines[f.code].name} className="h-8 w-20 object-contain" />
        <div className="min-w-0 text-xs text-muted sm:hidden">{airlines[f.code].name}</div>
      </div>
      <div className="flex flex-1 items-center gap-4">
        <div className="text-center">
          <Ltr className="block text-2xl font-bold">{hm(f.dep)}</Ltr>
          <span className="text-xs font-medium text-muted">{f.from}</span>
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs text-muted">{dur(f.duration)}</span>
          <div className="relative my-1.5 h-px bg-line">
            <span className="absolute top-1/2 start-0 size-2 -translate-y-1/2 rounded-full bg-ink" />
            {f.stops.map((s) => <span key={s} className="absolute top-1/2 left-1/2 size-2 -translate-1/2 rounded-full bg-ember ring-4 ring-white" />)}
            <Icon name="plane" className="absolute top-1/2 end-0 size-4 -translate-y-1/2 rotate-[-45deg] -scale-x-100 text-brand" />
          </div>
          <span className={`text-xs font-medium ${f.stops.length ? 'text-ember' : 'text-emerald-600'}`}>{f.stops.length ? `توقف في ${airports[f.stops[0]]?.city ?? f.stops[0]}` : 'مباشرة'}</span>
        </div>
        <div className="text-center">
          <Ltr className="block text-2xl font-bold">{hm(f.arr)}{f.arr >= 1440 && <sup className="text-xs text-ember">+1</sup>}</Ltr>
          <span className="text-xs font-medium text-muted">{f.to}</span>
        </div>
      </div>
      {action}
    </div>
  )
}

function FareCalendar({ params, onPick }) {
  const days = useMemo(() => [-3, -2, -1, 0, 1, 2, 3].map((n) => {
    const date = addDays(n, params.date)
    return { date, past: date < addDays(0), price: cheapestOn({ ...params, date }) }
  }), [params.from, params.to, params.date, params.pax, params.cabin]) // eslint-disable-line
  const low = Math.min(...days.filter((d) => !d.past).map((d) => d.price))
  return (
    <div>
    <p className="mb-2 text-xs text-muted sm:hidden">أقل سعر لكل يوم (بالألف د.ع)</p>
    <div className="card grid grid-cols-7 overflow-hidden">
      {days.map((d) => (
        <button key={d.date} disabled={d.past} onClick={() => onPick(d.date)} aria-pressed={d.date === params.date}
          className={`relative border-s border-line px-1 py-3 text-center transition first:border-s-0 disabled:opacity-35 ${d.date === params.date ? 'bg-mist' : 'hover:bg-mist/60'}`}>
          <span className="block text-[11px] whitespace-nowrap text-muted sm:text-xs"><span className="hidden sm:inline">{dayAr(d.date)}</span><span className="sm:hidden">{new Date(d.date).getDate()}</span></span>
          <span className={`mt-1 block text-[11px] font-bold whitespace-nowrap sm:text-sm ${d.price === low && !d.past ? 'text-emerald-600' : ''}`}>{d.past ? '—' : <>{Math.round(d.price / 1000)}<span className="hidden sm:inline"> ألف</span></>}</span>
          {d.date === params.date && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-brand" />}
        </button>
      ))}
    </div>
    </div>
  )
}

function FarePicker({ f, qs }) {
  return (
    <div className="grid animate-fade gap-3 border-t border-line bg-mist/60 p-4 sm:grid-cols-3 sm:p-5">
      {fares.map((fare) => (
        <div key={fare.id} className="flex flex-col rounded-md border border-line bg-white p-4">
          <div className="flex items-baseline justify-between">
            <h4 className="font-bold">{fare.name}</h4>
            <span className="text-lg font-bold">{iqd(farePrice(f, fare.id))}</span>
          </div>
          <ul className="mt-4 flex-1 space-y-2 text-xs text-ink/80">
            {[['bag', fare.bag], ['swap', `التعديل: ${fare.change}`], ['shield', `الاسترداد: ${fare.refund}`], ['seat', fare.seatFree ? 'اختيار المقعد مجاناً' : 'اختيار المقعد برسوم'], ['star', `الأميال: ${fare.miles}`]].map(([ic, t]) => (
              <li key={t} className="flex items-center gap-2"><Icon name={ic} className="size-3.5 shrink-0 text-muted" />{t}</li>
            ))}
          </ul>
          <Link to={`/flights/${f.id}/passengers?${qs}&fare=${fare.id}`} className={`${fare.id === 'flex' ? 'btn-primary' : 'btn-ghost'} mt-4 py-2.5 text-sm`}>اختيار {fare.name}</Link>
        </div>
      ))}
    </div>
  )
}

export default function Flights() {
  const [sp, setSp] = useSearchParams()
  const params = { from: sp.get('from') || 'BGW', to: sp.get('to') || 'DXB', date: sp.get('date') || addDays(14), pax: +sp.get('pax') || 1, cabin: sp.get('cabin') || 'economy' }
  const all = useMemo(() => searchFlights(params), [sp]) // eslint-disable-line
  const [sort, setSort] = useState('price')
  const [directOnly, setDirectOnly] = useState(false)
  const [hidden, setHidden] = useState([])
  const [openId, setOpenId] = useState(null)
  const codes = [...new Set(all.map((f) => f.code))]
  const list = all
    .filter((f) => (!directOnly || !f.stops.length) && !hidden.includes(f.code))
    .sort((a, b) => (sort === 'price' ? a.price - b.price : sort === 'fast' ? a.duration - b.duration : a.dep - b.dep))
  const qs = new URLSearchParams({ ...params, pax: String(params.pax) }).toString()
  const busy = useJourney(qs)
  const pickDate = (date) => { setOpenId(null); setSp({ ...Object.fromEntries(sp), date }) }

  return (
    <>
      <PageHead photo={destinations.find((d) => d.code === params.to)?.img}>
        <SearchSummary key={qs} defaults={params}
          title={<>{airports[params.from].city} <span className="text-muted">←</span> {airports[params.to]?.city}</>}
          meta={`${dateAr(params.date)} · ${params.pax} مسافر`} />
        <div className="mt-6"><Stepper steps={steps.flight} current={0} /></div>
      </PageHead>

      <div className="container-x pt-8"><FareCalendar params={params} onPick={pickDate} /></div>

      <div className="container-x grid gap-6 py-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-5">
            <h3 className="mb-3 font-semibold">ترتيب حسب</h3>
            <div className="grid grid-cols-3 gap-1 rounded-md bg-mist p-1 text-xs font-semibold lg:grid-cols-1">
              {[['price', 'الأرخص'], ['fast', 'الأسرع'], ['early', 'الأبكر']].map(([k, l]) => (
                <button key={k} onClick={() => setSort(k)} className={`rounded-md py-2 transition ${sort === k ? 'bg-white ring-1 ring-line' : 'text-muted'}`}>{l}</button>
              ))}
            </div>
            <label className="mt-5 flex cursor-pointer items-center justify-between text-sm">
              رحلات مباشرة فقط
              <input type="checkbox" checked={directOnly} onChange={(e) => setDirectOnly(e.target.checked)} className="peer sr-only" />
              <span className="relative h-6 w-11 rounded-full bg-line transition peer-checked:bg-brand after:absolute after:top-1 after:start-1 after:size-4 after:rounded-full after:bg-white after:transition peer-checked:after:-translate-x-5" />
            </label>
          </div>
          <div className="card hidden p-5 lg:block">
            <h3 className="mb-3 font-semibold">شركات الطيران</h3>
            <div className="space-y-2.5">
              {codes.map((c) => (
                <label key={c} className="flex cursor-pointer items-center gap-3 text-sm">
                  <input type="checkbox" className="size-4 accent-brand" checked={!hidden.includes(c)} onChange={() => setHidden(hidden.includes(c) ? hidden.filter((x) => x !== c) : [...hidden, c])} />
                  <img src={airlineLogo(c)} alt="" className="h-5 w-12 object-contain" />
                  <span className="truncate">{airlines[c].name}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <section className="space-y-3">
          {busy ? <JourneyLoader from={params.from} to={params.to} /> : <>
          <p className="text-sm text-muted">{list.length} رحلة · الأسعار لجميع المسافرين وشاملة الضرائب</p>
          {list.map((f, i) => (
            <article key={f.id} style={{ animationDelay: `${i * 50}ms` }} className={`card animate-rise overflow-hidden ${openId === f.id ? 'border-ink' : 'card-hover'}`}>
              <FlightRow f={f} action={
                <div className="flex items-center justify-between gap-4 border-t border-dashed border-line pt-4 sm:w-44 sm:flex-col sm:items-end sm:border-t-0 sm:border-s sm:ps-6 sm:pt-0">
                  <div className="sm:text-end">
                    <p className="text-xs text-muted">{i === 0 && sort === 'price' ? 'أفضل سعر · ' : ''}ابتداءً من</p>
                    <p className="text-xl font-bold">{iqd(f.price)}</p>
                  </div>
                  <button onClick={() => setOpenId(openId === f.id ? null : f.id)} aria-expanded={openId === f.id} className={`${openId === f.id ? 'btn-ghost' : 'btn-primary'} px-5 py-2.5 text-sm`}>
                    {openId === f.id ? 'إخفاء' : 'اختيار'}
                    <Icon name="arrow" className={`size-4 transition ${openId === f.id ? '-rotate-90' : 'rotate-90'}`} />
                  </button>
                </div>
              } />
              {openId === f.id && <FarePicker f={f} qs={qs} />}
            </article>
          ))}
          {!list.length && <div className="card p-10 text-center text-muted">لا توجد رحلات بهذه المعايير. جرّب إزالة بعض الفلاتر.</div>}
          </>}
        </section>
      </div>
    </>
  )
}
