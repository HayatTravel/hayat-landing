/* Visiting Iraq: helpers shared by pages, home sections, search tabs and orders. `i` is useI18n(). */
import { useEffect } from 'react'
import { useMode } from '../../lib/mode'
import { addDaysIso, inDays } from '../../lib/i18n'
import { NATIONS, PLACES, TOURS, VISA_KIND, nationBy, placeBy, tourBy } from '../../data/incoming'
import { int } from '../stays/lib'

export { int }

/** Pages under /visit belong to the "Visiting Iraq" site: arriving here switches the header to that audience. */
export function useVisitMode() {
  const { mode, setMode } = useMode()
  useEffect(() => { if (mode !== 'in') setMode('in') }, []) // eslint-disable-line react-hooks/exhaustive-deps
}

/** Group departures as ISO dates; null for tours that run any day. */
export const tourDates = (tour) => (tour.dates ? tour.dates.map((o) => inDays(o)) : null)
/** Earliest bookable date for "any day" tours (we need a few days to arrange guide and permits). */
export const firstDay = () => inDays(5)
export const isDate = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s)
export const validTourDate = (tour, d) => (tour.dates ? tourDates(tour).includes(d) : isDate(d) && d >= firstDay())
export const tourEnd = (tour, d) => addDaysIso(d, Math.max(0, tour.days - 1))
export const tourQ = (q = {}) => ({ ad: int(q.ad, 2, 1, 12) })
export const toursFor = (placeId) => TOURS.filter((x) => x.places.includes(placeId))
export const placesFor = (theme) => PLACES.filter((p) => p.themes.includes(theme))
/** Tours whose departures (or any-day availability) fall in a YYYY-MM month. */
export const inMonth = (tour, m) => !m || !tour.dates || tourDates(tour).some((d) => d.startsWith(m))

/** Visa guidance for a nationality and region ('fed' | 'krg'). */
export function visaFor(nat, region = 'fed') {
  const n = nationBy(nat)
  if (!n) return null
  const kind = region === 'krg' ? n.krg : n.fed
  return { nation: n, region, kind, ...VISA_KIND[kind] }
}
export const nationOptions = (i) => [...NATIONS].sort((a, b) => i.L(a.name).localeCompare(i.L(b.name))).map((n) => ({ value: n.code, title: i.L(n.name) }))

export { NATIONS, PLACES, TOURS, nationBy, placeBy, tourBy }
