import { useSearchParams } from 'react-router'
import { PageHead } from '../components/Layout'
import { GUIDES } from '../data/guides'
import { useI18n } from '../lib/i18n'
import { useMode } from '../lib/mode'
import { GuideCard } from '../components/business/guides'

/** /guides?tab=out|in — travel guides for both audiences; the tab defaults to the current audience. */
export default function Guides() {
  const { t } = useI18n()
  const { mode } = useMode()
  const [sp, setSp] = useSearchParams()
  const tab = sp.get('tab') === 'in' || sp.get('tab') === 'out' ? sp.get('tab') : mode
  const list = GUIDES.filter((g) => g.mode === tab)
  return (
    <>
      <PageHead>
        <h1 className="text-3xl font-bold sm:text-4xl">{t('gd.title')}</h1>
        <p className="mt-2 max-w-2xl text-muted">{t('gd.sub')}</p>
      </PageHead>
      <div className="container-x py-10">
        <div role="tablist" aria-label={t('gd.tabs')} className="inline-flex rounded-md border border-line bg-white p-1">
          {['out', 'in'].map((m) => (
            <button key={m} type="button" role="tab" aria-selected={tab === m} onClick={() => setSp({ tab: m }, { replace: true, preventScrollReset: true })}
              className={`rounded-[3px] px-5 py-2 text-sm font-semibold transition ${tab === m ? 'bg-ink text-white' : 'text-muted hover:text-ink'}`}>{t(`gd.${m}`)}</button>
          ))}
        </div>
        <div role="tabpanel" className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((g) => <GuideCard key={g.slug} g={g} />)}</div>
        <p className="mt-10 text-center text-xs text-muted">{t('gd.note')}</p>
      </div>
    </>
  )
}
