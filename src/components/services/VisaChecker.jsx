import { useState } from 'react'
import { Link } from 'react-router'
import Combobox from '../Combobox'
import { Ltr } from '../ui'
import D from '../../data/catalog'
import { useI18n } from '../../lib/i18n'
import { pl, procTime, qs, visa } from './data'
import { Arrow, Field, KindBadge, Note, control } from './ui'

export const visaOptions = (i) => D.visas.map((v) => ({ value: v.id, title: i.L(v.country), sub: i.t(`vi.kind.${v.kind}`) }))

/** Result for one destination: kind, time, fee, documents and a link to the details page. */
export function VisaResult({ v, nat = 'IQ' }) {
  const i = useI18n(); const { t, L, money } = i
  if (!v) return null
  const to = `/visa/${v.id}${qs({ nat: nat === 'IQ' ? '' : nat })}`
  const free = v.kind === 'free'
  return (
    <div aria-live="polite" className="animate-fade rounded-lg border border-line bg-mist p-5">
      <div className="flex flex-wrap items-center gap-3"><h3 className="text-lg font-bold">{L(v.country)}</h3>{nat === 'IQ' && <KindBadge kind={v.kind} />}</div>
      {nat !== 'IQ' ? <Note className="mt-3 bg-white">{t('vi.otherNat')}</Note> : (
        <>
          <p className="mt-2 text-sm text-ink/80">{t(`vi.kd.${v.kind}`)}</p>
          {!free && (
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div><dt className="text-xs text-muted">{t('vi.time')}</dt><dd className="font-bold">{procTime(i, v)}</dd></div>
              <div><dt className="text-xs text-muted">{t('vi.fee')}</dt><dd className="font-bold"><Ltr>{money(v.fee)}</Ltr> <span className="text-xs font-normal text-muted">{t('vi.perTrav')}</span></dd></div>
              <div><dt className="text-xs text-muted">{t('vi.docsLabel')}</dt><dd className="font-bold">{pl(i, v.docs.length, 'vi.dc')}</dd></div>
            </dl>
          )}
        </>
      )}
      <Link to={to} className={`${free || nat !== 'IQ' ? 'btn-ghost' : 'btn-primary'} mt-4 px-5 py-2.5 text-sm`}>{free && nat === 'IQ' ? t('vi.whatCarry') : t('vi.details')}<Arrow /></Link>
    </div>
  )
}

/** Destination (+ nationality) picker with a live result. */
export default function VisaChecker({ withNat = true, title, sub }) {
  const i = useI18n(); const { t } = i
  const [dest, setDest] = useState('TR')
  const [nat, setNat] = useState('IQ')
  return (
    <div className="card grid gap-6 p-5 sm:p-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
      <div className="space-y-3">
        {title && <h2 className="text-xl font-bold">{title}</h2>}
        {sub && <p className="text-sm text-muted">{sub}</p>}
        <Combobox label={t('vi.dest')} icon="globe" value={dest} onChange={setDest} options={visaOptions(i)} placeholder={t('sv.type')} />
        {withNat ? (
          <Field label={t('vi.nat')} icon="passport">
            <select className={control} value={nat} onChange={(e) => setNat(e.target.value)}>
              <option value="IQ">{t('vi.natIQ')}</option><option value="XX">{t('vi.natXX')}</option>
            </select>
          </Field>
        ) : <p className="text-xs text-muted">{t('vi.ofIraqi')}</p>}
      </div>
      <VisaResult v={visa(dest)} nat={nat} />
    </div>
  )
}
