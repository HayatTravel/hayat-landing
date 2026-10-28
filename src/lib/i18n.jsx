import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { STRINGS } from '../i18n'

/* Languages: ar (default) · ckb (Kurdish Sorani, RTL) · en.
   Strings live in src/i18n/*.js as { key: [ar, en, ku] }. Catalogue texts are { ar, en, ku } objects. */
export const LANGS = [['ar', 'العربية'], ['ckb', 'کوردی'], ['en', 'English']]
const idx = { ar: 0, en: 1, ckb: 2 }
const RATE = 1310 // illustrative IQD per USD
const nf = new Intl.NumberFormat('en-US')

const read = (k, d) => { try { return localStorage.getItem(k) ?? d } catch { return d } }
const write = (k, v) => { try { localStorage.setItem(k, v) } catch { /* blocked */ } }

const MONTHS = {
  ar: ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  ckb: ['کانوونی دووەم', 'شوبات', 'ئازار', 'نیسان', 'ئایار', 'حوزەیران', 'تەممووز', 'ئاب', 'ئەیلوول', 'تشرینی یەکەم', 'تشرینی دووەم', 'کانوونی یەکەم'],
}
const WEEKDAYS = {
  ar: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  ckb: ['یەکشەممە', 'دووشەممە', 'سێشەممە', 'چوارشەممە', 'پێنجشەممە', 'هەینی', 'شەممە'],
}

const Ctx = createContext(null)

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const q = new URLSearchParams(location.search).get('lang')
    const l = q || read('hayat-lang', 'ar')
    return l === 'en' || l === 'ckb' ? l : 'ar'
  })
  const [cur, setCurState] = useState(() => (read('hayat-cur', 'IQD') === 'USD' ? 'USD' : 'IQD'))

  useEffect(() => {
    const r = document.documentElement
    r.lang = lang
    r.dir = lang === 'en' ? 'ltr' : 'rtl'
    document.title = { ar: 'الحياة للسفر والسياحة', en: 'Hayat Travel & Tourism', ckb: 'حەیات بۆ گەشت و گوزار' }[lang]
  }, [lang])

  const setLang = useCallback((l) => { write('hayat-lang', l); setLangState(l) }, [])
  const setCur = useCallback((c) => { write('hayat-cur', c); setCurState(c) }, [])

  const value = useMemo(() => {
    const i = idx[lang]
    /** UI string; {name} placeholders. Missing Kurdish falls back to Arabic. */
    const t = (key, vars) => {
      const row = STRINGS[key]
      let s = row ? (row[i] ?? row[0]) : key
      if (vars) s = s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''))
      return s
    }
    /** Pick a catalogue text { ar, en, ku }. */
    const L = (o) => (o && typeof o === 'object' ? (lang === 'ckb' ? o.ku ?? o.ar : o[lang] ?? o.ar) : o ?? '')
    const unit = lang === 'en' ? 'IQD' : 'د.ع'
    const iqd = (usd) => Math.round((usd * RATE) / 1000) * 1000
    /** Amount in the chosen currency; source prices are USD. Returns a string (wrap in <bdi dir="ltr">). */
    const money = (usd) => (usd == null ? t('price.ask') : cur === 'USD' ? `$${nf.format(Math.round(usd))}` : `${nf.format(iqd(usd))} ${unit}`)
    const parse = (s) => { if (s instanceof Date) return s; const [y, m, d] = String(s).split('-').map(Number); return new Date(y, (m || 1) - 1, d || 1) }
    const date = (s, { weekday = false, year = false } = {}) => {
      const d = parse(s)
      return [weekday ? WEEKDAYS[lang][d.getDay()] : '', d.getDate(), MONTHS[lang][d.getMonth()], year ? d.getFullYear() : ''].filter((x) => x !== '').join(' ')
    }
    const dur = (mins) => (lang === 'en' ? `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m` : `${Math.floor(mins / 60)}${t('u.h')} ${mins % 60 ? `${mins % 60}${t('u.m')}` : ''}`.trim())
    return { lang, setLang, cur, setCur, t, L, money, iqd, date, dur, monthName: (m) => MONTHS[lang][m], rtl: lang !== 'en', num: (n) => nf.format(n) }
  }, [lang, cur, setLang, setCur])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useI18n = () => useContext(Ctx)

/* date helpers that need no language */
export const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const inDays = (n) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + n); return iso(d) }
export const addDaysIso = (s, n) => { const [y, m, d] = s.split('-').map(Number); const x = new Date(y, m - 1, d + n); return iso(x) }
export const nightsBetween = (a, b) => Math.max(1, Math.round((new Date(b) - new Date(a)) / 864e5))
