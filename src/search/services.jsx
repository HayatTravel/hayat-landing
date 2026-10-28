/* Search tabs for visa, eSIM, events and airport transfers (hosted by the lead's SearchPanel). */
import { useState } from 'react'
import { useNavigate } from 'react-router'
import Combobox from '../components/Combobox'
import D from '../data/catalog'
import { inDays, useI18n } from '../lib/i18n'
import TransferForm from '../components/services/TransferForm'
import { visaOptions } from '../components/services/VisaChecker'
import { PURPOSES, esDays, esim, evCities, minPlan, monthText, nextMonths, purposeOk, purposesOf, qs, visa } from '../components/services/data'
import { Field, Seg, Submit, control } from '../components/services/ui'

function VisaForm({ initial = {} }) {
  const i = useI18n(); const { t } = i
  const go = useNavigate()
  const [id, setId] = useState(visa(initial.id) ? initial.id.toUpperCase() : 'TR')
  const [nat, setNat] = useState(initial.nat === 'XX' ? 'XX' : 'IQ')
  const [date, setDate] = useState(initial.date || inDays(30))
  const [purpose, setPurpose] = useState(purposeOk(initial.purpose) ? initial.purpose : 'tourism')
  const v = visa(id)
  const submit = (e) => { e.preventDefault(); go(`/visa/${id}${qs({ purpose: purpose === 'tourism' ? '' : purpose, nat: nat === 'IQ' ? '' : nat, date })}`) }
  return (
    <form onSubmit={submit} className="grid gap-3 md:grid-cols-[1.3fr_1fr_0.9fr_1fr_auto]">
      <Combobox label={t('vi.dest')} icon="globe" value={id} onChange={setId} options={visaOptions(i)} placeholder={t('sv.type')} />
      <Field label={t('vi.purpose')} icon="documents">
        <select className={control} value={purpose} onChange={(e) => setPurpose(e.target.value)}>
          {PURPOSES.map((p) => <option key={p} value={p} disabled={v && !purposesOf(v).includes(p)}>{t(`vi.p.${p}`)}</option>)}
        </select>
      </Field>
      <Field label={t('vi.nat')} icon="passport">
        <select className={control} value={nat} onChange={(e) => setNat(e.target.value)}><option value="IQ">{t('vi.natIQ')}</option><option value="XX">{t('vi.natXX')}</option></select>
      </Field>
      <Field label={t('vi.date')} icon="calendar"><input type="date" className={control} value={date} min={inDays(0)} onChange={(e) => e.target.value && setDate(e.target.value)} required /></Field>
      <Submit>{t('vi.check')}</Submit>
    </form>
  )
}

function EsimForm({ initial = {} }) {
  const i = useI18n(); const { t, L, money } = i
  const go = useNavigate()
  const [cc, setCc] = useState(esim(initial.cc) ? initial.cc : 'tr')
  const [days, setDays] = useState(['7', '15', '30'].includes(initial.days) ? initial.days : '7')
  const options = D.esim.map((c) => ({ value: c.cc, title: L(c.name), sub: `${c.net} · ${t('sv.from')} ${money(minPlan(c))}` }))
  return (
    <form onSubmit={(e) => { e.preventDefault(); go(`/esim/${cc}${qs({ days })}`) }} className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted">{t('es.trip')}</span>
        <Seg label={t('es.trip')} value={days} onChange={setDays} options={[7, 15, 30].map((n) => ({ value: String(n), label: esDays(i, n) }))} />
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <Combobox label={t('es.country')} icon="globe" value={cc} onChange={setCc} options={options} placeholder={t('sv.type')} />
        <Submit>{t('es.see')}</Submit>
      </div>
    </form>
  )
}

function EventsForm({ initial = {} }) {
  const i = useI18n(); const { t, L } = i
  const go = useNavigate()
  const [city, setCity] = useState(initial.city || '')
  const [month, setMonth] = useState(initial.month || '')
  return (
    <form onSubmit={(e) => { e.preventDefault(); go(`/events${qs({ city, month })}`) }} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
      <Field label={t('ev.city')} icon="pin">
        <select className={control} value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">{t('ev.allCities')}</option>{evCities().map(([k, c]) => <option key={k} value={k}>{L(c)}</option>)}
        </select>
      </Field>
      <Field label={t('ev.month')} icon="calendar">
        <select className={control} value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="">{t('ev.anyMonth')}</option>{nextMonths(6).map((m) => <option key={m} value={m}>{monthText(i, m)}</option>)}
        </select>
      </Field>
      <Submit>{t('ev.find')}</Submit>
    </form>
  )
}

export default [
  { id: 'visa', icon: 'passport', label: 'nav.visa', order: 5, Form: VisaForm },
  { id: 'esim', icon: 'sim', label: 'nav.esim', order: 6, Form: EsimForm },
  { id: 'events', icon: 'ticket', label: 'nav.events', order: 7, Form: EventsForm },
  { id: 'transfers', icon: 'car', label: 'nav.transfers', order: 8, Form: TransferForm },
]
