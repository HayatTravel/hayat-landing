export const deals = [
  {
    id: 'istanbul-weekend', to: 'IST', hotel: 'IST-0', title: 'إسطنبول في 4 ليالٍ', sub: 'طيران + فندق 5 نجوم على البوسفور',
    img: 'photo-1623439844752-524658b16ce6', nights: 4, price: 1_150_000, was: 1_490_000, ends: 2,
    includes: ['تذاكر ذهاب وعودة', 'فندق مع إفطار', 'نقل من وإلى المطار', 'جولة بحرية في البوسفور'],
  },
  {
    id: 'dubai-family', to: 'DXB', hotel: 'DXB-0', title: 'دبي للعائلة', sub: '5 ليالٍ مع دخول الحدائق المائية',
    img: 'photo-1651467606797-e1c660cf3fda', nights: 5, price: 1_890_000, was: 2_350_000, ends: 5,
    includes: ['تذاكر طيران الإمارات', 'منتجع على الشاطئ', 'تذاكر أكوافنتشر', 'eSIM مجانية 5GB'],
  },
  {
    id: 'maldives-honeymoon', to: 'MLE', hotel: 'MLE-1', title: 'شهر عسل في المالديف', sub: 'فيلا فوق الماء — إقامة شاملة كلياً',
    img: 'photo-1601999705946-fbf42c3c6c66', nights: 6, price: 4_750_000, was: 5_900_000, ends: 7,
    includes: ['طيران عبر الدوحة', 'فيلا فوق الماء', 'شامل كلياً', 'نقل بالطائرة المائية'],
  },
  {
    id: 'baku-escape', to: 'GYD', hotel: 'GYD-1', title: 'باكو الساحرة', sub: 'المدينة القديمة وأبراج اللهب',
    img: 'photo-1596306499300-0b7b1689b9f6', nights: 4, price: 890_000, was: 1_120_000, ends: 3,
    includes: ['طيران مباشر فلاي بغداد', 'فندق 4 نجوم', 'جولة المدينة', 'تأمين سفر'],
  },
  {
    id: 'tbilisi-nature', to: 'TBS', hotel: 'TBS-2', title: 'جورجيا الخضراء', sub: 'تبليسي وكاخيتي والجبال',
    img: 'photo-1561731172-9d906d7b13bf', nights: 5, price: 980_000, was: 1_250_000, ends: 4,
    includes: ['تذاكر طيران', 'فندقان', 'رحلة إلى كازبيجي', 'مرشد عربي'],
  },
  {
    id: 'antalya-beach', to: 'AYT', hotel: 'AYT-0', title: 'صيف أنطاليا', sub: 'منتجع شامل على البحر المتوسط',
    img: 'photo-1672593657366-8219c888c243', nights: 6, price: 1_320_000, was: 1_640_000, ends: 6,
    includes: ['طيران مباشر', 'شامل كلياً', 'حديقة مائية', 'نقل خاص'],
  },
]

export const findDeal = (id) => deals.find((d) => d.id === id)
