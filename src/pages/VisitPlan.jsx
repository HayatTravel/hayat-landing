import { useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { PageHead } from '../components/Layout'
import Icon from '../components/Icon'
import { useI18n } from '../lib/i18n'
import { openHelp } from '../lib/store'
import { FAQ, PLAN, photo } from '../data/incoming'
import { useVisitMode } from '../components/incoming/lib'

/* Links that turn advice into action, per section. */
const ACTIONS = {
  arrive: [['/flights', 'iq.plan.flights', 'plane'], ['/visit/visa', 'iq.plan.visa', 'passport']],
  connect: [['/visit/tours', 'iq.plan.sim', 'sim']],
  arbaeen: [['/visit/tours/karbala-najaf', 'iq.plan.arbaeen', 'star']],
}

/** /visit/plan#<section> — seasons, getting there, money, connectivity, etiquette, safety, getting around, Arbaeen, questions. */
export default function VisitPlan() {
  useVisitMode()
  const i = useI18n(); const { t } = i
  const { hash } = useLocation()
  useEffect(() => { if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' }) }, [hash])
  return (
    <>
      <PageHead photo={photo('sulaymaniyah')}>
        <h1 className="text-3xl font-bold sm:text-4xl">{t('iq.planPage.title')}</h1>
        <p className="mt-2 max-w-2xl text-muted">{t('iq.planPage.lede')}</p>
      </PageHead>
      <div className="container-x grid gap-10 py-12 lg:grid-cols-[220px_1fr]">
        <nav aria-label={t('iq.planPage.toc')} className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
          <ul className="space-y-1 border-s border-line text-sm">
            {PLAN.map((s) => <li key={s.id}><a href={`#${s.id}`} className="-ms-px block border-s-2 border-transparent py-1.5 ps-4 text-ink/70 hover:border-brand hover:text-ink">{i.L(s.title)}</a></li>)}
            <li><a href="#faq" className="-ms-px block border-s-2 border-transparent py-1.5 ps-4 text-ink/70 hover:border-brand hover:text-ink">{t('iq.planPage.faq')}</a></li>
          </ul>
        </nav>
        <div className="min-w-0 space-y-12">
          {PLAN.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="flex items-center gap-2.5 text-xl font-bold"><Icon name={s.icon} className="size-5 text-brand" />{i.L(s.title)}</h2>
              <div className="mt-3 max-w-3xl space-y-3 leading-8 text-ink/80">{s.body.map((b, k) => <p key={k}>{i.L(b)}</p>)}</div>
              {ACTIONS[s.id] && <div className="mt-4 flex flex-wrap gap-2">{ACTIONS[s.id].map(([to, k, ic]) => <Link key={to} to={to} className="btn-ghost py-2 text-sm"><Icon name={ic} className="size-4" />{t(k)}</Link>)}</div>}
            </section>
          ))}
          <section id="faq" className="scroll-mt-24">
            <h2 className="text-xl font-bold">{t('iq.planPage.faq')}</h2>
            <div className="mt-4 max-w-3xl divide-y divide-line border-y border-line">
              {FAQ.map((f, k) => (
                <details key={k} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">{i.L(f.q)}<Icon name="chev" className="size-4 shrink-0 transition group-open:rotate-180" /></summary>
                  <p className="mt-3 leading-7 text-ink/80">{i.L(f.a)}</p>
                </details>
              ))}
            </div>
            <button type="button" onClick={() => openHelp(t('iq.planPage.title'))} className="mt-6 flex items-center gap-2 text-sm font-medium text-brand"><Icon name="chat" className="size-4" />{t('iq.planPage.ask')}</button>
          </section>
        </div>
      </div>
    </>
  )
}
