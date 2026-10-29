/* SSR smoke: fetch raw HTML per route and language and check the server rendered the page itself, not an empty shell.
   Usage: node scripts/ssr-smoke.mjs [base-url]   (default http://localhost:3000; start the server first) */
const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '')
const day = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10) }
const [d1, d2] = [day(20), day(24)]

// [path, text expected in Arabic, in English, min text length of <main>]: the page's own heading or catalogue content.
// Done and account depend on the mock session in browser storage, so the server renders their signed-out / not-found state.
const ROUTES = [
  ['/', 'الحياة', 'Hayat'],
  ['/flights', 'رحلات', 'Flights'],
  [`/flights/results?from=BGW&to=IST&d1=${d1}&trip=ow&ad=1`, 'إسطنبول', 'Istanbul'],
  ['/hotels', 'إسطنبول', 'Istanbul'],
  [`/hotels/results?city=istanbul&in=${d1}&out=${d2}&rooms=1&ad=2`, 'إسطنبول', 'Istanbul'],
  [`/hotels/h-ist-1?in=${d1}&out=${d2}&rooms=1&ad=2`, 'إسطنبول', 'Istanbul'],
  ['/holidays', 'عطلات', 'Holidays'],
  ['/holidays/istanbul-classic', 'إسطنبول', 'Istanbul'],
  ['/cars', 'سيارة', 'car'],
  ['/visa', 'تأشير', 'Visa'],
  ['/visa/TR', 'تركيا', 'Türkiye'],
  ['/esim', 'تركيا', 'Türkiye'],
  ['/esim/tr', 'تركيا', 'Türkiye'],
  ['/events', 'فعاليات', 'Events'],
  ['/events/ev-1', 'تذاكر', 'ticket'],
  ['/transfers', 'المطار', 'airport'],
  [`/checkout?type=hotel&id=h-ist-1&room=std&in=${d1}&out=${d2}&rooms=1&ad=2`, 'البوسفور', 'Bosphorus'],
  ['/checkout?type=esim&cc=tr&plan=0', 'تركيا', 'Türkiye'],
  ['/done/HYTEST01', 'لم نجد هذا الحجز', 'could not find this booking', 20],
  ['/trips', 'رحلاتي', 'My trips'],
  ['/account', 'سجّل الدخول', 'Sign in', 80],
  ['/help', 'مساعدة', 'help'],
  ['/about', 'الحياة', 'Hayat'],
  ['/about/offices', 'بغداد', 'Baghdad'],
  ['/contact', 'واتساب', 'WhatsApp'],
  ['/business', 'الشركات', 'business'],
  ['/careers', 'وظائف', 'roles'],
  ['/careers/how-we-hire', 'التوظيف', 'hire'],
  ['/guides', 'دليل', 'guide'],
  ['/guides/first-time-istanbul', 'إسطنبول', 'Istanbul'],
  ['/destinations', 'يسافر العراقيون', 'Where Iraqis travel'],
  ['/visit', 'العراق', 'Iraq'],
  ['/flight-status', 'حالة الرحلة', 'Flight status'],
]
const LANGS = { ar: 'rtl', ckb: 'rtl', en: 'ltr' }
const text = (html) => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[#\w]+;/g, ' ').replace(/\s+/g, ' ')

let fail = 0
for (const [path, ar, en, min = 200] of ROUTES) {
  const row = []
  for (const [lang, dir] of Object.entries(LANGS)) {
    const res = await fetch(base + path, { headers: { cookie: `hayat-lang=${lang}` } })
    const html = await res.text()
    const main = text(html.match(/<main[\s\S]*<\/main>/)?.[0] ?? '')
    const h1 = text(html.match(/<h1[\s\S]*?<\/h1>/)?.[0] ?? '').trim()
    const want = { ar, en }[lang]
    const errs = [
      res.status !== 200 && `status ${res.status}`,
      !html.includes(`<html lang="${lang}" dir="${dir}">`) && 'lang/dir',
      !h1 && 'no h1',
      main.length < min && `main only ${main.length} chars`,
      want && !main.toLowerCase().includes(want.toLowerCase()) && `missing "${want}"`,
      lang !== 'en' && !/[؀-ۿ]/.test(h1) && 'h1 not in Arabic script',
      lang === 'en' && /[؀-ۿ]/.test(h1) && 'h1 not in English',
    ].filter(Boolean)
    if (errs.length) fail += 1
    row.push(`${lang} ${errs.length ? `FAIL (${errs.join(', ')})` : 'ok'}`)
  }
  console.log(`${path.split('?')[0].padEnd(34)} ${row.join(' · ')}`)
}
const health = await fetch(`${base}/health`)
console.log(`/health ${health.status}`)
if (health.status !== 200) fail += 1
console.log(fail ? `${fail} failure(s)` : 'all ok')
process.exit(fail ? 1 : 0)
