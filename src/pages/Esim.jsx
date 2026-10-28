import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { PageHead } from '../components/Layout'
import Icon from '../components/Icon'
import { Stepper } from '../components/ui'
import { esimCountries, esimPlans } from '../data/esim'
import { flag, iqd } from '../lib/format'
import { steps } from '../lib/order'
import NotFound from './NotFound'

export function EsimCountries() {
  const [q, setQ] = useState('')
  const [region, setRegion] = useState('الكل')
  const regions = ['الكل', ...new Set(esimCountries.map((c) => c.region))]
  const list = esimCountries.filter((c) => (region === 'الكل' || c.region === region) && c.name.includes(q.trim()))

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink pt-32 pb-24 text-white">
        <div aria-hidden="true" className="absolute -top-40 end-[15%] -z-10 size-[560px] animate-[aurora_14s_ease-in-out_infinite] rounded-full bg-brand/30 blur-[130px]" />
        <div aria-hidden="true" className="absolute -bottom-72 start-[10%] -z-10 size-[520px] animate-[aurora_18s_ease-in-out_infinite_reverse] rounded-full bg-plum-400/30 blur-[130px]" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,.09)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="container-x text-center">
          <span className="chip animate-rise bg-white/10 text-white"><Icon name="sim" className="size-3.5" /> eSIM من حياة</span>
          <h1 className="mt-5 animate-rise text-4xl font-bold [animation-delay:100ms] sm:text-6xl">إنترنت في جيبك، <span className="text-shimmer">في كل مكان</span></h1>
          <p className="mx-auto mt-5 max-w-xl animate-rise text-white/70 [animation-delay:200ms]">اختر وجهتك، ادفع بالدينار، وامسح رمز QR — تتصل خلال دقيقتين.</p>
          <div className="mx-auto mt-10 flex max-w-xl animate-rise items-center gap-3 rounded-md bg-white p-2 ps-5 text-ink shadow-[0_0_0_6px_rgba(255,255,255,.08),0_30px_80px_-20px_rgba(61,126,255,.6)] [animation-delay:300ms]">
            <Icon name="search" className="size-5 text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث عن دولة… مثلاً تركيا" className="flex-1 bg-transparent py-2 outline-none placeholder:text-muted" />
          </div>
        </div>
      </section>
      <div className="container-x -mt-7 py-6">
        <div className="mx-auto mb-10 flex w-fit max-w-full gap-1 overflow-x-auto rounded-md bg-white p-1 ring-1 ring-line">
          {regions.map((r) => <button key={r} onClick={() => setRegion(r)} className={`shrink-0 rounded-md px-4 py-2 text-sm transition ${region === r ? 'bg-ink text-white' : 'text-muted hover:text-ink'}`}>{r}</button>)}
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((c, i) => (
            <Link key={c.cc} to={`/esim/${c.cc}`} style={{ animationDelay: `${i * 40}ms` }} className="card card-hover group flex animate-rise items-center gap-4 p-4">
              <img src={flag(c.cc)} alt="" className="size-12 rounded-full object-cover ring-1 ring-line" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{c.name}</p>
                <p className="text-xs text-muted">من {iqd(c.from)}</p>
              </div>
              <Icon name="arrow" className="size-4 -scale-x-100 text-muted transition group-hover:-translate-x-1 group-hover:text-brand" />
            </Link>
          ))}
        </div>
        {!list.length && <p className="py-10 text-center text-muted">لا توجد نتائج لـ "{q}"</p>}

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {[['globe', 'اختر وجهتك', 'أكثر من 190 دولة وباقات إقليمية.'], ['sim', 'استلم رمز QR', 'يصلك فوراً على البريد وواتساب.'], ['wifi', 'امسح واتصل', 'فعّل الباقة عند الوصول واستمتع.']].map(([ic, t, d], i) => (
            <div key={t} className="card p-6">
              <span className="text-5xl font-bold text-line">0{i + 1}</span>
              <h3 className="mt-3 flex items-center gap-2 text-lg font-bold"><Icon name={ic} className="size-5 text-brand" />{t}</h3>
              <p className="mt-2 text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export function EsimPlans() {
  const { cc } = useParams()
  const go = useNavigate()
  const c = esimCountries.find((x) => x.cc === cc)
  const [pick, setPick] = useState('3gb')
  if (!c) return <NotFound />
  const plans = esimPlans(c)

  return (
    <>
      <PageHead>
        <Link to="/esim" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-brand"><Icon name="arrow" className="size-4" /> كل الدول</Link>
        <Stepper steps={steps.esim} current={1} />
      </PageHead>
      <div className="container-x py-10">
        <div className="flex animate-rise items-center gap-5">
          <img src={flag(c.cc)} alt="" className="size-20 rounded-full object-cover ring-4 ring-white" />
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">eSIM {c.name}</h1>
            <p className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted"><span className="flex items-center gap-1"><Icon name="wifi" className="size-4" /> <bdi dir="ltr">4G / 5G</bdi></span><span>الشبكة: <bdi dir="ltr">{c.network}</bdi></span></p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {plans.map((p, i) => (
            <button key={p.id} onClick={() => setPick(p.id)} style={{ animationDelay: `${i * 70}ms` }}
              className={`relative animate-rise rounded-3xl p-6 text-start transition duration-300 ${pick === p.id ? 'bg-ink text-white' : 'bg-white ring-1 ring-line hover:ring-brand/50'}`}>
              {p.tag && <span className="absolute -top-3 start-6 rounded-md bg-brand px-3 py-1 text-xs font-semibold text-white">{p.tag}</span>}
              <p className="text-5xl font-bold"><bdi dir="ltr">{p.data}</bdi></p>
              <p className={`mt-1 text-sm ${pick === p.id ? 'text-white/60' : 'text-muted'}`}><bdi dir="ltr">{p.unit === 'GB' ? 'GB' : ''}</bdi>{p.unit !== 'GB' && p.unit} · {p.days} يوماً</p>
              <p className="mt-8 text-lg font-bold">{iqd(p.price)}</p>
              <span className={`absolute top-6 end-6 grid size-6 place-items-center rounded-full transition ${pick === p.id ? 'bg-brand' : 'ring-1 ring-line'}`}>{pick === p.id && <Icon name="check" className="size-4" strokeWidth={3} />}</span>
            </button>
          ))}
        </div>

        <div className="mt-10 grid items-center gap-6 rounded-3xl bg-white p-6 ring-1 ring-line md:grid-cols-[1fr_auto]">
          <ul className="grid gap-3 text-sm sm:grid-cols-2">
            {['تفعيل فوري بعد الدفع', 'يعمل مع iPhone XS وأحدث و Pixel و Galaxy S20+', 'احتفظ برقمك العراقي لواتساب', 'مشاركة الإنترنت (Hotspot) مسموحة'].map((t) => (
              <li key={t} className="flex items-center gap-2"><Icon name="check" className="size-4 shrink-0 text-emerald-500" />{t}</li>
            ))}
          </ul>
          <button onClick={() => go(`/checkout?type=esim&cc=${c.cc}&plan=${pick}`)} className="btn-primary px-10 py-4">
            اشترِ الآن · {iqd(plans.find((p) => p.id === pick).price)}
          </button>
        </div>
      </div>
    </>
  )
}
