import { useState } from 'react'
import { Link } from 'react-router'
import Icon from '../components/Icon'
import { useI18n } from '../lib/i18n'
import { ONB_CONTACTS, ONBOARDING } from '../data/hr'
import { OFFICES } from '../data/company'
import { DEMO_CODE, checklistDone, getPosting, onboarding, setChecklist } from '../lib/providers/hr'
import { Hero, Input, Tbc } from '../components/company/ui'
import CareersNav from '../components/company/CareersNav'

/** /careers/onboarding — for new joiners: the public overview as a checklist; a joining code personalises it. Progress is saved. */
export default function CareersOnboarding() {
  const i = useI18n(); const { t } = i
  const [hire, setHire] = useState(null)
  const [err, setErr] = useState('')
  const key = hire?.code || 'public'
  const [done, setDone] = useState(() => checklistDone('public'))
  const all = ONBOARDING.flatMap((g) => g.items.map((x) => `${g.id}.${x.id}`))
  const toggle = (id) => setDone((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); setChecklist(key, n); return n })
  const enter = (e) => {
    e.preventDefault()
    const h = onboarding(e.currentTarget.code.value)
    if (!h) { setErr(t('hr.onb.bad')); return }
    setErr(''); setHire(h); setDone(checklistDone(h.code))
  }
  const pct = Math.round((all.filter((x) => done.has(x)).length / all.length) * 100)
  const role = hire && getPosting(hire.role)
  const office = hire && OFFICES.find((o) => o.id === hire.office)
  return (
    <>
      <Hero title={t('hr.onb.title')} lede={t('hr.onb.lede')}><CareersNav /></Hero>
      <div className="container-x grid gap-10 py-12 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-6">
          <div className="card flex flex-wrap items-center gap-4 p-5">
            <div className="min-w-0 flex-1">
              <p className="font-bold">{hire ? t('hr.onb.welcome') : t('hr.onb.overview')}</p>
              {hire && <p className="text-sm text-muted">{role && i.L(role.title)}{office && ` · ${i.L(office.city)}`}</p>}
            </div>
            <div className="w-full sm:w-56" aria-label={t('hr.onb.progress', { n: pct })}>
              <div className="flex justify-between text-xs text-muted"><span>{t('hr.onb.progressL')}</span><bdi dir="ltr">{pct}%</bdi></div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-mist"><div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} /></div>
            </div>
          </div>
          {ONBOARDING.map((g) => (
            <section key={g.id} aria-labelledby={`onb-${g.id}`} className="card p-6">
              <h2 id={`onb-${g.id}`} className="flex items-center gap-2 text-lg font-bold"><Icon name={g.icon} className="size-5 text-brand" />{i.L(g.title)}</h2>
              <ul className="mt-4 space-y-2">
                {g.items.map((x) => {
                  const id = `${g.id}.${x.id}`
                  return (
                    <li key={id}><label className={`flex cursor-pointer items-start gap-3 rounded-md p-2.5 transition hover:bg-mist ${done.has(id) ? 'text-ink/55' : ''}`}>
                      <input type="checkbox" checked={done.has(id)} onChange={() => toggle(id)} className="mt-1 size-4 accent-[var(--color-brand)]" />
                      <span className={`flex flex-wrap items-center gap-2 ${done.has(id) ? 'line-through' : ''}`}>{i.L(x.text)}{x.tbc && <Tbc hr />}</span>
                    </label></li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {!hire && (
            <form onSubmit={enter} noValidate className="card space-y-3 p-5">
              <h2 className="font-bold">{t('hr.onb.code')}</h2>
              <p className="text-sm text-muted">{t('hr.onb.codeD')}</p>
              <Input id="code" label={t('hr.onb.codeL')} dir="ltr" placeholder="NJ-XXXX" className="field font-mono uppercase" />
              {err && <p role="alert" className="text-sm font-medium text-red-600">{err}</p>}
              <button className="btn-primary w-full py-2.5 text-sm">{t('hr.onb.open')}</button>
              <p className="text-xs text-muted">{t('hr.onb.demo', { code: DEMO_CODE })}</p>
            </form>
          )}
          <section className="card p-5">
            <h2 className="mb-3 font-bold">{t('hr.onb.contacts')}</h2>
            <ul className="space-y-3">{ONB_CONTACTS.map((c) => <li key={c.id} className="flex gap-3"><Icon name={c.icon} className="mt-0.5 size-4 shrink-0 text-brand" /><span><b className="block text-sm">{i.L(c.title)}</b><span className="text-xs text-muted">{i.L(c.text)}</span></span></li>)}</ul>
          </section>
          <p className="flex gap-2 text-xs leading-5 text-muted"><Icon name="info" className="mt-0.5 size-4 shrink-0" />{t('hr.onb.probation')}</p>
          <Link to="/careers/how-we-hire" className="block text-sm font-semibold text-brand hover:underline">{t('hr.nav.how')}</Link>
        </aside>
      </div>
    </>
  )
}
