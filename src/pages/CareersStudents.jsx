import { Link } from 'react-router'
import Icon from '../components/Icon'
import { useI18n } from '../lib/i18n'
import { PROGRAMMES } from '../data/hr'
import { listPostings } from '../lib/providers/hr'
import { Hero, Tbc } from '../components/company/ui'
import CareersNav from '../components/company/CareersNav'

/** /careers/students — internships and the graduate programme (both to be confirmed by HR), and how to apply. */
export default function CareersStudents() {
  const i = useI18n(); const { t } = i
  const interns = listPostings({ type: 'intern' })
  return (
    <>
      <Hero title={t('hr.st.title')} lede={t('hr.st.lede')}><CareersNav /></Hero>
      <div className="container-x space-y-14 py-12">
        <section className="grid gap-5 md:grid-cols-2">
          {PROGRAMMES.map((p) => (
            <div key={p.id} className="card p-6">
              <Icon name={p.icon} className="size-6 text-brand" />
              <h2 className="mt-3 flex flex-wrap items-center gap-2 text-xl font-bold">{i.L(p.title)}{p.tbc && <Tbc hr />}</h2>
              <p className="mt-2 leading-7 text-ink/80">{i.L(p.text)}</p>
            </div>
          ))}
        </section>
        <section className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-bold tracking-tight">{t('hr.st.how')}</h2>
            <ol className="space-y-4">{[1, 2, 3].map((n) => <li key={n} className="flex gap-4"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-sm font-bold text-white">{n}</span><span className="pt-1 leading-7 text-ink/80">{t(`hr.st.s${n}`)}</span></li>)}</ol>
          </div>
          <div>
            <h2 className="mb-4 text-2xl font-bold tracking-tight">{t('hr.st.open')}</h2>
            {interns.length ? <ul className="divide-y divide-line rounded-lg border border-line bg-white">{interns.map((r) => <li key={r.id}><Link to={`/careers/${r.id}`} className="flex items-center justify-between gap-3 p-4 hover:bg-mist/60"><b>{i.L(r.title)}</b><Icon name="arrow" className="size-4 text-muted rtl:-scale-x-100" /></Link></li>)}</ul>
              : <p className="text-muted">{t('hr.none')}</p>}
            <p className="mt-4 text-sm text-muted">{t('hr.st.noRole')} <Link to="/contact?topic=other" className="font-semibold text-brand hover:underline">{t('cp.nav.contact')}</Link></p>
          </div>
        </section>
      </div>
    </>
  )
}
