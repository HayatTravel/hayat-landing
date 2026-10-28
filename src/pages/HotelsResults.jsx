import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { PageHead } from '../components/Layout'
import Icon from '../components/Icon'
import { Ltr, Stepper } from '../components/ui'
import { useI18n } from '../lib/i18n'
import { bookingSteps } from './Checkout'
import { HotelForm } from '../components/stays/Forms'
import { BoardLine, CancelLine, Facts, HStars, Score } from '../components/stays/ui'
import { ALL_HOTELS, BOARD_ORDER, baseQ, imgSrc, cheapest, cityBy, guestsText, hotelCities, hq, plural, stayText, withQs } from '../components/stays/lib'

const SORTS = ['rec', 'price', 'rating']
const BY = {
  rec: (a, b) => (b.score + b.stars * 0.3) - (a.score + a.stars * 0.3),
  price: (a, b) => cheapest(a).base - cheapest(b).base,
  rating: (a, b) => b.score - a.score,
}
const list = (v) => (v || '').split(',').filter(Boolean)

function ResultCard({ hotel, h }) {
  const i = useI18n(); const { t } = i
  const r = cheapest(hotel)
  const shown = hotel.facts.filter((f) => f !== 'breakfast' && f !== 'allinc').slice(0, 3)
  return (
    <Link to={withQs(`/hotels/${hotel.id}`, baseQ(h))} className="card card-hover group grid overflow-hidden md:grid-cols-[230px_1fr_auto]">
      <div className="aspect-[16/9] overflow-hidden bg-mist md:aspect-auto md:min-h-48"><img src={imgSrc(hotel.img)} alt="" loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-105" /></div>
      <div className="grid content-start gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div><h3 className="text-lg font-bold">{i.L(hotel.name)}</h3>
            <p className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-muted"><HStars n={hotel.stars} /> {i.L(hotel.area)}</p></div>
          <Score s={hotel.score} />
        </div>
        <Facts keys={shown} />
        <div className="grid gap-1 text-sm text-ink/75"><BoardLine code={r.board} /><CancelLine room={r} inIso={h.in} /></div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line p-5 md:min-w-52 md:flex-col md:flex-nowrap md:items-end md:justify-end md:border-t-0 md:border-s md:text-end">
        <span className="flex flex-col leading-tight md:items-end"><span className="text-xl font-bold"><Ltr>{i.money(r.base)}</Ltr></span><span className="text-xs text-muted">{t('ht.perNight')}</span></span>
        <span className="text-xs text-muted">{t('ht.totalStay', { price: i.money(r.base * h.rooms * h.n), stay: stayText(i, h) })}</span>
        <span className="btn-primary px-4 py-2 text-sm">{t('ht.seeRooms')}</span>
      </div>
    </Link>
  )
}

/** #/hotels/results?city&in&out&rooms&ad&ch (+ stars, board, fac, sort kept in the URL) */
export default function HotelsResults() {
  const i = useI18n(); const { t } = i
  const [sp, setSp] = useSearchParams()
  const q = Object.fromEntries(sp)
  const h = hq(q); if (!h.city) h.city = hotelCities()[0].slug
  const c = cityBy(h.city)
  const [edit, setEdit] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const all = ALL_HOTELS.filter((x) => x.city === h.city)
  const boards = BOARD_ORDER.filter((b) => all.some((x) => x.rooms.some((r) => r.board === b)))
  const facs = ['pool', 'beach', 'family', 'metro'].filter((f) => all.some((x) => x.facts.includes(f)))
  const stars = [...new Set(all.map((x) => x.stars))].sort((a, b) => b - a)
  const st = { stars: list(q.stars).map(Number), board: list(q.board), fac: list(q.fac), sort: SORTS.includes(q.sort) ? q.sort : 'rec' }
  const update = (patch) => {
    const next = { ...st, ...patch }
    setSp(withQs('', { ...baseQ(h), stars: next.stars.join(','), board: next.board.join(','), fac: next.fac.join(','), sort: next.sort === 'rec' ? '' : next.sort }).slice(1), { replace: true, preventScrollReset: true })
  }
  const toggle = (key, v) => update({ [key]: st[key].includes(v) ? st[key].filter((x) => x !== v) : [...st[key], v] })
  const shown = all.filter((x) => (!st.stars.length || st.stars.includes(x.stars)) && (!st.board.length || x.rooms.some((r) => st.board.includes(r.board))) && st.fac.every((f) => x.facts.includes(f))).sort(BY[st.sort])

  const box = (k, v, children) => (
    <label key={v} className="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm">
      <input type="checkbox" checked={st[k].includes(v)} onChange={() => toggle(k, v)} className="size-4 accent-[var(--color-brand)]" />{children}
    </label>
  )
  const group = (title, children) => <fieldset className="border-t border-line pt-4 first:border-0 first:pt-0"><legend className="mb-2 text-sm font-semibold">{title}</legend>{children}</fieldset>

  return (
    <>
      <PageHead>
        <Stepper steps={bookingSteps(t)} current={0} />
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{i.L(c.name)}</h1>
            <p className="mt-1 text-muted">{i.date(h.in)} – {i.date(h.out)} · {plural(i, 'st.nights', h.n)} · {guestsText(i, h)}</p>
          </div>
          <button type="button" onClick={() => setEdit(!edit)} aria-expanded={edit} className="btn-ghost py-2.5 text-sm"><Icon name={edit ? 'close' : 'edit'} className="size-4" />{edit ? t('ht.hide') : t('ht.change')}</button>
        </div>
        {edit && <div className="search-host mt-6 rounded-lg border border-line bg-white p-4 text-ink sm:p-5"><HotelForm initial={baseQ(h)} label={t('ht.update')} onSubmit={(v) => { setEdit(false); setSp(withQs('', v).slice(1)) }} /></div>}
      </PageHead>

      <div className="container-x grid gap-8 py-10 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <button type="button" onClick={() => setShowFilters(!showFilters)} aria-expanded={showFilters} aria-controls="ht-filters" className="btn-ghost w-full py-2.5 text-sm lg:hidden"><Icon name="filter" className="size-4" />{t('ht.filters')}</button>
          <form id="ht-filters" aria-label={t('ht.filters')} className={`card mt-3 space-y-4 p-5 lg:mt-0 ${showFilters ? '' : 'hidden lg:block'}`} onSubmit={(e) => e.preventDefault()}>
            {stars.length > 1 && group(t('ht.stars'), stars.map((s) => box('stars', s, <HStars n={s} />)))}
            {boards.length > 1 && group(t('ht.board'), boards.map((b) => box('board', b, t(`ht.board.${b}`))))}
            {facs.length > 0 && group(t('ht.facilities'), facs.map((f) => box('fac', f, t(`ht.f.${f}`))))}
            <p className="flex gap-2 rounded-md bg-mist p-3 text-xs leading-5 text-ink/75"><Icon name="check" className="size-4 shrink-0 text-emerald-600" />{t('ht.allFree')}</p>
          </form>
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p aria-live="polite"><b>{plural(i, 'st.hotels', shown.length)}</b> {t('ht.inCity', { city: i.L(c.name) })}</p>
            <div role="group" aria-label={t('ht.sort')} className="inline-flex rounded-md bg-mist p-1">
              {SORTS.map((s) => (
                <button key={s} type="button" aria-pressed={st.sort === s} onClick={() => update({ sort: s })}
                  className={`rounded px-3.5 py-1.5 text-sm font-semibold transition ${st.sort === s ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'}`}>{t(`ht.sort.${s}`)}</button>
              ))}
            </div>
          </div>
          {shown.length ? (
            <div className="grid gap-4">{shown.map((x) => <ResultCard key={x.id} hotel={x} h={h} />)}</div>
          ) : (
            <div className="card grid justify-items-center gap-2 p-12 text-center">
              <Icon name="search" className="size-8 text-muted" />
              <h2 className="text-lg font-bold">{t('ht.none')}</h2><p className="text-sm text-muted">{t('ht.noneD')}</p>
              <button type="button" onClick={() => update({ stars: [], board: [], fac: [] })} className="btn-ghost mt-2 py-2.5 text-sm">{t('ht.clear')}</button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
