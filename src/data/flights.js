import { seeded } from '../lib/format'

export const airports = {
  BGW: { city: 'بغداد', country: 'العراق', name: 'مطار بغداد الدولي', tz: 0 },
  EBL: { city: 'أربيل', country: 'العراق', name: 'مطار أربيل الدولي', tz: 0 },
  BSR: { city: 'البصرة', country: 'العراق', name: 'مطار البصرة الدولي', tz: 0 },
  NJF: { city: 'النجف', country: 'العراق', name: 'مطار النجف الأشرف', tz: 0 },
  DXB: { city: 'دبي', country: 'الإمارات', name: 'مطار دبي الدولي', tz: 1 },
  IST: { city: 'إسطنبول', country: 'تركيا', name: 'مطار إسطنبول', tz: 0 },
  AYT: { city: 'أنطاليا', country: 'تركيا', name: 'مطار أنطاليا', tz: 0 },
  BEY: { city: 'بيروت', country: 'لبنان', name: 'مطار رفيق الحريري', tz: 0 },
  CAI: { city: 'القاهرة', country: 'مصر', name: 'مطار القاهرة الدولي', tz: -1 },
  AMM: { city: 'عمّان', country: 'الأردن', name: 'مطار الملكة علياء', tz: 0 },
  DOH: { city: 'الدوحة', country: 'قطر', name: 'مطار حمد الدولي', tz: 0 },
  AUH: { city: 'أبوظبي', country: 'الإمارات', name: 'مطار زايد الدولي', tz: 1 },
  SHJ: { city: 'الشارقة', country: 'الإمارات', name: 'مطار الشارقة الدولي', tz: 1 },
  GYD: { city: 'باكو', country: 'أذربيجان', name: 'مطار حيدر علييف', tz: 1 },
  TBS: { city: 'تبليسي', country: 'جورجيا', name: 'مطار تبليسي الدولي', tz: 1 },
  KUL: { city: 'كوالالمبور', country: 'ماليزيا', name: 'مطار كوالالمبور', tz: 5 },
  MLE: { city: 'ماليه', country: 'المالديف', name: 'مطار فيلانا الدولي', tz: 2 },
  DPS: { city: 'بالي', country: 'إندونيسيا', name: 'مطار نجوراه راي', tz: 5 },
  CDG: { city: 'باريس', country: 'فرنسا', name: 'مطار شارل ديغول', tz: -1 },
  LHR: { city: 'لندن', country: 'المملكة المتحدة', name: 'مطار هيثرو', tz: -2 },
  FCO: { city: 'روما', country: 'إيطاليا', name: 'مطار فيوميتشينو', tz: -1 },
  HKT: { city: 'بوكيت', country: 'تايلاند', name: 'مطار بوكيت الدولي', tz: 4 },
}

export const airlines = {
  IA: { name: 'الخطوط الجوية العراقية', hub: 'BGW' },
  IF: { name: 'فلاي بغداد', hub: 'BGW' },
  EK: { name: 'طيران الإمارات', hub: 'DXB' },
  FZ: { name: 'فلاي دبي', hub: 'DXB' },
  QR: { name: 'الخطوط القطرية', hub: 'DOH' },
  TK: { name: 'الخطوط التركية', hub: 'IST' },
  PC: { name: 'بيغاسوس', hub: 'IST' },
  RJ: { name: 'الملكية الأردنية', hub: 'AMM' },
  EY: { name: 'الاتحاد للطيران', hub: 'AUH' },
  G9: { name: 'العربية للطيران', hub: 'SHJ' },
  ME: { name: 'طيران الشرق الأوسط', hub: 'BEY' },
}

// rough block times from Baghdad, minutes
const base = { DXB: 150, IST: 190, AYT: 180, BEY: 110, CAI: 170, AMM: 95, DOH: 125, GYD: 130, TBS: 140, KUL: 540, MLE: 360, DPS: 660, CDG: 330, LHR: 360, FCO: 290, HKT: 480, EBL: 60, BSR: 65, NJF: 50 }
const byDest = { DXB: ['EK', 'FZ', 'IA', 'G9'], IST: ['TK', 'PC', 'IA', 'IF'], AYT: ['PC', 'TK', 'IF'], BEY: ['ME', 'IA', 'IF'], CAI: ['IA', 'RJ', 'IF'], AMM: ['RJ', 'IA'], DOH: ['QR'], GYD: ['IF', 'FZ', 'TK'] }

export function searchFlights({ from = 'BGW', to = 'DXB', date = '', pax = 1, cabin = 'economy' }) {
  const r = seeded(`${from}-${to}-${date}`)
  const direct = byDest[to] || byDest[from] || []
  const pool = [...new Set([...direct, 'QR', 'TK', 'EK', 'RJ', 'EY', 'FZ'])]
  const minutes = base[to] || base[from] || 200
  const cabinX = { economy: 1, premium: 1.7, business: 3.2 }[cabin] || 1

  return Array.from({ length: 9 }, (_, i) => {
    const code = pool[i % pool.length]
    const num = 100 + Math.floor(r() * 899)
    const isDirect = direct.includes(code) && r() > 0.15
    const country = (c) => airports[c]?.country
    const stopHub = [airlines[code].hub, 'IST', 'DOH'].find((h) => country(h) !== country(to) && country(h) !== country(from))
    const duration = isDirect ? minutes + Math.floor(r() * 20) : minutes + 140 + Math.floor(r() * 240)
    const dep = 5 * 60 + Math.floor(r() * 17 * 12) * 5
    const price = Math.round((isDirect ? 260_000 : 190_000) + minutes * 1_650 * (0.7 + r() * 0.8)) * cabinX
    return {
      id: `${code}${num}-${i}`,
      code,
      number: `${code} ${num}`,
      from, to, date,
      dep,
      arr: dep + duration + (airports[to]?.tz ?? 0) * 60,
      duration,
      stops: isDirect ? [] : [stopHub],
      price: price * pax,
      unit: price,
      baggage: code === 'PC' || code === 'G9' || code === 'FZ' ? 20 : 30,
      seatsLeft: 2 + Math.floor(r() * 7),
      aircraft: ['A320neo', 'B737 MAX 8', 'A321', 'B787-9', 'A330-300', 'B777-300ER'][Math.floor(r() * 6)],
    }
  }).sort((a, b) => a.price - b.price)
}

export const findFlight = (params, id) => searchFlights(params).find((f) => f.id === id)

// Fare families, Emirates-style. `x` multiplies the lowest (Light) price.
export const fares = [
  { id: 'light', name: 'لايت', x: 1, bag: 'حقيبة يد 7 كغ فقط', bagKg: 0, change: 'غير متاح', refund: 'غير قابلة للاسترداد', seatFree: false, miles: '25%' },
  { id: 'flex', name: 'فلكس', x: 1.25, bag: 'حقيبة 30 كغ', bagKg: 30, change: 'برسوم 50,000 د.ع', refund: 'برسوم 100,000 د.ع', seatFree: true, miles: '100%' },
  { id: 'plus', name: 'فلكس بلس', x: 1.55, bag: 'حقيبتان 2 × 23 كغ', bagKg: 46, change: 'مجاناً', refund: 'مجاناً', seatFree: true, miles: '150%' },
]
export const fareOf = (id) => fares.find((f) => f.id === id) || fares[0]
export const farePrice = (flight, fareId) => Math.round((flight.price * fareOf(fareId).x) / 250) * 250
export const seatFee = 20_000

// Lowest Light fare for a day, so the fare calendar matches that day's results exactly.
export const cheapestOn = (params) => Math.min(...searchFlights(params).map((f) => f.price))
