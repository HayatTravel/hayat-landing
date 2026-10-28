import Icon from '../components/Icon'
import D from '../data/catalog'
import { useI18n } from '../lib/i18n'
import { H2, Hero } from '../components/company/ui'
import { Link } from 'react-router'

const AIRLINES = Object.keys(D.airlines)
const SUPPLIERS = ['hotels', 'charter', 'transport', 'guides', 'insurance', 'esim']

/** /partners — airlines we ticket, payment partners, and the kinds of suppliers we work with (no claimed brand deals). */
export default function Partners() {
  const i = useI18n(); const { t } = i
  return (
    <>
      <Hero title={t('cp.partners.title')} lede={t('cp.partners.lede')} />
      <div className="container-x space-y-16 py-12">
        <section>
          <H2 lede={t('cp.partners.airlinesD')}>{t('cp.partners.airlines')}</H2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {AIRLINES.map((c) => (
              <li key={c} className="grid place-items-center gap-2 rounded-lg border border-line bg-white p-4 text-center">
                <img src={`https://pics.avs.io/200/80/${c}.png`} alt="" loading="lazy" className="h-8 w-auto object-contain" />
                <span className="text-xs text-ink/70">{i.L(D.airlines[c])}</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <H2 lede={t('cp.partners.payD')}>{t('cp.partners.pay')}</H2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {D.payments.map((p) => (
              <li key={p.id} className="flex items-center gap-4 rounded-lg border border-line bg-white p-4">
                <span className="grid h-9 w-14 shrink-0 place-items-center rounded-md text-[11px] font-black text-white" style={{ background: p.color }}>{p.mark}</span>
                <span><b className="block text-sm">{i.L(p.name)}</b><span className="text-xs text-muted">{i.L(p.note)}</span></span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm"><Link to="/legal/payments" className="font-semibold text-brand hover:underline">{t('cp.legal.payments')}</Link></p>
        </section>
        <section>
          <H2 lede={t('cp.partners.supD')}>{t('cp.partners.sup')}</H2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SUPPLIERS.map((k) => <li key={k} className="flex gap-3 rounded-lg border border-line bg-white p-5"><Icon name="check" className="mt-0.5 size-4 shrink-0 text-emerald-600" /><span><b className="block">{t(`cp.sup.${k}`)}</b><span className="text-sm text-ink/70">{t(`cp.sup.${k}d`)}</span></span></li>)}
          </ul>
        </section>
        <section className="flex flex-col items-start justify-between gap-4 rounded-lg bg-ink p-8 text-white md:flex-row md:items-center">
          <div><h2 className="text-xl font-bold">{t('cp.partners.join')}</h2><p className="mt-1 text-white/70">{t('cp.partners.joinD')}</p></div>
          <Link to="/contact?topic=partner" className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:bg-sky">{t('cp.nav.contact')}</Link>
        </section>
      </div>
    </>
  )
}
