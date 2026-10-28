import { media } from '../data/catalog'
import { useI18n } from '../lib/i18n'
import { BizHead, BizNav, Features, RequestForm, contactFields } from '../components/business/ui'

/** /business/government — delegations, NGOs, international organisations and missions. */
export default function BusinessGovernment() {
  const { t } = useI18n()
  const fields = [
    { id: 'org', label: t('bz.f.org'), required: true },
    { id: 'orgType', label: t('bz.f.orgType'), type: 'select', required: true, options: ['gov', 'ngo', 'intl', 'embassy'].map((k) => [k, t(`bz.o.${k}`)]) },
    ...contactFields(t),
    { id: 'message', label: t('bz.f.message'), type: 'textarea', required: true },
  ]
  return (
    <>
      <BizHead title={t('bz.gv.title')} sub={t('bz.gv.sub')} photo={media('visa-passport')} />
      <BizNav />
      <div className="container-x py-14">
        <Features cols="lg:grid-cols-4" items={[['passport', 'bz.gv.f1', 'bz.gv.f1d'], ['shield', 'bz.gv.f2', 'bz.gv.f2d'], ['documents', 'bz.gv.f3', 'bz.gv.f3d'], ['lock', 'bz.gv.f4', 'bz.gv.f4d']]} />
        <div className="mx-auto mt-14 max-w-3xl" id="form"><RequestForm kind="government" title={t('bz.gv.form')} fields={fields} /></div>
      </div>
    </>
  )
}
