import { useState } from 'react'
import { createSearchParams, useNavigate } from 'react-router'
import Icon from './Icon'
import Combobox from './Combobox'
import { airports } from '../data/flights'
import { destinations } from '../data/places'
import { esimCountries } from '../data/esim'
import { addDays } from '../lib/format'

const tabs = [
  { id: 'flights', label: 'طيران', icon: 'plane' },
  { id: 'hotels', label: 'فنادق', icon: 'bed' },
  { id: 'cars', label: 'سيارات', icon: 'car' },
  { id: 'esim', label: 'eSIM', icon: 'sim' },
]
const extra = [
  { id: 'manage', label: 'إدارة الحجز', icon: 'ticket' },
  { id: 'status', label: 'حالة الرحلة', icon: 'clock' },
]
const cabins = { economy: 'السياحية', premium: 'السياحية الممتازة', business: 'رجال الأعمال' }
const iraq = ['BGW', 'EBL', 'BSR', 'NJF']

const airportOptions = [...iraq, ...Object.keys(airports).filter((c) => !iraq.includes(c))]
  .map((c) => ({ value: c, code: c, title: airports[c].city, sub: `${airports[c].name}، ${airports[c].country}` }))
const cityOptions = destinations.map((d) => ({ value: d.code, title: d.city, sub: d.country }))
const esimOptions = esimCountries.map((c) => ({ value: c.cc, title: c.name, sub: c.region }))

function Field({ label, icon, children, className = '' }) {
  return (
    <label className={`block rounded-md border border-line bg-white px-4 pt-2.5 pb-2 transition focus-within:border-ink hover:border-ink/40 ${className}`}>
      <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted"><Icon name={icon} className="size-3.5" /> {label}</span>
      {children}
    </label>
  )
}
const control = 'w-full appearance-none bg-transparent pt-0.5 text-[15px] font-semibold text-ink outline-none'

function Submit({ children, icon = 'search' }) {
  return <button className="btn-primary min-h-14 w-full px-8 text-base md:w-auto"><Icon name={icon} className={`size-5 ${icon === 'arrow' ? '-scale-x-100' : ''}`} />{children}</button>
}

export default function SearchPanel({ initial = 'flights', defaults = {}, expanded = false }) {
  const [tab, setTab] = useState(initial)
  const [more, setMore] = useState(expanded) // progressive disclosure for flights
  const go = useNavigate()
  const [f, setF] = useState({ from: 'BGW', to: '', date: addDays(14), pax: 1, cabin: 'economy', city: 'DXB', in: addDays(14), out: addDays(17), guests: 2, cc: 'tr', pick: addDays(14), drop: addDays(18), ref: '', last: '', no: '', sdate: addDays(0), ...defaults })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const val = (k) => (v) => setF({ ...f, [k]: v })

  const submit = (e) => {
    e.preventDefault()
    const q = (o) => `?${createSearchParams(o)}`
    if (tab === 'flights') {
      if (!f.to) return e.currentTarget.querySelector('[data-to] input')?.focus()
      if (!more) return setMore(true)
      go({ pathname: '/flights', search: q({ from: f.from, to: f.to, date: f.date, pax: f.pax, cabin: f.cabin }) })
    }
    if (tab === 'hotels') go({ pathname: '/hotels', search: q({ city: f.city, in: f.in, out: f.out, guests: f.guests }) })
    if (tab === 'cars') go({ pathname: '/cars', search: q({ city: f.city, pick: f.pick, drop: f.drop }) })
    if (tab === 'esim') go(`/esim/${f.cc}`)
    if (tab === 'manage') go({ pathname: '/manage', search: q({ ref: f.ref.trim().toUpperCase() }) })
    if (tab === 'status') go({ pathname: '/status', search: q({ no: f.no.replace(/\s/g, '').toUpperCase(), date: f.sdate }) })
  }

  const tabBtn = (t, secondary) => (
    <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
      className={secondary
        ? `flex items-center gap-1.5 px-2 py-2 text-xs font-medium transition ${tab === t.id ? 'text-brand' : 'text-muted hover:text-ink'}`
        : `relative flex flex-1 items-center justify-center gap-1.5 px-2 pt-3 pb-3.5 text-[13px] font-semibold transition sm:flex-none sm:gap-2 sm:px-5 sm:text-sm ${tab === t.id ? 'text-ink' : 'text-muted hover:text-ink'}`}>
      <Icon name={t.icon} className={`size-4 ${t.id === 'flights' ? '-scale-x-100' : ''}`} />
      {t.label}
      {!secondary && <span className={`absolute inset-x-2 bottom-0 h-0.5 bg-brand transition-transform duration-300 ${tab === t.id ? 'scale-x-100' : 'scale-x-0'}`} />}
    </button>
  )

  return (
    <form onSubmit={submit} className="rounded-lg border border-line bg-white">
      <div className="flex flex-wrap items-center justify-between border-b border-line px-2 sm:px-4">
        <div role="tablist" className="flex w-full sm:w-auto">{tabs.map((t) => tabBtn(t))}</div>
        <div role="tablist" className="flex w-full justify-center gap-2 border-t border-line sm:w-auto sm:border-0">{extra.map((t) => tabBtn(t, true))}</div>
      </div>

      <div key={tab} className="animate-fade p-4 sm:p-5">
        {tab === 'flights' && (
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <div className="relative grid gap-3 sm:grid-cols-2 md:col-span-2">
                <Combobox label="من" value={f.from} onChange={val('from')} options={airportOptions.filter((o) => o.value !== f.to)} />
                <button type="button" onClick={() => setF({ ...f, from: f.to, to: f.from })} disabled={!f.to} aria-label="تبديل"
                  className="absolute top-1/2 left-1/2 z-10 hidden size-9 -translate-1/2 place-items-center rounded-md border border-line bg-white text-brand transition hover:rotate-180 disabled:opacity-0 sm:grid">
                  <Icon name="swap" className="size-4" />
                </button>
                <div data-to>
                  <Combobox label="إلى" value={f.to} onChange={(v) => { setF({ ...f, to: v }); setMore(true) }} options={airportOptions.filter((o) => o.value !== f.from)} placeholder="إلى أين؟" />
                </div>
              </div>
              {!more && <Submit icon="arrow">مواصلة</Submit>}
            </div>
            {more && (
              <div className="grid animate-rise gap-3 md:grid-cols-[1.2fr_1fr_1fr_auto]">
                <Field label="تاريخ المغادرة" icon="calendar">
                  <input type="date" className={control} value={f.date} min={addDays(0)} onChange={set('date')} required />
                </Field>
                <Field label="المسافرون" icon="user">
                  <select className={control} value={f.pax} onChange={set('pax')}>
                    {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} {n === 1 ? 'بالغ' : 'بالغين'}</option>)}
                  </select>
                </Field>
                <Field label="الدرجة" icon="seat">
                  <select className={control} value={f.cabin} onChange={set('cabin')}>
                    {Object.entries(cabins).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </Field>
                <Submit>ابحث عن رحلات</Submit>
              </div>
            )}
          </div>
        )}

        {tab === 'hotels' && (
          <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_0.8fr_auto]">
            <Combobox label="الوجهة" value={f.city} onChange={val('city')} options={cityOptions} />
            <Field label="الوصول" icon="calendar"><input type="date" className={control} value={f.in} min={addDays(0)} onChange={set('in')} required /></Field>
            <Field label="المغادرة" icon="calendar"><input type="date" className={control} value={f.out} min={addDays(1, f.in)} onChange={set('out')} required /></Field>
            <Field label="الضيوف" icon="user">
              <select className={control} value={f.guests} onChange={set('guests')}>{[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}</select>
            </Field>
            <Submit>ابحث</Submit>
          </div>
        )}

        {tab === 'cars' && (
          <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_auto]">
            <Combobox label="مكان الاستلام" icon="car" value={f.city} onChange={val('city')} options={cityOptions} />
            <Field label="الاستلام" icon="calendar"><input type="date" className={control} value={f.pick} min={addDays(0)} onChange={set('pick')} required /></Field>
            <Field label="التسليم" icon="calendar"><input type="date" className={control} value={f.drop} min={addDays(1, f.pick)} onChange={set('drop')} required /></Field>
            <Submit>ابحث عن سيارة</Submit>
          </div>
        )}

        {tab === 'esim' && (
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <Combobox label="إلى أين تسافر؟" icon="globe" value={f.cc} onChange={val('cc')} options={esimOptions} placeholder="اكتب اسم الدولة" />
            <Submit>عرض الباقات</Submit>
          </div>
        )}

        {tab === 'manage' && (
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <Field label="رقم الحجز" icon="ticket"><input className={`${control} uppercase`} dir="ltr" placeholder="ABC123" maxLength={6} value={f.ref} onChange={set('ref')} required /></Field>
            <Field label="اسم العائلة" icon="user"><input className={control} value={f.last} onChange={set('last')} required /></Field>
            <Submit icon="arrow">عرض الحجز</Submit>
          </div>
        )}

        {tab === 'status' && (
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <Field label="رقم الرحلة" icon="plane"><input className={`${control} uppercase`} dir="ltr" placeholder="EK 944" pattern="\s*[A-Za-z0-9]{2}\s*\d{2,4}\s*" title="مثال: EK 944" value={f.no} onChange={set('no')} required /></Field>
            <Field label="التاريخ" icon="calendar"><input type="date" className={control} value={f.sdate} onChange={set('sdate')} required /></Field>
            <Submit>تتبّع الرحلة</Submit>
          </div>
        )}
      </div>
    </form>
  )
}

// One-line recap of the current search; the full form opens only on demand.
export function SearchSummary({ title, meta, initial, defaults }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-muted">{meta}</p>
        </div>
        <button onClick={() => setOpen(!open)} className="btn-ghost px-4 py-2 text-sm">
          <Icon name={open ? 'close' : 'search'} className="size-4" /> {open ? 'إغلاق' : 'تعديل البحث'}
        </button>
      </div>
      {open && <div className="mt-5 animate-fade"><SearchPanel expanded initial={initial} defaults={defaults} /></div>}
    </div>
  )
}
