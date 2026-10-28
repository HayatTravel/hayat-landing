import { useParams } from 'react-router'
import Icon from '../components/Icon'
import { useI18n } from '../lib/i18n'
import { OFFICES, ROLES } from '../data/company'
import { Hero, Input, MockForm, Sample } from '../components/company/ui'
import NotFound from './NotFound'

/** /careers/:id — one role (sample) and an application form with a CV upload (mock). */
export default function CareersDetail() {
  const i = useI18n(); const { t } = i
  const { id } = useParams()
  const r = ROLES.find((x) => x.id === id)
  if (!r) return <NotFound />
  const city = i.L(OFFICES.find((o) => o.id === r.city)?.city)
  const List = ({ items }) => <ul className="space-y-2">{items.map((x, k) => <li key={k} className="flex gap-2"><Icon name="check" className="mt-1 size-4 shrink-0 text-emerald-600" />{i.L(x)}</li>)}</ul>
  return (
    <>
      <Hero back={['/careers', t('cp.careers.title')]} title={i.L(r.title)} lede={`${t(`cp.dept.${r.dept}`)} · ${city} · ${t(`cp.type.${r.type}`)}`}>
        <div className="mt-4"><Sample /></div>
      </Hero>
      <div className="container-x grid gap-10 py-12 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-10">
          <p className="text-lg leading-8 text-ink/85">{i.L(r.summary)}</p>
          <section><h2 className="mb-3 text-xl font-bold">{t('cp.role.duties')}</h2><List items={r.duties} /></section>
          <section><h2 className="mb-3 text-xl font-bold">{t('cp.role.needs')}</h2><List items={r.needs} /></section>
        </div>
        <section>
          <h2 className="mb-4 text-xl font-bold">{t('cp.role.apply')}</h2>
          <MockForm submitLabel={t('cp.role.send')} doneTitle={t('cp.role.done')} doneText={t('cp.role.doneD')}>
            <Input id="a-name" label={t('cp.f.name')} required autoComplete="name" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input id="a-phone" label={t('sign.phone')} required inputMode="tel" dir="ltr" autoComplete="tel" />
              <Input id="a-email" label={t('cp.f.email')} required type="email" dir="ltr" autoComplete="email" />
            </div>
            <Input id="a-cv" label={t('cp.role.cv')} required type="file" accept=".pdf,.doc,.docx" className="field file:me-3 file:rounded file:border-0 file:bg-mist file:px-3 file:py-1.5 file:text-sm" />
            <Input id="a-note" label={t('cp.role.note')} optional as="textarea" />
          </MockForm>
        </section>
      </div>
    </>
  )
}
