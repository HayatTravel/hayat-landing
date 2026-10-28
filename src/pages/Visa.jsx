import { Link, useSearchParams } from 'react-router'
import Icon from '../components/Icon'
import { Ltr } from '../components/ui'
import { REGIONS } from '../data/visas-world'
import { useI18n } from '../lib/i18n'
import VisaChecker from '../components/services/VisaChecker'
import { PURPOSES, PURPOSE_ICON, VISAS, caseOf, pl, procTime, purposeOk, purposesOf, qs } from '../components/services/data'
import { Arrow, Head, HelpLine, KindBadge, Note, Pic } from '../components/services/ui'

export function VisaCard({ v, purpose = 'tourism' }) {
  const i = useI18n(); const { t, L, money } = i
  const c = caseOf(v, purpose)
  const free = c.kind === 'free'
  return (
    <Link to={`/visa/${v.id}${qs({ purpose: c.purpose === 'tourism' ? '' : c.purpose })}`} className="card card-hover group flex flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-mist">
        <Pic src={v.img} label={L(v.country)} className="size-full" />
        <KindBadge kind={c.kind} className="absolute top-3 start-3 shadow-sm" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold">{L(v.country)}</h3>
        <p className="text-sm text-muted">{free ? t('vi.ofIraqi') : procTime(i, c)}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          {free ? <span className="text-sm text-muted">{t('vi.whatCarry')}</span>
            : <span className="leading-tight"><b className="text-lg"><Ltr>{money(c.fee)}</Ltr></b><span className="block text-xs text-muted">{t('vi.perTrav')}</span></span>}
          <Arrow className="size-4 text-muted transition group-hover:text-brand" />
        </div>
      </div>
    </Link>
  )
}

/** /visa?purpose= — checker, visa cases by purpose, then every destination grouped by region. */
export default function Visa() {
  const i = useI18n(); const { t } = i
  const [sp, setSp] = useSearchParams()
  const purpose = purposeOk(sp.get('purpose')) ? sp.get('purpose') : ''
  const list = VISAS.filter((v) => !purpose || purposesOf(v).includes(purpose))
  const pick = (p) => setSp(p && p !== purpose ? { purpose: p } : {}, { replace: true, preventScrollReset: true })
  return (
    <>
      <Head title={t('vi.title')} sub={t('vi.sub')} />
      <div className="container-x py-10">
        <VisaChecker withPurpose title={t('vi.checker')} sub={t('vi.checkerSub')} />

        <section className="mt-14" aria-labelledby="vcH">
          <h2 id="vcH" className="text-2xl font-bold">{t('vi.cases')}</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">{t('vi.casesSub')}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PURPOSES.map((p) => {
              const n = VISAS.filter((v) => purposesOf(v).includes(p)).length
              const on = p === purpose
              return (
                <button key={p} type="button" aria-pressed={on} onClick={() => pick(p)}
                  className={`flex items-start gap-4 rounded-lg border p-5 text-start transition ${on ? 'border-brand bg-brand/5' : 'border-line bg-white hover:border-brand/40'}`}>
                  <span className={`grid size-10 shrink-0 place-items-center rounded-md ${on ? 'bg-brand text-white' : 'bg-mist text-brand-600'}`}><Icon name={PURPOSE_ICON[p]} className="size-5" /></span>
                  <span className="min-w-0">
                    <b className="block">{t(`vi.p.${p}`)}</b>
                    <span className="block text-sm text-muted">{t(`vi.pd.${p}`)}</span>
                    <span className="mt-1.5 block text-xs font-semibold text-brand-600">{pl(i, n, 'vi.cn')}</span>
                  </span>
                </button>
              )
            })}
          </div>
          <Note className="mt-5">{t('vi.guide')} {t('vi.feeNote')}</Note>
        </section>

        <section className="mt-14" aria-labelledby="vaH">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="vaH" className="text-2xl font-bold">{purpose ? t('vi.forCase', { p: t(`vi.p.${purpose}`) }) : t('vi.allTitle')}</h2>
              <p className="mt-1 text-sm text-muted">{t('vi.ofIraqi')} · {pl(i, list.length, 'vi.cn')}</p>
            </div>
            {purpose && <button type="button" onClick={() => pick('')} className="btn-ghost px-4 py-2 text-sm"><Icon name="close" className="size-4" />{t('vi.clearCase')}</button>}
          </div>
          {purpose === 'study' && <Note className="mt-4">{t('vi.studyNote')}</Note>}
          {REGIONS.map((r) => {
            const rows = list.filter((v) => v.region === r)
            if (!rows.length) return null
            return (
              <div key={r} className="mt-8">
                <h3 className="mb-4 text-sm font-semibold text-muted">{t(`vi.region.${r}`)}</h3>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{rows.map((v) => <VisaCard key={v.id} v={v} purpose={purpose || 'tourism'} />)}</div>
              </div>
            )
          })}
        </section>
        <div className="mt-10 text-center"><HelpLine ctx={t('vi.title')} /></div>
      </div>
    </>
  )
}
