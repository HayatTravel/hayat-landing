import { Link, useParams } from 'react-router'
import { PageHead } from '../components/Layout'
import Icon from '../components/Icon'
import { Logo, Ltr, Stepper } from '../components/ui'
import { useI18n } from '../lib/i18n'
import { trips, useStore } from '../lib/store'
import { bookingSteps } from './Checkout'
import D from '../data/catalog'

const qr = (data) => `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=0&data=${encodeURIComponent(data)}`

/** Print-only A4 receipt (Layth's design, now in three languages). */
export function Receipt({ b }) {
  const { t, money, L } = useI18n()
  return (
    <div className="hidden min-h-[297mm] bg-white px-[16mm] pt-[14mm] pb-[12mm] text-[#0b1220] print:flex print:flex-col">
      <header className="flex items-start justify-between border-b-2 border-[#0b1220] pb-5">
        <div><Logo className="h-12" /><p className="mt-3 text-[11px] leading-5 text-[#5b6680]">{L(D.company.name)}<br /><bdi dir="ltr">{D.company.phone}</bdi> · {D.company.email}</p></div>
        <div className="text-end"><p className="text-2xl font-bold">{t('rc.title')}</p><p className="mt-2 text-[11px]">{t('dn.ref')}: <b dir="ltr" className="font-mono">{b.ref}</b></p>
          <p className="text-[11px]">{new Date(b.created).toLocaleDateString('en-GB')}</p></div>
      </header>
      <section className="mt-6 flex items-start justify-between gap-6">
        <div><h1 className="text-2xl font-bold">{b.title}</h1><p className="text-sm text-[#5b6680]">{b.sub}</p>
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 rounded-md bg-[#f5f7fb] p-4 text-sm">{b.facts.map(([k, v]) => <div key={k}><dt className="text-[10px] text-[#5b6680]">{k}</dt><dd className="font-bold"><bdi>{v}</bdi></dd></div>)}</dl>
          {b.travellers?.length > 0 && <p className="mt-4 text-sm"><span className="text-[#5b6680]">{t('co.who')}:</span> {b.travellers.join(' · ')}</p>}
          <p className="mt-6 flex justify-between border-t-2 border-[#0b1220] pt-3 text-lg font-bold"><span>{b.status === 'paid' ? t('rc.paid') : t('rc.due')}</span><Ltr>{money(b.total)}</Ltr></p></div>
        <div className="w-[36mm] shrink-0 text-center"><img src={qr(`${location.origin}${import.meta.env.BASE_URL}trips/${b.ref}`)} alt="" className="size-[36mm]" /><p className="mt-2 text-[10px] text-[#5b6680]">{t('rc.scan')}</p></div>
      </section>
      <footer className="mt-auto border-t border-[#e3e8f2] pt-4 text-[10px] leading-5 text-[#5b6680]">{t('rc.foot')}</footer>
    </div>
  )
}

export default function Done() {
  useStore()
  const { t, money } = useI18n()
  const { ref } = useParams()
  const b = trips.find(ref)
  if (!b) return <><PageHead><h1 className="text-3xl font-bold">{t('dn.notfound')}</h1></PageHead><div className="container-x py-16 text-center"><Link to="/trips" className="btn-primary">{t('nav.trips')}</Link></div></>
  const paid = b.status === 'paid'
  const wa = `https://wa.me/${D.company.whatsapp}?text=${encodeURIComponent(`${t('wa.hi')}\n${t('dn.ref')}: ${b.ref}`)}`
  const tl = [[t('dn.t1'), 'done'], [paid ? t('dn.t2') : t('dn.t2p'), paid ? 'done' : 'now'], [t('dn.t3'), paid ? 'now' : ''], [t('dn.t4'), '']]
  return (
    <>
      <Receipt b={b} />
      <div className="contents print:hidden">
        <PageHead><Stepper steps={bookingSteps(t)} current={paid ? 3 : 2} /></PageHead>
        <div className="container-x max-w-4xl py-12">
          <div className="card p-8 text-center sm:p-12">
            <span className={`mx-auto grid size-16 place-items-center rounded-full ${paid ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-700'}`}><Icon name={paid ? 'check' : 'clock'} className="size-8" strokeWidth={2.6} /></span>
            <h1 className="mt-5 text-3xl font-bold">{paid ? t('dn.title') : t('dn.pending')}</h1>
            <p className="mt-2 text-muted">{t('dn.ref')}: <b dir="ltr" className="font-mono tracking-widest text-brand">{b.ref}</b></p>
            <p className="mt-1 text-sm text-muted">{t('dn.sent', { phone: `\u2066${b.phone}\u2069` })}</p>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="card p-6"><h2 className="font-bold">{b.title}</h2>{b.sub && <p className="text-sm text-muted">{b.sub}</p>}
              <dl className="mt-4 space-y-2.5 text-sm">{[...b.facts, [t('co.total'), money(b.total)]].map(([k, v]) => <div key={k} className="flex justify-between gap-4"><dt className="text-muted">{k}</dt><dd className="font-medium"><bdi>{v}</bdi></dd></div>)}</dl></div>
            <div className="card p-6"><h2 className="font-bold">{t('dn.next')}</h2>
              <ol className="mt-4 space-y-4">{tl.map(([label, s]) => (
                <li key={label} className="flex items-center gap-3 text-sm"><span className={`size-3 rounded-full ${s === 'done' ? 'bg-emerald-500' : s === 'now' ? 'bg-brand ring-4 ring-brand/20' : 'bg-line'}`} />{label}</li>))}</ol></div>
          </div>
          {b.docs?.length > 0 && (
            <div className="card mt-6 p-6"><h2 className="font-bold">{t('dn.docs')}</h2>
              <ul className="mt-4 grid gap-2">{b.docs.map((d, k) => (
                <li key={d} className="flex items-center gap-3 rounded-md border border-line p-3 text-sm"><Icon name="documents" className="size-5 text-muted" /><span className="flex-1">{d}</span>
                  <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${paid && k === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-mist text-muted'}`}>{paid && k === 0 ? t('dn.ready') : t('dn.soon')}</span></li>))}</ul></div>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to={`/trips/${b.ref}`} className="btn-primary"><Icon name="ticket" className="size-4" />{t('dn.trips')}</Link>
            <a href={wa} target="_blank" rel="noreferrer" className="btn-ghost"><Icon name="whatsapp" className="size-4" />{t('dn.wa')}</a>
            <button type="button" onClick={() => print()} className="btn-ghost"><Icon name="printer" className="size-4" />{t('dn.print')}</button>
          </div>
        </div>
      </div>
    </>
  )
}
