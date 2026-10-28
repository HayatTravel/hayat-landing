export const esimCountries = [
  { cc: 'ae', name: 'الإمارات', region: 'الشرق الأوسط', from: 6_500, network: 'Etisalat / du' },
  { cc: 'tr', name: 'تركيا', region: 'أوروبا', from: 7_000, network: 'Turkcell' },
  { cc: 'lb', name: 'لبنان', region: 'الشرق الأوسط', from: 9_000, network: 'Alfa' },
  { cc: 'eg', name: 'مصر', region: 'أفريقيا', from: 6_000, network: 'Vodafone EG' },
  { cc: 'jo', name: 'الأردن', region: 'الشرق الأوسط', from: 6_500, network: 'Zain JO' },
  { cc: 'sa', name: 'السعودية', region: 'الشرق الأوسط', from: 7_500, network: 'STC' },
  { cc: 'az', name: 'أذربيجان', region: 'آسيا', from: 8_000, network: 'Azercell' },
  { cc: 'ge', name: 'جورجيا', region: 'آسيا', from: 7_500, network: 'Magti' },
  { cc: 'my', name: 'ماليزيا', region: 'آسيا', from: 5_500, network: 'Maxis' },
  { cc: 'th', name: 'تايلاند', region: 'آسيا', from: 5_500, network: 'AIS' },
  { cc: 'gb', name: 'المملكة المتحدة', region: 'أوروبا', from: 8_500, network: 'EE' },
  { cc: 'fr', name: 'فرنسا', region: 'أوروبا', from: 8_500, network: 'Orange' },
  { cc: 'it', name: 'إيطاليا', region: 'أوروبا', from: 8_500, network: 'TIM' },
  { cc: 'de', name: 'ألمانيا', region: 'أوروبا', from: 8_500, network: 'Telekom' },
  { cc: 'mv', name: 'المالديف', region: 'آسيا', from: 12_000, network: 'Dhiraagu' },
  { cc: 'eu', name: 'أوروبا (39 دولة)', region: 'باقات إقليمية', from: 14_000, network: 'متعدد الشبكات' },
]

export const esimPlans = (country) => [
  { id: '1gb', data: '1', unit: 'GB', days: 7, price: country.from },
  { id: '3gb', data: '3', unit: 'GB', days: 15, price: Math.round(country.from * 2.2), tag: 'الأكثر مبيعاً' },
  { id: '5gb', data: '5', unit: 'GB', days: 30, price: Math.round(country.from * 3.3) },
  { id: '10gb', data: '10', unit: 'GB', days: 30, price: Math.round(country.from * 5.4) },
  { id: 'unl', data: '∞', unit: 'غير محدود', days: 10, price: Math.round(country.from * 6.8), tag: 'بلا حدود' },
]
