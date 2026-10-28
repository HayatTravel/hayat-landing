import { useSearchParams } from 'react-router'
import Icon from '../components/Icon'
import { Ltr } from '../components/ui'
import D from '../data/catalog'
import { useI18n } from '../lib/i18n'
import TransferForm from '../components/services/TransferForm'
import { Head, HelpLine } from '../components/services/ui'

/** Airport transfers: the form (also a search tab) and plain differences between shared and private. */
export default function Transfers() {
  const { t, L, money } = useI18n()
  const [sp] = useSearchParams()
  return (
    <>
      <Head title={t('tr.title')} sub={t('tr.sub')}>
        <div className="mt-8 rounded-lg bg-white p-4 sm:p-5">
          <TransferForm initial={Object.fromEntries(sp)} />
        </div>
      </Head>
      <div className="container-x py-12">
        <section aria-labelledby="trCmp">
          <h2 id="trCmp" className="text-2xl font-bold">{t('tr.compare')}</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {['sic', 'vip'].map((v) => (
              <div key={v} className="card p-6">
                <h3 className="flex items-center gap-2.5 text-lg font-bold"><Icon name={v === 'sic' ? 'users' : 'car'} className="size-5 text-brand-600" />{L(D.transfers[v].name)}</h3>
                <dl className="mt-5 space-y-3 text-sm">
                  {[['tr.who', `tr.${v}Who`], ['tr.wait', `tr.${v}Wait`], ['tr.bags', `tr.${v}Bags`]].map(([k, d]) => (
                    <div key={k} className="grid gap-1 sm:grid-cols-[110px_1fr]"><dt className="text-muted">{t(k)}</dt><dd>{t(d)}</dd></div>
                  ))}
                  <div className="grid gap-1 border-t border-line pt-3 sm:grid-cols-[110px_1fr]"><dt className="text-muted">{t('tr.price')}</dt>
                    <dd><b><Ltr>{money(D.transfers[v].price)}</Ltr></b> <span className="text-muted">{t(v === 'sic' ? 'tr.perPerson' : 'tr.perCar')}</span></dd></div>
                </dl>
              </div>
            ))}
          </div>
        </section>
        <div className="mt-10 text-center"><HelpLine ctx={t('tr.title')} /></div>
      </div>
    </>
  )
}
