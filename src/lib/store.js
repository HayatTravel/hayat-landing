import { useSyncExternalStore } from 'react'

/* Mock client state kept in localStorage: the signed-in customer, their trips, saved travellers, preferences.
   In production: the customer session lives on the website server (IAM), trips come from GET /api/v1/customer/orders. */
const KEY = (k) => `hayat-${k}`
const listeners = new Set()
// Browser storage is read only after hydration, so the first client render matches the server's (see root.jsx).
let hydrated = false
/** Called once after hydration; true when the visitor has stored mock data to render. */
export const markHydrated = () => { hydrated = true; try { return Object.keys({ ...localStorage, ...sessionStorage }).some((k) => k.startsWith('hayat-')) } catch { return false } }
export const isHydrated = () => hydrated
/** This site's origin in the browser; empty on the server and during hydration. */
export const origin = () => (hydrated ? location.origin : '')
const get = (k, d) => { if (!hydrated) return d; try { return JSON.parse(localStorage.getItem(KEY(k))) ?? d } catch { return d } }
const set = (k, v) => { try { localStorage.setItem(KEY(k), JSON.stringify(v)) } catch { /* blocked */ } listeners.forEach((f) => f()) }
let version = 0
const subscribe = (f) => { const g = () => { version += 1; f() }; listeners.add(g); return () => listeners.delete(g) }

/** Re-render when any stored value changes. */
export const useStore = () => useSyncExternalStore(subscribe, () => version, () => 0)

export const store = { get, set }

export const session = {
  user: () => get('user', null),
  signIn: (u) => set('user', u),
  signOut: () => set('user', null),
}

export const trips = {
  list: () => get('trips', []),
  find: (ref) => trips.list().find((b) => b.ref === String(ref || '').toUpperCase()),
  save: (b) => set('trips', [b, ...trips.list().filter((x) => x.ref !== b.ref)].slice(0, 40)),
  update: (ref, patch) => { const b = trips.find(ref); if (b) trips.save({ ...b, ...patch }) },
}

export const newRef = () => {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = 'HY'
  for (let i = 0; i < 6; i += 1) s += a[Math.floor(Math.random() * a.length)]
  return s
}

/* Opening the help chat from anywhere: <button onClick={() => openHelp('context')}> */
export const openHelp = (ctx = '') => window.dispatchEvent(new CustomEvent('hayat:help', { detail: ctx }))
/* Opening the sign-in dialog from anywhere; `after` runs once signed in. */
export const openSignIn = (after) => window.dispatchEvent(new CustomEvent('hayat:signin', { detail: after }))

/* Preferences the server must see on first paint (language, currency, audience) are cookies. */
/** Read cookie `name` from a Cookie header (server). */
export const cookie = (header, name) => header?.match(new RegExp(`(?:^|; *)${name}=([^;]*)`))?.[1]
export const setCookie = (name, value) => { document.cookie = `${name}=${value}; Path=/; Max-Age=31536000; SameSite=Lax` }
