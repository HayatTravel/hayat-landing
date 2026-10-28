import { useState } from 'react'
import { Link } from 'react-router'
import Icon from '../Icon'
import Combobox from '../Combobox'
import { Ltr } from '../ui'
import { useI18n } from '../../lib/i18n'
import { plural, withQs } from '../stays/lib'
import { nationOptions, visaFor } from './lib'

const KIND_IC = { free: 'check', arrival: 'plane', evisa: 'documents', advance: 'passport' }

/** Region switch: Federal Iraq / Kurdistan Region. */
export function RegionSwitch({ value, onChange }) {
  const { t } = useI18n()
  return (
    <div role="radiogroup" aria-label={t('iq.visa.region')} className="grid grid-cols-2 gap-1 rounded-md bg-mist p-1">
      {['fed', 'krg'].map((r) => (
        <button key={r} type="button" role="radio" aria-checked={value === r} onClick={() => onChange(r)}
          className={`rounded px-3 py-2 text-sm font-semibold transition ${value === r ? 'bg-white text-ink shadow-sm' : 'text-muted hover:text-ink'}`}>
          <span className="block">{t(`iq.region.${r}`)}</span><span className="block text-[11px] font-normal text-muted">{t(`iq.region.${r}.sub`)}</span>
        </button>
      ))}
    </div>
  )
}

/** What a visitor of this nationality needs, in plain words, with documents, time and an illustrative fee. */
export function VisaResult({ nat, region, full = false }) {
  const i = useI18n(); const { t } = i
  const v = visaFor(nat, region)
  if (!v) return null
  return (
    <div className="rounded-lg border border-line bg-white p-5 sm:p-6" aria-live="polite">
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-md bg-ink text-white"><Icon name={KIND_IC[v.kind]} className="size-5" /></span>
        <div>
          <p className="text-xs text-muted">{i.L(v.nation.name)} · {t(`iq.region.${region}`)}</p>
          <h3 className="mt-0.5 text-lg font-bold">{t(`iq.kind.${v.kind}`)}</h3>
          <p className="mt-1 text-sm leading-6 text-ink/75">{t(`iq.kind.${v.kind}.d`)}</p>
        </div>
      </div>
      <dl className="mt-5 grid gap-3 border-t border-line pt-4 text-sm sm:grid-cols-3">
        <div><dt className="text-muted">{t('iq.visa.time')}</dt><dd className="font-semibold">{v.days ? plural(i, 'iq.visa.days', v.days) : t('iq.visa.onArrival')}</dd></div>
        <div><dt className="text-muted">{t('iq.visa.fee')}</dt><dd className="font-semibold">{v.fee ? <Ltr>{i.money(v.fee)}</Ltr> : t('iq.visa.noFee')}</dd></div>
        <div><dt className="text-muted">{t('iq.visa.service')}</dt><dd className="font-semibold"><Ltr>{i.money(v.service)}</Ltr></dd></div>
      </dl>
      {full && (
        <div className="mt-5 border-t border-line pt-4">
          <p className="mb-2 text-sm font-semibold">{t('iq.visa.docs')}</p>
          <ul className="grid gap-2 text-sm sm:grid-cols-2">{v.docs.map((d) => <li key={d} className="flex gap-2"><Icon name="documents" className="mt-0.5 size-4 shrink-0 text-muted" />{t(`iq.doc.${d}`)}</li>)}</ul>
        </div>
      )}
      <p className="mt-4 flex gap-2 rounded-md bg-mist p-3 text-xs leading-5 text-ink/75"><Icon name="info" className="size-4 shrink-0 text-muted" />{t('iq.visa.guidance')}</p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        {!full && <Link to={withQs('/visit/visa', { nat, region })} className="text-sm font-semibold text-brand hover:underline">{t('iq.visa.details')}</Link>}
        <Link to={withQs('/checkout', { type: 'ivisa', nat, region, ad: 1 })} className="btn-primary ms-auto px-5 py-2.5 text-sm">{t('iq.visa.handle')}</Link>
      </div>
    </div>
  )
}

/** Nationality + region picker with the answer below. */
export function VisaChecker({ initial = {}, full = false, onChange }) {
  const i = useI18n(); const { t } = i
  const [nat, setNat] = useState(initial.nat || '')
  const [region, setRegion] = useState(initial.region === 'krg' ? 'krg' : 'fed')
  const set = (n, r) => { setNat(n); setRegion(r); onChange?.({ nat: n, region: r }) }
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1.2fr_1fr]">
        <Combobox label={t('iq.visa.nat')} icon="passport" value={nat} onChange={(v) => set(v, region)} options={nationOptions(i)} placeholder={t('iq.visa.natPh')} />
        <RegionSwitch value={region} onChange={(r) => set(nat, r)} />
      </div>
      {nat ? <VisaResult nat={nat} region={region} full={full} /> : <p className="text-sm text-muted">{t('iq.visa.pick')}</p>}
    </div>
  )
}
