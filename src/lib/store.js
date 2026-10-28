import { useSyncExternalStore } from 'react'

/* Mock client state kept in localStorage: the signed-in customer, their trips, saved travellers, preferences.
   In production: the customer session lives on the website server (IAM), trips come from GET /api/v1/customer/orders. */
const KEY = (k) => `hayat-${k}`
const listeners = new Set()
const get = (k, d) => { try { return JSON.parse(localStorage.getItem(KEY(k))) ?? d } catch { return d } }
const set = (k, v) => { try { localStorage.setItem(KEY(k), JSON.stringify(v)) } catch { /* blocked */ } listeners.forEach((f) => f()) }
let version = 0
const subscribe = (f) => { const g = () => { version += 1; f() }; listeners.add(g); return () => listeners.delete(g) }

/** Re-render when any stored value changes. */
export const useStore = () => useSyncExternalStore(subscribe, () => version)

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
