import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { img } from '../lib/format'
import Icon from './Icon'
import logoDark from '../assets/hayat-logo-dark.png'
import logoLight from '../assets/hayat-logo-light.png'

export function Logo({ light, className = 'h-9' }) {
  return (
    <Link to="/" className="shrink-0" aria-label="الحياة للسفر — الرئيسية">
      <img src={light ? logoLight : logoDark} alt="Hayat" className={`${className} w-auto`} />
    </Link>
  )
}

// Unsplash image that fades in once decoded.
export function Photo({ id, w = 1200, alt = '', className = '', eager }) {
  const [ok, setOk] = useState(false)
  return (
    <img
      src={img(id, w)}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      onLoad={() => setOk(true)}
      className={`${className} bg-line object-cover transition duration-700 ${ok ? 'opacity-100' : 'opacity-0'}`}
    />
  )
}

export function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { rootMargin: '0px 0px -60px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return (
    <Tag ref={ref} style={{ animationDelay: `${delay}ms` }} className={`${className} ${seen ? 'animate-rise' : 'opacity-0'}`}>
      {children}
    </Tag>
  )
}

// Shared-element morph into a deal page. Only the card being opened carries the name,
// otherwise every card on the page would fly to its counterpart on the next page.
export function useMorph() {
  const [picked, setPicked] = useState(null)
  return {
    trigger: (id) => ({ viewTransition: true, onPointerEnter: () => setPicked(id), onFocus: () => setPicked(id) }),
    target: (id) => (picked === id ? morphStyle(id) : undefined),
  }
}
export const morphStyle = (id) => ({ viewTransitionName: `deal-${id}`, viewTransitionClass: 'morph' })

// Signature call-to-action: colour wipe, idle shine, arrow that loops through its chip.
export function Cta({ to, children, variant = 'light', className = '', ...rest }) {
  return (
    <Link to={to} className={`cta cta-${variant} ${className}`} {...rest}>
      <span>{children}</span>
      <span className="cta-chip"><span className="cta-arrow"><Icon name="arrow" className="size-4 -scale-x-100" /></span></span>
    </Link>
  )
}

export function Stepper({ steps, current }) {
  return (
    <ol className="flex items-center gap-2 overflow-x-auto pb-1 text-sm [scrollbar-width:none]">
      {steps.map((s, i) => (
        <li key={s} className="flex shrink-0 items-center gap-2">
          <span className={`grid size-7 place-items-center rounded-full text-xs font-bold transition ${i < current ? 'bg-gradient-to-br from-brand to-plum-400 text-white' : i === current ? 'bg-white text-[#0b1220] shadow-[0_0_0_4px_rgba(61,126,255,.35),0_0_28px_rgba(61,126,255,.7)]' : 'text-muted ring-1 ring-line'}`}>
            {i < current ? <Icon name="check" className="size-4" strokeWidth={3} /> : i + 1}
          </span>
          <span className={i === current ? 'font-semibold text-ink' : 'text-muted'}>{s}</span>
          {i < steps.length - 1 && <span className={`h-0.5 w-6 rounded-full sm:w-12 ${i < current ? 'bg-gradient-to-l from-plum-400 to-brand' : 'bg-line'}`} />}
        </li>
      ))}
    </ol>
  )
}

export function Stars({ n, className = 'size-3.5' }) {
  return (
    <span className="inline-flex text-amber-400" aria-label={`${n} نجوم`}>
      {Array.from({ length: n }, (_, i) => <Icon key={i} name="star" className={className} fill="currentColor" strokeWidth={0} />)}
    </span>
  )
}

export function SectionTitle({ eyebrow, title, action }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-2 text-sm font-semibold text-brand">{eyebrow}</p>}
        <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      </div>
      {action}
    </div>
  )
}

export const Ltr = ({ children, className = '' }) => <bdi dir="ltr" className={className}>{children}</bdi>
