import { useSearchParams } from 'react-router'
import { PageHead } from '../components/Layout'
import Icon from '../components/Icon'
import { useI18n } from '../lib/i18n'
import { openHelp } from '../lib/store'
import { photo } from '../data/incoming'
import { useVisitMode } from '../components/incoming/lib'
import { VisaChecker } from '../components/incoming/Visa'
import { qs } from '../components/stays/lib'

/** /visit/visa?nat&region — what a visitor needs to enter Iraq, by nationality and region; "Let us handle it" → /checkout?type=ivisa */
export default function VisitVisa() {
  useVisitMode()
  const { t } = useI18n()
  const [sp, setSp] = useSearchParams()
  const q = Object.fromEntries(sp)
  return (
    <>
      <PageHead photo={photo('erbil')}>
        <h1 className="text-3xl font-bold sm:text-4xl">{t('iq.visaPage.title')}</h1>
        <p className="mt-2 max-w-2xl text-muted">{t('iq.visaPage.lede')}</p>
      </PageHead>
      <div className="container-x grid gap-10 py-10 lg:grid-cols-[1.4fr_1fr]">
        <section className="card p-5 sm:p-6">
          <h2 className="mb-4 text-lg font-bold">{t('iq.visaPage.check')}</h2>
          <VisaChecker full initial={q} onChange={(v) => setSp(qs(v), { replace: true, preventScrollReset: true })} />
        </section>
        <aside className="space-y-6">
          <section>
            <h2 className="mb-3 font-bold">{t('iq.visaPage.regions')}</h2>
            <p className="text-sm leading-7 text-ink/80">{t('iq.visaPage.regionsD')}</p>
          </section>
          <section>
            <h2 className="mb-3 font-bold">{t('iq.visaPage.we')}</h2>
            <ul className="space-y-2.5 text-sm">
              {['evisa', 'invite', 'meet', 'groups'].map((k) => <li key={k} className="flex gap-2"><Icon name="check" className="mt-0.5 size-4 shrink-0 text-emerald-600" />{t(`iq.visaPage.we.${k}`)}</li>)}
            </ul>
          </section>
          <section className="rounded-md bg-mist p-4 text-sm leading-6 text-ink/80">
            <p className="flex gap-2"><Icon name="info" className="mt-0.5 size-4 shrink-0 text-muted" />{t('iq.visaPage.arbaeen')}</p>
          </section>
          <button type="button" onClick={() => openHelp(t('iq.visaPage.title'))} className="flex items-center gap-2 text-sm font-medium text-brand"><Icon name="chat" className="size-4" />{t('help.line')}</button>
        </aside>
      </div>
    </>
  )
}
