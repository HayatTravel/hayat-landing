import { useSearchParams } from 'react-router'
import { PageHead } from '../components/Layout'
import { SectionTitle } from '../components/ui'
import FlightForm from '../components/flights/FlightForm'
import { CharterBoard } from '../components/flights/parts'
import { IRAQ, isInbound } from '../components/flights/engine'
import IraqAirports from '../components/flights/IraqAirports'
import { useI18n } from '../lib/i18n'
import { useMode } from '../lib/mode'

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
