import { Link, useSearchParams } from 'react-router'
import Icon from '../components/Icon'
import D, { media } from '../data/catalog'
import { useI18n } from '../lib/i18n'
import { CATS, cityKey, evCities, evDate, evMin, monthText, pl } from '../components/services/data'
import { Arrow, FromPrice, Head } from '../components/services/ui'

export function EventCard({ e, className = '' }) {
  const i = useI18n(); const { t, L } = i
  return (
    <Link to={`/events/${e.id}`} className={`card card-hover group flex flex-col overflow-hidden ${className}`}>
      <div className="relative aspect-[16/10] overflow-hidden bg-mist">
        <img src={media(e.img)} alt="" loading="lazy" className="size-full object-cover" />
        <span className="absolute top-3 start-3 rounded-md bg-white px-2.5 py-1 text-xs font-semibold shadow-sm">{t(`ev.k.${e.cat}`)}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm font-semibold text-brand-600">{i.date(evDate(e), { weekday: true })} · <bdi dir="ltr">{e.time}</bdi></p>
        <h3 className="mt-1 text-lg font-bold">{L(e.title)}</h3>
        <p className="text-sm text-muted">{L(e.venue)} · {L(e.city)}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4"><FromPrice usd={evMin(e)} /><Arrow className="size-4 text-muted transition group-hover:text-brand" /></div>
      </div>
    </Link>
  )
}

export default function Events() {
  const i = useI18n(); const { t, L } = i
  const [sp, setSp] = useSearchParams()
  const q = { city: sp.get('city') || '', cat: sp.get('cat') || '', month: sp.get('month') || '' }
  const list = D.events.filter((e) => (!q.city || cityKey(e) === q.city) && (!q.cat || e.cat === q.cat) && (!q.month || evDate(e).slice(0, 7) === q.month))
    .sort((a, b) => a.inDays - b.inDays)
  const set = (k, v) => setSp((s) => { const n = new URLSearchParams(s); v ? n.set(k, v) : n.delete(k); return n }, { replace: true })
  const Chip = ({ k, v, children }) => (
    <button type="button" aria-pressed={q[k] === v} onClick={() => set(k, v)}
      className={`rounded-md border px-3.5 py-1.5 text-sm font-medium transition ${q[k] === v ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink/70 hover:border-ink/40'}`}>{children}</button>
  )
  const Group = ({ label, children }) => (
    <div role="group" aria-label={label} className="grid gap-2 sm:grid-cols-[90px_1fr] sm:items-center">
      <span className="text-xs font-semibold text-muted">{label}</span><div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
  return (
    <>
      <Head title={t('ev.title')} sub={t('ev.sub')} />
      <div className="container-x py-10">
        <div className="space-y-3">
          <Group label={t('ev.city')}><Chip k="city" v="">{t('ev.all')}</Chip>{evCities().map(([k, c]) => <Chip key={k} k="city" v={k}>{L(c)}</Chip>)}</Group>
          <Group label={t('ev.cat')}><Chip k="cat" v="">{t('ev.all')}</Chip>{CATS.map((k) => <Chip key={k} k="cat" v={k}>{t(`ev.cat.${k}`)}</Chip>)}</Group>
          {q.month && (
            <Group label={t('ev.month')}>
              <button type="button" onClick={() => set('month', '')} aria-label={`${t('ev.clear')}: ${monthText(i, q.month)}`}
                className="inline-flex items-center gap-1.5 rounded-md border border-ink bg-ink px-3.5 py-1.5 text-sm font-medium text-white">{monthText(i, q.month)}<Icon name="close" className="size-3.5" /></button>
            </Group>
          )}
        </div>
        <p aria-live="polite" className="mt-6 mb-4 text-sm text-muted">{pl(i, list.length, 'ev.c')}</p>
        {list.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((e) => <EventCard key={e.id} e={e} />)}</div>
        ) : (
          <div className="card grid justify-items-center gap-3 p-12 text-center">
            <Icon name="ticket" className="size-9 text-muted" />
            <h3 className="text-lg font-bold">{t('ev.none')}</h3><p className="text-sm text-muted">{t('ev.noneD')}</p>
            <Link to="/events" className="btn-ghost px-5 py-2.5 text-sm">{t('ev.clear')}</Link>
          </div>
        )}
      </div>
    </>
  )
}
