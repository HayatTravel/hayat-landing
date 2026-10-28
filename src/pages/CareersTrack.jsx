import { useState } from 'react'
import { useSearchParams } from 'react-router'
import Icon from '../components/Icon'
import { useI18n } from '../lib/i18n'
import { STAGES, applicationStatus, getPosting } from '../lib/providers/hr'
import { Hero, Input } from '../components/company/ui'
import CareersNav from '../components/company/CareersNav'

const fmt = (ms) => { const d = new Date(ms); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }

/** /careers/track?ref — application status by reference and phone. */
export default function CareersTrack() {
  const i = useI18n(); const { t } = i
  const [sp] = useSearchParams()
  const [res, setRes] = useState(null)
  const [err, setErr] = useState('')
  const submit = (e) => {
    e.preventDefault()
    const f = e.currentTarget
    if (!f.ref.value.trim() || !f.phone.value.trim()) { setErr(t('co.missing')); return }
    const s = applicationStatus(f.ref.value, f.phone.value)
    setRes(s); setErr(s ? '' : t('hr.track.notFound'))
  }
  const now = res ? STAGES.indexOf(res.stage) : -1
  const posting = res && getPosting(res.postingId)
  return (
    <>
      <Hero title={t('hr.track.title')} lede={t('hr.track.lede')}><CareersNav /></Hero>
      <div className="container-x grid gap-10 py-12 lg:grid-cols-[1fr_1.2fr]">
        <form onSubmit={submit} noValidate className="card space-y-4 p-6 lg:self-start">
          <Input id="ref" label={t('cp.ref')} required dir="ltr" defaultValue={sp.get('ref') || ''} placeholder="HR-XXXXXX" className="field font-mono uppercase" />
          <Input id="phone" label={t('sign.phone')} required inputMode="tel" dir="ltr" placeholder="+964 770 000 0000" />
          <p className="text-xs text-muted">{t('hr.track.why')}</p>
          {err && <p role="alert" className="text-sm font-medium text-red-600">{err}</p>}
          <button className="btn-primary w-full py-3">{t('hr.track.go')}</button>
        </form>
        <section aria-live="polite">
          {res ? (
            <div className="card p-6">
              <p className="text-sm text-muted"><bdi dir="ltr" className="font-mono font-bold text-ink">{res.reference}</bdi>{posting && ` · ${i.L(posting.title)}`}</p>
              <ol className="mt-6 space-y-0">
                {STAGES.map((s, k) => {
                  const h = res.history.find((x) => x.stage === s)
                  const state = k < now ? 'done' : k === now ? 'now' : 'next'
                  return (
                    <li key={s} className="relative flex gap-4 pb-6 last:pb-0">
                      {k < STAGES.length - 1 && <span className={`absolute start-[13px] top-7 bottom-0 w-0.5 ${k < now ? 'bg-emerald-500' : 'bg-line'}`} />}
                      <span className={`relative grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${state === 'done' ? 'bg-emerald-500 text-white' : state === 'now' ? 'bg-ink text-white' : 'bg-white text-muted ring-1 ring-line'}`}>{state === 'done' ? <Icon name="check" className="size-4" /> : k + 1}</span>
                      <span><b className={state === 'next' ? 'text-muted' : ''}>{t(`hr.stage.${s}`)}</b>
                        <span className="block text-sm text-muted">{h ? i.date(fmt(h.at), { year: true }) : t(`hr.stage.${s}.d`)}</span></span>
                    </li>
                  )
                })}
              </ol>
              <p className="mt-6 rounded-md bg-mist p-3 text-sm text-ink/80">{t(`hr.stage.${res.stage}.now`)}</p>
            </div>
          ) : <p className="text-muted">{t('hr.track.hint')}</p>}
        </section>
      </div>
    </>
  )
}
