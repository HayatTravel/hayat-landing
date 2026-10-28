import { Link, useSearchParams } from 'react-router'
import Icon from '../components/Icon'
import { media } from '../data/catalog'
import { useI18n } from '../lib/i18n'
import { OFFICES } from '../data/company'
import { HR_DEPTS, HR_TYPES } from '../data/hr'
import { listPostings } from '../lib/providers/hr'
import { Hero, Sample } from '../components/company/ui'
import CareersNav from '../components/company/CareersNav'

export const cityName = (i, id) => i.L(OFFICES.find((o) => o.id === id)?.city)

const TILES = [['/careers/how-we-hire', 'hr.nav.how', 'hr.tile.how', 'documents'], ['/careers/life', 'hr.nav.life', 'hr.tile.life', 'users'], ['/careers/students', 'hr.nav.students', 'hr.tile.students', 'star'],
  ['/careers/track', 'hr.nav.track', 'hr.tile.track', 'search'], ['/careers/onboarding', 'hr.nav.onboarding', 'hr.tile.onboarding', 'home']]

/** /careers?dept&city&type — the careers hub: open roles (samples) with filters, and the rest of the HR section. */
export default function Careers() {
  const i = useI18n(); const { t } = i
  const [sp, setSp] = useSearchParams()
  const f = { dept: HR_DEPTS.includes(sp.get('dept')) ? sp.get('dept') : '', city: OFFICES.some((o) => o.id === sp.get('city')) ? sp.get('city') : '', type: HR_TYPES.includes(sp.get('type')) ? sp.get('type') : '' }
  const set = (k, v) => { const n = { ...f, [k]: v }; setSp(Object.fromEntries(Object.entries(n).filter(([, x]) => x)), { replace: true, preventScrollReset: true }) }
  const roles = listPostings(f)
  const sel = (k, label, opts) => (
    <div><label className="label" htmlFor={`hr-${k}`}>{label}</label>
      <select id={`hr-${k}`} className="field py-2.5" value={f[k]} onChange={(e) => set(k, e.target.value)}>
        <option value="">{t('hr.f.all')}</option>{opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select></div>
  )
  return (
    <>
      <Hero photo={media('corporate')} title={t('cp.careers.title')} lede={t('cp.careers.lede')}><CareersNav /></Hero>
      <div className="container-x space-y-16 py-12">
        <section aria-labelledby="hr-open">
          <div className="mb-6 flex flex-wrap items-center gap-3"><h2 id="hr-open" className="text-2xl font-bold tracking-tight">{t('cp.careers.open')}</h2><Sample /></div>
          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            {sel('dept', t('hr.f.dept'), HR_DEPTS.map((d) => [d, t(`cp.dept.${d}`)]))}
            {sel('city', t('hr.f.city'), OFFICES.map((o) => [o.id, i.L(o.city)]))}
            {sel('type', t('hr.f.type'), HR_TYPES.map((x) => [x, t(`cp.type.${x}`)]))}
          </div>
          <p aria-live="polite" className="mb-3 text-sm text-muted">{t('hr.count', { n: roles.length })}</p>
          {roles.length ? (
            <div className="divide-y divide-line rounded-lg border border-line bg-white">
              {roles.map((r) => (
                <Link key={r.id} to={`/careers/${r.id}`} className="flex flex-wrap items-center justify-between gap-3 p-5 transition hover:bg-mist/60">
                  <span><span className="block font-bold">{i.L(r.title)}</span><span className="text-sm text-muted">{t(`cp.dept.${r.dept}`)} · {cityName(i, r.city)} · {t(`cp.type.${r.type}`)}</span></span>
                  <Icon name="arrow" className="size-4 text-muted rtl:-scale-x-100" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-line bg-white p-8 text-center"><p className="font-semibold">{t('hr.none')}</p>
              <button type="button" onClick={() => setSp({}, { replace: true })} className="btn-ghost mt-3 py-2 text-sm">{t('hr.f.clear')}</button></div>
          )}
          <p className="mt-4 text-sm text-muted">{t('cp.careers.open2')} <Link to="/contact?topic=other" className="font-semibold text-brand hover:underline">{t('cp.nav.contact')}</Link></p>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-bold tracking-tight">{t('cp.careers.why')}</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {['people', 'learn', 'languages', 'growth'].map((k) => (
              <div key={k} className="border-t-2 border-ink pt-4"><h3 className="font-bold">{t(`cp.why.${k}`)}</h3><p className="mt-1.5 text-sm leading-6 text-ink/70">{t(`cp.why.${k}d`)}</p></div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {TILES.map(([to, k, d, ic]) => (
            <Link key={to} to={to} className="card card-hover p-5">
              <Icon name={ic} className="size-5 text-brand" />
              <h3 className="mt-3 font-bold">{t(k)}</h3>
              <p className="mt-1 text-sm leading-6 text-ink/70">{t(d)}</p>
            </Link>
          ))}
        </section>
      </div>
    </>
  )
}
