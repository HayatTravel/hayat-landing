import { useState } from 'react'
import { useNavigate } from 'react-router'
import Icon from '../Icon'
import Combobox from '../Combobox'
import { addDaysIso, inDays, useI18n } from '../../lib/i18n'
import { Counter, Field, Popover, control } from './ui'
import { cityBy, guestsText, hotelCities, hq, int, monthOptions, pkgCities, pq, scopeOf, travText, withQs } from './lib'

/** Hotel search: city · check-in · check-out · rooms and guests.
    noCity: the hotel page's "change dates" (city fixed). onSubmit(params) overrides the default navigation. */
export function HotelForm({ initial = {}, noCity = false, label, onSubmit, scope }) {
  const i = useI18n(); const { t } = i
  const go = useNavigate()
  const h0 = hq(initial)
  const sc = scope ?? scopeOf(h0.city)
  const [f, setF] = useState(() => ({ ...h0, city: h0.city || hotelCities(sc)[0].slug }))
  const [err, setErr] = useState('')
  const set = (patch) => setF((x) => ({ ...x, ...patch }))
  const cities = hotelCities(sc).map((c) => ({ value: c.slug, title: i.L(c.name), sub: i.L(c.country) }))

  const submit = (e) => {
    e.preventDefault()
    if (!f.out || f.out <= f.in) { setErr(t('ht.dateErr')); return }
    setErr('')
    const out = { city: f.city, in: f.in, out: f.out, rooms: f.rooms, ad: Math.max(f.ad, f.rooms), ch: f.ch }
    onSubmit ? onSubmit(out) : go(withQs('/hotels/results', out))
  }
  return (
    <form onSubmit={submit} noValidate className="space-y-3">
      <div className={`grid gap-3 ${noCity ? 'lg:grid-cols-[1.4fr_1fr_auto]' : 'lg:grid-cols-[1.3fr_1.4fr_1fr_auto]'}`}>
        {!noCity && <Combobox label={t('ht.city')} icon="pin" value={f.city} onChange={(v) => set({ city: v })} options={cities} placeholder={t('ht.cityPh')} />}
        <div className="grid grid-cols-2 gap-3">
          <Field label={t('ht.checkin')} icon="calendar">
            <input type="date" className={control} value={f.in} min={inDays(0)} required
              onChange={(e) => { const v = e.target.value; if (v) set({ in: v, out: f.out > v ? f.out : addDaysIso(v, Math.max(1, f.n || 1)) }) }} />
          </Field>
          <Field label={t('ht.checkout')} icon="calendar">
            <input type="date" className={control} value={f.out} min={addDaysIso(f.in, 1)} required onChange={(e) => e.target.value && set({ out: e.target.value })} />
          </Field>
        </div>
        <Popover label={t('ht.guests')} icon="users" value={guestsText(i, f)}>
          {(close) => (
            <div>
              <Counter label={t('ht.rooms')} value={f.rooms} min={1} max={5} onChange={(v) => set({ rooms: v, ad: Math.max(f.ad, v) })} />
              <Counter label={t('st.adultsL')} sub={t('st.adultsSub')} value={f.ad} min={Math.max(1, f.rooms)} max={10} onChange={(v) => set({ ad: v })} />
              <Counter label={t('st.childrenL')} sub={t('st.childrenSub')} value={f.ch} max={6} onChange={(v) => set({ ch: v })} />
              <button type="button" onClick={close} className="btn-ghost mt-4 w-full py-2.5 text-sm">{t('st.done')}</button>
            </div>
          )}
        </Popover>
        <button className="btn-primary min-h-14 w-full px-8 text-base lg:w-auto"><Icon name="search" className="size-5" />{label || t('ht.search')}</button>
      </div>
      {err && <p role="alert" className="text-sm font-medium text-red-600">{err}</p>}
    </form>
  )
}

/** Holiday search: destination · month · travellers → /holidays?city&month&ad&ch */
export function HolidayForm({ initial = {} }) {
  const i = useI18n(); const { t } = i
  const go = useNavigate()
  const months = monthOptions(i)
  const [f, setF] = useState(() => ({ city: cityBy(initial.city) ? initial.city : '', month: months.some((m) => m.value === initial.month) ? initial.month : '', ...pq(initial) }))
  const set = (patch) => setF((x) => ({ ...x, ...patch }))
  const cities = [{ value: '', title: t('pk.anyDest') }, ...pkgCities().map((c) => ({ value: c.slug, title: i.L(c.name), sub: i.L(c.country) }))]
  const submit = (e) => { e.preventDefault(); go(withQs('/holidays', { city: f.city, month: f.month, ad: f.ad, ch: f.ch })) }
  return (
    <form onSubmit={submit} noValidate className="grid gap-3 lg:grid-cols-[1.3fr_1fr_1fr_auto]">
      <Combobox label={t('pk.dest')} icon="pin" value={f.city} onChange={(v) => set({ city: v })} options={cities} placeholder={t('pk.anyDest')} />
      <Field label={t('pk.month')} icon="calendar">
        <select className={`${control} cursor-pointer`} value={f.month} onChange={(e) => set({ month: e.target.value })}>
          <option value="">{t('pk.anyMonth')}</option>
          {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
      </Field>
      <Popover label={t('pk.trav')} icon="users" value={travText(i, f)}>
        {(close) => (
          <div>
            <Counter label={t('st.adultsL')} sub={t('st.adultsSub')} value={f.ad} min={1} max={9} onChange={(v) => set({ ad: int(v, 2, 1, 9) })} />
            <Counter label={t('st.childrenL')} sub={t('st.childrenSub')} value={f.ch} max={6} onChange={(v) => set({ ch: v })} />
            <button type="button" onClick={close} className="btn-ghost mt-4 w-full py-2.5 text-sm">{t('st.done')}</button>
          </div>
        )}
      </Popover>
      <button className="btn-primary min-h-14 w-full px-8 text-base lg:w-auto"><Icon name="search" className="size-5" />{t('pk.search')}</button>
    </form>
  )
}
