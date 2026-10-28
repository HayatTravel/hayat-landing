import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import { PageHead } from '../components/Layout'
import Icon from '../components/Icon'
import { Logo, Stepper } from '../components/ui'
import { buildOrder, steps } from '../lib/order'
import { addDays, dateAr, iqd } from '../lib/format'
import { saveBooking } from '../lib/bookings'
import { OrderSummary } from './Checkout'
import Ticket from '../components/art/Ticket'
import NotFound from './NotFound'

const qr = (data) => `https://api.qrserver.com/v1/create-qr-code/?size=360x360&margin=0&color=0b1220&data=${encodeURIComponent(data)}`
const kinds = { flight: 'تذكرة طيران', hotel: 'حجز فندق', car: 'تأجير سيارة', esim: 'باقة eSIM', deal: 'باقة سفر', transfer: 'نقل من المطار' }

// Print-only A4 receipt: what lands on paper when the visitor prints / saves as PDF.
function Receipt({ o, code, esimQr }) {
  const now = new Date()
  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  const info = o.lines.filter(([, v]) => typeof v !== 'number')
  const money = o.lines.filter(([, v]) => typeof v === 'number')
  return (
    <div className="relative hidden min-h-[297mm] overflow-hidden bg-white px-[16mm] pt-[14mm] pb-[12mm] text-[#0b1220] print:flex print:flex-col">
      <div className="absolute inset-x-0 top-0 h-[3mm] bg-gradient-to-l from-brand via-plum-400 to-ember" />
      {/* watermark */}
      <p aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2 -translate-1/2 -rotate-[24deg] font-display text-[150px] font-bold whitespace-nowrap text-brand/[.04]">HAYAT · حياة</p>

      <header className="flex items-start justify-between border-b-2 border-[#0b1220] pb-5">
        <div>
          <Logo className="h-14" />
          <p className="mt-3 text-[11px] leading-5 text-[#5b6680]">حياة للسفر والسياحة · وكالة معتمدة من IATA<br />شارع عرصات الهندية، الكرادة، بغداد، العراق<br /><bdi dir="ltr">+964 770 000 0000</bdi> · info@hayat.iq · hayat.iq</p>
        </div>
        <div className="text-end">
          <p className="font-display text-2xl font-bold">إيصال حجز</p>
          <p className="text-[11px] tracking-[.3em] text-[#5b6680]" dir="ltr">BOOKING RECEIPT</p>
          <dl className="mt-3 space-y-1 text-[11px]">
            <div className="flex justify-end gap-3"><dt className="text-[#5b6680]">رقم الإيصال</dt><dd className="font-mono font-bold" dir="ltr">HYT-{code}</dd></div>
            <div className="flex justify-end gap-3"><dt className="text-[#5b6680]">تاريخ الإصدار</dt><dd className="font-bold">{dateAr(addDays(0))} · <bdi dir="ltr">{time}</bdi></dd></div>
          </dl>
        </div>
      </header>

      <section className="mt-6 flex items-center justify-between gap-6">
        <div>
          <p className="text-[11px] font-semibold text-brand">{kinds[o.type] || 'حجز'}</p>
          <h1 className="mt-1 text-2xl font-bold">{o.title}</h1>
          <p className="text-sm text-[#5b6680]">{o.subtitle}</p>
        </div>
        <div className="shrink-0 -rotate-6 rounded-md border-[3px] border-double border-emerald-600 px-4 py-1.5 text-center text-emerald-600">
          <p className="text-lg leading-6 font-bold">مؤكّد ومدفوع</p>
          <p className="font-mono text-[10px] tracking-[.3em]" dir="ltr">CONFIRMED · PAID</p>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-[1fr_auto] gap-8">
        <div>
          {info.length > 0 && (
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 rounded-md bg-[#f5f7fb] p-4 text-sm">
              {info.map(([k, v]) => <div key={k}><dt className="text-[10px] text-[#5b6680]">{k}</dt><dd className="font-bold"><bdi>{v}</bdi></dd></div>)}
            </dl>
          )}
          <table className="mt-5 w-full text-sm">
            <thead><tr className="border-b border-[#0b1220] text-[11px] text-[#5b6680]"><th className="pb-2 text-start font-medium">البند</th><th className="pb-2 text-end font-medium">المبلغ</th></tr></thead>
            <tbody>
              {money.map(([k, v]) => <tr key={k} className="border-b border-[#e3e8f2]"><td className="py-2.5">{k}</td><td className="py-2.5 text-end font-semibold"><bdi>{iqd(v)}</bdi></td></tr>)}
            </tbody>
            <tfoot><tr className="bg-[#0b1220] text-white"><td className="px-3 py-3 font-bold">الإجمالي المدفوع</td><td className="px-3 py-3 text-end text-lg font-bold"><bdi>{iqd(o.total)}</bdi></td></tr></tfoot>
          </table>
          <p className="mt-2 text-[10px] text-[#5b6680]">الأسعار بالدينار العراقي وتشمل جميع الضرائب والرسوم.</p>
        </div>
        <div className="w-[38mm] text-center">
          <img src={esimQr || qr(`https://hayat.iq/manage?ref=${code}`)} alt="" className="size-[38mm]" />
          <p className="mt-2 text-[10px] leading-4 text-[#5b6680]">{esimQr ? 'امسح لتفعيل باقة eSIM' : 'امسح لإدارة حجزك'}</p>
          <p className="font-mono text-sm font-bold tracking-[.2em] text-brand" dir="ltr">{code}</p>
        </div>
      </section>

      {/* tear-off ticket */}
      <section className="mt-8">
        <p className="mb-2 flex items-center gap-2 text-[10px] text-[#5b6680]"><span>✂</span><span className="h-px flex-1 border-t border-dashed border-[#8f9bb3]" /><span>اقطع هنا واحتفظ بالقسيمة</span></p>
        <div className="mx-auto max-w-[120mm]"><Ticket order={o} code={code} /></div>
      </section>

      <footer className="mt-auto border-t border-[#e3e8f2] pt-4 text-[10px] leading-5 text-[#5b6680]">
        <div className="flex items-end justify-between gap-6">
          <ul className="list-disc ps-4">
            <li>يُرجى إبراز هذا الإيصال أو رقم الحجز عند تسجيل الوصول، مع وثيقة سفر سارية.</li>
            <li>تخضع التعديلات والإلغاء لشروط المزوّد وسياسة الإلغاء المنشورة على hayat.iq.</li>
            <li>وثيقة إلكترونية صادرة من نظام حياة للسفر ولا تتطلب توقيعاً أو ختماً.</li>
          </ul>
          <p className="shrink-0 font-display text-sm font-bold text-[#0b1220]">شكراً لسفرك مع حياة</p>
        </div>
      </footer>
    </div>
  )
}

export default function Confirmation() {
  const [sp] = useSearchParams()
  const o = buildOrder(sp)
  const ref = sp.get('ref')
  useEffect(() => { if (ref) saveBooking(ref, sp) }, [ref, sp])
  if (!o || !ref) return <NotFound />
  const esim = o.type === 'esim'

  const esimQr = esim && qr(`LPA:1$smdp.hayat.iq$${ref}-${sp.get('cc')}`)

  return (
    <>
      <Receipt o={o} code={ref} esimQr={esimQr} />
      <div className="contents print:hidden">
      <PageHead><Stepper steps={steps[o.type]} current={steps[o.type].length} /></PageHead>
      <div className="container-x grid gap-8 py-12 lg:grid-cols-[1fr_380px]">
        <div className="card relative animate-rise overflow-hidden p-8 text-center sm:p-12">
          <span className="relative mx-auto grid size-20 place-items-center rounded-full bg-emerald-500 text-white">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40 [animation-iteration-count:2]" />
            <svg viewBox="0 0 24 24" className="size-10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" pathLength="1" strokeDasharray="1" className="rm-draw" style={{ animationDuration: '.6s', animationDelay: '.2s' }} />
            </svg>
          </span>
          <h1 className="mt-6 text-3xl font-bold">{esim ? 'باقتك جاهزة للتفعيل!' : 'تم تأكيد حجزك!'}</h1>
          <p className="mt-2 text-muted">أرسلنا التفاصيل إلى بريدك الإلكتروني وواتساب.</p>
          <div className="mt-8"><Ticket order={o} code={ref} /></div>

          {esim ? (
            <div className="mt-10 grid items-center gap-8 text-start md:grid-cols-[auto_1fr]">
              <div className="mx-auto rounded-3xl bg-white p-4 ring-1 ring-line">
                <img src={esimQr} alt="رمز QR لتفعيل eSIM" className="size-48" />
              </div>
              <ol className="space-y-4">
                {['افتح الإعدادات ← الخلوي ← إضافة eSIM', 'اختر "استخدام رمز QR" وامسح الرمز', 'سمِّ الخط "حياة" وفعّل تجوال البيانات عند الوصول'].map((s, i) => (
                  <li key={s} className="flex gap-3"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-white">{i + 1}</span><span className="pt-0.5 text-sm">{s}</span></li>
                ))}
              </ol>
            </div>
          ) : (
            <div className="mt-10 grid gap-3 text-sm sm:grid-cols-3">
              {[['phone', 'مشاركة عبر واتساب', `https://wa.me/?text=${encodeURIComponent(`حجزي مع حياة للسفر: ${ref}`)}`], ['calendar', 'طباعة / حفظ PDF', null], ['headset', 'تواصل مع الدعم', 'tel:+9647700000000']].map(([i, t, href]) => (
                <a key={t} href={href || undefined} target={href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer" onClick={href ? undefined : () => print()}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-mist p-4 font-medium transition hover:bg-brand/10 hover:text-brand"><Icon name={i} className="size-4" />{t}</a>
              ))}
            </div>
          )}

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/" className="btn-ghost">العودة للرئيسية</Link>
            {!esim && <Link to="/esim" className="btn-primary"><Icon name="sim" className="size-4" /> أضف eSIM لرحلتك</Link>}
          </div>
        </div>
        <aside className="animate-rise [animation-delay:150ms]"><OrderSummary o={o} /></aside>
      </div>
      </div>
    </>
  )
}
