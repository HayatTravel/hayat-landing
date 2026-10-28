import { Link } from 'react-router'
import Icon from '../components/Icon'
import { useI18n } from '../lib/i18n'
import { LINES, OFFICES } from '../data/company'
import { Tbc } from '../components/company/ui'

/** "About Hayat" strip: short who-we-are, three facts, links to About and Offices. `visitor` frames it for people coming to Iraq. */
function AboutStrip({ visitor }) {
  const i = useI18n(); const { t } = i
  const facts = [
    [t('cp.fact.offices'), OFFICES.map((o) => i.L(o.city)).join(' · '), false],
    [t('cp.fact.since'), t('cp.fact.sinceV'), false],
    visitor ? [t('cp.fact.langs'), t('cp.fact.langsV'), false] : [t('cp.fact.lines'), t('cp.fact.linesV', { n: LINES.length }), false],
  ]
  return (
    <section className="py-16">
      <div className="container-x grid gap-10 rounded-lg border border-line bg-white p-8 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold tracking-wide text-brand uppercase">{t(visitor ? 'cp.home.inEyebrow' : 'cp.home.eyebrow')}</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{t(visitor ? 'cp.home.inTitle' : 'cp.home.title')}</h2>
          <p className="mt-3 max-w-xl leading-8 text-ink/75">{t(visitor ? 'cp.home.inText' : 'cp.home.text')}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/about" className="btn-ghost py-2.5 text-sm">{t('cp.nav.about')}<Icon name="arrow" className="size-4 rtl:-scale-x-100" /></Link>
            <Link to="/about/offices" className="btn-ghost py-2.5 text-sm"><Icon name="pin" className="size-4" />{t('cp.nav.offices')}</Link>
          </div>
        </div>
        <dl className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {facts.map(([k, v, tbc]) => (
            <div key={k} className="border-s-2 border-ink ps-4">
              <dt className="text-sm text-muted">{k}</dt>
              <dd className="mt-0.5 flex flex-wrap items-center gap-2 font-semibold">{v}{tbc && <Tbc />}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export default [
  { id: 'company', order: 45, Component: () => <AboutStrip /> },
  { id: 'company-in', order: 55, mode: 'in', Component: () => <AboutStrip visitor /> },
]
