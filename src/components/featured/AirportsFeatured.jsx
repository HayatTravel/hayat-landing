import { SectionTitle } from '../ui'
import IraqAirports from '../flights/IraqAirports'
import { useI18n } from '../../lib/i18n'

/** Visitors' home, under the search box when "Flights to Iraq" is selected. */
export default function AirportsFeatured() {
  const { t } = useI18n()
  return (
    <section className="container-x py-12">
      <SectionTitle title={t('fl.in.ap.t')} />
      <p className="-mt-5 mb-6 max-w-2xl text-sm text-muted">{t('fl.in.ap.s')}</p>
      <IraqAirports />
    </section>
  )
}
