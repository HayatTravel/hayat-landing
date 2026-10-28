import { seeded } from '../lib/format'
import { destination } from './places'

const rooms = ['photo-1618773928121-c32242e63f39', 'photo-1629140727571-9b5c6f6267b4', 'photo-1631049552057-403cdb8f0658', 'photo-1578683010236-d716f9a3f461', 'photo-1711059985570-4c32ed12a12c', 'photo-1572177215152-32f247303126', 'photo-1631049307290-bb947b114627', 'photo-1541628951107-a9af5346a3e4']
const pools = ['photo-1549294413-26f195200c16', 'photo-1623718649591-311775a30c43', 'photo-1535205148555-bcbbc2a78913', 'photo-1561501900-3701fa6a0864', 'photo-1610641818989-c2051b5e2cfd', 'photo-1551918120-9739cb430c6d', 'photo-1571003123894-1f0594d2b5d9']
const lobbies = ['photo-1660557989695-14fac79c086d', 'photo-1660557989725-f511e9fa6267', 'photo-1637730826933-54287f79e1c3']
const extras = ['photo-1664917555352-f3f66e57ccc2', 'photo-1542020186-c952a6c4045a', 'photo-1551632436-cbf8dd35adfa', 'photo-1695094411862-0e047fbddcb1']

const names = {
  DXB: ['منتجع لؤلؤة الخليج', 'فندق برج المرسى', 'نُزل الخور التراثي', 'أجنحة داون تاون', 'فندق نخلة الشاطئ'],
  IST: ['قصر البوسفور', 'فندق غلطة هاوس', 'نُزل السلطان أحمد', 'أجنحة تقسيم سكاي', 'فندق القرن الذهبي'],
  BEY: ['فندق كورنيش المنارة', 'نُزل الجميزة', 'منتجع خليج جونيه', 'أجنحة الأشرفية'],
  CAI: ['فندق نايل فيو', 'نُزل الزمالك', 'منتجع أهرامات الجيزة', 'فندق وسط البلد'],
  GYD: ['فندق شعلة باكو', 'نُزل المدينة القديمة', 'أجنحة بحر قزوين', 'فندق ساحة النافورة'],
  TBS: ['فندق جبل مطاتسميندا', 'نُزل تبليسي القديمة', 'منتجع كاخيتي', 'أجنحة روستافيلي'],
  MLE: ['منتجع جزيرة المرجان', 'فيلات فوق الماء', 'منتجع البحيرة الزرقاء'],
  AYT: ['منتجع لارا بيتش', 'فندق كاليتشي القديمة', 'منتجع كونيالتي', 'قرية بيليك السياحية'],
}
const fallback = ['فندق حياة سيتي', 'نُزل النخيل', 'منتجع الأفق', 'أجنحة الواحة', 'فندق الريحان']

export const amenities = ['واي فاي مجاني', 'مسبح', 'إفطار', 'موقف سيارات', 'نادي رياضي', 'سبا', 'نقل من المطار', 'مطعم']
const areas = ['وسط المدينة', 'على الواجهة البحرية', 'قرب المطار', 'الحي التاريخي', 'منطقة الأعمال']

export function searchHotels({ city = 'DXB', nights = 3 }) {
  const r = seeded(`hotels-${city}`)
  const list = names[city] || fallback
  return list.map((name, i) => {
    const stars = 3 + Math.floor(r() * 3)
    const nightly = Math.round((55_000 + stars * 38_000 + r() * 110_000) / 1000) * 1000
    const pick = (arr) => arr[Math.floor(r() * arr.length)]
    const gallery = [...new Set([pools[(i + city.charCodeAt(1)) % pools.length], pick(rooms), pick(lobbies), pick(rooms), pick(extras)])]
    return {
      id: `${city}-${i}`,
      city,
      name,
      stars,
      score: (7.6 + r() * 2.2).toFixed(1),
      reviews: 120 + Math.floor(r() * 2400),
      area: pick(areas),
      nightly,
      total: nightly * nights,
      gallery,
      amenities: amenities.filter(() => r() > 0.35),
      freeCancel: r() > 0.4,
      rooms: [
        { id: 'std', name: 'غرفة قياسية', bed: 'سرير مزدوج', size: 26, price: nightly, img: pick(rooms), perks: ['واي فاي مجاني'] },
        { id: 'dlx', name: 'غرفة ديلوكس بإطلالة', bed: 'سرير كينغ', size: 34, price: Math.round(nightly * 1.35), img: pick(rooms), perks: ['إفطار مجاني', 'إطلالة'] },
        { id: 'ste', name: 'جناح تنفيذي', bed: 'كينغ + صالة', size: 58, price: Math.round(nightly * 2.1), img: pick(rooms), perks: ['إفطار مجاني', 'دخول الصالة التنفيذية', 'تسجيل خروج متأخر'] },
      ],
    }
  })
}

export const findHotel = (id) => {
  const city = id.split('-')[0]
  return searchHotels({ city }).find((h) => h.id === id)
}

export const cityName = (code) => destination(code).city
