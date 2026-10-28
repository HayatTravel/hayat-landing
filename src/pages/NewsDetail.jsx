import { Link, useParams } from 'react-router'
import Icon from '../components/Icon'
import { useI18n } from '../lib/i18n'
import { NEWS } from '../data/company'
import { Hero, Sample } from '../components/company/ui'
import NotFound from './NotFound'

/** /news/:id — one announcement (sample) with a link to the page it is about. */
export default function NewsDetail() {
  const i = useI18n(); const { t } = i
  const { id } = useParams()
  const n = NEWS.find((x) => x.id === id)
  if (!n) return <NotFound />
  const more = NEWS.filter((x) => x.id !== n.id).slice(0, 3)
  return (
    <>
      <Hero back={['/news', t('cp.news.title')]} title={i.L(n.title)}>
        <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted"><time dateTime={n.date}>{i.date(n.date, { year: true })}</time> · {t(`cp.tag.${n.tag}`)} <Sample /></p>
      </Hero>
      <article className="container-x max-w-3xl py-12">
        <div className="space-y-4 text-lg leading-9 text-ink/85">{n.body.map((p, k) => <p key={k}>{i.L(p)}</p>)}</div>
        {(n.link || n.href) && (n.href
          ? <a href={n.href} rel="noopener" className="btn-primary mt-8">{t('cp.news.go')}<Icon name="arrow" className="size-4 rtl:-scale-x-100" /></a>
          : <Link to={n.link} className="btn-primary mt-8">{t('cp.news.go')}<Icon name="arrow" className="size-4 rtl:-scale-x-100" /></Link>)}
        <h2 className="mt-14 mb-4 font-bold">{t('cp.news.more')}</h2>
        <ul className="divide-y divide-line border-y border-line">{more.map((x) => <li key={x.id}><Link to={`/news/${x.id}`} className="flex justify-between gap-4 py-3 hover:text-brand"><span>{i.L(x.title)}</span><time className="shrink-0 text-sm text-muted" dateTime={x.date}>{i.date(x.date)}</time></Link></li>)}</ul>
      </article>
    </>
  )
}
