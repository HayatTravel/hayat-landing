import SearchTabs from '../components/SearchTabs'
import { useFeatured } from '../components/TabFeatured'
import { ModeSwitch } from '../components/Layout'
import { useI18n } from '../lib/i18n'
import { HOME_SECTIONS } from './Home'
import { Credit, Img } from '../components/incoming/ui'
import { useVisitMode } from '../components/incoming/lib'

const SECTIONS = HOME_SECTIONS.filter((x) => x.mode === 'in')

/** /visit — the "Visiting Iraq" home: hero, search (tours · flights to Iraq · visa · hotels), then the incoming sections. */
export default function VisitHome() {
  const featured = useFeatured(SECTIONS)
  useVisitMode()
  const { t } = useI18n()
  return (
    <>
      <section className="relative isolate flex min-h-[500px] items-center overflow-hidden bg-ink pt-24 sm:min-h-[60svh] lg:pt-36">
        <Img k="ur" eager className="absolute inset-0 -z-20 size-full" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/85 via-ink/50 to-ink/25 rtl:bg-gradient-to-l" />
        <div className="container-x pb-24">
          <div className="mb-6"><ModeSwitch big /></div>
          <p className="text-sm font-semibold tracking-[0.2em] text-sky uppercase">{t('iq.hero.eyebrow')}</p>
          <h1 className="mt-3 max-w-3xl text-4xl leading-[1.2] font-bold text-white sm:text-6xl">{t('iq.hero.title')}</h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-white/80">{t('iq.hero.sub')}</p>
        </div>
        <Credit k="ur" light className="absolute end-4 bottom-24" />
      </section>
      <section className="container-x relative z-10 -mt-20"><SearchTabs /></section>
      {featured.node}
      {SECTIONS.filter((x) => x.id !== featured.taken).map(({ id, Component }) => <Component key={id} />)}
    </>
  )
}
