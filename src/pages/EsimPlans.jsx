import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { Ltr } from '../components/ui'
import { flag } from '../lib/format'
import { useI18n } from '../lib/i18n'
import EsimPhone from '../components/services/EsimPhone'
import { esDays, esim, fitIndex, planLabel, qs } from '../components/services/data'
import { Block, Head, HelpLine, More, Note, NotFoundHere, Steps, Total } from '../components/services/ui'

/** eSIM step 1b: choose a plan, then the shared checkout. */
export default function EsimPlans() {
  const i = useI18n(); const { t, L, money } = i
  const { cc } = useParams()
  const [sp] = useSearchParams()
  const go = useNavigate()
  const c = esim(cc)
  const fit = c ? fitIndex(c, +sp.get('days') || 0) : -1
  const [pick, setPick] = useState(() => (fit >= 0 ? fit : c ? Math.min(1, c.plans.length - 1) : 0))
  if (!c) return <NotFoundHere />
  const p = c.plans[pick]
  const name = L(c.name)
  const how = [1, 2, 3, 4].map((k) => [t(`es.h${k}`), t(`es.h${k}d`)])

  return (
    <>
      <Head title={t('es.orderTitle', { country: name })} back="/esim" backLabel={t('es.allCountries')}>
        <p className="mt-2 flex items-center gap-2 text-muted"><img src={flag(c.cc)} alt="" className="size-5 rounded-full object-cover" />{t('es.net')}: <bdi dir="ltr">{c.net}</bdi></p>
      </Head>
      <div className="container-x grid gap-10 py-10 lg:grid-cols-[1fr_340px]">
        <div>
          <section aria-labelledby="esH">
            <h2 id="esH" className="mb-5 text-xl font-bold">{t('es.plans')}</h2>
            <div role="radiogroup" aria-labelledby="esH" className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {c.plans.map((x, k) => (
                <label key={x[0]} className={`relative flex cursor-pointer flex-col rounded-lg border p-5 pt-6 transition ${k === pick ? 'border-brand bg-brand/5' : 'border-line hover:border-brand/40'}`}>
                  <input type="radio" name="plan" value={k} checked={k === pick} onChange={() => setPick(k)} className="absolute top-4 end-4 size-4 accent-[var(--color-brand)]" />
                  {k === fit && <span className="absolute -top-2.5 start-4 rounded-md bg-ink px-2 py-0.5 text-[11px] font-semibold text-white">{t('es.fits')}</span>}
                  <span className="text-3xl font-bold" dir="ltr">{x[1]} <span className="text-sm text-muted">GB</span></span>
                  <span className="mt-1 text-sm text-muted">{esDays(i, x[0])}</span>
                  <b className="mt-5"><Ltr>{money(x[2])}</Ltr></b>
                </label>
              ))}
            </div>
          </section>

          <Block title={t('es.how')} id="esHow">
            <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
              <div>
                <Steps items={how} />
                <Note icon="phone" className="mt-6">{t('es.keep')}</Note>
                <More title={t('es.compat')}><p>{t('es.compatD')}</p></More>
              </div>
              <div className="hidden justify-self-center md:block"><EsimPhone country={c} plan={p} /></div>
            </div>
          </Block>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card space-y-4 p-6">
            <p className="text-xs text-muted">{t('es.yourPlan')}</p>
            <div><h3 className="text-lg font-bold">{name}</h3><p className="text-sm text-muted"><bdi>{planLabel(i, p)}</bdi></p></div>
            <Total usd={p[2]} />
            <button type="button" className="btn-primary w-full py-4 text-base" onClick={() => go(`/checkout${qs({ type: 'esim', cc: c.cc, plan: pick })}`)}>{t('es.buy')}</button>
            <div className="text-center"><HelpLine ctx={t('es.orderTitle', { country: name })} /></div>
          </div>
        </aside>
      </div>
    </>
  )
}
