import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { PageHead } from '../components/Layout'
import Icon from '../components/Icon'
import { useI18n } from '../lib/i18n'
import { session, store, trips, useStore } from '../lib/store'
import { EntryCards, Next, Ref, StatusBadges, imgSrc, isPast, normalise, seedIfNeeded, tripDate, typeOf, view } from '../components/account/kit'

/* My trips: signed out → sign in or find a booking; signed in → upcoming / past bookings. */
function TripCard({ b, i }) {
  const { t, date } = i
  const v = view(b, i); const ty = typeOf(b)
  return (
    <Link to={`/trips/${b.ref}`} className="card card-hover grid grid-cols-[72px_minmax(0,1fr)] items-center gap-x-4 gap-y-3 p-3 sm:grid-cols-[112px_minmax(0,1fr)_auto] sm:pe-5">
      <span className="grid aspect-square w-[72px] place-items-center self-start overflow-hidden rounded-md bg-mist text-muted sm:aspect-[4/3] sm:w-[112px]">
        {v.img ? <img src={imgSrc(v.img)} alt="" loading="lazy" className="size-full object-cover" /> : <Icon name={ty.icon} className="size-7" />}
      </span>
      <span className="grid min-w-0 gap-0.5">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-muted"><Icon name={ty.icon} className="size-3.5" />{t(ty.label)}</span>
        <b className="truncate font-bold">{v.title}</b>
        {v.sub && <span className="truncate text-sm text-muted">{v.sub}</span>}
        <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/75"><span className="flex items-center gap-1.5"><Icon name="calendar" className="size-4 text-muted" />{date(tripDate(b), { weekday: true, year: true })}</span><Ref className="text-xs text-brand">{b.ref}</Ref></span>
        {b.demo && <span className="text-xs italic text-muted">{t('tp.sample')}</span>}
      </span>
      <span className="col-span-2 flex items-center gap-2 border-t border-line pt-3 sm:col-span-1 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
        <StatusBadges b={b} t={t} /><Next className="ms-auto size-4 text-muted sm:ms-0" />
      </span>
    </Link>
  )
}

export default function Trips() {
  useStore()
  const i = useI18n()
  const { t } = i
  const user = session.user()
  const [tab, setTab] = useState(() => (store.get('tpTab', 'up') === 'past' ? 'past' : 'up'))
  useEffect(() => { seedIfNeeded(session.user()) }, [user?.phone])

  const head = <PageHead><h1 className="text-3xl font-bold">{t('tp.title')}</h1><p className="mt-2 text-muted">{t('tp.sub')}</p></PageHead>
  if (!user) return <>{head}<div className="container-x py-10"><EntryCards i={i} /></div></>

  const all = trips.list().map(normalise)
  const up = all.filter((b) => !isPast(b)).sort((a, b) => tripDate(a).localeCompare(tripDate(b)))
  const past = all.filter(isPast).sort((a, b) => tripDate(b).localeCompare(tripDate(a)))
  const list = tab === 'up' ? up : past
  const pick = (k) => { setTab(k); store.set('tpTab', k) }
  return (
    <>
      {head}
      <div className="container-x py-10">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div role="group" aria-label={t('tp.tabs')} className="flex rounded-md bg-mist p-1">
            {[['up', up], ['past', past]].map(([k, l]) => (
              <button key={k} type="button" aria-pressed={tab === k} onClick={() => pick(k)}
                className={`flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold transition ${tab === k ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'}`}>
                {t(k === 'up' ? 'tp.up' : 'tp.past')}<span className="grid h-5 min-w-5 place-items-center rounded bg-line/70 px-1 text-xs">{l.length}</span>
              </button>
            ))}
          </div>
          <Link to="/" className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold text-brand hover:bg-mist"><Icon name="plus" className="size-4" />{t('tp.book')}</Link>
        </div>
        {list.length ? <div className="grid gap-3">{list.map((b) => <TripCard key={b.ref} b={b} i={i} />)}</div> : (
          <div className="card grid justify-items-center gap-2 px-6 py-14 text-center">
            <Icon name="ticket" className="size-9 text-muted" />
            <h2 className="text-lg font-bold">{tab === 'up' ? t('tp.none') : t('tp.noPast')}</h2>
            <p className="text-sm text-muted">{tab === 'up' ? t('tp.noneD') : t('tp.noPastD')}</p>
            {tab === 'up' && <Link to="/" className="btn-primary mt-3">{t('tp.book')}</Link>}
          </div>
        )}
      </div>
    </>
  )
}
