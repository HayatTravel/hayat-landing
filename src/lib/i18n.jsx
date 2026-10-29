import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { EXTRA, STRINGS, loadExtra } from '../i18n'
import { setCookie } from './store'

/* Languages. Base: ar (default) · ckb (Kurdish Sorani) · en — every string has these three ([ar, en, ku]).
   International (offered to visitors coming to Iraq): fa · tr · fr · de — strings in src/i18n/extra/<lang>.js
   ({ key: text }); anything missing falls back to English. Catalogue texts are { ar, en, ku, fa?, tr?, fr?, de? }.
   To add a language: add it here and drop src/i18n/extra/<code>.js. */
export const LANG_INFO = {
  ar: { name: 'العربية', dir: 'rtl', locale: 'ar-IQ-u-nu-latn', title: 'الحياة للسفر والسياحة' },
  ckb: { name: 'کوردی', dir: 'rtl', locale: 'ckb-IQ-u-nu-latn', title: 'حەیات بۆ گەشت و گوزار' },
  en: { name: 'English', dir: 'ltr', locale: 'en-GB', title: 'Hayat Travel & Tourism' },
  fa: { name: 'فارسی', dir: 'rtl', locale: 'fa-IR-u-ca-gregory-nu-latn', title: 'الحیاة برای سفر و گردشگری' },
  tr: { name: 'Türkçe', dir: 'ltr', locale: 'tr-TR', title: 'Hayat Seyahat ve Turizm' },
  fr: { name: 'Français', dir: 'ltr', locale: 'fr-FR', title: 'Hayat Voyages et Tourisme' },
  de: { name: 'Deutsch', dir: 'ltr', locale: 'de-DE', title: 'Hayat Reisen & Tourismus' },
}
/** Languages offered per audience: travelling from Iraq vs visiting Iraq. */
export const LANGS_FOR = { out: ['ar', 'ckb', 'en'], in: ['en', 'ar', 'ckb', 'fa', 'tr', 'fr', 'de'] }
export const LANGS = LANGS_FOR.out.map((k) => [k, LANG_INFO[k].name])
const idx = { ar: 0, en: 1, ckb: 2 }
const RATE = 1310 // illustrative IQD per USD
const nf = new Intl.NumberFormat('en-US')


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

/** `lang` and `cur` come from the root loader (query or cookie); the server and the first client render agree. */
export function I18nProvider({ children, lang: lang0, cur: cur0 }) {
  const [lang, setLangState] = useState(lang0)
  const [cur, setCurState] = useState(cur0)
  // visitor languages load on demand; switch only once their strings are here, so English never flashes first
  const setLang = useCallback((l) => { setCookie('hayat-lang', l); loadExtra(l).then(() => setLangState(l)) }, [])
  const setCur = useCallback((c) => { setCookie('hayat-cur', c); setCurState(c) }, [])

  const value = useMemo(() => {
    const i = idx[lang]
    const base = i != null
    /** UI string; {name} placeholders. Missing Kurdish falls back to Arabic; international languages fall back to English. */
    const t = (key, vars) => {
      const row = STRINGS[key]
      let s = base ? (row ? (row[i] ?? row[0]) : key) : (EXTRA[lang]?.[key] ?? (row ? row[1] : key))
      if (vars) s = s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''))
      return s
    }
    /** Pick a catalogue text { ar, en, ku }. */
    const L = (o) => (o && typeof o === 'object' ? (lang === 'ckb' ? o.ku ?? o.ar : base ? o[lang] ?? o.ar : o[lang] ?? o.en ?? o.ar) : o ?? '')
    const unit = lang === 'ar' || lang === 'ckb' ? 'د.ع' : 'IQD'
    const iqd = (usd) => Math.round((usd * RATE) / 1000) * 1000
    /** Amount in the chosen currency; source prices are USD. Returns a string (wrap in <bdi dir="ltr">). */
    const money = (usd) => (usd == null ? t('price.ask') : cur === 'USD' ? `$${nf.format(Math.round(usd))}` : `${nf.format(iqd(usd))} ${unit}`)
    const parse = (s) => { if (s instanceof Date) return s; const [y, m, d] = String(s).split('-').map(Number); return new Date(y, (m || 1) - 1, d || 1) }
    const date = (s, { weekday = false, year = false } = {}) => {
      const d = parse(s)
      if (!base) return new Intl.DateTimeFormat(LANG_INFO[lang].locale, { day: 'numeric', month: 'short', ...(weekday ? { weekday: 'short' } : {}), ...(year ? { year: 'numeric' } : {}) }).format(d)
      return [weekday ? WEEKDAYS[lang][d.getDay()] : '', d.getDate(), MONTHS[lang][d.getMonth()], year ? d.getFullYear() : ''].filter((x) => x !== '').join(' ')
    }
    const dur = (mins) => (lang !== 'ar' && lang !== 'ckb' ? `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}m` : `${Math.floor(mins / 60)}${t('u.h')} ${mins % 60 ? `${mins % 60}${t('u.m')}` : ''}`.trim())
    return { lang, setLang, cur, setCur, t, L, money, iqd, date, dur, monthName: (m) => (base ? MONTHS[lang][m] : new Intl.DateTimeFormat(LANG_INFO[lang].locale, { month: 'long' }).format(new Date(2026, m, 1))), rtl: LANG_INFO[lang].dir === 'rtl', num: (n) => nf.format(n) }
  }, [lang, cur, setLang, setCur])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useI18n = () => useContext(Ctx)

/* date helpers that need no language */
export const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const inDays = (n) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + n); return iso(d) }
export const addDaysIso = (s, n) => { const [y, m, d] = s.split('-').map(Number); const x = new Date(y, m - 1, d + n); return iso(x) }
export const nightsBetween = (a, b) => Math.max(1, Math.round((new Date(b) - new Date(a)) / 864e5))
