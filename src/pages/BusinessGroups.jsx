import Icon from '../components/Icon'
import { media } from '../data/catalog'
import { useI18n } from '../lib/i18n'
import { BizHead, BizNav, RequestForm, SecTitle, contactFields } from '../components/business/ui'

const TYPES = [['family', 'heart'], ['conference', 'building'], ['sports', 'users'], ['pilgrims', 'star'], ['charter', 'plane']]

/** /business/groups — groups and events, including chartering a whole flight (#charter). */
export default function BusinessGroups() {
  const { t } = useI18n()
  const fields = [
    { id: 'type', label: t('bz.f.gtype'), type: 'select', required: true, options: TYPES.map(([id]) => [id, t(`bz.g.${id}`)]) },
    { id: 'people', label: t('bz.f.people'), type: 'number', required: true },
    { id: 'start', label: t('bz.f.start'), type: 'date', required: true }, { id: 'end', label: t('bz.f.end'), type: 'date' },
    { id: 'from', label: t('bz.f.from'), required: true }, { id: 'to', label: t('bz.f.to'), required: true },
    { id: 'needs', label: t('bz.f.needs'), type: 'checks', options: ['flights', 'hotels', 'transport', 'visas', 'venue'].map((k) => [k, t(`bz.n.${k}`)]) },
    ...contactFields(t),
    { id: 'notes', label: t('bz.f.notes'), type: 'textarea' },
  ]
  return (
    <>
      <BizHead title={t('bz.gr.title')} sub={t('bz.gr.sub')} photo={media('charter-group')} />
      <BizNav />
      <div className="container-x py-14">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {TYPES.map(([id, ic]) => (
            <li key={id} id={id} className={`scroll-mt-28 rounded-lg border p-5 ${id === 'charter' ? 'border-ink bg-ink text-white' : 'border-line bg-white'}`}>
              <Icon name={ic} className={`size-6 ${id === 'charter' ? 'text-sky rtl:-scale-x-100' : 'text-brand-600'}`} />
              <h3 className="mt-3 font-bold">{t(`bz.g.${id}`)}</h3>
              <p className={`mt-1 text-sm leading-6 ${id === 'charter' ? 'text-white/70' : 'text-muted'}`}>{t(`bz.gd.${id}`)}</p>
            </li>
          ))}
        </ul>
        <section className="mx-auto mt-14 max-w-3xl" id="form" aria-labelledby="bzGf">
          <SecTitle id="bzGf" title={t('bz.gr.form')} sub={t('bz.gr.formSub')} />
          <RequestForm kind="group" fields={fields} />
        </section>
      </div>
    </>
  )
}
