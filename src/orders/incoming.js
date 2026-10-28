/* Checkout contracts for visitors to Iraq (see lib/products.js).
   tour:  /checkout?type=tour&id&date&ad&lang&nat     (date = ISO start; lang = guide language code; nat = passport country code)
   ivisa: /checkout?type=ivisa&nat&region&ad          (region = fed | krg) */
import { GUIDE_LANGS, PLACES, nationBy, photo, tourBy } from '../data/incoming'
import { int, plural, withQs } from '../components/stays/lib'
import { tourEnd, tourQ, validTourDate, visaFor } from '../components/incoming/lib'

const SIM = 12
const MEET = 45

function tour(q, i) {
  const { t } = i
  const x = tourBy(q.id)
  if (!x || !validTourDate(x, q.date)) return null
  const { ad } = tourQ(q)
  const lang = GUIDE_LANGS.includes(q.lang) ? q.lang : 'en'
  const nat = nationBy(q.nat)
  // A tour entirely inside the Kurdistan Region follows the Region's entry rules; anything else, Federal Iraq's.
  const region = x.places.every((id) => PLACES.find((p) => p.id === id)?.region === 'krg') ? 'krg' : 'fed'
  const v = nat ? visaFor(nat.code, region) : null
  return {
    title: i.L(x.title),
    sub: `${x.days === 1 ? t('iq.dayTrip') : plural(i, 'iq.days', x.days)} · ${t(x.type === 'group' ? 'iq.group' : 'iq.private')}`,
    img: photo(x.photo),
    facts: [
      [t('iq.start'), i.date(q.date, { weekday: true })],
      ...(x.days > 1 ? [[t('iq.end'), i.date(tourEnd(x, q.date), { weekday: true })]] : []),
      [t('pk.trav'), plural(i, 'st.travellers', ad)],
      [t('iq.guideLang'), t(`iq.lang.${lang}`)],
      ...(nat ? [[t('iq.visa.nat'), i.L(nat.name)]] : []),
    ],
    price: [{ label: t('pk.line', { who: plural(i, 'st.travellers', ad), price: i.money(x.price) }), usd: x.price * ad }],
    travellers: { count: ad, fields: ['name', 'dob', 'passport'], note: t('iq.travNote') },
    extras: [
      ...(x.type === 'group' ? [{ id: 'private', label: t('iq.x.private'), sub: t('iq.x.privateD'), usd: x.privateAdd, per: 'traveller' }] : []),
      { id: 'meet', label: t('iq.x.meet'), sub: t('iq.x.meetD'), usd: MEET, per: 'booking' },
      { id: 'sim', label: t('iq.x.sim'), sub: t('iq.x.simD'), usd: SIM, per: 'traveller' },
      ...(v && v.kind !== 'free' ? [{ id: 'visa', label: t('iq.x.visa'), sub: t(`iq.kind.${v.kind}`), usd: v.fee + v.service, per: 'traveller' }] : []),
    ],
    hold: 60,
    terms: t('iq.tourTerms'),
    docs: [t('iq.doc.programme'), t('iq.doc.guide'), t('st.receipt')],
    back: withQs(`/visit/tours/${x.id}`, { date: q.date, ad, lang, nat: q.nat }),
  }
}

function ivisa(q, i) {
  const { t } = i
  const region = q.region === 'krg' ? 'krg' : 'fed'
  const v = visaFor(q.nat, region)
  if (!v) return null
  const ad = int(q.ad, 1, 1, 12)
  const price = [{ label: t('iq.visa.serviceLine', { n: i.num(ad) }), usd: v.service * ad }]
  if (v.fee) price.unshift({ label: t('iq.visa.feeLine', { n: i.num(ad) }), usd: v.fee * ad })
  return {
    title: t('iq.visa.orderTitle', { region: t(`iq.region.${region}`) }),
    sub: `${i.L(v.nation.name)} · ${t(`iq.kind.${v.kind}`)}`,
    img: photo(region === 'krg' ? 'erbil' : 'baghdad'),
    facts: [[t('iq.visa.nat'), i.L(v.nation.name)], [t('iq.visa.region'), t(`iq.region.${region}`)], [t('iq.visa.time'), v.days ? plural(i, 'iq.visa.days', v.days) : t('iq.visa.onArrival')], [t('pk.trav'), plural(i, 'st.travellers', ad)]],
    price,
    travellers: { count: ad, fields: ['name', 'dob', 'passport'], note: t('iq.travNote') },
    uploads: v.docs.filter((d) => d === 'passport' || d === 'photo').map((d) => ({ id: d, label: t(`iq.doc.${d}`) })),
    extras: [
      // An invitation letter is part of the "apply in advance" route; other routes do not need one.
      ...(v.kind === 'advance' ? [{ id: 'invite', label: t('iq.x.invite'), sub: t('iq.x.inviteD'), usd: 60, per: 'booking', required: true }] : []),
      { id: 'meet', label: t('iq.x.meet'), sub: t('iq.x.meetD'), usd: MEET, per: 'booking' },
    ],
    hold: null,
    terms: t('iq.visa.terms'),
    docs: [t(v.kind === 'free' ? 'iq.doc.entryNote' : 'iq.doc.visa'), t('st.receipt')],
    back: withQs('/visit/visa', { nat: v.nation.code, region }),
  }
}

export default { tour, ivisa }
