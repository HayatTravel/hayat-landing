/* Airport transfer form: used as the search tab and on /transfers. Submitting shows a short review with the price;
   Continue goes straight to the shared checkout. */
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import Combobox from '../Combobox'
import { Ltr } from '../ui'
import D from '../../data/catalog'
import { inDays, useI18n } from '../../lib/i18n'
import { IRAQ, TIMES, pl, qs, trFacts, trParams, trPrice, trState } from './data'
import { Field, Note, Seg, Submit, control } from './ui'

export default function TransferForm({ initial = {} }) {
  const i = useI18n(); const { t, L, money } = i
  const go = useNavigate()
  const { pathname } = useLocation()
  const [s, setS] = useState(() => trState(initial, true))
  const [review, setReview] = useState(false)
  const set = (k) => (v) => { setS((x) => ({ ...x, [k]: v })); setReview(false) }
  const ev = (k) => (e) => set(k)(k === 'n' ? +e.target.value : e.target.value)
  const opt = (a) => ({ value: a.code, code: a.code, title: L(a.city), sub: L(a.country) })
  const options = [...D.airports.filter((a) => !IRAQ.includes(a.code)), ...D.airports.filter((a) => IRAQ.includes(a.code))].map(opt)

  return (
    <form onSubmit={(e) => { e.preventDefault(); setReview(true) }} className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Seg label={t('tr.dir')} value={s.dir} onChange={set('dir')} options={[{ value: 'arr', label: t('tr.arr') }, { value: 'dep', label: t('tr.dep') }]} />
        <Seg label={t('tr.vehicle')} value={s.v} onChange={set('v')} options={['sic', 'vip'].map((v) => ({ value: v, label: L(D.transfers[v].name) }))} />
      </div>
      <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_0.8fr_0.9fr_auto]">
        <Combobox label={t('tr.airport')} icon="plane" value={s.ap} onChange={set('ap')} options={options} placeholder={t('sv.type')} />
        <Field label={t('tr.date')} icon="calendar"><input type="date" className={control} value={s.date} min={inDays(0)} onChange={(e) => e.target.value && set('date')(e.target.value)} required /></Field>
        <Field label={t('tr.time')} icon="clock"><select className={control} value={s.time} onChange={ev('time')}>{TIMES.map((x) => <option key={x} value={x}>{x}</option>)}</select></Field>
        <Field label={t('tr.pax')} icon="users"><select className={control} value={s.n} onChange={ev('n')}>{[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{pl(i, n, 'tr.p')}</option>)}</select></Field>
        <Submit>{t('tr.see')}</Submit>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
        <span>{t(s.dir === 'arr' ? 'tr.noteArr' : 'tr.noteDep')}</span>
        {pathname !== '/transfers' && <Link to="/transfers" className="font-semibold text-brand-600 hover:text-brand">{t('tr.compare')}</Link>}
      </div>

      {review && (
        <div aria-live="polite" className="animate-fade rounded-lg border border-line bg-mist p-5">
          <h3 className="font-bold">{t('tr.review')}</h3>
          <dl className="mt-3 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            {trFacts(i, s).map(([k, v]) => <div key={k} className="flex justify-between gap-4"><dt className="text-muted">{k}</dt><dd className="text-end font-medium"><bdi>{v}</bdi></dd></div>)}
          </dl>
          <Note className="mt-4 bg-white">{t('tr.terms')}</Note>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
            <span className="leading-tight"><b className="text-2xl"><Ltr>{money(trPrice(s.v, s.n))}</Ltr></b>
              <span className="block text-xs text-muted">{pl(i, s.n, 'tr.p')} · {t(s.v === 'sic' ? 'tr.perPerson' : 'tr.perCar')}</span></span>
            <button type="button" className="btn-primary px-8" onClick={() => go(`/checkout${qs({ type: 'transfer', ...trParams(s) })}`)}>{t('tr.continue')}</button>
          </div>
        </div>
      )}
    </form>
  )
}
