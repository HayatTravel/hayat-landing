import { Link } from 'react-router'
import Icon from '../components/Icon'
import { media } from '../data/catalog'
import { useI18n } from '../lib/i18n'
import { DEPARTMENTS, OFFICES, ROLES } from '../data/company'
import { H2, Hero, Sample } from '../components/company/ui'

const cityName = (i, id) => i.L(OFFICES.find((o) => o.id === id)?.city)

/** /careers — why work with us, departments, open roles (samples). */
export default function Careers() {
  const i = useI18n(); const { t } = i
  return (
    <>
      <Hero photo={media('corporate')} title={t('cp.careers.title')} lede={t('cp.careers.lede')} />
      <div className="container-x space-y-16 py-12">
        <section>
          <H2>{t('cp.careers.why')}</H2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {['people', 'learn', 'languages', 'growth'].map((k) => (
              <div key={k} className="border-t-2 border-ink pt-4"><h3 className="font-bold">{t(`cp.why.${k}`)}</h3><p className="mt-1.5 text-sm leading-6 text-ink/70">{t(`cp.why.${k}d`)}</p></div>
            ))}
          </div>
        </section>
        <section>
          <H2>{t('cp.careers.depts')}</H2>
          <ul className="flex flex-wrap gap-2">{DEPARTMENTS.map((d) => <li key={d} className="rounded-md border border-line bg-white px-3 py-1.5 text-sm">{t(`cp.dept.${d}`)}</li>)}</ul>
        </section>
        <section>
          <div className="mb-6 flex flex-wrap items-center gap-3"><h2 className="text-2xl font-bold tracking-tight">{t('cp.careers.open')}</h2><Sample /></div>
          <div className="divide-y divide-line rounded-lg border border-line bg-white">
            {ROLES.map((r) => (
              <Link key={r.id} to={`/careers/${r.id}`} className="flex flex-wrap items-center justify-between gap-3 p-5 transition hover:bg-mist/60">
                <span><span className="block font-bold">{i.L(r.title)}</span><span className="text-sm text-muted">{t(`cp.dept.${r.dept}`)} · {cityName(i, r.city)} · {t(`cp.type.${r.type}`)}</span></span>
                <Icon name="arrow" className="size-4 text-muted rtl:-scale-x-100" />
              </Link>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted">{t('cp.careers.open2')} <Link to="/contact?topic=other" className="font-semibold text-brand hover:underline">{t('cp.nav.contact')}</Link></p>
        </section>
      </div>
    </>
  )
}
