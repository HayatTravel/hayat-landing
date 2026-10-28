import { useState } from 'react'
import { Link, useParams } from 'react-router'
import Icon from '../components/Icon'
import { useI18n } from '../lib/i18n'
import { getPosting, submitApplication } from '../lib/providers/hr'
import { Hero, Input, Sample } from '../components/company/ui'
import CareersNav from '../components/company/CareersNav'
import { cityName } from './Careers'
import NotFound from './NotFound'

function List({ items }) {
  const i = useI18n()
  return <ul className="space-y-2">{items.map((x, k) => <li key={k} className="flex gap-2"><Icon name="check" className="mt-1 size-4 shrink-0 text-emerald-600" />{i.L(x)}</li>)}</ul>
}

/** /careers/:id — one role (sample) and the application form. The application is saved so /careers/track can find it. */
export default function CareersDetail() {
  const i = useI18n(); const { t } = i
  const { id } = useParams()
  const r = getPosting(id)
  const [done, setDone] = useState(null)
  const [err, setErr] = useState('')
  if (!r) return <NotFound />

  const submit = (e) => {
    e.preventDefault()
    const f = e.currentTarget
    const missing = [...f.querySelectorAll('[required]')].filter((x) => (x.type === 'checkbox' ? !x.checked : !String(x.value).trim()))
    if (missing.length) { setErr(t('co.missing')); missing[0].focus(); return }
    setErr('')
    const res = submitApplication({ postingId: r.id, name: f['a-name'].value.trim(), phone: f['a-phone'].value, email: f['a-email'].value.trim(), note: f['a-note'].value.trim(), cvName: f['a-cv'].files?.[0]?.name || '' })
    setDone({ ...res, phone: f['a-phone'].value })
  }

  return (
    <>
      <Hero back={['/careers', t('cp.careers.title')]} title={i.L(r.title)} lede={`${t(`cp.dept.${r.dept}`)} · ${cityName(i, r.city)} · ${t(`cp.type.${r.type}`)}`}>
        <div className="mt-4"><Sample /></div>
        <CareersNav />
      </Hero>
      <div className="container-x grid gap-10 py-12 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-10">
          <p className="text-lg leading-8 text-ink/85">{i.L(r.summary)}</p>
          <section><h2 className="mb-3 text-xl font-bold">{t('cp.role.duties')}</h2><List items={r.duties} /></section>
          <section><h2 className="mb-3 text-xl font-bold">{t('cp.role.needs')}</h2><List items={r.needs} /></section>
          <p className="text-sm text-muted">{t('hr.detail.how')} <Link to="/careers/how-we-hire" className="font-semibold text-brand hover:underline">{t('hr.nav.how')}</Link></p>
        </div>
        <section aria-labelledby="hr-apply">
          <h2 id="hr-apply" className="mb-4 text-xl font-bold">{t('cp.role.apply')}</h2>
          {done ? (
            <div role="status" className="card p-6">
              <span className="grid size-11 place-items-center rounded-full bg-emerald-50 text-emerald-700"><Icon name="check" className="size-5" /></span>
              <h3 className="mt-4 text-lg font-bold">{t('cp.role.done')}</h3>
              <p className="mt-1 text-sm text-muted">{t('cp.ref')}: <bdi dir="ltr" className="font-mono font-bold tracking-wider text-ink">{done.reference}</bdi></p>
              <p className="mt-3 text-sm leading-6 text-ink/80">{t('hr.applied')}</p>
              <Link to={`/careers/track?ref=${done.reference}`} className="btn-primary mt-5 py-2.5 text-sm">{t('hr.nav.track')}</Link>
              <p className="mt-3 text-xs text-muted">{t('co.mock')}</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="card space-y-4 p-6">
              <Input id="a-name" label={t('cp.f.name')} required autoComplete="name" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input id="a-phone" label={t('sign.phone')} required inputMode="tel" dir="ltr" autoComplete="tel" placeholder="+964 770 000 0000" />
                <Input id="a-email" label={t('cp.f.email')} required type="email" dir="ltr" autoComplete="email" />
              </div>
              <Input id="a-cv" label={t('cp.role.cv')} required type="file" accept=".pdf,.doc,.docx" className="field file:me-3 file:rounded file:border-0 file:bg-mist file:px-3 file:py-1.5 file:text-sm" />
              <Input id="a-note" label={t('cp.role.note')} optional as="textarea" />
              <label className="flex cursor-pointer items-start gap-3 text-sm"><input type="checkbox" name="a-consent" required className="mt-1 size-4 accent-[var(--color-brand)]" />
                <span>{t('hr.consent')} <Link to="/careers/how-we-hire#data" className="underline">{t('hr.consentLink')}</Link></span></label>
              {err && <p role="alert" className="text-sm font-medium text-red-600">{err}</p>}
              <button className="btn-primary w-full py-3 sm:w-auto sm:px-8">{t('cp.role.send')}</button>
            </form>
          )}
        </section>
      </div>
    </>
  )
}
