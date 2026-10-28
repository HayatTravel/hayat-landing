import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { PageHead } from '../components/Layout'
import Icon from '../components/Icon'
import { Ltr, Stepper } from '../components/ui'
import { useI18n } from '../lib/i18n'
import { buildOrder } from '../lib/products'
import { newRef, openHelp, session, trips, useStore } from '../lib/store'
import D, { media } from '../data/catalog'

/* Step 2 of 2 for every product: travellers, extras, documents, contact and payment on one page,
   with a summary that stays in view. The product's order() (src/orders/*) describes what is being bought. */
export const bookingSteps = (t) => [t('steps.choose'), t('steps.pay'), t('steps.done')]
/** How many times an extra is charged: its own count, else every traveller for per-traveller extras. */
export const qtyOf = (x, n) => (x.per === 'traveller' ? x.count ?? n : 1)
const imgSrc = (img) => (!img ? null : img.startsWith('http') ? img : media(img))

export function OrderSummary({ o, picked = new Set(), total }) {
  const i = useI18n()
  const n = o.travellers?.count || 1
  const lines = [
    ...o.price.map((p) => [p.label, i.money(p.usd)]),
    ...(o.extras || []).filter((x) => picked.has(x.id)).map((x) => [qtyOf(x, n) > 1 ? `${x.label} × ${qtyOf(x, n)}` : x.label, x.usd ? i.money(x.usd * qtyOf(x, n)) : i.t('co.free')]),
  ]
  return (
    <div className="card overflow-hidden">
      {imgSrc(o.img) && <img src={imgSrc(o.img)} alt="" className="h-36 w-full object-cover" />}
      <div className="p-6">
        <p className="text-xs text-muted">{i.t('co.summary')}</p>
        <h3 className="mt-1 text-lg font-bold">{o.title}</h3>
        {o.sub && <p className="text-sm text-muted">{o.sub}</p>}
        {o.facts?.length > 0 && <dl className="mt-5 space-y-2.5 border-t border-line pt-4 text-sm">{o.facts.map(([k, v]) => <div key={k} className="flex justify-between gap-4"><dt className="text-muted">{k}</dt><dd className="text-end font-medium"><bdi>{v}</bdi></dd></div>)}</dl>}
        <dl className="mt-4 space-y-2.5 border-t border-line pt-4 text-sm">{lines.map(([k, v]) => <div key={k} className="flex justify-between gap-4"><dt className="text-muted">{k}</dt><dd className="text-end font-medium"><Ltr>{v}</Ltr></dd></div>)}</dl>
        <div className="mt-5 flex items-end justify-between border-t border-dashed border-line pt-4"><span className="text-muted">{i.t('co.total')}</span><span className="text-2xl font-bold"><Ltr>{i.money(total)}</Ltr></span></div>
        {o.terms && <p className="mt-4 text-xs leading-6 text-muted"><b className="text-ink">{i.t('co.cancel')}:</b> {o.terms}</p>}
      </div>
    </div>
  )
}

function Section({ n, title, note, children }) {
  return (
    <section className="card p-6">
      <h2 className="flex items-center gap-3 text-lg font-bold"><span className="grid size-7 place-items-center rounded-full bg-ink text-sm text-white">{n}</span>{title}</h2>
      {note && <p className="mt-1 text-sm text-muted">{note}</p>}
      <div className="mt-5">{children}</div>
    </section>
  )
}

/* Design mockup: every field starts with sample details so a test booking goes through in one click. */
const SAMPLE = [['Ali', 'Hassan', '1988-04-12'], ['Sara', 'Hassan', '1991-09-03'], ['Omar', 'Hassan', '2015-02-20'], ['Noor', 'Hassan', '2018-07-11'], ['Zaid', 'Kareem', '1985-12-01'], ['Huda', 'Kareem', '1987-05-26'], ['Yusuf', 'Kareem', '2012-10-15'], ['Maryam', 'Kareem', '2024-03-08'], ['Ahmed', 'Jabbar', '1979-01-30']]
const sample = (i) => SAMPLE[i % SAMPLE.length]

function TravellerFields({ i, fields, t }) {
  const [first, last, dob] = sample(i)
  const def = { first, last, dob, pass: `A${String(31045872 + i * 1117).padStart(8, '0')}`, exp: '2031-06-30' }
  const F = ({ id, label, ...p }) => <div><label className="label" htmlFor={`${id}-${i}`}>{label}</label><input id={`${id}-${i}`} name={`${id}-${i}`} className="field" required defaultValue={def[id]} {...p} /></div>
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.includes('name') && <><F id="first" label={t('co.first')} autoComplete={i ? 'off' : 'given-name'} /><F id="last" label={t('co.last')} autoComplete={i ? 'off' : 'family-name'} /></>}
      {fields.includes('dob') && <F id="dob" label={t('co.dob')} type="date" />}
      {fields.includes('nationality') && <div><label className="label" htmlFor={`nat-${i}`}>{t('co.nat')}</label><select id={`nat-${i}`} className="field"><option>{t('co.iraqi')}</option><option>{t('co.other')}</option></select></div>}
      {fields.includes('passport') && <><F id="pass" label={t('co.pass')} dir="ltr" className="field text-start uppercase" /><F id="exp" label={t('co.exp')} type="date" /></>}
    </div>
  )
}

export default function Checkout() {
  useStore()
  const i = useI18n(); const { t } = i
  const [sp] = useSearchParams()
  const q = Object.fromEntries(sp)
  const go = useNavigate()
  const o = useMemo(() => buildOrder(q, i), [sp.toString(), i.lang, i.cur]) // eslint-disable-line react-hooks/exhaustive-deps
  const [picked, setPicked] = useState(() => new Set((o?.extras || []).filter((x) => x.checked || x.required).map((x) => x.id)))
  const [method, setMethod] = useState(D.payments[0].id)
  const [uploaded, setUploaded] = useState(new Set())
  const [err, setErr] = useState('')
  const [paying, setPaying] = useState(false)
  const user = session.user()

  if (!o) {
    return (
      <>
        <PageHead><h1 className="text-3xl font-bold">{t('co.invalid')}</h1><p className="mt-2 text-muted">{t('co.invalidD')}</p></PageHead>
        <div className="container-x py-16 text-center"><Link to="/" className="btn-primary">{t('nf.home')}</Link></div>
      </>
    )
  }

  const n = o.travellers?.count || 1
  const total = o.price.reduce((a, p) => a + p.usd, 0) + (o.extras || []).filter((x) => picked.has(x.id)).reduce((a, x) => a + x.usd * qtyOf(x, n), 0)
  const office = method === 'office'
  const holdUntil = new Date(Date.now() + Math.min(o.hold || 60, 180) * 60000)
  const hhmm = `${String(holdUntil.getHours()).padStart(2, '0')}:${String(holdUntil.getMinutes()).padStart(2, '0')}`
  const toggle = (id) => setPicked((s) => { const x = new Set(s); x.has(id) ? x.delete(id) : x.add(id); return x })
  let step = 0

  const submit = (e) => {
    e.preventDefault()
    const f = e.currentTarget
    const missing = [...f.querySelectorAll('input[required]')].filter((x) => !x.value.trim())
    if (missing.length) { setErr(t('co.missing')); missing[0].focus(); return }
    if (!f.agree.checked) { setErr(t('co.agreeErr')); f.agree.focus(); return }
    setErr('')
    const travellers = Array.from({ length: o.travellers ? n : 0 }, (_, k) => `${f[`first-${k}`]?.value || ''} ${f[`last-${k}`]?.value || ''}`.trim())
    const phone = `+964 ${f.phone.value.trim()}`
    const b = {
      ref: newRef(), type: q.type, q, title: o.title, sub: o.sub || '', img: o.img, facts: o.facts || [], total, extras: [...picked],
      travellers, phone, method, status: office ? 'pending' : 'paid', docs: o.docs || [], created: Date.now(), payBy: office ? holdUntil.getTime() : null, hold: o.hold || null,
      date: q.d1 || q.in || q.dep || q.date || q.pick || null,
    }
    const finish = () => {
      trips.save(b)
      if (!session.user()) session.signIn({ name: travellers[0] || t('sign.guest'), phone })
      go(`/done/${b.ref}`)
    }
    if (office) return finish()
    setPaying(true)
    setTimeout(finish, 1300)
  }

  const pm = D.payments.find((p) => p.id === method)

  return (
    <>
      <PageHead>
        <Link to={o.back || '/'} className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-white"><Icon name="arrow" className="size-4 ltr:-scale-x-100" /> {t('co.change')}</Link>
        <Stepper steps={bookingSteps(t)} current={1} />
        <h1 className="mt-6 text-3xl font-bold">{t('co.title')}</h1>
        {o.hold && <p className="mt-3 inline-flex items-center gap-2 rounded-md bg-amber-400/15 px-3 py-1.5 text-sm text-amber-200"><Icon name="clock" className="size-4" />{t('co.hold', { n: o.hold })}</p>}
      </PageHead>

      <form onSubmit={submit} noValidate className="container-x grid gap-8 py-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <p className="flex items-center gap-2 rounded-md bg-sky/20 px-4 py-3 text-sm text-ink"><Icon name="info" className="size-4 shrink-0 text-brand" />{t('co.sample')}</p>
          {o.travellers && (
            <Section n={++step} title={t('co.who')} note={o.travellers.note || t('co.whoNote')}>
              <div className="space-y-6">
                {Array.from({ length: n }, (_, k) => (
                  <fieldset key={k} className={k ? 'border-t border-line pt-6' : ''}>
                    <legend className="mb-3 text-sm font-semibold">{t('co.trav', { n: k + 1 })} {k === 0 && <span className="font-normal text-muted">· {t('co.lead')}</span>}</legend>
                    <TravellerFields i={k} fields={o.travellers.fields} t={t} />
                  </fieldset>
                ))}
              </div>
            </Section>
          )}

          {o.extras?.length > 0 && (
            <Section n={++step} title={t('co.extras')} note={t('co.extrasNote')}>
              <div className="grid gap-3">
                {o.extras.map((x) => (
                  <label key={x.id} className={`flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition ${picked.has(x.id) ? 'border-brand bg-brand/5' : 'border-line hover:border-brand/40'}`}>
                    <input type="checkbox" checked={x.required || picked.has(x.id)} disabled={x.required} onChange={() => toggle(x.id)} className="mt-1 size-4 accent-[var(--color-brand)]" />
                    <span className="flex-1"><span className="block font-semibold">{x.label}</span>{x.sub && <span className="text-sm text-muted">{x.sub}</span>}</span>
                    <span className="text-end text-sm font-semibold">{x.usd ? <><Ltr>{i.money(x.usd)}</Ltr>{x.per === 'traveller' && <span className="block text-xs font-normal text-muted">{t('co.per.traveller')}</span>}</> : t('co.free')}</span>
                  </label>
                ))}
              </div>
            </Section>
          )}

          {o.uploads?.length > 0 && (
            <Section n={++step} title={t('co.docs')} note={t('co.docsNote')}>
              <div className="grid gap-2">
                {o.uploads.map((d) => (
                  <div key={d.id} className={`flex items-center gap-3 rounded-lg border border-dashed p-3 ${uploaded.has(d.id) ? 'border-emerald-500 bg-emerald-50' : 'border-line bg-mist'}`}>
                    <Icon name="documents" className="size-5 text-muted" /><span className="flex-1 text-sm">{d.label}</span>
                    {uploaded.has(d.id)
                      ? <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700"><Icon name="check" className="size-4" />{t('co.uploaded')}</span>
                      : <button type="button" onClick={() => setUploaded((s) => new Set(s).add(d.id))} className="btn-ghost px-3 py-1.5 text-sm"><Icon name="camera" className="size-4" />{t('co.upload')}</button>}
                  </div>
                ))}
              </div>
            </Section>
          )}

          <Section n={++step} title={t('co.contact')} note={t('co.contactNote')}>
            {user && <p className="mb-4 flex items-center gap-2 rounded-md bg-mist p-3 text-sm"><Icon name="user" className="size-4" />{t('co.signed', { name: user.name })}</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label" htmlFor="phone">{t('sign.phone')}</label>
                <div className="flex items-center rounded-md border border-line bg-white focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10" dir="ltr">
                  <span className="border-e border-line px-3 text-sm text-muted">+964</span>
                  <input id="phone" name="phone" required inputMode="tel" defaultValue={user?.phone?.replace('+964 ', '') || '770 123 4567'} placeholder="770 000 0000" className="w-full bg-transparent px-3 py-3 outline-none" />
                </div></div>
              <div><label className="label" htmlFor="email">{t('co.email')}</label><input id="email" type="email" dir="ltr" defaultValue="ali.hassan@example.com" className="field text-start" /></div>
            </div>
          </Section>

          <Section n={++step} title={t('co.pay')} note={t('co.payNote')}>
            <div className="grid gap-3 sm:grid-cols-2">
              {D.payments.map((p) => (
                <label key={p.id} className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition ${method === p.id ? 'border-brand bg-brand/5' : 'border-line hover:border-brand/40'}`}>
                  <input type="radio" name="pm" value={p.id} checked={method === p.id} onChange={() => setMethod(p.id)} className="sr-only" />
                  <span className="grid h-9 w-14 shrink-0 place-items-center rounded-md text-[11px] font-black tracking-wide text-white" style={{ background: p.color }}>{p.mark}</span>
                  <span className="flex-1"><span className="block font-semibold">{i.L(p.name)}</span><span className="text-xs text-muted">{i.L(p.note)}</span></span>
                  <span className={`grid size-5 place-items-center rounded-full ring-2 ${method === p.id ? 'ring-brand' : 'ring-line'}`}>{method === p.id && <span className="size-2.5 rounded-full bg-brand" />}</span>
                </label>
              ))}
            </div>
            {office && <p className="mt-4 flex items-start gap-2 rounded-md bg-amber-50 p-3 text-sm text-amber-800"><Icon name="clock" className="mt-0.5 size-4 shrink-0" />{t('co.officeNote', { time: hhmm })}</p>}
            <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm"><input type="checkbox" name="agree" defaultChecked className="size-4 accent-[var(--color-brand)]" />{t('co.agree')}</label>
            {err && <p role="alert" className="mt-3 text-sm font-medium text-red-600">{err}</p>}
          </Section>
        </div>

        <div className="co-bar fixed inset-x-0 bottom-0 z-[55] flex items-center justify-between gap-3 border-t border-line bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <div><p className="text-xs text-muted">{t('co.total')}</p><p className="text-lg font-bold"><Ltr>{i.money(total)}</Ltr></p></div>
          <button disabled={paying} className="btn-primary px-6 py-3 text-sm">{office ? t('co.holdBtn') : t('co.payBtn', { amount: '' }).trim()}</button>
        </div>
        <aside className="space-y-4 pb-20 lg:sticky lg:top-24 lg:self-start lg:pb-0">
          <OrderSummary o={o} picked={picked} total={total} />
          <button disabled={paying} className="btn-primary w-full py-4 text-base">
            {paying ? <><span className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />{t('co.redirect', { name: i.L(pm.name) })}</> : office ? t('co.holdBtn') : t('co.payBtn', { amount: i.money(total) })}
          </button>
          <p className="text-center text-xs text-muted">{t('co.mock')}</p>
          <button type="button" onClick={() => openHelp(o.title)} className="mx-auto flex items-center gap-2 text-sm font-medium text-brand"><Icon name="chat" className="size-4" />{t('help.line')}</button>
        </aside>
      </form>
    </>
  )
}
