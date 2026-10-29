import { Link, useLoaderData } from 'react-router'
import { catalog } from '../lib/catalog.server'
import { flag } from '../lib/format'
import { useI18n } from '../lib/i18n'
import { Arrow, FromPrice, Head } from '../components/services/ui'
import { minPlan } from '../components/services/data'

export const loader = async () => ({ countries: await catalog.esim.countries() })

/** eSIM step 1a: choose a country. */
export default function Esim() {
  const { t, L } = useI18n()
  const { countries } = useLoaderData()
  return (
    <>
      <Head title={t('es.title')} sub={t('es.sub')} />
      <div className="container-x py-10">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {countries.map((c) => (
            <li key={c.cc}>
              <Link to={`/esim/${c.cc}`} className="card card-hover group flex h-full items-center gap-4 p-4">
                <img src={flag(c.cc)} alt="" className="size-12 shrink-0 rounded-full object-cover ring-1 ring-line" />
                <span className="min-w-0 flex-1">
                  <b className="block truncate">{L(c.name)}</b>
                  <span className="text-xs text-muted">{t('es.net')}: <bdi dir="ltr">{c.net}</bdi></span>
                </span>
                <FromPrice usd={minPlan(c)} />
                <Arrow className="size-4 shrink-0 text-muted transition group-hover:text-brand" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
