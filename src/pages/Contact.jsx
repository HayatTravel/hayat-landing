import { Link, useSearchParams } from 'react-router'
import Icon from '../components/Icon'
import D from '../data/catalog'
import { useI18n } from '../lib/i18n'
import { openHelp, session } from '../lib/store'
import { CONTACT } from '../data/company'
import { Hero, Input, MockForm, Tbc } from '../components/company/ui'

export const TOPICS = ['booking', 'change', 'visa', 'business', 'partner', 'media', 'other']

/** /contact?topic — every way to reach us, and a message form that returns a reference number. */
export default function Contact() {
  const i = useI18n(); const { t } = i
  const [sp] = useSearchParams()
  const topic = TOPICS.includes(sp.get('topic')) ? sp.get('topic') : 'booking'
  const u = session.user()
  const channels = [
    { icon: 'chat', title: t('cp.ch.chat'), text: t('cp.ch.chatD'), action: <button type="button" onClick={() => openHelp(t('cp.nav.contact'))} className="font-semibold text-brand hover:underline">{t('cp.ch.chatGo')}</button> },
    { icon: 'phone', title: t('cp.ch.phone'), text: t('cp.ch.phoneD'), action: <a href={`tel:${D.company.phone.replace(/\s/g, '')}`} className="font-semibold text-brand hover:underline"><bdi dir="ltr">{D.company.phone}</bdi></a>, tbc: true },
    { icon: 'send', title: t('cp.ch.email'), text: t('cp.ch.emailD'), action: <a href={`mailto:${CONTACT.email}`} className="font-semibold text-brand hover:underline"><bdi dir="ltr">{CONTACT.email}</bdi></a>, tbc: true },
    { icon: 'pin', title: t('cp.ch.offices'), text: t('cp.ch.officesD'), action: <Link to="/about/offices" className="font-semibold text-brand hover:underline">{t('cp.nav.offices')}</Link> },
  ]
  return (
    <>
      <Hero title={t('cp.contact.title')} lede={t('cp.contact.lede')} />
      <div className="container-x grid gap-10 py-12 lg:grid-cols-[1fr_1.2fr]">
        <section aria-label={t('cp.contact.ways')} className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {channels.map((c) => (
            <div key={c.title} className="flex gap-4 rounded-lg border border-line bg-white p-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-md bg-mist text-brand"><Icon name={c.icon} className="size-5" /></span>
              <div><h2 className="flex flex-wrap items-center gap-2 font-bold">{c.title}{c.tbc && <Tbc />}</h2><p className="mt-0.5 text-sm text-ink/70">{c.text}</p><div className="mt-2 text-sm">{c.action}</div></div>
            </div>
          ))}
          <p className="text-sm text-muted">{t('cp.contact.complaint')} <Link to="/feedback" className="font-semibold text-brand hover:underline">{t('cp.nav.feedback')}</Link></p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold">{t('cp.contact.write')}</h2>
          <MockForm key={topic} submitLabel={t('cp.send')} doneTitle={t('cp.contact.done')} doneText={t('cp.contact.doneD')}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input id="c-name" label={t('cp.f.name')} required autoComplete="name" defaultValue={u?.name || ''} />
              <Input id="c-phone" label={t('sign.phone')} required inputMode="tel" dir="ltr" autoComplete="tel" defaultValue={u?.phone || ''} placeholder="+964 770 000 0000" />
              <Input id="c-email" label={t('cp.f.email')} optional type="email" dir="ltr" autoComplete="email" />
              <Input id="c-topic" label={t('cp.f.topic')} as="select" defaultValue={topic}>{TOPICS.map((k) => <option key={k} value={k}>{t(`cp.topic.${k}`)}</option>)}</Input>
              <Input id="c-ref" label={t('cp.f.ref')} optional dir="ltr" placeholder="HY…" />
            </div>
            <Input id="c-msg" label={t('cp.f.message')} as="textarea" required />
            <p className="text-xs text-muted">{t('cp.f.privacy')} <Link to="/legal/privacy" className="underline">{t('cp.legal.privacy')}</Link></p>
          </MockForm>
        </section>
      </div>
    </>
  )
}
