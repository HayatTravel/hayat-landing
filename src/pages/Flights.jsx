import { Link, useSearchParams } from 'react-router'
import { PageHead } from '../components/Layout'
import Icon from '../components/Icon'
import { SectionTitle } from '../components/ui'
import FlightForm from '../components/flights/FlightForm'
import { CharterBoard } from '../components/flights/parts'
import { IRAQ, isInbound, place, qs } from '../components/flights/engine'
import { IRAQ_AIRPORTS } from '../components/flights/world'
import { useI18n } from '../lib/i18n'
import { useMode } from '../lib/mode'

/** Visitors: the five Iraqi airports, their region and typical connections; each opens the form for that airport. */
function IraqAirports({ from }) {
  const i = useI18n(); const { t } = i
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {IRAQ_AIRPORTS.map((a) => (
        <Link key={a.code} to={`/flights?${qs({ from, to: a.code })}`} onClick={() => scrollTo({ top: 0, behavior: 'smooth' })} className="card card-hover group flex flex-col p-5">
          <span className="flex items-start justify-between gap-3">
            <span><span className="block text-lg font-bold">{place(a.code, i.L)}</span>
              <span className={`mt-1 inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${a.region === 'krg' ? 'bg-emerald-50 text-emerald-800' : 'bg-mist text-ink/70'}`}>{t(`fl.in.${a.region}`)}</span></span>
            <span className="font-mono text-sm font-bold text-muted" dir="ltr">{a.code}</span>
          </span>
          <span className="mt-3 text-sm text-ink/80">{t(`fl.in.ap.${a.code}`)}</span>
          <span className="mt-2 text-xs text-muted">{t('fl.in.links', { list: a.links.map((c) => place(c, i.L)).join(' · ') })}</span>
          <span className="mt-auto flex items-center gap-1.5 pt-4 text-sm font-semibold text-brand">{t('fl.in.go', { city: place(a.code, i.L) })}<Icon name="arrow" className="size-4 rtl:-scale-x-100" /></span>
        </Link>
      ))}
    </div>
  )
}

/** /flights: search (prefilled from ?from= / ?to=). Travelling from Iraq: the weekly Hayat charter board.
    Visiting Iraq (mode 'in', or an inbound ?from/?to): "Flights to Iraq" form and the airports in Iraq. */
export default function Flights() {
  const { t } = useI18n()
  const { incoming } = useMode()
  const [sp] = useSearchParams()
  const initial = Object.fromEntries(sp)
  const inbound = incoming || (initial.to && IRAQ.includes(initial.to.toUpperCase()) && (!initial.from || isInbound({ from: initial.from.toUpperCase(), to: initial.to.toUpperCase() })))
  return (
    <>
      <PageHead>
        <h1 className="text-3xl font-bold sm:text-4xl">{t(inbound ? 'fl.in.land.t' : 'fl.land.t')}</h1>
        <p className="mt-2 max-w-2xl text-muted">{t(inbound ? 'fl.in.land.s' : 'fl.land.s')}</p>
        <div className="mt-8"><FlightForm key={`${inbound}${sp.toString()}`} inbound={!!inbound} initial={initial} /></div>
      </PageHead>
      <section className="container-x py-14">
        <SectionTitle title={t(inbound ? 'fl.in.ap.t' : 'fl.ch.t')} />
        <p className="-mt-5 mb-6 max-w-2xl text-muted">{t(inbound ? 'fl.in.ap.s' : 'fl.ch.s')}</p>
        {inbound ? <IraqAirports from={initial.from} /> : <CharterBoard />}
      </section>
    </>
  )
}
