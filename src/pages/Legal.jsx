import { NavLink, useParams } from 'react-router'
import Icon from '../components/Icon'
import { useI18n } from '../lib/i18n'
import { LEGAL, LEGAL_DOCS, LEGAL_UPDATED } from '../data/company'
import { Hero } from '../components/company/ui'
import NotFound from './NotFound'

/** /legal/:doc (terms · privacy · cookies · payments) — structured summaries, draft for legal review. */
export default function Legal() {
  const i = useI18n(); const { t } = i
  const { doc } = useParams()
  const d = LEGAL[doc]
  if (!d) return <NotFound />
  return (
    <>
      <Hero title={i.L(d.title)}>
        <p className="mt-3 text-sm text-muted">{t('cp.legal.updated', { date: i.date(LEGAL_UPDATED, { year: true }) })}</p>
      </Hero>
      <div className="container-x grid gap-10 py-12 lg:grid-cols-[220px_1fr]">
        <nav aria-label={t('cp.legal.nav')} className="lg:sticky lg:top-24 lg:self-start">
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            {LEGAL_DOCS.map((k) => <li key={k}><NavLink to={`/legal/${k}`} className={({ isActive }) => `block rounded-md px-3 py-2 text-sm ${isActive ? 'bg-ink text-white' : 'text-ink/75 hover:bg-mist'}`}>{t(`cp.legal.${k}`)}</NavLink></li>)}
          </ul>
        </nav>
        <article className="max-w-3xl">
          <p role="note" className="mb-8 flex gap-2 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"><Icon name="info" className="mt-0.5 size-4 shrink-0" />{t('cp.legal.draft')}</p>
          <ol className="space-y-8">
            {d.sections.map((s, k) => (
              <li key={k}>
                <h2 className="text-lg font-bold"><span className="me-2 text-muted">{k + 1}.</span>{i.L(s.h)}</h2>
                <p className="mt-2 leading-8 text-ink/80">{i.L(s.p)}</p>
              </li>
            ))}
          </ol>
        </article>
      </div>
    </>
  )
}
