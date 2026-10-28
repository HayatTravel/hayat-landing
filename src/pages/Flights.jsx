import { useSearchParams } from 'react-router'
import { PageHead } from '../components/Layout'
import { SectionTitle } from '../components/ui'
import FlightForm from '../components/flights/FlightForm'
import { CharterBoard } from '../components/flights/parts'
import { useI18n } from '../lib/i18n'

/** /flights: search (prefilled from ?from= / ?to=) and the weekly Hayat charter departures. */
export default function Flights() {
  const { t } = useI18n()
  const [sp] = useSearchParams()
  const initial = Object.fromEntries(sp)
  return (
    <>
      <PageHead>
        <h1 className="text-3xl font-bold sm:text-4xl">{t('fl.land.t')}</h1>
        <p className="mt-2 max-w-2xl text-muted">{t('fl.land.s')}</p>
        <div className="mt-8"><FlightForm key={sp.toString()} initial={initial} /></div>
      </PageHead>
      <section className="container-x py-14">
        <SectionTitle title={t('fl.ch.t')} />
        <p className="-mt-5 mb-6 max-w-2xl text-muted">{t('fl.ch.s')}</p>
        <CharterBoard />
      </section>
    </>
  )
}
