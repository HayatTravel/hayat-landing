import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, ScrollRestoration, useLocation } from 'react-router'
import Icon from './Icon'
import { Logo, Photo } from './ui'

const nav = [
  { to: '/flights', label: 'طيران', icon: 'plane' },
  { to: '/hotels', label: 'فنادق', icon: 'bed' },
  { to: '/cars', label: 'سيارات', icon: 'car' },
  { to: '/esim', label: 'eSIM', icon: 'sim' },
  { to: '/deals', label: 'عروض ساخنة', icon: 'flame' },
]

function Login({ dialog, onDone }) {
  const [step, setStep] = useState('phone')
  const submit = (e) => {
    e.preventDefault()
    if (step === 'phone') return setStep('code')
    onDone()
    dialog.current.close()
    setStep('phone')
  }
  return (
    <dialog ref={dialog} className="m-auto w-[min(92vw,420px)] rounded-lg p-0 backdrop:bg-ink/60 open:animate-rise">
      <form onSubmit={submit} className="p-8" dir="rtl">
        <div className="flex items-center justify-between">
          <Logo className="h-9" />
          <button type="button" onClick={() => dialog.current.close()} className="grid size-9 place-items-center rounded-md hover:bg-mist" aria-label="إغلاق"><Icon name="close" className="size-4" /></button>
        </div>
        <h2 className="mt-8 text-2xl font-bold">{step === 'phone' ? 'أهلاً بك في حياة' : 'أدخل رمز التحقق'}</h2>
        <p className="mt-1 text-sm text-muted">{step === 'phone' ? 'سجّل الدخول برقم هاتفك لإدارة حجوزاتك.' : 'أرسلنا رمزاً من 4 أرقام عبر واتساب. (نموذج تجريبي: أي رمز يعمل)'}</p>
        {step === 'phone' ? (
          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-line px-4 focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/15" dir="ltr">
            <span className="text-sm font-semibold text-muted">+964</span>
            <input required autoFocus type="tel" defaultValue="770 123 4567" className="w-full bg-transparent py-3 outline-none" />
          </div>
        ) : (
          <input required autoFocus inputMode="numeric" maxLength={4} defaultValue="2026" dir="ltr" className="field mt-6 text-center font-mono text-2xl tracking-[1em]" />
        )}
        <button className="btn-primary mt-6 w-full py-3.5">{step === 'phone' ? 'إرسال الرمز' : 'تأكيد'}</button>
      </form>
    </dialog>
  )
}

function Navbar() {
  const dialog = useRef(null)
  const [user, setUser] = useState(null)
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    addEventListener('scroll', on, { passive: true })
    return () => removeEventListener('scroll', on)
  }, [])
  useEffect(() => setOpen(false), [pathname])
  const glass = scrolled || open // every page opens on a dark stage

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition print:hidden duration-500 ${glass ? 'bg-white/80 shadow-[0_1px_0_var(--color-line)] backdrop-blur' : 'bg-gradient-to-b from-ink/80 via-ink/40 to-transparent'}`}>
      <div className="container-x flex h-18 items-center justify-between gap-6">
        <Logo light={!glass} className="h-10" />
        {pathname !== '/' && <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} viewTransition className={({ isActive }) => `flex items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium lg:gap-2 lg:px-4 transition ${isActive ? (glass ? 'bg-ink text-white' : 'bg-white text-ink') : glass ? 'text-ink/70 hover:bg-mist hover:text-ink' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
              <Icon name={n.icon} className={`size-4 ${n.icon === 'flame' ? 'text-ember' : ''}`} />
              {n.label}
            </NavLink>
          ))}
        </nav>}
        <div className="flex items-center gap-2">
          <a href="tel:+9647700000000" className={`hidden items-center gap-2 text-sm font-medium lg:flex ${glass ? 'text-ink/70' : 'text-white/80'}`}>
            <Icon name="headset" className="size-4" /> <bdi dir="ltr">0770 000 0000</bdi>
          </a>
          <button onClick={() => !user && dialog.current.showModal()} className={`hidden items-center gap-2 rounded-md px-5 py-2 text-sm font-semibold transition sm:flex ${glass ? 'bg-ink text-white hover:bg-brand' : 'bg-white text-ink hover:bg-sky'}`}>
            {user ? <><Icon name="user" className="size-4" /> مرحباً، {user}</> : 'تسجيل الدخول'}
          </button>
          <button onClick={() => setOpen(!open)} className={`grid size-10 place-items-center rounded-md md:hidden ${glass ? 'text-ink' : 'text-white'}`} aria-label="القائمة">
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>
      <span aria-hidden="true" className="scroll-progress absolute inset-x-0 bottom-0 h-0.5 origin-right bg-gradient-to-l from-brand via-plum-400 to-ember" />
      <Login dialog={dialog} onDone={() => setUser('علي')} />
      {open && (
        <nav className="container-x grid animate-fade gap-1 bg-white pb-4 md:hidden">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className="flex items-center gap-3 rounded-2xl px-4 py-3 font-medium hover:bg-mist">
              <Icon name={n.icon} className="size-5 text-brand" /> {n.label}
            </NavLink>
          ))}
          <button onClick={() => (user ? null : dialog.current.showModal())} className="btn-primary mt-2">
            {user ? `مرحباً، ${user}` : 'تسجيل الدخول'}
          </button>
        </nav>
      )}
    </header>
  )
}

function Footer() {
  const cols = [
    ['احجز', [['طيران', '/flights'], ['فنادق', '/hotels'], ['تأجير السيارات', '/cars'], ['مواصلات المطار', '/transfers'], ['eSIM', '/esim'], ['عروض ساخنة', '/deals']]],
    ['حياة', [['من نحن', '/'], ['الوظائف', '/'], ['المدونة', '/'], ['اتصل بنا', '/']]],
    ['المساعدة', [['إدارة الحجز', '/manage'], ['حالة الرحلة', '/status'], ['سياسة الإلغاء', '/'], ['الخصوصية', '/'], ['الشروط والأحكام', '/']]],
  ]
  return (
    <footer className="relative isolate overflow-hidden bg-ink text-white/70 print:hidden">
      <div aria-hidden="true" className="absolute -top-40 start-1/4 -z-10 size-[520px] animate-[aurora_16s_ease-in-out_infinite] rounded-full bg-brand/20 blur-[130px]" />
      <div aria-hidden="true" className="absolute -bottom-40 end-0 -z-10 size-[460px] animate-[aurora_20s_ease-in-out_infinite_reverse] rounded-full bg-plum-400/20 blur-[130px]" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-sky/50 to-transparent" />
      <div className="container-x relative grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="space-y-5">
          <Logo light className="h-11" />
          <p className="max-w-xs text-sm leading-7">وكالة سفر عراقية معتمدة من IATA، مقرّها بغداد. احجز الطيران والفنادق والباقات وشرائح eSIM في مكان واحد، وبالدينار العراقي.</p>
          <div className="flex items-center gap-3 text-xs">
            <span className="rounded-md border border-white/15 px-3 py-1.5">IATA معتمدة</span>
            <span className="rounded-md border border-white/15 px-3 py-1.5">دفع آمن</span>
          </div>
        </div>
        {cols.map(([title, links]) => (
          <div key={title}>
            <h4 className="mb-4 font-semibold text-white">{title}</h4>
            <ul className="space-y-3 text-sm">
              {links.map(([l, to]) => <li key={l}><Link to={to} className="transition hover:text-sky">{l}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-x relative flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-xs sm:flex-row">
        <p>© 2026 حياة للسفر. جميع الحقوق محفوظة.</p>
        <p className="flex items-center gap-4"><span>info@hayat.iq</span><span>بغداد، العراق</span></p>
      </div>
      <p aria-hidden="true" className="pointer-events-none -mt-4 -mb-[3vw] bg-gradient-to-b from-white/[.12] to-transparent bg-clip-text text-center font-display text-[16vw] leading-none font-bold text-transparent select-none">حياة</p>
    </footer>
  )
}

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="min-h-dvh print:min-h-0">
        <Outlet />
      </main>
      <Footer />
      {/* film grain over everything, for a printed, less "screen" feel */}
      <div aria-hidden="true" className="grain pointer-events-none fixed inset-0 z-[70] opacity-[.05] print:hidden" />
      <ScrollRestoration />
    </>
  )
}

// Inner-page header band so the fixed nav never overlaps content.
// Dark stage with aurora, dot grid and an optional destination photo bleeding in from the side.
export function PageHead({ children, className = '', photo }) {
  return (
    <div className={`page-head relative isolate pt-28 pb-8 ${className}`}>
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        {photo && (
          <div className="absolute inset-y-0 start-0 w-full opacity-45 [mask-image:linear-gradient(to_left,black,transparent_75%)] sm:w-2/3">
            <Photo id={photo} w={1600} className="size-full animate-kenburns" />
          </div>
        )}
        <div className="absolute -top-40 end-[10%] size-[520px] animate-[aurora_14s_ease-in-out_infinite] rounded-full bg-brand/25 blur-[120px]" />
        <div className="absolute -bottom-60 start-[5%] size-[480px] animate-[aurora_18s_ease-in-out_infinite_reverse] rounded-full bg-plum-400/25 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,.09)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-l from-transparent via-sky/60 to-transparent" />
      </div>
      <div className="page-head-in container-x">{children}</div>
    </div>
  )
}
