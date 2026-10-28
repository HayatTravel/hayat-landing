import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Icon from '../Icon'
import { useI18n } from '../../lib/i18n'

/** Side sheet (full width on phones). Escape or the scrim closes it; the heading takes focus on open.
    `foot` sticks to the bottom (total + main action). Used by flight and car details. */
export default function Sheet({ open, onClose, title, children, foot, labelId = 'sheet-title' }) {
  const { t } = useI18n()
  const head = useRef(null)
  const close = useRef(onClose)
  useEffect(() => { close.current = onClose })
  useEffect(() => {
    if (!open) return undefined
    const prev = document.activeElement
    const key = (e) => e.key === 'Escape' && close.current?.()
    document.addEventListener('keydown', key)
    document.body.style.overflow = 'hidden'
    head.current?.focus()
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = ''; prev?.focus?.() }
  }, [open])
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 animate-fade bg-ink/50" onClick={onClose} aria-hidden="true" />
      <aside role="dialog" aria-modal="true" aria-labelledby={labelId}
        className="absolute inset-y-0 end-0 flex w-full max-w-xl animate-fade flex-col bg-white shadow-[0_0_80px_-20px_rgba(11,18,32,.5)]">
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <h2 id={labelId} ref={head} tabIndex={-1} className="text-xl font-bold outline-none">{title}</h2>
          <button type="button" onClick={onClose} className="grid size-9 shrink-0 place-items-center rounded-md hover:bg-mist" aria-label={t('close')}><Icon name="close" className="size-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {foot && <div className="flex items-center justify-between gap-4 border-t border-line bg-white px-6 py-4">{foot}</div>}
      </aside>
    </div>,
    document.body,
  )
}
