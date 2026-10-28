// Traveller details live in sessionStorage, never in the URL.
const KEY = 'hayat-passengers'
const demo = [
  { title: 'السيد', first: 'علي', last: 'الحسيني', dob: '1990-04-12', passport: 'A12345678' },
  { title: 'السيدة', first: 'زينب', last: 'الحسيني', dob: '1993-09-03', passport: 'A87654321' },
  { title: 'السيد', first: 'حسن', last: 'الحسيني', dob: '2015-01-20', passport: 'A11223344' },
]
const blank = { title: 'السيد', first: '', last: '', dob: '', passport: '' }

export function loadPassengers(pax) {
  let saved = []
  try { saved = JSON.parse(sessionStorage.getItem(KEY)) || [] } catch { /* storage blocked: fall back to demo */ }
  return Array.from({ length: pax }, (_, i) => saved[i] || demo[i] || { ...blank })
}

export function savePassengers(list) {
  try { sessionStorage.setItem(KEY, JSON.stringify(list)) } catch { /* non-critical */ }
}

export const paxName = (p, i) => (p?.first ? `${p.first} ${p.last}` : `المسافر ${i + 1}`)
