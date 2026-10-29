import { useEffect, useState } from 'react'
import { Links, Meta, Outlet, Scripts, useRouteLoaderData } from 'react-router'
import './index.css'
import { I18nProvider, LANG_INFO, useI18n } from './lib/i18n'
import { loadExtra } from './i18n'
import { ModeProvider } from './lib/mode'
import { cookie, markHydrated } from './lib/store'
import NotFound from './pages/NotFound'

/* Language, currency and audience come from ?lang/?mode or the visitor's cookies, so the server renders
   the right language and direction on first paint. */
export async function loader({ request }) {
  const q = new URL(request.url).searchParams
  const h = request.headers.get('cookie')
  const pick = (k, ok, d) => [q.get(k), cookie(h, `hayat-${k}`)].find(ok) ?? d
  const lang = pick('lang', (l) => !!LANG_INFO[l], 'ar')
  await loadExtra(lang)
  return { lang, cur: pick('cur', (c) => c === 'USD', 'IQD'), mode: pick('mode', (m) => m === 'in', 'out') }
}

function Html({ children }) {
  const { lang } = useI18n()
  return (
    <html lang={lang} dir={LANG_INFO[lang].dir}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0B1220" />
        <title>{LANG_INFO[lang].title}</title>
        <meta name="description" content="طيران وفنادق وعطلات وتأجير سيارات وتأشيرات وشرائح eSIM وتذاكر فعاليات من العراق." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=Readex+Pro:wght@500;600;700&display=swap" rel="stylesheet" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

export function Layout({ children }) {
  const p = useRouteLoaderData('root') ?? { lang: 'ar', cur: 'IQD', mode: 'out' }
  return (
    <I18nProvider lang={p.lang} cur={p.cur}>
      <ModeProvider mode={p.mode}>
        <Html>{children}</Html>
      </ModeProvider>
    </I18nProvider>
  )
}

export default function App() {
  // ponytail: the mock session/trips live in browser storage, which the server cannot see. Pages render from
  // server defaults, then remount once with the stored data. Goes away when JW-1 moves the session to the server.
  const [key, setKey] = useState(0)
  useEffect(() => { if (markHydrated()) setKey(1) }, [])
  return <Outlet key={key} />
}

export function ErrorBoundary() {
  return <NotFound />
}
