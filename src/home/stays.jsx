import { Link } from 'react-router'
import Icon from '../components/Icon'
import D from '../data/catalog'
import { useI18n } from '../lib/i18n'
import { PkgCard } from '../components/stays/ui'
import { byNextDep } from '../components/stays/lib'

/** The only holiday content on home: the four soonest departures and a link to all holidays. */
function Holidays() {
  const { t } = useI18n()
  return (
    <section className="py-20">
      <div className="container-x">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('pk.home')}</h2>
            <p className="mt-2 text-muted">{t('pk.lede')}</p>
          </div>
          <Link to="/holidays" className="btn-ghost py-2.5 text-sm">{t('pk.all')}<Icon name="arrow" className="size-4 rtl:-scale-x-100" /></Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...D.packages].sort(byNextDep).slice(0, 4).map((p) => <PkgCard key={p.id} p={p} />)}
        </div>
      </div>
    </section>
  )
}

export default [{ id: 'holidays', order: 20, Component: Holidays }]
