import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { PageHead } from '../components/Layout'
import Icon from '../components/Icon'
import { Ltr, Stepper } from '../components/ui'
import D, { media } from '../data/catalog'
import { addDaysIso, useI18n } from '../lib/i18n'
import { openHelp } from '../lib/store'
import { bookingSteps } from './Checkout'
import { Counter, FlightBadge, HStars, PriceFrom, Score } from '../components/stays/ui'
import { charterOf, imgSrc, cityBy, closestDep, dayLabels, depDates, hotelBy, minPP, perPerson, pkgBy, pkgTotal, place, plural, pq, qs, withQs } from '../components/stays/lib'
import NotFound from './NotFound'

const cityOf = (code, L) => L(D.airports.find((a) => a.code === code)?.city) || code

/** #/holidays/:id?dep&layout&ad&ch — also accepts d1 (from flights "Seat + hotel"): the closest departure is preselected. */
export default function HolidaysDetail() {
  const i = useI18n(); const { t } = i
  const { id } = useParams()
  const [sp, setSp] = useSearchParams()
  const go = useNavigate()
  const p = pkgBy(id)
  if (!p) return <NotFound />
  const q = Object.fromEntries(sp)
  const c = cityBy(p.city); const deps = depDates(p); const ch = charterOf(p); const hotel = p.hotel ? hotelBy(p.hotel) : null
  const lay = p.layouts.find((l) => l.id === q.layout) || p.layouts[0]
  const st = { dep: deps.includes(q.dep) ? q.dep : closestDep(deps, q.d1) || deps[0], layout: lay.id, ...pq(q) }
  const set = (patch) => setSp(qs({ ...st, ...patch }), { replace: true, preventScrollReset: true })
  const ret = (d) => addDaysIso(d, p.nights)
  const pp = perPerson(p, lay)
  const labels = dayLabels(i, p)
  const toForm = () => document.getElementById('pk-book')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const submit = (e) => { e.preventDefault(); go(withQs('/checkout', { type: 'package', id: p.id, ...st })) }

  const radio = (name, value, checked, onChange, main, sub, side) => (
    <label key={value} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition ${checked ? 'border-brand bg-brand/5' : 'border-line hover:border-brand/40'}`}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="mt-1 size-4 accent-[var(--color-brand)]" />
      <span className="flex-1"><span className="block text-sm font-semibold">{main}</span>{sub && <span className="text-xs text-muted">{sub}</span>}</span>
      {side}
    </label>
  )

  return (
    <>
      <PageHead>
        <Link to="/holidays" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-white"><Icon name="arrow" className="size-4 ltr:-scale-x-100" /> {t('pk.all')}</Link>
        <Stepper steps={bookingSteps(t)} current={0} />
      </PageHead>

      <div className="container-x py-10">
        <div className="aspect-[16/10] overflow-hidden rounded-lg bg-mist sm:aspect-[21/8]"><img src={media(p.img)} alt="" className="size-full animate-fade object-cover" /></div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0 space-y-12">
            <section>
              <p className="text-sm text-muted">{place(i, c)}</p>
              <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{i.L(p.title)}</h1>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-mist px-2 py-1 text-xs font-semibold"><Icon name="clock" className="size-3.5" />{plural(i, 'st.nights', p.nights)}</span>
                <FlightBadge p={p} />
                <span className="rounded-md bg-mist px-2 py-1 text-xs font-semibold">{t(`pk.theme.${p.theme}`)}</span>
              </div>
              <div className="mt-6 flex flex-wrap items-end justify-between gap-4 lg:hidden">
                <PriceFrom usd={minPP(p)} unit={t('pk.perPerson')} align="start" />
                <button type="button" onClick={toForm} className="btn-primary py-2.5 text-sm">{t('pk.chooseDep')}</button>
              </div>
            </section>

            <section className="grid gap-8 sm:grid-cols-2">
              <div><h2 className="mb-4 text-xl font-bold">{t('pk.inc')}</h2>
                <ul className="space-y-2.5">{p.includes.map((k) => <li key={k} className="flex gap-2"><Icon name="check" className="mt-0.5 size-4 shrink-0 text-emerald-600" />{t(`pk.inc.${k}`)}</li>)}</ul></div>
              {p.excludes?.length > 0 && <div><h2 className="mb-4 text-xl font-bold">{t('pk.exc')}</h2>
                <ul className="space-y-2.5 text-ink/75">{p.excludes.map((k) => <li key={k} className="flex gap-2"><Icon name="minus" className="mt-0.5 size-4 shrink-0 text-muted" />{t(`pk.inc.${k}`)}</li>)}</ul></div>}
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold">{t('pk.days')}</h2>
              <ol className="space-y-3">
                {p.days.map((d, k) => (
                  <li key={k} className="grid grid-cols-[auto_1fr] items-start gap-4">
                    <b className="grid h-9 min-w-20 place-items-center rounded-md bg-mist px-3 text-sm whitespace-nowrap">{t('pk.day', { n: labels[k] })}</b>
                    <p className="pt-1.5 leading-7 text-ink/80">{i.L(d)}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold">{t('pk.hotel')}</h2>
              {hotel ? (
                <Link to={withQs(`/hotels/${hotel.id}`, { in: st.dep, out: ret(st.dep), rooms: 1, ad: st.ad, ch: st.ch })} className="card card-hover group grid grid-cols-[110px_1fr] overflow-hidden sm:grid-cols-[180px_1fr]">
                  <div className="overflow-hidden bg-mist"><img src={imgSrc(hotel.img)} alt="" loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-105" /></div>
                  <div className="grid gap-1 p-4">
                    <HStars n={hotel.stars} />
                    <h3 className="font-bold">{i.L(hotel.name)}</h3>
                    <p className="text-sm text-muted">{i.L(hotel.area)}</p>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2"><Score s={hotel.score} /><span className="inline-flex items-center gap-1 text-sm font-semibold text-brand">{t('pk.seeHotel')}<Icon name="arrow" className="size-4 rtl:-scale-x-100" /></span></div>
                  </div>
                </Link>
              ) : <p className="flex gap-2 rounded-md bg-mist p-4 text-sm"><Icon name="bed" className="size-4 shrink-0 text-muted" />{t('pk.hotelTbc')}</p>}
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold">{t('pk.flight')}</h2>
              {ch ? (
                <div className="card p-5">
                  <dl className="space-y-2.5 text-sm">
                    {[[t('pk.route'), <span key="r" className="inline-flex items-center gap-2">{cityOf(ch.from, i.L)}<Icon name="arrow" className="size-4 rtl:-scale-x-100" />{cityOf(ch.to, i.L)}</span>],
                      [t('pk.departs'), <Ltr key="d">{ch.dep}</Ltr>], [t('pk.dur'), i.dur(ch.dur)], [t('pk.bag'), t('pk.kg', { n: ch.bag })]].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4"><dt className="text-muted">{k}</dt><dd className="text-end font-medium">{v}</dd></div>
                    ))}
                  </dl>
                  <p className="mt-4 flex gap-2 border-t border-line pt-4 text-sm text-ink/75"><Icon name="plane" className="size-4 shrink-0 text-muted" />{t('pk.charterNote')}</p>
                </div>
              ) : <p className="flex gap-2 rounded-md bg-mist p-4 text-sm"><Icon name="plane" className="size-4 shrink-0 text-muted" />{t('pk.schedNote')}</p>}
            </section>

            <section>
              <details className="group border-y border-line py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold [&::-webkit-details-marker]:hidden">{t('pk.payT')}<Icon name="chev" className="size-4 transition group-open:rotate-180" /></summary>
                <ul className="mt-4 space-y-2 text-sm text-ink/75">{[t('pk.pay1'), t('pk.terms'), t('pk.childNote')].map((s) => <li key={s} className="flex gap-2"><Icon name="info" className="mt-0.5 size-4 shrink-0 text-muted" />{s}</li>)}</ul>
              </details>
              <button type="button" onClick={() => openHelp(i.L(p.title))} className="mt-4 flex items-center gap-2 text-sm font-medium text-brand"><Icon name="chat" className="size-4" />{t('help.line')}</button>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <form id="pk-book" onSubmit={submit} className="card scroll-mt-24 space-y-5 p-6">
              <h2 className="text-lg font-bold">{t('pk.book')}</h2>
              <fieldset><legend className="mb-2 text-sm font-semibold">{t('pk.depart')}</legend>
                <div className="grid gap-2">{deps.map((d) => radio('dep', d, d === st.dep, () => set({ dep: d }), i.date(d, { weekday: true }), t('pk.returnOn', { date: i.date(ret(d)) })))}</div></fieldset>
              <fieldset><legend className="mb-2 text-sm font-semibold">{t('pk.room')}</legend>
                <div className="grid gap-2">{p.layouts.map((l) => radio('layout', l.id, l.id === st.layout, () => set({ layout: l.id }), t(`pk.layout.${l.id}`), null,
                  <span className="text-end text-sm font-semibold"><Ltr>{i.money(perPerson(p, l))}</Ltr><span className="block text-xs font-normal text-muted">{t('pk.perPerson')}</span></span>))}</div></fieldset>
              <fieldset><legend className="text-sm font-semibold">{t('pk.trav')}</legend>
                <Counter label={t('st.adultsL')} sub={t('st.adultsSub')} value={st.ad} min={1} max={9} onChange={(v) => set({ ad: v })} />
                <Counter label={t('st.childrenL')} sub={t('st.childrenSub')} value={st.ch} max={6} onChange={(v) => set({ ch: v })} /></fieldset>
              <dl className="space-y-2.5 border-t border-line pt-4 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-muted">{t('pk.line', { who: plural(i, 'st.adults', st.ad), price: i.money(pp) })}</dt><dd className="font-medium"><Ltr>{i.money(pp * st.ad)}</Ltr></dd></div>
                {st.ch > 0 && <div className="flex justify-between gap-4"><dt className="text-muted">{t('pk.childLine', { who: plural(i, 'st.children', st.ch), price: i.money(pp * 0.7) })}</dt><dd className="font-medium"><Ltr>{i.money(pp * 0.7 * st.ch)}</Ltr></dd></div>}
                <div className="flex justify-between gap-4"><dt className="text-muted">{t('pk.roomsFor')}</dt><dd className="font-medium">{plural(i, 'st.rooms', Math.ceil((st.ad + st.ch) / lay.n))}</dd></div>
              </dl>
              <div className="flex items-end justify-between border-t border-dashed border-line pt-4"><span className="text-muted">{t('co.total')}</span><span className="text-2xl font-bold"><Ltr>{i.money(pkgTotal(p, lay, st.ad, st.ch))}</Ltr></span></div>
              <button className="btn-primary w-full py-3.5 text-base">{t('pk.continue')}</button>
              <p className="text-center text-xs text-muted">{t('pk.payNext')}</p>
            </form>
          </aside>
        </div>
      </div>
    </>
  )
}
