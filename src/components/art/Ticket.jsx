import { airlineLogo, dateAr, hm, seeded } from '../../lib/format'
import { loadPassengers, paxName } from '../../lib/passengers'

export function Barcode({ value, className = 'h-12 w-full', fill = '#0b1220' }) {
  const r = seeded(value)
  let x = 0
  const bars = []
  while (x < 200) {
    const w = 1 + Math.floor(r() * 3)
    if (r() > 0.35) bars.push(<rect key={x} x={x} y="0" width={w} height="40" />)
    x += w + 1
  }
  return <svg viewBox="0 0 200 40" preserveAspectRatio="none" className={className} fill={fill} aria-hidden="true">{bars}</svg>
}

const Field = ({ k, v, ltr }) => (
  <div>
    <p className="text-[10px] tracking-wide text-muted">{k}</p>
    <p className="text-sm font-bold" dir={ltr ? 'ltr' : undefined}>{v}</p>
  </div>
)

// Ticket "prints" out of a slot. Boarding pass for flights, voucher for everything else.
export default function Ticket({ order, code: bookingRef }) {
  const f = order.flight
  const lead = f && paxName(loadPassengers(1)[0], 0)
  const seat = order.lines.find(([k]) => k === 'المقاعد')?.[1]?.split(' ')[0]
  return (
    <div className="mx-auto w-full max-w-md text-start">
      <div className="relative z-10 -mx-1 h-3 rounded-sm bg-[#0b1220] print:hidden" />
      <div className="-mt-1.5 overflow-hidden px-2 pb-2 print:m-0 print:p-0">
        <div className="animate-[print_1.4s_cubic-bezier(.3,.7,.2,1)_both] [animation-delay:.3s]">
          <div className="relative rounded-b-lg border border-line bg-white print:rounded-lg">
            <div className="p-5">
              <div className="flex items-center justify-between">
                {f ? <img src={airlineLogo(f.code)} alt="" className="h-7 w-20 object-contain" /> : <span className="text-sm font-bold text-brand">الحياة للسفر</span>}
                <span className="rounded-sm bg-mist px-2 py-0.5 text-[10px] font-semibold tracking-wider text-muted">{f ? 'بطاقة صعود' : 'قسيمة حجز'}</span>
              </div>
              {f ? (
                <>
                  <div className="mt-5 flex items-center justify-between" dir="ltr">
                    <div><p className="text-4xl font-bold">{f.from}</p><p className="text-xs text-muted">{hm(f.dep)}</p></div>
                    <svg viewBox="0 0 120 24" className="h-6 flex-1 px-3" aria-hidden="true">
                      <path d="M4 12 H116" stroke="#e3e8f2" strokeWidth="2" strokeDasharray="3 5" />
                      <path d="M4 12 H116" stroke="#3d7eff" strokeWidth="2" pathLength="1" strokeDasharray="1" className="rm-draw" style={{ animationDelay: '1.4s' }} />
                      <path d="M-7,-3 L7,0 L-7,3 L-5,0 Z" fill="#3d7eff" style={{ offsetPath: "path('M4 12 H112')", animation: 'fly 1.6s cubic-bezier(.4,0,.2,1) 1.4s both' }} />
                    </svg>
                    <div className="text-right"><p className="text-4xl font-bold">{f.to}</p><p className="text-xs text-muted">{hm(f.arr)}</p></div>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <Field k="المسافر" v={lead} />
                    <Field k="الرحلة" v={f.number} ltr />
                    <Field k="التاريخ" v={dateAr(f.date)} />
                    <Field k="الصعود" v={hm(f.dep - 40)} ltr />
                    <Field k="البوابة" v={`B${(seeded(bookingRef)() * 20 + 1) | 0}`} ltr />
                    <Field k="المقعد" v={seat && seat !== 'تلقائي' ? seat : 'عند التسجيل'} ltr />
                  </div>
                </>
              ) : (
                <>
                  <h3 className="mt-4 text-lg font-bold">{order.title}</h3>
                  <p className="text-xs text-muted">{order.subtitle}</p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {order.lines.filter(([, v]) => typeof v !== 'number').slice(0, 4).map(([k, v]) => <Field key={k} k={k} v={v} />)}
                  </div>
                </>
              )}
            </div>
            {/* perforation */}
            <div className="h-0 border-t-2 border-dashed border-line" />
            <div className="flex items-center gap-4 p-5">
              <Barcode value={bookingRef} className="h-12 flex-1" />
              <div className="text-end">
                <p className="text-[10px] text-muted">رقم الحجز</p>
                <p className="font-mono text-lg font-bold tracking-[.2em] text-brand" dir="ltr">{bookingRef}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
