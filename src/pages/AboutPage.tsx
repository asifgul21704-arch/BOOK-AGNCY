import React from 'react';
import { BookOpen, ShieldCheck, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AboutPage: React.FC = () => {
  const { isRTL, language } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Hero */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-800 flex items-center justify-center text-emerald-200 mx-auto shadow-md">
          <BookOpen className="w-7 h-7" />
        </div>
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
          {language === 'ur' ? 'مکتبہ حقانیہ کا تعارف' : language === 'ar' ? 'نبذة عن مكتبة حقانية' : 'About Maktaba Haqanya'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif-heading">
          {language === 'ur'
            ? 'علمی ورثے اور اسلامی کتب کی ترویج و اشاعت'
            : language === 'ar'
            ? 'نشر التراث العلمي والكتب الإسلامية الأصيلة'
            : 'Dedicated to Spreading Knowledge & Classical Literature'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {language === 'ur'
            ? 'اردو بازار لاہور کے تاریخی علمی مرکز میں قائم مکتبہ حقانیہ ملک بھر کے طلبہ، علمائے کرام اور شائقین کتب کو معتبر تفاسیر، احادیث، اسلامی کتب اور اردو ادب کی مستند کتب فراہم کرتا ہے۔'
            : language === 'ar'
            ? 'تأسست مكتبة حقانية في قلب أردو بازار لاهور التاريخي، لخدمة القراء والعلماء والطلاب في جميع أنحاء باكستان بكتب التفسير، الحديث، والفكر الإسلامي الأصيل.'
            : 'Founded in the cultural publishing hub of Urdu Bazaar Lahore, Maktaba Haqanya has connected thousands of Pakistani readers, scholars, and students with verified Islamic and Urdu literature.'}
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-3 text-start">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold font-serif-heading text-slate-900">
            {language === 'ur' ? 'ہمارا علمی مشن' : language === 'ar' ? 'رسالتنا العلمية' : 'Our Sacred Mission'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {language === 'ur'
              ? 'قرآن و سنت، تفاسیر، سوانح صالحین، درسی کتب اور کلاسیکی اردو شاعری کو آسان، باوقار اور مناسب ترین قیمت پر ہر گھر اور ادارے تک پہنچانا۔'
              : language === 'ar'
              ? 'توفير التراث الإسلامي وكتب التفسير والسيرة النبوية والأدب بأسعار ميسرة وتوصيل موثوق لجميع المنازل والمؤسسات التعليمية.'
              : 'To provide easy, affordable, and authentic access to timeless Islamic wisdom, classical Urdu poetry, Tafseer commentary, Seerah biographies, and academic texts to households and institutions across Pakistan.'}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-3 text-start">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold font-serif-heading text-slate-900">
            {language === 'ur' ? 'معیاری و اصل طباعت کی ضمانت' : language === 'ar' ? 'ضمان جودة وأصالة الطباعة' : 'Publishing Authenticity'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {language === 'ur'
              ? 'ہماری ہر کتاب تصدیق شدہ مستند ناشرین (جیسے دارالسلام، سنگ میل پبلیکیشنز، الف کتاب وغیرہ) سے براہ راست حاصل کی جاتی ہے تاکہ طباعت اور متن بے داغ رہے۔'
              : language === 'ar'
              ? 'يتم فحص كل كتاب في كتالوجنا للتحقق من دقته النصية وجودة طباعته وتجليده مع شركائنا المعتمدين.'
              : 'Every book in our catalog is vetted for textual accuracy and print quality. We partner directly with prestigious publishers such as Darussalam, Sang-e-Meel Publications, Alif Kitab, and official academic presses.'}
          </p>
        </div>
      </div>

      {/* Heritage & Values */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6 text-start">
        <h3 className="text-2xl font-bold font-serif-heading text-slate-900">
          {language === 'ur' ? 'ہمارے بنیادی اصول' : language === 'ar' ? 'مبادئنا وقيمنا الجوهرية' : 'Our Core Principles'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-700">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-base">
              {language === 'ur' ? 'پورے پاکستان میں ڈیلیوری' : language === 'ar' ? 'توصيل شامل لكل أنحاء باكستان' : 'Nationwide Reach'}
            </h4>
            <p className="text-slate-600 leading-relaxed">
              {language === 'ur'
                ? 'لاہور، کراچی، اسلام آباد، پشاور، کوئٹہ سے لے کر گلگت بلتستان اور آزاد کشمیر کے ہر قصبے تک کیش آن ڈیلیوری۔'
                : language === 'ar'
                ? 'خدمة الدفع عند الاستلام والتوصيل السريع إلى جميع المدن والمناطق في باكستان.'
                : 'We deliver to every corner of Pakistan — from major metropolitan hubs to remote towns with reliable Cash on Delivery.'}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-base">
              {language === 'ur' ? 'قارئین کے لیے رہنمائی' : language === 'ar' ? 'خدمة القراء ودعم متواصل' : 'Reader First Support'}
            </h4>
            <p className="text-slate-600 leading-relaxed">
              {language === 'ur'
                ? 'خواہ آپ کو کسی خاص شرح یا نادر نسخے کی تلاش ہو یا طلبہ کی رہنمائی درکار ہو، ہمارے کتب کے ماہرین آپ کی خدمت میں حاضر ہیں۔'
                : language === 'ar'
                ? 'فريق متخصص لمساعدتكم في اختيار أفضل الطبعات والشروح والاستشارات العلمية.'
                : 'Whether you are searching for a specific commentary edition or seeking recommendations, our book specialists are always ready to guide you.'}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-base">
              {language === 'ur' ? 'شفاف و مناسب قیمتیں' : language === 'ar' ? 'أسعار عادلة وشفافة' : 'Fair Pricing in PKR'}
            </h4>
            <p className="text-slate-600 leading-relaxed">
              {language === 'ur'
                ? 'ناشر کے اصل نرخ، باقاعدہ خصوصی رعایتیں، اور 2000 روپے سے زائد کے آرڈرز پر بالکل مفت ہوم ڈیلیوری۔'
                : language === 'ar'
                ? 'أسعار قياسية مع خصومات مستمرة وتوصيل مجاني للطلبات التي تزيد عن 2000 روبية.'
                : 'We maintain publisher-standard, transparent prices with regular discounts and free delivery thresholds for passionate readers.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

