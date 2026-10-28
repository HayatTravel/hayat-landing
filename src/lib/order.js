import { airports, airlines, fareOf, farePrice, findFlight, seatFee } from '../data/flights'
import { findHotel, cityName } from '../data/hotels'
import { esimCountries, esimPlans } from '../data/esim'
import { findDeal } from '../data/deals'
import { carExtras, findCar, rentalDays } from '../data/cars'
import { transferPrice, vehicles, zones } from '../data/transfers'
import { airports as ap } from '../data/flights'
import { dateAr, hm } from './format'

export const steps = {
  flight: ['الرحلة', 'المسافرون', 'المقاعد والإضافات', 'الدفع', 'التأكيد'],
  hotel: ['الفندق', 'الغرفة', 'الدفع', 'التأكيد'],
  esim: ['الدولة', 'الباقة', 'الدفع', 'التفعيل'],
  deal: ['العرض', 'التفاصيل', 'الدفع', 'التأكيد'],
  car: ['السيارة', 'الإضافات', 'الدفع', 'التأكيد'],
  transfer: ['الرحلة', 'المركبة', 'الدفع', 'التأكيد'],
}
export const stepOf = (type, name) => steps[type].indexOf(name)

export const bagPrice = 45_000
export const mealPrice = 15_000

const nightsBetween = (a, b) => Math.max(1, Math.round((new Date(b) - new Date(a)) / 864e5))

// Rebuilds the order purely from URL params so every step is deep-linkable.
export function buildOrder(sp) {
  const p = Object.fromEntries(sp)
  if (p.type === 'flight') {
    const f = findFlight(p, p.id)
    if (!f) return null
    const pax = +p.pax || 1
    const fare = fareOf(p.fare)
    const tickets = farePrice(f, fare.id)
    const seats = p.seats ? p.seats.split(' ').filter(Boolean) : []
    const seatCost = fare.seatFree ? 0 : seats.length * seatFee
    const bags = +p.bag || 0
    const meals = p.meal === '1' ? pax : 0
    return {
      type: 'flight', logo: f.code, flight: f, fare, pax,
      title: `${airports[f.from].city} ← ${airports[f.to].city}`,
      subtitle: `${airlines[f.code].name} · ${f.number} · ${fare.name}`,
      lines: [
        ['التاريخ', dateAr(f.date)],
        ['المغادرة', hm(f.dep)],
        ['المسافرون', `${pax}`],
        ['المقاعد', seats.join(' ') || 'تلقائي'],
        [`التذاكر (${fare.name}) × ${pax}`, tickets],
        ...(seatCost ? [[`اختيار المقاعد × ${seats.length}`, seatCost]] : []),
        ...(bags ? [[`حقيبة إضافية × ${bags}`, bags * bagPrice]] : []),
        ...(meals ? [[`وجبة مميزة × ${meals}`, meals * mealPrice]] : []),
      ],
      total: tickets + seatCost + bags * bagPrice + meals * mealPrice,
    }
  }
  if (p.type === 'hotel') {
    const h = findHotel(p.id)
    const room = h?.rooms.find((r) => r.id === p.room)
    if (!room) return null
    const n = nightsBetween(p.in, p.out)
    return {
      type: 'hotel', img: h.gallery[0],
      title: h.name, subtitle: `${room.name} · ${cityName(h.city)}`,
      lines: [['الوصول', dateAr(p.in)], ['المغادرة', dateAr(p.out)], ['الضيوف', p.guests || '2'], [`${n} ليالٍ × السعر`, room.price * n]],
      total: room.price * n,
    }
  }
  if (p.type === 'esim') {
    const c = esimCountries.find((x) => x.cc === p.cc)
    const plan = c && esimPlans(c).find((x) => x.id === p.plan)
    if (!plan) return null
    return {
      type: 'esim', flag: c.cc,
      title: `eSIM ${c.name}`, subtitle: `${plan.days} يوماً · ${plan.unit === "GB" ? plan.data + "GB" : plan.unit}`,
      lines: [['الشبكة', c.network], ['الصلاحية', `${plan.days} يوماً من التفعيل`], ['الباقة', plan.price]],
      total: plan.price,
    }
  }
  if (p.type === 'deal') {
    const d = findDeal(p.id)
    if (!d) return null
    const pax = +p.pax || 2
    return {
      type: 'deal', img: d.img,
      title: d.title, subtitle: d.sub,
      lines: [['تاريخ السفر', dateAr(p.date)], ['المدة', `${d.nights} ليالٍ`], [`الباقة × ${pax}`, d.price * pax]],
      total: d.price * pax,
    }
  }
  if (p.type === 'car') {
    const c = findCar(p.city, p.id)
    if (!c) return null
    const days = rentalDays(p.pick, p.drop)
    const picked = carExtras.filter((x) => (p.extras || '').split(',').includes(x.id))
    return {
      type: 'car', img: c.img,
      title: c.name, subtitle: `${c.cat} · ${cityName(p.city)} · ${c.supplier}`,
      lines: [
        ['الاستلام', dateAr(p.pick)], ['التسليم', dateAr(p.drop)],
        [`${days} أيام × ${c.daily.toLocaleString('en')}`, c.daily * days],
        ...picked.map((x) => [x.name, x.perDay * days]),
      ],
      total: (c.daily + picked.reduce((a, x) => a + x.perDay, 0)) * days,
    }
  }
  if (p.type === 'transfer') {
    const v = vehicles.find((x) => x.id === p.vehicle)
    if (!v || !ap[p.airport]) return null
    const price = transferPrice(v, p)
    const chauffeur = p.mode === 'chauffeur'
    return {
      type: 'transfer', img: v.img,
      title: chauffeur ? `سيارة مع سائق · ${ap[p.airport].city}` : `${ap[p.airport].name} ← ${zones.find((z) => z.id === p.zone)?.name}`,
      subtitle: `${v.name} · ${v.model}`,
      lines: [
        ['التاريخ', dateAr(p.date)], ['الوقت', p.time], ['الركاب', p.pax],
        ...(chauffeur ? [['المدة', `${p.hours} ساعات`]] : []),
        [chauffeur ? 'الخدمة' : 'الرحلة', price],
      ],
      total: price,
    }
  }
  return null
}
