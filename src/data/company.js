/* The company side of Hayat: who we are, offices, business lines, careers, announcements, legal summaries.
   Every text is { ar, en, ku } (fa/tr/fr/de may be added beside them). Only facts Hayat has confirmed are stated as fact;
   anything else carries tbc: true and shows the "To be confirmed by Hayat" chip. Careers and news are samples. */
const N = (ar, en, ku) => ({ ar, en, ku })

export const CONTACT = { email: 'info@hayat.iq', domain: 'hayat.iq', portal: 'https://booking.hayat.iq' }

/* ---------- values ---------- */
export const VALUES = [
  { id: 'care', icon: 'heart', title: N('العناية', 'Care', 'گرنگیپێدان'),
    text: N('نتابع رحلتك من أول سؤال حتى عودتك، ونرد عليك بأنفسنا.', 'We look after your trip from the first question until you are home, and we answer you ourselves.', 'لە یەکەم پرسیارەوە تا گەڕانەوەت ئاگامان لە گەشتەکەتە، و خۆمان وەڵامت دەدەینەوە.') },
  { id: 'clarity', icon: 'check', title: N('الوضوح والسعر الصادق', 'Clarity and honest prices', 'ڕوونی و نرخی ڕاستگۆیانە'),
    text: N('السعر الذي تراه هو ما تدفعه، والشروط مكتوبة قبل الدفع.', 'The price you see is the price you pay, and the terms are in writing before you pay.', 'ئەو نرخەی دەیبینیت ئەوەیە کە دەیدەیت، و مەرجەکان پێش پارەدان نووسراون.') },
  { id: 'reliable', icon: 'shield', title: N('الاعتمادية', 'Reliability', 'متمانەپێکراوی'),
    text: N('نؤكد ما نعد به، ونخبرك مبكراً إن تغير شيء.', 'We confirm what we promise, and we tell you early when something changes.', 'ئەوەی بەڵێنی پێدەدەین پشتڕاستی دەکەینەوە، و ئەگەر شتێک گۆڕا زوو پێت دەڵێین.') },
  { id: 'local', icon: 'pin', title: N('المعرفة المحلية', 'Local knowledge', 'زانیاری ناوخۆیی'),
    text: N('فريق عراقي يعرف المطارات والسفارات والطرق والفنادق من الداخل.', 'An Iraqi team that knows the airports, embassies, roads and hotels from the inside.', 'تیمێکی عێراقی کە فڕۆکەخانە، باڵیۆزخانە، ڕێگا و هوتێلەکان لە نزیکەوە دەناسێت.') },
  { id: 'respect', icon: 'users', title: N('احترام كل مسافر', 'Respect for every traveller', 'ڕێز لە هەموو گەشتیارێک'),
    text: N('عائلة أو طالب أو زائر أو شركة: نفس الاهتمام ونفس الصدق.', 'A family, a student, a pilgrim or a company: the same attention and the same honesty.', 'خێزان، خوێندکار، زائیر یان کۆمپانیا: هەمان گرنگیپێدان و هەمان ڕاستگۆیی.') },
]

/* ---------- business lines (Hayat's own systems) ---------- */
export const LINES = [
  { id: 'retail', icon: 'plane', to: '/flights', title: N('السفر للأفراد والعائلات', 'Travel for individuals and families', 'گەشت بۆ تاک و خێزان'),
    text: N('طيران وفنادق وعطلات وتأشيرات وشرائح eSIM وفعاليات وتأجير سيارات.', 'Flights, hotels, holidays, visas, eSIM, events and car rental.', 'فڕین، هوتێل، پشوو، ڤیزا، eSIM، بۆنە و بەکرێگرتنی ئۆتۆمبێل.') },
  { id: 'charter', icon: 'plane', to: '/flights', title: N('برامج الحياة للطيران العارض (تشارتر)', 'Hayat charter programmes', 'بەرنامەکانی چارتەری حەیات'),
    text: N('رحلات مباشرة موسمية من بغداد وأربيل والبصرة إلى وجهات العطلات.', 'Seasonal direct flights from Baghdad, Erbil and Basra to holiday destinations.', 'فڕینی ڕاستەوخۆی وەرزی لە بەغدا، هەولێر و بەسرەوە بۆ شوێنەکانی پشوو.') },
  { id: 'ia', icon: 'ticket', to: '/flights', tbc: true, title: N('إصدار تذاكر الخطوط الجوية العراقية', 'Authorised Iraqi Airways ticketing', 'دەرکردنی بلیتی هێڵی ئاسمانی عێراقی'),
    text: N('إصدار وتعديل تذاكر الخطوط الجوية العراقية في مكاتبنا وعلى الموقع.', 'Issuing and changing Iraqi Airways tickets at our offices and online.', 'دەرکردن و گۆڕینی بلیتی هێڵی ئاسمانی عێراقی لە ئۆفیسەکانمان و لە ماڵپەڕ.') },
  { id: 'b2b', icon: 'building', href: CONTACT.portal, title: N('بوابة الحجز لوكالات السفر', 'Booking portal for travel agencies', 'دەروازەی حیجز بۆ ئاژانسەکانی گەشت'),
    text: N('أسعار جملة ومحفظة ائتمان ومستندات باسم الوكالة على booking.hayat.iq.', 'Net rates, a credit wallet and agency-branded documents at booking.hayat.iq.', 'نرخی کۆ، جزدانی قەرز و بەڵگەنامە بە ناوی ئاژانس لە booking.hayat.iq.') },
  { id: 'corporate', icon: 'documents', to: '/contact?topic=business', title: N('سفر الشركات', 'Corporate travel', 'گەشتی کۆمپانیاکان'),
    text: N('حسابات للشركات وسياسة سفر وفوترة شهرية.', 'Company accounts, a travel policy and monthly invoicing.', 'هەژماری کۆمپانیا، سیاسەتی گەشت و پسوولەی مانگانە.') },
  { id: 'hotels', icon: 'bed', to: '/hotels', title: N('التعاقد الفندقي', 'Hotel contracting', 'گرێبەستی هوتێل'),
    text: N('غرف متعاقد عليها مباشرة مع فنادق في الوجهات الأكثر طلباً.', 'Rooms contracted directly with hotels in the destinations people ask for most.', 'ژووری ڕاستەوخۆ گرێبەستکراو لەگەڵ هوتێلەکان لەو شوێنانەی زۆرترین داواکارییان هەیە.') },
  { id: 'visa', icon: 'passport', to: '/visa', title: N('مركز خدمات التأشيرات', 'Visa services centre', 'ناوەندی خزمەتگوزاری ڤیزا'),
    text: N('مراجعة المستندات وتقديم الطلبات ومتابعتها حتى صدور التأشيرة.', 'Document checks, applications and tracking until the visa is issued.', 'پشکنینی بەڵگەنامە، پێشکەشکردنی داواکاری و بەدواداچوون تا ڤیزا دەردەچێت.') },
  { id: 'inbound', icon: 'map', to: '/visit', title: N('السياحة الوافدة إلى العراق', 'Inbound travel to Iraq', 'گەشتی هاتوو بۆ عێراق'),
    text: N('جولات في العراق وترتيبات الزيارات الدينية وتأشيرات العراق ومرشدون.', 'Tours in Iraq, religious-visit arrangements, visas to Iraq and guides.', 'گەشت لە عێراق، ڕێکخستنی سەردانی ئایینی، ڤیزای عێراق و ڕێبەر.') },
  { id: 'events', icon: 'ticket', to: '/events', title: N('تذاكر الفعاليات', 'Event ticketing', 'بلیتی بۆنەکان'),
    text: N('حفلات ومباريات ومعارض في العراق والمنطقة.', 'Concerts, matches and exhibitions in Iraq and the region.', 'کۆنسێرت، یاری و پێشانگا لە عێراق و ناوچەکە.') },
]

/* ---------- milestones: no invented dates ---------- */
export const MILESTONES = [
  { when: null, title: N('تأسيس الحياة للسفر والسياحة في بغداد', 'Hayat Travel & Tourism founded in Baghdad', 'دامەزراندنی حەیات بۆ گەشت و گوزار لە بەغدا') },
  { when: null, title: N('افتتاح مكاتب أربيل والبصرة', 'Offices open in Erbil and Basra', 'کردنەوەی ئۆفیسەکانی هەولێر و بەسرە') },
  { when: null, title: N('أول برنامج طيران عارض (تشارتر)', 'First charter programme', 'یەکەم بەرنامەی چارتەر') },
  { when: null, title: N('إطلاق بوابة الحجز للوكالات', 'Booking portal for agencies launched', 'دەستپێکردنی دەروازەی حیجز بۆ ئاژانسەکان') },
  { when: null, title: N('الحجز عبر الموقع بالدينار وطرق الدفع المحلية', 'Online booking in dinars with local payment methods', 'حیجزی ئۆنلاین بە دینار و ڕێگاکانی پارەدانی ناوخۆیی') },
]

/* ---------- licences and memberships (all to confirm) ---------- */
export const LICENCES = [
  { id: 'mot', icon: 'shield', title: N('رخصة وزارة السياحة العراقية', 'Licence of the Iraqi Ministry of Tourism', 'مۆڵەتی وەزارەتی گەشتوگوزاری عێراق'), text: N('رقم الرخصة يُذكر هنا.', 'Licence number shown here.', 'ژمارەی مۆڵەت لێرە دەنووسرێت.') },
  { id: 'iata', icon: 'plane', title: N('عضوية الاتحاد الدولي للنقل الجوي (IATA)', 'IATA accreditation', 'ئەندامێتی IATA'), text: N('رقم الاعتماد يُذكر هنا.', 'Accreditation number shown here.', 'ژمارەی پەسەندکردن لێرە دەنووسرێت.') },
  { id: 'ia', icon: 'ticket', title: N('وكيل معتمد للخطوط الجوية العراقية', 'Authorised Iraqi Airways agent', 'بریکاری پەسەندکراوی هێڵی ئاسمانی عێراقی'), text: N('تفاصيل الاعتماد تُذكر هنا.', 'Details of the authorisation shown here.', 'وردەکاری پەسەندکردن لێرە دەنووسرێت.') },
]

/* ---------- teams (roles, no names) ---------- */
export const TEAMS = [
  { id: 'gm', icon: 'building', title: N('الإدارة العامة', 'General management', 'بەڕێوەبەرایەتی گشتی'), text: N('القرارات والجودة والعلاقة مع الشركاء.', 'Decisions, quality and relations with partners.', 'بڕیار، کوالیتی و پەیوەندی لەگەڵ هاوبەشەکان.') },
  { id: 'retail', icon: 'users', title: N('فريق المبيعات وخدمة المسافرين', 'Travel consultants and customer care', 'ڕاوێژکارانی گەشت و خزمەتی کڕیار'), text: N('في المكاتب وعلى الهاتف والمحادثة.', 'In the offices, on the phone and in chat.', 'لە ئۆفیسەکان، لە تەلەفۆن و لە چات.') },
  { id: 'visa', icon: 'passport', title: N('مركز التأشيرات', 'Visa centre', 'ناوەندی ڤیزا'), text: N('مراجعة المستندات والتقديم والمتابعة.', 'Document checks, applications and follow-up.', 'پشکنینی بەڵگەنامە، پێشکەشکردن و بەدواداچوون.') },
  { id: 'inbound', icon: 'map', title: N('فريق السياحة الوافدة', 'Inbound team', 'تیمی گەشتی هاتوو'), text: N('الجولات والمرشدون والزيارات في العراق.', 'Tours, guides and visits inside Iraq.', 'گەشت، ڕێبەر و سەردان لە ناو عێراق.') },
  { id: 'corporate', icon: 'documents', title: N('مكتب الشركات', 'Corporate desk', 'مێزی کۆمپانیاکان'), text: N('حسابات الشركات والوكالات والفوترة.', 'Company and agency accounts, and invoicing.', 'هەژماری کۆمپانیا و ئاژانسەکان، و پسوولە.') },
  { id: 'ops', icon: 'plane', title: N('العمليات والطيران العارض', 'Operations and charter', 'کارگێڕی و چارتەر'), text: N('التذاكر والبرامج الموسمية والتواصل مع شركات الطيران.', 'Ticketing, seasonal programmes and contact with airlines.', 'بلیت، بەرنامە وەرزییەکان و پەیوەندی لەگەڵ کۆمپانیاکانی فڕین.') },
]

/* ---------- offices (area-level addresses; map searches use the area name) ---------- */
const H1 = N('السبت–الخميس 9:00–21:00', 'Saturday–Thursday 9:00–21:00', 'شەممە–پێنجشەممە 9:00–21:00')
const H2 = N('السبت–الخميس 9:00–20:00', 'Saturday–Thursday 9:00–20:00', 'شەممە–پێنجشەممە 9:00–20:00')
export const OFFICES = [
  { id: 'baghdad', head: true, city: N('بغداد', 'Baghdad', 'بەغدا'), area: N('الكرادة', 'Karrada', 'کەڕادە'), hours: H1, map: 'Karrada, Baghdad, Iraq', services: ['cash', 'visa', 'ticket', 'corporate', 'inbound'] },
  { id: 'erbil', city: N('أربيل', 'Erbil', 'هەولێر'), area: N('شارع 100', '100m Road', 'شەقامی 100 مەتری'), hours: H1, map: '100m Road, Erbil, Iraq', services: ['cash', 'visa', 'ticket', 'inbound'] },
  { id: 'basra', city: N('البصرة', 'Basra', 'بەسرە'), area: N('العشار', 'Al-Ashar', 'عەشار'), hours: H2, map: 'Al-Ashar, Basra, Iraq', services: ['cash', 'visa', 'ticket'] },
  { id: 'najaf', city: N('النجف', 'Najaf', 'نەجەف'), area: N('شارع الكوفة', 'Kufa Street', 'شەقامی کووفە'), hours: H2, map: 'Kufa Street, Najaf, Iraq', services: ['cash', 'ticket', 'inbound'], tbc: true },
]
export const mapsUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`

/* ---------- careers (sample roles) ---------- */
export const DEPARTMENTS = ['retail', 'visa', 'inbound', 'corporate', 'ops', 'tech']
export const ROLES = [
  { id: 'travel-consultant', dept: 'retail', city: 'baghdad', type: 'full',
    title: N('مستشار سفر', 'Travel consultant', 'ڕاوێژکاری گەشت'),
    summary: N('تساعد العائلات والأفراد في اختيار رحلاتهم وحجزها في مكتب الكرادة وعلى المحادثة.', 'Help families and individuals choose and book their trips at the Karrada office and in chat.', 'یارمەتی خێزان و تاکەکان دەدەیت بۆ هەڵبژاردن و حیجزکردنی گەشتەکانیان لە ئۆفیسی کەڕادە و لە چات.'),
    duties: [N('حجز الطيران والفنادق والعطلات', 'Book flights, hotels and holidays', 'حیجزی فڕین، هوتێل و پشوو'), N('شرح الشروط والأسعار بوضوح', 'Explain terms and prices clearly', 'ڕوونکردنەوەی مەرج و نرخەکان بە ڕوونی'), N('متابعة الحجوزات حتى السفر', 'Follow bookings until departure', 'بەدواداچوونی حیجزەکان تا ڕۆیشتن')],
    needs: [N('خبرة في نظام حجز (GDS) ميزة', 'Experience with a GDS is a plus', 'ئەزموون لەگەڵ GDS خاڵێکی باشە'), N('العربية والإنجليزية؛ الكوردية ميزة', 'Arabic and English; Kurdish is a plus', 'عەرەبی و ئینگلیزی؛ کوردی خاڵێکی باشە'), N('صبر ووضوح مع الناس', 'Patience and clarity with people', 'ئارامی و ڕوونی لەگەڵ خەڵک')] },
  { id: 'visa-officer', dept: 'visa', city: 'erbil', type: 'full',
    title: N('موظف تأشيرات', 'Visa officer', 'فەرمانبەری ڤیزا'),
    summary: N('تراجع ملفات التأشيرات وتقدمها وتتابعها مع السفارات ومراكز الطلبات.', 'Check visa files, submit them and follow them up with embassies and application centres.', 'دۆسیەکانی ڤیزا دەپشکنیت، پێشکەشیان دەکەیت و لەگەڵ باڵیۆزخانە و ناوەندەکانی داواکاری بەدواداچوونیان بۆ دەکەیت.'),
    duties: [N('مراجعة المستندات قبل التقديم', 'Review documents before submission', 'پشکنینی بەڵگەنامەکان پێش پێشکەشکردن'), N('حجز المواعيد ومتابعة الطلبات', 'Book appointments and track applications', 'گرتنی کات و بەدواداچوونی داواکارییەکان'), N('إبلاغ العملاء بكل خطوة', 'Keep customers informed at every step', 'ئاگادارکردنەوەی کڕیاران لە هەموو هەنگاوێک')],
    needs: [N('دقة عالية في التفاصيل', 'Close attention to detail', 'وردبینی زۆر'), N('الإنجليزية جيدة كتابة', 'Good written English', 'ئینگلیزی نووسینی باش'), N('خبرة في التأشيرات ميزة', 'Visa experience is a plus', 'ئەزموونی ڤیزا خاڵێکی باشە')] },
  { id: 'inbound-coordinator', dept: 'inbound', city: 'baghdad', type: 'full',
    title: N('منسق جولات وافدة', 'Inbound tour coordinator', 'ڕێکخەری گەشتی هاتوو'),
    summary: N('تنظم برامج الزوار القادمين إلى العراق: الفنادق والنقل والمرشدين والتصاريح.', 'Organise programmes for visitors to Iraq: hotels, transport, guides and permits.', 'بەرنامەی سەردانکەرانی عێراق ڕێک دەخەیت: هوتێل، گواستنەوە، ڕێبەر و مۆڵەت.'),
    duties: [N('إعداد البرامج والأسعار', 'Prepare programmes and quotes', 'ئامادەکردنی بەرنامە و نرخ'), N('التنسيق مع المرشدين والسائقين', 'Coordinate guides and drivers', 'هەماهەنگی لەگەڵ ڕێبەر و شۆفێرەکان'), N('متابعة المجموعات أثناء الرحلة', 'Look after groups during the trip', 'ئاگاداری گرووپەکان لە کاتی گەشت')],
    needs: [N('معرفة جيدة بالعراق ومدنه', 'Good knowledge of Iraq and its cities', 'زانیاری باش دەربارەی عێراق و شارەکانی'), N('الإنجليزية بطلاقة؛ لغة أخرى ميزة', 'Fluent English; another language is a plus', 'ئینگلیزی بە ڕەوانی؛ زمانێکی تر خاڵێکی باشە')] },
  { id: 'corporate-manager', dept: 'corporate', city: 'baghdad', type: 'full',
    title: N('مدير حسابات الشركات', 'Corporate account manager', 'بەڕێوەبەری هەژماری کۆمپانیاکان'),
    summary: N('تدير سفر الشركات المتعاقدة: السياسات والحجوزات والفوترة الشهرية.', 'Manage travel for contracted companies: policies, bookings and monthly invoicing.', 'گەشتی کۆمپانیا گرێبەستکراوەکان بەڕێوە دەبەیت: سیاسەت، حیجز و پسوولەی مانگانە.'),
    duties: [N('متابعة احتياجات كل شركة', 'Follow each company’s needs', 'بەدواداچوونی پێداویستی هەر کۆمپانیایەک'), N('إعداد التقارير الشهرية', 'Prepare monthly reports', 'ئامادەکردنی ڕاپۆرتی مانگانە')],
    needs: [N('خبرة في المبيعات أو خدمة الشركات', 'Experience in sales or business accounts', 'ئەزموون لە فرۆشتن یان هەژماری کۆمپانیا'), N('تنظيم ودقة', 'Organised and precise', 'ڕێکخراو و ورد')] },
  { id: 'frontend-developer', dept: 'tech', city: 'erbil', type: 'full',
    title: N('مطور واجهات', 'Front-end developer', 'گەشەپێدەری ڕووکار'),
    summary: N('تطور الموقع وبوابة الوكالات بثلاث لغات، من اليمين إلى اليسار ومن اليسار إلى اليمين.', 'Build the website and the agency portal in three languages, right-to-left and left-to-right.', 'ماڵپەڕ و دەروازەی ئاژانسەکان بە سێ زمان دروست دەکەیت، لە ڕاستەوە بۆ چەپ و لە چەپەوە بۆ ڕاست.'),
    duties: [N('بناء صفحات سريعة وسهلة الاستخدام', 'Build fast, accessible pages', 'دروستکردنی پەڕەی خێرا و ئاسان'), N('العمل مع فريق المنتج والتصميم', 'Work with product and design', 'کارکردن لەگەڵ تیمی بەرهەم و دیزاین')],
    needs: [N('React وCSS حديثة', 'React and modern CSS', 'React و CSSی نوێ'), N('اهتمام بالعربية والكوردية في الواجهات', 'Care for Arabic and Kurdish interfaces', 'گرنگیدان بە ڕووکاری عەرەبی و کوردی')] },
]

/* ---------- announcements (samples) ---------- */
export const NEWS = [
  { id: 'antalya-charter', date: '2026-04-02', tag: 'charter', title: N('برنامج طيران مباشر إلى أنطاليا للصيف', 'Direct charter programme to Antalya for the summer', 'بەرنامەی فڕینی ڕاستەوخۆ بۆ ئەنتاڵیا بۆ هاوین'),
    body: [N('تنطلق رحلات الحياة المباشرة من بغداد إلى أنطاليا أسبوعياً خلال موسم الصيف، مع باقات تشمل الفندق والتنقل.', 'Hayat’s direct flights from Baghdad to Antalya run weekly through the summer season, with packages that include the hotel and transfers.', 'فڕینە ڕاستەوخۆکانی حەیات لە بەغداوە بۆ ئەنتاڵیا هەفتانە لە وەرزی هاویندا دەبن، لەگەڵ پاکێجی هوتێل و گواستنەوە.'),
      N('المقاعد والمواعيد متاحة في نتائج البحث وفي صفحة العطلات.', 'Seats and dates appear in flight results and on the Holidays page.', 'کورسی و کاتەکان لە ئەنجامی گەڕانی فڕین و لە پەڕەی پشووەکاندا دەردەکەون.')], link: '/holidays/antalya-family' },
  { id: 'erbil-visa-centre', date: '2026-05-18', tag: 'office', title: N('مركز التأشيرات متاح الآن في مكتب أربيل', 'Visa centre now open at our Erbil office', 'ناوەندی ڤیزا ئێستا لە ئۆفیسی هەولێر کراوەیە'),
    body: [N('يمكنك تسليم مستندات التأشيرة ومراجعتها في مكتب أربيل بدلاً من السفر إلى بغداد.', 'You can now hand in and check your visa documents at the Erbil office instead of travelling to Baghdad.', 'ئێستا دەتوانیت بەڵگەنامەکانی ڤیزا لە ئۆفیسی هەولێر ڕادەست بکەیت و بیپشکنیت لە جیاتی چوون بۆ بەغدا.')], link: '/about/offices' },
  { id: 'zaincash-online', date: '2026-06-09', tag: 'payments', title: N('الدفع عبر زين كاش على الموقع', 'Pay with ZainCash online', 'پارەدان بە زەین کاش لە ماڵپەڕ'),
    body: [N('أصبح بإمكانك دفع حجزك من محفظة زين كاش مباشرة، إلى جانب كي كارد والبطاقات المصرفية والدفع في المكتب.', 'You can now pay for your booking straight from your ZainCash wallet, alongside Qi Card, bank cards and paying at an office.', 'ئێستا دەتوانیت ڕاستەوخۆ لە جزدانی زەین کاشەوە پارەی حیجزەکەت بدەیت، لەگەڵ کی کارد، کارتی بانکی و پارەدان لە ئۆفیس.')], link: '/legal/payments' },
  { id: 'visit-iraq', date: '2026-07-21', tag: 'inbound', title: N('جولات للزوار القادمين إلى العراق', 'Tours for visitors coming to Iraq', 'گەشت بۆ سەردانکەرانی عێراق'),
    body: [N('أطلقنا قسماً جديداً للزوار: أماكن وجولات بمرشدين، وإرشادات التأشيرة، وفنادق قرب المراقد والمواقع.', 'We have opened a new section for visitors: places and guided tours, visa guidance, and hotels near the shrines and sites.', 'بەشێکی نوێمان بۆ سەردانکەران کردەوە: شوێن و گەشتی لەگەڵ ڕێبەر، ڕێنمایی ڤیزا، و هوتێلی نزیک حەرەم و شوێنەوارەکان.')], link: '/visit' },
  { id: 'agency-portal', date: '2026-08-30', tag: 'business', title: N('بوابة الحجز لوكالات السفر', 'The booking portal for travel agencies', 'دەروازەی حیجز بۆ ئاژانسەکانی گەشت'),
    body: [N('يمكن لوكالات السفر الحجز بأسعار الجملة واستخدام محفظة ائتمان وإصدار مستندات باسمها على booking.hayat.iq.', 'Travel agencies can book at net rates, use a credit wallet and issue documents under their own name at booking.hayat.iq.', 'ئاژانسەکانی گەشت دەتوانن بە نرخی کۆ حیجز بکەن، جزدانی قەرز بەکاربهێنن و بەڵگەنامە بە ناوی خۆیان دەربکەن لە booking.hayat.iq.')], href: CONTACT.portal },
  { id: 'esim', date: '2026-09-14', tag: 'product', title: N('شرائح eSIM للمسافرين', 'eSIM for travellers', 'eSIM بۆ گەشتیاران'),
    body: [N('اشترِ باقة بيانات لوجهتك قبل السفر وفعّلها عند الوصول.', 'Buy a data plan for your destination before you leave and switch it on when you land.', 'پێش گەشت پاکێجی ئینتەرنێت بۆ شوێنی مەبەستەکەت بکڕە و لە کاتی گەیشتن چالاکی بکە.')], link: '/esim' },
]

/* ---------- legal summaries (draft for legal review) ---------- */
export const LEGAL_UPDATED = '2026-10-29'
const sec = (h, p) => ({ h, p })
export const LEGAL = {
  terms: { title: N('شروط الحجز والاستخدام', 'Booking terms and conditions', 'مەرجەکانی حیجز و بەکارهێنان'), sections: [
    sec(N('من نحن', 'Who we are', 'ئێمە کێین'), N('الحياة للسفر والسياحة وكالة سفر عراقية. عند الحجز تتعاقد معنا، ونحجز لك لدى شركات الطيران والفنادق ومقدمي الخدمات.', 'Hayat Travel & Tourism is an Iraqi travel agency. When you book, your contract is with us, and we book on your behalf with airlines, hotels and other providers.', 'حەیات بۆ گەشت و گوزار ئاژانسێکی گەشتی عێراقییە. کاتێک حیجز دەکەیت گرێبەستەکەت لەگەڵ ئێمەیە، و ئێمە لە جیاتی تۆ لەگەڵ کۆمپانیاکانی فڕین، هوتێل و دابینکەرانی تر حیجز دەکەین.')),
    sec(N('الحجز والتأكيد', 'Booking and confirmation', 'حیجز و پشتڕاستکردنەوە'), N('يُؤكَّد الحجز بعد الدفع أو بعد استلام المبلغ في المكتب ضمن المدة المحددة. نرسل التأكيد والمستندات إلى رقمك وفي «رحلاتي».', 'A booking is confirmed once paid, or once payment is received at an office within the stated time. We send the confirmation and documents to your phone and to My trips.', 'حیجز دوای پارەدان پشتڕاست دەکرێتەوە، یان دوای وەرگرتنی پارە لە ئۆفیس لە ماوەی دیاریکراودا. پشتڕاستکردنەوە و بەڵگەنامەکان بۆ ژمارەکەت و بۆ «گەشتەکانم» دەنێرین.')),
    sec(N('الأسعار', 'Prices', 'نرخەکان'), N('السعر المعروض قبل الدفع هو السعر النهائي ويشمل الضرائب المعروفة. قد تُدفع ضرائب محلية في الفندق إن وُجدت، ونذكرها قبل الحجز.', 'The price shown before payment is final and includes known taxes. Local taxes paid at a hotel, where they apply, are stated before you book.', 'ئەو نرخەی پێش پارەدان پیشان دەدرێت کۆتاییە و باجە زانراوەکان لەخۆدەگرێت. باجی ناوخۆیی کە لە هوتێل دەدرێت، ئەگەر هەبێت، پێش حیجز دەنووسرێت.')),
    sec(N('التغيير والإلغاء', 'Changes and cancellations', 'گۆڕین و هەڵوەشاندنەوە'), N('لكل منتج شروطه، وتظهر بوضوح قبل الدفع وفي مستنداتك. نساعدك في أي تغيير ونخبرك بتكلفته قبل تنفيذه.', 'Each product has its own conditions, shown clearly before payment and in your documents. We help with any change and tell you its cost before we make it.', 'هەر بەرهەمێک مەرجی خۆی هەیە، پێش پارەدان و لە بەڵگەنامەکانتدا بە ڕوونی پیشان دەدرێت. لە هەر گۆڕانکارییەکدا یارمەتیت دەدەین و پێش ئەنجامدانی تێچووەکەیت پێ دەڵێین.')),
    sec(N('مسؤولية المسافر', 'Your responsibilities', 'بەرپرسیارێتی تۆ'), N('صحة الأسماء كما في الجواز، وصلاحية الجواز والتأشيرة، والوصول في الوقت المحدد مسؤولية المسافر.', 'Names exactly as in the passport, a valid passport and visa, and arriving on time are the traveller’s responsibility.', 'ناو وەک لە پاسپۆرتدا، پاسپۆرت و ڤیزای بەکار، و گەیشتن لە کاتی خۆیدا بەرپرسیارێتی گەشتیارن.')),
    sec(N('التأشيرات', 'Visas', 'ڤیزا'), N('قرار منح التأشيرة يعود للسفارة أو الجهة المختصة. نراجع المستندات ونقدم الطلب، ولا نضمن النتيجة.', 'Visa decisions belong to the embassy or the competent authority. We check documents and apply; we cannot guarantee the outcome.', 'بڕیاری ڤیزا هی باڵیۆزخانە یان لایەنی تایبەتە. ئێمە بەڵگەنامەکان دەپشکنین و داواکاری پێشکەش دەکەین؛ ناتوانین ئەنجامەکە گەرەنتی بکەین.')),
    sec(N('الشكاوى', 'Complaints', 'سکاڵا'), N('أرسل شكواك من صفحة الملاحظات أو في أي مكتب. نؤكد استلامها، ونراجعها، ونرد عليك كتابياً.', 'Send a complaint from the feedback page or at any office. We acknowledge it, review it and reply in writing.', 'سکاڵاکەت لە پەڕەی تێبینییەکان یان لە هەر ئۆفیسێک بنێرە. وەرگرتنی پشتڕاست دەکەینەوە، پێداچوونەوەی بۆ دەکەین و بە نووسین وەڵامت دەدەینەوە.')),
  ] },
  privacy: { title: N('سياسة الخصوصية', 'Privacy policy', 'سیاسەتی تایبەتمەندی'), sections: [
    sec(N('ما نجمعه', 'What we collect', 'چی کۆدەکەینەوە'), N('الاسم ورقم الهاتف والبريد، وبيانات الجواز عند الحاجة للحجز أو التأشيرة، وتفاصيل الحجز.', 'Your name, phone number and email, passport details when a booking or visa needs them, and booking details.', 'ناو، ژمارەی مۆبایل و ئیمەیڵ، زانیاری پاسپۆرت کاتێک حیجز یان ڤیزا پێویستی پێیەتی، و وردەکاری حیجز.')),
    sec(N('لماذا نستخدمه', 'Why we use it', 'بۆچی بەکاری دەهێنین'), N('لإتمام الحجز وإرسال المستندات والتواصل معك بشأن رحلتك فقط.', 'Only to complete your booking, send your documents and contact you about your trip.', 'تەنها بۆ تەواوکردنی حیجز، ناردنی بەڵگەنامەکان و پەیوەندیکردن لەگەڵت دەربارەی گەشتەکەت.')),
    sec(N('مع من نشاركه', 'Who we share it with', 'لەگەڵ کێ هاوبەشی دەکەین'), N('مع شركة الطيران أو الفندق أو السفارة أو مزود الخدمة المعني بحجزك، ومع مزود الدفع عند الدفع. لا نبيع بياناتك.', 'With the airline, hotel, embassy or provider involved in your booking, and with the payment provider when you pay. We do not sell your data.', 'لەگەڵ کۆمپانیای فڕین، هوتێل، باڵیۆزخانە یان ئەو دابینکەرەی پەیوەندی بە حیجزەکەتەوە هەیە، و لەگەڵ دابینکەری پارەدان کاتێک پارە دەدەیت. زانیارییەکانت نافرۆشین.')),
    sec(N('مدة الاحتفاظ', 'How long we keep it', 'چەند دەیهێڵینەوە'), N('نحتفظ بالبيانات طوال المدة التي يتطلبها القانون والمحاسبة، ثم نحذفها.', 'We keep data for as long as the law and accounting require, then delete it.', 'زانیارییەکان بە ئەو ماوەیەی یاسا و ژمێریاری داوای دەکەن دەهێڵینەوە، پاشان دەیسڕینەوە.')),
    sec(N('حقوقك', 'Your rights', 'مافەکانت'), N('يمكنك طلب نسخة من بياناتك أو تصحيحها أو حذفها، من صفحة التواصل.', 'You can ask for a copy of your data, a correction or deletion from the contact page.', 'دەتوانیت لە پەڕەی پەیوەندییەوە داوای کۆپییەک لە زانیارییەکانت، ڕاستکردنەوە یان سڕینەوەیان بکەیت.')),
  ] },
  cookies: { title: N('سياسة ملفات تعريف الارتباط', 'Cookie policy', 'سیاسەتی کووکی'), sections: [
    sec(N('ما نستخدمه', 'What we use', 'چی بەکار دەهێنین'), N('نحفظ في متصفحك اللغة والعملة ونوع رحلتك وجلسة الدخول، لتعمل الصفحات كما تتوقع.', 'We store your language, currency, type of trip and sign-in session in your browser so the pages work as you expect.', 'زمان، دراو، جۆری گەشت و دانیشتنی چوونەژوورەوەت لە وێبگەڕەکەتدا هەڵدەگرین بۆ ئەوەی پەڕەکان وەک چاوەڕوانی کار بکەن.')),
    sec(N('القياس', 'Measurement', 'پێوانە'), N('أي أداة لقياس الاستخدام تُذكر هنا قبل تفعيلها، مع خيار رفضها.', 'Any tool that measures usage will be listed here before it is switched on, with a way to decline it.', 'هەر ئامرازێک بۆ پێوانەی بەکارهێنان پێش چالاککردن لێرە دەنووسرێت، لەگەڵ ڕێگایەک بۆ ڕەتکردنەوەی.')),
    sec(N('التحكم', 'Your control', 'کۆنترۆڵی تۆ'), N('يمكنك مسح هذه البيانات من إعدادات متصفحك في أي وقت.', 'You can clear this data from your browser settings at any time.', 'دەتوانیت لە هەر کاتێکدا ئەم زانیارییانە لە ڕێکخستنەکانی وێبگەڕەکەت بسڕیتەوە.')),
  ] },
  payments: { title: N('أمان الدفع والاسترداد', 'Payment security and refunds', 'سەلامەتی پارەدان و گەڕاندنەوە'), sections: [
    sec(N('طرق الدفع', 'Ways to pay', 'ڕێگاکانی پارەدان'), N('كي كارد وزين كاش وبطاقات فيزا وماستركارد، أو نقداً في مكاتبنا.', 'Qi Card, ZainCash, Visa and Mastercard, or cash at our offices.', 'کی کارد، زەین کاش، ڤیزا و ماستەرکارد، یان نەختینە لە ئۆفیسەکانمان.')),
    sec(N('الأمان', 'Security', 'سەلامەتی'), N('تدفع على صفحة مزود الدفع الآمنة. لا نرى ولا نحفظ رقم بطاقتك.', 'You pay on the payment provider’s secure page. We never see or store your card number.', 'لە پەڕەی پارێزراوی دابینکەری پارەدان پارە دەدەیت. ئێمە هەرگیز ژمارەی کارتەکەت نابینین و هەڵی ناگرین.')),
    sec(N('الحجز المعلق', 'Bookings held for payment', 'حیجزی ڕاگیراو بۆ پارەدان'), N('بعض المنتجات تُحجز لمدة محددة قبل الدفع، وتظهر المدة قبل الحجز. بعد انتهائها قد يتغير السعر.', 'Some products are held for a set time before payment; the time is shown before you book. After it ends the price may change.', 'هەندێک بەرهەم بۆ ماوەیەکی دیاریکراو پێش پارەدان ڕادەگیرێن؛ ماوەکە پێش حیجز پیشان دەدرێت. دوای تەواوبوونی لەوانەیە نرخ بگۆڕێت.')),
    sec(N('الاسترداد', 'Refunds', 'گەڕاندنەوەی پارە'), N('يُعاد المبلغ المستحق حسب شروط المنتج، بنفس طريقة الدفع أو نقداً في المكتب، ونخبرك بالمدة المتوقعة عند الطلب.', 'Refunds due under the product’s conditions go back by the same method, or in cash at an office, and we tell you the expected time when you ask.', 'پارەی شایستە بەپێی مەرجەکانی بەرهەم بە هەمان ڕێگای پارەدان یان بە نەختینە لە ئۆفیس دەگەڕێتەوە، و کاتێک داوا دەکەیت ماوەی چاوەڕوانکراوت پێ دەڵێین.')),
  ] },
}
export const LEGAL_DOCS = ['terms', 'privacy', 'cookies', 'payments']
