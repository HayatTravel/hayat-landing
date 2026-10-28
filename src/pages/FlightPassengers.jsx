import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { PageHead } from '../components/Layout'
import Icon from '../components/Icon'
import TripBar from '../components/TripBar'
import { Stepper } from '../components/ui'
import { buildOrder, stepOf, steps } from '../lib/order'
import { addDays } from '../lib/format'
import { loadPassengers, savePassengers } from '../lib/passengers'
import NotFound from './NotFound'

export default function FlightPassengers() {
  const { id } = useParams()
  const [sp] = useSearchParams()
  const go = useNavigate()
  const order = buildOrder(new URLSearchParams({ ...Object.fromEntries(sp), type: 'flight', id }))
  const [list, setList] = useState(() => loadPassengers(+sp.get('pax') || 1))
  if (!order) return <NotFound />

  const set = (i, k) => (e) => setList(list.map((p, j) => (j === i ? { ...p, [k]: e.target.value } : p)))
  const submit = (e) => {
    e.preventDefault()
    savePassengers(list)
    go(`/flights/${id}/seats?${sp}`)
  }

  return (
    <>
      <PageHead>
        <Link to={`/flights?${sp}`} className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-brand"><Icon name="arrow" className="size-4" /> تغيير الرحلة</Link>
        <Stepper steps={steps.flight} current={stepOf('flight', 'المسافرون')} />
      </PageHead>
      <TripBar order={order} action={{ label: 'المقاعد والإضافات', form: 'pax-form' }} />

      <form id="pax-form" onSubmit={submit} className="container-x max-w-3xl space-y-5 py-10">
        <div>
          <h1 className="text-2xl font-bold">بيانات المسافرين</h1>
          <p className="mt-1 text-sm text-muted">أدخل الأسماء كما تظهر في جواز السفر تماماً.</p>
        </div>
        {list.map((p, i) => (
          <fieldset key={i} style={{ animationDelay: `${i * 80}ms` }} className="card animate-rise p-6">
            <legend className="sr-only">المسافر {i + 1}</legend>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-semibold">المسافر {i + 1} {i === 0 && <span className="text-xs font-normal text-muted">· جهة الاتصال الرئيسية</span>}</h2>
              <span className="text-xs text-muted">بالغ</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-[120px_1fr_1fr]">
              <div><label className="label" htmlFor={`t${i}`}>اللقب</label>
                <select id={`t${i}`} className="field" value={p.title} onChange={set(i, 'title')}><option>السيد</option><option>السيدة</option><option>الآنسة</option></select></div>
              <div><label className="label" htmlFor={`f${i}`}>الاسم الأول</label><input id={`f${i}`} className="field" required value={p.first} onChange={set(i, 'first')} /></div>
              <div><label className="label" htmlFor={`l${i}`}>اسم العائلة</label><input id={`l${i}`} className="field" required value={p.last} onChange={set(i, 'last')} /></div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><label className="label" htmlFor={`d${i}`}>تاريخ الميلاد</label><input id={`d${i}`} type="date" className="field" required max={addDays(0)} value={p.dob} onChange={set(i, 'dob')} /></div>
              <div><label className="label" htmlFor={`p${i}`}>رقم جواز السفر</label><input id={`p${i}`} dir="ltr" className="field text-start uppercase" required value={p.passport} onChange={set(i, 'passport')} /></div>
            </div>
          </fieldset>
        ))}
        <p className="flex items-center gap-2 text-xs text-muted"><Icon name="shield" className="size-4 text-emerald-500" /> تُحفظ البيانات على جهازك فقط خلال هذه الجلسة (نموذج تجريبي).</p>
      </form>
    </>
  )
}
