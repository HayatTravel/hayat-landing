import { useId, useRef, useState } from 'react'
import Icon from './Icon'

// Arabic-tolerant matching: أ/إ/آ→ا, ة→ه, ى→ي, strip diacritics.
const norm = (s) => s.toLowerCase().replace(/[ً-ْ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').trim()

/**
 * Type-ahead picker. options: [{ value, title, sub, code }]
 */
import { useI18n } from '../lib/i18n'

export default function Combobox({ label, icon = 'pin', value, onChange, options, placeholder, className = '' }) {
  const { t } = useI18n()
  placeholder = placeholder ?? t('cb.ph')
  const id = useId()
  const input = useRef(null)
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [hi, setHi] = useState(0)
  const selected = options.find((o) => o.value === value)
  const list = q ? options.filter((o) => [o.title, o.sub, o.code].some((t) => t && norm(t).includes(norm(q)))) : options

  const choose = (o) => {
    onChange(o.value)
    setOpen(false)
    setQ('')
    input.current?.blur()
  }
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setHi((h) => Math.min(h + 1, list.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setHi((h) => Math.max(h - 1, 0)) }
    if (e.key === 'Enter' && open && list[hi]) { e.preventDefault(); choose(list[hi]) }
    if (e.key === 'Escape') { setOpen(false); setQ('') }
  }

  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className={`block rounded-md border bg-white px-4 pt-2.5 pb-2 transition ${open ? 'border-ink' : 'border-line hover:border-ink/40'}`}>
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted"><Icon name={icon} className="size-3.5" /> {label}</span>
        <input
          ref={input} id={id} role="combobox" aria-expanded={open} aria-controls={`${id}-list`} aria-autocomplete="list"
          aria-activedescendant={open && list[hi] ? `${id}-${list[hi].value}` : undefined}
          autoComplete="off" placeholder={placeholder}
          value={open ? q : selected ? `${selected.title}${selected.code ? ` (${selected.code})` : ''}` : ''}
          onFocus={() => { setOpen(true); setHi(0) }}
          onBlur={() => { setOpen(false); setQ('') }}
          onChange={(e) => { setQ(e.target.value); setHi(0); setOpen(true) }}
          onKeyDown={onKey}
          className="w-full bg-transparent pt-0.5 text-[15px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-muted"
        />
      </label>
      {open && (
        <ul id={`${id}-list`} role="listbox" className="absolute inset-x-0 top-full z-40 mt-1 max-h-72 animate-fade overflow-y-auto rounded-md border border-line bg-white py-1">
          {list.map((o, i) => (
            <li key={o.value} id={`${id}-${o.value}`} role="option" aria-selected={o.value === value}
              onMouseDown={(e) => e.preventDefault()} onClick={() => choose(o)} onMouseEnter={() => setHi(i)}
              className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 ${i === hi ? 'bg-mist' : ''}`}>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{o.title}</span>
                {o.sub && <span className="block truncate text-xs text-muted">{o.sub}</span>}
              </span>
              {o.code && <span className="font-mono text-xs font-bold text-muted" dir="ltr">{o.code}</span>}
            </li>
          ))}
          {!list.length && <li className="px-4 py-3 text-sm text-muted">{t('cb.none', { q })}</li>}
        </ul>
      )}
    </div>
  )
}
