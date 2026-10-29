import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import Icon from '../Icon'
import { Logo, Ltr } from '../ui'
import { inDays, iso, addDaysIso } from '../../lib/i18n'
import { buildOrder } from '../../lib/products'
import { isHydrated, openHelp, openSignIn, store, trips } from '../../lib/store'
import D, { media } from '../../data/catalog'

/* Shared pieces of the account area: booking helpers, sample bookings, status badges,
   the signed-out entry cards, a modal / side sheet, a toast, the print receipt. */

export const TYPES = {
  flight: { icon: 'plane', label: 'tp.type.flight' }, hotel: { icon: 'bed', label: 'tp.type.hotel' }, package: { icon: 'luggage', label: 'tp.type.package' },
  visa: { icon: 'passport', label: 'tp.type.visa' }, esim: { icon: 'sim', label: 'tp.type.esim' }, event: { icon: 'ticket', label: 'tp.type.event' },
  transfer: { icon: 'truck', label: 'tp.type.transfer' }, car: { icon: 'car', label: 'tp.type.car' }, other: { icon: 'ticket', label: 'tp.type.other' },
}
const ALIAS = { flights: 'flight', charter: 'flight', stay: 'hotel', stays: 'hotel', hotels: 'hotel', holiday: 'package', holidays: 'package', tour: 'package', packages: 'package', visas: 'visa', events: 'event', transfers: 'transfer', cars: 'car' }
export const kind = (type) => { const k = ALIAS[type] || type; return TYPES[k] ? k : 'other' }
export const typeOf = (b) => TYPES[kind(b.type)]

const ISO = /^\d{4}-\d{2}-\d{2}$/
const DATE_KEYS = ['date', 'dep', 'depart', 'out', 'in', 'checkin', 'pickup', 'from', 'start', 'd1', 'd']
/** The date that matters for the trip (travel / check-in); falls back to the booking day. */
export function tripDate(b) {
  if (b.date && ISO.test(b.date)) return b.date
  const q = b.q || {}
  for (const k of DATE_KEYS) if (ISO.test(q[k] || '')) return q[k]
  return Object.values(q).find((v) => ISO.test(String(v))) || iso(new Date(b.created || Date.now()))
}
export const isPast = (b) => tripDate(b) < inDays(0)
export const holdEnd = (b) => b.payBy ?? (b.created || Date.now()) + (b.hold || 60) * 60000
export const clock = (ms) => { const d = new Date(ms); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` }
export const dayOf = (ms) => iso(new Date(ms || Date.now()))
export const hasReq = (b, type) => (b.requests || []).some((r) => r.type === type)
export const payment = (id) => D.payments.find((p) => p.id === id)
export const digits = (s) => String(s || '').replace(/\D/g, '').slice(-9)
export const imgSrc = (n) => (!n ? '' : /^(https?:)?\/\//.test(n) || n.startsWith('/') ? n : media(n))
const city = (i, code) => i.L(D.airports.find((a) => a.code === code)?.city) || code

/* ---------- lookups made without signing in (this tab only) ---------- */
const LK = 'hayat-lookup'
export const lookups = () => { if (!isHydrated()) return []; try { return JSON.parse(sessionStorage.getItem(LK)) || [] } catch { return [] } }
const addLookup = (ref) => { try { sessionStorage.setItem(LK, JSON.stringify([...new Set([...lookups(), ref])])) } catch { /* blocked */ } }

/* ---------- sample bookings (demo only, rebuilt in the current language) ---------- */
export function seedIfNeeded(user) {
  if (!user || store.get('seeded', false) || trips.list().length) return
  store.set('seeded', true)
  const day = inDays(18); const now = Date.now()
  trips.save({ ref: newDemoRef(), type: 'hotel', demo: 'hotel', q: {}, date: day, nights: 4, img: 'hotel', total: 520, extras: [], lead: user.name,
    travellers: [], phone: user.phone, method: 'office', status: 'pending', hold: 60, payBy: null, docs: [], created: now - 12 * 60000 })
  trips.save({ ref: newDemoRef(), type: 'flight', demo: 'flight', q: {}, date: day, img: 'istanbul', total: 285, extras: ['bag'], lead: user.name,
    travellers: [], phone: user.phone, method: 'qi', status: 'paid', hold: null, payBy: null, docs: [], created: now - 2 * 864e5 })
}
function newDemoRef() { const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let s = 'HY'; for (let k = 0; k < 6; k += 1) s += a[Math.floor(Math.random() * a.length)]; return s }
/** Keep the sample hotel's hold alive so the pay flow can always be shown. */
export function normalise(b) {
  if (b.demo && b.status === 'pending' && holdEnd(b) < Date.now()) { const nb = { ...b, created: Date.now() - 8 * 60000, payBy: null }; setTimeout(() => trips.save(nb), 0); return nb } // saved after render, never during it
  return b
}

/** Display fields in the current language. Saved bookings are rebuilt from their query when the product can. */
export function view(b, i) {
  const { t, L, date } = i
  if (b.demo === 'flight') {
    const from = city(i, 'BGW'); const to = city(i, 'IST')
    return {
      title: t('tp.f.to', { from, to }), sub: `${t('tp.f.airline')} · IA 227`, img: b.img,
      facts: [[t('tp.f.route'), `${from} (BGW) – ${to} (IST)`], [t('tp.f.date'), date(b.date, { weekday: true, year: true })],
        [t('tp.f.time'), <Ltr key="t">08:40 → 11:55</Ltr>], [t('tp.f.flight'), `${t('tp.f.airline')} IA 227`], [t('tp.f.cabin'), t('tp.f.eco')], [t('tp.f.bag'), t('tp.f.bagV')]],
      travellers: [b.lead], docs: [t('tp.doc.eticket'), t('tp.doc.receipt')],
    }
  }
  if (b.demo === 'hotel') {
    const h = (D.hotels || []).find((x) => x.id === 'h-ist-1')
    return {
      title: h ? L(h.name) : t('tp.f.hotel'), sub: `${city(i, 'IST')} · ${t('tp.f.stars', { n: h?.stars || 5 })}`, img: b.img,
      facts: [[t('tp.f.in'), date(b.date, { weekday: true, year: true })], [t('tp.f.out'), date(addDaysIso(b.date, b.nights || 4), { weekday: true, year: true })],
        [t('tp.f.nights'), String(b.nights || 4)], [t('tp.f.room'), t('tp.f.roomV')], [t('tp.f.guests'), t('tp.f.guestsV')]],
      travellers: [b.lead], docs: [t('tp.doc.voucher'), t('tp.doc.receipt')],
    }
  }
  let o = null
  try { o = b.q?.type ? buildOrder(b.q, i) : null } catch { o = null }
  return {
    title: o?.title || b.title || '', sub: o?.sub ?? b.sub ?? '', img: o?.img || b.img,
    facts: o?.facts || b.facts || [], docs: o?.docs || b.docs || [], travellers: (b.travellers || []).filter(Boolean),
  }
}

/* ---------- small UI ---------- */
const TONE = { ok: 'bg-emerald-50 text-emerald-700', warn: 'bg-amber-100 text-amber-800', info: 'bg-brand/10 text-brand-600', gold: 'bg-amber-50 text-amber-800', plain: 'bg-mist text-ink/70' }
export const Badge = ({ tone = 'plain', icon, children }) => (
  <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-semibold ${TONE[tone]}`}>{icon && <Icon name={icon} className="size-3.5" strokeWidth={2.4} />}{children}</span>
)
export function StatusBadges({ b, t }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      {hasReq(b, 'cancel') && <Badge tone="info">{t('tp.st.cancelReq')}</Badge>}
      {b.status === 'paid' ? <Badge tone="ok" icon="check">{t('tp.st.paid')}</Badge> : <Badge tone="warn" icon="clock">{t('tp.st.pending')}</Badge>}
    </span>
  )
}
/** "Next" chevron, pointing with the reading direction. */
export const Next = ({ className = 'size-4' }) => <Icon name="chev" className={`${className} shrink-0 ltr:-rotate-90 rtl:rotate-90`} />
export const Kv = ({ rows }) => (
  <dl className="space-y-2.5 text-sm">{rows.filter(Boolean).map(([k, v], n) => <div key={`${k}-${n}`} className="flex justify-between gap-4"><dt className="text-muted">{k}</dt><dd className="text-end font-medium"><bdi>{v}</bdi></dd></div>)}</dl>
)
export const Ref = ({ children, className = '' }) => <b dir="ltr" className={`font-mono tracking-widest ${className}`}>{children}</b>

/** Modal dialog, or a side sheet with `side`. Children render only while open. */
export function Modal({ open, onClose, side = false, label, children }) {
  const ref = useRef(null)
  useEffect(() => {
    const d = ref.current; if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  const cls = side
    ? 'fixed inset-y-0 end-0 start-auto m-0 h-dvh max-h-dvh w-full max-w-[560px] overflow-y-auto bg-white p-0 text-ink backdrop:bg-ink/60 open:animate-fade'
    : 'm-auto w-[min(92vw,440px)] rounded-lg bg-white p-0 text-ink backdrop:bg-ink/60 open:animate-rise'
  return (
    <dialog ref={ref} aria-label={label} className={cls} onClose={onClose} onClick={(e) => e.target === ref.current && onClose()}>
      {open && <div className={side ? 'flex min-h-full flex-col p-6' : 'p-6'}>{children}</div>}
    </dialog>
  )
}
export function ModalHead({ title, onClose, t }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <button type="button" onClick={onClose} className="grid size-9 shrink-0 place-items-center rounded-md hover:bg-mist" aria-label={t('close')}><Icon name="close" className="size-4" /></button>
    </div>
  )
}

export function useToast() {
  const [msg, setMsg] = useState('')
  const tm = useRef(null)
  useEffect(() => () => clearTimeout(tm.current), [])
  const show = (m) => { setMsg(m); clearTimeout(tm.current); tm.current = setTimeout(() => setMsg(''), 2600) }
  const node = (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex justify-center px-4 print:hidden">
      {msg && <p className="animate-rise rounded-md bg-ink px-4 py-3 text-sm text-white shadow-xl">{msg}</p>}
    </div>
  )
  return [node, show]
}

/* ---------- signed out: sign in · find a booking ---------- */
export function EntryCards({ i, prefill = '' }) {
  const { t } = i
  const go = useNavigate()
  const [err, setErr] = useState('')
  const submit = (e) => {
    e.preventDefault()
    const f = e.currentTarget
    const ref = f.ref.value.replace(/\s/g, '').toUpperCase(); const ph = digits(f.phone.value)
    if (ref.length < 6 || ph.length < 9) return setErr('need')
    const b = trips.find(ref)
    if (!b || digits(b.phone) !== ph) return setErr('none')
    addLookup(b.ref); go(`/trips/${b.ref}`)
  }
  return (
    <div className="grid items-start gap-6 md:grid-cols-2">
      <section className="card p-6 sm:p-8">
        <span className="grid size-12 place-items-center rounded-full bg-brand/10 text-brand"><Icon name="phone" className="size-6" /></span>
        <h2 className="mt-4 text-xl font-bold">{t('tp.in.title')}</h2>
        <p className="mt-1 text-sm text-muted">{t('tp.in.lede')}</p>
        <button type="button" onClick={() => openSignIn()} className="btn-primary mt-6"><Icon name="user" className="size-4" />{t('tp.in.btn')}</button>
      </section>
      <section className="card p-6 sm:p-8">
        <span className="grid size-12 place-items-center rounded-full bg-brand/10 text-brand"><Icon name="search" className="size-6" /></span>
        <h2 className="mt-4 text-xl font-bold">{t('tp.find.title')}</h2>
        <p className="mt-1 text-sm text-muted">{t('tp.find.lede')}</p>
        <form onSubmit={submit} noValidate className="mt-6 space-y-4">
          <div><label className="label" htmlFor="tp-ref">{t('tp.find.ref')}</label>
            <input id="tp-ref" name="ref" defaultValue={prefill} dir="ltr" autoCapitalize="characters" autoComplete="off" spellCheck="false" maxLength={10} placeholder="HY••••••" className="field text-start font-mono uppercase tracking-widest" />
            <p className="mt-1 text-xs text-muted">{t('tp.find.refHint')}</p></div>
          <div><label className="label" htmlFor="tp-phone">{t('tp.find.phone')}</label>
            <div className="flex items-center gap-2 rounded-md border border-line px-4 focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10" dir="ltr">
              <span className="text-sm font-semibold text-muted">+964</span>
              <input id="tp-phone" name="phone" type="tel" inputMode="tel" placeholder="770 000 0000" autoComplete="tel-national" className="w-full bg-transparent py-3 outline-none" />
            </div></div>
          {err && <p role="alert" className="text-sm text-red-600">{err === 'need' ? t('tp.find.need') : t('tp.find.none')}
            {err === 'none' && <> <button type="button" className="font-semibold underline underline-offset-2" onClick={() => openHelp(t('tp.find.title'))}>{t('hp.chat')}</button></>}</p>}
          <button className="btn-ghost w-full"><Icon name="search" className="size-4" />{t('tp.find.btn')}</button>
          <p className="text-xs text-muted">{t('tp.find.demo')}</p>
        </form>
      </section>
    </div>
  )
}

/* ---------- print receipt ---------- */
function seeded(s) { let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0) / 4294967296) }
/** QR placeholder drawn from the booking number (no network). */
export function QrMark({ value, className = 'size-28' }) {
  const r = seeded(value); const n = 21; const cells = []
  const finder = (x, y) => (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9)
  for (let y = 0; y < n; y += 1) for (let x = 0; x < n; x += 1) if (!finder(x, y) && r() > 0.52) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />)
  const F = ({ x, y }) => <><rect x={x + 0.5} y={y + 0.5} width="6" height="6" fill="none" stroke="currentColor" strokeWidth="1" /><rect x={x + 2} y={y + 2} width="3" height="3" /></>
  return <svg viewBox="-1 -1 23 23" className={className} shapeRendering="crispEdges" fill="currentColor" aria-hidden="true"><F x={0} y={0} /><F x={n - 7} y={0} /><F x={0} y={n - 7} />{cells}</svg>
}
export function Receipt({ b, v, i }) {
  const { t, L, money, date } = i
  const pm = payment(b.method)
  return (
    <div className="hidden bg-white px-[16mm] pt-[14mm] pb-[12mm] text-[#0b1220] print:block" aria-hidden="true">
      <header className="flex items-start justify-between border-b-2 border-[#0b1220] pb-5">
        <div><Logo className="h-11" /><p className="mt-3 text-[11px] leading-5 text-[#5b6680]">{L(D.company.name)}<br /><bdi dir="ltr">{D.company.phone}</bdi> · {D.company.email}</p></div>
        <div className="text-end"><p className="text-2xl font-bold">{t('tp.rc')}</p><p className="mt-2 text-sm"><Ref>{b.ref}</Ref></p>
          <p className="text-[11px] text-[#5b6680]">{t('tp.rc.issued')}: {date(inDays(0), { year: true })}</p></div>
      </header>
      <section className="mt-6 flex items-start justify-between gap-8">
        <div className="flex-1">
          <h1 className="text-xl font-bold">{v.title}</h1>{v.sub && <p className="text-sm text-[#5b6680]">{v.sub}</p>}
          <div className="mt-5 rounded-md bg-[#f5f7fb] p-4">
            <Kv rows={[...v.facts, v.travellers.length ? [t('tp.travellers'), v.travellers.join(' · ')] : null,
              [t('tp.rc.phone'), <Ltr key="p">{b.phone}</Ltr>], pm ? [t('tp.method'), L(pm.name)] : null,
              [t('tp.rc.status'), b.status === 'paid' ? t('tp.st.paid') : t('tp.st.pending')]]} />
          </div>
          <p className="mt-6 flex justify-between border-t-2 border-[#0b1220] pt-3 text-lg font-bold"><span>{t('tp.total')}</span><Ltr>{money(b.total)}</Ltr></p>
        </div>
        <div className="w-[36mm] shrink-0 rounded-md border border-[#0b1220] p-2 text-center"><QrMark value={b.ref} className="mx-auto size-[30mm]" /><p className="mt-2 text-[10px] text-[#5b6680]">{t('tp.rc.qr')}</p></div>
      </section>
      <footer className="mt-10 border-t border-[#e3e8f2] pt-4 text-center text-[10px] text-[#5b6680]">{t('tp.rc.foot')}</footer>
    </div>
  )
}
