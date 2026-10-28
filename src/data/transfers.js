export const vehicles = [
  { id: 'std', name: 'سيدان اقتصادية', model: 'تويوتا كامري أو مشابهة', img: 'photo-1623869675781-80aa31012a5a', pax: 3, bags: 3, x: 1 },
  { id: 'biz', name: 'دفع رباعي أعمال', model: 'تويوتا لاند كروزر', img: 'photo-1650530579355-7ad9d4766043', pax: 4, bags: 4, x: 1.6 },
  { id: 'van', name: 'فان عائلية', model: 'مرسيدس V-Class', img: 'photo-1775637483809-3bdb2a80fb77', pax: 7, bags: 7, x: 1.9 },
  { id: 'lux', name: 'فاخرة', model: 'مرسيدس الفئة S', img: 'photo-1599912027765-a69c78bfa3aa', pax: 3, bags: 2, x: 2.6 },
]

export const zones = [
  { id: 'center', name: 'وسط المدينة', x: 1 },
  { id: 'hotels', name: 'منطقة الفنادق', x: 1.1 },
  { id: 'coast', name: 'الواجهة البحرية', x: 1.25 },
  { id: 'suburbs', name: 'الضواحي', x: 1.4 },
]

const TRANSFER_BASE = 35_000
const HOURLY_BASE = 28_000

// mode "transfer": one airport run priced by zone; mode "chauffeur": priced per hour.
export function transferPrice(v, { mode, zone, hours }) {
  const raw = mode === 'chauffeur'
    ? HOURLY_BASE * v.x * Math.max(3, +hours || 3)
    : TRANSFER_BASE * v.x * (zones.find((z) => z.id === zone)?.x || 1)
  return Math.round(raw / 1000) * 1000
}

export const transferHero = 'photo-1731755429012-83a172bec732'
