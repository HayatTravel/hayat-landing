import { useState } from 'react'
import { Link } from 'react-router'
import Icon from '../components/Icon'
import { Ltr, SectionTitle } from '../components/ui'
import { ChBadge } from '../components/flights/parts'
import D, { media } from '../data/catalog'
import { addDaysIso, inDays, useI18n } from '../lib/i18n'
import { store } from '../lib/store'
import { HOME_DEST, HOME_ORIGINS, airlineName, daysFromToday, imgFor, nextCharterDate, norm, place, resultsHref, searchFlights } from '../components/flights/engine'

/** Cheapest return per person from one origin, two weeks out for a week (or the next charter date within 45 days). */
function card(origin, to) {
  const ch = D.charters.find((c) => c.from === origin && c.to === to)
  const chDate = ch && nextCharterDate(ch, 14)
  const d1 = chDate && daysFromToday(chDate) <= 45 ? chDate : inDays(14)
  const q = norm({ from: origin, to, d1, d2: addDaysIso(d1, 7), trip: 'rt' })
  const { list } = searchFlights(q)
  if (!list.length) return null
  const best = list.reduce((a, b) => (b.from < a.from ? b : a))
  return { to, q, best, charter: list.some((x) => x.kind === 'charter') }
}

function PopularFlights() {
  const i = useI18n(); const { t } = i
  const [o, setO] = useState(() => { const v = store.get('fl-home-o', 'BGW'); return HOME_ORIGINS.includes(v) ? v : 'BGW' })
  const pick = (v) => { setO(v); store.set('fl-home-o', v) }
  const cards = HOME_DEST.map((to) => card(o, to)).filter(Boolean)
  return (
    <section className="container-x py-16">
      <SectionTitle title={t('fl.home.t', { city: place(o, i.L) })} action={<Link to="/flights" className="btn-ghost shrink-0 px-4 py-2 text-sm">{t('fl.home.all')}<Icon name="arrow" className="size-4 rtl:-scale-x-100" /></Link>} />
      <div className="-mt-4 mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">{t('fl.home.s')}</p>
        <div role="group" aria-label={t('fl.home.o')} className="inline-flex max-w-full overflow-x-auto rounded-md bg-mist p-1">
          {HOME_ORIGINS.map((c) => (
            <button key={c} type="button" aria-pressed={c === o} onClick={() => pick(c)}
              className={`shrink-0 rounded px-4 py-1.5 text-sm font-semibold transition ${c === o ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'}`}>{place(c, i.L)}</button>
          ))}
        </div>
      </div>
      <div className="grid auto-cols-[minmax(240px,1fr)] grid-flow-col gap-4 overflow-x-auto pb-2 [scrollbar-width:thin] lg:grid-flow-row lg:grid-cols-4">
        {cards.map(({ to, q, best, charter }) => (
          <Link key={to} to={resultsHref(q)} className="card card-hover group overflow-hidden">
            <div className="relative aspect-[16/10] overflow-hidden bg-mist">
              <img src={media(imgFor(to))} alt="" loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-105" />
              {charter && <span className="absolute top-3 start-3"><ChBadge /></span>}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold">{place(to, i.L)}</h3>
              <p className="text-sm text-muted">{best.kind === 'charter' ? t('fl.direct') : `${airlineName(best.carrier, i.L)} · ${best.stops ? t('fl.stop1') : t('fl.direct')}`}</p>
              <p className="mt-3 flex items-end justify-between gap-2">
                <span><span className="block text-xl font-bold"><Ltr>{i.money(best.from)}</Ltr></span><span className="text-xs text-muted">{t('fl.ppRt')}</span></span>
                <Icon name="arrow" className="size-4 text-brand rtl:-scale-x-100" />
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default [{ id: 'flights', order: 10, Component: PopularFlights }]
