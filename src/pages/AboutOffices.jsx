import { Link } from 'react-router'
import Icon from '../components/Icon'
import D, { media } from '../data/catalog'
import { useI18n } from '../lib/i18n'
import { openHelp } from '../lib/store'
import { OFFICES } from '../data/company'
import { Hero, MapBox, Tbc } from '../components/company/ui'

/** /about/offices — where to find us, opening hours and what each office can do. */
export default function AboutOffices() {
  const i = useI18n(); const { t } = i
  const tel = D.company.phone.replace(/\s/g, '')
  return (
    <>
      <Hero photo={media('b2b-office')} back={['/about', t('cp.nav.about')]} title={t('cp.offices.title')} lede={t('cp.offices.lede')} />
      <div className="container-x space-y-6 py-12">
        {OFFICES.map((o) => (
          <section key={o.id} aria-labelledby={`of-${o.id}`} className="card grid gap-6 p-6 md:grid-cols-[1.3fr_1fr]">
            <div>
              <h2 id={`of-${o.id}`} className="flex flex-wrap items-center gap-2 text-xl font-bold">{i.L(o.city)}{o.head && <span className="rounded bg-ink px-2 py-0.5 text-xs font-semibold text-white">{t('cp.offices.head')}</span>}{o.tbc && <Tbc />}</h2>
              <p className="mt-1 flex items-center gap-1.5 text-ink/80"><Icon name="pin" className="size-4 text-muted" />{i.L(o.area)}, {i.L(o.city)} <Tbc className="ms-1" /></p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted"><Icon name="clock" className="size-4" />{i.L(o.hours)}</p>
              <h3 className="mt-5 mb-2 text-sm font-semibold">{t('cp.offices.services')}</h3>
              <ul className="flex flex-wrap gap-2">{o.services.map((s) => <li key={s} className="chip">{t(`cp.svc.${s}`)}</li>)}</ul>
              <div className="mt-6 flex flex-wrap gap-2">
                <a href={`tel:${tel}`} className="btn-ghost py-2 text-sm"><Icon name="phone" className="size-4" /><bdi dir="ltr">{D.company.phone}</bdi></a>
                <button type="button" onClick={() => openHelp(`${t('cp.offices.title')}: ${i.L(o.city)}`)} className="btn-ghost py-2 text-sm"><Icon name="chat" className="size-4" />{t('cp.chat')}</button>
              </div>
            </div>
            <MapBox label={`${i.L(o.area)}, ${i.L(o.city)}`} query={o.map} />
          </section>
        ))}
        <p className="flex gap-2 rounded-md bg-mist p-4 text-sm text-ink/80"><Icon name="info" className="mt-0.5 size-4 shrink-0 text-muted" />{t('cp.offices.note')} <Link to="/contact" className="font-semibold text-brand hover:underline">{t('cp.nav.contact')}</Link></p>
      </div>
    </>
  )
}
