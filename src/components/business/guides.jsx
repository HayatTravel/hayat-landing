/* Travel guide cards and image resolution (shared by /guides, the article page and the home rails). */
import { Link } from 'react-router'
import Icon from '../Icon'
import { PHOTOS } from '../../data/incoming'
import { readMins } from '../../data/guides'
import { useI18n } from '../../lib/i18n'
import { pic, pl } from '../services/data'
import { Pic } from '../services/ui'

/** { src, credit } for a guide: Wikimedia (credited), Unsplash id or media name. */
export const guideImg = (g) => (PHOTOS[g.img] ? { src: PHOTOS[g.img].src, credit: PHOTOS[g.img] } : { src: pic(g.img), credit: null })

export function MinRead({ g }) {
  const i = useI18n()
  return <span className="inline-flex items-center gap-1.5"><Icon name="clock" className="size-3.5" />{pl(i, readMins(g), 'gd.m')}</span>
}

export function GuideCard({ g, className = '' }) {
  const { L } = useI18n()
  const { src } = guideImg(g)
  return (
    <Link to={`/guides/${g.slug}`} className={`card card-hover group flex flex-col overflow-hidden ${className}`}>
      <div className="aspect-[16/10] overflow-hidden bg-mist">
        {src ? <img src={src} alt="" loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-105" /> : <Pic src={null} label={L(g.title)} className="size-full" />}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg leading-7 font-bold">{L(g.title)}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-muted">{L(g.intro)}</p>
        <p className="mt-auto flex items-center justify-between pt-4 text-xs text-muted"><MinRead g={g} /><Icon name="arrow" className="size-4 text-muted transition group-hover:text-brand rtl:-scale-x-100" /></p>
      </div>
    </Link>
  )
}
