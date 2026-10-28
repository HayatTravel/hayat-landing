import { Link } from 'react-router'
import Icon from '../components/Icon'
import { media } from '../data/catalog'
import { useI18n } from '../lib/i18n'
import { OFFICES, VALUES } from '../data/company'
import { BENEFITS, DEPT_TEXT, HR_DEPTS, LEARNING } from '../data/hr'
import { Hero, Tbc } from '../components/company/ui'
import CareersNav from '../components/company/CareersNav'

/** /careers/life — values, departments, offices, learning and benefits (benefit details come with the offer). */
export default function CareersLife() {
  const i = useI18n(); const { t } = i
  return (
    <>
      <Hero photo={media('b2b-office')} title={t('hr.life.title')} lede={t('hr.life.lede')}><CareersNav /></Hero>
      <div className="container-x space-y-16 py-12">
        <section>
          <h2 className="mb-6 text-2xl font-bold tracking-tight">{t('hr.life.values')}</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {VALUES.map((v) => <div key={v.id} className="border-t-2 border-ink pt-4"><Icon name={v.icon} className="size-5 text-brand" /><h3 className="mt-3 font-bold">{i.L(v.title)}</h3><p className="mt-1.5 text-sm leading-6 text-ink/70">{i.L(v.text)}</p></div>)}
          </div>
        </section>
        <section>
          <h2 className="mb-6 text-2xl font-bold tracking-tight">{t('cp.careers.depts')}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HR_DEPTS.map((d) => (
              <Link key={d} to={`/careers?dept=${d}`} className="card card-hover p-5"><h3 className="font-bold">{t(`cp.dept.${d}`)}</h3><p className="mt-1.5 text-sm leading-6 text-ink/70">{i.L(DEPT_TEXT[d])}</p></Link>
            ))}
          </div>
        </section>
        <section className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-bold tracking-tight">{t('hr.life.offices')}</h2>
            <ul className="space-y-3">{OFFICES.map((o) => <li key={o.id} className="flex items-center justify-between gap-3 rounded-md border border-line bg-white p-4"><span><b>{i.L(o.city)}</b> · <span className="text-ink/70">{i.L(o.area)}</span></span><Link to={`/careers?city=${o.id}`} className="text-sm font-semibold text-brand hover:underline">{t('hr.life.rolesHere')}</Link></li>)}</ul>
          </div>
          <div>
            <h2 className="mb-4 text-2xl font-bold tracking-tight">{t('hr.life.learning')}</h2>
            <ul className="space-y-3">{LEARNING.map((x, k) => <li key={k} className="flex gap-2"><Icon name="check" className="mt-1 size-4 shrink-0 text-emerald-600" />{i.L(x)}</li>)}</ul>
            <h2 className="mt-10 mb-4 text-2xl font-bold tracking-tight">{t('hr.life.benefits')}</h2>
            <ul className="space-y-3">{BENEFITS.map((b, k) => <li key={k} className="flex flex-wrap items-center gap-2"><Icon name="check" className="size-4 text-emerald-600" />{i.L(b.title)}{b.tbc && <Tbc hr />}</li>)}</ul>
            <p className="mt-3 text-sm text-muted">{t('hr.life.benefitsNote')}</p>
          </div>
        </section>
      </div>
    </>
  )
}
