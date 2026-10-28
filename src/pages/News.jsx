import { Link } from 'react-router'
import { useI18n } from '../lib/i18n'
import { NEWS } from '../data/company'
import { Hero, Sample } from '../components/company/ui'

/** /news — announcements from Hayat (samples), newest first. */
export default function News() {
  const i = useI18n(); const { t } = i
  const list = [...NEWS].sort((a, b) => (a.date < b.date ? 1 : -1))
  return (
    <>
      <Hero title={t('cp.news.title')} lede={t('cp.news.lede')}><div className="mt-4"><Sample /></div></Hero>
      <div className="container-x py-12">
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((n) => (
            <li key={n.id}>
              <Link to={`/news/${n.id}`} className="card card-hover flex h-full flex-col p-6">
                <p className="flex items-center gap-2 text-xs text-muted"><time dateTime={n.date}>{i.date(n.date, { year: true })}</time> · {t(`cp.tag.${n.tag}`)}</p>
                <h2 className="mt-2 text-lg leading-snug font-bold">{i.L(n.title)}</h2>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink/70">{i.L(n.body[0])}</p>
                <span className="mt-auto pt-4 text-sm font-semibold text-brand">{t('cp.news.read')}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </>
  )
}
