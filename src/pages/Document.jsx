import { useMemo } from 'react'
import { Link, useParams } from 'react-router'
import Icon from '../components/Icon'
import { DocBody } from '../components/docs/Templates'
import { docKinds, hasCalendar, icsText } from '../components/docs/index'
import D from '../data/catalog'
import { useI18n } from '../lib/i18n'
import { buildOrder } from '../lib/products'
import { trips, useStore } from '../lib/store'
import '../styles/docs.css'

/** /trips/:ref/doc/:kind — one customer document, rebuilt in the current language from the saved booking. */
export default function Document() {
  useStore()
  const i = useI18n(); const { t } = i
  const { ref, kind } = useParams()
  const b = trips.find(ref)
  const o = useMemo(() => (b ? buildOrder(b.q || {}, i) : null), [b?.ref, i.lang, i.cur]) // eslint-disable-line react-hooks/exhaustive-deps
  const kinds = b ? docKinds(b, i) : []
  const k = kinds.find((x) => x.kind === kind)

  if (!b || !k) {
    return (
      <div className="container-x pt-32 pb-20 text-center">
        <Icon name="documents" className="mx-auto size-9 text-muted" />
        <h1 className="mt-3 text-2xl font-bold">{t('doc.notFound')}</h1><p className="mt-1 text-muted">{t('doc.notFoundD')}</p>
        <Link to={b ? `/trips/${b.ref}` : '/trips'} className="btn-primary mt-6">{t('doc.back')}</Link>
      </div>
    )
  }

  const calendar = () => {
    const url = URL.createObjectURL(new Blob([icsText(b, i)], { type: 'text/calendar;charset=utf-8' }))
    const a = document.createElement('a'); a.href = url; a.download = `hayat-${b.ref}.ics`; document.body.append(a); a.click(); a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  const wa = `https://wa.me/${D.company.whatsapp}?text=${encodeURIComponent(`${t('wa.hi')}\n${t('doc.waText', { ref: b.ref, title: o?.title || b.title })}\n${k.label}`)}`

  return (
    <div className="bg-mist pt-24 pb-16 print:bg-white print:p-0">
      <div className="container-x print:hidden">
        <div className="mx-auto max-w-[210mm]">
          <Link to={`/trips/${b.ref}`} className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"><Icon name="arrow" className="size-4 ltr:-scale-x-100" />{t('doc.back')}</Link>
          <nav aria-label={t('doc.choose')} className="mt-4 flex gap-1 overflow-x-auto border-b border-line [scrollbar-width:none]">
            {kinds.map((x) => (
              <Link key={x.kind} to={`/trips/${b.ref}/doc/${x.kind}`} replace aria-current={x.kind === kind ? 'page' : undefined}
                className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${x.kind === kind ? 'border-brand text-ink' : 'border-transparent text-muted hover:text-ink'}`}>
                <Icon name={x.icon} className="size-4" />{x.label}
              </Link>
            ))}
          </nav>
          <div className="my-5 flex flex-wrap gap-2">
            <button type="button" onClick={() => print()} className="btn-primary px-5 py-2.5 text-sm"><Icon name="printer" className="size-4" />{t('doc.print')}</button>
            {hasCalendar(b, i) && <button type="button" onClick={calendar} className="btn-ghost px-5 py-2.5 text-sm"><Icon name="calendar" className="size-4" />{t('doc.cal')}</button>}
            <a href={wa} target="_blank" rel="noreferrer" className="btn-ghost px-5 py-2.5 text-sm"><Icon name="whatsapp" className="size-4" />{t('doc.wa')}</a>
          </div>
        </div>
      </div>
      <div className="container-x print:max-w-none print:p-0">
        <DocBody b={b} o={o} kind={kind} />
      </div>
    </div>
  )
}
