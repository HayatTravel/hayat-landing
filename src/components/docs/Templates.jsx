import Icon from '../Icon'
import { Ltr } from '../ui'
import D from '../../data/catalog'
import { addDaysIso, nightsBetween, useI18n } from '../../lib/i18n'
import { qtyOf } from '../../pages/Checkout'
import { guestsText, hotelBy, int, pkgBy, pq, travText } from '../stays/lib'
import { CATS, location, normCar, searchCars } from '../cars/engine'
import { esDays, esim, ev, evDate, tiersOf, trState, trVehicle, airportCity } from '../services/data'
import { tourBy } from '../../data/incoming'
import { tourEnd } from '../incoming/lib'
import { Callout, DocShell, F, QR, Rows, code, isPaid, names } from './kit'
import ETicket from './ETicket'
import { flightOf, packageFlight } from './index'
import { origin } from '../../lib/store'

/* ---------- voucher (hotel, holiday hotel, car, transfer, tour) ---------- */
function VoucherCard({ b, heading, sub, rows, show, extra }) {
  const { t } = useI18n()
  return (
    <section className="grid overflow-hidden rounded-lg border border-line break-inside-avoid sm:grid-cols-[1fr_12rem]">
      <div className="p-6">
        <h2 className="text-xl font-bold">{heading}</h2>{sub && <p className="text-sm text-muted">{sub}</p>}
        <div className="mt-4"><Rows rows={rows} /></div>
        {extra}
      </div>
      <div className="relative flex items-center gap-4 border-t-2 border-dashed border-line bg-mist/50 p-5 sm:flex-col sm:justify-center sm:border-t-0 sm:border-s-2 sm:text-center">
        <span aria-hidden="true" className="absolute -top-3 -start-3 size-6 rounded-full border border-line bg-white max-sm:hidden" />
        <span aria-hidden="true" className="absolute -bottom-3 -start-3 size-6 rounded-full border border-line bg-white max-sm:hidden" />
        <QR value={`${b.ref}-${b.type}`} size={104} />
        <div className="grid gap-2"><F k={t('doc.v.confirm')} v={`${b.type.slice(0, 2).toUpperCase()}-${code(`${b.ref}${b.type}`, 7)}`} ltr /><p className="text-[10px] text-muted">{t('doc.qr')}</p></div>
      </div>
      {show && <p className="flex items-center gap-2 border-t border-line bg-ink px-6 py-3 text-sm font-semibold text-white sm:col-span-2"><Icon name="check" className="size-4" />{show}</p>}
    </section>
  )
}

const picked = (b, o) => (o?.extras || []).filter((x) => (b.extras || []).includes(x.id)).map((x) => x.label)

export function Voucher({ b, o }) {
  const i = useI18n(); const { t } = i
  const q = b.q || {}; const lead = names(b, i)[0]
  const ex = picked(b, o)
  const exRow = ex.length ? [t('doc.v.extras'), ex.join(' · ')] : null
  let v = null
  if (b.type === 'hotel') {
    const h = hotelBy(q.id); const r = h?.rooms.find((x) => x.id === q.room)
    if (h && r && q.in && q.out) {
      const g = { ad: int(q.ad, 2, 1, 10), ch: int(q.ch, 0, 0, 6), rooms: int(q.rooms, 1, 1, 5) }
      v = { heading: i.L(h.name), sub: `${'★'.repeat(h.stars)}`, show: t('doc.v.show'), rows: [
        [t('doc.v.area'), i.L(h.area)],
        [t('doc.v.in'), `${i.date(q.in, { weekday: true, year: true })} · ${t('doc.v.inTime')}`],
        [t('doc.v.out'), `${i.date(q.out, { weekday: true, year: true })} · ${t('doc.v.outTime')}`],
        [t('ht.nightsL'), i.num(nightsBetween(q.in, q.out))],
        [t('doc.v.room'), i.L(r.name)], [t('doc.v.board'), t(`ht.board.${r.board}`)],
        [t('doc.v.guests'), guestsText(i, g)], [t('doc.lead'), lead], exRow,
        [t('doc.v.cancel'), o?.terms || ''],
      ] }
    }
  } else if (b.type === 'package') {
    const p = pkgBy(q.id); const h = p && hotelBy(p.hotel)
    if (p && q.dep) {
      const r = h?.rooms[0]
      v = { heading: h ? i.L(h.name) : i.L(p.title), sub: i.L(p.title), show: t('doc.v.show'), rows: [
        h && [t('doc.v.area'), i.L(h.area)],
        [t('doc.v.in'), `${i.date(q.dep, { weekday: true, year: true })} · ${t('doc.v.inTime')}`],
        [t('doc.v.out'), `${i.date(addDaysIso(q.dep, p.nights), { weekday: true, year: true })} · ${t('doc.v.outTime')}`],
        r && [t('doc.v.room'), i.L(r.name)], r && [t('doc.v.board'), t(`ht.board.${r.board}`)],
        [t('doc.v.guests'), travText(i, pq(q))], [t('doc.lead'), lead], exRow, [t('doc.v.cancel'), o?.terms || ''],
      ] }
    }
  } else if (b.type === 'car') {
    const c0 = normCar(q); const c = searchCars(c0).find((x) => x.id === q.id); const loc = location(c0.city)
    if (c) {
      const sup = i.L(c.supplier)
      v = { heading: i.L(c.name), sub: `${i.L(CATS[c.id])} · ${c.auto ? t('car.auto') : t('car.manual')}`, show: t('doc.v.showCar', { name: sup }), rows: [
        [t('doc.v.supplier'), sup],
        [t('doc.v.pick'), `${i.date(c0.pick, { weekday: true, year: true })} · ${c0.pt} · ${t('car.d.at', { city: i.L(loc.name) })}`],
        [t('doc.v.drop'), `${i.date(c0.drop, { weekday: true, year: true })} · ${c0.dt} · ${t('car.d.same')}`],
        [t('doc.v.driver'), `${lead} · ${c0.age === 'u25' ? t('car.co.u25') : t('car.co.25')}`],
        [t('doc.v.cover'), (b.extras || []).includes('cover') ? t('car.x.cover') : t('car.i.cover', { amount: i.money(c.excess) })],
        [t('doc.v.deposit'), t('car.i.deposit', { amount: i.money(c.deposit) })],
        [t('doc.v.km'), c.km ? t('car.kmDay', { n: c.km }) : t('car.unlimited')], exRow,
      ], extra: (
        <div className="mt-4 break-inside-avoid"><p className="text-sm font-bold">{t('doc.v.bring')}</p>
          <ul className="mt-2 grid gap-1 text-sm">{['doc.v.b1', 'doc.v.b2', 'doc.v.b3'].map((k) => <li key={k} className="flex items-start gap-2"><Icon name="check" className="mt-0.5 size-4 shrink-0 text-emerald-600" />{t(k)}</li>)}</ul></div>
      ) }
    }
  } else if (b.type === 'transfer') {
    const s = trState(q, true); const arr = s.dir === 'arr'
    v = { heading: o?.title || b.title, sub: t(arr ? 'tr.arrL' : 'tr.depL'), show: t('doc.v.showTr'), rows: [
      [t('tr.airport'), `${airportCity(i, s.ap)} (${s.ap})`],
      [t('tr.when'), `${i.date(s.date, { weekday: true, year: true })} · ${s.time}`],
      [t('doc.v.meet'), t(arr ? 'doc.v.meetArr' : 'doc.v.meetDep')],
      [t('doc.v.vehicle'), trVehicle(i, s)], [t('tr.pax'), i.num(s.n)], [t('doc.lead'), lead],
      [t('doc.v.contact'), t('doc.v.contactD')], exRow,
    ], extra: (
      <div className="mt-4 rounded-md border border-dashed border-line p-3 break-inside-avoid">
        <p className="text-[10px] font-semibold tracking-wide text-muted uppercase">{t('doc.v.flightNo')}</p>
        <p className="mt-6 border-b border-ink/30" aria-hidden="true" /><p className="mt-1 text-xs text-muted">{t('doc.v.flightNoD')}</p>
      </div>
    ) }
  } else if (b.type === 'tour') {
    const x = tourBy(q.id)
    if (x && q.date) v = { heading: i.L(x.title), sub: b.sub, show: t('doc.v.showTour'), rows: [
      [t('doc.v.start'), i.date(q.date, { weekday: true, year: true })],
      [t('doc.v.end'), i.date(tourEnd(x, q.date), { weekday: true, year: true })],
      [t('doc.v.meet'), t('doc.v.meetTour')],
      ...(o?.facts || []).filter(([k]) => k !== t('iq.start') && k !== t('iq.end')), [t('doc.lead'), lead], exRow,
    ] }
  }
  if (!v) v = { heading: o?.title || b.title, sub: o?.sub || b.sub, rows: [...(o?.facts || b.facts || []), [t('doc.lead'), lead], exRow] }
  return <VoucherCard b={b} {...v} />
}

/* ---------- day-by-day programme (holiday, tour) ---------- */
export function Programme({ b }) {
  const i = useI18n(); const { t } = i
  const q = b.q || {}
  let items = []; let start = null; let total = 0; let heading = b.title
  if (b.type === 'package') { const p = pkgBy(q.id); if (p) { items = p.days; start = q.dep; total = p.nights + 1; heading = i.L(p.title) } }
  if (b.type === 'tour') { const x = tourBy(q.id); if (x) { items = x.itinerary || []; start = q.date; total = x.days; heading = i.L(x.title) } }
  if (!items.length || !start) return <Rows rows={b.facts || []} />
  // Catalogue programmes may summarise several days in one line: first and last line keep their day, the rest span.
  const span = items.map((_, k) => {
    if (items.length >= total || k === 0) return [k, k]
    if (k === items.length - 1) return [total - 1, total - 1]
    const a = k; const z = k === items.length - 2 ? total - 2 : k
    return [a, Math.max(a, z)]
  })
  return (
    <section className="break-inside-avoid-page">
      <h2 className="text-xl font-bold">{heading}</h2>
      <ol className="mt-4 grid gap-0">
        {items.map((d, k) => {
          const [a, z] = span[k]
          return (
            <li key={k} className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-line py-3 break-inside-avoid">
              <span><b className="block text-sm">{a === z ? t('doc.p.day', { n: i.num(a + 1) }) : t('doc.p.days', { a: i.num(a + 1), b: i.num(z + 1) })}</b>
                <span className="text-xs text-muted">{i.date(addDaysIso(start, a), { weekday: true })}</span></span>
              <span className="text-sm leading-6">{i.L(d)}</span>
            </li>
          )
        })}
      </ol>
      <p className="mt-3 text-xs text-muted">{t('doc.p.note')}</p>
    </section>
  )
}

/* ---------- event tickets: one per seat ---------- */
export function EventTickets({ b }) {
  const i = useI18n(); const { t } = i
  const q = b.q || {}; const e = ev(q.id); const x = e && tiersOf(e).find((z) => z.id === q.tier)
  if (!e || !x) return <Rows rows={b.facts || []} />
  const n = Math.max(1, Math.min(8, parseInt(q.qty, 10) || 1))
  const [h, m] = e.time.split(':').map(Number); const doors = `${String(Math.max(0, h - 1)).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  const lead = names(b, i)[0]
  return Array.from({ length: n }, (_, k) => {
    const no = `${b.ref}-${String(k + 1).padStart(2, '0')}`
    return (
      <section key={no} className="grid overflow-hidden rounded-lg border border-line break-inside-avoid sm:grid-cols-[1fr_11rem]">
        <div className="p-5">
          <p className="text-[10px] font-semibold tracking-wider text-brand uppercase">{t('doc.t.ticket', { n: i.num(k + 1), total: i.num(n) })}</p>
          <h2 className="mt-1 text-xl font-bold">{i.L(e.title)}</h2>
          <p className="text-sm text-muted">{i.L(e.venue)} · {i.L(e.city)}</p>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
            <F k={t('doc.f.date')} v={i.date(evDate(e), { weekday: true, year: true })} className="col-span-2" />
            <F k={t('ev.time')} v={e.time} ltr /><F k={t('doc.t.gates')} v={doors} ltr />
            <F k={t('doc.t.zone')} v={i.L(x.name)} /><F k={t('doc.f.seat')} v={t('doc.t.seat')} />
            <F k={t('doc.t.holder')} v={lead} className="col-span-2" />
          </div>
        </div>
        <div className="relative flex items-center gap-4 border-t-2 border-dashed border-line p-5 sm:flex-col sm:justify-center sm:border-t-0 sm:border-s-2 sm:text-center">
          <span aria-hidden="true" className="absolute -top-3 -start-3 size-6 rounded-full border border-line bg-white max-sm:hidden" />
          <span aria-hidden="true" className="absolute -bottom-3 -start-3 size-6 rounded-full border border-line bg-white max-sm:hidden" />
          <QR value={no} size={100} /><F k={t('doc.t.no')} v={no} ltr />
        </div>
      </section>
    )
  }).concat(<Callout key="note">{t('doc.t.note')}</Callout>)
}

/* ---------- eSIM card ---------- */
export function EsimCard({ b }) {
  const i = useI18n(); const { t } = i
  const c = esim(b.q?.cc); const p = c?.plans[parseInt(b.q?.plan, 10)]
  if (!c || !p) return <Rows rows={b.facts || []} />
  const lpa = `LPA:1$sm-dp.hayat.iq$${code(`${b.ref}-esim`, 16)}`
  const iccid = `8996${String(Math.floor(seedNum(b.ref) * 1e15)).padStart(15, '0')}`
  return (
    <>
      <section className="grid gap-6 rounded-lg border border-line p-6 break-inside-avoid sm:grid-cols-[auto_1fr]">
        <div className="grid justify-items-center gap-2"><QR value={lpa} size={168} /><p className="text-xs text-muted">{t('doc.e.scan')}</p></div>
        <div>
          <h2 className="text-xl font-bold">{t('doc.e.title', { country: i.L(c.name) })}</h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <F k={t('es.data')} v={`${p[1]} GB`} ltr big /><F k={t('es.validity')} v={esDays(i, p[0])} big />
            <F k={t('es.net')} v={c.net} ltr /><F k={t('doc.e.iccid')} v={iccid} ltr />
          </div>
          <p className="mt-4 text-[10px] font-semibold tracking-wide text-muted uppercase">{t('doc.e.code')}</p>
          <p className="mt-1 rounded-md bg-mist px-3 py-2 font-mono text-xs break-all" dir="ltr">{lpa}</p>
        </div>
      </section>
      <ol className="grid gap-3 sm:grid-cols-3">
        {['doc.e.s1', 'doc.e.s2', 'doc.e.s3'].map((k, n) => (
          <li key={k} className="rounded-lg border border-line p-4 text-sm break-inside-avoid"><span className="mb-2 grid size-7 place-items-center rounded-full bg-ink text-xs font-bold text-white">{i.num(n + 1)}</span>{t(k)}</li>
        ))}
      </ol>
      <Callout icon="clock">{t('doc.e.starts')}</Callout>
    </>
  )
}
const seedNum = (s) => { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % 1000003; return h / 1000003 }

/* ---------- visa application (Iraqi passports abroad, or visitors to Iraq) ---------- */
export function Application({ b, o }) {
  const i = useI18n(); const { t } = i
  const paid = isPaid(b)
  const n = o?.travellers?.count || b.travellers?.length || 1
  const steps = ['doc.a.s1', 'doc.a.s2', 'doc.a.s3', 'doc.a.s4']
  const now = paid ? 1 : 0
  const track = `${origin()}${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/trips/${b.ref}`
  return (
    <>
      <section className="rounded-lg border border-line p-6 break-inside-avoid">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><h2 className="text-xl font-bold">{o?.title || b.title}</h2>{(o?.sub || b.sub) && <p className="text-sm text-muted">{o?.sub || b.sub}</p>}</div>
          <F k={t('doc.a.no')} v={`${b.ref}-V${code(b.ref, 3)}`} ltr big />
        </div>
        <div className="mt-4"><Rows rows={o?.facts || b.facts || []} /></div>
      </section>
      <section className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-lg border border-line p-5 break-inside-avoid"><h3 className="text-sm font-bold">{t('doc.a.applicants')}</h3>
          <ol className="mt-3 grid gap-1.5 text-sm">{names(b, i, n).map((x, k) => <li key={k} className="flex items-center gap-2"><Icon name="user" className="size-4 text-muted" />{x}</li>)}</ol></div>
        <div className="rounded-lg border border-line p-5 break-inside-avoid"><h3 className="text-sm font-bold">{t('doc.a.docs')}</h3><p className="text-xs text-muted">{t('doc.a.docsD')}</p>
          <ul className="mt-3 grid gap-1.5 text-sm">{(o?.uploads || []).map((d) => <li key={d.id} className="flex items-center gap-2"><Icon name="documents" className="size-4 text-muted" />{d.label}</li>)}</ul></div>
      </section>
      <section className="rounded-lg border border-line p-5 break-inside-avoid">
        <h3 className="text-sm font-bold">{t('doc.a.status')}</h3>
        <ol className="mt-4 grid gap-3 sm:grid-cols-4">{steps.map((k, s) => (
          <li key={k} className="flex items-center gap-2 text-sm"><span className={`grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold ${s < now ? 'bg-emerald-600 text-white' : s === now ? 'bg-ink text-white' : 'bg-mist text-muted'}`}>{s < now ? <Icon name="check" className="size-3.5" /> : i.num(s + 1)}</span>{t(k)}</li>))}</ol>
        <p className="mt-4 text-sm">{t('doc.a.track')}: <Ltr className="font-mono text-xs text-brand">{track}</Ltr></p>
      </section>
      <Callout>{t('doc.a.note')}</Callout>
    </>
  )
}

/* ---------- receipt (all types) ---------- */
export function Receipt({ b, o }) {
  const i = useI18n(); const { t } = i
  const paid = isPaid(b)
  const n = o?.travellers?.count || 1
  const lines = o ? [
    ...o.price.map((p) => ({ label: p.label, qty: 1, usd: p.usd })),
    ...(o.extras || []).filter((x) => (b.extras || []).includes(x.id)).map((x) => ({ label: x.label, qty: qtyOf(x, n), usd: x.usd * qtyOf(x, n) })),
  ] : [{ label: b.title, qty: 1, usd: b.total }]
  const pm = D.payments.find((p) => p.id === b.method)
  return (
    <>
      <section className="grid gap-6 sm:grid-cols-2">
        <div><p className="text-[10px] font-semibold tracking-wide text-muted uppercase">{t('doc.r.to')}</p>
          <p className="mt-1 font-bold">{names(b, i)[0]}</p><p className="text-sm text-muted"><Ltr>{b.phone}</Ltr></p></div>
        <div className="sm:text-end"><p className="text-[10px] font-semibold tracking-wide text-muted uppercase">{t('doc.r.for')}</p>
          <p className="mt-1 font-bold">{o?.title || b.title}</p>{(o?.sub || b.sub) && <p className="text-sm text-muted">{o?.sub || b.sub}</p>}</div>
      </section>
      <table className="w-full text-sm">
        <thead><tr className="border-b-2 border-ink text-start text-xs text-muted"><th className="py-2 text-start font-semibold">{t('doc.r.item')}</th><th className="w-16 py-2 text-center font-semibold">{t('doc.r.qty')}</th><th className="w-32 py-2 text-end font-semibold">{t('doc.r.amount')}</th></tr></thead>
        <tbody>{lines.map((l, k) => <tr key={k} className="border-b border-line"><td className="py-2.5">{l.label}</td><td className="py-2.5 text-center"><Ltr>{i.num(l.qty)}</Ltr></td><td className="py-2.5 text-end font-semibold"><Ltr>{l.usd ? i.money(l.usd) : t('co.free')}</Ltr></td></tr>)}</tbody>
        <tfoot>
          <tr><td className="pt-4 text-base font-bold" colSpan={2}>{t('doc.r.total')}</td><td className="pt-4 text-end text-xl font-bold"><Ltr>{i.money(b.total)}</Ltr></td></tr>
          <tr><td className="pt-1 text-muted" colSpan={2}>{paid ? t('doc.paid') : t('doc.due')}</td><td className={`pt-1 text-end font-semibold ${paid ? 'text-emerald-700' : 'text-amber-700'}`}><Ltr>{i.money(b.total)}</Ltr></td></tr>
        </tfoot>
      </table>
      <Rows rows={[[t('doc.r.method'), pm ? i.L(pm.name) : '—'], [t('doc.ref'), b.ref], o?.terms && [t('doc.r.terms'), o.terms]]} />
      <p className="text-xs text-muted">{t('doc.r.taxes')}</p>
    </>
  )
}

/* ---------- which body for which kind ---------- */
export function DocBody({ b, o, kind }) {
  const i = useI18n(); const { t } = i
  const title = t(`doc.k.${kind}`)
  let body = null
  if (kind === 'eticket') {
    const f = b.type === 'package' ? packageFlight(b) : flightOf(b)
    body = f ? <ETicket b={b} x={f.x} q={f.q} fare={f.fare} /> : <Rows rows={o?.facts || b.facts || []} />
  }
  if (kind === 'voucher') body = <Voucher b={b} o={o} />
  if (kind === 'programme') body = <Programme b={b} />
  if (kind === 'tickets') body = <EventTickets b={b} />
  if (kind === 'esim') body = <EsimCard b={b} />
  if (kind === 'application') body = <Application b={b} o={o} />
  if (kind === 'receipt') body = <Receipt b={b} o={o} />
  return (
    <DocShell b={b} title={title} receipt={kind === 'receipt'}
      sub={kind === 'receipt' || kind === 'voucher' || kind === 'application' ? null : <div><h1 className="text-2xl font-bold">{o?.title || b.title}</h1>{(o?.sub || b.sub) && <p className="text-sm text-muted">{o?.sub || b.sub}</p>}</div>}>
      {body}
    </DocShell>
  )
}
