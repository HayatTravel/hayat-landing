import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { Ltr } from '../components/ui'
import { media } from '../data/catalog'
import { useI18n } from '../lib/i18n'
import ZoneMap, { TONES } from '../components/services/ZoneMap'
import { clamp, ev, evDate, pl, qs, ranked, tiersOf } from '../components/services/data'
import { Head, HelpLine, Note, NotFoundHere, Qty, Stats, Total } from '../components/services/ui'

export default function EventsDetail() {
  const i = useI18n(); const { t, L, money } = i
  const { id } = useParams()
  const [sp] = useSearchParams()
  const go = useNavigate()
  const e = ev(id)
  const tiers = e ? tiersOf(e) : []
  const rank = e ? ranked(e).map((x) => x.id) : []
  const [tier, setTier] = useState(() => (tiers.some((x) => x.id === sp.get('tier')) ? sp.get('tier') : rank[rank.length - 1]))
  const cur = tiers.find((x) => x.id === tier)
  const maxQ = cur ? Math.min(8, cur.left) : 1
  const [n, setN] = useState(() => clamp(+sp.get('qty') || 1, 1, maxQ))
  if (!e) return <NotFoundHere />
  const qty = clamp(n, 1, maxQ)
  const hasMap = tiers.length > 1
  const title = L(e.title)

  return (
    <>
      <Head title={title} sub={`${t(`ev.k.${e.cat}`)} · ${L(e.city)}`} back="/events" backLabel={t('ev.nav')} />
      <div className="container-x grid gap-10 py-10 lg:grid-cols-[1fr_360px]">
        <div>
          <img src={media(e.img)} alt={title} className="aspect-[16/9] w-full rounded-lg object-cover sm:aspect-[21/8]" />
          <div className="mt-6">
            <Stats items={[[t('ev.date'), i.date(evDate(e), { weekday: true, year: true })], [t('ev.time'), <bdi key="t" dir="ltr">{e.time}</bdi>],
              [t('ev.venue'), <span key="v">{L(e.venue)}<span className="block text-xs font-normal text-muted">{L(e.city)}</span></span>]]} />
          </div>
          <section className="mt-10" aria-labelledby="evH">
            <h2 id="evH" className="text-xl font-bold">{t(hasMap ? 'ev.seats' : 'ev.tier')}</h2>
            {hasMap && <p className="mt-1 text-sm text-muted">{t('ev.mapNote')}</p>}
            <ZoneMap event={e} value={tier} onChange={setTier} />
            <div role="radiogroup" aria-labelledby="evH" className="mt-4 grid gap-3">
              {tiers.map((x) => (
                <label key={x.id} className={`flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition ${x.id === tier ? 'border-brand bg-brand/5' : 'border-line hover:border-brand/40'}`}>
                  <input type="radio" name="tier" value={x.id} checked={x.id === tier} onChange={() => setTier(x.id)} className="mt-1 size-4 accent-[var(--color-brand)]" />
                  {hasMap && <span aria-hidden="true" className={`mt-1 size-3.5 shrink-0 rounded-[3px] ${TONES[rank.indexOf(x.id)].dot}`} />}
                  <span className="flex-1"><b className="block">{L(x.name)}</b>
                    <span className={`text-sm ${x.left < 30 ? 'font-semibold text-amber-700' : 'text-muted'}`}>{t(x.left < 30 ? 'ev.few' : 'ev.avail')}</span></span>
                  <span className="text-end text-sm font-semibold"><Ltr>{money(x.usd)}</Ltr><span className="block text-xs font-normal text-muted">{t('ev.perTicket')}</span></span>
                </label>
              ))}
            </div>
          </section>
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card space-y-5 p-6">
            <div className="flex items-center justify-between gap-3"><span className="text-sm font-semibold">{t('ev.qty')}</span><Qty value={qty} min={1} max={maxQ} onChange={setN} label={t('ev.qty')} /></div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-muted">{t('ev.tier')}</dt><dd className="font-medium">{L(cur.name)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-muted">{t('ev.qty')}</dt><dd className="font-medium">{pl(i, qty, 'ev.t')}</dd></div>
            </dl>
            <Total usd={cur.usd * qty} />
            <button type="button" className="btn-primary w-full py-4 text-base" onClick={() => go(`/checkout${qs({ type: 'event', id: e.id, tier, qty, date: evDate(e) })}`)}>{t('ev.continue')}</button>
            <Note icon="qr">{t('ev.qrNote')}</Note>
            <div className="text-center"><HelpLine ctx={title} /></div>
          </div>
        </aside>
      </div>
    </>
  )
}
