import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import Icon from './Icon'
import { useI18n } from '../lib/i18n'
import { origin, session } from '../lib/store'
import D from '../data/catalog'

/* The one help entry point: a chat panel that continues on WhatsApp (CRM web chat in production).
   Open it from anywhere with openHelp('context'), e.g. a booking number or the product on screen. */
export default function Help() {
  const { t } = useI18n()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [ctx, setCtx] = useState('')
  const [msgs, setMsgs] = useState([])
  const [quick, setQuick] = useState(true)
  const body = useRef(null)
  const input = useRef(null)

  useEffect(() => {
    const on = (e) => { setCtx(e.detail || ''); setOpen(true) }
    addEventListener('hayat:help', on)
    return () => removeEventListener('hayat:help', on)
  }, [])
  useEffect(() => { if (open) input.current?.focus() }, [open])
  useEffect(() => { body.current?.scrollTo(0, body.current.scrollHeight) }, [msgs])
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    addEventListener('keydown', esc)
    return () => removeEventListener('keydown', esc)
  }, [])

  const say = (text) => {
    setQuick(false)
    setMsgs((m) => [...m, { who: 'out', text }])
    setTimeout(() => setMsgs((m) => [...m, { who: 'in', text: t('help.reply') }]), 700)
  }
  const user = session.user()
  const wa = `https://wa.me/${D.company.whatsapp}?text=${encodeURIComponent(`${t('wa.hi')}${ctx ? `\n${ctx}` : ''}\n${origin()}${pathname}`)}`

  return (
    <div className="print:hidden">
      <button onClick={() => { setCtx(''); setOpen(!open) }} aria-expanded={open} aria-haspopup="dialog"
        className="help-fab fixed end-5 bottom-5 z-[60] flex h-13 items-center gap-2 rounded-full bg-ink px-5 font-semibold text-white shadow-[0_18px_40px_-14px_rgba(11,18,32,.6)] transition hover:bg-brand max-sm:w-13 max-sm:justify-center max-sm:px-0">
        <Icon name={open ? 'close' : 'chat'} className="size-5" /><span className="max-sm:hidden">{t('help.fab')}</span>
      </button>
      {open && (
        <div role="dialog" aria-label={t('help.title')} className="fixed end-5 bottom-22 z-[61] flex max-h-[min(560px,calc(100dvh-120px))] w-[min(380px,calc(100vw-32px))] animate-rise flex-col overflow-hidden rounded-lg border border-line bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div><p className="font-bold">{t('help.title')}</p><p className="text-xs text-muted">{t('help.hours')}</p></div>
            <button onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-md hover:bg-mist" aria-label={t('close')}><Icon name="close" className="size-4" /></button>
          </div>
          <div ref={body} className="grid flex-1 content-start gap-2.5 overflow-y-auto p-4">
            <p className="max-w-[85%] rounded-2xl rounded-ss-sm bg-mist px-4 py-2.5 text-sm">{t('help.hello', { name: user?.name ? ` ${user.name}` : '' })}</p>
            {ctx && <p className="flex items-center gap-1.5 justify-self-start rounded-md bg-amber-50 px-3 py-1.5 text-xs text-amber-800"><Icon name="documents" className="size-3.5" />{ctx}</p>}
            {quick && <div className="flex flex-wrap gap-1.5">{['help.q1', 'help.q2', 'help.q3'].map((k) => <button key={k} onClick={() => say(t(k))} className="rounded-full border border-line px-3 py-1.5 text-xs font-medium hover:border-brand hover:text-brand">{t(k)}</button>)}</div>}
            {msgs.map((m, k) => <p key={k} className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${m.who === 'out' ? 'justify-self-end rounded-se-sm bg-brand text-white' : 'rounded-ss-sm bg-mist'}`}>{m.text}</p>)}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); const v = input.current.value.trim(); if (v) { say(v); input.current.value = '' } }} className="flex gap-2 border-t border-line p-3">
            <input ref={input} aria-label={t('help.ph')} placeholder={t('help.ph')} className="field py-2.5" />
            <button className="grid size-11 shrink-0 place-items-center rounded-md bg-ink text-white hover:bg-brand" aria-label={t('help.send')}><Icon name="send" className="size-4 rtl:-scale-x-100" /></button>
          </form>
          <div className="flex items-center justify-between px-4 pb-3 text-sm">
            <a href={wa} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-semibold text-emerald-700"><Icon name="whatsapp" className="size-4" />{t('help.wa')}</a>
            <a href={`tel:${D.company.phone.replace(/\s/g, '')}`} className="flex items-center gap-1.5 text-muted" dir="ltr"><Icon name="phone" className="size-4" />{D.company.phone}</a>
          </div>
        </div>
      )}
    </div>
  )
}
