import { Link } from 'react-router'
import Icon from '../Icon'
import { useI18n } from '../../lib/i18n'
import { place, qs } from './engine'
import { IRAQ_AIRPORTS } from './world'

/** Visitors: the five Iraqi airports, their region and typical connections; each opens the form for that airport. */
export default function IraqAirports({ from }) {
  const i = useI18n(); const { t } = i
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {IRAQ_AIRPORTS.map((a) => (
        <Link key={a.code} to={`/flights?${qs({ from, to: a.code })}`} onClick={() => scrollTo({ top: 0, behavior: 'smooth' })} className="card card-hover group flex flex-col p-5">
          <span className="flex items-start justify-between gap-3">
            <span><span className="block text-lg font-bold">{place(a.code, i.L)}</span>
              <span className={`mt-1 inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${a.region === 'krg' ? 'bg-emerald-50 text-emerald-800' : 'bg-mist text-ink/70'}`}>{t(`fl.in.${a.region}`)}</span></span>
            <span className="font-mono text-sm font-bold text-muted" dir="ltr">{a.code}</span>
          </span>
          <span className="mt-3 text-sm text-ink/80">{t(`fl.in.ap.${a.code}`)}</span>
          <span className="mt-2 text-xs text-muted">{t('fl.in.links', { list: a.links.map((c) => place(c, i.L)).join(' · ') })}</span>
          <span className="mt-auto flex items-center gap-1.5 pt-4 text-sm font-semibold text-brand">{t('fl.in.go', { city: place(a.code, i.L) })}<Icon name="arrow" className="size-4 rtl:-scale-x-100" /></span>
        </Link>
      ))}
    </div>
  )
}

