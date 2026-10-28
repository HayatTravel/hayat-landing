import { Suspense, useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, ScrollRestoration, useLocation, useNavigate } from 'react-router'
import Icon from './Icon'
import { Logo } from './ui'
import Help from './Help'
import { LANG_INFO, LANGS_FOR, useI18n } from '../lib/i18n'
import { useMode } from '../lib/mode'
import { session, useStore } from '../lib/store'
import D from '../data/catalog'

/* Visiting Iraq: inbound tourism site. Every item opens a real page (src/routes/incoming.jsx). */
export const NAV_IN = [
  { to: '/visit', label: 'in.nav.home', icon: 'home', end: true },
  { to: '/visit/places', label: 'in.nav.places', icon: 'map' },
  { to: '/visit/tours', label: 'in.nav.tours', icon: 'luggage' },
  { to: '/flights', label: 'in.nav.flights', icon: 'plane' },
  { to: '/visit/visa', label: 'in.nav.visa', icon: 'passport' },
  { to: '/visit/hotels', label: 'in.nav.hotels', icon: 'bed' },
  { to: '/visit/plan', label: 'in.nav.plan', icon: 'info' },
]
/* Travelling from Iraq: products in the order customers look for them. */
export const NAV = [
  { to: '/flights', label: 'nav.flights', icon: 'plane' },
  { to: '/hotels', label: 'nav.hotels', icon: 'bed' },
  { to: '/holidays', label: 'nav.holidays', icon: 'luggage' },
  { to: '/cars', label: 'nav.cars', icon: 'car' },
  { to: '/visa', label: 'nav.visa', icon: 'passport' },
  { to: '/esim', label: 'nav.esim', icon: 'sim' },
  { to: '/events', label: 'nav.events', icon: 'ticket' },
  { to: '/destinations', label: 'nav.destinations', icon: 'globe' },
]
export const useNav = () => (useMode().mode === 'in' ? NAV_IN : NAV)

/** From Iraq / To Iraq — the audience switch. Switching goes to that audience's home. */
export function ModeSwitch({ dark, big = false }) {
  const { t, setCur } = useI18n()
  const { mode, setMode } = useMode()
  const go = useNavigate()
  // visitors think in dollars, Iraqi travellers in dinars (the currency switch still works after)
  const pick = (m) => { if (m !== mode) { setMode(m); setCur(m === 'in' ? 'USD' : 'IQD'); go(m === 'in' ? '/visit' : '/') } }
  const opts = [['out', 'mode.out', 'plane'], ['in', 'mode.in', 'pin']]
  if (big) {
    return (
      <div role="radiogroup" aria-label={t('mode.label')} className="inline-flex rounded-lg bg-white/10 p-1 backdrop-blur">
        {opts.map(([m, k, ic]) => (
          <button key={m} role="radio" aria-checked={mode === m} onClick={() => pick(m)}
            className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition sm:px-5 ${mode === m ? 'bg-white text-ink shadow' : 'text-white/80 hover:text-white'}`}>
            <Icon name={ic} className="size-4" />{t(k)}
          </button>
        ))}
      </div>
    )
  }
  return (
    <div role="radiogroup" aria-label={t('mode.label')} className={`hidden rounded-md p-0.5 text-xs font-semibold lg:flex ${dark ? 'bg-white/10' : 'bg-mist'}`}>
      {opts.map(([m, k]) => (
        <button key={m} role="radio" aria-checked={mode === m} onClick={() => pick(m)}
          className={`rounded px-2.5 py-1.5 ${mode === m ? 'bg-white text-ink shadow-sm' : dark ? 'text-white/70' : 'text-muted'}`}>{t(`${k}.short`)}</button>
      ))}
    </div>
  )
}

/** Phone-code sign-in (IAM in production). Opens from anywhere via openSignIn(after). */
function SignIn() {
  const { t } = useI18n()
  const dialog = useRef(null)
  const after = useRef(null)
  const [step, setStep] = useState('phone')
  const [phone, setPhone] = useState('')
  const [err, setErr] = useState('')
  useEffect(() => {
    const on = (e) => { after.current = e.detail; setStep('phone'); setErr(''); dialog.current?.showModal() }
    addEventListener('hayat:signin', on)
    return () => removeEventListener('hayat:signin', on)
  }, [])
  const submit = (e) => {
    e.preventDefault()
    const f = e.currentTarget
    if (step === 'phone') {
      const v = f.phone.value.replace(/\D/g, '')
      if (v.length < 9) return setErr(t('sign.err'))
      setPhone(f.phone.value.trim()); setErr(''); return setStep('code')
    }
    session.signIn({ name: f.name.value.trim() || t('sign.guest'), phone: `+964 ${phone}` })
    dialog.current.close()
    after.current?.()
  }
  return (
    <dialog ref={dialog} className="m-auto w-[min(92vw,420px)] rounded-lg p-0 backdrop:bg-ink/60 open:animate-rise">
      <form onSubmit={submit} className="p-8" noValidate>
        <div className="flex items-center justify-between">
          <Logo className="h-9" />
          <button type="button" onClick={() => dialog.current.close()} className="grid size-9 place-items-center rounded-md hover:bg-mist" aria-label={t('close')}><Icon name="close" className="size-4" /></button>
        </div>
        <h2 className="mt-8 text-2xl font-bold">{t('sign.title')}</h2>
        {step === 'phone' ? (
          <>
            <p className="mt-1 text-sm text-muted">{t('sign.lede')}</p>
            <label className="label mt-6" htmlFor="sg-phone">{t('sign.phone')}</label>
            <div className="flex items-center gap-2 rounded-md border border-line px-4 focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/15" dir="ltr">
              <span className="text-sm font-semibold text-muted">+964</span>
              <input id="sg-phone" name="phone" autoFocus type="tel" placeholder="770 000 0000" autoComplete="tel-national" className="w-full bg-transparent py-3 outline-none" />
            </div>
            {err && <p role="alert" className="mt-2 text-sm text-red-600">{err}</p>}
            <button className="btn-primary mt-6 w-full py-3.5">{t('sign.send')}</button>
            <div className="my-5 flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-line" />{t('or')}<span className="h-px flex-1 bg-line" /></div>
            <div className="grid grid-cols-2 gap-3">{['Google', 'Apple'].map((s) => <button key={s} type="button" onClick={() => { setPhone('770 000 0000'); setStep('code') }} className="btn-ghost py-2.5 text-sm">{s}</button>)}</div>
          </>
        ) : (
          <>
            <p className="mt-1 text-sm text-muted">{t('sign.sent', { phone: `+964 ${phone}` })}</p>
            <label className="label mt-6" htmlFor="sg-code">{t('sign.code')}</label>
            <input id="sg-code" autoFocus inputMode="numeric" maxLength={6} dir="ltr" autoComplete="one-time-code" className="field text-center font-mono text-2xl tracking-[.6em]" />
            <label className="label mt-4" htmlFor="sg-name">{t('sign.name')}</label>
            <input id="sg-name" name="name" autoComplete="name" className="field" />
            <p className="mt-2 text-xs text-muted">{t('sign.demo')}</p>
            <button className="btn-primary mt-6 w-full py-3.5">{t('sign.go')}</button>
          </>
        )}
      </form>
    </dialog>
  )
}

function LangMenu({ dark }) {
  const { lang, setLang, t } = useI18n()
  const { mode } = useMode()
  const list = LANGS_FOR[mode].map((k) => [k, LANG_INFO[k].name])
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const off = (e) => !ref.current?.contains(e.target) && setOpen(false)
    addEventListener('click', off)
    return () => removeEventListener('click', off)
  }, [])
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)} aria-haspopup="menu" aria-expanded={open} aria-label={t('lang.label')}
        className={`flex h-10 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium ${dark ? 'text-white/85 hover:bg-white/10' : 'text-ink/75 hover:bg-mist'}`}>
        <Icon name="globe" className="size-4" /><span>{LANG_INFO[lang].name}</span>
      </button>
      {open && (
        <div role="menu" className="absolute end-0 top-12 z-50 w-40 animate-fade rounded-lg border border-line bg-white p-1.5 text-ink shadow-xl">
          {list.map(([k, n]) => (
            <button key={k} role="menuitemradio" aria-checked={k === lang} lang={k} onClick={() => { setLang(k); setOpen(false) }}
              className={`block w-full rounded-md px-3 py-2 text-start text-sm hover:bg-mist ${k === lang ? 'font-bold text-brand' : ''}`}>{n}</button>
          ))}
        </div>
      )}
    </div>
  )
}

function CurSwitch({ dark }) {
  const { cur, setCur, t } = useI18n()
  return (
    <div role="radiogroup" aria-label={t('cur.label')} className={`hidden rounded-md p-0.5 text-xs font-bold sm:flex ${dark ? 'bg-white/10' : 'bg-mist'}`}>
      {['IQD', 'USD'].map((c) => (
        <button key={c} role="radio" aria-checked={cur === c} onClick={() => setCur(c)}
          className={`rounded px-2.5 py-1.5 ${cur === c ? 'bg-white text-ink shadow-sm' : dark ? 'text-white/70' : 'text-muted'}`}>{c}</button>
      ))}
    </div>
  )
}

function Navbar() {
  useStore()
  const { t } = useI18n()
  const nav = useNav()
  const user = session.user()
  const go = useNavigate()
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
  const dark = !glass
  const account = () => (user ? go('/account') : window.dispatchEvent(new CustomEvent('hayat:signin')))

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition duration-300 print:hidden ${glass ? 'bg-white/90 shadow-[0_1px_0_var(--color-line)] backdrop-blur' : 'bg-gradient-to-b from-ink/80 via-ink/40 to-transparent'}`}>
      <div className="container-x flex h-18 items-center justify-between gap-4">
        <Logo light={dark} className="h-10" to={useMode().mode === 'in' ? '/visit' : '/'} />
        <nav className="hidden items-center gap-0.5 xl:flex" aria-label={t('nav.label')}>
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition ${isActive ? (glass ? 'bg-ink text-white' : 'bg-white text-ink') : glass ? 'text-ink/70 hover:bg-mist hover:text-ink' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
              <Icon name={n.icon} className="size-4" />{t(n.label)}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <ModeSwitch dark={dark} />
          <LangMenu dark={dark} />
          <CurSwitch dark={dark} />
          <Link to="/trips" className={`hidden h-10 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium md:flex ${dark ? 'text-white/85 hover:bg-white/10' : 'text-ink/75 hover:bg-mist'}`}><Icon name="ticket" className="size-4" />{t('nav.trips')}</Link>
          <button onClick={account} className={`hidden items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition sm:flex ${glass ? 'bg-ink text-white hover:bg-brand' : 'bg-white text-ink hover:bg-sky'}`}>
            <Icon name="user" className="size-4" />{user ? user.name.split(' ')[0] : t('nav.signin')}
          </button>
          <button onClick={() => setOpen(!open)} className={`grid size-10 place-items-center rounded-md xl:hidden ${glass ? 'text-ink' : 'text-white'}`} aria-label={t('nav.menu')} aria-expanded={open}>
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>
      {open && (
        <nav className="container-x grid animate-fade gap-1 bg-white pb-4 xl:hidden">
          <div className="mb-2 rounded-lg bg-ink p-2"><ModeSwitch big /></div>
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} className="flex items-center gap-3 rounded-md px-4 py-3 font-medium hover:bg-mist"><Icon name={n.icon} className="size-5 text-brand" />{t(n.label)}</NavLink>
          ))}
          <hr className="my-2 border-line" />
          <Link to="/trips" className="flex items-center gap-3 rounded-md px-4 py-3 font-medium hover:bg-mist"><Icon name="ticket" className="size-5 text-brand" />{t('nav.trips')}</Link>
          <Link to="/help" className="flex items-center gap-3 rounded-md px-4 py-3 font-medium hover:bg-mist"><Icon name="info" className="size-5 text-brand" />{t('nav.help')}</Link>
          <button onClick={account} className="btn-primary mt-2">{user ? user.name : t('nav.signin')}</button>
        </nav>
      )}
    </header>
  )
}

function Footer() {
  const { t, L } = useI18n()
  const { mode } = useMode()
  const cols = [
    mode === 'in' ? [t('in.ft.title'), NAV_IN.map((n) => [t(n.label), n.to])] : [t('ft.book'), NAV.map((n) => [t(n.label), n.to]).concat([[t('nav.transfers'), '/transfers']])],
    [t('foot.help'), [[t('nav.trips'), '/trips'], [t('foot.faq'), '/help'], [t('foot.terms'), '/help#terms'], [t('foot.privacy'), '/help#privacy']]],
  ]
  return (
    <footer className="bg-ink text-white/70 print:hidden">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div className="space-y-5">
          <Logo light className="h-11" />
          <p className="max-w-xs text-sm leading-7">{t('foot.about')}</p>
          <p className="text-xs text-white/50">{L(D.company.licence)} · IATA —</p>
        </div>
        {cols.map(([title, links]) => (
          <div key={title}>
            <h4 className="mb-4 font-semibold text-white">{title}</h4>
            <ul className="space-y-3 text-sm">{links.map(([l, to]) => <li key={to}><Link to={to} className="transition hover:text-sky">{l}</Link></li>)}</ul>
          </div>
        ))}
        <div>
          <h4 className="mb-4 font-semibold text-white">{t('foot.offices')}</h4>
          <ul className="space-y-3 text-sm">{D.offices.map((o) => <li key={L(o.city)}><b className="text-white/90">{L(o.city)}</b> · {L(o.area)}<br /><span className="text-xs text-white/50">{L(o.hours)}</span></li>)}</ul>
        </div>
      </div>
      <div className="container-x flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-xs sm:flex-row">
        <div className="flex flex-wrap items-center gap-2">{D.payments.map((p) => <span key={p.id} className="grid h-7 min-w-12 place-items-center rounded px-2 text-[10px] font-black text-white" style={{ background: p.color }}>{p.mark}</span>)}</div>
        <p className="flex flex-wrap items-center gap-4"><span>© 2026 {L(D.company.name)}</span><a href="https://booking.hayat.iq" className="hover:text-sky">{t('foot.business')}</a><span className="text-white/45">{t('foot.mock')}</span></p>
      </div>
    </footer>
  )
}

/** Browser tab title = the page's heading · brand (read after the page has drawn, so every page gets it for free). */
function useTabTitle() {
  const { pathname, search } = useLocation()
  const { lang } = useI18n()
  useEffect(() => {
    const brand = LANG_INFO[lang].title
    const set = () => {
      const h = document.querySelector('main h1')?.textContent?.trim()
      document.title = h && pathname !== '/' ? `${h} · ${brand}` : brand
    }
    const t = setTimeout(set, 60)
    const t2 = setTimeout(set, 600) // pages that load on demand
    return () => { clearTimeout(t); clearTimeout(t2) }
  }, [pathname, search, lang])
}

export default function Layout() {
  useTabTitle()
  return (
    <>
      <Navbar />
      <main className="min-h-dvh print:min-h-0">
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <Help />
      <SignIn />
      <ScrollRestoration />
    </>
  )
}

/** Shown only if a page is opened before its code has arrived: the dark band plus a calm skeleton. */
function PageLoading() {
  return (
    <div aria-busy="true">
      <div className="page-head h-56 bg-[#070b16]" />
      <div className="container-x grid gap-4 py-10">{[0, 1, 2].map((k) => <div key={k} className="h-28 animate-pulse rounded-lg bg-mist" />)}</div>
    </div>
  )
}

// Inner-page header band so the fixed nav never overlaps content: a calm dark stage with an optional photo.
export function PageHead({ children, className = '', photo }) {
  return (
    <div className={`page-head relative isolate pt-28 pb-8 ${className}`}>
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        {photo && (
          <div className="absolute inset-y-0 start-0 w-full opacity-40 [mask-image:linear-gradient(to_left,black,transparent_75%)] sm:w-2/3">
            <img src={photo} alt="" className="size-full object-cover" />
          </div>
        )}
        <div className="absolute -top-40 end-[10%] size-[520px] rounded-full bg-brand/20 blur-[120px]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-l from-transparent via-sky/40 to-transparent" />
      </div>
      <div className="page-head-in container-x">{children}</div>
    </div>
  )
}
