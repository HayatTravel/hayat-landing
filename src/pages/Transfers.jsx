import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import Combobox from '../components/Combobox'
import Icon from '../components/Icon'
import { Photo, Stepper } from '../components/ui'
import { airports } from '../data/flights'
import { transferHero, transferPrice, vehicles, zones } from '../data/transfers'
import { addDays, iqd } from '../lib/format'
import { steps } from '../lib/order'

const airportOptions = Object.entries(airports).map(([c, a]) => ({ value: c, code: c, title: a.city, sub: a.name }))
const control = 'w-full appearance-none bg-transparent pt-0.5 text-[15px] font-semibold text-ink outline-none'

function Field({ label, icon, children }) {
  return (
    <label className="block rounded-md border border-line bg-white px-4 pt-2.5 pb-2 transition focus-within:border-ink hover:border-ink/40">
      <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted"><Icon name={icon} className="size-3.5" /> {label}</span>
      {children}
    </label>
  )
}

export default function Transfers() {
  const [sp, setSp] = useSearchParams()
  const searched = sp.has('airport')
  const [f, setF] = useState({ mode: 'transfer', airport: 'DXB', zone: 'hotels', date: addDays(14), time: '14:30', pax: '2', hours: '4', ...Object.fromEntries(sp) })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const chauffeur = f.mode === 'chauffeur'
  const list = vehicles.filter((v) => v.pax >= +(sp.get("pax") || f.pax))
  const submit = (e) => { e.preventDefault(); setSp(f) }
  const q = (v) => new URLSearchParams({ ...Object.fromEntries(sp), type: 'transfer', vehicle: v.id })

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink pt-28 pb-24 text-white">
        <Photo id={transferHero} w={2000} eager alt="" className="absolute inset-0 -z-20 size-full animate-kenburns" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-l from-ink/85 via-ink/55 to-ink/30" />
        <div className="container-x">
          <h1 className="animate-rise text-3xl font-bold sm:text-5xl">{chauffeur ? <>سائق خاص <span className="text-shimmer">بانتظارك</span></> : <>من المطار <span className="text-shimmer">إلى باب الفندق</span></>}</h1>
          <p className="mt-3 max-w-lg animate-rise text-white/75 [animation-delay:100ms]">سعر ثابت، سائق يحمل لوحة باسمك، وانتظار مجاني 60 دقيقة إذا تأخرت رحلتك.</p>
        </div>
      </section>

      <div className="container-x relative z-10 -mt-12 pb-16">
        <form onSubmit={submit} className="card animate-rise p-4 sm:p-5">
          <div className="mb-4 inline-flex rounded-md border border-line p-1 text-sm">
            {[['transfer', 'نقل من/إلى المطار'], ['chauffeur', 'سائق بالساعة']].map(([m, l]) => (
              <button key={m} type="button" onClick={() => setF({ ...f, mode: m })} className={`rounded-sm px-4 py-1.5 transition ${f.mode === m ? 'bg-ink text-white' : 'text-muted hover:text-ink'}`}>{l}</button>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-[1.3fr_1fr_1fr_0.8fr_0.7fr_auto]">
            <Combobox label={chauffeur ? 'المدينة' : 'المطار'} icon="plane" value={f.airport} onChange={(v) => setF({ ...f, airport: v })} options={airportOptions} />
            {chauffeur ? (
              <Field label="المدة" icon="clock"><select className={control} value={f.hours} onChange={set('hours')}>{[3, 4, 6, 8, 10, 12].map((h) => <option key={h} value={h}>{h} ساعات</option>)}</select></Field>
            ) : (
              <Field label="إلى" icon="pin"><select className={control} value={f.zone} onChange={set('zone')}>{zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}</select></Field>
            )}
            <Field label="التاريخ" icon="calendar"><input type="date" className={control} value={f.date} min={addDays(0)} onChange={set('date')} required /></Field>
            <Field label="الوقت" icon="clock"><input type="time" className={control} value={f.time} onChange={set('time')} required /></Field>
            <Field label="الركاب" icon="user"><select className={control} value={f.pax} onChange={set('pax')}>{[1, 2, 3, 4, 5, 6, 7].map((n) => <option key={n}>{n}</option>)}</select></Field>
            <button className="btn-primary min-h-14 px-8"><Icon name="search" className="size-5" /> عرض الأسعار</button>
          </div>
        </form>

        {searched && (
          <section className="mt-8">
            <div className="mb-5"><Stepper steps={steps.transfer} current={1} /></div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {list.map((v, i) => (
                <article key={v.id} style={{ animationDelay: `${i * 60}ms` }} className="card card-hover flex animate-rise flex-col overflow-hidden">
                  <Photo id={v.img} w={600} alt={v.model} className="h-40 w-full" />
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-bold">{v.name}</h3>
                    <p className="text-xs text-muted">{v.model}</p>
                    <p className="mt-3 flex gap-4 text-xs text-muted">
                      <span className="flex items-center gap-1"><Icon name="user" className="size-3.5" />حتى {v.pax}</span>
                      <span className="flex items-center gap-1"><Icon name="bag" className="size-3.5" />{v.bags} حقائب</span>
                    </p>
                    <div className="mt-auto flex items-end justify-between pt-5">
                      <div><p className="text-xl font-bold">{iqd(transferPrice(v, Object.fromEntries(sp)))}</p><p className="text-xs text-muted">{sp.get('mode') === 'chauffeur' ? `${sp.get('hours')} ساعات` : 'سعر ثابت للرحلة'}</p></div>
                      <Link to={`/checkout?${q(v)}`} className="btn-primary px-5 py-2.5 text-sm">احجز</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {list.length < vehicles.length && <p className="mt-4 text-xs text-muted">أُخفيت المركبات التي لا تتسع لـ {sp.get('pax')} ركاب.</p>}
          </section>
        )}
      </div>
    </>
  )
}
