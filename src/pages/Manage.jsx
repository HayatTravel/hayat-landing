import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { PageHead } from '../components/Layout'
import SearchPanel from '../components/SearchPanel'
import Icon from '../components/Icon'
import { OrderSummary } from './Checkout'
import { airlineLogo, addDays, dateAr, hm, seeded } from '../lib/format'
import { airlines, airports, searchFlights } from '../data/flights'
import { buildOrder } from '../lib/order'
import { findBooking } from '../lib/bookings'

const demoDest = ['DXB', 'IST', 'BEY', 'CAI', 'AMM', 'GYD', 'TBS']

// A booking made in this browser if we have it, otherwise a stable demo flight for any reference.
function lookup(ref) {
  const saved = findBooking(ref)
  if (saved) return new URLSearchParams(saved)
  const r = seeded(ref)
  const params = { from: 'BGW', to: demoDest[Math.floor(r() * demoDest.length)], date: addDays(5 + Math.floor(r() * 30)), pax: '1', cabin: 'economy' }
  return new URLSearchParams({ ...params, type: 'flight', id: searchFlights(params)[0].id, fare: 'flex', seats: '12A' })
}

export function Manage() {
  const [sp] = useSearchParams()
  const ref = (sp.get('ref') || '').toUpperCase()
  const [note, setNote] = useState('')
  if (!/^[A-Z0-9]{6}$/.test(ref)) {
    return (
      <PageHead className="min-h-dvh">
        <h1 className="mb-6 text-2xl font-bold">إدارة الحجز</h1>
        <SearchPanel initial="manage" />
        {ref && <p className="mt-4 text-sm text-ember">رقم الحجز يتكوّن من 6 أحرف وأرقام، مثل BZ27EM.</p>}
      </PageHead>
    )
  }
  const q = lookup(ref)
  const o = buildOrder(q)
  const isFlight = o?.type === 'flight'
  const actions = isFlight
    ? [['seat', 'تغيير المقعد', `/flights/${q.get('id')}/seats?${q}`], ['bag', 'إضافة أمتعة', `/flights/${q.get('id')}/seats?${q}`], ['calendar', 'تغيير الموعد', null], ['close', 'إلغاء الحجز', null]]
    : [['calendar', 'تعديل التواريخ', null], ['headset', 'تواصل مع الدعم', 'tel:+9647700000000'], ['close', 'إلغاء الحجز', null]]

  return (
    <>
      <PageHead>
        <p className="text-sm text-muted">رقم الحجز</p>
        <h1 className="font-mono text-3xl font-bold tracking-[.2em] text-brand" dir="ltr">{ref}</h1>
      </PageHead>
      <div className="container-x grid gap-8 py-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {isFlight && (
            <div className="card animate-rise p-6">
              <div className="flex items-center justify-between">
                <img src={airlineLogo(o.flight.code)} alt={airlines[o.flight.code].name} className="h-10 w-24 rounded-md bg-white object-contain p-1.5" />
                <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">مؤكد</span>
              </div>
              <div className="mt-5 flex items-center gap-4">
                <div><p className="text-3xl font-bold" dir="ltr">{hm(o.flight.dep)}</p><p className="text-sm text-muted">{airports[o.flight.from].city}</p></div>
                <div className="h-px flex-1 bg-line" />
                <div className="text-end"><p className="text-3xl font-bold" dir="ltr">{hm(o.flight.arr)}</p><p className="text-sm text-muted">{airports[o.flight.to].city}</p></div>
              </div>
              <p className="mt-4 text-sm text-muted">{dateAr(o.flight.date)} · يفتح تسجيل الوصول عبر الإنترنت قبل 48 ساعة من الإقلاع.</p>
            </div>
          )}
          <div className="grid animate-rise grid-cols-2 gap-3 [animation-delay:100ms] sm:grid-cols-4">
            {actions.map(([ic, label, to]) => {
              const cls = 'flex flex-col items-center gap-2 rounded-md border border-line bg-white p-4 text-sm font-medium transition hover:border-ink'
              const inner = <><Icon name={ic} className={`size-5 ${ic === 'close' ? 'text-ember' : 'text-brand'}`} />{label}</>
              return to ? <Link key={label} to={to} className={cls}>{inner}</Link>
                : <button key={label} onClick={() => setNote(`«${label}» غير متاح في النموذج التجريبي — سيتواصل معك فريقنا.`)} className={cls}>{inner}</button>
            })}
          </div>
          {note && <p className="animate-fade rounded-md border border-line bg-mist p-4 text-sm">{note}</p>}
        </div>
        <aside className="animate-rise [animation-delay:150ms]">{o && <OrderSummary o={o} />}</aside>
      </div>
    </>
  )
}

const stages = ['مجدولة', 'الصعود', 'أقلعت', 'هبطت']

export function Status() {
  const [sp] = useSearchParams()
  const no = (sp.get('no') || '').toUpperCase()
  const date = sp.get('date') || addDays(0)
  const m = no.match(/^([A-Z0-9]{2})(\d{2,4})$/)
  if (!m) {
    return (
      <PageHead className="min-h-dvh">
        <h1 className="mb-6 text-2xl font-bold">حالة الرحلة</h1>
        <SearchPanel initial="status" />
        {no && <p className="mt-4 text-sm text-ember">أدخل رقم رحلة صحيحاً، مثل EK 944.</p>}
      </PageHead>
    )
  }
  const [, code, num] = m
  const known = airlines[code]
  const r = seeded(no + date)
  const to = known && airports[known.hub] && known.hub !== 'BGW' ? known.hub : demoDest[Math.floor(r() * demoDest.length)]
  const dep = 6 * 60 + Math.floor(r() * 16 * 4) * 15
  const dur = 90 + Math.floor(r() * 150)
  const delay = r() > 0.7 ? 20 + Math.floor(r() * 4) * 10 : 0
  const now = new Date()
  const mins = date === addDays(0) ? now.getHours() * 60 + now.getMinutes() : date < addDays(0) ? 99999 : -1
  const t = dep + delay
  const stage = mins >= t + dur ? 3 : mins >= t ? 2 : mins >= t - 40 ? 1 : 0
  const progress = stage === 3 ? 100 : stage === 2 ? Math.min(95, ((mins - t) / dur) * 100) : 0

  return (
    <>
      <PageHead>
        <p className="text-sm text-muted">{dateAr(date)}</p>
        <h1 className="flex items-center gap-3 text-3xl font-bold">
          {known && <img src={airlineLogo(code)} alt={known.name} className="h-10 w-24 rounded-md bg-white object-contain p-1.5" />}
          <bdi dir="ltr">{code} {num}</bdi>
        </h1>
        {known && <p className="mt-1 text-sm text-muted">{known.name}</p>}
      </PageHead>
      <div className="container-x max-w-4xl space-y-6 py-10">
        <div className="card animate-rise p-6">
          <div className="flex items-center justify-between">
            <div><p className="text-3xl font-bold" dir="ltr">{hm(t)}</p><p className="text-sm text-muted">بغداد · BGW</p>{delay > 0 && <p className="text-xs text-ember">متأخرة {delay} دقيقة (المجدول <bdi dir="ltr">{hm(dep)}</bdi>)</p>}</div>
            <span className={`rounded-md px-3 py-1 text-sm font-semibold ${stage === 3 ? 'bg-emerald-50 text-emerald-700' : delay ? 'bg-ember/10 text-ember' : 'bg-mist'}`}>{stages[stage]}</span>
            <div className="text-end"><p className="text-3xl font-bold" dir="ltr">{hm(t + dur)}</p><p className="text-sm text-muted">{airports[to].city} · {to}</p></div>
          </div>
          <div className="relative mt-8 h-1 rounded-sm bg-line">
            <div className="absolute inset-y-0 start-0 rounded-sm bg-brand transition-all duration-1000" style={{ width: `${progress}%` }} />
            <span className="absolute top-1/2 -translate-y-1/2 bg-white px-1 transition-all duration-1000" style={{ insetInlineStart: `calc(${progress}% - 14px)` }}><Icon name="plane" className="size-5 rotate-[-45deg] -scale-x-100 text-brand" /></span>
          </div>
          <ol className="mt-8 grid grid-cols-4 text-center text-xs">
            {stages.map((s, i) => (
              <li key={s} className={i <= stage ? 'font-semibold text-ink' : 'text-muted'}>
                <span className={`mx-auto mb-2 block size-2.5 rounded-full ${i <= stage ? 'bg-brand' : 'bg-line'}`} />{s}
              </li>
            ))}
          </ol>
        </div>
        <div className="grid animate-rise grid-cols-3 gap-3 text-center [animation-delay:100ms]">
          {[['المبنى', 'T1'], ['البوابة', `${'ABC'[Math.floor(r() * 3)]}${1 + Math.floor(r() * 20)}`], ['الحزام', `${1 + Math.floor(r() * 8)}`]].map(([k, v]) => (
            <div key={k} className="card p-4"><p className="text-xs text-muted">{k}</p><p className="mt-1 text-xl font-bold" dir="ltr">{v}</p></div>
          ))}
        </div>
      </div>
    </>
  )
}
