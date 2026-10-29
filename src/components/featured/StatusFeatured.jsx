import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Icon from '../Icon'
import { Ltr, SectionTitle } from '../ui'
import { useI18n } from '../../lib/i18n'
import { baghdadNow, departures, statusAt } from '../../lib/providers/flightStatus'
import { clock, place } from '../flights/engine'
import { Pill } from '../flights/Status'

const BOARDS = ['BGW', 'EBL']

/** Home, under the search box when Flight status is selected: today's departures from Baghdad and Erbil. */
export default function StatusFeatured() {
  const i = useI18n(); const { t } = i
  const [rows, setRows] = useState({})
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    let live = true
    const date = baghdadNow().iso
    Promise.all(BOARDS.map((a) => departures({ airport: a, date, limit: 6 }))).then((r) => live && setRows(Object.fromEntries(BOARDS.map((a, k) => [a, r[k]]))))
    const x = setInterval(() => setNow(Date.now()), 30000)
    return () => { live = false; clearInterval(x) }
  }, [])
  return (
    <section className="container-x py-12">
      <SectionTitle title={t('fs.feat.t')} action={<Link to="/flight-status" className="btn-ghost shrink-0 px-4 py-2 text-sm">{t('fs.feat.more')}<Icon name="arrow" className="size-4 rtl:-scale-x-100" /></Link>} />
      <p className="-mt-5 mb-5 text-sm text-muted">{t('fs.feat.s')}</p>
      <div className="grid gap-5 lg:grid-cols-2">
        {BOARDS.map((a) => (
          <div key={a} className="card overflow-hidden">
            <h3 className="flex items-center justify-between border-b border-line px-5 py-3 font-bold">{t('fs.feat.from', { city: place(a, i.L) })}<Ltr className="font-mono text-xs text-muted">{a}</Ltr></h3>
            <ul className="divide-y divide-line">
              {(rows[a] || Array.from({ length: 6 }, () => null)).map((f0, k) => {
                if (!f0) return <li key={k} className="h-12 animate-pulse bg-mist/60" />
                const f = statusAt(f0, now)
                return (
                  <li key={f.id}>
                    <Link to={`/flight-status?flight=${f.flight.replace(' ', '')}&date=${f.date}`} className="grid grid-cols-[3.5rem_4.5rem_1fr_auto] items-center gap-3 px-5 py-2.5 text-sm transition hover:bg-mist">
                      <Ltr className="font-mono font-bold">{clock(f.est.dep).hm}</Ltr>
                      <Ltr className="font-mono text-xs text-muted">{f.flight}</Ltr>
                      <span className="truncate font-medium">{place(f.to, i.L)}</span>
                      <Pill s={f.status} />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
