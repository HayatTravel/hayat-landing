import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { PageHead } from '../components/Layout'
import Icon from '../components/Icon'
import { Ltr, Stepper } from '../components/ui'
import { useI18n } from '../lib/i18n'
import { openHelp } from '../lib/store'
import { bookingSteps } from './Checkout'
import { HotelForm } from '../components/stays/Forms'
import { BoardLine, CancelLine, Facts, HStars, PriceFrom, Score } from '../components/stays/ui'
import { baseQ, cheapest, imgSrc, cityBy, guestsText, hotelBy, hq, place, plural, stayText, withQs } from '../components/stays/lib'
import NotFound from './NotFound'

/** #/hotels/:id?in&out&rooms&ad&ch — gallery, about, rooms (Choose → checkout), location, good to know. */
export default function HotelsDetail() {
  const i = useI18n(); const { t } = i
  const { id } = useParams()
  const [sp] = useSearchParams()
  const go = useNavigate()
  const [active, setActive] = useState(0)
  const [edit, setEdit] = useState(false)
  const hotel = hotelBy(id)
  if (!hotel) return <NotFound />
  const h = { ...hq(Object.fromEntries(sp)), city: hotel.city }
  const c = cityBy(hotel.city)
  const pics = [...new Set([...(hotel.gallery || []), hotel.img, 'hotel', 'lounge'])].slice(0, 3)
  const rooms = [...hotel.rooms].sort((a, b) => a.base - b.base)
  const toRooms = () => document.getElementById('ht-rooms')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <>
      <PageHead>
        <Link to={withQs('/hotels/results', baseQ(h))} className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-white"><Icon name="arrow" className="size-4 ltr:-scale-x-100" /> {t('ht.allIn', { city: i.L(c.name) })}</Link>
        <Stepper steps={bookingSteps(t)} current={0} />
      </PageHead>

      <div className="container-x py-10">
        <div className="grid gap-3 overflow-hidden rounded-lg md:h-[420px] md:grid-cols-4 md:grid-rows-2">
          <div className="aspect-[16/10] overflow-hidden bg-mist md:col-span-3 md:row-span-2 md:aspect-auto">
            <img key={pics[active]} src={imgSrc(pics[active])} alt={i.L(hotel.name)} className="size-full animate-fade object-cover" />
          </div>
          {pics.map((p, k) => k !== active && (
            <button key={p} type="button" onClick={() => setActive(k)} aria-label={t('ht.photo', { n: k + 1, total: pics.length })} className="hidden overflow-hidden bg-mist md:block">
              <img src={imgSrc(p)} alt="" loading="lazy" className="size-full object-cover transition duration-700 hover:scale-105" />
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
          <div className="min-w-0 space-y-12">
            <section>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <HStars n={hotel.stars} className="size-4" />
                  <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{i.L(hotel.name)}</h1>
                  <p className="mt-2 flex items-center gap-1.5 text-muted"><Icon name="pin" className="size-4" />{i.L(hotel.area)} · {place(i, c)}</p>
                </div>
                <Score s={hotel.score} />
              </div>
              <p className="mt-6 max-w-2xl leading-8 text-ink/75">{i.L(hotel.about)}</p>
              <Facts keys={hotel.facts} className="mt-5" />
            </section>

            <section id="ht-rooms" aria-labelledby="ht-rooms-h" className="scroll-mt-24">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="ht-rooms-h" className="text-xl font-bold">{t('ht.roomsT')}</h2>
                <button type="button" onClick={() => setEdit(!edit)} aria-expanded={edit} className="text-sm font-semibold text-brand lg:hidden">{t('ht.change')}</button>
              </div>
              <p className="mt-1 text-sm text-muted lg:hidden">{i.date(h.in)} – {i.date(h.out)} · {guestsText(i, h)}</p>
              {edit && <div className="mt-4 rounded-lg border border-line bg-white p-4 lg:hidden"><HotelForm noCity initial={baseQ(h)} label={t('ht.update')} onSubmit={(v) => { setEdit(false); go(withQs(`/hotels/${hotel.id}`, { ...v, city: hotel.city }), { replace: true }) }} /></div>}
              <div className="mt-4 space-y-4">
                {rooms.map((r) => (
                  <article key={r.id} className="card grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-end">
                    <div>
                      <h3 className="text-lg font-bold">{i.L(r.name)}</h3>
                      <div className="mt-2 grid gap-1 text-sm text-ink/75"><BoardLine code={r.board} /><CancelLine room={r} inIso={h.in} /></div>
                    </div>
                    <div className="sm:text-end">
                      <p className="text-2xl font-bold"><Ltr>{i.money(r.base)}</Ltr></p>
                      <p className="text-xs text-muted">{t('ht.perNight')}</p>
                      <p className="mt-1 text-xs text-muted">{t('ht.totalStay', { price: i.money(r.base * h.rooms * h.n), stay: stayText(i, h) })}</p>
                      <Link to={withQs('/checkout', { type: 'hotel', id: hotel.id, room: r.id, in: h.in, out: h.out, rooms: h.rooms, ad: h.ad, ch: h.ch })} className="btn-primary mt-3 w-full px-8 py-2.5 text-sm sm:w-auto">{t('ht.choose')}</Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold">{t('ht.location')}</h2>
              <div className="grid min-h-48 place-items-center content-center gap-1.5 rounded-lg border border-line bg-mist p-6 text-center [background-image:linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] [background-size:28px_28px]">
                <span className="grid size-11 place-items-center rounded-full bg-ink text-white"><Icon name="pin" className="size-5" /></span>
                <b>{i.L(hotel.area)}</b>
                <span className="max-w-md text-sm text-muted">{place(i, c)} · {t('ht.mapNote')}</span>
              </div>
            </section>

            <section>
              <details className="group border-y border-line py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold [&::-webkit-details-marker]:hidden">{t('ht.good')}<Icon name="chev" className="size-4 transition group-open:rotate-180" /></summary>
                <ul className="mt-4 space-y-2 text-sm text-ink/75">{['ht.g1', 'ht.g2', 'ht.g3', 'ht.g4'].map((k) => <li key={k} className="flex gap-2"><Icon name="info" className="mt-0.5 size-4 shrink-0 text-muted" />{t(k)}</li>)}</ul>
              </details>
              <button type="button" onClick={() => openHelp(i.L(hotel.name))} className="mt-4 flex items-center gap-2 text-sm font-medium text-brand"><Icon name="chat" className="size-4" />{t('help.line')}</button>
            </section>
          </div>

          <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
            <div className="card p-6">
              <PriceFrom usd={cheapest(hotel).base} unit={t('ht.perNight')} align="start" />
              <dl className="mt-5 space-y-2.5 border-t border-line pt-4 text-sm">
                {[[t('ht.checkin'), i.date(h.in, { weekday: true })], [t('ht.checkout'), i.date(h.out, { weekday: true })], [t('ht.nightsL'), plural(i, 'st.nights', h.n)], [t('ht.guestsL'), guestsText(i, h)]].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4"><dt className="text-muted">{k}</dt><dd className="text-end font-medium">{v}</dd></div>
                ))}
              </dl>
              {edit
                ? <div className="mt-5 border-t border-line pt-5 [&_.grid]:grid-cols-1"><HotelForm noCity initial={baseQ(h)} label={t('ht.update')} onSubmit={(v) => { setEdit(false); go(withQs(`/hotels/${hotel.id}`, { ...v, city: hotel.city }), { replace: true }) }} /></div>
                : <button type="button" onClick={() => setEdit(true)} className="btn-ghost mt-5 w-full py-2.5 text-sm"><Icon name="edit" className="size-4" />{t('ht.changeDates')}</button>}
              <button type="button" onClick={toRooms} className="btn-primary mt-3 w-full py-2.5 text-sm">{t('ht.seeRooms')}</button>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
