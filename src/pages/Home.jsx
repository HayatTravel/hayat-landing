import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import SearchPanel from '../components/SearchPanel'
import RouteMap from '../components/art/RouteMap'
import DepartureBoard, { useBaghdadClock } from '../components/art/DepartureBoard'
import EsimPhone from '../components/art/EsimPhone'
import { Barcode } from '../components/art/Ticket'
import { CarArt, ChauffeurArt, DealArt, EsimArt, FlightArt, HotelArt, TransferArt } from '../components/art/ServiceIcons'
import Icon from '../components/Icon'
import { Cta, Photo, Reveal, SectionTitle, useMorph } from '../components/ui'
import { destination, destinations, photos } from '../data/places'
import { airlines } from '../data/flights'
import { deals } from '../data/deals'
import { esimCountries } from '../data/esim'
import { addDays, airlineLogo, flag, img, iqd } from '../lib/format'

const slides = [
  { img: photos.hero, a: 'العالم أقرب', b: 'مما تتخيّل', cta: 'احجز رحلتك', to: '/flights', code: 'IST', label: 'الطيران', flight: 'TK 813' },
  { img: 'photo-1601999705946-fbf42c3c6c66', a: 'المالديف', b: '6 ليالٍ بخصم 19%', cta: 'شاهد العرض', to: '/deals/maldives-honeymoon', code: 'MLE', label: 'المالديف', flight: 'QR 455' },
  { img: 'photo-1508062878650-88b52897f298', a: 'اهبط…', b: 'وأنت متصل', cta: 'تصفح باقات eSIM', to: '/esim', code: 'KUL', label: 'eSIM', flight: 'EY 296' },
]
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

// Glass boarding pass for the current slide; tilts in 3D with the pointer.
function Pass({ s }) {
  const d = destination(s.code)
  const field = (k, v) => <div><p className="text-[10px] text-white/50">{k}</p><p className="font-mono text-sm font-semibold" dir="ltr">{v}</p></div>
  return (
    <div className="hidden [perspective:1100px] lg:block" aria-hidden="true">
      <div className="pass-tilt">
        <div key={s.code} className="pass-card relative w-[330px] animate-[pass-in_1.1s_cubic-bezier(.2,.7,.2,1)_.25s_both] rounded-lg border border-white/25 bg-white/[.08] text-white shadow-[0_30px_80px_-20px_rgba(0,0,0,.6)] backdrop-blur-xl [--perf:178px]">
          <div className="h-[178px] p-5">
            <div className="flex items-center justify-between text-[10px] tracking-[.2em] text-white/60" dir="ltr"><span>BOARDING PASS</span><span>{s.flight}</span></div>
            <div className="mt-4 flex items-center justify-between" dir="ltr">
              <div><p className="font-mono text-4xl font-semibold">BGW</p><p className="text-xs text-white/60">بغداد</p></div>
              <svg viewBox="0 0 120 40" className="h-10 flex-1 px-2" aria-hidden="true">
                <path d="M6 34 Q60 -6 114 34" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="1.5" strokeDasharray="3 4" />
                <path d="M-7,-3 L7,0 L-7,3 L-5,0 Z" fill="#fff" style={{ offsetPath: "path('M6 34 Q60 -6 114 34')", animation: 'fly 3.2s cubic-bezier(.45,0,.2,1) .8s infinite' }} />
              </svg>
              <div className="text-right"><p className="font-mono text-4xl font-semibold text-sky">{s.code}</p><p className="text-xs text-white/60">{d.city}</p></div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">{field('التاريخ', new Date(addDays(14)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase())}{field('المقعد', '14A')}{field('البوابة', 'B12')}</div>
          </div>
          <div className="mx-4 border-t border-dashed border-white/30" />
          <div className="flex items-center gap-4 px-5 py-4">
            <Barcode value={s.code} fill="#fff" className="h-10 flex-1 opacity-70" />
            <div className="text-end"><p className="text-[10px] text-white/50">ابتداءً من</p><p className="text-sm font-bold">{iqd(d.from)}</p></div>
          </div>
          <span className="pointer-events-none absolute inset-0 rounded-lg bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,.18)_45%,transparent_60%)]" />
        </div>
      </div>
    </div>
  )
}

function Hero() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused || reduced()) return
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), 7000)
    return () => clearInterval(t)
  }, [i, paused])
  const s = slides[i]
  const ref = useRef(null)
  // pointer parallax via CSS vars, no re-render
  const tilt = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
    ref.current.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
  }
  return (
    <section ref={ref} onPointerMove={tilt} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      className="relative isolate flex h-[48svh] min-h-[400px] items-center overflow-hidden bg-ink pt-18">
      {slides.map((x, k) => (
        <div key={x.img} aria-hidden="true" className={`hero-layer absolute -inset-6 -z-20 transition-opacity duration-[1400ms] ${k === i ? 'opacity-100' : 'opacity-0'}`}>
          <Photo id={x.img} w={2200} eager={k === 0} alt="" className="size-full animate-kenburns" />
        </div>
      ))}
      <div className="absolute inset-0 -z-10 bg-gradient-to-l from-ink/80 via-ink/30 to-ink/40" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_30%_40%,transparent_30%,rgba(11,18,32,.55))]" />
      <div className="container-x flex items-center justify-between gap-10 pb-14">
        <div>
          <div key={i} className="max-w-xl">
            <h1 className="hero-copy text-4xl leading-[1.25] font-bold text-white sm:text-6xl">
              <Words text={s.a} /><span className="block"><Words text={s.b} from={200} className="text-shimmer" /></span>
            </h1>
            <Cta to={s.to} className="mt-7 animate-rise [animation-delay:450ms]">{s.cta}</Cta>
          </div>
          <div className="mt-9 flex gap-6">
            {slides.map((x, k) => (
              <button key={x.img} onClick={() => setI(k)} aria-label={`الشريحة ${k + 1}: ${x.label}`} className={`w-24 text-start transition sm:w-28 ${k === i ? 'text-white' : 'text-white/45 hover:text-white/80'}`}>
                <span className="flex items-baseline gap-2 text-xs font-semibold"><span className="font-mono text-[10px]">0{k + 1}</span>{x.label}</span>
                <span className="mt-2 block h-0.5 overflow-hidden rounded-full bg-white/20">
                  {k === i && <span className={`block h-full origin-right bg-gradient-to-l from-white to-sky ${paused ? 'scale-x-100' : 'animate-[grow_7s_linear]'}`} />}
                </span>
              </button>
            ))}
          </div>
        </div>
        <Pass s={s} />
      </div>
    </section>
  )
}

// Arabic must not be split per letter (it breaks joining), so headlines reveal word by word.
function Words({ text, from = 0, className = '' }) {
  return text.split(' ').map((w, k) => (
    <span key={k} className="-my-[.2em] inline-block overflow-hidden py-[.2em] align-bottom">
      <span className={`inline-block animate-[word_.9s_cubic-bezier(.2,.7,.2,1)_both] ${className}`} style={{ animationDelay: `${from + k * 90}ms` }}>{w}&nbsp;</span>
    </span>
  ))
}

const tiles = [
  { to: '/hotels', Art: HotelArt, label: 'الفنادق' },
  { to: '/cars', Art: CarArt, label: 'تأجير السيارات' },
  { to: '/esim', Art: EsimArt, label: 'eSIM' },
  { to: '/transfers', Art: TransferArt, label: 'مواصلات المطار' },
  { to: '/transfers?mode=chauffeur', Art: ChauffeurArt, label: 'سيارة مع سائق' },
  { to: '/deals', Art: DealArt, label: 'عروض ساخنة' },
]

function SearchDock() {
  return (
    <section className="container-x relative z-10 -mt-16">
      <div className="animate-rise [animation-delay:200ms]"><SearchPanel /></div>
      <nav className="mt-4 grid grid-cols-3 overflow-hidden rounded-lg border border-line bg-white md:grid-cols-6" aria-label="خدماتنا">
        {tiles.map((t) => (
          <Link key={t.to} to={t.to} className="group flex flex-col items-center gap-2 border-line px-2 py-5 text-center text-xs font-medium text-ink/80 transition not-last:border-e hover:bg-mist hover:text-ink max-md:nth-3:border-e-0 max-md:nth-[-n+3]:border-b sm:text-sm">
            <t.Art className="size-11" />
            {t.label}
          </Link>
        ))}
      </nav>
    </section>
  )
}

function Network() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-white">
      <div className="container-x">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-sky"><FlightArt className="size-7" /> شبكة وجهاتنا</p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">من بغداد إلى العالم</h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-white/60">مرّر على أي مدينة لترى أقل سعر، واضغط لتبدأ البحث فوراً.</p>
        </Reveal>
        <div className="mt-10"><RouteMap /></div>
      </div>
    </section>
  )
}

function Departures() {
  const now = useBaghdadClock()
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 start-1/2 h-96 w-[60rem] -translate-x-1/2 rounded-full bg-brand/20 blur-[120px]" />
      <div className="container-x relative">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-ember"><span className="size-2 animate-pulse rounded-full bg-ember" /> مباشر الآن</p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">المغادرات من بغداد</h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-white/55">لوحة حيّة لرحلات اليوم. اضغط على أي رحلة لتحجز مقعدك قبل أن تُغلق البوابة.</p>
          </div>
          <div className="text-end">
            <p className="font-mono text-4xl font-semibold tracking-wider text-amber-200 tabular-nums sm:text-6xl" dir="ltr">{now}</p>
            <p className="mt-1 text-xs text-white/40">بتوقيت بغداد · مطار بغداد الدولي</p>
          </div>
        </Reveal>
        <DepartureBoard />
      </div>
    </section>
  )
}

const portholeWords = [['كل', 'رحلة', 'تبدأ'], ['من', 'نافذة.']]

function WindowSeat() {
  let n = 0
  return (
    <section className="window-seat relative bg-[linear-gradient(180deg,#eef1f6,#d9dfe8)]" aria-label="نافذتك على العالم">
      <div className="ws-pin relative h-svh overflow-hidden">
        <div aria-hidden="true" className="ws-bezel absolute inset-0 bg-[radial-gradient(closest-side,#c3cad6,#f6f8fb)]" />
        <div className="ws-frame absolute inset-0 overflow-hidden bg-ink">
          <Photo id="photo-1697898109604-e06e88b15271" w={2200} alt="فيلا فوق الماء في المالديف" className="ws-photo size-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
          <div aria-hidden="true" className="ws-shade absolute inset-0 bg-[linear-gradient(180deg,#f7f9fc,#dfe4ec_92%,#c9d0db)] after:absolute after:bottom-4 after:left-1/2 after:h-1.5 after:w-14 after:-translate-x-1/2 after:rounded-full after:bg-ink/15" />
        </div>
        <p className="ws-seat absolute inset-x-0 top-[9%] text-center text-sm font-semibold tracking-wide text-ink/50">المقعد <bdi dir="ltr">14A</bdi> · بجانب النافذة · مرّر للأسفل</p>
        <div className="container-x absolute inset-x-0 bottom-[10%] text-white">
          <h2 className="text-5xl leading-[1.3] font-bold tracking-tight sm:text-8xl sm:leading-[1.15]">
            {portholeWords.map((line, l) => (
              <span key={l} className={`block ${l ? 'text-sky' : ''}`}>
                {line.map((w) => <span key={w} className="ws-word inline-block" style={{ '--i': n++ }}>{w}&nbsp;</span>)}
              </span>
            ))}
          </h2>
          <div className="ws-word mt-6 flex flex-wrap items-center gap-x-6 gap-y-4" style={{ '--i': n }}>
            <p className="max-w-md leading-8 text-white/75">المالديف · فيلا فوق الماء · 6 ليالٍ شاملة كلياً. نافذتك القادمة تنتظرك.</p>
            <Cta to="/deals/maldives-honeymoon">شاهد العرض</Cta>
          </div>
        </div>
      </div>
    </section>
  )
}

function AirlineStrip() {
  const codes = Object.keys(airlines)
  return (
    <section className="border-b border-line bg-white py-8">
      <p className="mb-6 text-center text-sm text-muted">شركاؤنا في السماء</p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_left,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-marquee gap-14 hover:[animation-play-state:paused]">
          {[...codes, ...codes].map((c, i) => (
            <img key={i} src={airlineLogo(c)} alt={airlines[c].name} title={airlines[c].name} className="h-10 w-auto shrink-0 object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0" />
          ))}
        </div>
      </div>
    </section>
  )
}

function HotDeals() {
  const morph = useMorph()
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="container-x">
        <Reveal>
          <SectionTitle eyebrow={<span className="inline-flex items-center gap-1 text-ember"><Icon name="flame" className="size-4" /> لفترة محدودة</span>} title="عروض ساخنة هذا الأسبوع"
            action={<Cta to="/deals" variant="ghost" className="hidden text-sm sm:inline-flex">كل العروض</Cta>} />
        </Reveal>
        <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 [scrollbar-width:none]">
          {deals.map((d, i) => (
            <Reveal key={d.id} delay={i * 80} className="w-[82%] shrink-0 snap-start sm:w-[380px]">
              <Link to={`/deals/${d.id}`} {...morph.trigger(d.id)} className="card card-hover group block overflow-hidden">
                <div className="relative h-60 overflow-hidden" style={morph.target(d.id)}>
                  <Photo id={d.img} w={800} alt={d.title} className="size-full transition duration-[1.2s] group-hover:scale-105" />
                  <span className="absolute top-4 start-4 rounded-md bg-ember px-3 py-1 text-xs font-bold text-white">-{Math.round((1 - d.price / d.was) * 100)}%</span>
                  <span className="absolute top-4 end-4 flex items-center gap-1 rounded-md bg-white/90 px-3 py-1 text-xs font-medium backdrop-blur"><Icon name="clock" className="size-3.5" /> ينتهي خلال {d.ends} أيام</span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold">{d.title}</h3>
                  <p className="mt-1 text-sm text-muted">{d.sub}</p>
                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-muted line-through">{iqd(d.was)}</p>
                      <p className="text-xl font-bold text-ink">{iqd(d.price)} <span className="text-xs font-normal text-muted">/ للشخص</span></p>
                    </div>
                    <span className="chip">{d.nights} ليالٍ</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Journey() {
  const list = destinations.slice(0, 8)
  return (
    <section className="journey relative overflow-hidden bg-white" aria-label="وجهات يحبها العراقيون">
      <div className="journey-pin relative flex flex-col justify-center py-20">
        <div className="container-x relative">
          <Reveal><SectionTitle eyebrow="وجهات يحبها العراقيون" title="إلى أين هذه المرة؟" /></Reveal>
        </div>
        <div className="journey-track relative flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          {list.map((d, i) => (
            <Link key={d.code} to={`/flights?from=BGW&to=${d.code}&date=${addDays(14)}&pax=1&cabin=economy`}
              className="group relative h-[56svh] min-h-[360px] w-[78vw] shrink-0 snap-start overflow-hidden rounded-lg bg-ink sm:w-[44vw] lg:w-[28vw]">
              <Photo id={d.img} w={1000} alt={d.city} className="absolute inset-0 size-full transition duration-[1.4s] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-ink/30" />
              <span className="absolute top-5 start-5 font-mono text-sm text-white/70">{String(i + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}</span>
              {d.tag && <span className="absolute top-4 end-4 rounded-md bg-white/90 px-3 py-1 text-[11px] font-semibold backdrop-blur">{d.tag}</span>}
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="flex items-center gap-2 text-sm text-white/70"><img src={flag(d.cc)} alt="" className="h-3 w-4.5 rounded-sm object-cover" />{d.country} · <span className="font-mono">BGW → {d.code}</span></p>
                <h3 className="mt-1 text-4xl font-bold sm:text-5xl">{d.city}</h3>
                <p className="mt-4 flex items-center justify-between border-t border-white/20 pt-4 text-sm">
                  <span>ابتداءً من <b className="text-sky">{iqd(d.from)}</b></span>
                  <span className="grid size-10 place-items-center rounded-full bg-white text-ink transition duration-500 group-hover:rotate-[-45deg] group-hover:bg-sky"><Icon name="arrow" className="size-4 -scale-x-100" /></span>
                </p>
              </div>
            </Link>
          ))}
          <Link to="/flights" className="flex h-[56svh] min-h-[360px] w-[60vw] shrink-0 snap-start flex-col items-center justify-center gap-4 rounded-lg border border-line text-center sm:w-[30vw] lg:w-[20vw]">
            <span className="grid size-16 place-items-center rounded-full bg-ink text-white"><Icon name="plane" className="size-6 -scale-x-100" /></span>
            <span className="text-xl font-bold">كل الوجهات</span>
            <span className="text-sm text-muted">أكثر من 120 مدينة حول العالم</span>
          </Link>
        </div>
        <div aria-hidden="true" className="container-x mt-8 hidden md:block">
          <div className="relative h-px bg-line">
            <span className="journey-fill absolute inset-0 origin-right bg-gradient-to-l from-brand to-plum-400" />
            <span className="journey-plane absolute -top-2.5 start-0 text-brand"><Icon name="plane" className="size-5 -scale-x-100" /></span>
          </div>
        </div>
      </div>
    </section>
  )
}

const esimSteps = [['pin', 'اختر وجهتك', 'أكثر من 150 دولة'], ['search', 'امسح رمز QR', 'يصلك فوراً بعد الدفع'], ['wifi', 'اهبط متصلاً', 'إنترنت 5G من أول دقيقة']]

function EsimPromo() {
  const list = esimCountries.slice(0, 6)
  const [k, setK] = useState(0)
  const [stage, setStage] = useState(() => (reduced() ? 2 : 0))
  const [held, setHeld] = useState(false)
  const c = list[k]
  // scan -> activate -> connected, then (unless the visitor picked one) move to the next country
  useEffect(() => {
    if (reduced()) return
    setStage(0)
    const t = [setTimeout(() => setStage(1), 2600), setTimeout(() => setStage(2), 3900)]
    if (!held) t.push(setTimeout(() => setK((n) => (n + 1) % list.length), 8500))
    return () => t.forEach(clearTimeout)
  }, [k, held, list.length])
  const pick = (n) => { setHeld(true); setK(n) }

  return (
    <section className="container-x pb-24">
      <div className="relative isolate overflow-hidden rounded-lg bg-[#060a16] px-6 py-16 text-white sm:px-12 lg:px-16 lg:py-20">
        <div aria-hidden="true" className="absolute -top-1/3 -end-1/4 -z-10 size-[700px] animate-[aurora_14s_ease-in-out_infinite] rounded-full bg-brand/30 blur-[140px]" />
        <div aria-hidden="true" className="absolute -bottom-1/3 -start-1/4 -z-10 size-[600px] animate-[aurora_18s_ease-in-out_infinite_reverse] rounded-full bg-plum-400/25 blur-[140px]" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium backdrop-blur">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" /> جديد في حياة · eSIM
            </span>
            <h2 className="mt-6 text-4xl leading-[1.2] font-bold tracking-tight sm:text-6xl">اهبط… وأنت <span className="text-shimmer">متصل.</span></h2>
            <p className="mt-5 max-w-md leading-8 text-white/65">بدون تجوال مكلف، بدون طوابير شرائح المطار. باقتك جاهزة في هاتفك قبل أن تقلع الطائرة.</p>

            <ol className="mt-9 grid grid-cols-3 gap-2 sm:gap-3">
              {esimSteps.map(([icon, t, d], n) => {
                const done = n < stage + 1
                const now = n === Math.min(stage + 1, 2) && stage < 2
                return (
                  <li key={t} className={`relative overflow-hidden rounded-lg border p-3 transition sm:p-4 duration-500 ${now ? 'border-brand/60 bg-brand/10' : done ? 'border-white/15 bg-white/[.06]' : 'border-white/10 bg-white/[.02]'}`}>
                    <span className="flex items-center justify-between">
                      <span className={`grid size-9 place-items-center rounded-md transition ${done ? 'bg-white text-ink' : 'bg-white/10 text-white/60'}`}><Icon name={done && !now ? 'check' : icon} className="size-4" /></span>
                      <span className="font-mono text-[11px] text-white/35">0{n + 1}</span>
                    </span>
                    <p className="mt-3 text-sm font-bold">{t}</p>
                    <p className="mt-0.5 text-xs text-white/50 max-sm:hidden">{d}</p>
                    {now && <span className="absolute inset-x-0 bottom-0 h-0.5 origin-right animate-[grow_1.3s_linear_both] bg-gradient-to-l from-brand to-plum-400" />}
                  </li>
                )
              })}
            </ol>

            <div className="mt-8 flex flex-wrap gap-2">
              {list.map((x, n) => (
                <button key={x.cc} onClick={() => pick(n)} aria-pressed={n === k}
                  className={`flex items-center gap-2 rounded-full py-1.5 ps-1.5 pe-4 text-sm transition duration-300 ${n === k ? 'bg-white text-ink shadow-[0_10px_30px_-10px_rgba(157,188,255,.8)]' : 'bg-white/[.06] text-white/80 ring-1 ring-white/10 hover:bg-white/15'}`}>
                  <img src={flag(x.cc)} alt="" className="size-6 rounded-full object-cover" />{x.name}
                  <span className={`text-xs ${n === k ? 'text-brand' : 'text-white/40'}`}>{iqd(x.from)}</span>
                </button>
              ))}
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <Cta to={`/esim/${c.cc}`}>اشترِ باقة {c.name}</Cta>
              <Link to="/esim" className="group text-sm font-semibold text-white/70 hover:text-white">
                كل الدول <span className="block h-px origin-right scale-x-0 bg-white transition duration-500 group-hover:scale-x-100" />
              </Link>
            </div>
          </Reveal>

          <div className="relative grid min-h-[620px] place-items-center">
            {/* signal waves + orbiting destinations */}
            {[0, 1.3, 2.6].map((d) => <span key={d} aria-hidden="true" className="absolute size-[440px] animate-[wave_4s_ease-out_infinite] rounded-full border border-sky/30" style={{ animationDelay: `${d}s` }} />)}
            <div aria-hidden="true" className="absolute hidden size-[560px] animate-[orbit_60s_linear_infinite] rounded-full border border-dashed border-white/10 sm:block">
              {esimCountries.slice(0, 10).map((x, n) => (
                <span key={x.cc} className="absolute top-1/2 left-1/2 -m-5" style={{ transform: `rotate(${n * 36}deg) translate(280px) rotate(${-n * 36}deg)` }}>
                  <img src={flag(x.cc)} alt="" className="size-10 animate-[counter_60s_linear_infinite] rounded-full object-cover ring-2 ring-white/20" />
                </span>
              ))}
            </div>
            <div className="relative animate-float">
              <EsimPhone country={c} stage={stage} />
              {stage === 2 && (
                <div key={c.cc} className="absolute top-28 -end-16 animate-rise max-sm:hidden rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm backdrop-blur-xl sm:-end-16">
                  <p className="flex items-center gap-2 font-semibold"><span className="grid size-6 place-items-center rounded-full bg-emerald-400 text-ink"><Icon name="check" className="size-3.5" strokeWidth={3} /></span> تم التفعيل</p>
                  <p className="mt-0.5 text-xs text-white/60">{c.network} · 5G</p>
                </div>
              )}
              <div className="absolute bottom-24 -start-6 rounded-lg bg-white px-4 py-3 text-ink shadow-2xl sm:-start-20">
                <p className="text-[11px] text-muted">وفّرت مقارنة بالتجوال</p>
                <p className="text-xl font-bold text-emerald-600">حتى 85%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Why() {
  const items = [
    ['shield', 'معتمدون من IATA', 'حجوزاتك مصدرة مباشرة من أنظمة الطيران العالمية.'],
    ['bag', 'ادفع بطريقتك', 'زين كاش، كي كارد، FIB، أو نقداً في مكتبنا ببغداد.'],
    ['headset', 'فريق يتحدث لغتك', 'دعم على مدار الساعة عبر واتساب والهاتف.'],
    ['bolt', 'بدون رسوم خفية', 'السعر الذي تراه هو السعر الذي تدفعه، بالدينار.'],
  ]
  return (
    <section className="bg-white py-24">
      <div className="container-x grid gap-10 md:grid-cols-4">
        {items.map(([i, t, d], k) => (
          <Reveal key={t} delay={k * 80}>
            <span className="grid size-12 place-items-center rounded-2xl bg-mist text-ink"><Icon name={i} /></span>
            <h3 className="mt-5 text-lg font-bold">{t}</h3>
            <p className="mt-2 text-sm leading-7 text-muted">{d}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function FinalCta() {
  const band = 'حياة · السفر كما يجب · HAYAT · '
  return (
    <>
    <div aria-hidden="true" className="overflow-hidden border-y border-line py-6 select-none">
      <div className="flex w-max animate-marquee py-[.15em] text-[13vw] leading-[1.25] font-bold whitespace-nowrap md:text-[9vw]">
        {[0, 1].map((k) => <span key={k} className="text-photo" style={{ backgroundImage: `url(${img('photo-1601999705946-fbf42c3c6c66', 1000)})` }}>{band.repeat(3)}</span>)}
      </div>
    </div>
    <section className="container-x py-24 text-center">
      <Reveal>
        <h2 className="mx-auto max-w-2xl text-3xl leading-tight font-bold sm:text-5xl">رحلتك القادمة تبدأ <span className="text-brand">بنقرة واحدة</span></h2>
        <p className="mt-4 text-muted">أكثر من 50 ألف مسافر عراقي حجزوا معنا هذا العام.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Cta to="/flights" variant="solid" className="text-base">احجز رحلة طيران</Cta>
          <Cta to="/deals" variant="ghost" className="text-base">شاهد العروض</Cta>
        </div>
      </Reveal>
    </section>
    </>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <SearchDock />
      <AirlineStrip />
      <Departures />
      <WindowSeat />
      <Network />
      <HotDeals />
      <Journey />
      <EsimPromo />
      <Why />
      <FinalCta />
    </>
  )
}
