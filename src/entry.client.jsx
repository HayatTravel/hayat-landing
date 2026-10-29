import { startTransition, StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { HydratedRouter } from 'react-router/dom'
import { loadExtra } from './i18n'

/* Visitor languages (fa, tr, fr, de) load on demand; have the server's language ready before hydrating. */
loadExtra(document.documentElement.lang).then(() => startTransition(() => {
  hydrateRoot(document, <StrictMode><HydratedRouter /></StrictMode>)
}))
