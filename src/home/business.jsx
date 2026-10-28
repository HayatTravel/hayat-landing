/* Home (travelling from Iraq): a quiet "Hayat for business" strip with four tiles. */
import { Link } from 'react-router'
import Icon from '../components/Icon'
import { SectionTitle } from '../components/ui'
import { useI18n } from '../lib/i18n'
import { Arrow } from '../components/services/ui'
import { BIZ } from '../components/business/ui'

function BusinessStrip() {
  const { t } = useI18n()
  return (
    <section className="border-y border-line bg-mist/60 py-16" aria-label={t('bz.title')}>
      <div className="container-x">
        <SectionTitle title={t('bz.title')} action={<Link to="/business" className="btn-ghost shrink-0 px-4 py-2 text-sm">{t('bz.home.all')}<Arrow /></Link>} />
        <p className="-mt-5 mb-6 text-sm text-muted">{t('bz.home.s')}</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BIZ.slice(1).map((b) => (
            <Link key={b.id} to={b.to} className="card card-hover group flex items-start gap-4 p-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-md bg-ink text-white"><Icon name={b.icon} className="size-5" /></span>
              <span className="min-w-0 flex-1"><b className="block">{t(`bz.l.${b.id}`)}</b><span className="mt-1 block text-sm leading-6 text-muted">{t(`bz.ld.${b.id}`)}</span></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default [{ id: 'business', order: 42, mode: 'out', Component: BusinessStrip }]
