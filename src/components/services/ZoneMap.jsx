/* Seat-area plan: the dearest tier sits nearest the stage (concerts) or the pitch (matches, mirrored stands).
   One keyboard-reachable button per tier; mirrored bands are decorative (aria-hidden, not focusable). */
import { Ltr } from '../ui'
import { useI18n } from '../../lib/i18n'
import { ranked } from './data'

export const TONES = [
  { band: 'bg-amber-100 text-amber-900 hover:border-amber-500', on: 'bg-amber-500 border-amber-500 text-white', dot: 'bg-amber-500' },
  { band: 'bg-[#e8f0ff] text-brand-600 hover:border-brand', on: 'bg-brand border-brand text-white', dot: 'bg-brand' },
  { band: 'bg-[#eef1f7] text-ink/70 hover:border-sky', on: 'bg-sky border-sky text-ink', dot: 'bg-sky' },
]
const ARC_DOWN = { borderRadius: '6px 6px 50% 50% / 6px 6px 18px 18px' }
const ARC_UP = { borderRadius: '50% 50% 6px 6px / 18px 18px 6px 6px' }

export default function ZoneMap({ event, value, onChange }) {
  const { t, L, money } = useI18n()
  const z = ranked(event)
  if (z.length < 2) return null
  const sport = event.cat === 'sport'
  const band = (x, k, mirror) => {
    const on = x.id === value
    return (
      <button key={`${x.id}-${mirror ? 'm' : 'a'}`} type="button" onClick={() => onChange(x.id)}
        {...(mirror ? { tabIndex: -1, 'aria-hidden': true } : { 'aria-pressed': on })}
        style={{ width: `${100 - (z.length - 1 - k) * 18}%`, ...(mirror ? ARC_UP : ARC_DOWN) }}
        className={`flex min-h-12 items-center justify-between gap-3 border-2 px-4 py-2 text-sm font-bold transition ${on ? TONES[k].on : `border-transparent ${TONES[k].band}`}`}>
        <span>{L(x.name)}</span><span className="text-xs font-semibold"><Ltr>{money(x.usd)}</Ltr></span>
      </button>
    )
  }
  const core = sport
    ? <div aria-hidden="true" className="my-1.5 w-1/2 min-w-36 rounded-md border-2 border-emerald-300 bg-emerald-50 py-6 text-center text-xs font-bold text-emerald-800 [background-image:linear-gradient(90deg,transparent_calc(50%-1px),#6ee7b7_calc(50%-1px),#6ee7b7_calc(50%+1px),transparent_calc(50%+1px))]">{t('ev.pitch')}</div>
    : <div aria-hidden="true" className="mb-1.5 w-1/2 min-w-36 rounded-t-md rounded-b-[40px] bg-ink py-2.5 text-center text-xs font-bold tracking-wide text-white">{t('ev.stage')}</div>
  return (
    <div role="group" aria-label={t('ev.seats')} className="mt-4 grid justify-items-center gap-1.5 rounded-lg border border-line bg-white p-3 sm:p-5">
      {sport && [...z].reverse().map((x) => band(x, z.indexOf(x), true))}
      {core}
      {z.map((x, k) => band(x, k, false))}
    </div>
  )
}
