import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { PageHead } from '../components/Layout'
import Icon from '../components/Icon'
import { Photo, Stepper } from '../components/ui'
import { airlineLogo, bookingRef, flag, iqd } from '../lib/format'
import { buildOrder, stepOf, steps } from '../lib/order'
import NotFound from './NotFound'

const methods = [
  { id: 'zain', name: 'زين كاش', note: 'محفظة إلكترونية', color: 'bg-[#e4007c]', mark: 'Zain' },
  { id: 'qi', name: 'كي كارد', note: 'بطاقة الدفع العراقية', color: 'bg-[#f7b500]', mark: 'Qi' },
  { id: 'fib', name: 'FIB', note: 'المصرف الأول العراقي', color: 'bg-[#00a19a]', mark: 'FIB' },
  { id: 'card', name: 'فيزا / ماستركارد', note: 'بطاقة دولية', color: 'bg-[#1a1f71]', mark: 'VISA' },
]

export function OrderSummary({ o }) {
  return (
    <div className="card overflow-hidden">
      {o.img && <Photo id={o.img} w={700} alt="" className="h-36 w-full" />}
      <div className="p-6">
        <div className="flex items-center gap-3">
          {o.logo && <img src={airlineLogo(o.logo)} alt="" className="h-8 w-20 object-contain" />}
          {o.flag && <img src={flag(o.flag)} alt="" className="size-10 rounded-full object-cover" />}
        </div>
        <h3 className="mt-3 text-lg font-bold">{o.title}</h3>
        <p className="text-sm text-muted">{o.subtitle}</p>
        <dl className="mt-5 space-y-3 text-sm">
          {o.lines.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4"><dt className="text-muted">{k}</dt><dd className="text-end font-medium"><bdi>{typeof v === 'number' ? iqd(v) : v}</bdi></dd></div>
          ))}
        </dl>
        <div className="my-5 border-t border-dashed border-line" />
        <div className="flex items-end justify-between"><span className="text-muted">الإجمالي</span><span className="text-2xl font-bold">{iqd(o.total)}</span></div>
      </div>
    </div>
  )
}

export default function Checkout() {
  const [sp] = useSearchParams()
  const go = useNavigate()
  const o = buildOrder(sp)
  const [method, setMethod] = useState('zain')
  const [paying, setPaying] = useState(false)
  if (!o) return <NotFound />

  const pay = (e) => {
    e.preventDefault()
    setPaying(true)
    const next = new URLSearchParams(sp)
    next.set('ref', bookingRef(sp.toString()))
    setTimeout(() => go(`/confirmation?${next}`), 1400)
  }

  return (
    <>
      <PageHead>
        <button onClick={() => history.back()} className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-brand"><Icon name="arrow" className="size-4" /> رجوع</button>
        <Stepper steps={steps[o.type]} current={stepOf(o.type, 'الدفع')} />
      </PageHead>
      <form onSubmit={pay} className="container-x grid gap-8 py-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="card animate-rise p-6">
            <h2 className="text-xl font-bold">{o.type === 'flight' ? 'بيانات التواصل' : `بيانات ${o.type === 'esim' ? 'المستلم' : 'الحجز'}`}</h2>
            <p className="mt-1 text-sm text-muted">{o.type === 'flight' ? 'سنرسل التذاكر وتحديثات الرحلة إلى هنا' : 'سنرسل التأكيد إلى هذه البيانات'}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {o.type !== 'flight' && <>
                <div><label className="label">الاسم الأول</label><input className="field" required defaultValue="علي" /></div>
                <div><label className="label">اسم العائلة</label><input className="field" required defaultValue="الحسيني" /></div>
              </>}
              <div><label className="label">رقم الهاتف</label><input className="field text-start" dir="ltr" type="tel" required defaultValue="+964 770 123 4567" /></div>
              <div><label className="label">البريد الإلكتروني</label><input className="field text-start" dir="ltr" type="email" required defaultValue="ali@example.com" /></div>
            </div>
          </section>

          <section className="card animate-rise p-6 [animation-delay:100ms]">
            <h2 className="text-xl font-bold">طريقة الدفع</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {methods.map((m) => (
                <label key={m.id} className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition ${method === m.id ? 'border-brand bg-brand/5 ' : 'border-line hover:border-brand/40'}`}>
                  <input type="radio" name="pm" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} className="sr-only" />
                  <span className={`grid h-10 w-14 place-items-center rounded-xl ${m.color} text-xs font-black tracking-wide text-white`}>{m.mark}</span>
                  <span className="flex-1"><span className="block font-semibold">{m.name}</span><span className="text-xs text-muted">{m.note}</span></span>
                  <span className={`grid size-5 place-items-center rounded-full ring-2 transition ${method === m.id ? 'ring-brand' : 'ring-line'}`}>{method === m.id && <span className="size-2.5 rounded-full bg-brand" />}</span>
                </label>
              ))}
            </div>
            <p className="mt-5 flex items-center gap-2 rounded-2xl bg-mist p-4 text-sm text-muted"><Icon name="shield" className="size-5 shrink-0 text-emerald-500" /> هذا نموذج تجريبي — لن يتم خصم أي مبلغ. سيتم تحويلك إلى صفحة الدفع الآمنة الخاصة بالمزوّد.</p>
          </section>
        </div>

        <aside className="animate-rise space-y-4 [animation-delay:150ms] lg:sticky lg:top-24 lg:self-start">
          <OrderSummary o={o} />
          <button disabled={paying} className="btn-primary w-full py-4 text-base">
            {paying ? <><span className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> جارٍ تأكيد الدفع…</> : <>ادفع {iqd(o.total)}</>}
          </button>
          <p className="text-center text-xs text-muted">بالمتابعة فإنك توافق على <Link to="/" className="underline">الشروط والأحكام</Link></p>
        </aside>
      </form>
    </>
  )
}
