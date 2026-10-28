/* HR on the website: how we hire, life at Hayat, students, onboarding for new joiners.
   Every text is { ar, en, ku } (fa/tr/fr/de may be added beside them; L() falls back to English).
   Facts HR has not confirmed carry tbc: true and show the "To be confirmed by HR" chip. Roles live in data/company.js (samples). */
import INTL from './hr.intl.js'

/* fa · tr · fr · de come from hr.intl.js (keyed by the English text). */
const N = (ar, en, ku) => ({ ar, en, ku, ...INTL[en] })

/** Departments people can join (role.dept keys; labels are cp.dept.*). */
export const HR_DEPTS = ['retail', 'visa', 'inbound', 'corporate', 'finance', 'tech', 'ops']
export const HR_TYPES = ['full', 'part', 'intern']

/* ---------- how we hire: five steps ---------- */
export const STEPS = [
  { id: 'apply', icon: 'send', title: N('التقديم', 'Apply', 'داواکاری'),
    text: N('اختر الوظيفة وأرسل سيرتك الذاتية وبضعة أسطر عن نفسك. تحصل فوراً على رقم مرجع لمتابعة طلبك.', 'Choose a role and send your CV and a few lines about yourself. You get a reference number at once to track your application.', 'کارێک هەڵبژێرە و سیڤیەکەت و چەند دێڕێک دەربارەی خۆت بنێرە. یەکسەر ژمارەیەکی ئاماژەت پێ دەدرێت بۆ بەدواداچوونی داواکارییەکەت.'),
    prep: [N('سيرة ذاتية محدثة (PDF أو Word)', 'An up-to-date CV (PDF or Word)', 'سیڤییەکی نوێکراوە (PDF یان Word)'), N('رقم هاتف نستطيع التواصل معك عليه', 'A phone number we can reach you on', 'ژمارە مۆبایلێک کە بتوانین پەیوەندیت پێوە بکەین')] },
  { id: 'screen', icon: 'documents', title: N('المراجعة', 'Screening', 'پێداچوونەوە'),
    text: N('يقرأ فريق الموارد البشرية ومدير القسم كل طلب. قد نتصل بك لمكالمة قصيرة.', 'HR and the department manager read every application. We may call you for a short conversation.', 'تیمی سەرچاوە مرۆییەکان و بەڕێوەبەری بەش هەموو داواکارییەک دەخوێننەوە. لەوانەیە بۆ گفتوگۆیەکی کورت پەیوەندیت پێوە بکەین.'),
    prep: [N('كن متاحاً للرد على الهاتف', 'Keep your phone at hand', 'مۆبایلەکەت لە نزیک خۆت بێت'), N('فكّر لماذا تريد هذه الوظيفة', 'Think about why you want this role', 'بیر بکەرەوە بۆچی ئەم کارەت دەوێت')] },
  { id: 'interview', icon: 'users', title: N('المقابلة', 'Interview', 'چاوپێکەوتن'),
    text: N('مقابلة أو اثنتان مع المدير وزميل من الفريق، في المكتب أو عبر الفيديو. لبعض الوظائف تمرين عملي قصير.', 'One or two interviews with the manager and a team member, at the office or by video. Some roles include a short practical exercise.', 'یەک یان دوو چاوپێکەوتن لەگەڵ بەڕێوەبەر و ئەندامێکی تیم، لە ئۆفیس یان بە ڤیدیۆ. هەندێک کار ڕاهێنانێکی کرداری کورتی تێدایە.'),
    prep: [N('هوية شخصية', 'A photo ID', 'ناسنامەیەکی وێنەدار'), N('أمثلة من عملك السابق', 'Examples from your past work', 'نموونە لە کارە پێشووەکانت'), N('أسئلتك لنا', 'Your questions for us', 'پرسیارەکانت بۆ ئێمە')] },
  { id: 'offer', icon: 'check', title: N('العرض', 'Offer', 'پێشنیار'),
    text: N('نرسل عرضاً مكتوباً يوضح الراتب والدوام وتاريخ البدء وفترة التجربة. تأخذ وقتك لقراءته.', 'We send a written offer with the salary, working hours, start date and probation period. Take your time to read it.', 'پێشنیارێکی نووسراو دەنێرین کە مووچە، کاتی کار، ڕێکەوتی دەستپێک و ماوەی تاقیکردنەوە ڕوون دەکاتەوە. کاتی خۆت بۆ خوێندنەوەی بگرە.'),
    prep: [N('الشهادات الأصلية', 'Original certificates', 'بڕوانامە ڕەسەنەکان'), N('معلومات الحساب المصرفي', 'Bank account details', 'زانیاری هەژماری بانکی')] },
  { id: 'onboard', icon: 'home', title: N('الانضمام', 'Onboarding', 'دەستپێکردن'),
    text: N('قبل يومك الأول نرسل لك رمز الانضمام وقائمة بما تحتاجه. في الأسبوع الأول تتدرب على أنظمتنا مع زميل.', 'Before your first day we send you a joining code and a list of what you need. In your first week you train on our systems with a colleague.', 'پێش یەکەم ڕۆژت کۆدی دەستپێکردن و لیستی ئەوەی پێویستتە بۆت دەنێرین. لە یەکەم هەفتەدا لەگەڵ هاوکارێک ڕاهێنان لەسەر سیستەمەکانمان دەکەیت.'),
    prep: [N('رمز الانضمام من رسالة العرض', 'The joining code from your offer letter', 'کۆدی دەستپێکردن لە نامەی پێشنیارەکەت')], link: '/careers/onboarding' },
]

/* ---------- FAQ ---------- */
export const HR_FAQ = [
  { q: N('هل يمكنني التقديم على أكثر من وظيفة؟', 'Can I apply for more than one role?', 'دەتوانم داواکاری بۆ زیاتر لە کارێک پێشکەش بکەم؟'), a: N('نعم. ستحصل على رقم مرجع لكل طلب.', 'Yes. You get a reference number for each application.', 'بەڵێ. بۆ هەر داواکارییەک ژمارەیەکی ئاماژەت پێ دەدرێت.') },
  { q: N('متى أعرف النتيجة؟', 'When will I hear back?', 'کەی ئەنجامەکە دەزانم؟'), a: N('تابع طلبك برقم المرجع ورقم هاتفك. نخبر كل متقدم بالنتيجة، سواء قُبل أم لا.', 'Track your application with your reference and phone number. We tell every applicant the outcome, whether or not they are selected.', 'بە ژمارەی ئاماژە و ژمارەی مۆبایلەکەت بەدواداچوون بۆ داواکارییەکەت بکە. ئەنجامەکە بە هەموو داواکارێک دەڵێین، چ هەڵبژێردرابێت یان نا.') },
  { q: N('هل أحتاج إلى خبرة في السفر؟', 'Do I need travel experience?', 'ئایا ئەزموونی گەشتم پێویستە؟'), a: N('ليس لكل الوظائف. ندرّب على أنظمة الحجز، ونهتم بالدقة والتعامل مع الناس.', 'Not for every role. We train you on booking systems; we look for care, accuracy and a good way with people.', 'بۆ هەموو کارێک نا. ڕاهێنانت لەسەر سیستەمەکانی حیجز پێ دەکەین؛ بەدوای گرنگیپێدان، وردی و مامەڵەی باش لەگەڵ خەڵکدا دەگەڕێین.') },
  { q: N('بأي لغة تكون المقابلة؟', 'Which language is the interview in?', 'چاوپێکەوتن بە چ زمانێکە؟'), a: N('العربية أو الكوردية أو الإنجليزية، كما تفضل. بعض الوظائف تتطلب الإنجليزية.', 'Arabic, Kurdish or English, as you prefer. Some roles require English.', 'عەرەبی، کوردی یان ئینگلیزی، وەک خۆت پێت باشە. هەندێک کار ئینگلیزی پێویستە.') },
]

/* ---------- life at Hayat ---------- */
export const DEPT_TEXT = {
  retail: N('حجز الرحلات وإصدار التذاكر في المكاتب وعلى المحادثة.', 'Booking trips and issuing tickets in the offices and in chat.', 'حیجزی گەشت و دەرکردنی بلیت لە ئۆفیسەکان و لە چات.'),
  visa: N('مراجعة الملفات والتقديم ومتابعة الطلبات.', 'Checking files, applying and tracking applications.', 'پشکنینی دۆسیە، پێشکەشکردن و بەدواداچوونی داواکارییەکان.'),
  inbound: N('برامج الزوار في العراق: المرشدون والنقل والفنادق.', 'Programmes for visitors in Iraq: guides, transport and hotels.', 'بەرنامەی سەردانکەران لە عێراق: ڕێبەر، گواستنەوە و هوتێل.'),
  corporate: N('حسابات الشركات والوكالات وسياسات السفر.', 'Company and agency accounts and travel policies.', 'هەژماری کۆمپانیا و ئاژانسەکان و سیاسەتەکانی گەشت.'),
  finance: N('الحسابات والمدفوعات والفوترة والمطابقة.', 'Accounts, payments, invoicing and reconciliation.', 'ژمێریاری، پارەدان، پسوولە و یەکسانکردنەوە.'),
  tech: N('الموقع وبوابة الوكالات والأنظمة الداخلية.', 'The website, the agency portal and internal systems.', 'ماڵپەڕ، دەروازەی ئاژانسەکان و سیستەمە ناوخۆییەکان.'),
  ops: N('العمليات والطيران العارض والتواصل مع شركات الطيران.', 'Operations, charter flights and contact with airlines.', 'کارگێڕی، فڕینی چارتەر و پەیوەندی لەگەڵ کۆمپانیاکانی فڕین.'),
}
export const LEARNING = [
  N('تدريب على بوابة الحجز ونظام المنتجات ونظام إدارة العملاء', 'Training on the Booking Portal, the Products system and the CRM', 'ڕاهێنان لەسەر دەروازەی حیجز، سیستەمی بەرهەمەکان و CRM'),
  N('مرافقة زميل ذي خبرة في الأسابيع الأولى', 'Shadowing an experienced colleague in your first weeks', 'هاوڕێیەتی هاوکارێکی بەئەزموون لە یەکەم هەفتەکاندا'),
  N('تدريب على قواعد التأشيرات وشروط شركات الطيران', 'Training on visa rules and airline fare conditions', 'ڕاهێنان لەسەر یاساکانی ڤیزا و مەرجەکانی نرخی کۆمپانیاکانی فڕین'),
]
export const BENEFITS = [
  { title: N('راتب تنافسي', 'Competitive salary', 'مووچەی کێبڕکێکار'), tbc: true },
  { title: N('تدريب مدفوع', 'Paid training', 'ڕاهێنانی پارەدراو'), tbc: true },
  { title: N('مزايا سفر للموظفين', 'Travel benefits for staff', 'سوودی گەشت بۆ کارمەندان'), tbc: true },
]

/* ---------- students and graduates ---------- */
export const PROGRAMMES = [
  { id: 'intern', icon: 'calendar', tbc: true, title: N('التدريب الصيفي', 'Summer internships', 'ڕاهێنانی هاوینە'),
    text: N('ستة إلى ثمانية أسابيع في قسم واحد، مع مشرف ومشروع صغير.', 'Six to eight weeks in one department, with a supervisor and a small project.', 'شەش تا هەشت هەفتە لە یەک بەشدا، لەگەڵ سەرپەرشتیار و پرۆژەیەکی بچووک.') },
  { id: 'grad', icon: 'star', tbc: true, title: N('برنامج الخريجين', 'Graduate programme', 'بەرنامەی دەرچووان'),
    text: N('سنة تتنقل فيها بين المبيعات والتأشيرات والعمليات، ثم تختار مسارك.', 'A year moving between sales, visas and operations, then you choose your path.', 'ساڵێک لە نێوان فرۆشتن، ڤیزا و کارگێڕیدا دەگوازرێیتەوە، پاشان ڕێگای خۆت هەڵدەبژێریت.') },
]

/* ---------- onboarding checklist (progress is saved per joining code) ---------- */
export const ONBOARDING = [
  { id: 'before', icon: 'documents', title: N('قبل يومك الأول', 'Before day one', 'پێش یەکەم ڕۆژ'), items: [
    { id: 'id', text: N('صورة الهوية الوطنية أو جواز السفر', 'A copy of your national ID or passport', 'کۆپی ناسنامەی نیشتمانی یان پاسپۆرت') },
    { id: 'certs', text: N('نسخ من الشهادات', 'Copies of your certificates', 'کۆپی بڕوانامەکانت') },
    { id: 'bank', text: N('معلومات الحساب المصرفي للراتب', 'Bank account details for your salary', 'زانیاری هەژماری بانکی بۆ مووچە') },
    { id: 'photo', text: N('صورة شخصية لبطاقة الموظف', 'A photo for your staff card', 'وێنەیەک بۆ کارتی کارمەند') },
    { id: 'contract', text: N('العقد موقّعاً', 'Your signed contract', 'گرێبەستە واژۆکراوەکەت') },
  ] },
  { id: 'day1', icon: 'home', title: N('اليوم الأول', 'Day one', 'یەکەم ڕۆژ'), items: [
    { id: 'office', text: N('الوصول إلى مكتبك الساعة 9:00 والسؤال عن الموارد البشرية', 'Arrive at your office at 9:00 and ask for HR', 'لە کاتژمێر 9:00 بگە بە ئۆفیسەکەت و داوای سەرچاوە مرۆییەکان بکە') },
    { id: 'welcome', text: N('جولة تعريفية ولقاء الفريق', 'A welcome tour and meeting your team', 'گەشتێکی ناساندن و ناسینی تیمەکەت') },
    { id: 'iam', text: N('حساب الدخول الموحد والوصول إلى الأنظمة', 'Your single sign-on account and systems access', 'هەژماری چوونەژوورەوەی یەکگرتوو و دەستگەیشتن بە سیستەمەکان') },
    { id: 'kit', text: N('استلام الجهاز والمعدات', 'Collect your computer and equipment', 'وەرگرتنی کۆمپیوتەر و کەرەستەکان') },
  ] },
  { id: 'week1', icon: 'users', title: N('الأسبوع الأول', 'First week', 'یەکەم هەفتە'), items: [
    { id: 'portal', text: N('تدريب على بوابة الحجز', 'Training on the Booking Portal', 'ڕاهێنان لەسەر دەروازەی حیجز') },
    { id: 'products', text: N('تدريب على نظام المنتجات والطيران العارض', 'Training on the Products and charter system', 'ڕاهێنان لەسەر سیستەمی بەرهەم و چارتەر') },
    { id: 'crm', text: N('تدريب على نظام إدارة العملاء والمحادثة', 'Training on the CRM and chat', 'ڕاهێنان لەسەر CRM و چات') },
    { id: 'shadow', text: N('مرافقة زميل في عمله اليومي', 'Shadow a colleague in their daily work', 'هاوڕێیەتی هاوکارێک لە کاری ڕۆژانەیدا') },
  ] },
  { id: 'd90', icon: 'calendar', title: N('أول 90 يوماً', 'First 90 days', 'یەکەم 90 ڕۆژ'), items: [
    { id: 'goals', text: N('الاتفاق على أهدافك مع مديرك', 'Agree your goals with your manager', 'لەسەر ئامانجەکانت لەگەڵ بەڕێوەبەرەکەت ڕێک بکەوە') },
    { id: 'checkin', text: N('لقاء متابعة شهري', 'A monthly check-in', 'دیدارێکی بەدواداچوونی مانگانە') },
    { id: 'probation', text: N('مراجعة نهاية فترة التجربة', 'The end-of-probation review', 'هەڵسەنگاندنی کۆتایی ماوەی تاقیکردنەوە'), tbc: true },
  ] },
  { id: 'policies', icon: 'shield', title: N('سياسات تقرأها', 'Policies to read', 'سیاسەتەکان بۆ خوێندنەوە'), items: [
    { id: 'conduct', text: N('مدونة السلوك', 'Code of conduct', 'یاسای ڕەفتار') },
    { id: 'data', text: N('حماية البيانات وخصوصية العملاء', 'Data protection and customer privacy', 'پاراستنی زانیاری و تایبەتمەندی کڕیار') },
    { id: 'travel', text: N('سياسة سفر الموظفين', 'Staff travel policy', 'سیاسەتی گەشتی کارمەندان') },
  ] },
]
export const ONB_CONTACTS = [
  { id: 'hr', icon: 'users', title: N('الموارد البشرية', 'HR', 'سەرچاوە مرۆییەکان'), text: N('العقد والمستندات والراتب والإجازات.', 'Contract, documents, salary and leave.', 'گرێبەست، بەڵگەنامە، مووچە و مۆڵەت.') },
  { id: 'manager', icon: 'user', title: N('مديرك', 'Your manager', 'بەڕێوەبەرەکەت'), text: N('العمل اليومي والأهداف والتدريب.', 'Daily work, goals and training.', 'کاری ڕۆژانە، ئامانج و ڕاهێنان.') },
  { id: 'it', icon: 'lock', title: N('الدعم التقني', 'IT support', 'پشتگیری تەکنیکی'), text: N('الحساب وكلمات المرور والأجهزة.', 'Your account, passwords and devices.', 'هەژمار، وشەی نهێنی و ئامێرەکان.') },
]
