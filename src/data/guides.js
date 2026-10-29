/* Travel guides. mode 'out' = travelling from Iraq, 'in' = visiting Iraq (these get fa/tr/fr/de added by the translator).
   Factual, practical, no invented statistics. Rules change: every visa point says we confirm before travel.
   img: media name, Unsplash photo id (checked by eye), or a key of PHOTOS in data/incoming.js (Wikimedia, credited). */
import INTL from './guides.intl.js'

/* fa · tr · fr · de for the Visiting-Iraq guides come from guides.intl.js (keyed by the English text). */
const N = (ar, en, ku) => ({ ar, en, ku, ...INTL[en] })

export const GUIDES = [
  /* ---------------- travelling from Iraq ---------------- */
  {
    slug: 'schengen-visa-iraq', mode: 'out', img: 'visa-passport', updated: '2026-10-01',
    title: N('تأشيرة شنغن لحاملي الجواز العراقي خطوة بخطوة', 'Schengen visa for Iraqi passport holders, step by step', 'ڤیزای شەنگن بۆ هەڵگرانی پاسپۆرتی عێراقی، هەنگاو بە هەنگاو'),
    intro: N('تأشيرة شنغن تتيح زيارة 29 دولة أوروبية بتأشيرة واحدة. الطلب يحتاج تحضيراً جيداً، وهذا الدليل يرتّبه لك بالترتيب.', 'A Schengen visa lets you visit 29 European countries on one visa. The application needs careful preparation; this guide puts it in order.', 'ڤیزای شەنگن ڕێگە دەدات بە یەک ڤیزا سەردانی 29 وڵاتی ئەورووپی بکەیت. داواکارییەکە ئامادەکاری باشی پێویستە؛ ئەم ڕێنماییە بە ڕیز بۆت ڕێکی دەخات.'),
    sections: [
      { h: N('أي سفارة تقدّم إليها', 'Which embassy to apply to', 'بۆ کام باڵیۆزخانە پێشکەش بکەیت'),
        p: N('تقدّم إلى سفارة البلد الذي ستقضي فيه أطول مدة. إن تساوت المدد، فإلى البلد الذي تدخله أولاً. بعض الدول تستقبل الطلبات في بغداد وبعضها في أربيل أو عبر مركز تأشيرات معتمد.', 'Apply to the country where you will spend the longest time. If the stays are equal, apply to the country you enter first. Some countries take applications in Baghdad, others in Erbil or through an approved visa centre.', 'پێشکەشی ئەو وڵاتە بکە کە زۆرترین کاتی تێدا دەمێنیتەوە. ئەگەر ماوەکان وەک یەک بوون، پێشکەشی ئەو وڵاتە بکە کە یەکەم جار دەچیتە ناوی. هەندێک وڵات لە بەغدا داواکاری وەردەگرن، هەندێکیان لە هەولێر یان لە ڕێگەی ناوەندێکی ڤیزای پەسەندکراو.') },
      { h: N('متى تقدّم', 'When to apply', 'کەی پێشکەش بکەیت'),
        p: N('يمكن التقديم قبل السفر بستة أشهر كحد أقصى، وبخمسة عشر يوماً كحد أدنى. في الصيف تمتلئ المواعيد بسرعة، فالأفضل أن تبدأ قبل شهرين.', 'You can apply up to six months before travel and no later than fifteen days before. Appointments fill up quickly in summer, so starting two months ahead is wise.', 'دەتوانیت تا شەش مانگ پێش گەشت پێشکەش بکەیت، و دواترین کات پازدە ڕۆژ پێش گەشتە. لە هاویندا ژوانەکان زوو پڕ دەبن، بۆیە باشترە دوو مانگ پێشتر دەست پێبکەیت.') },
      { h: N('الأوراق الأساسية', 'The core documents', 'بەڵگەنامە سەرەکییەکان'),
        p: N('جواز صالح لثلاثة أشهر على الأقل بعد العودة وصادر خلال السنوات العشر الأخيرة، صورتان حديثتان، كشف حساب مصرفي، تأييد عمل أو دراسة، حجز فندق وحجز طيران، وتأمين سفر طبي بتغطية لا تقل عن 30,000 يورو.', 'A passport valid for at least three months after you return and issued within the last ten years, two recent photos, a bank statement, an employment or study letter, hotel and flight bookings, and travel medical insurance with at least €30,000 of cover.', 'پاسپۆرتێک کە لانیکەم سێ مانگ دوای گەڕانەوە بەکار بێت و لە دە ساڵی ڕابردوودا دەرچووبێت، دوو وێنەی تازە، کەشفی حسابی بانک، نووسراوی کار یان خوێندن، حیجزی هوتێل و فڕین، و بیمەی پزیشکی گەشت بە لانیکەم 30,000 یۆرۆ.') },
      { h: N('يوم الموعد وبعده', 'On the day and after', 'ڕۆژی ژوان و دوای ئەو'),
        p: N('تحضر بنفسك لأخذ البصمات وتسليم الأوراق. مدة القرار عادة نحو خمسة عشر يوماً وقد تطول. بعد التقديم نرسل لك رابط متابعة خاصاً حتى يعود جوازك.', 'You attend in person to give fingerprints and hand in the papers. A decision usually takes about fifteen days and can take longer. After you apply we send you a private tracking link until your passport is back.', 'خۆت ئامادە دەبیت بۆ پەنجەمۆر و ڕادەستکردنی بەڵگەنامەکان. بڕیار زۆرجار نزیکەی پازدە ڕۆژ دەخایەنێت و لەوانەیە زیاتر بێت. دوای پێشکەشکردن بەستەرێکی تایبەتی بەدواداچوونت بۆ دەنێرین تا پاسپۆرتەکەت دەگەڕێتەوە.') },
    ],
    good: [
      N('مدة الإقامة القصوى 90 يوماً خلال أي 180 يوماً.', 'The maximum stay is 90 days in any 180-day period.', 'زۆرترین ماوەی مانەوە 90 ڕۆژە لە هەر 180 ڕۆژێکدا.'),
      N('حجز الطيران المؤقت يكفي للطلب؛ لا تشترِ التذكرة قبل القرار.', 'A flight reservation is enough for the application; do not buy the ticket before the decision.', 'حیجزی کاتی فڕین بەسە بۆ داواکاری؛ پێش بڕیار بلیت مەکڕە.'),
      N('الرسوم الرسمية يحددها الاتحاد الأوروبي، ونخبرك بالمبلغ الحالي قبل الدفع.', 'The official fee is set by the EU; we tell you the current amount before you pay.', 'تێچووی فەرمی یەکێتی ئەورووپا دیاری دەکات؛ پێش پارەدان بڕی ئێستات پێدەڵێین.'),
      N('القواعد تتغير؛ نتحقق من كل شيء قبل التقديم.', 'Rules change; we check everything before you apply.', 'یاساکان دەگۆڕێن؛ پێش پێشکەشکردن هەموو شتێک دەپشکنین.'),
    ],
    related: [['/visa/SCH', 'passport', N('تأشيرة شنغن', 'Schengen visa', 'ڤیزای شەنگن')], ['/visa?purpose=family', 'users', N('حالة الزيارة العائلية', 'Family visit case', 'حاڵەتی سەردانی خێزان')], ['/destinations?visa=embassy', 'globe', N('وجهات أوروبا', 'European destinations', 'شوێنەکانی ئەورووپا')]],
  },
  {
    slug: 'first-time-istanbul', mode: 'out', img: 'istanbul', updated: '2026-09-15',
    title: N('أول مرة في إسطنبول: دليل عملي', 'First time in Istanbul: a practical guide', 'یەکەم جار لە ئەستەنبوڵ: ڕێنمایی کرداری'),
    intro: N('إسطنبول أقرب مدينة كبيرة إلى قلوب العراقيين. هذه أهم الأشياء التي تسهّل أول زيارة.', 'Istanbul is the big city closest to Iraqi hearts. These are the things that make a first visit easy.', 'ئەستەنبوڵ ئەو شارە گەورەیەیە کە لە دڵی عێراقییەکانەوە نزیکترە. ئەمانە ئەو شتانەن کە یەکەم سەردان ئاسان دەکەن.'),
    sections: [
      { h: N('مطاران، فاعرف مطارك', 'Two airports: know yours', 'دوو فڕۆکەخانە: هی خۆت بزانە'),
        p: N('مطار إسطنبول (IST) على الجانب الأوروبي، ومطار صبيحة كوكجن (SAW) على الجانب الآسيوي. المسافة بينهما طويلة، فاختر فندقاً قريباً من مطار رحلتك أو احجز نقلاً مسبقاً.', 'Istanbul Airport (IST) is on the European side and Sabiha Gökçen (SAW) on the Asian side. They are far apart, so choose a hotel near your airport or book a transfer ahead.', 'فڕۆکەخانەی ئەستەنبوڵ (IST) لە لای ئەورووپییە و سەبیحە گۆکچەن (SAW) لە لای ئاسیایی. دووریان زۆرە، بۆیە هوتێلێکی نزیک فڕۆکەخانەکەت هەڵبژێرە یان پێشوەختە گواستنەوە حیجز بکە.') },
      { h: N('التنقل في المدينة', 'Getting around', 'هاتوچۆ لە شاردا'),
        p: N('بطاقة إسطنبول كارت تعمل في المترو والترام والعبّارات والحافلات. العبّارة بين الضفتين وسيلة جميلة ورخيصة. في سيارات الأجرة اطلب تشغيل العداد أو استخدم تطبيقاً معروفاً.', 'An Istanbulkart works on the metro, trams, ferries and buses. The ferry between the two shores is a lovely, cheap ride. In taxis ask for the meter or use a known app.', 'کارتی ئەستەنبوڵ لە مێترۆ، ترام، بەلەم و پاس کار دەکات. بەلەمی نێوان دوو کەنارەکە گەشتێکی جوان و هەرزانە. لە تاکسیدا داوای کردنەوەی پێوەر بکە یان ئەپێکی ناسراو بەکاربهێنە.') },
      { h: N('أين تقيم', 'Where to stay', 'لە کوێ بمێنیتەوە'),
        p: N('السلطان أحمد قريب من المعالم التاريخية، وتقسيم وشيشلي للتسوق والمطاعم، وبشكتاش على البحر وأهدأ. العائلات تفضل غالباً الفنادق القريبة من المترو.', 'Sultanahmet is close to the historic sights, Taksim and Şişli are for shopping and restaurants, and Beşiktaş is by the water and calmer. Families often prefer hotels near the metro.', 'سوڵتان ئەحمەد نزیکی شوێنە مێژووییەکانە، تەقسیم و شیشلی بۆ بازاڕکردن و چێشتخانە، و بەشیکتاش لە کەناری ئاو و هێمنترە. خێزانەکان زۆرجار هوتێلی نزیک مێترۆ هەڵدەبژێرن.') },
      { h: N('المال والاتصال', 'Money and staying connected', 'پارە و پەیوەندی'),
        p: N('العملة الليرة التركية، والبطاقات مقبولة في معظم الأماكن. اصرف مبلغاً صغيراً عند الوصول والباقي من محلات الصرافة في المدينة. شريحة eSIM تعمل من لحظة الهبوط.', 'The currency is the Turkish lira and cards are accepted in most places. Change a small amount on arrival and the rest at exchange shops in town. An eSIM works from the moment you land.', 'دراو لیرەی تورکییە و کارت لە زۆربەی شوێنەکان وەردەگیرێت. لە گەیشتندا بڕێکی کەم بگۆڕە و ئەوی تر لە دوکانەکانی گۆڕینەوەی ناو شار. eSIM لە ساتی نیشتنەوەوە کار دەکات.') },
    ],
    good: [
      N('المساجد مفتوحة للزوار خارج أوقات الصلاة؛ النساء يغطين الرأس.', 'Mosques welcome visitors outside prayer times; women cover their hair.', 'مزگەوتەکان لە دەرەوەی کاتی نوێژ بۆ سەردانکەران کراوەن؛ ئافرەتان سەریان دادەپۆشن.'),
      N('المتاحف الكبرى تغلق يوماً في الأسبوع؛ تأكد قبل الذهاب.', 'Major museums close one day a week; check before you go.', 'مۆزەخانە گەورەکان ڕۆژێک لە هەفتەدا دادەخرێن؛ پێش چوون بپشکنە.'),
      N('الربيع والخريف أجمل الأوقات؛ الصيف مزدحم.', 'Spring and autumn are the nicest; summer is crowded.', 'بەهار و پاییز جوانترینن؛ هاوین قەرەباڵغە.'),
    ],
    related: [['/destinations/istanbul', 'globe', N('إسطنبول', 'Istanbul', 'ئەستەنبوڵ')], ['/flights?from=BGW&to=IST', 'plane', N('رحلات من بغداد', 'Flights from Baghdad', 'فڕین لە بەغداوە')], ['/visa/TR', 'passport', N('تأشيرة تركيا', 'Türkiye visa', 'ڤیزای تورکیا')], ['/esim/tr', 'sim', N('eSIM تركيا', 'eSIM for Türkiye', 'eSIM بۆ تورکیا')]],
  },
  {
    slug: 'medical-travel-india', mode: 'out', img: 'photo-1587474260584-136574528ed5', updated: '2026-09-01',
    title: N('السفر إلى الهند للعلاج', 'Travelling to India for medical treatment', 'گەشت بۆ هیندستان بۆ چارەسەری پزیشکی'),
    intro: N('يسافر عراقيون كثيرون إلى الهند للعلاج. التحضير الجيد قبل السفر يوفر وقتاً ومالاً ويريح المريض.', 'Many Iraqis travel to India for treatment. Good preparation before you leave saves time and money and spares the patient.', 'زۆر عێراقی بۆ چارەسەر دەچنە هیندستان. ئامادەکاری باش پێش گەشت کات و پارە دەپارێزێت و نەخۆش ئاسوودە دەکات.'),
    sections: [
      { h: N('ابدأ بالمستشفى', 'Start with the hospital', 'بە نەخۆشخانە دەست پێبکە'),
        p: N('أرسل التقارير والصور الشعاعية إلى المستشفى واطلب رأياً وخطة علاج وتقديراً للتكلفة قبل الحجز. بعد الموافقة يصدر المستشفى رسالة دعوة تحتاجها للتأشيرة.', 'Send your reports and scans to the hospital and ask for an opinion, a treatment plan and a cost estimate before booking. Once agreed, the hospital issues an invitation letter you need for the visa.', 'ڕاپۆرت و وێنە تیشکییەکانت بنێرە بۆ نەخۆشخانە و پێش حیجز داوای ڕا، پلانی چارەسەر و خەمڵاندنی تێچوو بکە. دوای ڕەزامەندی، نەخۆشخانە نووسراوی بانگهێشت دەردەکات کە بۆ ڤیزا پێویستە.') },
      { h: N('التأشيرة الطبية', 'The medical visa', 'ڤیزای پزیشکی'),
        p: N('للعلاج توجد تأشيرة طبية إلكترونية، ولمرافقي المريض تأشيرة مرافق طبي. تحتاج رسالة المستشفى وتقريراً طبياً من طبيبك. نتحقق من الشروط الحالية قبل التقديم.', 'There is an electronic medical visa for the patient and a medical-attendant visa for those travelling with them. You need the hospital’s letter and a report from your doctor. We check the current conditions before applying.', 'ڤیزای پزیشکی ئەلیکترۆنی بۆ نەخۆش و ڤیزای هاوڕێی پزیشکی بۆ ئەوانەی لەگەڵیدا دەڕۆن هەیە. نووسراوی نەخۆشخانە و ڕاپۆرتی دکتۆرەکەت پێویستە. پێش پێشکەشکردن مەرجەکانی ئێستا دەپشکنین.') },
      { h: N('ماذا تأخذ معك', 'What to take', 'چی لەگەڵ خۆت ببەیت'),
        p: N('كل التقارير مترجمة إلى الإنجليزية، الصور والتحاليل على قرص أو ذاكرة، قائمة بالأدوية الحالية مع الجرعات، وكمية كافية منها للرحلة.', 'All reports translated into English, scans and tests on a disc or memory stick, a list of current medicines with doses, and enough of them for the trip.', 'هەموو ڕاپۆرتەکان وەرگێڕدراو بۆ ئینگلیزی، وێنە و پشکنینەکان لەسەر دیسک یان فلاش، لیستی دەرمانەکانی ئێستا بە ژەمەکانیانەوە، و بڕی پێویست لێیان بۆ گەشتەکە.') },
      { h: N('الإقامة قرب المستشفى', 'Staying near the hospital', 'مانەوە نزیک نەخۆشخانە'),
        p: N('اختر سكناً قريباً من المستشفى، ويفضل شقة فندقية بمطبخ إن كانت الإقامة طويلة. كثير من المستشفيات الكبرى لديها مكتب للمرضى الدوليين يساعد في الاستقبال والمترجم.', 'Choose a place to stay near the hospital, ideally a serviced apartment with a kitchen for longer stays. Many large hospitals have an international patients’ office that helps with pickup and an interpreter.', 'شوێنێکی نزیک نەخۆشخانە هەڵبژێرە، باشترە ئەپارتمانێکی خزمەتگوزاری بە چێشتخانەوە بۆ مانەوەی درێژ. زۆربەی نەخۆشخانە گەورەکان نووسینگەی نەخۆشانی نێودەوڵەتییان هەیە کە لە پێشوازی و وەرگێڕدا یارمەتی دەدات.') },
    ],
    good: [
      N('اطلب تقديراً مكتوباً للتكلفة واسأل عمّا يشمله.', 'Ask for a written cost estimate and what it includes.', 'داوای خەمڵاندنی نووسراوی تێچوو بکە و بپرسە چی لەخۆدەگرێت.'),
      N('الجو في دلهي حار جداً في أيار وحزيران، وجودة الهواء قد تسوء في أوائل الشتاء.', 'Delhi is very hot in May and June, and air quality can be poor in early winter.', 'دەلهی لە ئایار و حوزەیراندا زۆر گەرمە، و لە سەرەتای زستاندا لەوانەیە کوالیتی هەوا خراپ بێت.'),
      N('احتفظ بنسخ رقمية من كل الأوراق على هاتفك.', 'Keep digital copies of every paper on your phone.', 'کۆپی دیجیتاڵی هەموو بەڵگەنامەکان لەسەر مۆبایلەکەت هەڵبگرە.'),
    ],
    related: [['/visa/IN?purpose=medical', 'passport', N('تأشيرة الهند للعلاج', 'India visa for treatment', 'ڤیزای هیندستان بۆ چارەسەر')], ['/destinations/delhi', 'globe', N('دلهي', 'Delhi', 'دەلهی')], ['/destinations?theme=medical', 'heart', N('وجهات العلاج', 'Medical destinations', 'شوێنەکانی چارەسەر')]],
  },
  {
    slug: 'family-week-georgia', mode: 'out', img: 'georgia', updated: '2026-08-20',
    title: N('أسبوع عائلي في جورجيا', 'A family week in Georgia', 'هەفتەیەکی خێزانی لە جۆرجیا'),
    intro: N('جورجيا قريبة وأسعارها معتدلة وطبيعتها خضراء. هذه خطة أسبوع تناسب العائلة دون استعجال.', 'Georgia is close, fairly priced and green. Here is a one-week plan that suits a family without rushing.', 'جۆرجیا نزیکە، نرخەکانی گونجاون و سروشتی سەوزە. ئەمە پلانێکی هەفتەیەکە کە بێ پەلە بۆ خێزان گونجاوە.'),
    sections: [
      { h: N('الأيام 1 إلى 3: تبليسي', 'Days 1 to 3: Tbilisi', 'ڕۆژی 1 تا 3: تبلیسی'),
        p: N('البلدة القديمة والتلفريك إلى قلعة ناريكالا والحمامات الكبريتية. حديقة متاتسميندا على الجبل مناسبة للأطفال، والمدينة سهلة المشي.', 'The old town, the cable car to Narikala fortress and the sulphur baths. Mtatsminda park on the hill suits children, and the city is easy on foot.', 'شاری کۆن، تەلەفریک بۆ قەڵای ناریکالا و گەرماوی گۆگرد. پارکی متاتسمیندا لەسەر چیا بۆ منداڵان گونجاوە، و شارەکە بە پێ ئاسانە.') },
      { h: N('اليوم 4: كازبيجي', 'Day 4: Kazbegi', 'ڕۆژی 4: کازبێگی'),
        p: N('رحلة يوم على الطريق العسكري الجورجي إلى كنيسة جيرغيتي تحت جبل كازبيك، مع توقف عند بحيرة جينفالي. الطريق جبلي، فاحجز سائقاً خاصاً.', 'A day trip along the Georgian Military Road to Gergeti church below Mount Kazbek, stopping at the Zhinvali reservoir. The road is mountainous, so book a private driver.', 'گەشتێکی ڕۆژانە بە ڕێگای سەربازی جۆرجیادا بۆ کڵێسای گێرگێتی لە ژێر چیای کازبێک، بە وەستان لە دەریاچەی ژینڤالی. ڕێگاکە چیاییە، بۆیە شۆفێرێکی تایبەت حیجز بکە.') },
      { h: N('الأيام 5 إلى 7: بورجومي أو باتومي', 'Days 5 to 7: Borjomi or Batumi', 'ڕۆژی 5 تا 7: بۆرجۆمی یان باتومی'),
        p: N('في الصيف تناسب باتومي على البحر الأسود العائلات التي تحب الشاطئ، وبورجومي للغابات والمياه المعدنية والهدوء. القطار أو السيارة يربطان المدن.', 'In summer Batumi on the Black Sea suits beach-loving families, while Borjomi offers forests, mineral water and calm. Trains or cars connect the towns.', 'لە هاویندا باتومی لە کەناری دەریای ڕەش بۆ خێزانانی حەزلەکەنار گونجاوە، و بۆرجۆمی دارستان، ئاوی کانزایی و هێمنی پێشکەش دەکات. شەمەندەفەر یان ئۆتۆمبێل شارەکان پێکەوە دەبەستێتەوە.') },
    ],
    good: [
      N('العملة اللاري؛ البطاقات مقبولة في المدن، واحمل نقداً للقرى.', 'The currency is the lari; cards work in towns, carry cash for villages.', 'دراو لارییە؛ کارت لە شارەکاندا کار دەکات، بۆ گوندەکان نەختینە ببە.'),
      N('اطلب مقعد أطفال عند حجز السيارة.', 'Ask for a child seat when you book a car.', 'لە کاتی حیجزی ئۆتۆمبێلدا داوای کورسی منداڵ بکە.'),
      N('تحقق من شروط الدخول لجوازك قبل الحجز؛ نؤكدها لك.', 'Check the entry rules for your passport before booking; we confirm them for you.', 'پێش حیجز مەرجەکانی چوونەژوورەوە بۆ پاسپۆرتەکەت بپشکنە؛ ئێمە بۆت پشتڕاستی دەکەینەوە.'),
    ],
    related: [['/destinations/tbilisi', 'globe', N('تبليسي', 'Tbilisi', 'تبلیسی')], ['/visa/GE', 'passport', N('دخول جورجيا', 'Entering Georgia', 'چوونە ناو جۆرجیا')], ['/esim/ge', 'sim', N('eSIM جورجيا', 'eSIM for Georgia', 'eSIM بۆ جۆرجیا')], ['/cars', 'car', N('تأجير سيارة', 'Car rental', 'بەکرێگرتنی ئۆتۆمبێل')]],
  },
  {
    slug: 'travelling-with-children', mode: 'out', img: 'photo-1511895426328-dc8714191300', updated: '2026-08-05',
    title: N('السفر مع الأطفال: المستندات والنصائح', 'Travelling with children: documents and tips', 'گەشت لەگەڵ منداڵ: بەڵگەنامە و ئامۆژگاری'),
    intro: N('السفر مع الأطفال ممتع إذا رُتّبت الأوراق مسبقاً. هذه قائمة واضحة لما تحتاجه.', 'Travelling with children is a pleasure when the papers are ready in advance. Here is a clear list of what you need.', 'گەشت لەگەڵ منداڵ خۆشە کاتێک بەڵگەنامەکان پێشوەختە ئامادە بن. ئەمە لیستێکی ڕوونی ئەو شتانەیە کە پێویستن.'),
    sections: [
      { h: N('جواز لكل طفل', 'A passport for every child', 'پاسپۆرت بۆ هەر منداڵێک'),
        p: N('كل طفل يحتاج جواز سفر خاصاً به حتى الرضّع، وتأشيرة خاصة به إن كانت الوجهة تتطلب تأشيرة. تأكد من صلاحية الجواز قبل الحجز بوقت كافٍ.', 'Every child needs their own passport, babies included, and their own visa where the destination requires one. Check passport validity well before booking.', 'هەر منداڵێک پاسپۆرتی خۆی پێویستە، تەنانەت ساوایانیش، و ڤیزای خۆی ئەگەر شوێنەکە ڤیزای بوێت. زوو پێش حیجز بەکاربوونی پاسپۆرت بپشکنە.') },
      { h: N('السفر مع أحد الوالدين', 'Travelling with one parent', 'گەشت لەگەڵ یەکێک لە دایک و باوک'),
        p: N('إذا سافر الطفل مع أحد والديه فقط، احمل موافقة مكتوبة من الوالد الآخر مع نسخة من هويته. كثير من الدول والسفارات تطلبها، وبعض شركات الطيران كذلك.', 'If a child travels with only one parent, carry written consent from the other parent with a copy of their ID. Many countries and embassies ask for it, and some airlines do too.', 'ئەگەر منداڵ تەنها لەگەڵ یەکێک لە دایک و باوکی گەشت بکات، ڕەزامەندی نووسراوی ئەوی تریان لەگەڵ کۆپی ناسنامەکەی ببە. زۆر وڵات و باڵیۆزخانە داوای دەکەن، و هەندێک هێڵی ئاسمانیش.') },
      { h: N('في المطار والطائرة', 'At the airport and on board', 'لە فڕۆکەخانە و ناو فڕۆکە'),
        p: N('عربة الطفل تُسلَّم عادة عند باب الطائرة وتعود عند الوصول. حليب الأطفال وطعامهم مسموح بكميات مناسبة في الحقيبة اليدوية. اطلب مقاعد متجاورة عند الحجز.', 'A pushchair is usually handed over at the aircraft door and returned on arrival. Baby milk and food are allowed in sensible amounts in hand luggage. Ask for seats together when you book.', 'عەرەبانەی منداڵ زۆرجار لە دەرگای فڕۆکە وەردەگیرێت و لە گەیشتندا دەگەڕێنرێتەوە. شیر و خواردنی منداڵ بە بڕی گونجاو لە جانتای دەستدا ڕێگەپێدراوە. لە کاتی حیجزدا داوای کورسی تەنیشت یەک بکە.') },
    ],
    good: [
      N('احمل نسخة من شهادة الميلاد أو هوية الأحوال للطفل.', 'Carry a copy of the child’s birth certificate or civil ID.', 'کۆپی بڕوانامەی لەدایکبوون یان ناسنامەی باری کەسی منداڵ ببە.'),
      N('ضع الأدوية الضرورية في الحقيبة اليدوية لا في الحقيبة المشحونة.', 'Keep essential medicines in hand luggage, not in checked bags.', 'دەرمانە پێویستەکان لە جانتای دەستدا دابنێ، نەک لە جانتای بارکراودا.'),
      N('اسأل عن مقعد الأطفال عند حجز النقل أو السيارة.', 'Ask for a child seat when booking a transfer or car.', 'لە کاتی حیجزی گواستنەوە یان ئۆتۆمبێلدا داوای کورسی منداڵ بکە.'),
    ],
    related: [['/destinations?theme=family', 'users', N('وجهات للعائلة', 'Family destinations', 'شوێنەکان بۆ خێزان')], ['/flights', 'plane', N('رحلات الطيران', 'Flights', 'فڕین')], ['/transfers', 'car', N('نقل المطار', 'Airport transfers', 'گواستنەوەی فڕۆکەخانە')]],
  },
  {
    slug: 'esim-explained', mode: 'out', img: 'esim-phone', updated: '2026-07-30',
    title: N('شرح eSIM: ابقَ متصلاً في الخارج', 'eSIM explained: stay connected abroad', 'eSIM ڕوونکردنەوە: لە دەرەوە پەیوەندیت بمێنێت'),
    intro: N('شريحة eSIM هي شريحة رقمية تُثبَّت برمز QR، فتحصل على إنترنت محلي في البلد الذي تزوره دون تغيير شريحتك.', 'An eSIM is a digital SIM installed with a QR code, giving you local data in the country you visit without swapping your SIM.', 'eSIM سیمکارتێکی دیجیتاڵییە کە بە کۆدی QR دادەمەزرێت، و ئینتەرنێتی ناوخۆیی لەو وڵاتەی سەردانی دەکەیت پێت دەدات بێ گۆڕینی سیمکارتەکەت.'),
    sections: [
      { h: N('هل يدعمها هاتفك؟', 'Does your phone support it?', 'مۆبایلەکەت پشتگیری دەکات؟'),
        p: N('أغلب هواتف آيفون من XS وما بعد، وكثير من هواتف سامسونج وبكسل الحديثة تدعمها. اطلب ‎*#06#‎ فإن ظهر رقم EID فهاتفك يدعمها، ويجب ألا يكون مقفلاً على شبكة واحدة.', 'Most iPhones from the XS onwards and many recent Samsung and Pixel phones support it. Dial *#06#: if an EID number appears, your phone supports eSIM. It must not be locked to one network.', 'زۆربەی ئایفۆنەکان لە XS بەدواوە و زۆرێک لە مۆبایلە نوێکانی سامسۆنگ و پیکسڵ پشتگیری دەکەن. ‎*#06#‎ لێبدە: ئەگەر ژمارەی EID دەرکەوت، مۆبایلەکەت پشتگیری دەکات. نابێت لەسەر یەک تۆڕ قفڵ کرابێت.') },
      { h: N('التثبيت قبل السفر', 'Install before you fly', 'پێش فڕین دایبمەزرێنە'),
        p: N('بعد الشراء يصلك رمز QR. افتح الإعدادات ثم الشبكة الخلوية وأضف eSIM وامسح الرمز وأنت على واي فاي. تبدأ مدة الباقة عادة عند أول اتصال بالشبكة في البلد.', 'After you buy, a QR code arrives. Open Settings, then Mobile data, add an eSIM and scan the code while on Wi-Fi. The plan usually starts when it first connects in the country.', 'دوای کڕین کۆدی QR دەگات. ڕێکخستنەکان بکەرەوە، پاشان داتای مۆبایل، eSIM زیاد بکە و لە کاتی وای‌فایدا کۆدەکە سکان بکە. پاکێجەکە زۆرجار لە یەکەم پەیوەندی لەو وڵاتەدا دەست پێدەکات.') },
      { h: N('رقمك العراقي', 'Your Iraqi number', 'ژمارە عێراقییەکەت'),
        p: N('شريحتك العراقية تبقى في الهاتف، فتصلك الرسائل على واتساب كالمعتاد. أوقف التجوال على الخط العراقي لتجنب رسوم غير متوقعة، واجعل eSIM خط البيانات.', 'Your Iraqi SIM stays in the phone, so WhatsApp works as usual. Turn off roaming on the Iraqi line to avoid unexpected charges, and set the eSIM as your data line.', 'سیمکارتە عێراقییەکەت لە مۆبایلەکەدا دەمێنێتەوە، بۆیە واتسئاپ وەک هەمیشە کار دەکات. ڕۆمینگ لەسەر هێڵە عێراقییەکە بکوژێنەوە بۆ دوورکەوتنەوە لە تێچووی چاوەڕواننەکراو، و eSIM بکە بە هێڵی داتا.') },
    ],
    good: [
      N('أغلب الباقات للبيانات فقط؛ المكالمات عبر التطبيقات.', 'Most plans are data only; call through apps.', 'زۆربەی پاکێجەکان تەنها داتان؛ لە ڕێگەی ئەپەکانەوە پەیوەندی بکە.'),
      N('لا تحذف eSIM من الهاتف قبل انتهاء الرحلة.', 'Do not delete the eSIM from your phone before the trip ends.', 'پێش کۆتایی گەشت eSIM لە مۆبایلەکەت مەسڕەوە.'),
      N('الباقة قابلة للاسترداد ما لم يُمسح الرمز.', 'A plan is refundable until the code is scanned.', 'تا کۆدەکە سکان نەکرابێت پارەی پاکێج دەگەڕێندرێتەوە.'),
    ],
    related: [['/esim', 'sim', N('باقات eSIM', 'eSIM plans', 'پاکێجەکانی eSIM')], ['/destinations', 'globe', N('الوجهات', 'Destinations', 'شوێنەکان')]],
  },

  /* ---------------- visiting Iraq ---------------- */
  {
    slug: 'arbaeen-planning', mode: 'in', img: 'karbala', updated: '2026-10-10',
    title: N('التخطيط لزيارة الأربعين', 'Planning the Arbaeen visit', 'پلاندانان بۆ سەردانی ئەربەعین'),
    intro: N('الأربعين من أكبر التجمعات في العالم، ويقصد فيه الزوار كربلاء من داخل العراق وخارجه. التخطيط المبكر يجعل الزيارة أهدأ وأكثر أماناً.', 'Arbaeen is one of the largest gatherings in the world, with visitors coming to Karbala from across Iraq and abroad. Planning early makes the visit calmer and safer.', 'ئەربەعین یەکێکە لە گەورەترین کۆبوونەوەکانی جیهان، سەردانکەران لە هەموو عێراق و دەرەوە دێنە کەربەلا. پلاندانانی زوو سەردانەکە هێمنتر و سەلامەتتر دەکات.'),
    sections: [
      { h: N('متى يكون', 'When it is', 'کەی دەبێت'),
        p: N('يوافق الأربعين العشرين من صفر، أي بعد أربعين يوماً من العاشر من محرم. يتقدّم موعده نحو أحد عشر يوماً كل سنة ميلادية، لذا يختلف الطقس من عام لآخر.', 'Arbaeen falls on the 20th of Safar, forty days after Ashura. It moves about eleven days earlier each Gregorian year, so the weather changes from year to year.', 'ئەربەعین دەکەوێتە 20ی سەفەر، چل ڕۆژ دوای عاشوورا. هەموو ساڵێکی زایینی نزیکەی یازدە ڕۆژ زووتر دەبێت، بۆیە کەشوهەوا ساڵ بە ساڵ دەگۆڕێت.') },
      { h: N('المشي من النجف', 'The walk from Najaf', 'ڕۆیشتن بە پێ لە نەجەفەوە'),
        p: N('يمشي كثير من الزوار من النجف إلى كربلاء، نحو ثمانين كيلومتراً على طريق تقف فيه مواكب تقدم الطعام والماء والراحة. يستغرق المشي عادة يومين إلى ثلاثة أيام.', 'Many visitors walk from Najaf to Karbala, around eighty kilometres along a road lined with mawakib offering food, water and rest. The walk usually takes two to three days.', 'زۆر سەردانکەر لە نەجەفەوە بە پێ دەچنە کەربەلا، نزیکەی هەشتا کیلۆمەتر بە ڕێگایەکدا کە مەوکیبەکان خواردن، ئاو و پشوو پێشکەش دەکەن. ڕۆیشتنەکە زۆرجار دوو بۆ سێ ڕۆژ دەخایەنێت.') },
      { h: N('السكن والمجموعات', 'Accommodation and groups', 'نیشتەجێبوون و گرووپەکان'),
        p: N('الفنادق القريبة من الحرمين تُحجز قبل أشهر. السفر مع مجموعة منظمة يسهّل النقل والسكن ونقاط اللقاء، ونرتّب ذلك للزوار من الخارج.', 'Hotels near the shrines are booked months ahead. Travelling with an organised group makes transport, rooms and meeting points easier, and we arrange this for visitors from abroad.', 'هوتێلەکانی نزیک حەرەمەکان چەند مانگ پێشتر حیجز دەکرێن. گەشت لەگەڵ گرووپێکی ڕێکخراو گواستنەوە، ژوور و خاڵی کۆبوونەوە ئاسانتر دەکات، و ئێمە ئەمە بۆ سەردانکەرانی دەرەوە ڕێک دەخەین.') },
      { h: N('التأشيرة', 'Visas', 'ڤیزا'),
        p: N('يعلن العراق غالباً ترتيبات خاصة لزوار الأربعين. القواعد تتغير، ونؤكد لك المطلوب لجنسيتك قبل السفر.', 'Iraq often announces special arrangements for Arbaeen visitors. Rules change, and we confirm what your nationality needs before you travel.', 'عێراق زۆرجار ڕێکخستنی تایبەت بۆ سەردانکەرانی ئەربەعین ڕادەگەیەنێت. یاساکان دەگۆڕێن، و پێش گەشت پێداویستییەکانی ڕەگەزنامەکەت پشتڕاست دەکەینەوە.') },
    ],
    good: [
      N('حذاء مريح مجرّب، وجوارب احتياطية.', 'Comfortable shoes you have already worn in, and spare socks.', 'پێڵاوێکی ئاسوودە کە پێشتر لەپێت کردبێت، و گۆرەوی زیادە.'),
      N('احمل جوازك أو هويتك دائماً، واتفق على نقطة لقاء مع مجموعتك.', 'Always carry your passport or ID, and agree a meeting point with your group.', 'هەمیشە پاسپۆرت یان ناسنامەکەت لەگەڵ خۆت بێت، و لەگەڵ گرووپەکەت لەسەر خاڵێکی کۆبوونەوە ڕێک بکەون.'),
      N('الشبكات تزدحم؛ حمّل الخرائط مسبقاً.', 'Mobile networks get busy; download maps in advance.', 'تۆڕەکانی مۆبایل قەرەباڵغ دەبن؛ پێشوەختە نەخشەکان دابگرە.'),
    ],
    related: [['/visit/tours/karbala-najaf', 'star', N('رحلة النجف وكربلاء', 'Najaf and Karbala trip', 'گەشتی نەجەف و کەربەلا')], ['/visit/visa', 'passport', N('تأشيرة العراق', 'Visa for Iraq', 'ڤیزای عێراق')], ['/visit/plan', 'info', N('خطط زيارتك', 'Plan your visit', 'سەردانەکەت پلان بکە')]],
  },
  {
    slug: 'babylon-ur-marshes', mode: 'in', img: 'ur', updated: '2026-09-25',
    title: N('بابل وأور والأهوار في رحلة واحدة', 'Babylon, Ur and the Marshes in one trip', 'بابل، ئوور و هۆڕەکان لە یەک گەشتدا'),
    intro: N('جنوب العراق يجمع أقدم المدن في التاريخ مع طبيعة الأهوار الفريدة. هذا مسار من بغداد إلى البصرة في نحو خمسة أيام.', 'Southern Iraq brings together some of the oldest cities in history and the unique Marshes. Here is a route from Baghdad to Basra in about five days.', 'باشووری عێراق کۆنترین شارەکانی مێژوو و سروشتی بێهاوتای هۆڕەکان پێکەوە کۆدەکاتەوە. ئەمە ڕێڕەوێکە لە بەغداوە بۆ بەسرە لە نزیکەی پێنج ڕۆژدا.'),
    sections: [
      { h: N('بابل', 'Babylon', 'بابل'),
        p: N('على بعد نحو 85 كيلومتراً جنوب بغداد قرب الحلة، وهي على قائمة التراث العالمي منذ 2019. ترى بقايا الأسوار وشارع الموكب والقصر المطل على الموقع.', 'About 85 kilometres south of Baghdad near Hillah, on the World Heritage List since 2019. You see the remains of the walls, the Processional Way and the palace overlooking the site.', 'نزیکەی 85 کیلۆمەتر باشووری بەغدا نزیک حیللە، لە ساڵی 2019ەوە لە لیستی میراتی جیهانییە. پاشماوەی شوورەکان، ڕێگای کاروان و ئەو کۆشکەی بەسەر شوێنەکەدا دەڕوانێت دەبینیت.') },
      { h: N('أور وزقورتها', 'Ur and its ziggurat', 'ئوور و زیگوراتەکەی'),
        p: N('قرب الناصرية، زقورة أور من أكثر المعالم السومرية حفظاً، وتُنسب إليها المدينة التي يُقال إن النبي إبراهيم عاش فيها. الزيارة صباحاً أفضل لتجنب الحر.', 'Near Nasiriyah, the Ziggurat of Ur is one of the best-preserved Sumerian monuments, in the city traditionally linked to the Prophet Abraham. Visit in the morning to avoid the heat.', 'نزیک ناسریە، زیگوراتی ئوور یەکێکە لە باشترین شوێنەوارە پارێزراوەکانی سۆمەری، لەو شارەی کە بە نەریت بە پێغەمبەر ئیبراهیمەوە دەبەسترێتەوە. بەیانیان سەردان بکە بۆ دوورکەوتنەوە لە گەرما.') },
      { h: N('الأهوار', 'The Marshes', 'هۆڕەکان'),
        p: N('أُدرجت أهوار جنوب العراق مع مدن أور والوركاء وأريدو على قائمة التراث العالمي في 2016. في الجبايش تركب قارباً بين القصب، وتزور مضيفاً مبنياً من القصب، وتتذوق السمك والقيمر.', 'The Marshes of southern Iraq were inscribed on the World Heritage List in 2016 together with the ancient cities of Ur, Uruk and Eridu. In Chibayish you ride a boat through the reeds, visit a reed guesthouse (mudhif) and taste fish and qaimar.', 'هۆڕەکانی باشووری عێراق لەگەڵ شارە کۆنەکانی ئوور، ئوروک و ئێریدو لە ساڵی 2016 خرانە لیستی میراتی جیهانی. لە چبایش بە بەلەم بە ناو قامیشدا دەڕۆیت، سەردانی مەزیفێکی قامیشی دەکەیت و ماسی و قەیمەر تام دەکەیت.') },
    ],
    good: [
      N('أفضل وقت من تشرين الأول إلى نيسان؛ الصيف حار جداً.', 'The best time is October to April; summer is very hot.', 'باشترین کات تشرینی یەکەم تا نیسانە؛ هاوین زۆر گەرمە.'),
      N('بين المحافظات نقاط تفتيش؛ احمل جوازك دائماً.', 'There are checkpoints between provinces; always carry your passport.', 'لە نێوان پارێزگاکاندا خاڵی پشکنین هەیە؛ هەمیشە پاسپۆرتەکەت لەگەڵ خۆت بێت.'),
      N('دليل محلي يجعل المواقع الأثرية أوضح وأكثر متعة.', 'A local guide makes the archaeological sites clearer and more enjoyable.', 'ڕێنمایەکی ناوخۆیی شوێنە شوێنەوارییەکان ڕوونتر و خۆشتر دەکات.'),
    ],
    related: [['/visit/tours/mesopotamia', 'map', N('رحلة بلاد الرافدين', 'Mesopotamia tour', 'گەشتی میزۆپۆتامیا')], ['/visit/places/babylon', 'building', N('بابل', 'Babylon', 'بابل')], ['/visit/places/marshes', 'globe', N('الأهوار', 'The Marshes', 'هۆڕەکان')]],
  },
  {
    slug: 'kurdistan-road-trip', mode: 'in', img: 'rawanduz', updated: '2026-09-10',
    title: N('رحلة برية في إقليم كردستان', 'A road trip through the Kurdistan Region', 'گەشتێکی ڕێگا بە هەرێمی کوردستاندا'),
    intro: N('جبال وأودية وقلاع ومدن حيّة على مسافات قصيرة. هذا مسار من أربيل يمر بالجبال إلى دهوك ثم السليمانية.', 'Mountains, gorges, citadels and lively towns, all within short drives. Here is a route from Erbil through the mountains to Duhok, then Sulaymaniyah.', 'چیا، دۆڵ، قەڵا و شاری زیندوو، هەمووی بە ماوەی کورت. ئەمە ڕێڕەوێکە لە هەولێرەوە بە ناو چیاکاندا بۆ دهۆک و پاشان سلێمانی.'),
    sections: [
      { h: N('أربيل', 'Erbil', 'هەولێر'),
        p: N('قلعة أربيل على قائمة التراث العالمي منذ 2014، وتحتها القيصرية بأسواقها. المدينة نقطة بداية مريحة بفنادقها ومطارها الدولي.', 'Erbil Citadel has been on the World Heritage List since 2014, with the Qaysari bazaar below it. The city is an easy starting point, with good hotels and an international airport.', 'قەڵای هەولێر لە ساڵی 2014ەوە لە لیستی میراتی جیهانییە، و بازاڕی قەیسەری لە ژێریدایە. شارەکە خاڵێکی دەستپێکی ئاسانە بە هوتێلی باش و فڕۆکەخانەی نێودەوڵەتی.') },
      { h: N('طريق هاملتون وراوندوز', 'The Hamilton Road and Rawanduz', 'ڕێگای هامیلتۆن و ڕەواندز'),
        p: N('شمال شرق أربيل يمر الطريق بشقلاوة ثم مضيق كلي علي بك وشلالاته، وصولاً إلى راوندوز المطلة على وادٍ عميق. الطريق يحتاج نحو ساعتين بالسيارة دون توقف.', 'North-east of Erbil the road passes Shaqlawa, then the Gali Ali Beg gorge and its waterfall, up to Rawanduz above a deep canyon. The drive takes about two hours without stops.', 'لە باکووری ڕۆژهەڵاتی هەولێر ڕێگاکە بە شەقڵاوەدا تێدەپەڕێت، پاشان دۆڵی گەلی عەلی بەگ و تاڤگەکەی، تا ڕەواندز لەسەر دۆڵێکی قووڵ. ڕێگاکە نزیکەی دوو کاتژمێر بێ وەستان دەخایەنێت.') },
      { h: N('دهوك والعمادية', 'Duhok and Amedi', 'دهۆک و ئامێدی'),
        p: N('العمادية بلدة قديمة على قمة جبل، ومن دهوك تزور سد دهوك والقرى الجبلية. المنطقة أبرد صيفاً من بقية العراق.', 'Amedi is an old town on a mountaintop, and from Duhok you can visit the dam and mountain villages. The area is cooler in summer than the rest of Iraq.', 'ئامێدی شارۆچکەیەکی کۆنە لەسەر لووتکەی چیایەک، و لە دهۆکەوە دەتوانیت سەردانی بەنداو و گوندە چیاییەکان بکەیت. ناوچەکە لە هاویندا لە باقی عێراق فێنکترە.') },
      { h: N('السليمانية', 'Sulaymaniyah', 'سلێمانی'),
        p: N('مدينة ثقافية بمقاهيها وأسواقها، وفيها متحف أمنة سوراكا. بحيرة دوكان قريبة لنزهة يوم.', 'A cultural city of cafés and markets, home to the Amna Suraka museum. Lake Dukan is close for a day out.', 'شارێکی کولتووری بە چایخانە و بازاڕەکانییەوە، و مۆزەخانەی ئەمنە سورەکەی تێدایە. دەریاچەی دووکان بۆ ڕۆژێک گەشت نزیکە.') },
    ],
    good: [
      N('للإقليم قواعد دخول خاصة عبر مطاري أربيل والسليمانية؛ نؤكدها لجنسيتك.', 'The Region has its own entry rules at Erbil and Sulaymaniyah airports; we confirm them for your nationality.', 'هەرێم یاسای تایبەتی چوونەژوورەوەی هەیە لە فڕۆکەخانەکانی هەولێر و سلێمانی؛ بۆ ڕەگەزنامەکەت پشتڕاستی دەکەینەوە.'),
      N('أجمل المواسم الربيع، ونوروز في 21 آذار، ثم الخريف.', 'Spring is the loveliest season, with Newroz on 21 March, then autumn.', 'بەهار جوانترین وەرزە، نەورۆز لە 21ی ئازار، پاشان پاییز.'),
      N('احمل جوازك على الطرق؛ توجد نقاط تفتيش.', 'Carry your passport on the roads; there are checkpoints.', 'لە ڕێگاکاندا پاسپۆرتەکەت لەگەڵ خۆت بێت؛ خاڵی پشکنین هەیە.'),
    ],
    related: [['/visit/tours/kurdistan-mountains', 'map', N('رحلة جبال كردستان', 'Kurdistan mountains tour', 'گەشتی چیاکانی کوردستان')], ['/visit/places/erbil', 'building', N('أربيل', 'Erbil', 'هەولێر')], ['/visit/places/duhok', 'globe', N('دهوك', 'Duhok', 'دهۆک')]],
  },
  {
    slug: 'holy-shrines-etiquette', mode: 'in', img: 'najaf', updated: '2026-09-05',
    title: N('زيارة العتبات المقدسة: الآداب والنصائح العملية', 'Visiting the holy shrines: etiquette and practical tips', 'سەردانی شوێنە پیرۆزەکان: ڕەفتار و ئامۆژگاری کرداری'),
    intro: N('حرم الإمام علي في النجف، والإمام الحسين وأبي الفضل العباس في كربلاء، والكاظمية في بغداد، والعسكريين في سامراء. هذه نصائح تجعل زيارتك مريحة ومحترمة.', 'The shrine of Imam Ali in Najaf, of Imam Hussein and al-Abbas in Karbala, Kadhimiya in Baghdad and al-Askari in Samarra. These tips make your visit comfortable and respectful.', 'حەرەمی ئیمام عەلی لە نەجەف، ئیمام حوسێن و ئەبولفەزڵ عەباس لە کەربەلا، کازمییە لە بەغدا و عەسکەرییەکان لە سامەڕا. ئەم ئامۆژگارییانە سەردانەکەت ئاسوودە و بە ڕێز دەکەن.'),
    sections: [
      { h: N('اللباس', 'Dress', 'جل'),
        p: N('الرجال بسراويل طويلة وقمصان بأكمام، والنساء بلباس ساتر مع العباءة. تتوفر العباءات عند مداخل النساء في الحرمين الكبيرين.', 'Men wear long trousers and sleeved shirts; women wear modest clothes with an abaya. Abayas are available at the women’s entrances of the main shrines.', 'پیاوان پانتۆڵی درێژ و کراسی قۆڵدار لەبەر دەکەن؛ ئافرەتان جلی داپۆشەر لەگەڵ عەبا. عەبا لە دەروازەکانی ئافرەتان لە حەرەمە سەرەکییەکاندا هەیە.') },
      { h: N('الدخول والتفتيش', 'Entry and security', 'چوونەژوورەوە و پشکنین'),
        p: N('للرجال والنساء مداخل منفصلة مع تفتيش. الحقائب الكبيرة غير مسموحة، فاتركها في الفندق. تُترك الأحذية في الكشوانية مجاناً مقابل رقم.', 'Men and women have separate entrances with security checks. Large bags are not allowed, so leave them at the hotel. Shoes are left at the shoe store (kishwaniya) for free, in return for a token.', 'پیاوان و ئافرەتان دەروازەی جیاوازیان هەیە بە پشکنینەوە. جانتای گەورە ڕێگەپێنەدراوە، بۆیە لە هوتێل جێیبهێڵە. پێڵاو لە کەشوانیە بە خۆڕایی بە بەرامبەر ژمارەیەک دادەنرێت.') },
      { h: N('داخل الحرم', 'Inside the shrine', 'لە ناو حەرەمدا'),
        p: N('حافظ على الهدوء، ولا تقطع صفوف المصلين. التصوير مسموح في الصحن عادة، وقد يُمنع قرب الضريح؛ اتبع إرشاد الخدم.', 'Keep your voice low and do not cross in front of people praying. Photos are usually fine in the courtyard and may be refused near the tomb; follow the attendants.', 'دەنگت نزم بێت و بە بەردەم نوێژکەراندا مەڕۆ. وێنەگرتن زۆرجار لە حەوشەدا ئاساییە و لەوانەیە نزیک گۆڕەکە ڕێگەی پێنەدرێت؛ گوێ لە خزمەتکاران بگرە.') },
    ],
    good: [
      N('أيام الجمعة والمناسبات أزحم؛ الصباح الباكر أهدأ.', 'Fridays and religious occasions are busiest; early morning is calmest.', 'هەینی و بۆنە ئایینییەکان قەرەباڵغترن؛ بەیانی زوو هێمنترە.'),
      N('احمل ماءً واتفق على نقطة لقاء خارج الحرم.', 'Carry water and agree a meeting point outside the shrine.', 'ئاو لەگەڵ خۆت ببە و لەسەر خاڵێکی کۆبوونەوە لە دەرەوەی حەرەم ڕێک بکەون.'),
      N('دليل يتحدث لغتك يشرح التاريخ والآداب.', 'A guide who speaks your language explains the history and customs.', 'ڕێنمایەک کە بە زمانەکەت قسە بکات مێژوو و نەریتەکان ڕوون دەکاتەوە.'),
    ],
    related: [['/visit/places/najaf', 'star', N('النجف', 'Najaf', 'نەجەف')], ['/visit/places/karbala', 'star', N('كربلاء', 'Karbala', 'کەربەلا')], ['/visit/tours/karbala-najaf', 'map', N('رحلة النجف وكربلاء', 'Najaf and Karbala trip', 'گەشتی نەجەف و کەربەلا')]],
  },
]

export const guideBy = (slug) => GUIDES.find((g) => g.slug === slug)
/** Reading time in minutes, from the English text (about 200 words a minute). */
export const readMins = (g) => {
  const words = [g.intro, ...g.sections.flatMap((s) => [s.h, s.p]), ...g.good].map((x) => x.en).join(' ').split(/\s+/).length
  return Math.max(2, Math.round(words / 200))
}
