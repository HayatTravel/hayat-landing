import { useState } from 'react'
import { useNavigate } from 'react-router'
import Icon from '../Icon'
import Combobox from '../Combobox'
import { Field, control } from '../flights/FlightForm'
import { addDaysIso, inDays, useI18n } from '../../lib/i18n'
import { store } from '../../lib/store'
import { qs } from '../flights/engine'
import { LOCATIONS, carParams, normCar } from './engine'

const TIMES = Array.from({ length: 34 }, (_, k) => { const m = 360 + k * 30; return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}` })

/** Car search: city, pick-up and drop-off date + time, driver 25+. Navigates to /cars?… */
export default function CarForm({ initial = {}, onDone }) {
  const i = useI18n(); const { t } = i
  const go = useNavigate()
  const [f, setF] = useState(() => normCar(initial.city ? initial : { ...store.get('car-last', {}), ...initial }))
  const [err, setErr] = useState('')
  const set = (p) => setF((x) => ({ ...x, ...p }))
  const opts = LOCATIONS.map((l) => ({ value: l.id, title: i.L(l.name), sub: i.L(l.country), code: l.code }))
  const submit = (e) => {
    e.preventDefault()
    if (`${f.drop}T${f.dt}` <= `${f.pick}T${f.pt}`) return setErr(t('car.dropErr'))
    setErr('')
    store.set('car-last', f)
    onDone?.()
    go(`/cars?${qs(carParams(f))}`)
  }
  const time = (k) => (
    <select aria-label={t('car.time')} className={`${control} w-auto`} value={f[k]} onChange={(e) => set({ [k]: e.target.value })}>
      {TIMES.map((x) => <option key={x} value={x}>{x}</option>)}
    </select>
  )
  return (
    <form onSubmit={submit} noValidate className="space-y-3 rounded-lg border border-line bg-white p-4 text-ink sm:p-5">
      <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
        <Combobox label={t('car.city')} icon="car" value={f.city} onChange={(v) => set({ city: v })} options={opts} placeholder={t('car.cityPh')} />
        <Field label={t('car.pick')} icon="calendar" as="div">
          <span className="flex items-center gap-2">
            <input type="date" aria-label={t('car.pick')} className={control} value={f.pick} min={inDays(1)} onChange={(e) => e.target.value && set({ pick: e.target.value, drop: f.drop <= e.target.value ? addDaysIso(e.target.value, 3) : f.drop })} />
            {time('pt')}
          </span>
        </Field>
        <Field label={t('car.drop')} icon="calendar" as="div">
          <span className="flex items-center gap-2">
            <input type="date" aria-label={t('car.drop')} className={control} value={f.drop} min={f.pick} onChange={(e) => e.target.value && set({ drop: e.target.value })} />
            {time('dt')}
          </span>
        </Field>
        <button className="btn-primary min-h-14 w-full px-8 text-base lg:w-auto"><Icon name="search" className="size-5" />{t('car.go')}</button>
      </div>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-ink/80">
        <input type="checkbox" checked={f.age === '25'} onChange={(e) => set({ age: e.target.checked ? '25' : 'u25' })} className="size-4 accent-[var(--color-brand)]" />{t('car.age')}
      </label>
      {err && <p role="alert" className="text-sm font-medium text-red-600">{err}</p>}
    </form>
  )
}
