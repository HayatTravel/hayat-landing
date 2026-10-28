import { Logo } from '../flights/parts'
import { airlineName, clock, fareName, place, seed } from '../flights/engine'
import { useI18n } from '../../lib/i18n'
import { Barcode, Callout, F, QR, code } from './kit'

const hm = (m) => clock(m).hm
const plus = (m) => { const d = clock(m).day; return d ? ` (${d > 0 ? '+' : ''}${d})` : '' }

/** One boarding-pass style card for one traveller on one flight segment, with a perforated stub. */
function Pass({ b, x, leg, s, name, infant, k, fare, cabin, seatPicked }) {
  const i = useI18n(); const { t } = i
  const r = seed(`${b.ref}${s.fn}${k}`)
  const seat = infant ? '—' : seatPicked ? `${8 + Math.floor(r() * 22)}${'ABCDEF'[Math.floor(r() * 6)]}` : t('doc.seatCheckin')
  const pnr = code(`${b.ref}-${s.c}`)
  return (
    <section className="relative grid overflow-hidden rounded-lg border border-line break-inside-avoid sm:grid-cols-[1fr_11rem]">
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2"><Logo c={s.c} className="h-6 w-14" /><span className="text-sm font-semibold">{airlineName(s.c, i.L)}</span></span>
          <span className="rounded-sm bg-mist px-2 py-0.5 text-[10px] font-semibold tracking-wider text-muted uppercase">{t('doc.pass')}</span>
        </div>
        <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-end gap-3" dir="ltr">
          <div><p className="text-4xl font-bold leading-none">{s.from}</p><p className="mt-1 truncate text-xs text-muted"><bdi>{place(s.from, i.L)}</bdi></p></div>
          <svg viewBox="0 0 120 24" className="mb-3 h-5 w-20 sm:w-28" aria-hidden="true">
            <path d="M4 12 H112" stroke="#e3e8f2" strokeWidth="2" strokeDasharray="3 5" />
            <path d="M104 6 L116 12 L104 18 L107 12 Z" fill="#3d7eff" />
          </svg>
          <div className="text-right"><p className="text-4xl font-bold leading-none">{s.to}</p><p className="mt-1 truncate text-xs text-muted"><bdi>{place(s.to, i.L)}</bdi></p></div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
          <F k={t('doc.f.passenger')} v={infant ? `${name} · ${t('doc.infant')}` : name} className="col-span-2" />
          <F k={t('doc.f.flight')} v={s.fn} ltr />
          <F k={t('doc.f.date')} v={i.date(leg.date, { weekday: true })} />
          <F k={t('doc.f.dep')} v={hm(s.dep)} ltr />
          <F k={t('doc.f.arr')} v={`${hm(s.arr)}${plus(s.arr)}`} ltr />
          <F k={t('doc.f.closes')} v={hm(s.dep - 20)} ltr />
          <F k={t('doc.f.seat')} v={seat} ltr={seatPicked && !infant} />
          <F k={t('doc.f.cabin')} v={t(`fl.cab.${cabin}`)} />
          <F k={t('doc.f.fare')} v={fareName(fare, i)} />
          <F k={t('doc.f.bag')} v={`${fare.bag ? t('fl.bagKg', { kg: fare.bag }) : t('fl.i.noBag')} · ${t('fl.i.hand', { kg: fare.hand })}`} className="col-span-2" />
        </div>
        {x.kind === 'charter' && <p className="mt-3 text-xs text-muted">{t('fl.chOp', { name: airlineName(x.carrier, i.L) })}</p>}
      </div>
      {/* perforation with punched notches */}
      <div className="relative flex items-center gap-4 border-t-2 border-dashed border-line p-5 sm:flex-col sm:items-stretch sm:justify-center sm:border-t-0 sm:border-s-2">
        <span aria-hidden="true" className="absolute -top-3 -start-3 size-6 rounded-full border border-line bg-white max-sm:hidden" />
        <span aria-hidden="true" className="absolute -bottom-3 -start-3 size-6 rounded-full border border-line bg-white max-sm:hidden" />
        <QR value={`${b.ref}-${s.fn}-${k}`} size={96} className="sm:mx-auto" />
        <div className="grid gap-2 text-start sm:text-center">
          <F k={t('doc.ref')} v={b.ref} ltr />
          <F k={t('doc.f.pnr')} v={pnr} ltr />
          <p className="text-[10px] text-muted">{t('doc.qr')}</p>
        </div>
      </div>
    </section>
  )
}

/** Every traveller × every segment of the trip; infants are listed last (as in checkout). */
export default function ETicket({ b, x, q, fare }) {
  const { t } = useI18n()
  const n = q.ad + q.ch + q.inf
  const list = Array.from({ length: n }, (_, k) => ({ name: b.travellers?.[k] || t('doc.trav', { n: k + 1 }), infant: k >= q.ad + q.ch }))
  const seatPicked = (b.extras || []).includes('seat') || fare.seat
  return (
    <>
      {x.legs.flatMap((leg, li) => leg.segs.flatMap((s, si) => list.map((p, k) => (
        <Pass key={`${li}-${si}-${k}`} b={b} x={x} leg={leg} s={s} name={p.name} infant={p.infant} k={k} fare={fare} cabin={q.cabin} seatPicked={seatPicked} />
      ))))}
      <Callout icon="info">{t('doc.f.note')}</Callout>
      <Barcode value={b.ref} className="h-10 w-full opacity-80" />
    </>
  )
}

