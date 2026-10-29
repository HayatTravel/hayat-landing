import { data, Link } from 'react-router'
import Icon from '../components/Icon'
import { PageHead } from '../components/Layout'
import { useI18n } from '../lib/i18n'

export const loader = () => data(null, { status: 404 })

export default function NotFound() {
  const { t } = useI18n()
  return (
    <PageHead className="grid min-h-[70dvh] place-content-center pb-20 text-center">
      <Icon name="plane" className="mx-auto size-12 text-sky" />
      <p className="mt-6 font-display text-[clamp(5rem,18vw,10rem)] leading-none font-bold text-white/90" dir="ltr">404</p>
      <div>
        <h1 className="mt-4 text-2xl font-bold sm:text-3xl">{t('nf.title')}</h1>
        <p className="mt-2 text-muted">{t('nf.body')}</p>
        <Link to="/" className="btn-primary mt-8">{t('nf.home')}</Link>
      </div>
    </PageHead>
  )
}
