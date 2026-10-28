/* Visa cases for Iraqi passport holders, by destination and purpose. FOR GUIDANCE ONLY: rules change and
   Hayat checks every case before applying. Fees are illustrative mock values (USD), not official figures.
   kind: free | arrival | evisa | embassy · days: usual processing (working days) · docs: tourism documents.
   purposes: which cases we handle there (default: tourism, family, medical, study, business).
   transit: { kind, days, fee } when an airport-transit visa applies. img: media name or Unsplash photo id (verified). */
const N = (ar, en, ku) => ({ ar, en, ku })
const ALL = ['tourism', 'family', 'medical', 'study', 'business']

export const PURPOSES = ['tourism', 'family', 'medical', 'study', 'business', 'transit']

/** Documents each purpose adds on top of the passport, photo and ID. Tourism uses the country's own list. */
export const PURPOSE_DOCS = {
  tourism: null,
  family: ['invite', 'relation', 'hostres', 'ticket'],
  medical: ['hospital', 'medrep', 'bank', 'ticket'],
  study: ['admission', 'bank', 'certs'],
  business: ['bizinv', 'company', 'ticket', 'hotel'],
  transit: ['onward', 'finalvisa'],
}
export const PURPOSE_ICON = { tourism: 'globe', family: 'users', medical: 'heart', study: 'documents', business: 'building', transit: 'plane' }

export const VISAS = [
  /* the original eight (same ids, used across the site) */
  { id: 'TR', region: 'near', img: 'istanbul', country: N('تركيا', 'Türkiye', 'تورکیا'), kind: 'evisa', days: 3, fee: 60, docs: ['passport', 'photo', 'hotel', 'ticket'] },
  { id: 'AE', region: 'gulf', img: 'dubai', country: N('الإمارات', 'UAE', 'ئیمارات'), kind: 'evisa', days: 4, fee: 110, docs: ['passport', 'photo', 'id'], transit: { kind: 'evisa', days: 2, fee: 60 } },
  { id: 'AZ', region: 'near', img: 'baku', country: N('أذربيجان', 'Azerbaijan', 'ئازەربایجان'), kind: 'evisa', days: 3, fee: 45, docs: ['passport', 'photo'] },
  { id: 'EG', region: 'near', img: 'sharm', country: N('مصر', 'Egypt', 'میسر'), kind: 'arrival', days: 0, fee: 25, docs: ['passport', 'hotel'] },
  { id: 'SCH', region: 'europe', img: 'dest-paris', country: N('شنغن (أوروبا)', 'Schengen (Europe)', 'شەنگن (ئەورووپا)'), kind: 'embassy', days: 15, fee: 180, docs: ['passport', 'photo', 'id', 'bank', 'job', 'hotel', 'ticket', 'insurance'], transit: { kind: 'embassy', days: 10, fee: 110 } },
  { id: 'UK', region: 'europe', img: 'dest-london', country: N('المملكة المتحدة', 'United Kingdom', 'شانشینی یەکگرتوو'), kind: 'embassy', days: 21, fee: 210, docs: ['passport', 'photo', 'bank', 'job', 'hotel'], transit: { kind: 'embassy', days: 15, fee: 90 } },
  { id: 'GE', region: 'near', img: 'georgia', country: N('جورجيا', 'Georgia', 'جۆرجیا'), kind: 'free', days: 0, fee: 0, docs: ['passport'] },
  { id: 'MY', region: 'asia', img: 'dest-kl', country: N('ماليزيا', 'Malaysia', 'مالیزیا'), kind: 'free', days: 0, fee: 0, docs: ['passport', 'ticket'] },
  /* region */
  { id: 'IR', region: 'near', img: null, country: N('إيران', 'Iran', 'ئێران'), kind: 'free', days: 0, fee: 0, docs: ['passport', 'hotel'] },
  { id: 'JO', region: 'near', img: 'photo-1579606032821-4e6161c81bd3', country: N('الأردن', 'Jordan', 'ئوردن'), kind: 'evisa', days: 5, fee: 70, docs: ['passport', 'photo', 'id', 'hotel', 'ticket'] },
  { id: 'LB', region: 'near', img: 'photo-1496823407868-80f47c7453b5', country: N('لبنان', 'Lebanon', 'لوبنان'), kind: 'arrival', days: 0, fee: 30, docs: ['passport', 'hotel', 'ticket', 'bank'] },
  { id: 'AM', region: 'near', img: null, country: N('أرمينيا', 'Armenia', 'ئەرمەنستان'), kind: 'evisa', days: 4, fee: 50, docs: ['passport', 'photo', 'hotel'] },
  { id: 'SA', region: 'gulf', img: 'photo-1586724237569-f3d0c1dee8c6', country: N('السعودية', 'Saudi Arabia', 'سعوودیە'), kind: 'embassy', days: 10, fee: 150, docs: ['passport', 'photo', 'id', 'ticket'], purposes: ['family', 'business', 'medical'], visitOnly: true },
  { id: 'QA', region: 'gulf', img: null, country: N('قطر', 'Qatar', 'قەتەر'), kind: 'evisa', days: 5, fee: 80, docs: ['passport', 'photo', 'hotel', 'ticket'] },
  { id: 'OM', region: 'gulf', img: 'photo-1621680696874-edd80ce57b72', country: N('عُمان', 'Oman', 'عومان'), kind: 'evisa', days: 4, fee: 60, docs: ['passport', 'photo', 'hotel'] },
  { id: 'KW', region: 'gulf', img: null, country: N('الكويت', 'Kuwait', 'کوەیت'), kind: 'evisa', days: 5, fee: 70, docs: ['passport', 'photo', 'id'], purposes: ['family', 'medical', 'business'] },
  { id: 'BH', region: 'gulf', img: null, country: N('البحرين', 'Bahrain', 'بەحرەین'), kind: 'evisa', days: 4, fee: 60, docs: ['passport', 'photo', 'hotel'] },
  /* Asia */
  { id: 'IN', region: 'asia', img: 'photo-1587474260584-136574528ed5', country: N('الهند', 'India', 'هیندستان'), kind: 'evisa', days: 4, fee: 90, docs: ['passport', 'photo', 'hotel'] },
  { id: 'TH', region: 'asia', img: 'photo-1563492065599-3520f775eeed', country: N('تايلاند', 'Thailand', 'تایلەند'), kind: 'evisa', days: 7, fee: 80, docs: ['passport', 'photo', 'bank', 'hotel', 'ticket'] },
  { id: 'LK', region: 'asia', img: 'photo-1566296314736-6eaac1ca0cb9', country: N('سريلانكا', 'Sri Lanka', 'سریلانکا'), kind: 'evisa', days: 2, fee: 50, docs: ['passport', 'hotel', 'ticket'] },
  { id: 'MV', region: 'asia', img: 'maldives', country: N('المالديف', 'Maldives', 'مالدیڤ'), kind: 'free', days: 0, fee: 0, docs: ['passport', 'hotel', 'ticket'] },
  { id: 'ID', region: 'asia', img: 'dest-bali', country: N('إندونيسيا', 'Indonesia', 'ئیندۆنیزیا'), kind: 'evisa', days: 5, fee: 70, docs: ['passport', 'photo', 'bank', 'ticket'] },
  { id: 'CN', region: 'asia', img: null, country: N('الصين', 'China', 'چین'), kind: 'embassy', days: 10, fee: 140, docs: ['passport', 'photo', 'hotel', 'ticket', 'bank'] },
  { id: 'SG', region: 'asia', img: 'photo-1565967511849-76a60a516170', country: N('سنغافورة', 'Singapore', 'سەنگافوورە'), kind: 'evisa', days: 6, fee: 70, docs: ['passport', 'photo', 'bank', 'hotel'] },
  { id: 'JP', region: 'asia', img: 'photo-1589308078059-be1415eab4c3', country: N('اليابان', 'Japan', 'ژاپۆن'), kind: 'embassy', days: 10, fee: 120, docs: ['passport', 'photo', 'bank', 'job', 'hotel', 'ticket'] },
  { id: 'KR', region: 'asia', img: null, country: N('كوريا الجنوبية', 'South Korea', 'کۆریای باشوور'), kind: 'embassy', days: 12, fee: 120, docs: ['passport', 'photo', 'bank', 'job', 'hotel'] },
  /* further */
  { id: 'RU', region: 'europe', img: 'photo-1513326738677-b964603b136d', country: N('روسيا', 'Russia', 'ڕووسیا'), kind: 'embassy', days: 10, fee: 120, docs: ['passport', 'photo', 'hotel', 'ticket', 'insurance'] },
  { id: 'US', region: 'west', img: null, country: N('الولايات المتحدة', 'United States', 'ئەمریکا'), kind: 'embassy', days: 30, fee: 230, docs: ['passport', 'photo', 'bank', 'job', 'id'], transit: { kind: 'embassy', days: 30, fee: 230 } },
  { id: 'CA', region: 'west', img: null, country: N('كندا', 'Canada', 'کەنەدا'), kind: 'embassy', days: 30, fee: 190, docs: ['passport', 'photo', 'bank', 'job', 'ticket'], transit: { kind: 'embassy', days: 20, fee: 120 } },
  { id: 'AU', region: 'west', img: null, country: N('أستراليا', 'Australia', 'ئوسترالیا'), kind: 'embassy', days: 25, fee: 190, docs: ['passport', 'photo', 'bank', 'job', 'insurance'] },
].map((v) => ({ purposes: ALL, ...v }))

export const REGIONS = ['near', 'gulf', 'asia', 'europe', 'west']
