import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { PageHead } from '../components/Layout'
import Icon from '../components/Icon'
import { Ltr } from '../components/ui'
import { useI18n } from '../lib/i18n'
import { openHelp } from '../lib/store'
import D from '../data/catalog'

/* Help: short FAQ by topic, contact, offices, and terms / privacy summaries (#terms, #privacy). */
const FAQ = [['pay', ['pay', 'hold', 'docs']], ['chg', ['change', 'cancel', 'who']], ['visa', ['vdocs', 'vfee']], ['esim', ['estart', 'erefund']], ['data', ['passport', 'signin']]]
const anchorId = (h) => (h === 'terms' || h === 'privacy' ? h : FAQ.some(([g]) => g === h) ? `faq-${h}` : h)

export default function HelpCenter() {
  const { t, L } = useI18n()
  const { hash } = useLocation()
  const jump = (id, smooth = true) => {
    const el = document.getElementById(id); if (!el) return
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
    if (id.startsWith('faq-')) el.querySelector('details')?.setAttribute('open', '')
    el.focus({ preventScroll: true })
  }
  useEffect(() => {
    if (!hash) return
    const id = anchorId(decodeURIComponent(hash.slice(1)))
    const r = requestAnimationFrame(() => jump(id))
    return () => cancelAnimationFrame(r)
  }, [hash])

  const topics = [...FAQ.map(([g]) => [`faq-${g}`, `hp.g.${g}`]), ['terms', 'hp.terms'], ['privacy', 'hp.privacy']]
  const Legal = ({ id, title, keys, icon }) => (
    <section id={id} tabIndex={-1} className="card scroll-mt-24 p-6 outline-none">
      <h2 className="text-lg font-bold">{t(title)}</h2>
      <ul className="mt-4 grid gap-2.5 text-sm">{keys.map((k) => <li key={k} className="flex gap-2"><Icon name={icon} className="mt-0.5 size-4 shrink-0 text-emerald-600" /><span>{t(k)}</span></li>)}</ul>
      <p className="mt-4 text-xs text-muted">{t('hp.legalMock')}</p>
    </section>
  )

  return (
    <>
      <PageHead><h1 className="text-3xl font-bold">{t('hp.title')}</h1><p className="mt-2 max-w-2xl text-muted">{t('hp.sub')}</p></PageHead>
      <div className="container-x py-10">
        <nav aria-label={t('hp.jump')} className="mb-6 flex flex-wrap gap-2">
          {topics.map(([id, k]) => <button key={id} type="button" onClick={() => jump(id)} className="rounded-md border border-line px-3.5 py-2 text-sm font-medium text-ink/75 transition hover:border-brand hover:text-brand">{t(k)}</button>)}
        </nav>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="grid gap-6">
            {FAQ.map(([g, qs]) => (
              <section key={g} id={`faq-${g}`} tabIndex={-1} className="card scroll-mt-24 p-6 outline-none">
                <h2 className="text-lg font-bold">{t(`hp.g.${g}`)}</h2>
                <div className="mt-2">{qs.map((q) => (
                  <details key={q} className="group border-line py-3 [&+&]:border-t">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                      {t(`hp.q.${q}`)}<Icon name="chev" className="size-4 shrink-0 text-muted transition group-open:rotate-180" /></summary>
                    <p className="pt-2 text-sm leading-7 text-ink/75">{t(`hp.a.${q}`)}</p>
                  </details>))}</div>
              </section>
            ))}
            <Legal id="terms" title="hp.terms" keys={['hp.t1', 'hp.t2', 'hp.t3', 'hp.t4']} icon="check" />
            <Legal id="privacy" title="hp.privacy" keys={['hp.p1', 'hp.p2', 'hp.p3', 'hp.p4']} icon="shield" />
          </div>
          <aside className="grid gap-6 lg:sticky lg:top-24">
            <section className="card p-6">
              <h2 className="text-lg font-bold">{t('hp.contact')}</h2><p className="mt-0.5 text-sm text-muted">{t('hp.contactD')}</p>
              <button type="button" onClick={() => openHelp('')} className="btn-primary mt-5 w-full"><Icon name="chat" className="size-4" />{t('hp.chat')}</button>
              <a href={`tel:${D.company.phone.replace(/\s/g, '')}`} className="btn-ghost mt-2 w-full"><Icon name="phone" className="size-4" /><Ltr>{D.company.phone}</Ltr></a>
            </section>
            <section className="card p-6">
              <h2 className="text-lg font-bold">{t('hp.offices')}</h2><p className="mt-0.5 text-sm text-muted">{t('hp.officesNote')}</p>
              <ul className="mt-4 grid gap-3 text-sm">{D.offices.map((o) => (
                <li key={L(o.city)} className="flex gap-2.5"><Icon name="building" className="mt-0.5 size-4 shrink-0 text-muted" />
                  <span><b>{L(o.city)}</b> · {L(o.area)}<span className="block text-xs text-muted">{L(o.hours)}</span></span></li>))}</ul>
            </section>
          </aside>
        </div>
      </div>
    </>
  )
}
