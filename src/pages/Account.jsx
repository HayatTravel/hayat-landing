import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { PageHead } from '../components/Layout'
import Icon from '../components/Icon'
import { Ltr } from '../components/ui'
import { LANG_INFO, LANGS_FOR, inDays, useI18n } from '../lib/i18n'
import { openHelp, openSignIn, session, store, useStore } from '../lib/store'
import { Badge, Modal, ModalHead, Next, useToast } from '../components/account/kit'

/* Account: profile (name, verified phone, language, currency), saved travellers (planned feature),
   notification preferences, sign out. */
const NOTIFY = [['wa', 'ac.nt.wa', 'ac.nt.waD'], ['sms', 'ac.nt.sms', 'ac.nt.smsD'], ['email', 'ac.nt.email', 'ac.nt.emailD']]
const NT_DEFAULT = { wa: true, sms: true, email: false }
const travellers = () => store.get('travellers', [])

const F = ({ p, t, name, label, ...rest }) => <div><label className="label" htmlFor={`tv-${name}`}>{t(label)}</label><input id={`tv-${name}`} name={name} defaultValue={p[name] || ''} required className="field" {...rest} /></div>

function TravellerForm({ p = {}, t, onClose, onSave }) {
  const [err, setErr] = useState(false)
  const submit = (e) => {
    e.preventDefault()
    const f = e.currentTarget
    const missing = [...f.querySelectorAll('input[required]')].filter((x) => !x.value.trim())
    if (missing.length) { setErr(true); missing[0].focus(); return }
    const v = (k) => f[k].value.trim()
    onSave({ id: p.id || `t${Date.now().toString(36)}`, first: v('first'), last: v('last'), dob: v('dob'), nat: v('nat'), passport: v('passport').toUpperCase(), exp: v('exp') })
  }
  return (
    <form onSubmit={submit} noValidate className="flex flex-1 flex-col">
      <ModalHead title={p.id ? t('ac.tvEdit') : t('ac.tvAdd')} onClose={onClose} t={t} />
      <p className="mt-1 text-sm text-muted">{t('ac.asPass')}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <F p={p} t={t} name="first" label="ac.first" autoComplete="off" /><F p={p} t={t} name="last" label="ac.last" autoComplete="off" />
        <F p={p} t={t} name="dob" label="ac.dob" type="date" />
        <div><label className="label" htmlFor="tv-nat">{t('ac.nat')}</label><select id="tv-nat" name="nat" defaultValue={p.nat === 'XX' ? 'XX' : 'IQ'} className="field"><option value="IQ">{t('ac.iraqi')}</option><option value="XX">{t('ac.other')}</option></select></div>
        <F p={p} t={t} name="passport" label="ac.pass" dir="ltr" autoCapitalize="characters" autoComplete="off" spellCheck="false" className="field text-start uppercase" />
        <F p={p} t={t} name="exp" label="ac.exp" type="date" />
      </div>
      <p className="mt-4 flex gap-2 rounded-md bg-mist p-3 text-sm text-ink/75"><Icon name="info" className="mt-0.5 size-4 shrink-0 text-brand" />{t('ac.tvNote')} {t('ac.tvDemo')}</p>
      {err && <p role="alert" className="mt-3 text-sm text-red-600">{t('ac.missing')}</p>}
      <div className="sticky bottom-0 -mx-6 -mb-6 mt-auto flex justify-end gap-3 border-t border-line bg-white px-6 py-4">
        <button type="button" onClick={onClose} className="btn-ghost py-2.5">{t('ac.cancel')}</button><button className="btn-primary py-2.5">{t('ac.tvSave')}</button>
      </div>
    </form>
  )
}

function Card({ title, extra, note, children }) {
  return (
    <section className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="flex flex-wrap items-center gap-2 text-lg font-bold">{title}</h2>{extra}</div>
      {note && <p className="mt-0.5 text-sm text-muted">{note}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}

export default function Account() {
  useStore()
  const i = useI18n()
  const { t, date, lang, setLang, cur, setCur } = i
  const go = useNavigate()
  const user = session.user()
  const [editing, setEditing] = useState(false)
  const [nameErr, setNameErr] = useState(false)
  const [sheet, setSheet] = useState(null) // null | 'new' | traveller id
  const [del, setDel] = useState(null)
  const [toast, show] = useToast()

  const head = <PageHead><h1 className="text-3xl font-bold">{t('ac.title')}</h1>{user && <p className="mt-2 text-muted">{t('ac.sub')}</p>}</PageHead>
  if (!user) {
    return <>{head}<div className="container-x py-10"><section className="card max-w-lg p-6 sm:p-8">
      <span className="grid size-12 place-items-center rounded-full bg-brand/10 text-brand"><Icon name="user" className="size-6" /></span>
      <h2 className="mt-4 text-xl font-bold">{t('ac.need')}</h2><p className="mt-1 text-sm text-muted">{t('ac.needD')}</p>
      <button type="button" onClick={() => openSignIn()} className="btn-primary mt-6">{t('tp.in.btn')}</button></section></div></>
  }

  const list = travellers()
  const nt = { ...NT_DEFAULT, ...store.get('notify', {}) }
  const saveName = (e) => {
    e.preventDefault()
    const n = e.currentTarget.name.value.trim()
    if (!n) { setNameErr(true); return }
    session.signIn({ ...user, name: n }); setEditing(false); setNameErr(false); show(t('ac.saved'))
  }
  const saveTraveller = (rec) => {
    const l = travellers(); const k = l.findIndex((x) => x.id === rec.id)
    if (k >= 0) l[k] = rec; else l.push(rec)
    store.set('travellers', l); setSheet(null); show(t('ac.saved'))
  }
  const soon = (d) => d && d < inDays(183)
  const editing1 = sheet && sheet !== 'new' ? list.find((x) => x.id === sheet) : {}

  return (
    <>
      {head}
      <div className="container-x grid items-start gap-6 py-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-6">
          <Card title={t('ac.profile')}>
            <div className="flex items-start gap-4">
              <span aria-hidden="true" className="grid size-14 shrink-0 place-items-center rounded-full bg-ink text-xl font-bold text-white">{user.name.charAt(0)}</span>
              <div className="grid min-w-0 flex-1 gap-1.5">
                {editing ? (
                  <form onSubmit={saveName} noValidate className="grid gap-2">
                    <label className="label mb-0" htmlFor="ac-name">{t('ac.name')}</label>
                    <input id="ac-name" name="name" defaultValue={user.name} autoComplete="name" autoFocus className="field" />
                    {nameErr && <p role="alert" className="text-sm text-red-600">{t('ac.nameErr')}</p>}
                    <div className="flex gap-2"><button className="btn-primary px-4 py-2 text-sm">{t('ac.save')}</button><button type="button" onClick={() => { setEditing(false); setNameErr(false) }} className="btn-ghost px-4 py-2 text-sm">{t('ac.cancel')}</button></div>
                  </form>
                ) : (
                  <div className="flex flex-wrap items-center gap-2"><b className="text-lg">{user.name}</b>
                    <button type="button" onClick={() => setEditing(true)} aria-label={t('ac.editName')} className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-brand hover:bg-mist"><Icon name="edit" className="size-4" />{t('ac.edit')}</button></div>
                )}
                <div className="flex flex-wrap items-center gap-2"><Ltr className="font-medium">{user.phone}</Ltr><Badge tone="ok" icon="check">{t('ac.verified')}</Badge></div>
                <p className="text-xs text-muted">{t('ac.phoneNote')}</p>
              </div>
            </div>
            <hr className="my-5 border-line" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label" htmlFor="ac-lang">{t('ac.lang')}</label>
                <select id="ac-lang" value={lang} onChange={(e) => setLang(e.target.value)} className="field">{LANGS_FOR.in.map((k) => <option key={k} value={k} lang={k} dir={LANG_INFO[k].dir}>{LANG_INFO[k].name}</option>)}</select></div>
              <div><label className="label" htmlFor="ac-cur">{t('ac.cur')}</label>
                <select id="ac-cur" value={cur} onChange={(e) => setCur(e.target.value)} className="field">{[['IQD', 'ac.iqd'], ['USD', 'ac.usd']].map(([c, k]) => <option key={c} value={c}>{c} · {t(k)}</option>)}</select></div>
            </div>
          </Card>

          <Card title={<>{t('ac.tv')}<Badge tone="gold">{t('ac.soon')}</Badge></>} note={t('ac.tvNote')}
            extra={<button type="button" onClick={() => setSheet('new')} className="btn-ghost px-3 py-2 text-sm"><Icon name="plus" className="size-4" />{t('ac.tvAdd')}</button>}>
            {list.length === 0 ? <p className="flex items-center gap-2 rounded-md border border-dashed border-line p-4 text-sm text-muted"><Icon name="users" className="size-5" />{t('ac.tvNone')}</p> : (
              <ul className="grid gap-2">{list.map((p) => {
                const full = `${p.first} ${p.last}`
                return (
                  <li key={p.id} className="flex items-center gap-3 rounded-md border border-line p-3">
                    <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-brand/10 font-bold text-brand">{p.first.charAt(0)}</span>
                    <span className="grid min-w-0 flex-1 gap-0.5 text-sm"><b>{full}</b>
                      <span className="text-xs text-muted">{[p.dob && date(p.dob, { year: true }), p.nat === 'IQ' ? t('ac.iraqi') : t('ac.other'), p.passport && `•••• ${p.passport.slice(-4)}`].filter(Boolean).join(' · ')}</span>
                      {p.exp && <span className="text-xs text-muted">{soon(p.exp) ? <Badge tone="warn">{t('ac.expSoon')}</Badge> : t('ac.expires', { date: date(p.exp, { year: true }) })}</span>}</span>
                    <button type="button" onClick={() => setSheet(p.id)} aria-label={`${t('ac.tvEdit')}: ${full}`} className="grid size-10 place-items-center rounded-md text-ink/70 hover:bg-mist"><Icon name="edit" className="size-4" /></button>
                    <button type="button" onClick={() => setDel(p)} aria-label={`${t('ac.tvDel')}: ${full}`} className="grid size-10 place-items-center rounded-md text-ink/70 hover:bg-mist hover:text-red-700"><Icon name="trash" className="size-4" /></button>
                  </li>
                )
              })}</ul>
            )}
          </Card>

          <Card title={t('ac.nt')} note={t('ac.ntNote')}>
            <div className="grid">{NOTIFY.map(([k, n, d]) => (
              <label key={k} className="flex cursor-pointer items-center gap-3 py-3 [&+&]:border-t [&+&]:border-line">
                <span className="grid flex-1"><b className="text-sm">{t(n)}</b><small className="text-xs text-muted">{t(d)}</small></span>
                <input type="checkbox" role="switch" checked={nt[k]} className="peer sr-only"
                  onChange={(e) => { store.set('notify', { ...nt, [k]: e.target.checked }); show(t('ac.saved')) }} />
                <span aria-hidden="true" className="relative h-6 w-11 shrink-0 rounded-full bg-line transition peer-checked:bg-brand peer-focus-visible:ring-4 peer-focus-visible:ring-brand/30 after:absolute after:start-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5 rtl:peer-checked:after:-translate-x-5" />
              </label>))}</div>
          </Card>
        </div>

        <aside className="grid gap-6 lg:sticky lg:top-24">
          <Card title={t('ac.links')}>
            <ul className="grid">
              {[['/trips', 'ticket', 'tp.title'], ['/help', 'info', 'hp.title']].map(([to, ic, k]) => (
                <li key={to} className="border-line [&+&]:border-t"><Link to={to} className="flex min-h-13 items-center gap-3 rounded-md px-2 font-semibold hover:bg-mist">
                  <span className="grid size-9 place-items-center rounded-full bg-brand/10 text-brand"><Icon name={ic} className="size-4" /></span><span className="flex-1">{t(k)}</span><Next className="size-4 text-muted" /></Link></li>))}
              <li className="border-t border-line"><button type="button" onClick={() => openHelp('')} className="flex min-h-13 w-full items-center gap-3 rounded-md px-2 text-start font-semibold hover:bg-mist">
                <span className="grid size-9 place-items-center rounded-full bg-brand/10 text-brand"><Icon name="chat" className="size-4" /></span><span className="flex-1">{t('hp.chat')}</span></button></li>
            </ul>
          </Card>
          <section className="card p-6">
            <button type="button" onClick={() => { session.signOut(); go('/') }} className="btn-ghost w-full"><Icon name="logout" className="size-4 rtl:-scale-x-100" />{t('ac.out')}</button>
            <p className="mt-2 text-xs text-muted">{t('ac.outNote')}</p>
          </section>
        </aside>
      </div>

      <Modal side open={!!sheet} onClose={() => setSheet(null)} label={sheet === 'new' ? t('ac.tvAdd') : t('ac.tvEdit')}>
        {sheet && <TravellerForm key={sheet} p={editing1 || {}} t={t} onClose={() => setSheet(null)} onSave={saveTraveller} />}
      </Modal>
      <Modal open={!!del} onClose={() => setDel(null)} label={t('ac.tvDel')}>
        {del && <>
          <ModalHead title={t('ac.tvDelQ', { name: `${del.first} ${del.last}` })} onClose={() => setDel(null)} t={t} />
          <p className="mt-2 text-sm text-muted">{t('ac.tvDelD')}</p>
          <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setDel(null)} className="btn-ghost py-2.5">{t('ac.keep')}</button>
            <button type="button" onClick={() => { store.set('travellers', travellers().filter((x) => x.id !== del.id)); setDel(null); show(t('ac.removed')) }} className="btn-primary py-2.5">{t('ac.tvDel')}</button></div>
        </>}
      </Modal>
      {toast}
    </>
  )
}
