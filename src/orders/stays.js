/* Checkout contracts for hotels and holidays (see lib/products.js).
   hotel:   /checkout?type=hotel&id&room&in&out&rooms&ad&ch
   package: /checkout?type=package&id&dep&layout&ad&ch */
import D from '../data/catalog'
import { addDaysIso } from '../lib/i18n'
import { baseQ, depDates, freeUntil, guestsText, hotelBy, hq, isoOk, perPerson, pkgBy, plural, pq, travText, withQs } from '../components/stays/lib'

function hotel(q, i) {
  const { t } = i
  const h0 = hotelBy(q.id); const r = h0?.rooms.find((x) => x.id === q.room)
  if (!r || !isoOk(q.in) || !isoOk(q.out) || q.out <= q.in) return null
  const h = { ...hq(q), city: h0.city }
  const guests = h.ad + h.ch; const free = freeUntil(r, h.in)
  return {
    title: i.L(h0.name), sub: `${i.L(r.name)} · ${t(`ht.board.${r.board}`)}`, img: h0.img,
    facts: [[t('ht.checkin'), i.date(h.in, { weekday: true })], [t('ht.checkout'), i.date(h.out, { weekday: true })], [t('ht.nightsL'), i.num(h.n)], [t('ht.guestsL'), guestsText(i, h)]],
    price: [{ label: `${plural(i, 'st.nights', h.n)} × ${plural(i, 'st.rooms', h.rooms)}`, usd: r.base * h.rooms * h.n }],
    travellers: { count: 1, fields: ['name'], note: t('ht.leadNote') },
    extras: [
      // One transfer option; a private car is arranged on request (no two competing checkboxes).
      { id: 'sic', label: t('ht.x.sic'), sub: t('ht.x.sicD2'), usd: D.transfers.sic.price, per: 'traveller', count: guests },
      { id: 'late', label: t('ht.x.late'), sub: t('ht.x.lateD'), usd: 20 * h.rooms, per: 'booking' },
    ],
    hold: 60, // Booking Portal: hotels are paid within 60 minutes
    terms: free ? t('ht.terms', { date: i.date(free) }) : t('ht.termsLate'),
    docs: [t('ht.voucher'), t('st.receipt')],
    back: withQs(`/hotels/${h0.id}`, baseQ(h)),
  }
}

function pkg(q, i) {
  const { t } = i
  const p = pkgBy(q.id); if (!p) return null
  const lay = p.layouts.find((l) => l.id === q.layout)
  if (!lay || !depDates(p).includes(q.dep)) return null
  const { ad, ch } = pq(q); const pp = perPerson(p, lay)
  const price = [{ label: t('pk.line', { who: plural(i, 'st.adults', ad), price: i.money(pp) }), usd: pp * ad }]
  if (ch) price.push({ label: t('pk.childLine', { who: plural(i, 'st.children', ch), price: i.money(pp * 0.7) }), usd: Math.round(pp * 0.7 * ch) })
  return {
    title: i.L(p.title), sub: `${plural(i, 'st.nights', p.nights)} · ${t(`pk.layout.${lay.id}`)}`, img: p.img,
    facts: [[t('pk.depart'), i.date(q.dep, { weekday: true })], [t('pk.return'), i.date(addDaysIso(q.dep, p.nights), { weekday: true })],
      [t('pk.trav'), travText(i, { ad, ch })], [t('pk.flight'), t(`pk.flight.${p.flight}`)]],
    price,
    travellers: { count: ad + ch, fields: ['name', 'dob', 'nationality', 'passport'], note: t('pk.travNote') },
    extras: [
      { id: 'ins', label: t('pk.x.ins'), sub: t('pk.x.insD'), usd: 15, per: 'traveller' },
      ...(p.includes.includes('transfer') ? [{ id: 'vip', label: t('pk.x.vip'), sub: t('pk.x.vipD'), usd: D.transfers.vip.price * 2, per: 'booking' }] : []),
    ],
    hold: 60,
    terms: t('pk.terms'),
    docs: [t('pk.tickets'), t('ht.voucher'), t('pk.prog'), t('st.receipt')],
    back: withQs(`/holidays/${p.id}`, { dep: q.dep, layout: lay.id, ad, ch }),
  }
}

export default { hotel, package: pkg }
