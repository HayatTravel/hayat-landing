import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { PageHead } from '../components/Layout'
import Icon from '../components/Icon'
import { Ltr } from '../components/ui'
import { inDays, useI18n } from '../lib/i18n'
import { openHelp, openSignIn, session, trips, useStore } from '../lib/store'
import D from '../data/catalog'
import {
  Badge, EntryCards, Kv, Modal, ModalHead, Next, Receipt, Ref, StatusBadges, clock, dayOf, hasReq, holdEnd, imgSrc, isPast, kind, lookups, normalise, payment, tripDate, typeOf, useToast, view,
} from '../components/account/kit'

/* One booking: summary, documents, progress, paying a pending booking, and change / cancel REQUESTS
   (handled by the team in chat, which continues on WhatsApp). */

const ACTIONS = {
  seats: { icon: 'seat', fields: [['sel', 'tp.rq.seat', ['tp.rq.seatW', 'tp.rq.seatA', 'tp.rq.seatT', 'tp.rq.seatX']]] },
  bags: { icon: 'luggage', fields: [['sel', 'tp.rq.bag', ['tp.rq.bag1', 'tp.rq.bag2', 'tp.rq.bagS']]] },
  fdate: { icon: 'calendar', fields: [['date', 'tp.rq.newDate', true], ['flex']] },
  hdates: { icon: 'calendar', fields: [['date', 'tp.rq.checkin', true], ['nights', 'tp.rq.nights']] },
  transfer: { icon: 'truck', fields: [['sel', 'tp.rq.tr', ['tp.rq.trBoth', 'tp.rq.trIn', 'tp.rq.trOut']]] },
  pdates: { icon: 'calendar', fields: [['date', 'tp.rq.newDate', true], ['flex']] },
  names: { icon: 'users', fields: [['text', 'tp.rq.what', true]] },
  vdocs: { icon: 'documents', fields: [['sel', 'tp.rq.doc', ['tp.rq.docP', 'tp.rq.docPh', 'tp.rq.docB', 'tp.rq.docO']], ['note', 'tp.rq.docNote']] },
  vdates: { icon: 'calendar', fields: [['date', 'tp.rq.newDate', true]] },
  etopup: { icon: 'plus', fields: [['gb', 'tp.rq.data']] },
  eresend: { icon: 'qr', fields: [['note', 'tp.rq.resend']] },
  tickets: { icon: 'user', fields: [['text', 'tp.rq.holder', true]] },
  ttime: { icon: 'clock', fields: [['date', 'tp.rq.newDate', false], ['time', 'tp.rq.time', true]] },
  tpickup: { icon: 'pin', fields: [['text', 'tp.rq.addr', true]] },
  change: { icon: 'edit', fields: [['text', 'tp.rq.what', true]] },
  cancel: { icon: 'close', fields: [['sel', 'tp.rq.reason', ['tp.rq.r1', 'tp.rq.r2', 'tp.rq.r3', 'tp.rq.r4']]] },
}
const BY_TYPE = {
  flight: ['seats', 'bags', 'fdate', 'cancel'], hotel: ['hdates', 'transfer', 'cancel'], package: ['pdates', 'names', 'cancel'],
  visa: ['vdocs', 'vdates', 'cancel'], esim: ['etopup', 'eresend', 'cancel'], event: ['tickets', 'cancel'], transfer: ['ttime', 'tpickup', 'cancel'],
  car: ['fdate', 'cancel'], other: ['change', 'cancel'],
}
const policy = (k) => (k === 'visa' ? 'tp.pol.visa' : k === 'esim' ? 'tp.pol.esim' : 'tp.pol.def')

function Field({ f, t }) {
  const [type, label, extra] = f
  const id = `rq-${label}`
  if (type === 'flex') return <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="flex" className="size-4 accent-brand" />{t('tp.rq.flex')}</label>
  if (type === 'note') return <p className="flex gap-2 rounded-md bg-mist p-3 text-sm text-ink/75"><Icon name="info" className="mt-0.5 size-4 shrink-0 text-brand" />{t(label)}</p>
  const lab = <label className="label" htmlFor={id}>{t(label)}</label>
  if (type === 'sel' || type === 'gb') {
    const opts = type === 'gb' ? [3, 5, 10, 20].map((n) => `${n} ${t('tp.u.gb')}`) : extra.map((o) => t(o))
    return <div>{lab}<select id={id} data-rq className="field">{opts.map((o) => <option key={o}>{o}</option>)}</select></div>
  }
  if (type === 'date') return <div>{lab}<input id={id} data-rq type="date" min={inDays(1)} required={extra} className="field" /></div>
  if (type === 'time') return <div>{lab}<input id={id} data-rq type="time" required={extra} className="field" /></div>
  if (type === 'nights') return <div>{lab}<input id={id} data-rq type="number" min="1" max="30" defaultValue="4" inputMode="numeric" className="field" /></div>
  return <div>{lab}<input id={id} data-rq required={extra} autoComplete="off" className="field" /></div>
}

function RequestSheet({ b, id, onClose, onSent, t }) {
  const [err, setErr] = useState(false)
  const a = ACTIONS[id]; const label = t(`tp.a.${id}`)
  const submit = (e) => {
    e.preventDefault()
    const f = e.currentTarget
    const missing = [...f.querySelectorAll('[required]')].filter((x) => !x.value.trim())
    if (missing.length) { setErr(true); missing[0].focus(); return }
    const parts = [...f.querySelectorAll('[data-rq]')].map((x) => x.value.trim()).filter(Boolean)
    if (f.flex?.checked) parts.push(t('tp.rq.flex'))
    const note = f.note.value.trim()
    const cur = trips.find(b.ref) || b
    trips.save({ ...cur, requests: [...(cur.requests || []), { type: id, at: Date.now(), detail: parts.join(' · '), note }] })
    onSent([t('tp.rq.ctx', { ref: b.ref, action: label }), parts.join(' · '), note].filter(Boolean).join(' — '))
  }
  const dates = a.fields.filter((f) => f[0] === 'date' || f[0] === 'nights' || f[0] === 'time')
  return (
    <form onSubmit={submit} noValidate className="flex flex-1 flex-col">
      <ModalHead title={label} onClose={onClose} t={t} />
      <p className="mt-1 text-sm text-muted">{t('tp.rq.lede')}</p>
      <div className="mt-6 grid gap-4">
        {dates.length > 1 ? <div className="grid gap-4 sm:grid-cols-2">{dates.map((f) => <Field key={f[1]} f={f} t={t} />)}</div> : null}
        {a.fields.filter((f) => dates.length < 2 || !dates.includes(f)).map((f) => <Field key={f[1] || f[0]} f={f} t={t} />)}
        {id === 'cancel' && <p className="flex gap-2 rounded-md bg-amber-50 p-3 text-sm text-amber-800"><Icon name="info" className="mt-0.5 size-4 shrink-0" />{t(policy(kind(b.type)))}</p>}
        <div><label className="label" htmlFor="rq-note">{t('tp.rq.note')}</label><textarea id="rq-note" name="note" rows={3} placeholder={t('tp.rq.ph')} className="field" /></div>
        {err && <p role="alert" className="text-sm text-red-600">{t('ac.missing')}</p>}
      </div>
      <div className="sticky bottom-0 -mx-6 -mb-6 mt-auto flex items-center justify-between gap-3 border-t border-line bg-white px-6 py-4">
        <span className="text-xs text-muted">{t('tp.ref')} <Ref className="text-brand">{b.ref}</Ref></span>
        <button className="btn-primary py-2.5"><Icon name="chat" className="size-4" />{t('tp.rq.send')}</button>
      </div>
    </form>
  )
}

function Section({ title, note, children, className = '' }) {
  return (
    <section className={`card p-6 ${className}`}>
      {title && <h2 className="text-lg font-bold">{title}</h2>}
      {note && <p className="mt-0.5 text-sm text-muted">{note}</p>}
      <div className={title ? 'mt-4' : ''}>{children}</div>
    </section>
  )
}

const ActRow = ({ icon, label, sub, onClick, danger, disabled, chevron = true }) => (
  <li className="border-line [&+&]:border-t">
    <button type="button" onClick={onClick} disabled={disabled}
      className={`flex min-h-13 w-full items-center gap-3 rounded-md px-2 py-2 text-start font-semibold transition enabled:hover:bg-mist disabled:text-muted ${danger && !disabled ? 'text-red-700' : ''}`}>
      <span className={`grid size-9 shrink-0 place-items-center rounded-full ${danger && !disabled ? 'bg-red-50 text-red-700' : 'bg-brand/10 text-brand'}`}><Icon name={icon} className="size-4.5" /></span>
      <span className="grid flex-1">{label}{sub && <small className="text-xs font-medium text-muted">{sub}</small>}</span>
      {chevron && !disabled && <Next className="size-4 text-muted" />}
    </button>
  </li>
)

export default function TripsDetail() {
  useStore()
  const i = useI18n()
  const { t, L, money, date } = i
  const { ref } = useParams()
  const [sheet, setSheet] = useState(null)
  const [paying, setPaying] = useState(null)
  const [pm, setPm] = useState(D.payments.find((p) => p.id !== 'office')?.id)
  const [toast, show] = useToast()
  const user = session.user()
  const found = trips.find(ref)

  if (!found || (!user && !lookups().includes(found.ref))) {
    return (
      <>
        <PageHead>
          <Link to="/trips" className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-sky"><Icon name="arrow" className="size-4 rtl:-scale-x-100" />{t('tp.title')}</Link>
          <h1 className="text-3xl font-bold">{found ? t('tp.find.title') : t('tp.notfound')}</h1>
          <p className="mt-2 text-muted">{found ? t('tp.lock') : t('tp.notfoundD')}</p>
        </PageHead>
        <div className="container-x py-10">{user && !found ? <Link to="/trips" className="btn-primary">{t('tp.allTrips')}</Link> : <EntryCards i={i} prefill={String(ref || '').toUpperCase()} />}</div>
      </>
    )
  }

  const b = normalise(found); const v = view(b, i); const ty = typeOf(b); const k = kind(b.type)
  const paid = b.status === 'paid'; const method = payment(b.method); const day = tripDate(b); const past = isPast(b)
  const reqs = b.requests || []
  const end = holdEnd(b); const late = end < Date.now()

  const pay = () => {
    const p = payment(pm) || D.payments[0]
    setPaying(p)
    setTimeout(() => {
      setPaying(null)
      const nb = trips.find(b.ref) || b
      trips.save({ ...nb, status: 'paid', method: p.id, paidAt: Date.now(), payBy: null })
      show(t('tp.pay.ok'))
    }, 1300)
  }
  const sent = (ctx) => { setSheet(null); show(t('tp.rq.ok')); openHelp(ctx) }
  const tl = [
    [t('tp.tl.1'), 'done', date(dayOf(b.created), { year: true })],
    [paid ? t('tp.tl.2') : t('tp.tl.2p'), paid ? 'done' : 'now', method ? L(method.name) : ''],
    [t('tp.tl.3'), paid ? (past ? 'done' : 'now') : '', ''],
    [t('tp.tl.4'), past ? 'done' : '', date(day, { weekday: true, year: true })],
  ]

  return (
    <>
      <Receipt b={b} v={v} i={i} />
      <div className="contents print:hidden">
        <PageHead>
          <Link to="/trips" className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-sky"><Icon name="arrow" className="size-4 rtl:-scale-x-100" />{t('tp.title')}</Link>
          <p className="text-sm text-muted">{t('tp.ref')}</p>
          <div className="mt-1 flex flex-wrap items-center gap-3"><h1 className="text-3xl font-bold"><Ref>{b.ref}</Ref></h1><StatusBadges b={b} t={t} /></div>
          {b.demo && <p className="mt-2 text-xs italic text-muted">{t('tp.sample')}</p>}
        </PageHead>

        <div className="container-x grid items-start gap-6 py-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid gap-6">
            {!paid && (
              <Section title={t('tp.pay.title')}>
                <p className="flex items-center gap-2 rounded-md bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800"><Icon name="clock" className="size-4 shrink-0" />
                  {late ? t('tp.pay.late', { time: clock(end) }) : t('tp.pay.by', { time: clock(end) })}</p>
                <fieldset className="mt-5"><legend className="label">{t('tp.method')}</legend>
                  <div className="grid gap-3 sm:grid-cols-2">{D.payments.filter((p) => p.id !== 'office').map((p) => (
                    <label key={p.id} className="flex cursor-pointer items-start gap-3 rounded-md border border-line p-4 transition hover:border-brand/40 has-[:checked]:border-brand has-[:checked]:bg-brand/5">
                      <input type="radio" name="tp-pm" value={p.id} checked={pm === p.id} onChange={() => setPm(p.id)} className="mt-1 size-4 accent-brand" />
                      <span className="grid h-7 min-w-12 place-items-center rounded px-2 text-[10px] font-black text-white" style={{ background: p.color }}>{p.mark}</span>
                      <span className="grid"><b className="text-sm">{L(p.name)}</b><small className="text-xs text-muted">{L(p.note)}</small></span>
                    </label>))}</div></fieldset>
                <p className="mt-3 flex gap-2 rounded-md bg-mist p-3 text-sm text-ink/75"><Icon name="building" className="mt-0.5 size-4 shrink-0 text-brand" />{t('tp.pay.office')}</p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                  <Ltr className="text-2xl font-bold">{money(b.total)}</Ltr>
                  <button type="button" onClick={pay} className="btn-primary">{t('tp.pay.btn', { amount: money(b.total) })}</button>
                </div>
                <p className="mt-2 text-xs text-muted">{t('tp.pay.mock')}</p>
              </Section>
            )}

            <section className="card overflow-hidden">
              {v.img && <img src={imgSrc(v.img)} alt="" className="aspect-[16/7] w-full object-cover" />}
              <div className="p-6">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-muted"><Icon name={ty.icon} className="size-3.5" />{t(ty.label)}</p>
                <h2 className="mt-1 text-xl font-bold">{v.title}</h2>{v.sub && <p className="text-sm text-muted">{v.sub}</p>}
                <hr className="my-5 border-line" /><Kv rows={v.facts} />
                {v.travellers.length > 0 && <><hr className="my-5 border-line" /><h3 className="text-sm font-bold text-ink/75">{t('tp.travellers')}</h3>
                  <ul className="mt-2 grid gap-1.5 text-sm">{v.travellers.map((n) => <li key={n} className="flex items-center gap-2"><Icon name="user" className="size-4 text-muted" />{n}</li>)}</ul></>}
                <p className="mt-5 flex items-end justify-between border-t border-dashed border-line pt-4"><span className="text-sm">{t('tp.total')}{method && <span className="text-muted"> · {L(method.name)}</span>}</span><Ltr className="text-2xl font-bold">{money(b.total)}</Ltr></p>
              </div>
            </section>

            {v.docs.length > 0 && (
              <Section title={t('tp.docs')} note={t('tp.docsNote')}>
                <ul className="grid gap-2">{v.docs.map((d, n) => {
                  const ready = paid && n === 0
                  return (
                    <li key={d} className="flex flex-wrap items-center gap-3 rounded-md border border-line p-3 text-sm"><Icon name="documents" className="size-5 text-muted" /><span className="flex-1">{d}</span>
                      {ready ? <><Badge tone="ok">{t('tp.doc.ready')}</Badge><button type="button" onClick={() => show(t('tp.mock'))} className="btn-ghost px-3 py-1.5 text-sm"><Icon name="download" className="size-4" />{t('tp.doc.dl')}</button></>
                        : <Badge>{paid ? t('tp.doc.soon') : t('tp.doc.afterPay')}</Badge>}</li>
                  )
                })}</ul>
              </Section>
            )}

            {reqs.length > 0 && (
              <Section title={t('tp.requests')} note={t('tp.requestsNote')}>
                <ul className="grid gap-2">{reqs.slice().reverse().map((r) => (
                  <li key={r.at} className="flex items-start gap-3 rounded-md border border-line p-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand/10 text-brand"><Icon name={ACTIONS[r.type]?.icon || 'edit'} className="size-4" /></span>
                    <span className="grid min-w-0 flex-1 gap-0.5 text-sm"><b>{t(`tp.a.${ACTIONS[r.type] ? r.type : 'change'}`)}</b>
                      {r.detail && <span className="break-words text-ink/75">{r.detail}</span>}
                      <span className="text-xs text-muted">{date(dayOf(r.at))} · <Ltr>{clock(r.at)}</Ltr></span></span>
                    <Badge tone="info">{t('tp.sent')}</Badge>
                  </li>))}</ul>
              </Section>
            )}

            <Section title={t('tp.tl')}>
              <ol className="grid">{tl.map(([label, s, sub], n) => (
                <li key={label} className="relative flex gap-3 pb-5 last:pb-0">
                  {n < tl.length - 1 && <span aria-hidden="true" className="absolute start-[5px] top-4 bottom-0 w-0.5 bg-line" />}
                  <span className={`relative mt-1.5 size-3 shrink-0 rounded-full ${s === 'done' ? 'bg-emerald-500' : s === 'now' ? 'bg-brand ring-4 ring-brand/20' : 'border-2 border-line bg-white'}`} />
                  <span className="grid text-sm"><span className="font-medium">{label}</span>{sub && <span className="text-xs text-muted">{sub}</span>}</span>
                </li>))}</ol>
            </Section>
          </div>

          <aside className="grid gap-6 lg:sticky lg:top-24">
            <Section title={t('tp.mg')} note={t('tp.mg.note')}>
              <ul>{(BY_TYPE[k] || BY_TYPE.other).map((id) => {
                const off = id === 'cancel' && hasReq(b, 'cancel')
                return <ActRow key={id} icon={ACTIONS[id].icon} label={t(`tp.a.${id}`)} sub={off ? t('tp.st.cancelReq') : ''} danger={id === 'cancel'} disabled={off} onClick={() => setSheet(id)} />
              })}</ul>
            </Section>
            <section className="card p-3"><ul>
              <ActRow icon="printer" label={t('tp.print')} onClick={() => print()} chevron={false} />
              <ActRow icon="chat" label={t('tp.helpBk')} onClick={() => openHelp(t('tp.rq.ctx', { ref: b.ref, action: v.title }))} chevron={false} />
            </ul></section>
            {!user && <p className="text-center text-sm text-muted">{t('tp.signHint')} <button type="button" onClick={() => openSignIn()} className="font-semibold text-brand underline underline-offset-2">{t('tp.in.btn')}</button></p>}
          </aside>
        </div>
      </div>

      <Modal side open={!!sheet} onClose={() => setSheet(null)} label={sheet ? t(`tp.a.${sheet}`) : ''}>
        {sheet && <RequestSheet b={b} id={sheet} t={t} onClose={() => setSheet(null)} onSent={sent} />}
      </Modal>
      <Modal open={!!paying} onClose={() => {}} label={t('tp.pay.title')}>
        {paying && <div className="grid justify-items-center gap-3 py-4 text-center">
          <span className="grid h-11 min-w-18 place-items-center rounded px-3 text-sm font-black text-white" style={{ background: paying.color }}>{paying.mark}</span>
          <p>{t('tp.pay.redirect', { name: L(paying.name) })}</p><p className="text-xs text-muted">{t('tp.pay.mock')}</p></div>}
      </Modal>
      {toast}
    </>
  )
}
