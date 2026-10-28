import { useState } from 'react'
import { useNavigate } from 'react-router'
import Icon from '../Icon'
import Combobox from '../Combobox'
import { useI18n } from '../../lib/i18n'
import { Counter, Field, Popover, control } from '../stays/ui'
import { HotelForm } from '../stays/Forms'
import { monthOptions, plural, withQs } from '../stays/lib'
import { THEMES } from '../../data/incoming'
import { PLACES, int, nationOptions } from './lib'
import { RegionSwitch } from './Visa'

/** Tours: place or theme · month · travellers → /visit/tours?where&month&ad */
export function TourSearch({ initial = {} }) {
  const i = useI18n(); const { t } = i
  const go = useNavigate()
  const months = monthOptions(i)
  const [f, setF] = useState(() => ({ where: initial.where || '', month: months.some((m) => m.value === initial.month) ? initial.month : '', ad: int(initial.ad, 2, 1, 12) }))
  const set = (p) => setF((x) => ({ ...x, ...p }))
  const opts = [{ value: '', title: t('iq.anywhere') },
    ...THEMES.map((x) => ({ value: `t:${x.id}`, title: i.L(x.title), sub: t('iq.wayL') })),
    ...PLACES.map((p) => ({ value: `p:${p.id}`, title: i.L(p.name), sub: t(p.region === 'krg' ? 'iq.region.krg' : 'iq.region.fed') }))]
  return (
    <form onSubmit={(e) => { e.preventDefault(); go(withQs('/visit/tours', f)) }} noValidate className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
      <Combobox label={t('iq.where')} icon="pin" value={f.where} onChange={(v) => set({ where: v })} options={opts} placeholder={t('iq.wherePh')} />
      <Field label={t('pk.month')} icon="calendar">
        <select className={`${control} cursor-pointer`} value={f.month} onChange={(e) => set({ month: e.target.value })}>
          <option value="">{t('pk.anyMonth')}</option>
          {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
      </Field>
      <Popover label={t('pk.trav')} icon="users" value={plural(i, 'st.travellers', f.ad)}>
        {(close) => (<div><Counter label={t('pk.trav')} value={f.ad} min={1} max={12} onChange={(v) => set({ ad: v })} />
          <button type="button" onClick={close} className="btn-ghost mt-4 w-full py-2.5 text-sm">{t('st.done')}</button></div>)}
      </Popover>
      <button className="btn-primary min-h-14 w-full px-8 text-base lg:w-auto"><Icon name="search" className="size-5" />{t('iq.findTours')}</button>
    </form>
  )
}

/** Visa to Iraq: nationality · region → /visit/visa?nat&region */
export function VisaSearch({ initial = {} }) {
  const i = useI18n(); const { t } = i
  const go = useNavigate()
  const [nat, setNat] = useState(initial.nat || '')
  const [region, setRegion] = useState(initial.region === 'krg' ? 'krg' : 'fed')
  const [err, setErr] = useState('')
  const submit = (e) => { e.preventDefault(); if (!nat) { setErr(t('iq.visa.pick')); return } go(withQs('/visit/visa', { nat, region })) }
  return (
    <form onSubmit={submit} noValidate className="space-y-2">
      <div className="grid gap-3 lg:grid-cols-[1.4fr_1.2fr_auto]">
        <Combobox label={t('iq.visa.nat')} icon="passport" value={nat} onChange={(v) => { setNat(v); setErr('') }} options={nationOptions(i)} placeholder={t('iq.visa.natPh')} />
        <RegionSwitch value={region} onChange={setRegion} />
        <button className="btn-primary min-h-14 w-full px-8 text-base lg:w-auto"><Icon name="passport" className="size-5" />{t('iq.visa.check')}</button>
      </div>
      {err && <p role="alert" className="text-sm font-medium text-red-600">{err}</p>}
    </form>
  )
}

/** Hotels in Iraq: the hotel engine with Iraqi cities. */
export function IqHotelSearch({ initial = {} }) {
  return <HotelForm initial={initial} scope="iq" />
}
