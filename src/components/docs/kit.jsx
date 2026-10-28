import Icon from '../Icon'
import { Ltr } from '../ui'
import D from '../../data/catalog'
import { useI18n } from '../../lib/i18n'
import { seed } from '../flights/engine'

/* Shared pieces of every customer document: the A4 sheet with company header and footer, the unpaid band,
   labelled fields and a locally drawn QR-style code (no external service). */

export const isPaid = (b) => b.status === 'paid'
/** Traveller names as entered at checkout; numbered placeholders when a name is missing. */
export const names = (b, i, n) => Array.from({ length: Math.max(1, n || b.travellers?.length || 1) }, (_, k) => b.travellers?.[k] || i.t('doc.trav', { n: k + 1 }))
/** Deterministic code like "K7Q2XP" for confirmation and airline references. */
export const code = (s, len = 6) => { const r = seed(s); const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; return Array.from({ length: len }, () => a[Math.floor(r() * a.length)]).join('') }
const hhmm = (ms) => { const d = new Date(ms); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}` }

/** QR-style matrix: three finder squares and seeded modules. Illustrative, scanned only by Hayat offices. */
export function QR({ value, size = 112, className = '' }) {
  const N = 25; const r = seed(`qr-${value}`)
  const finder = (x, y) => [x, y, x + N - 7, y, x, y + N - 7]
  const inFinder = (x, y) => (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9)
  const cells = []
  for (let y = 0; y < N; y += 1) for (let x = 0; x < N; x += 1) if (!inFinder(x, y) && r() > 0.52) cells.push(`M${x} ${y}h1v1h-1z`)
  const [ax, ay, bx, by, cx, cy] = finder(0, 0)
  const sq = (x, y) => `M${x} ${y}h7v7h-7zM${x + 1} ${y + 1}v5h5v-5zM${x + 2} ${y + 2}h3v3h-3z`
  return (
    <svg viewBox={`-1 -1 ${N + 2} ${N + 2}`} width={size} height={size} className={`shrink-0 rounded-sm bg-white ${className}`} role="img" aria-label={`QR ${value}`} shapeRendering="crispEdges">
      <path d={`${sq(ax, ay)}${sq(bx, by)}${sq(cx, cy)}${cells.join('')}`} fill="#0b1220" fillRule="evenodd" />
    </svg>
  )
}

/** Simple 1D barcode (decorative, deterministic). */
export function Barcode({ value, className = 'h-10 w-full' }) {
  const r = seed(`bar-${value}`); const bars = []
  for (let x = 0; x < 200;) { const w = 1 + Math.floor(r() * 3); if (r() > 0.35) bars.push(`M${x} 0h${w}v40h-${w}z`); x += w + 1 }
  return <svg viewBox="0 0 200 40" preserveAspectRatio="none" className={className} aria-hidden="true"><path d={bars.join('')} fill="#0b1220" /></svg>
}

/** Small label over a bold value. `ltr` isolates codes, times and numbers. */
export function F({ k, v, ltr, big, className = '' }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <p className="text-[10px] font-semibold tracking-wide text-muted uppercase">{k}</p>
      <p className={`${big ? 'text-lg' : 'text-sm'} font-bold break-words`}>{ltr ? <Ltr>{v}</Ltr> : v}</p>
    </div>
  )
}

/** Key–value rows (label start, value end). */
export function Rows({ rows }) {
  return (
    <dl className="divide-y divide-line text-sm">
      {rows.filter(Boolean).map(([k, v]) => <div key={k} className="flex justify-between gap-6 py-2.5 break-inside-avoid"><dt className="text-muted">{k}</dt><dd className="text-end font-semibold"><bdi>{v}</bdi></dd></div>)}
    </dl>
  )
}

export const Callout = ({ icon = 'info', children }) => (
  <p className="flex items-start gap-2 rounded-md bg-mist p-3 text-sm text-ink/80 break-inside-avoid"><Icon name={icon} className="mt-0.5 size-4 shrink-0 text-brand" />{children}</p>
)

/** The printable sheet: company header, title, booking number, optional unpaid band, footer. */
export function DocShell({ b, title, sub, receipt = false, children }) {
  const i = useI18n(); const { t } = i
  const paid = isPaid(b)
  const issued = new Date(b.created || Date.now())
  const issuedIso = `${issued.getFullYear()}-${String(issued.getMonth() + 1).padStart(2, '0')}-${String(issued.getDate()).padStart(2, '0')}`
  return (
    <article className="doc-sheet mx-auto w-full max-w-[210mm] bg-white p-6 text-ink shadow-[0_30px_80px_-40px_rgba(11,18,32,.45)] sm:p-10 print:max-w-none print:p-0 print:shadow-none">
      <header className="flex flex-wrap items-start justify-between gap-6 border-b-2 border-ink pb-5">
        <div>
          <p className="text-lg font-bold tracking-tight">{t('doc.brand')}</p>
          <p className="mt-1 text-xs leading-5 text-muted">{i.L(D.company.licence)}<br /><Ltr>{D.company.phone}</Ltr> · <Ltr>{D.company.email}</Ltr></p>
        </div>
        <div className="text-end">
          <p className="text-xs font-semibold tracking-wider text-brand uppercase">{title}</p>
          <p className="mt-1 font-mono text-2xl font-bold tracking-[.18em]" dir="ltr">{b.ref}</p>
          <p className="text-xs text-muted">{t('doc.issued')}: {i.date(issuedIso, { year: true })}</p>
        </div>
      </header>
      {!paid && (
        <div role="note" className="mt-5 flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 break-inside-avoid">
          <Icon name="clock" className="mt-0.5 size-4 shrink-0" />
          <span><b className="block">{receipt ? t('doc.due') : t('doc.unpaid')}</b>{b.payBy ? t(receipt ? 'doc.r.payBy' : 'doc.unpaidD', { time: hhmm(b.payBy) }) : t('doc.unpaidD2')}</span>
        </div>
      )}
      {sub && <div className="mt-6">{sub}</div>}
      <div className="mt-6 grid gap-5">{children}</div>
      <footer className="mt-10 flex flex-wrap items-end justify-between gap-3 border-t border-line pt-4 text-[11px] leading-5 text-muted">
        <span>{t('doc.contact', { phone: D.company.phone, email: D.company.email })}</span>
        <span>{t('doc.mock')}</span>
      </footer>
    </article>
  )
}
