import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { PageHead } from '../components/Layout'
import Icon from '../components/Icon'
import Combobox from '../components/Combobox'
import { Ltr, Stepper } from '../components/ui'
import { useI18n } from '../lib/i18n'
import { openHelp } from '../lib/store'
import { bookingSteps } from './Checkout'
import { GUIDE_LANGS } from '../data/incoming'
import { firstDay, isDate, nationOptions, placeBy, tourBy, tourDates, tourEnd, tourQ, useVisitMode } from '../components/incoming/lib'
import { Credit, Img, Ticks } from '../components/incoming/ui'
import { Counter, Field, control } from '../components/stays/ui'
import { plural, qs, withQs } from '../components/stays/lib'
import NotFound from './NotFound'

/** /visit/tours/:id?date&ad&lang&nat — the programme, then date, travellers, guide language → /checkout?type=tour */
export default function VisitTour() {
  useVisitMode()
  const i = useI18n(); const { t } = i
  const { id } = useParams()
  const [sp, setSp] = useSearchParams()
  const go = useNavigate()
  const x = tourBy(id)
  if (!x) return <NotFound />
  const q = Object.fromEntries(sp)
  const dates = tourDates(x)
  const st = {
    date: dates ? (dates.includes(q.date) ? q.date : dates[0]) : (isDate(q.date) && q.date >= firstDay() ? q.date : firstDay()),
    ...tourQ(q),
    lang: GUIDE_LANGS.includes(q.lang) ? q.lang : (GUIDE_LANGS.includes(i.lang) ? i.lang : 'en'),
    nat: q.nat || '',
  }
  const set = (patch) => setSp(qs({ ...st, ...patch }), { replace: true, preventScrollReset: true })
  const submit = (e) => { e.preventDefault(); go(withQs('/checkout', { type: 'tour', id: x.id, ...st })) }
  const len = x.days === 1 ? t('iq.dayTrip') : plural(i, 'iq.days', x.days)
  const dayLabel = (k) => (x.days === 1 ? t('iq.theDay') : t('pk.day', { n: i.num(k + 1) }))

  return (
    <>
      <PageHead>
        <Link to="/visit/tours" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-white"><Icon name="arrow" className="size-4 ltr:-scale-x-100" /> {t('iq.allTours')}</Link>
        <Stepper steps={bookingSteps(t)} current={0} />
      </PageHead>
      <div className="container-x py-10">
        <figure>
          <div className="aspect-[16/10] overflow-hidden rounded-lg sm:aspect-[21/8]"><Img k={x.photo} eager alt={i.L(x.title)} className="size-full" /></div>
          <figcaption className="mt-1 text-end"><Credit k={x.photo} /></figcaption>
        </figure>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0 space-y-12">
            <section>
              <p className="text-sm text-muted">{t(`iq.theme.${x.theme}`)} · {t(x.type === 'group' ? 'iq.group' : 'iq.private')}</p>
              <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{i.L(x.title)}</h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-ink/80">{i.L(x.summary)}</p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="inline-flex items-center gap-1 rounded-md bg-mist px-2 py-1"><Icon name="clock" className="size-3.5" />{len}</span>
                {x.places.map((pid) => { const p = placeBy(pid); return <Link key={pid} to={`/visit/places/${pid}`} className="inline-flex items-center gap-1 rounded-md bg-mist px-2 py-1 hover:bg-line"><Icon name="pin" className="size-3.5" />{i.L(p.name)}</Link> })}
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold">{t(x.days === 1 ? 'iq.plan1' : 'pk.days')}</h2>
              <ol className="space-y-3">
                {x.itinerary.map((d, k) => (
                  <li key={k} className="grid grid-cols-[auto_1fr] items-start gap-4">
                    <b className="grid h-9 min-w-20 place-items-center rounded-md bg-mist px-3 text-sm whitespace-nowrap">{dayLabel(k)}</b>
                    <p className="pt-1.5 leading-7 text-ink/80">{i.L(d)}</p>
                  </li>
                ))}
              </ol>
            </section>

            {x.notes?.length > 0 && (
              <section className="rounded-lg border border-amber-200 bg-amber-50 p-5">
                <h2 className="mb-3 flex items-center gap-2 font-bold text-amber-900"><Icon name="info" className="size-5" />{t('iq.tour.notes')}</h2>
                <ul className="space-y-2.5 text-sm leading-6 text-amber-900/90">{x.notes.map((n, k) => <li key={k}>{i.L(n)}</li>)}</ul>
              </section>
            )}

            <section className="grid gap-8 sm:grid-cols-2">
              <div><h2 className="mb-4 text-xl font-bold">{t('pk.inc')}</h2><Ticks items={x.includes.map((k) => t(`iq.inc.${k}`))} /></div>
              <div><h2 className="mb-4 text-xl font-bold">{t('pk.exc')}</h2><Ticks no items={x.excludes.map((k) => t(`iq.inc.${k}`))} /></div>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-bold">{t('iq.guideLangs')}</h2>
              <p className="text-ink/80">{GUIDE_LANGS.map((l) => t(`iq.lang.${l}`)).join(' · ')}</p>
              <p className="mt-1 text-sm text-muted">{t('iq.guideLangsD')}</p>
              <button type="button" onClick={() => openHelp(i.L(x.title))} className="mt-6 flex items-center gap-2 text-sm font-medium text-brand"><Icon name="chat" className="size-4" />{t('help.line')}</button>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <form onSubmit={submit} className="card space-y-5 p-6">
              <h2 className="text-lg font-bold">{t('iq.tour.book')}</h2>
              {dates ? (
                <fieldset><legend className="mb-2 text-sm font-semibold">{t('iq.tour.dates')}</legend>
                  <div className="grid gap-2">{dates.map((d) => (
                    <label key={d} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition ${d === st.date ? 'border-brand bg-brand/5' : 'border-line hover:border-brand/40'}`}>
                      <input type="radio" name="date" checked={d === st.date} onChange={() => set({ date: d })} className="mt-1 size-4 accent-[var(--color-brand)]" />
                      <span><span className="block text-sm font-semibold">{i.date(d, { weekday: true })}</span>{x.days > 1 && <span className="text-xs text-muted">{t('pk.returnOn', { date: i.date(tourEnd(x, d)) })}</span>}</span>
                    </label>))}</div></fieldset>
              ) : (
                <Field label={t('iq.tour.start')} icon="calendar">
                  <input type="date" className={control} value={st.date} min={firstDay()} onChange={(e) => e.target.value && set({ date: e.target.value })} />
                  <span className="mt-1 block text-xs font-normal text-muted">{t('iq.anyDayD')}</span>
                </Field>
              )}
              <Counter label={t('pk.trav')} value={st.ad} min={1} max={12} onChange={(v) => set({ ad: v })} />
              <div><label className="label" htmlFor="vi-lang">{t('iq.guideLang')}</label>
                <select id="vi-lang" className="field py-2.5" value={st.lang} onChange={(e) => set({ lang: e.target.value })}>{GUIDE_LANGS.map((l) => <option key={l} value={l}>{t(`iq.lang.${l}`)}</option>)}</select></div>
              <Combobox label={t('iq.visa.nat')} icon="passport" value={st.nat} onChange={(v) => set({ nat: v })} options={nationOptions(i)} placeholder={t('iq.visa.natPh')} />
              <dl className="space-y-2.5 border-t border-line pt-4 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-muted">{t('pk.line', { who: plural(i, 'st.travellers', st.ad), price: i.money(x.price) })}</dt><dd className="font-medium"><Ltr>{i.money(x.price * st.ad)}</Ltr></dd></div>
              </dl>
              <div className="flex items-end justify-between border-t border-dashed border-line pt-4"><span className="text-muted">{t('co.total')}</span><span className="text-2xl font-bold"><Ltr>{i.money(x.price * st.ad)}</Ltr></span></div>
              <button className="btn-primary w-full py-3.5 text-base">{t('pk.continue')}</button>
              <p className="text-center text-xs text-muted">{t('iq.tour.next')}</p>
            </form>
          </aside>
        </div>
      </div>
    </>
  )
}
