import { media } from '../data/catalog'
import { useI18n } from '../lib/i18n'
import { Steps } from '../components/services/ui'
import { BizHead, BizNav, Features, RequestForm, SecTitle, contactFields } from '../components/business/ui'

/** /business/corporate — company travel accounts. */
export default function BusinessCorporate() {
  const { t } = useI18n()
  const fields = contactFields(t, [{ id: 'company', label: t('bz.f.company'), required: true, wide: true }]).concat([
    { id: 'volume', label: t('bz.f.volume'), type: 'select', required: true, options: [1, 2, 3, 4].map((n) => [String(n), t(`bz.v.${n}`)]) },
    { id: 'cities', label: t('bz.f.cities'), wide: true },
    { id: 'notes', label: t('bz.f.notes'), type: 'textarea' },
  ])
  return (
    <>
      <BizHead title={t('bz.corp.title')} sub={t('bz.corp.sub')} photo={media('corporate')} />
      <BizNav />
      <div className="container-x py-14">
        <Features items={[['users', 'bz.corp.f1', 'bz.corp.f1d'], ['shield', 'bz.corp.f2', 'bz.corp.f2d'], ['documents', 'bz.corp.f3', 'bz.corp.f3d'], ['headset', 'bz.corp.f4', 'bz.corp.f4d'], ['sort', 'bz.corp.f5', 'bz.corp.f5d']]} />
        <section className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.4fr]" aria-labelledby="bzHow">
          <div>
            <SecTitle id="bzHow" title={t('bz.how')} />
            <Steps items={[1, 2, 3].map((n) => [t(`bz.corp.s${n}`), t(`bz.corp.s${n}d`)])} />
          </div>
          <div id="form"><RequestForm kind="corporate" title={t('bz.corp.form')} fields={fields} /></div>
        </section>
      </div>
    </>
  )
}
