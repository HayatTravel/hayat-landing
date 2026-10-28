import Icon from '../components/Icon'
import D, { media } from '../data/catalog'
import { useI18n } from '../lib/i18n'
import { BizHead, BizNav, Features, PORTAL, RequestForm, SecTitle, Tbc, contactFields } from '../components/business/ui'

const PRODUCTS = [['flights', 'plane', true], ['charter', 'plane'], ['hotels', 'bed'], ['packages', 'luggage'], ['visas', 'passport'], ['transfers', 'car'], ['events', 'ticket']]

/** /business/agents — the wholesale platform for travel agencies (booking.hayat.iq). */
export default function BusinessAgents() {
  const { t, L } = useI18n()
  const fields = [
    { id: 'agency', label: t('bz.f.agency'), required: true },
    { id: 'licence', label: t('bz.f.agencyLic'), required: true },
    { id: 'city', label: t('bz.f.city'), type: 'select', required: true, options: [...D.offices.map((o) => [o.city.en, L(o.city)]), ['other', t('bz.other')]] },
    ...contactFields(t),
    { id: 'notes', label: t('bz.f.notes'), type: 'textarea' },
  ]
  return (
    <>
      <BizHead title={t('bz.ag.title')} sub={t('bz.ag.sub')} photo={media('b2b-office')}>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href={PORTAL} target="_blank" rel="noopener" className="btn-primary px-6"><Icon name="lock" className="size-4" />{t('bz.ag.signin')}</a>
          <a href="#form" className="btn-ghost px-6">{t('bz.ag.register')}</a>
        </div>
        <p className="mt-3 text-xs text-muted"><bdi dir="ltr">booking.hayat.iq</bdi></p>
      </BizHead>
      <BizNav />
      <div className="container-x py-14">
        <Features cols="lg:grid-cols-4" items={[['ticket', 'bz.ag.f1', 'bz.ag.f1d'], ['bag', 'bz.ag.f2', 'bz.ag.f2d'], ['documents', 'bz.ag.f3', 'bz.ag.f3d'], ['headset', 'bz.ag.f4', 'bz.ag.f4d']]} />
        <section className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div aria-labelledby="bzProd">
            <SecTitle id="bzProd" title={t('bz.ag.products')} />
            <ul className="grid gap-3">
              {PRODUCTS.map(([id, ic, tbc]) => (
                <li key={id} className="flex items-center gap-3 rounded-md border border-line p-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-md bg-mist text-brand-600"><Icon name={ic} className="size-4" /></span>
                  <span className="flex flex-1 flex-wrap items-center gap-2 text-sm font-semibold">{t(`bz.p.${id}`)}{tbc && <Tbc />}</span>
                </li>
              ))}
            </ul>
          </div>
          <div id="form" className="scroll-mt-24"><RequestForm kind="agent" title={t('bz.ag.form')} sub={t('bz.ag.formSub')} fields={fields} /></div>
        </section>
      </div>
    </>
  )
}
