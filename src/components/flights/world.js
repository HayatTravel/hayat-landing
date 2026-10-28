/* Airports, airlines and routes used for flights TO Iraq (visitors), on top of the shared catalogue.
   Routes work in both directions; a carrier tuple is [code, price offset, 'direct' | via code, Iraqi airports served (optional)].
   Illustrative schedule data, not a timetable. */
/** Names: ar, en, ku, plus optional { fa, tr, fr, de } for visitors (L() falls back to en). */
const N = (ar, en, ku, x = {}) => ({ ar, en, ku, ...x })
const TR = N('تركيا', 'Türkiye', 'تورکیا', { fa: 'ترکیه', fr: 'Turquie', de: 'Türkei' }); const IR = N('إيران', 'Iran', 'ئێران', { fa: 'ایران', tr: 'İran' }); const DE = N('ألمانيا', 'Germany', 'ئەڵمانیا', { fa: 'آلمان', tr: 'Almanya', fr: 'Allemagne', de: 'Deutschland' })
const PKN = N('باكستان', 'Pakistan', 'پاکستان', { fa: 'پاکستان' })
const IN = N('الهند', 'India', 'هیندستان', { fa: 'هند', tr: 'Hindistan', fr: 'Inde', de: 'Indien' })
const TH = N('تايلاند', 'Thailand', 'تایلەند', { fa: 'تایلند', tr: 'Tayland', fr: 'Thaïlande' })

export const WORLD_AIRPORTS = [
  { code: 'SAW', city: N('إسطنبول صبيحة', 'Istanbul Sabiha Gökçen', 'ئەستەنبوڵ سەبیحە', { fa: 'استانبول صبیحه گوکچن', tr: 'İstanbul Sabiha Gökçen' }), country: TR },
  { code: 'DOH', city: N('الدوحة', 'Doha', 'دۆحە', { fa: 'دوحه' }), country: N('قطر', 'Qatar', 'قەتەر', { fa: 'قطر', tr: 'Katar', de: 'Katar' }) },
  { code: 'KWI', city: N('الكويت', 'Kuwait City', 'کوەیت', { fa: 'کویت', tr: 'Kuveyt', fr: 'Koweït', de: 'Kuwait-Stadt' }), country: N('الكويت', 'Kuwait', 'کوەیت', { fa: 'کویت', tr: 'Kuveyt', fr: 'Koweït' }) },
  { code: 'IKA', city: N('طهران', 'Tehran', 'تاران', { fa: 'تهران', tr: 'Tahran', fr: 'Téhéran', de: 'Teheran' }), country: IR },
  { code: 'MHD', city: N('مشهد', 'Mashhad', 'مەشهەد', { fa: 'مشهد', tr: 'Meşhed', fr: 'Mechhed', de: 'Maschhad' }), country: IR },
  { code: 'SYZ', city: N('شيراز', 'Shiraz', 'شیراز', { fa: 'شیراز', tr: 'Şiraz', fr: 'Chiraz', de: 'Schiras' }), country: IR },
  { code: 'FRA', city: N('فرانكفورت', 'Frankfurt', 'فرانکفۆرت', { fa: 'فرانکفورت', fr: 'Francfort' }), country: DE },
  { code: 'MUC', city: N('ميونخ', 'Munich', 'میونخ', { fa: 'مونیخ', tr: 'Münih', de: 'München' }), country: DE },
  { code: 'VIE', city: N('فيينا', 'Vienna', 'ڤیەننا', { fa: 'وین', tr: 'Viyana', fr: 'Vienne', de: 'Wien' }), country: N('النمسا', 'Austria', 'نەمسا', { fa: 'اتریش', tr: 'Avusturya', fr: 'Autriche', de: 'Österreich' }) },
  { code: 'LHR', city: N('لندن', 'London', 'لەندەن', { fa: 'لندن', tr: 'Londra', fr: 'Londres' }), country: N('المملكة المتحدة', 'United Kingdom', 'شانشینی یەکگرتوو', { fa: 'بریتانیا', tr: 'Birleşik Krallık', fr: 'Royaume-Uni', de: 'Vereinigtes Königreich' }) },
  { code: 'CDG', city: N('باريس', 'Paris', 'پاریس', { fa: 'پاریس' }), country: N('فرنسا', 'France', 'فەرەنسا', { fa: 'فرانسه', tr: 'Fransa', de: 'Frankreich' }) },
  { code: 'AMS', city: N('أمستردام', 'Amsterdam', 'ئەمستردام', { fa: 'آمستردام' }), country: N('هولندا', 'Netherlands', 'هۆڵەندا', { fa: 'هلند', tr: 'Hollanda', fr: 'Pays-Bas', de: 'Niederlande' }) },
  { code: 'ARN', city: N('ستوكهولم', 'Stockholm', 'ستۆکهۆڵم', { fa: 'استکهلم' }), country: N('السويد', 'Sweden', 'سوید', { fa: 'سوئد', tr: 'İsveç', fr: 'Suède', de: 'Schweden' }) },
  { code: 'SVO', city: N('موسكو', 'Moscow', 'مۆسکۆ', { fa: 'مسکو', tr: 'Moskova', fr: 'Moscou', de: 'Moskau' }), country: N('روسيا', 'Russia', 'ڕووسیا', { fa: 'روسیه', tr: 'Rusya', fr: 'Russie', de: 'Russland' }) },
  { code: 'DEL', city: N('دلهي', 'Delhi', 'دەلهی', { fa: 'دهلی' }), country: N('الهند', 'India', 'هیندستان', { fa: 'هند', tr: 'Hindistan', fr: 'Inde', de: 'Indien' }) },
  { code: 'KHI', city: N('كراتشي', 'Karachi', 'کەراچی', { fa: 'کراچی', tr: 'Karaçi', de: 'Karatschi' }), country: PKN },
  { code: 'LHE', city: N('لاهور', 'Lahore', 'لاهۆر', { fa: 'لاهور' }), country: PKN },
  { code: 'EVN', city: N('يريفان', 'Yerevan', 'یەرەڤان', { fa: 'ایروان', tr: 'Erivan', fr: 'Erevan', de: 'Eriwan' }), country: N('أرمينيا', 'Armenia', 'ئەرمەنستان', { fa: 'ارمنستان', tr: 'Ermenistan', fr: 'Arménie', de: 'Armenien' }) },
  { code: 'BKK', city: N('بانكوك', 'Bangkok', 'بانکۆک', { fa: 'بانکوک' }), country: TH },
  { code: 'HKT', city: N('بوكيت', 'Phuket', 'پووکێت', { fa: 'پوکت' }), country: TH },
  { code: 'MAA', city: N('تشيناي', 'Chennai', 'چێنای', { fa: 'چنای' }), country: IN },
  { code: 'BOM', city: N('مومباي', 'Mumbai', 'مومبای', { fa: 'بمبئی', fr: 'Bombay' }), country: IN },
  { code: 'BER', city: N('برلين', 'Berlin', 'بەرلین', { fa: 'برلین' }), country: DE },
  { code: 'CAN', city: N('غوانزو', 'Guangzhou', 'گوانگجۆ', { fa: 'گوانگژو', tr: 'Kanton', fr: 'Canton' }), country: N('الصين', 'China', 'چین', { fa: 'چین', tr: 'Çin', fr: 'Chine' }) },
  { code: 'RUH', city: N('الرياض', 'Riyadh', 'ڕیاز', { fa: 'ریاض', tr: 'Riyad', fr: 'Riyad', de: 'Riad' }), country: N('السعودية', 'Saudi Arabia', 'سعوودیە', { fa: 'عربستان سعودی', tr: 'Suudi Arabistan', fr: 'Arabie saoudite', de: 'Saudi-Arabien' }) },
  { code: 'MCT', city: N('مسقط', 'Muscat', 'مەسقەت', { fa: 'مسقط', tr: 'Maskat', fr: 'Mascate', de: 'Maskat' }), country: N('عُمان', 'Oman', 'عومان', { fa: 'عمان', tr: 'Umman' }) },
  { code: 'CMB', city: N('كولومبو', 'Colombo', 'کۆلۆمبۆ', { fa: 'کلمبو' }), country: N('سريلانكا', 'Sri Lanka', 'سریلانکا', { fa: 'سریلانکا' }) },
  { code: 'DPS', city: N('بالي', 'Bali', 'بالی', { fa: 'بالی' }), country: N('إندونيسيا', 'Indonesia', 'ئیندۆنیزیا', { fa: 'اندونزی', tr: 'Endonezya', fr: 'Indonésie', de: 'Indonesien' }) },
]

export const WORLD_AIRLINES = {
  IR: N('إيران إير', 'Iran Air', 'ئێران ئێر', { fa: 'ایران‌ایر' }), W5: N('ماهان إير', 'Mahan Air', 'ماهان ئێر', { fa: 'ماهان' }), LH: N('لوفتهانزا', 'Lufthansa', 'لوفتهانزا', { fa: 'لوفت‌هانزا' }),
  OS: N('النمساوية', 'Austrian Airlines', 'هێڵی ئاسمانی نەمسا', { fa: 'هواپیمایی اتریش' }), KU: N('الخطوط الجوية الكويتية', 'Kuwait Airways', 'هێڵی ئاسمانی کوەیت', { fa: 'هواپیمایی کویت' }),
  PK: N('الخطوط الباكستانية', 'PIA', 'هێڵی ئاسمانی پاکستان', { fa: 'هواپیمایی پاکستان' }),
  SV: N('السعودية', 'Saudia', 'سعوودیە', { fa: 'سعودیا' }), XY: N('طيران ناس', 'flynas', 'فلای ناس', { fa: 'فلای‌ناس' }), OV: N('طيران السلام', 'SalamAir', 'سەلام ئێر', { fa: 'سلام‌ایر' }),
}

const ALL = ['BGW', 'EBL', 'BSR', 'NJF', 'ISU']
export const WORLD_ROUTES = [
  { to: 'SAW', dur: 175, base: 150, carriers: [['PC', 0, 'direct', ALL]] },
  { to: 'DOH', dur: 110, base: 210, carriers: [['QR', 0, 'direct', ALL], ['IA', -20, 'direct', ['BGW', 'NJF']]] },
  { to: 'KWI', dur: 75, base: 150, carriers: [['KU', 0, 'direct', ['BGW', 'NJF', 'EBL']], ['IA', -15, 'direct', ['BGW']]] },
  { to: 'IKA', dur: 120, base: 170, carriers: [['IR', 0, 'direct', ['BGW', 'NJF', 'EBL']], ['W5', -10, 'direct', ['BGW', 'NJF']], ['IA', -5, 'direct', ['BGW', 'NJF', 'BSR']]] },
  { to: 'MHD', dur: 150, base: 160, carriers: [['W5', 0, 'direct', ['BGW', 'NJF']], ['IA', -5, 'direct', ['BGW', 'NJF']], ['IR', 10, 'direct', ['NJF']]] },
  { to: 'SYZ', dur: 110, base: 150, carriers: [['IR', 0, 'direct', ['BGW', 'NJF']], ['W5', 5, 'direct', ['NJF']]] },
  { to: 'FRA', dur: 300, base: 380, carriers: [['IA', 0, 'direct', ['BGW', 'EBL']], ['LH', 30, 'IST'], ['TK', 20, 'IST'], ['QR', 40, 'DOH']] },
  { to: 'MUC', dur: 290, base: 370, carriers: [['TK', 0, 'IST'], ['PC', -40, 'SAW'], ['RJ', -10, 'AMM']] },
  { to: 'VIE', dur: 270, base: 360, carriers: [['OS', 0, 'direct', ['EBL']], ['TK', 10, 'IST'], ['PC', -30, 'SAW']] },
  { to: 'LHR', dur: 420, base: 450, carriers: [['TK', 0, 'IST'], ['QR', 30, 'DOH'], ['RJ', -20, 'AMM']] },
  { to: 'CDG', dur: 380, base: 420, carriers: [['TK', 0, 'IST'], ['QR', 30, 'DOH'], ['RJ', -15, 'AMM']] },
  { to: 'AMS', dur: 380, base: 410, carriers: [['TK', 0, 'IST'], ['PC', -40, 'SAW'], ['QR', 30, 'DOH']] },
  { to: 'ARN', dur: 400, base: 430, carriers: [['TK', 0, 'IST'], ['QR', 30, 'DOH'], ['IA', -10, 'direct', ['BGW', 'EBL']]] },
  { to: 'SVO', dur: 330, base: 360, carriers: [['TK', 0, 'IST'], ['FZ', -20, 'DXB']] },
  { to: 'DEL', dur: 330, base: 300, carriers: [['FZ', 0, 'DXB'], ['QR', 20, 'DOH'], ['IA', 30, 'direct', ['BGW', 'NJF']]] },
  { to: 'KHI', dur: 220, base: 260, carriers: [['FZ', 0, 'DXB'], ['QR', 15, 'DOH'], ['PK', -10, 'direct', ['BGW', 'NJF']]] },
  { to: 'LHE', dur: 250, base: 270, carriers: [['FZ', 0, 'DXB'], ['QR', 15, 'DOH'], ['PK', 0, 'direct', ['BGW', 'NJF']]] },
  { to: 'EVN', dur: 110, base: 190, carriers: [['IA', 0, 'direct', ['BGW', 'EBL', 'NJF']], ['IF', 5, 'direct', ['BGW']], ['FZ', 10, 'DXB']] },
  { to: 'BKK', dur: 500, base: 420, carriers: [['QR', 0, 'DOH'], ['EK', 20, 'DXB'], ['FZ', -20, 'DXB'], ['TK', 10, 'IST']] },
  { to: 'HKT', dur: 560, base: 460, carriers: [['QR', 0, 'DOH'], ['EK', 20, 'DXB'], ['FZ', -15, 'DXB']] },
  { to: 'MAA', dur: 420, base: 330, carriers: [['FZ', 0, 'DXB'], ['QR', 15, 'DOH'], ['EK', 25, 'DXB']] },
  { to: 'BOM', dur: 300, base: 310, carriers: [['FZ', 0, 'DXB'], ['QR', 15, 'DOH'], ['IA', 20, 'direct', ['BGW', 'NJF']]] },
  { to: 'BER', dur: 310, base: 380, carriers: [['TK', 0, 'IST'], ['PC', -40, 'SAW'], ['IA', 10, 'direct', ['BGW', 'EBL']]] },
  { to: 'CAN', dur: 560, base: 520, carriers: [['QR', 0, 'DOH'], ['EK', 20, 'DXB'], ['TK', 15, 'IST']] },
  { to: 'RUH', dur: 120, base: 180, carriers: [['IA', 0, 'direct', ['BGW', 'NJF']], ['SV', 10, 'direct', ['BGW', 'EBL', 'NJF']], ['XY', -20, 'direct', ['BGW', 'NJF', 'BSR', 'EBL']]] },
  { to: 'MCT', dur: 170, base: 210, carriers: [['OV', -15, 'direct', ['BGW', 'NJF', 'BSR']], ['FZ', -5, 'DXB'], ['QR', 10, 'DOH']] },
  { to: 'CMB', dur: 420, base: 380, carriers: [['FZ', 0, 'DXB'], ['QR', 15, 'DOH'], ['EK', 25, 'DXB']] },
  { to: 'DPS', dur: 660, base: 560, carriers: [['QR', 0, 'DOH'], ['EK', 20, 'DXB'], ['TK', 15, 'IST']] },
  { to: 'BUS', dur: 150, base: 210, carriers: [['PC', 0, 'IST'], ['TK', 20, 'IST'], ['FZ', -10, 'DXB']] },
]

/** Photos for destinations the shared catalogue has no city for. */
export const WORLD_IMG = { DPS: 'dest-bali', BUS: 'georgia' }

/** Hours relative to Iraq (winter). */
export const WORLD_TZ = { EVN: 1, BKK: 4, HKT: 4, MAA: 2.5, BOM: 2.5, BER: -2, CAN: 5, RUH: 0, MCT: 1, CMB: 2.5, DPS: 5, SAW: 0, KWI: 0, IKA: 0.5, MHD: 0.5, SYZ: 0.5, FRA: -2, MUC: -2, VIE: -2, LHR: -3, CDG: -2, AMS: -2, ARN: -2, SVO: 0, DEL: 2.5, KHI: 2, LHE: 2 }

/** Origins offered on the "Flights to Iraq" form, in this order. */
export const INBOUND_FROM = ['IST', 'SAW', 'DXB', 'DOH', 'AMM', 'BEY', 'CAI', 'KWI', 'IKA', 'MHD', 'SYZ', 'FRA', 'MUC', 'VIE', 'LHR', 'CDG', 'AMS', 'ARN', 'SVO', 'DEL', 'BOM', 'MAA', 'KHI', 'LHE', 'RUH', 'MCT', 'GYD', 'TBS', 'EVN', 'AYT', 'TZX', 'KUL', 'BKK', 'CAN']
/** Typical connections shown in "Airports in Iraq" (illustrative). */
export const IRAQ_AIRPORTS = [
  { code: 'BGW', region: 'fed', links: ['IST', 'DXB', 'DOH', 'AMM', 'BEY', 'IKA', 'FRA'] },
  { code: 'EBL', region: 'krg', links: ['IST', 'SAW', 'DXB', 'DOH', 'AMM', 'VIE', 'FRA'] },
  { code: 'ISU', region: 'krg', links: ['IST', 'SAW', 'DXB', 'DOH'] },
  { code: 'NJF', region: 'fed', links: ['IKA', 'MHD', 'IST', 'DXB', 'DOH', 'BEY', 'KHI'] },
  { code: 'BSR', region: 'fed', links: ['DXB', 'DOH', 'IST', 'AMM', 'IKA'] },
]
