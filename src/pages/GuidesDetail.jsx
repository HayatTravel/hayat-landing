import { Link, useParams } from 'react-router'
import Icon from '../components/Icon'
import { PageHead } from '../components/Layout'
import { GUIDES, guideBy } from '../data/guides'
import { useI18n } from '../lib/i18n'
import { GuideCard, MinRead, guideImg } from '../components/business/guides'
import { HelpLine, Pic } from '../components/services/ui'

/** /guides/:slug — one article: intro, sections, "Good to know", related products, last update, one help line. */
export default function GuidesDetail() {
  const i = useI18n(); const { t, L } = i
  const { slug } = useParams()
  const g = guideBy(slug)
  if (!g) {
    return (
      <>
        <PageHead><h1 className="text-3xl font-bold">{t('gd.notFound')}</h1></PageHead>
        <div className="container-x py-16 text-center"><Link to="/guides" className="btn-primary">{t('gd.all')}</Link></div>
      </>
    )
  }
  const title = L(g.title)
  const { src, credit } = guideImg(g)
  const more = GUIDES.filter((x) => x.mode === g.mode && x.slug !== g.slug).slice(0, 3)
  return (
    <>
      <PageHead>
        <Link to={`/guides?tab=${g.mode}`} className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-white"><Icon name="arrow" className="size-4 ltr:-scale-x-100" /> {t(`gd.${g.mode}`)}</Link>
        <h1 className="max-w-3xl text-3xl leading-tight font-bold sm:text-4xl">{title}</h1>
        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted"><MinRead g={g} /><span>{t('gd.updated', { d: i.date(g.updated, { year: true }) })}</span></p>
      </PageHead>
      <div className="container-x grid gap-10 py-10 lg:grid-cols-[1fr_300px]">
        <article className="min-w-0 max-w-3xl">
          <figure>
            {src ? <img src={src} alt={title} className="aspect-[16/9] w-full rounded-lg object-cover" /> : <Pic src={null} alt={title} label={title} className="aspect-[16/9] w-full rounded-lg" />}
            {credit && <figcaption className="mt-1.5 text-[11px] text-muted"><a href={credit.page} target="_blank" rel="noopener noreferrer" className="hover:underline">{t('gd.photo', { by: credit.by, lic: credit.lic })}</a></figcaption>}
          </figure>
          <p className="mt-8 text-lg leading-8 text-ink/85">{L(g.intro)}</p>
          {g.sections.map((s, k) => (
            <section key={k} id={`s${k + 1}`} className="mt-10 scroll-mt-24">
              <h2 className="text-xl font-bold">{L(s.h)}</h2>
              <p className="mt-3 leading-8 text-ink/85">{L(s.p)}</p>
            </section>
          ))}
          <aside className="mt-10 rounded-lg border border-emerald-200 bg-emerald-50/60 p-6" aria-labelledby="gdGood">
            <h2 id="gdGood" className="flex items-center gap-2 font-bold"><Icon name="info" className="size-5 text-emerald-700" />{t('gd.good')}</h2>
            <ul className="mt-4 space-y-2.5">
              {g.good.map((x, k) => <li key={k} className="flex items-start gap-2.5 text-sm leading-6"><Icon name="check" className="mt-1 size-3.5 shrink-0 text-emerald-700" strokeWidth={3} />{L(x)}</li>)}
            </ul>
          </aside>
          <p className="mt-6 text-xs text-muted">{t('gd.note')}</p>
        </article>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <nav className="card p-5" aria-labelledby="gdToc">
            <h2 id="gdToc" className="text-sm font-bold">{t('gd.contents')}</h2>
            <ol className="mt-3 space-y-2 text-sm">{g.sections.map((s, k) => <li key={k}><a href={`#s${k + 1}`} className="text-ink/75 hover:text-brand">{L(s.h)}</a></li>)}</ol>
          </nav>
          <div className="card p-5">
            <h2 className="text-sm font-bold">{t('gd.related')}</h2>
            <ul className="mt-3 space-y-2">
              {g.related.map(([to, ic, label]) => (
                <li key={to}><Link to={to} className="group flex items-center gap-3 rounded-md border border-line p-3 text-sm font-semibold transition hover:border-brand">
                  <span className="grid size-8 shrink-0 place-items-center rounded-md bg-mist text-brand-600"><Icon name={ic} className="size-4" /></span>
                  <span className="flex-1">{L(label)}</span><Icon name="arrow" className="size-4 text-muted group-hover:text-brand rtl:-scale-x-100" />
                </Link></li>
              ))}
            </ul>
            <div className="mt-4 text-center"><HelpLine ctx={title} /></div>
          </div>
        </aside>
      </div>
      {more.length > 0 && (
        <section className="border-t border-line bg-mist/50 py-14">
          <div className="container-x">
            <h2 className="mb-6 text-2xl font-bold">{t('gd.more')}</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{more.map((x) => <GuideCard key={x.slug} g={x} />)}</div>
          </div>
        </section>
      )}
    </>
  )
}
