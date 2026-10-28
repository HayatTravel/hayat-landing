// Unsplash photo ids, each verified to return 200.
export const photos = {
  hero: 'photo-1565444007614-6b38c78224df',
  heroAlt: 'photo-1594386245199-289c2fe0bd0a',
  cabin: 'photo-1641447093043-241f064568fb',
  phone: 'photo-1566818053624-9934143a2a0a',
  traveler: 'photo-1712710207750-2019ce3059aa',
}

export const destinations = [
  { code: 'DXB', city: 'دبي', country: 'الإمارات', cc: 'ae', img: 'photo-1546412414-8035e1776c9a', from: 285_000, tag: 'الأكثر طلباً' },
  { code: 'IST', city: 'إسطنبول', country: 'تركيا', cc: 'tr', img: 'photo-1564407727371-3eece6c58961', from: 330_000, tag: 'عطلة نهاية الأسبوع' },
  { code: 'BEY', city: 'بيروت', country: 'لبنان', cc: 'lb', img: 'photo-1496823407868-80f47c7453b5', from: 240_000 },
  { code: 'CAI', city: 'القاهرة', country: 'مصر', cc: 'eg', img: 'photo-1553913861-c0fddf2619ee', from: 310_000 },
  { code: 'GYD', city: 'باكو', country: 'أذربيجان', cc: 'az', img: 'photo-1596306499398-8d88944a5ec4', from: 295_000 },
  { code: 'TBS', city: 'تبليسي', country: 'جورجيا', cc: 'ge', img: 'photo-1603350576276-24747f7bbf40', from: 320_000 },
  { code: 'MLE', city: 'المالديف', country: 'المالديف', cc: 'mv', img: 'photo-1697898109604-e06e88b15271', from: 890_000, tag: 'شهر العسل' },
  { code: 'AYT', city: 'أنطاليا', country: 'تركيا', cc: 'tr', img: 'photo-1658424788978-88c65aaa743b', from: 355_000 },
  { code: 'KUL', city: 'كوالالمبور', country: 'ماليزيا', cc: 'my', img: 'photo-1508062878650-88b52897f298', from: 720_000 },
  { code: 'DPS', city: 'بالي', country: 'إندونيسيا', cc: 'id', img: 'photo-1555400038-63f5ba517a47', from: 980_000 },
  { code: 'CDG', city: 'باريس', country: 'فرنسا', cc: 'fr', img: 'photo-1502602898657-3e91760cbb34', from: 760_000 },
  { code: 'LHR', city: 'لندن', country: 'المملكة المتحدة', cc: 'gb', img: 'photo-1513635269975-59663e0ac1ad', from: 810_000 },
  { code: 'AMM', city: 'عمّان', country: 'الأردن', cc: 'jo', img: 'photo-1579606032821-4e6161c81bd3', from: 210_000 },
  { code: 'FCO', city: 'روما', country: 'إيطاليا', cc: 'it', img: 'photo-1552832230-c0197dd311b5', from: 740_000 },
  { code: 'HKT', city: 'بوكيت', country: 'تايلاند', cc: 'th', img: 'photo-1589394815804-964ed0be2eb5', from: 840_000 },
  { code: 'EBL', city: 'أربيل', country: 'العراق', cc: 'iq', img: 'photo-1707590713835-67b4bc23fa4d', from: 95_000 },
  { code: 'BGW', city: 'بغداد', country: 'العراق', cc: 'iq', img: 'photo-1617007830823-91a153c420e9', from: 95_000 },
]

export const destination = (code) => destinations.find((d) => d.code === code) || destinations[0]
