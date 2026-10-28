import { flag, seeded } from '../../lib/format'
import Icon from '../Icon'

// Deterministic QR-looking matrix with the three finder squares.
function Qr({ seed }) {
  const r = seeded(seed)
  const N = 25
  const finder = (x, y) => [[0, 0], [N - 7, 0], [0, N - 7]].some(([a, b]) => x >= a && x < a + 7 && y >= b && y < b + 7)
  const cells = []
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!finder(x, y) && r() > 0.52) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />)
  const eye = (x, y) => (
    <g key={`${x}${y}`}>
      <rect x={x + 0.5} y={y + 0.5} width="6" height="6" fill="none" stroke="currentColor" strokeWidth="1" />
      <rect x={x + 2} y={y + 2} width="3" height="3" />
    </g>
  )
  return (
    <svg viewBox={`0 0 ${N} ${N}`} shapeRendering="crispEdges" className="size-full" fill="currentColor" aria-hidden="true">
      {cells}{eye(0, 0)}{eye(N - 7, 0)}{eye(0, N - 7)}
    </svg>
  )
}

const Bars = ({ on }) => (
  <span className="flex items-end gap-[2px]">
    {[4, 6, 8, 10].map((h, i) => (
      <span key={h} style={{ height: h, transitionDelay: `${i * 140}ms` }} className={`w-[3px] rounded-[1px] transition-colors duration-300 ${on ? 'bg-ink' : 'bg-ink/20'}`} />
    ))}
  </span>
)

// stage: 0 scanning the QR, 1 activating, 2 connected
export default function EsimPhone({ country, stage }) {
  return (
    <div className="relative w-[270px] rounded-[54px] bg-gradient-to-b from-[#4a5266] via-[#1b2030] to-[#4a5266] p-[3px] shadow-[0_60px_120px_-30px_rgba(0,0,0,.8),0_0_80px_-20px_rgba(61,126,255,.45)]">
      <div className="relative h-[560px] rounded-[51px] bg-[#04060a] p-[10px]">
        <div className="relative h-full overflow-hidden rounded-[42px] bg-gradient-to-b from-white via-white to-mist text-ink">
          <div className="absolute top-3 left-1/2 z-10 h-7 w-24 -translate-x-1/2 rounded-full bg-black" />
          <div className="flex items-center justify-between px-7 pt-4 text-[11px] font-semibold" dir="ltr">
            <span>9:41</span>
            <span className="flex items-center gap-1.5">
              <span className={stage === 2 ? 'text-ink' : 'text-ink/40'}>{stage === 2 ? '5G' : 'SOS'}</span>
              <Bars on={stage === 2} />
            </span>
          </div>

          {stage === 0 && (
            <div key="scan" className="animate-[fade_.5s_ease_both] px-6 pt-12 text-center">
              <p className="text-[11px] font-semibold tracking-wider text-brand">الخطوة 2 من 3</p>
              <p className="mt-1 text-lg font-bold">امسح للتفعيل</p>
              <p className="text-xs text-muted">باقة {country.name} · {country.network}</p>
              <div className="relative mx-auto mt-6 size-44 p-3 text-ink">
                {['top-0 start-0 border-t-2 border-s-2', 'top-0 end-0 border-t-2 border-e-2', 'bottom-0 start-0 border-b-2 border-s-2', 'bottom-0 end-0 border-b-2 border-e-2'].map((c) => (
                  <span key={c} className={`absolute size-6 rounded-[3px] border-brand ${c}`} />
                ))}
                <Qr seed={country.cc} />
                <span className="absolute inset-x-1 h-0.5 animate-[scan_1.1s_ease-in-out_infinite_alternate] bg-brand shadow-[0_0_18px_4px_rgba(61,126,255,.55)]" />
              </div>
              <p className="mt-6 text-[11px] text-muted">وجّه الكاميرا نحو الرمز</p>
            </div>
          )}

          {stage === 1 && (
            <div key="act" className="grid h-[70%] animate-[fade_.4s_ease_both] place-items-center text-center">
              <div>
                <span className="mx-auto block size-16 animate-spin rounded-full border-4 border-brand/15 border-t-brand" />
                <p className="mt-5 font-bold">جارٍ التفعيل…</p>
                <p className="mt-1 text-xs text-muted" dir="ltr">{country.network}</p>
              </div>
            </div>
          )}

          {stage === 2 && (
            <div key="on" className="px-6 pt-10">
              <p className="animate-rise text-xs text-muted">باقتك النشطة</p>
              <div className="mt-2 flex animate-rise items-center gap-3 [animation-delay:80ms]">
                <img src={flag(country.cc)} alt="" className="size-11 rounded-full object-cover ring-2 ring-white shadow" />
                <div><p className="font-bold">{country.name}</p><p className="text-xs text-muted">{country.network} · 5G</p></div>
              </div>
              <div className="relative mx-auto mt-6 size-40 animate-rise [animation-delay:160ms]">
                <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden="true">
                  <defs><linearGradient id="esim-g" x1="0" x2="1"><stop offset="0" stopColor="#3d7eff" /><stop offset="1" stopColor="#7c4dff" /></linearGradient></defs>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#e3e8f2" strokeWidth="9" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="url(#esim-g)" strokeWidth="9" strokeLinecap="round" pathLength="1" strokeDasharray="1" className="animate-[gauge_1.6s_cubic-bezier(.2,.7,.2,1)_.3s_both]" style={{ '--v': 0.001 }} />
                </svg>
                <div className="absolute inset-0 grid place-content-center text-center">
                  <p className="text-3xl font-bold" dir="ltr">5 <span className="text-base">GB</span></p>
                  <p className="text-[11px] text-muted">جاهزة للاستخدام</p>
                </div>
              </div>
              <div className="mt-6 grid animate-rise grid-cols-2 gap-2 text-center text-xs [animation-delay:240ms]">
                <div className="rounded-lg bg-mist p-3"><p className="text-lg font-bold">30</p>يوماً</div>
                <div className="rounded-lg bg-emerald-50 p-3 text-emerald-700"><p className="flex h-7 items-center justify-center"><Icon name="wifi" className="size-5" /></p>متصل</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
