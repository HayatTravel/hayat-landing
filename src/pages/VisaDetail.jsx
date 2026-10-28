import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import Icon from '../components/Icon'
import { Ltr } from '../components/ui'
import { inDays, useI18n } from '../lib/i18n'
import { ARRANGE, SERVICE_FEE, VISA_FLIGHT, airportCity, caseOf, clamp, leadDays, procTime, purposesOf, qs, visa, visaDate } from '../components/services/data'
import { Block, Head, HelpLine, KindBadge, More, Note, NotFoundHere, Pic, PurposeChips, Qty, Stats, Steps, Total } from '../components/services/ui'

function DocList({ keys }) {
  const { t } = useI18n()
  return (
    <ul className="grid gap-3">
      {keys.map((d) => (
        <li key={d} className="flex items-start gap-3">
          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700"><Icon name="check" className="size-3.5" strokeWidth={3} /></span>
          <span>{t(`vi.d.${d}`)}{ARRANGE.includes(d) && <span className="block text-xs text-muted">{t('vi.canArrange')}</span>}</span>
        </li>
      ))}
    </ul>
  )
}

/** /visa/:id?purpose&nat&n&date — one destination; the purpose decides the visa kind and the documents. */
export default function VisaDetail() {
  const i = useI18n(); const { t, L, money } = i
  const { id } = useParams()
  const [sp, setSp] = useSearchParams()
  const go = useNavigate()
  const v = visa(id)
  const c = v ? caseOf(v, sp.get('purpose') || 'tourism') : null
  const [n, setN] = useState(() => clamp(+sp.get('n') || 1, 1, 9))
  const [date, setDate] = useState(() => (c ? visaDate(c, sp.get('date')) : ''))
  if (!v) return <NotFoundHere />

  const free = c.kind === 'free'
  const country = L(v.country)
  const setPurpose = (p) => setSp((s) => { const x = new URLSearchParams(s); p === 'tourism' ? x.delete('purpose') : x.set('purpose', p); return x }, { replace: true, preventScrollReset: true })
  const minDate = inDays(leadDays(c))
  const travel = date < minDate ? minDate : date
  const top = (
    <>
      <Pic src={v.img} alt={country} label={country} className="aspect-[16/9] w-full rounded-lg sm:aspect-[21/8]" />
      {sp.get('nat') && sp.get('nat') !== 'IQ' && <Note className="mt-5">{t('vi.otherNat')}</Note>}
      <section className="mt-6" aria-labelledby="viP">
        <h2 id="viP" className="mb-3 text-sm font-semibold text-muted">{t('vi.purpose')}</h2>
        <PurposeChips list={purposesOf(v)} value={c.purpose} onChange={setPurpose} label={t('vi.purpose')} />
        <p className="mt-2 text-sm text-muted">{t(`vi.pd.${c.purpose}`)}</p>
        {v.visitOnly && <Note className="mt-3">{t('vi.saNote')}</Note>}
        {c.purpose === 'study' && v.kind !== 'embassy' && <Note className="mt-3">{t('vi.studyNote')}</Note>}
      </section>
    </>
  )

  if (free) {
    const ap = VISA_FLIGHT[v.id]
    return (
      <>
        <Head title={country} sub={t('vi.ofIraqi')} back="/visa" backLabel={t('vi.nav')} />
        <div className="container-x grid gap-10 py-10 lg:grid-cols-[1fr_340px]">
          <div>
            {top}
            <div className="mt-8 flex items-start gap-4 rounded-lg bg-emerald-50 p-5">
              <Icon name="check" className="mt-1 size-6 shrink-0 text-emerald-700" strokeWidth={2.6} />
              <div><h2 className="text-xl font-bold">{t('vi.freeTitle')}</h2><p className="mt-1 text-ink/80">{t('vi.kd.free')}</p></div>
            </div>
            <Block title={t('vi.whatCarry')} id="viCarry">
              <p className="mb-4 text-sm text-muted">{t('vi.freeBody')}</p>
              <DocList keys={[...new Set([...c.docs, 'ticket', 'hotel'])]} />
              <p className="mt-5 text-xs text-muted">{t('vi.guide')}</p>
            </Block>
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card space-y-4 p-6">
              <p className="text-xs text-muted">{t('vi.dest')}</p>
              <h3 className="-mt-3 text-lg font-bold">{country}</h3>
              <KindBadge kind="free" />
              {ap && <Link to={`/flights${qs({ from: 'BGW', to: ap })}`} className="btn-primary w-full"><Icon name="plane" className="size-4" />{t('vi.flightsTo', { city: airportCity(i, ap) })}</Link>}
              <div className="text-center"><HelpLine ctx={t('vi.orderTitle', { country })} /></div>
            </div>
          </aside>
        </div>
      </>
    )
  }

  const svc = Math.min(SERVICE_FEE[c.kind], c.fee)
  const steps = [1, 2, 3, 4].map((k) => [t(`vi.s${k}`), t(k === 4 && c.kind === 'arrival' ? 'vi.s4dArr' : `vi.s${k}d`)])
  return (
    <>
      <Head title={t('vi.orderTitle', { country })} sub={t(`vi.kd.${c.kind}`)} back="/visa" backLabel={t('vi.nav')} />
      <div className="container-x grid gap-10 py-10 lg:grid-cols-[1fr_360px]">
        <div>
          {top}
          <div className="mt-6">
            <Stats items={[[t('vi.kindL'), <KindBadge key="k" kind={c.kind} />], [t('vi.time'), procTime(i, c)],
              [t('vi.fee'), <span key="f"><Ltr>{money(c.fee)}</Ltr> <span className="text-xs font-normal text-muted">{t('vi.perTrav')}</span></span>]]} />
          </div>
          <More title={t('vi.breakdown')}>
            <dl className="space-y-2">
              {[[t('vi.gov'), c.fee - svc], [t('vi.service'), svc], [t('vi.perOne'), c.fee]].map(([k, usd], j) => (
                <div key={k} className={`flex justify-between gap-4 ${j === 2 ? 'border-t border-line pt-2 font-bold' : ''}`}><dt>{k}</dt><dd><Ltr>{money(usd)}</Ltr></dd></div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-muted">{t('vi.feeNote')}</p>
          </More>
          <Block title={t('vi.docsLabel')} id="viDocs">
            <p className="mb-4 text-sm text-muted">{t('vi.forPurpose', { p: t(`vi.p.${c.purpose}`) })}</p>
            <DocList keys={c.docs} />
            <p className="mt-5 text-xs text-muted">{t('vi.guide')}</p>
          </Block>
          <Block title={t('vi.steps')} id="viSteps"><Steps items={steps} /><Note icon="lock" className="mt-5">{t('vi.payFirst')}</Note></Block>
          <Block title={t('vi.track')} id="viTrack"><p className="flex items-start gap-3 text-ink/80"><Icon name="send" className="mt-1 size-5 shrink-0 text-brand-600" />{t('vi.trackD')}</p></Block>
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card space-y-5 p-6">
            <p className="text-sm"><span className="text-muted">{t('vi.purpose')}:</span> <b>{t(`vi.p.${c.purpose}`)}</b></p>
            <div className="flex items-center justify-between gap-3"><span className="text-sm font-semibold">{t('vi.travellers')}</span><Qty value={n} min={1} max={9} onChange={setN} label={t('vi.travellers')} /></div>
            <div>
              <label className="label" htmlFor="viDate">{t('vi.date')}</label>
              <input id="viDate" type="date" className="field" value={travel} min={minDate} onChange={(e) => e.target.value && setDate(e.target.value)} />
              <p className="mt-1.5 text-xs text-muted">{t('vi.leadTime', { n: i.num(leadDays(c)) })}</p>
            </div>
            <Total usd={c.fee * n} />
            <button type="button" className="btn-primary w-full py-4 text-base"
              onClick={() => go(`/checkout${qs({ type: 'visa', id: v.id, purpose: c.purpose, n, date: travel })}`)}>{t('vi.apply')}</button>
            <div className="text-center"><HelpLine ctx={`${t('vi.orderTitle', { country })} · ${t(`vi.p.${c.purpose}`)}`} /></div>
          </div>
        </aside>
      </div>
    </>
  )
}
