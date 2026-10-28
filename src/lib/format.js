const nf = new Intl.NumberFormat('ar-IQ-u-nu-latn')

export const iqd = (n) => `${nf.format(Math.round(n / 250) * 250)} د.ع`

export const img = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`

export const airlineLogo = (code) => `https://pics.avs.io/200/80/${code}.png`
export const flag = (cc) => `https://flagcdn.com/w80/${cc}.png`

// Deterministic PRNG so the same search always yields the same mock results.
export function seeded(str) {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

export const hm = (mins) => {
  const m = ((mins % 1440) + 1440) % 1440
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}
export const dur = (mins) => `${Math.floor(mins / 60)}س ${mins % 60 ? `${mins % 60}د` : ''}`.trim()

const df = new Intl.DateTimeFormat('ar-IQ-u-nu-latn', { weekday: 'short', day: 'numeric', month: 'long' })
export const dateAr = (iso) => (iso ? df.format(new Date(iso)) : '')

export const addDays = (n, from) => {
  const d = from ? new Date(from) : new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export const bookingRef = (seed) => {
  const r = seeded(seed)
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => abc[Math.floor(r() * abc.length)]).join('')
}
