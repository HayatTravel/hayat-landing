import { Link } from 'react-router'
import { Ltr } from '../components/ui'
import D, { media } from '../data/catalog'
import { useI18n } from '../lib/i18n'
import VisaChecker from '../components/services/VisaChecker'
import { procTime } from '../components/services/data'
import { Arrow, Head, HelpLine, KindBadge } from '../components/services/ui'

export function VisaCard({ v }) {
  const i = useI18n(); const { t, L, money } = i
  const free = v.kind === 'free'
  return (
    <Link to={`/visa/${v.id}`} className="card card-hover group flex flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-mist">
        <img src={media(v.img)} alt="" loading="lazy" className="size-full object-cover" />
        <KindBadge kind={v.kind} className="absolute top-3 start-3 shadow-sm" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold">{L(v.country)}</h3>
        <p className="text-sm text-muted">{free ? t('vi.ofIraqi') : procTime(i, v)}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          {free ? <span className="text-sm text-muted">{t('vi.whatCarry')}</span>
            : <span className="leading-tight"><b className="text-lg"><Ltr>{money(v.fee)}</Ltr></b><span className="block text-xs text-muted">{t('vi.perTrav')}</span></span>}
          <Arrow className="size-4 text-muted transition group-hover:text-brand" />
        </div>
      </div>
    </Link>
  )
}

export default function Visa() {
  const { t } = useI18n()
  return (
    <>
      <Head title={t('vi.title')} sub={t('vi.sub')} />
      <div className="container-x py-10">
        <VisaChecker title={t('vi.checker')} sub={t('vi.checkerSub')} />
        <section className="mt-14" aria-labelledby="vaH">
          <h2 id="vaH" className="text-2xl font-bold">{t('vi.allTitle')}</h2>
          <p className="mt-1 text-sm text-muted">{t('vi.ofIraqi')}</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{D.visas.map((v) => <VisaCard key={v.id} v={v} />)}</div>
        </section>
        <div className="mt-10 text-center"><HelpLine ctx={t('vi.title')} /></div>
      </div>
    </>
  )
}
