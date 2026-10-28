/* A calm, trilingual take on Layth's art/EsimPhone: the install screen for the chosen plan.
   Static (no fake activation or speed claims): QR code, country, network and the plan itself. */
import { flag, seeded } from '../../lib/format'
import { useI18n } from '../../lib/i18n'
import { esDays } from './data'

function Qr({ seed }) {
  const r = seeded(seed)
  const N = 25
  const finder = (x, y) => [[0, 0], [N - 7, 0], [0, N - 7]].some(([a, b]) => x >= a && x < a + 7 && y >= b && y < b + 7)
  const cells = []
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!finder(x, y) && r() > 0.52) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />)
  const eye = (x, y) => (
    <g key={`${x}${y}`}><rect x={x + 0.5} y={y + 0.5} width="6" height="6" fill="none" stroke="currentColor" strokeWidth="1" /><rect x={x + 2} y={y + 2} width="3" height="3" /></g>
  )
  return <svg viewBox={`0 0 ${N} ${N}`} shapeRendering="crispEdges" className="size-full" fill="currentColor" aria-hidden="true">{cells}{eye(0, 0)}{eye(N - 7, 0)}{eye(0, N - 7)}</svg>
}

export default function EsimPhone({ country, plan }) {
  const i = useI18n()
  return (
    <div aria-hidden="true" className="w-[230px] rounded-[46px] bg-gradient-to-b from-[#4a5266] via-[#1b2030] to-[#4a5266] p-[3px] shadow-[0_40px_80px_-30px_rgba(11,18,32,.45)]">
      <div className="h-[460px] rounded-[43px] bg-[#04060a] p-[9px]">
        <div className="relative h-full overflow-hidden rounded-[36px] bg-white text-ink">
          <div className="absolute top-3 left-1/2 h-6 w-20 -translate-x-1/2 rounded-full bg-black" />
          <div className="px-5 pt-14 text-center">
            <p className="text-base font-bold">{i.t('es.scan')}</p>
            <p className="mt-1 flex items-center justify-center gap-2 text-xs text-muted">
              <img src={flag(country.cc)} alt="" className="size-4 rounded-full object-cover" />{i.L(country.name)} · <bdi dir="ltr">{country.net}</bdi>
            </p>
            <div className="relative mx-auto mt-5 size-36 p-2.5">
              {['top-0 start-0 border-t-2 border-s-2', 'top-0 end-0 border-t-2 border-e-2', 'bottom-0 start-0 border-b-2 border-s-2', 'bottom-0 end-0 border-b-2 border-e-2'].map((c) => (
                <span key={c} className={`absolute size-5 rounded-[3px] border-brand ${c}`} />
              ))}
              <Qr seed={`${country.cc}-${plan[0]}`} />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-md bg-mist p-2.5"><p className="text-lg font-bold" dir="ltr">{plan[1]} <span className="text-xs">GB</span></p>{i.t('es.data')}</div>
              <div className="rounded-md bg-mist p-2.5"><p className="text-lg font-bold">{esDays(i, plan[0])}</p>{i.t('es.validity')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
