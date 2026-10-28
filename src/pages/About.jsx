import { Link } from 'react-router'
import Icon from '../components/Icon'
import D, { media } from '../data/catalog'
import { useI18n } from '../lib/i18n'
import { LICENCES, LINES, MILESTONES, OFFICES, TEAMS, VALUES } from '../data/company'
import { H2, Hero, Tbc } from '../components/company/ui'

function LineCard({ x }) {
  const i = useI18n()
  const body = (
    <>
      <span className="grid size-10 place-items-center rounded-md bg-mist text-brand"><Icon name={x.icon} className="size-5" /></span>
      <h3 className="mt-4 flex flex-wrap items-center gap-2 font-bold">{i.L(x.title)}{x.tbc && <Tbc />}</h3>
      <p className="mt-1.5 text-sm leading-6 text-ink/70">{i.L(x.text)}</p>
    </>
  )
  return x.href
    ? <a href={x.href} rel="noopener" className="card card-hover block p-5">{body}</a>
    : <Link to={x.to} className="card card-hover block p-5">{body}</Link>
}

/* Team → careers department filter. */
const TEAM_DEPT = { retail: 'retail', visa: 'visa', inbound: 'inbound', corporate: 'corporate', ops: 'ops' }

/** /about — who we are, vision, mission, values, what we do, how we work, milestones, licences, teams. */
export default function About() {
  const i = useI18n(); const { t } = i
  return (
    <>
      <Hero photo={media('b2b-office')} title={t('cp.about.title')} lede={t('cp.about.lede')}>
        <nav aria-label={t('cp.about.toc')} className="mt-6 flex flex-wrap gap-2 text-sm">
          {['story', 'vision', 'values', 'lines', 'how', 'milestones', 'licences', 'teams'].map((k) => <a key={k} href={`#${k}`} className="rounded-md border border-white/20 px-3 py-1.5 text-white/85 hover:border-white/60">{t(`cp.toc.${k}`)}</a>)}
        </nav>
      </Hero>

      <div className="container-x space-y-20 py-14">
        <section className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <H2 id="story">{t('cp.story.title')}</H2>
            <div className="max-w-2xl space-y-4 text-lg leading-9 text-ink/85">
              <p>{t('cp.story.p1')}</p><p>{t('cp.story.p2')}</p><p>{t('cp.story.p3')}</p>
            </div>
          </div>
          <dl className="grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="card p-5"><dt className="text-sm text-muted">{t('cp.fact.offices')}</dt><dd className="mt-1 font-bold">{OFFICES.map((o) => i.L(o.city)).join(' · ')}</dd></div>
            <div className="card p-5"><dt className="text-sm text-muted">{t('cp.fact.since')}</dt><dd className="mt-1 flex items-center gap-2 font-bold">{t('cp.fact.sinceV')}</dd></div>
            <div className="card p-5"><dt className="text-sm text-muted">{t('cp.fact.lines')}</dt><dd className="mt-1 font-bold">{t('cp.fact.linesV', { n: LINES.length })}</dd></div>
            <div className="card p-5"><dt className="text-sm text-muted">{t('cp.fact.langs')}</dt><dd className="mt-1 font-bold">{t('cp.fact.langsV')}</dd></div>
          </dl>
        </section>

        <section id="vision" className="grid scroll-mt-24 gap-5 md:grid-cols-2">
          {['vision', 'mission'].map((k) => (
            <div key={k} className="rounded-lg bg-ink p-8 text-white">
              <p className="flex items-center gap-2 text-sm font-semibold tracking-wide text-sky uppercase">{t(`cp.${k}`)}<Tbc dark /></p>
              <p className="mt-4 text-xl leading-9 font-semibold">{t(`cp.${k}.text`)}</p>
            </div>
          ))}
        </section>

        <section>
          <H2 id="values" lede={t('cp.values.lede')}>{t('cp.values.title')}</H2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {VALUES.map((v) => (
              <div key={v.id} className="border-t-2 border-ink pt-4">
                <Icon name={v.icon} className="size-5 text-brand" />
                <h3 className="mt-3 font-bold">{i.L(v.title)}</h3>
                <p className="mt-1.5 text-sm leading-6 text-ink/70">{i.L(v.text)}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <H2 id="lines" lede={t('cp.lines.lede')}>{t('cp.lines.title')}</H2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{LINES.map((x) => <LineCard key={x.id} x={x} />)}</div>
        </section>

        <section className="grid gap-10 lg:grid-cols-2">
          <div>
            <H2 id="how">{t('cp.how.title')}</H2>
            <ul className="space-y-4">
              {['licensed', 'offices', 'writing', 'pay', 'help'].map((k) => (
                <li key={k} className="flex gap-3"><Icon name="check" className="mt-1 size-4 shrink-0 text-emerald-600" />
                  <span><b className="block">{t(`cp.how.${k}`)}{k === 'licensed' && <> <Tbc /></>}</b><span className="text-sm leading-6 text-ink/70">{t(`cp.how.${k}d`)}</span></span></li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">{D.payments.map((p) => <span key={p.id} className="grid h-8 min-w-14 place-items-center rounded px-2 text-[11px] font-black text-white" style={{ background: p.color }}>{p.mark}</span>)}</div>
          </div>
          <div>
            <H2 id="milestones" lede={t('cp.milestones.lede')}>{t('cp.milestones.title')}</H2>
            <ol className="relative space-y-6 border-s border-line ps-6">
              {MILESTONES.map((m, k) => (
                <li key={k} className="relative">
                  <span className="absolute -start-[31px] top-1 size-3.5 rounded-full border-2 border-ink bg-white" />
                  <p className="flex items-center gap-2 text-sm text-muted">{m.when || t('cp.year')}{!m.when && <Tbc />}</p>
                  <p className="mt-0.5 font-semibold">{i.L(m.title)}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section>
          <H2 id="licences" lede={t('cp.licences.lede')}>{t('cp.licences.title')}</H2>
          <div className="grid gap-4 md:grid-cols-3">
            {LICENCES.map((l) => (
              <div key={l.id} className="card p-5">
                <Icon name={l.icon} className="size-5 text-brand" />
                <h3 className="mt-3 font-bold">{i.L(l.title)}</h3>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink/70">{i.L(l.text)} <Tbc /></p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <H2 id="teams" lede={t('cp.teams.lede')}>{t('cp.teams.title')}</H2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEAMS.map((x) => (
              <div key={x.id} className="flex gap-4 rounded-lg border border-line bg-white p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-mist text-ink"><Icon name={x.icon} className="size-5" /></span>
                <div><h3 className="font-bold">{i.L(x.title)}</h3><p className="mt-1 text-sm leading-6 text-ink/70">{i.L(x.text)}</p>
                  {TEAM_DEPT[x.id] && <Link to={`/careers?dept=${TEAM_DEPT[x.id]}`} className="mt-2 inline-block text-sm font-semibold text-brand hover:underline">{t('hr.about.roles')}</Link>}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link to="/careers" className="font-semibold text-brand hover:underline">{t('cp.teams.join')}</Link>
            <Link to="/careers/how-we-hire" className="font-semibold text-brand hover:underline">{t('hr.nav.how')}</Link>
            <Link to="/careers/life" className="font-semibold text-brand hover:underline">{t('hr.nav.life')}</Link>
            <Link to="/careers/students" className="font-semibold text-brand hover:underline">{t('hr.nav.students')}</Link>
          </div>
        </section>

        <section className="flex flex-col items-start justify-between gap-6 rounded-lg border border-line bg-mist/60 p-8 md:flex-row md:items-center">
          <div><h2 className="text-2xl font-bold">{t('cp.cta.title')}</h2><p className="mt-1 text-muted">{t('cp.cta.text')}</p></div>
          <div className="flex flex-wrap gap-3">
            <Link to="/about/offices" className="btn-ghost py-2.5"><Icon name="pin" className="size-4" />{t('cp.nav.offices')}</Link>
            <Link to="/contact" className="btn-primary py-2.5">{t('cp.nav.contact')}</Link>
          </div>
        </section>
      </div>
    </>
  )
}
