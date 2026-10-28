/* Design mockup only: fill the empty fields of request forms with sample details so the owner can test
   every form in one click (contact, feedback, careers, business). Checkout has its own sample details.
   Remove this file (and its call in Layout) for production. */
const PAGES = ['/contact', '/feedback', '/careers', '/business']
const SKIP = /ref|code|booking|search|track|reference/i
const iso = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10) }

function setValue(el, v) {
  const proto = Object.getPrototypeOf(el)
  Object.getOwnPropertyDescriptor(proto, 'value')?.set?.call(el, v)
  el.dispatchEvent(new Event('input', { bubbles: true }))
  el.dispatchEvent(new Event('change', { bubbles: true }))
}

function sampleFor(el) {
  const key = `${el.name} ${el.id} ${el.getAttribute('autocomplete') || ''} ${el.labels?.[0]?.textContent || ''}`.toLowerCase()
  if (el.type === 'email') return 'ali.hassan@example.com'
  if (el.type === 'tel' || /phone|tel|هاتف|مۆبایل/.test(key)) return '770 123 4567'
  if (el.type === 'number') return el.min && Number(el.min) > 1 ? el.min : '2'
  if (el.type === 'date') return iso(14)
  if (el.type === 'time') return '10:00'
  if (el.tagName === 'TEXTAREA') return 'Sample message to test the form (design mockup).'
  if (/company|agency|organi|org|شركة|وكالة|جهة/.test(key)) return 'Hayat Demo Company'
  if (/licen|ترخيص/.test(key)) return 'IQ-12345'
  if (/city|مدينة/.test(key)) return 'Baghdad'
  if (/people|travell|employees|عدد/.test(key)) return '10'
  return 'Ali Hassan'
}

/** Fill empty fields of forms inside <main> on the request pages. Safe to call repeatedly. */
export function demoFill(pathname) {
  if (!PAGES.some((p) => pathname.startsWith(p))) return
  document.querySelectorAll('main form').forEach((form) => {
    form.querySelectorAll('input, textarea, select').forEach((el) => {
      if (el.disabled || el.readOnly || el.type === 'hidden' || el.type === 'radio' || el.type === 'submit') return
      if (SKIP.test(`${el.name} ${el.id}`)) return
      if (el.type === 'file') { el.required = false; return }
      if (el.type === 'checkbox') { if (el.required && !el.checked) el.click(); return }
      if (el.tagName === 'SELECT') { if (!el.value) { const o = [...el.options].find((x) => x.value); if (o) setValue(el, o.value) } return }
      if (!String(el.value).trim()) setValue(el, sampleFor(el))
    })
  })
}
