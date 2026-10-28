import { Link, useParams } from 'react-router'
import Icon from '../components/Icon'
import { Ltr } from '../components/ui'
import D from '../data/catalog'
import { place } from '../data/world'
import { useI18n } from '../lib/i18n'
import { airport } from '../components/flights/engine'
import { caseOf, esim, procTime, qs, visa } from '../components/services/data'
import { Block, Head, HelpLine, KindBadge, Note, NotFoundHere, Pic } from '../components/services/ui'
import { Budget } from './Destinations'

/** /destinations/:slug — why Iraqis go, highlights, the visa for an Iraqi passport, flights, stays, eSIM, timing and budget. */
export default function DestinationsDetail() {
  const i = useI18n(); const { t, L, money } = i
  const { slug } = useParams()
  const d = place(slug)
  if (!d) return <NotFoundHere />
  const city = L(d.city); const country = L(d.country)
  const v = visa(d.visa); const c = v && caseOf(v, 'tourism')
  const hasHotels = d.hotel && D.hotels.some((h) => h.city === d.hotel)
  const e = d.esim && esim(d.esim)
  const flightTo = airport(d.ap) ? d.ap : ''
  const links = [
    [`/flights${qs({ from: 'BGW', to: flightTo })}`, 'plane', t('ds.flights'), t('ds.flightLine', { t: i.dur(d.mins), s: t(d.stops ? 'ds.stop' : 'ds.direct') })],
    hasHotels && [`/hotels/results${qs({ city: d.hotel })}`, 'bed', t('ds.hotels', { city }), ''],
    e && [`/esim/${e.cc}`, 'sim', t('ds.esim', { country: L(e.name) }), ''],
  ].filter(Boolean)

  return (
    <>
      <Head title={city} sub={country !== city ? country : ''} back="/destinations" backLabel={t('ds.nav')} />
      <div className="container-x grid gap-10 py-10 lg:grid-cols-[1fr_360px]">
        <div>
          <Pic src={d.img} alt={city} label={city} className="aspect-[16/9] w-full rounded-lg sm:aspect-[21/8]" />
          <div className="mt-5 flex flex-wrap gap-2">{d.themes.map((x) => <Link key={x} to={`/destinations?theme=${x}`} className="chip hover:border-brand hover:text-brand">{t(`ds.th.${x}`)}</Link>)}</div>

          <Block title={t('ds.why')} id="dsWhy"><p className="text-lg leading-8 text-ink/85">{L(d.why)}</p></Block>

          <Block title={t('ds.top')} id="dsTop">
            <ol className="grid gap-3 sm:grid-cols-3">
              {d.top.map((x, k) => (
                <li key={k} className="rounded-lg border border-line p-4"><span className="text-xs font-bold text-brand-600">{i.num(k + 1)}</span><p className="mt-1 font-semibold">{L(x)}</p></li>
              ))}
            </ol>
          </Block>

          <Block title={t('ds.practical')} id="dsNote"><Note>{L(d.note)}</Note></Block>

          <Block title={t('ds.best')} id="dsBest">
            <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-12">
              {Array.from({ length: 12 }, (_, m) => {
                const on = d.best.includes(m + 1)
                return <li key={m} className={`rounded-md py-2 text-center text-xs font-semibold ${on ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200' : 'bg-mist text-muted'}`}>{i.monthName(m)}<span className="sr-only">{on ? ` ✓` : ''}</span></li>
              })}
            </ul>
            <p className="mt-2 text-xs text-muted">{t('ds.bestNote')}</p>
          </Block>

          <Block title={t('ds.budgetGuide')} id="dsBudget">
            <div className="flex items-start gap-4 rounded-lg border border-line p-5">
              <Budget n={d.budget} className="text-lg" />
              <div><b>{t(`ds.b.${d.budget}`)}</b><p className="text-sm text-muted">{t(`ds.bd.${d.budget}`)}</p></div>
            </div>
          </Block>
          <p className="mt-8 text-xs text-muted">{t('ds.guide')}</p>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          {v && (
            <div className="card p-6">
              <p className="text-xs text-muted">{t('ds.visaBox')}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2"><b>{L(v.country)}</b><KindBadge kind={c.kind} /></div>
              <p className="mt-2 text-sm text-ink/80">{t(`vi.kd.${c.kind}`)}</p>
              {c.kind !== 'free' && (
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-4"><dt className="text-muted">{t('vi.time')}</dt><dd className="font-medium">{procTime(i, c)}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-muted">{t('vi.fee')}</dt><dd className="font-medium"><Ltr>{money(c.fee)}</Ltr></dd></div>
                </dl>
              )}
              {v.visitOnly && <p className="mt-3 text-xs text-muted">{t('vi.saNote')}</p>}
              <Link to={`/visa/${v.id}`} className="btn-ghost mt-4 w-full py-2.5 text-sm"><Icon name="passport" className="size-4" />{t('ds.visaLink')}</Link>
              <p className="mt-3 text-xs text-muted">{t('vi.guide')}</p>
            </div>
          )}
          <div className="card p-6">
            <h2 className="font-bold">{t('ds.plan')}</h2>
            <ul className="mt-4 space-y-2">
              {links.map(([to, ic, label, sub]) => (
                <li key={to}>
                  <Link to={to} className="group flex items-center gap-3 rounded-md border border-line p-3 transition hover:border-brand">
                    <span className="grid size-9 shrink-0 place-items-center rounded-md bg-mist text-brand-600"><Icon name={ic} className="size-4" /></span>
                    <span className="min-w-0 flex-1"><b className="block text-sm">{label}</b>{sub && <span className="text-xs text-muted">{sub}</span>}</span>
                    <Icon name="arrow" className="size-4 text-muted transition group-hover:text-brand rtl:-scale-x-100" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-center"><HelpLine ctx={`${t('ds.title')} · ${city}`} /></div>
          </div>
        </aside>
      </div>
    </>
  )
}
