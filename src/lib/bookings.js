// Bookings made in this browser, so "manage booking" can find them again by reference.
const KEY = 'hayat-bookings'
const all = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} } }

export function saveBooking(ref, sp) {
  const q = new URLSearchParams(sp)
  q.delete('ref')
  try { localStorage.setItem(KEY, JSON.stringify({ ...all(), [ref]: q.toString() })) } catch { /* non-critical */ }
}

export const findBooking = (ref) => all()[ref.trim().toUpperCase()]
