import SearchTabs from '../components/SearchTabs'
import Icon from '../components/Icon'
import { Reveal } from '../components/ui'
import { useI18n } from '../lib/i18n'
import { media } from '../data/catalog'

/* Home, top to bottom, each thing once:
   search → airlines we book → product sections (src/home/*: popular flights, holidays, visa check, events) → how booking works.
   Products without a home section (hotels, cars, eSIM, transfers) are reached from the search tabs and the menu. */
const SECTIONS = Object.values(import.meta.glob('../home/*.jsx', { eager: true }))
  .flatMap((m) => m.default)
  .sort((a, b) => a.order - b.order)

const AIRLINES = ['IA', 'IF', 'TK', 'QR', 'EK', 'FZ', 'RJ', 'PC', 'J2', 'MS', 'ME', 'G9']

function Hero() {
  const { t } = useI18n()
  return (
    <section className="relative isolate flex min-h-[440px] items-center overflow-hidden bg-ink pt-18 sm:h-[52svh]">
      <img src={media('hero-wing')} alt="" fetchPriority="high" className="absolute inset-0 -z-20 size-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-l from-ink/85 via-ink/45 to-ink/30 ltr:bg-gradient-to-r" />
      <div className="container-x pb-24">
        <h1 className="max-w-2xl text-4xl leading-[1.25] font-bold text-white sm:text-6xl">{t('hero.title')}</h1>
        <p className="mt-4 max-w-xl text-lg leading-8 text-white/80">{t('hero.sub')}</p>
      </div>
    </section>
  )
}

function AirlineStrip() {
  const { t } = useI18n()
  return (
    <section className="border-b border-line bg-white py-8">
      <p className="mb-6 text-center text-sm text-muted">{t('home.airlines')}</p>
      <div className="container-x flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
        {AIRLINES.map((c) => <img key={c} src={`https://pics.avs.io/200/80/${c}.png`} alt={c} loading="lazy" className="h-8 w-auto object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0" />)}
      </div>
    </section>
  )
}

function HowItWorks() {
  const { t } = useI18n()
  return (
    <section className="border-t border-line bg-mist/60 py-20">
      <div className="container-x">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('how.title')}</h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <Reveal as="li" key={n} delay={n * 80}>
              <span className="grid size-10 place-items-center rounded-full bg-ink font-bold text-white">{n}</span>
              <h3 className="mt-4 text-lg font-bold">{t(`how.${n}`)}</h3>
              <p className="mt-1.5 text-sm leading-7 text-muted">{t(`how.${n}d`)}</p>
            </Reveal>
          ))}
        </ol>
        <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6 text-sm text-ink/75">
          {['trust.price', 'trust.pay', 'trust.docs', 'trust.office'].map((k) => <li key={k} className="flex items-center gap-2"><Icon name="check" className="size-4 text-emerald-600" />{t(k)}</li>)}
        </ul>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <section className="container-x relative z-10 -mt-20"><SearchTabs /></section>
      <div className="mt-10"><AirlineStrip /></div>
      {SECTIONS.map(({ id, Component }) => <Component key={id} />)}
      <HowItWorks />
    </>
  )
}
