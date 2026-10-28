// Two-tone illustrated icons. Each comes alive when its parent `.group` is hovered or focused.
const box = { transformBox: 'fill-box', transformOrigin: 'center' }
const B = '#3d7eff'
const S = '#9dbcff'

function Frame({ children, className = 'size-12' }) {
  return <svg viewBox="0 0 48 48" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
}

export const FlightArt = (p) => (
  <Frame {...p}>
    <path d="M6 38 Q20 34 30 22" stroke={S} strokeWidth="2" strokeDasharray="2 4" />
    <g style={box} className="group-hover:animate-[takeoff_1.4s_ease-in-out] group-focus-visible:animate-[takeoff_1.4s_ease-in-out]">
      <path d="M40 10 L22 24 L14 21 L11 23 L19 28 L18 35 L21 36 L25 29 L34 26 Z" fill={B} />
      <path d="M40 10 L28 22" stroke="#fff" strokeWidth="1.2" strokeOpacity=".7" />
    </g>
  </Frame>
)

export const HotelArt = (p) => (
  <Frame {...p}>
    <path d="M36 8a6 6 0 1 0 4 10 7 7 0 0 1-4-10z" fill={S} />
    <rect x="8" y="16" width="22" height="26" rx="1.5" fill={B} />
    <rect x="30" y="26" width="10" height="16" rx="1" fill={S} />
    {[[12, 20], [20, 20], [12, 27], [20, 27], [12, 34]].map(([x, y], i) => (
      <rect key={i} x={x} y={y} width="5" height="4" rx=".6" fill="#fff" opacity=".35"
        style={{ animationDelay: `${i * 0.18}s` }} className="group-hover:animate-[twinkle_1.2s_ease-in-out_infinite] group-focus-visible:animate-[twinkle_1.2s_ease-in-out_infinite]" />
    ))}
    <rect x="20" y="34" width="5" height="8" fill="#fff" />
  </Frame>
)

export const CarArt = (p) => (
  <Frame {...p}>
    <path d="M4 42 H44" stroke={S} strokeWidth="2" strokeDasharray="6 6" className="group-hover:animate-[road_.6s_linear_infinite] group-focus-visible:animate-[road_.6s_linear_infinite]" />
    <g className="group-hover:animate-[bob_.5s_ease-in-out_infinite] group-focus-visible:animate-[bob_.5s_ease-in-out_infinite]">
      <path d="M7 32 V26 l4-8 a3 3 0 0 1 2.7-1.7 h18.6 a3 3 0 0 1 2.7 1.7 l4 8 v6 z" fill={B} />
      <path d="M14 19 h18 l3 7 H11 z" fill={S} />
    </g>
    {[15, 33].map((cx) => (
      <g key={cx} style={box} className="group-hover:animate-[wheel_.5s_linear_infinite] group-focus-visible:animate-[wheel_.5s_linear_infinite]">
        <circle cx={cx} cy="34" r="4.5" fill="#0b1220" />
        <path d={`M${cx - 3} 34 H${cx + 3}`} stroke="#fff" strokeWidth="1.2" />
      </g>
    ))}
  </Frame>
)

export const EsimArt = (p) => (
  <Frame {...p}>
    <path d="M14 8 h14 l6 6 v24 a2 2 0 0 1-2 2 H14 a2 2 0 0 1-2-2 V10 a2 2 0 0 1 2-2z" fill={B} />
    <rect x="17" y="20" width="12" height="12" rx="1.5" fill={S} />
    <path d="M23 20 v12 M17 26 h12" stroke={B} strokeWidth="1.2" />
    {[6, 10, 14].map((r, i) => (
      <path key={r} d={`M${38 - r * 0.2} ${14 - r * 0.6} a${r} ${r} 0 0 1 ${r * 0.7} ${r * 0.7}`} stroke={B} strokeWidth="2"
        style={{ ...box, transformOrigin: '36px 14px', animationDelay: `${i * 0.2}s` }} className="group-hover:animate-[wave_1.2s_ease-out_infinite] group-focus-visible:animate-[wave_1.2s_ease-out_infinite]" />
    ))}
  </Frame>
)

export const TransferArt = (p) => (
  <Frame {...p}>
    <path d="M6 42 H42" stroke={S} strokeWidth="2" />
    <g className="group-hover:animate-[bob_.45s_ease-in-out_infinite] group-focus-visible:animate-[bob_.45s_ease-in-out_infinite]">
      <rect x="15" y="14" width="18" height="24" rx="3" fill={B} />
      <path d="M20 14 v-4 h8 v4" stroke={B} strokeWidth="2.4" />
      <path d="M21 20 v12 M27 20 v12" stroke={S} strokeWidth="2" />
    </g>
    {[19, 29].map((cx) => (
      <circle key={cx} cx={cx} cy="40" r="2.5" fill="#0b1220" style={box} className="group-hover:animate-[wheel_.4s_linear_infinite] group-focus-visible:animate-[wheel_.4s_linear_infinite]" />
    ))}
  </Frame>
)

export const ChauffeurArt = (p) => (
  <Frame {...p}>
    <g style={box} className="transition-transform duration-700 ease-out group-hover:-rotate-[70deg]">
      <circle cx="24" cy="24" r="16" stroke={B} strokeWidth="4" />
      <circle cx="24" cy="24" r="4" fill={S} />
      <path d="M24 28 V40 M20 24 H8 M28 24 H40" stroke={B} strokeWidth="3.5" />
    </g>
  </Frame>
)

export const DealArt = (p) => (
  <Frame {...p}>
    <g style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }} className="animate-[flicker_2.4s_ease-in-out_infinite] group-hover:animate-[flicker_.5s_ease-in-out_infinite]">
      <path d="M24 42 c-8 0-13-5-13-12 0-6 4-9 6-14 2 4 4 5 6 5 0-6 3-11 8-15 0 7 8 12 8 23 0 8-6 13-15 13z" fill="#ff6b3d" />
      <path d="M24 42 c-4 0-6-3-6-6 0-4 3-5 4-9 2 3 5 4 5 9 0 3-1 6-3 6z" fill="#ffd0a8" />
    </g>
  </Frame>
)
