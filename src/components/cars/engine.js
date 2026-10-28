/* Car rental (ported from Layth's data/cars.js, now trilingual and in USD). Deterministic per city.
   Query: city (location id), pick, pt (HH:MM), drop, dt, age=25|u25, id (car class). */
import D from '../../data/catalog'
import { addDaysIso, inDays } from '../../lib/i18n'
import { img } from '../../lib/format'
import { seed } from '../flights/engine'

/** Texts: ar, en, ku, plus optional { fa, tr, fr, de } for visitors (L() falls back to en). */
const N = (ar, en, ku, x = {}) => ({ ar, en, ku, ...x })

/** Pick-up cities: Iraqi airports and the destinations we sell. */
export const LOCATIONS = [
  ...['BGW', 'EBL', 'BSR', 'NJF', 'ISU'].map((c) => { const a = D.airports.find((x) => x.code === c); return { id: c.toLowerCase(), name: a.city, country: a.country, code: c, f: 0.9, img: 'transfer-car' } }),
  ...D.cities.filter((c) => c.slug !== 'maldives').map((c) => {
    const a = D.airports.find((x) => x.city.en === c.name.en)
    return { id: c.slug, name: c.name, country: c.country, code: a?.code, f: { dubai: 1.15, istanbul: 1, baku: 0.95, georgia: 0.9, trabzon: 0.95, antalya: 1, sharm: 0.95, cairo: 0.85, 'kuala-lumpur': 0.9 }[c.slug] ?? 1, img: c.img }
  }),
]
export const location = (id) => LOCATIONS.find((l) => l.id === String(id || '').toLowerCase()) || LOCATIONS.find((l) => l.id === 'istanbul')

export const SUPPLIERS = [N('الحياة درايف', 'Hayat Drive', 'حەیات درایڤ'), N('الرافدين للتأجير', 'Rafidain Rental', 'ڕافیدەین بۆ بەکرێدان'), N('دجلة كار', 'Dijla Car', 'دیجلە کار')]

export const CATS = {
  eco: N('اقتصادية', 'Economy', 'ئابووری', { fa: 'اقتصادی', tr: 'Ekonomik', fr: 'Économique', de: 'Kleinwagen' }), sed: N('سيدان', 'Sedan', 'سیدان', { fa: 'سدان', tr: 'Sedan', fr: 'Berline', de: 'Limousine' }), csuv: N('دفع رباعي صغيرة', 'Compact SUV', 'SUVی بچووک', { fa: 'شاسی‌بلند کوچک', tr: 'Kompakt SUV', fr: 'SUV compact', de: 'Kompakt-SUV' }),
  suv: N('دفع رباعي', 'SUV', 'SUV', { fa: 'شاسی‌بلند', tr: 'SUV', fr: 'SUV', de: 'SUV' }), ev: N('كهربائية', 'Electric', 'کارەبایی', { fa: 'برقی', tr: 'Elektrikli', fr: 'Électrique', de: 'Elektro' }), '4x4': N('دفع رباعي كبيرة', 'Large 4x4', '4x4ی گەورە', { fa: 'شاسی‌بلند بزرگ 4x4', tr: 'Büyük 4x4', fr: 'Grand 4x4', de: 'Großer Geländewagen' }),
  van: N('عائلية', 'People carrier', 'خێزانی', { fa: 'ون خانوادگی', tr: 'Minivan', fr: 'Monospace', de: 'Van' }), lux: N('فاخرة', 'Premium', 'پریمیەم', { fa: 'لوکس', tr: 'Premium', fr: 'Premium', de: 'Premium' }),
}
/** daily = USD per day; excess = what you pay on damage with the included cover; deposit held on a card at pick-up. */
export const CLASSES = [
  { id: 'eco', name: N('بيجو 208 أو مشابهة', 'Peugeot 208 or similar', 'پیجۆ 208 یان هاوشێوە', { fa: 'پژو 208 یا مشابه', tr: 'Peugeot 208 veya benzeri', fr: 'Peugeot 208 ou similaire', de: 'Peugeot 208 oder ähnlich' }), photo: 'photo-1692305610636-f5157dbe6008', seats: 5, bags: 1, doors: 5, daily: 29, excess: 700, deposit: 250, km: null, manualOnly: true },
  { id: 'sed', name: N('تويوتا كورولا أو مشابهة', 'Toyota Corolla or similar', 'تۆیۆتا کۆرۆلا یان هاوشێوە', { fa: 'تویوتا کرولا یا مشابه', tr: 'Toyota Corolla veya benzeri', fr: 'Toyota Corolla ou similaire', de: 'Toyota Corolla oder ähnlich' }), photo: 'photo-1623869675781-80aa31012a5a', seats: 5, bags: 2, doors: 4, daily: 40, excess: 800, deposit: 300, km: null },
  { id: 'csuv', name: N('سوزوكي فيتارا أو مشابهة', 'Suzuki Vitara or similar', 'سوزوکی ڤیتارا یان هاوشێوە', { fa: 'سوزوکی ویتارا یا مشابه', tr: 'Suzuki Vitara veya benzeri', fr: 'Suzuki Vitara ou similaire', de: 'Suzuki Vitara oder ähnlich' }), photo: 'photo-1642345810417-eecf7dda339b', seats: 5, bags: 2, doors: 5, daily: 49, excess: 900, deposit: 350, km: null },
  { id: 'suv', name: N('كيا سبورتاج أو مشابهة', 'Kia Sportage or similar', 'کیا سپۆرتەیج یان هاوشێوە', { fa: 'کیا اسپورتیج یا مشابه', tr: 'Kia Sportage veya benzeri', fr: 'Kia Sportage ou similaire', de: 'Kia Sportage oder ähnlich' }), photo: 'photo-1684849311625-b66671fb66d5', seats: 5, bags: 3, doors: 5, daily: 60, excess: 1000, deposit: 400, km: null },
  { id: 'ev', name: N('تسلا موديل 3 أو مشابهة', 'Tesla Model 3 or similar', 'تێسلا مۆدێل 3 یان هاوشێوە', { fa: 'تسلا مدل 3 یا مشابه', tr: 'Tesla Model 3 veya benzeri', fr: 'Tesla Model 3 ou similaire', de: 'Tesla Model 3 oder ähnlich' }), photo: 'photo-1610470832703-95d40c3fad55', seats: 5, bags: 2, doors: 4, daily: 73, excess: 1200, deposit: 500, km: null, electric: true },
  { id: '4x4', name: N('تويوتا لاند كروزر أو مشابهة', 'Toyota Land Cruiser or similar', 'تۆیۆتا لاند کرۆزەر یان هاوشێوە', { fa: 'تویوتا لندکروزر یا مشابه', tr: 'Toyota Land Cruiser veya benzeri', fr: 'Toyota Land Cruiser ou similaire', de: 'Toyota Land Cruiser oder ähnlich' }), photo: 'photo-1709620435533-56483034bdd4', seats: 7, bags: 4, doors: 5, daily: 111, excess: 1500, deposit: 800, km: 300, over25: true },
  { id: 'van', name: N('فولكس فاغن ID. Buzz أو مشابهة', 'Volkswagen ID. Buzz or similar', 'ڤۆلکسڤاگن ID. Buzz یان هاوشێوە', { fa: 'فولکس‌واگن ID. Buzz یا مشابه', tr: 'Volkswagen ID. Buzz veya benzeri', fr: 'Volkswagen ID. Buzz ou similaire', de: 'Volkswagen ID. Buzz oder ähnlich' }), photo: 'photo-1724479839764-65981526641d', seats: 7, bags: 5, doors: 5, daily: 92, excess: 1200, deposit: 600, km: null, electric: true },
  { id: 'lux', name: N('مرسيدس الفئة E أو مشابهة', 'Mercedes E-Class or similar', 'مێرسیدس E-Class یان هاوشێوە', { fa: 'مرسدس کلاس E یا مشابه', tr: 'Mercedes E-Class veya benzeri', fr: 'Mercedes E-Class ou similaire', de: 'Mercedes E-Class oder ähnlich' }), photo: 'photo-1609703048009-d3576872b32c', seats: 5, bags: 3, doors: 4, daily: 145, excess: 2000, deposit: 1000, km: 250, over25: true },
]
/** perDay in USD; all are charged once per booking for the whole rental. */
export const EXTRAS = [
  { id: 'cover', perDay: 14, name: 'car.x.cover', note: 'car.x.coverD' },
  { id: 'child', perDay: 5, name: 'car.x.child', note: 'car.x.childD' },
  { id: 'driver', perDay: 6, name: 'car.x.driver', note: 'car.x.driverD' },
  { id: 'gps', perDay: 4, name: 'car.x.gps', note: 'car.x.gpsD' },
]
export const YOUNG_FEE = 10 // per day, drivers under 25

const isIso = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || '')
const isTime = (s) => /^\d{2}:\d{2}$/.test(s || '')
export function normCar(q = {}) {
  const pick = isIso(q.pick) ? q.pick : inDays(14)
  let drop = isIso(q.drop) ? q.drop : addDaysIso(pick, 4)
  if (drop < pick) drop = addDaysIso(pick, 1)
  const pt = isTime(q.pt) ? q.pt : '10:00'
  let dt = isTime(q.dt) ? q.dt : pt
  if (drop === pick && dt <= pt) { drop = addDaysIso(pick, 1); dt = pt }
  return { city: location(q.city).id, pick, pt, drop, dt, age: q.age === 'u25' ? 'u25' : '25' }
}
/** Rental days: every started 24 hours counts, 59 minutes of grace. */
export const rentalDays = (q) => {
  const a = new Date(`${q.pick}T${q.pt}`); const b = new Date(`${q.drop}T${q.dt}`)
  return Math.max(1, Math.ceil((b - a - 59 * 60000) / 864e5))
}
export function searchCars(q) {
  const loc = location(q.city)
  const r = seed(`cars-${loc.id}`)
  return CLASSES.map((c) => ({
    ...c,
    photoUrl: img(c.photo, 900),
    daily: Math.round(c.daily * loc.f * (0.92 + r() * 0.2)),
    supplier: SUPPLIERS[Math.floor(r() * SUPPLIERS.length)],
    auto: !c.manualOnly || r() > 0.5,
  })).filter((c) => q.age === '25' || !c.over25)
}
export const carParams = (q) => ({ city: q.city, pick: q.pick, pt: q.pt, drop: q.drop, dt: q.dt, age: q.age === 'u25' ? 'u25' : '' })
