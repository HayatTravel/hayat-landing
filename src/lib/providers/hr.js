/* HR / Recruitment adapter — MOCK implementation for the design mockup.

   Hayat's HR platform lives in Accounting (branch feat/hr-platform-migration: Organization, People, Contracts, Probation,
   Jobs). It has no recruitment module yet. When a "Recruitment" module exists, the website server exposes it to the
   browser through these endpoints (the browser never talks to Accounting directly; no staff data reaches the client):

     GET  /api/v1/careers/postings?dept=&city=&type=&lang=
          → Posting[]   Posting = { id, title, dept, city, type: 'full'|'part'|'intern', summary, duties[], needs[],
                                    publishedAt, closesAt|null }   (texts already in the requested language)
     GET  /api/v1/careers/postings/:id                         → Posting | 404
     POST /api/v1/careers/applications  (multipart)
          { postingId, name, phone, email, note, cv: File, consent: true }
          → { reference: 'HR-XXXXXX', receivedAt }             (server stores the CV; virus-scans; links to Jobs/Organization)
     GET  /api/v1/careers/applications/status?reference=&phone=
          → { reference, postingId, title, stage: 'received'|'review'|'interview'|'decision', outcome: null|'offer'|'closed',
              history: [{ stage, at }] } | 404                  (phone must match; rate-limited)
     GET  /api/v1/careers/onboarding/:code
          → { firstName, role, office, startDate, checklist: [{ group, id, done }] } | 404
     PUT  /api/v1/careers/onboarding/:code/checklist  { id, done } → 204
          (onboarding codes come from the offer letter; on start the People/Contracts/Probation modules take over)

   This mock keeps everything in localStorage (store) so tracking and the checklist work in the browser. Swap the
   functions below for fetch() calls; the pages stay the same. */
import { ROLES } from '../../data/company'
import { store } from '../store'

export const STAGES = ['received', 'review', 'interview', 'decision']
export const DEMO_CODE = 'NJ-2026'

const norm = (p) => String(p || '').replace(/\D/g, '').slice(-9)

/** Open postings, optionally filtered. */
export function listPostings({ dept = '', city = '', type = '' } = {}) {
  return ROLES.filter((r) => (!dept || r.dept === dept) && (!city || r.city === city) && (!type || r.type === type))
}
export const getPosting = (id) => ROLES.find((r) => r.id === id) || null

/** Save an application; returns { reference, receivedAt }. */
export function submitApplication({ postingId, name, phone, email, note, cvName }) {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let reference = 'HR-'
  for (let k = 0; k < 6; k += 1) reference += a[Math.floor(Math.random() * a.length)]
  const receivedAt = Date.now()
  store.set('hr-apps', [{ reference, postingId, name, phone: norm(phone), email, note, cvName, receivedAt }, ...store.get('hr-apps', [])].slice(0, 30))
  return { reference, receivedAt }
}

/** Status by reference + phone, or null. Mock timeline: in review after 2 minutes, interview stage after a day. */
export function applicationStatus(reference, phone) {
  const r = String(reference || '').trim().toUpperCase()
  const app = store.get('hr-apps', []).find((x) => x.reference === r && x.phone === norm(phone))
  if (!app) return null
  const age = Date.now() - app.receivedAt
  const n = age > 864e5 ? 2 : age > 12e4 ? 1 : 0
  const at = [app.receivedAt, app.receivedAt + 12e4, app.receivedAt + 864e5]
  return { reference: app.reference, postingId: app.postingId, stage: STAGES[n], outcome: null, history: STAGES.slice(0, n + 1).map((s, k) => ({ stage: s, at: at[k] })) }
}

/** New-joiner record for an onboarding code, or null. Mock: only the demo code is known. */
export function onboarding(code) {
  const c = String(code || '').trim().toUpperCase()
  if (c !== DEMO_CODE) return null
  return { code: c, firstName: null, role: 'travel-consultant', office: 'baghdad', startDate: null }
}
export const checklistDone = (code) => new Set(store.get(`hr-onb-${code || 'public'}`, []))
export const setChecklist = (code, ids) => store.set(`hr-onb-${code || 'public'}`, [...ids])
