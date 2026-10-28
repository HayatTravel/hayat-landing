import { useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import Icon from '../components/Icon'
import { useI18n } from '../lib/i18n'
import { HR_FAQ, STEPS } from '../data/hr'
import { Hero, Tbc } from '../components/company/ui'
import CareersNav from '../components/company/CareersNav'

/** /careers/how-we-hire — the five steps, what to prepare, fair hiring, adjustments, applicant data, questions. */
export default function CareersHow() {
  const i = useI18n(); const { t } = i
  const { hash } = useLocation()
  useEffect(() => { if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' }) }, [hash])
  return (
    <>
      <Hero title={t('hr.how.title')} lede={t('hr.how.lede')}><CareersNav /></Hero>
      <div className="container-x space-y-16 py-12">
        <ol className="space-y-4">
          {STEPS.map((s, k) => (
            <li key={s.id} className="card grid gap-5 p-6 md:grid-cols-[auto_1.3fr_1fr]">
              <span className="grid size-11 place-items-center rounded-full bg-ink font-bold text-white">{k + 1}</span>
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold"><Icon name={s.icon} className="size-5 text-brand" />{i.L(s.title)}</h2>
                <p className="mt-2 leading-7 text-ink/80">{i.L(s.text)}</p>
                {s.link && <Link to={s.link} className="mt-2 inline-block text-sm font-semibold text-brand hover:underline">{t('hr.nav.onboarding')}</Link>}
              </div>
              <div className="rounded-md bg-mist p-4">
                <p className="mb-2 text-sm font-semibold">{t('hr.how.prep')}</p>
                <ul className="space-y-1.5 text-sm text-ink/80">{s.prep.map((p, n) => <li key={n} className="flex gap-2"><Icon name="check" className="mt-0.5 size-4 shrink-0 text-emerald-600" />{i.L(p)}</li>)}</ul>
              </div>
            </li>
          ))}
        </ol>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-line bg-white p-6"><h2 className="font-bold">{t('hr.fair.title')}</h2><p className="mt-2 text-sm leading-7 text-ink/80">{t('hr.fair.text')}</p></div>
          <div className="rounded-lg border border-line bg-white p-6"><h2 className="font-bold">{t('hr.adj.title')}</h2><p className="mt-2 text-sm leading-7 text-ink/80">{t('hr.adj.text')}</p></div>
          <div id="data" className="scroll-mt-24 rounded-lg border border-line bg-white p-6"><h2 className="font-bold">{t('hr.data.title')}</h2><p className="mt-2 text-sm leading-7 text-ink/80">{t('hr.data.text')}</p>
            <p className="mt-3 flex flex-wrap items-center gap-2 text-sm"><span className="text-muted">{t('hr.data.keep')}</span><Tbc hr /></p>
            <Link to="/legal/privacy" className="mt-3 inline-block text-sm font-semibold text-brand hover:underline">{t('cp.legal.privacy')}</Link></div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold tracking-tight">{t('hr.faq')}</h2>
          <div className="max-w-3xl divide-y divide-line border-y border-line">
            {HR_FAQ.map((f, k) => (
              <details key={k} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">{i.L(f.q)}<Icon name="chev" className="size-4 shrink-0 transition group-open:rotate-180" /></summary>
                <p className="mt-3 leading-7 text-ink/80">{i.L(f.a)}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
