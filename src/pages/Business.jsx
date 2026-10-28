import { Link } from 'react-router'
import Icon from '../components/Icon'
import D, { media } from '../data/catalog'
import { useI18n } from '../lib/i18n'
import { openHelp } from '../lib/store'
import { BizHead, BizNav, SecTitle, Tbc } from '../components/business/ui'

const LINES = [
  ['corporate', 'users', '/business/corporate', 'corporate'],
  ['agents', 'globe', '/business/agents', 'b2b-office'],
  ['groups', 'plane', '/business/groups', 'charter-group'],
  ['government', 'shield', '/business/government', 'visa-passport'],
]
const RUNS = [['retail', 'user'], ['charter', 'plane'], ['ia', 'ticket', true], ['b2b', 'globe'], ['corp', 'building'], ['hotels', 'bed'], ['visa', 'passport'], ['dmc', 'map'], ['events', 'music']]

/** /business — Hayat for business: lines of business, what the group runs, company details and offices. */
export default function Business() {
  const { t, L } = useI18n()
  return (
    <>
      <BizHead title={t('bz.title')} sub={t('bz.sub')} photo={media('corporate')}>
        <button type="button" onClick={() => openHelp(t('bz.title'))} className="btn-primary mt-7 px-6"><Icon name="chat" className="size-4" />{t('bz.talk')}</button>
      </BizHead>
      <BizNav />

      <section className="container-x py-14" aria-labelledby="bzLines">
        <h2 id="bzLines" className="sr-only">{t('bz.sections')}</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {LINES.map(([id, ic, to, img]) => (
            <Link key={id} to={to} className="card card-hover group flex flex-col overflow-hidden">
              <div className="aspect-[16/10] overflow-hidden bg-mist"><img src={media(img)} alt="" loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-105" /></div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="flex items-center gap-2 text-lg font-bold"><Icon name={ic} className="size-4 text-brand-600" />{t(`bz.l.${id}`)}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted">{t(`bz.ld.${id}`)}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-brand-600">{t('bz.open')}<Icon name="arrow" className="size-4 rtl:-scale-x-100" /></span>
              </div>
            </Link>
          ))}
        </div>
        <Link to="/business/groups#charter" className="card card-hover mt-5 flex flex-wrap items-center gap-5 p-6">
          <span className="grid size-12 place-items-center rounded-md bg-ink text-white"><Icon name="plane" className="size-6 rtl:-scale-x-100" /></span>
          <span className="min-w-0 flex-1"><b className="block text-lg">{t('bz.l.charter')}</b><span className="text-sm text-muted">{t('bz.ld.charter')}</span></span>
          <Icon name="arrow" className="size-5 text-brand rtl:-scale-x-100" />
        </Link>
      </section>

      <section className="border-y border-line bg-mist/60 py-14" aria-labelledby="bzRuns">
        <div className="container-x">
          <SecTitle id="bzRuns" title={t('bz.what')} sub={t('bz.whatSub')} />
          <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {RUNS.map(([id, ic, tbc]) => (
              <li key={id} className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-md bg-white text-brand-600 ring-1 ring-line"><Icon name={ic} className="size-4" /></span>
                <span><b className="flex flex-wrap items-center gap-2">{t(`bz.w.${id}`)}{tbc && <Tbc />}</b><span className="text-sm text-muted">{t(`bz.wd.${id}`)}</span></span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-x grid gap-8 py-14 lg:grid-cols-2">
        <div aria-labelledby="bzCo">
          <SecTitle id="bzCo" title={t('bz.company')} />
          <dl className="card divide-y divide-line">
            {[[t('bz.c.name'), L(D.company.name)], [t('bz.c.head'), t('bz.c.headV')], [t('bz.c.web'), <bdi key="w" dir="ltr">hayat.iq</bdi>],
              [t('bz.c.founded'), <Tbc key="f" />], [t('bz.c.licence'), <Tbc key="l" />], [t('bz.c.iata'), <Tbc key="i" />]].map(([k, v]) => (
              <div key={k} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 text-sm"><dt className="text-muted">{k}</dt><dd className="font-semibold">{v}</dd></div>
            ))}
          </dl>
        </div>
        <div aria-labelledby="bzOff">
          <SecTitle id="bzOff" title={t('bz.offices')} />
          <ul className="grid gap-3 sm:grid-cols-2">
            {D.offices.map((o, k) => (
              <li key={k} className="rounded-lg border border-line p-4">
                <p className="flex flex-wrap items-center gap-2 font-bold"><Icon name="pin" className="size-4 text-brand-600" />{L(o.city)}{k === 0 && <span className="rounded-md bg-ink px-2 py-0.5 text-[11px] font-semibold text-white">{t('bz.headTag')}</span>}</p>
                <p className="mt-1 text-sm text-muted">{L(o.area)}</p>
                <p className="text-xs text-muted">{L(o.hours)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
