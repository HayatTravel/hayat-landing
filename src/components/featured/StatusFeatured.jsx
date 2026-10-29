import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Icon from '../Icon'
import { Ltr, SectionTitle } from '../ui'
import { useI18n } from '../../lib/i18n'
import { charterWeek, statusAt } from '../../lib/providers/flightStatus'
import { clock, norm, place, resultsHref } from '../flights/engine'
import { Pill } from '../flights/Status'

/** Home, under the search box when Flight status is selected: Hayat charter departures in the next 7 days (own data). */
export default function StatusFeatured() {
  const i = useI18n(); const { t } = i
  const [rows, setRows] = useState(null)
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    let live = true
    charterWeek(7).then((r) => live && setRows(r))
    const x = setInterval(() => setNow(Date.now()), 30000)
    return () => { live = false; clearInterval(x) }
  }, [])
  return (
    <section className="container-x py-12">
      <SectionTitle title={t('fs.feat.t')} action={<Link to="/flight-status" className="btn-ghost shrink-0 px-4 py-2 text-sm">{t('fs.feat.more')}<Icon name="arrow" className="size-4 rtl:-scale-x-100" /></Link>} />
      <p className="-mt-5 mb-5 text-sm text-muted">{t('fs.feat.s')}</p>
      <div className="card overflow-hidden">
        {rows && !rows.length && <p className="p-8 text-center text-sm text-muted">{t('fs.feat.none')}</p>}
        <ul className="divide-y divide-line">
          {(rows || Array.from({ length: 4 }, () => null)).map((f0, k) => {
            if (!f0) return <li key={k} className="h-14 animate-pulse bg-mist/60" />
            const f = statusAt(f0, now)
            return (
              <li key={f.id}>
                <Link to={resultsHref(norm({ from: f.from, to: f.to, d1: f.date, trip: 'ow' }))}
                  className="grid grid-cols-[6.5rem_3.5rem_1fr_auto] items-center gap-3 px-5 py-3 text-sm transition hover:bg-mist max-sm:grid-cols-[5rem_1fr_auto]">
                  <span className="font-semibold">{i.date(f.date, { weekday: true })}</span>
                  <Ltr className="font-mono font-bold max-sm:hidden">{clock(f.est.dep).hm}</Ltr>
                  <span className="min-w-0"><span className="block truncate font-medium">{place(f.from, i.L)} – {place(f.to, i.L)}</span>
                    <span className="text-xs text-muted"><Ltr>{f.flight}</Ltr><span className="sm:hidden"> · <Ltr>{clock(f.est.dep).hm}</Ltr></span></span></span>
                  <Pill s={f.status} />
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
