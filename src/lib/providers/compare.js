/* Price comparison adapter — MOCK implementation for the design mockup.

   Real contract (website server; affiliate keys never reach the browser):
     GET /api/v1/compare?kind=flight|hotel|car&…search params → [{ id, name, url, price, currency, fetchedAt }]
   The server asks each partner's affiliate API for a live price for the same search and returns the deep link
   with Hayat's affiliate id. Notes for the developer:
     - price is null when a partner has no price for the search, or when its programme does not allow showing
       its price on our site (several programmes restrict price display; then show the link only).
     - URLs below are best-effort public search links; confirm each partner's deep-link format and affiliate
       parameter in its programme documentation (some need their own location / airport ids).
     - Links open in a new tab with rel="noopener sponsored" and are labelled as partner links.
   This mock returns price: null for every partner, so the UI never shows an invented price. */

export const AFFILIATE = 'HAYAT_AFFILIATE'
const u = (base, params) => `${base}?${new URLSearchParams(Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => [k, String(v)]))}`
const ymd = (iso) => (iso ? iso.slice(2).replace(/-/g, '') : '') // 2026-11-12 → 261112 (Skyscanner)

const PARTNERS = {
  /** p: { from, to, d1, d2, ad, ch, inf, cabin } — IATA codes */
  flight: [
    { id: 'skyscanner', name: 'Skyscanner', url: (p) => u(`https://www.skyscanner.net/transport/flights/${p.from.toLowerCase()}/${p.to.toLowerCase()}/${ymd(p.d1)}/${p.d2 ? `${ymd(p.d2)}/` : ''}`, { adultsv2: p.ad, cabinclass: p.cabin || 'economy', associateid: AFFILIATE }) },
    { id: 'kiwi', name: 'Kiwi.com', url: (p) => u(`https://www.kiwi.com/en/search/results/${p.from}/${p.to}/${p.d1}/${p.d2 || 'no-return'}`, { adults: p.ad, children: p.ch, infants: p.inf, affilid: AFFILIATE }) },
    { id: 'trip', name: 'Trip.com', url: (p) => u('https://www.trip.com/flights/showfarefirst', { dcity: p.from.toLowerCase(), acity: p.to.toLowerCase(), ddate: p.d1, rdate: p.d2, triptype: p.d2 ? 'rt' : 'ow', quantity: p.ad, Allianceid: AFFILIATE }) },
  ],
  /** p: { city (English name), in, out, ad, ch, rooms } */
  hotel: [
    { id: 'booking', name: 'Booking.com', url: (p) => u('https://www.booking.com/searchresults.html', { ss: p.city, checkin: p.in, checkout: p.out, group_adults: p.ad, group_children: p.ch, no_rooms: p.rooms, aid: AFFILIATE }) },
    { id: 'agoda', name: 'Agoda', url: (p) => u('https://www.agoda.com/search', { q: p.city, checkIn: p.in, checkOut: p.out, adults: p.ad, children: p.ch, rooms: p.rooms, cid: AFFILIATE }) },
    { id: 'expedia', name: 'Expedia', url: (p) => u('https://www.expedia.com/Hotel-Search', { destination: p.city, startDate: p.in, endDate: p.out, adults: p.ad, affcid: AFFILIATE }) },
    { id: 'trip', name: 'Trip.com', url: (p) => u('https://www.trip.com/hotels/list', { keyword: p.city, checkin: p.in, checkout: p.out, adult: p.ad, children: p.ch, crn: p.rooms, Allianceid: AFFILIATE }) },
  ],
  /** p: { city (English name), pick, pt, drop, dt, age } */
  car: [
    { id: 'discovercars', name: 'DiscoverCars', url: (p) => u('https://www.discovercars.com/search', { location: p.city, pick_date: p.pick, pick_time: p.pt, drop_date: p.drop, drop_time: p.dt, a_aid: AFFILIATE }) },
    { id: 'rentalcars', name: 'Rentalcars.com', url: (p) => u('https://www.rentalcars.com/search-results', { location: p.city, puDate: p.pick, puTime: p.pt, doDate: p.drop, doTime: p.dt, driversAge: p.age === 'u25' ? 23 : 30, affiliateCode: AFFILIATE }) },
  ],
}

/** Partner rows for a search. Mock: synchronous data with price null; the real call is async (see above). */
export function partnersFor(kind, params) {
  return (PARTNERS[kind] || []).map((x) => ({ id: x.id, name: x.name, url: x.url(params), price: null, currency: null }))
}
