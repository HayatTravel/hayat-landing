import { seeded } from '../lib/format'

// Suppliers are fictional on purpose.
const suppliers = ['حياة درايف', 'رافدين للتأجير', 'دجلة كار']

export const carClasses = [
  { id: 'eco', cat: 'اقتصادية', name: 'بيجو 207 أو مشابهة', img: 'photo-1692305610636-f5157dbe6008', seats: 5, bags: 1, doors: 5, daily: 38_000 },
  { id: 'sed', cat: 'سيدان', name: 'تويوتا كورولا أو مشابهة', img: 'photo-1623869675781-80aa31012a5a', seats: 5, bags: 2, doors: 4, daily: 52_000 },
  { id: 'csuv', cat: 'دفع رباعي صغيرة', name: 'سوزوكي فيتارا أو مشابهة', img: 'photo-1642345810417-eecf7dda339b', seats: 5, bags: 2, doors: 5, daily: 64_000 },
  { id: 'suv', cat: 'دفع رباعي', name: 'كيا سبورتاج أو مشابهة', img: 'photo-1684849311625-b66671fb66d5', seats: 5, bags: 3, doors: 5, daily: 78_000 },
  { id: 'ev', cat: 'كهربائية', name: 'تسلا موديل 3 أو مشابهة', img: 'photo-1610470832703-95d40c3fad55', seats: 5, bags: 2, doors: 4, daily: 95_000 },
  { id: '4x4', cat: 'دفع رباعي كبيرة', name: 'تويوتا لاند كروزر أو مشابهة', img: 'photo-1709620435533-56483034bdd4', seats: 7, bags: 4, doors: 5, daily: 145_000 },
  { id: 'van', cat: 'عائلية', name: 'فولكس فاغن ID. Buzz أو مشابهة', img: 'photo-1724479839764-65981526641d', seats: 7, bags: 5, doors: 5, daily: 120_000 },
  { id: 'lux', cat: 'فاخرة', name: 'مرسيدس الفئة E أو مشابهة', img: 'photo-1609703048009-d3576872b32c', seats: 5, bags: 3, doors: 4, daily: 190_000 },
]

export const carExtras = [
  { id: 'ins', name: 'تأمين شامل بدون تحمّل', perDay: 18_000, note: 'لا تدفع شيئاً عند أي ضرر' },
  { id: 'kid', name: 'مقعد أطفال', perDay: 6_000, note: 'لعمر 1–4 سنوات' },
  { id: 'gps', name: 'جهاز ملاحة GPS', perDay: 5_000, note: 'خرائط باللغة العربية' },
  { id: 'drv', name: 'سائق إضافي', perDay: 8_000, note: 'شخص ثانٍ يحق له القيادة' },
]

export const rentalDays = (pick, drop) => Math.max(1, Math.round((new Date(drop) - new Date(pick)) / 864e5))

export function searchCars({ city = 'DXB' }) {
  const r = seeded(`cars-${city}`)
  return carClasses.map((c) => ({
    ...c,
    daily: Math.round((c.daily * (0.85 + r() * 0.35)) / 1000) * 1000,
    supplier: suppliers[Math.floor(r() * suppliers.length)],
    auto: c.id !== 'eco' || r() > 0.5,
    freeCancel: r() > 0.3,
    rating: (8 + r() * 1.7).toFixed(1),
  }))
}

export const findCar = (city, id) => searchCars({ city }).find((c) => c.id === id)
