/* Home blocks shown right under the search box when the eSIM or transfers tab is chosen (see components/TabFeatured.jsx). */
import { Link } from 'react-router'
import Icon from '../Icon'
import { Ltr, SectionTitle } from '../ui'
import D from '../../data/catalog'
import { flag } from '../../lib/format'
import { useI18n } from '../../lib/i18n'
import { airportCity, esDays, esim, minPlan } from './data'
import { Arrow } from './ui'

const More = ({ to, children }) => <Link to={to} className="btn-ghost shrink-0 px-4 py-2 text-sm">{children}<Arrow /></Link>
const ESIM_CC = ['tr', 'ae', 'ge', 'az', 'eg', 'eu']
const TRANSFER_AP = ['IST', 'DXB', 'GYD', 'AYT', 'TBS', 'CAI', 'BGW', 'EBL']

/** eSIM tab: six countries with their one-week plan and the lowest price. */
export function EsimFeatured() {
  const i = useI18n(); const { t, L, money } = i
  return (
    <section className="container-x py-12" aria-labelledby="ftEsim">
      <SectionTitle title={<span id="ftEsim">{t('es.featT')}</span>} action={<More to="/esim">{t('es.allCountries')}</More>} />
      <p className="-mt-5 mb-6 text-sm text-muted">{t('es.sub')}</p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ESIM_CC.map(esim).filter(Boolean).map((c) => {
          const wk = c.plans.find((p) => p[0] === 7) || c.plans[0]
          return (
            <li key={c.cc}>
              <Link to={`/esim/${c.cc}?days=${wk[0]}`} className="card card-hover group flex h-full items-center gap-4 p-4">
                <img src={flag(c.cc)} alt="" className="size-11 shrink-0 rounded-full object-cover ring-1 ring-line" />
                <span className="min-w-0 flex-1">
                  <b className="block truncate">{L(c.name)}</b>
                  <span className="block text-xs text-muted"><bdi dir="ltr">{c.net}</bdi> · {t('es.week')}: <bdi dir="ltr">{wk[1]} GB</bdi> · {esDays(i, wk[0])}</span>
                </span>
                <span className="text-end leading-tight"><span className="block text-xs text-muted">{t('sv.from')}</span><b><Ltr>{money(minPlan(c))}</Ltr></b></span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/** Transfers tab: main airports with shared (per person) and private (per car) starting prices. */
export function TransfersFeatured() {
  const i = useI18n(); const { t, L, money } = i
  const { sic, vip } = D.transfers
  return (
    <section className="container-x py-12" aria-labelledby="ftTr">
      <SectionTitle title={<span id="ftTr">{t('tr.title')}</span>} action={<More to="/transfers">{t('tr.compare')}</More>} />
      <p className="-mt-5 mb-6 text-sm text-muted">{t('tr.sub')}</p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TRANSFER_AP.filter((c) => D.airports.some((a) => a.code === c)).map((code) => (
          <li key={code}>
            <Link to={`/transfers?ap=${code}`} className="card card-hover group flex h-full flex-col p-5">
              <span className="flex items-center justify-between gap-2">
                <b className="text-lg">{airportCity(i, code)}</b>
                <span className="font-mono text-xs font-bold text-muted" dir="ltr">{code}</span>
              </span>
              <dl className="mt-4 space-y-1.5 text-sm">
                {[[sic, 'tr.perPerson'], [vip, 'tr.perCarShort']].map(([v, unit]) => (
                  <div key={unit} className="flex items-baseline justify-between gap-3">
                    <dt className="text-muted">{L(v.name)}</dt>
                    <dd><span className="text-xs text-muted">{t('sv.from')} </span><b><Ltr>{money(v.price)}</Ltr></b> <span className="text-xs text-muted">{t(unit)}</span></dd>
                  </div>
                ))}
              </dl>
              <span className="mt-auto flex items-center gap-1 pt-4 text-sm font-semibold text-brand-600"><Icon name="car" className="size-4" />{t('tr.see')}<Arrow className="ms-auto size-4 text-muted transition group-hover:text-brand" /></span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
