import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const FAQPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const { isRTL, language } = useLanguage();

  const faqsEn = [
    {
      q: 'How does Cash on Delivery (COD) work across Pakistan?',
      a: 'When you place an order selecting Cash on Delivery, our courier partner (TCS, Leopard, or Trax) will deliver your parcel directly to your shipping address. You pay the exact invoice amount in Pakistani Rupees (PKR) directly to the courier representative.'
    },
    {
      q: 'What is the delivery timeline for cities outside Lahore?',
      a: 'For Lahore orders, standard delivery takes 1-2 business days. For major cities like Karachi, Islamabad, Rawalpindi, Faisalabad, Peshawar, and Multan, delivery takes 2-4 business days. For remote towns and districts, delivery takes 3-6 business days.'
    },
    {
      q: 'How do I qualify for FREE Nationwide Delivery?',
      a: 'Any cart with a subtotal of Rs. 2,000 or above automatically qualifies for 100% Free Standard Nationwide Delivery anywhere in Pakistan.'
    },
    {
      q: 'Are all books original publisher editions?',
      a: 'Yes, 100%. Maktaba Haqanya exclusively sells authorized, original hardbound and paperback editions from certified publishers including Darussalam, Sang-e-Meel, Alif Kitab, and official international and local presses.'
    },
    {
      q: 'Can I track my parcel status?',
      a: 'Yes! As soon as your order is dispatched from our Urdu Bazaar Lahore warehouse, you will receive a tracking number and courier link. You can also visit our "Track Order" page anytime and enter your order number.'
    },
    {
      q: 'What is your replacement / return policy?',
      a: 'We offer a 7-day hassle-free replacement guarantee if a book arrives with misprinted pages, damaged binding, or transport defects. Simply message us on WhatsApp (+92 300 8492011) with a photo of the parcel.'
    }
  ];

  const faqsUr = [
    {
      q: 'پورے پاکستان میں کیش آن ڈیلیوری (COD) کیسے کام کرتی ہے؟',
      a: 'جب آپ کیش آن ڈیلیوری کے ساتھ آرڈر کرتے ہیں تو ہمارا کوریئر پارٹنر پارسل براہ راست آپ کی دہلیز پر لاتا ہے۔ آپ انوائس پر لکھی رقم کوریئر رائیڈر کو ادا کر کے پارسل وصول کرتے ہیں۔'
    },
    {
      q: 'لاہور کے علاوہ دیگر شہروں کے لیے کتنا وقت لگتا ہے؟',
      a: 'لاہور کے لیے 1 سے 2 کاروباری دن، بڑے شہروں (کراچی، اسلام آباد، راولپنڈی، پشاور، فیصل آباد وغیرہ) کے لیے 2 سے 4 دن، اور دور دراز علاقوں کے لیے 3 سے 6 کاروباری دن درکار ہوتے ہیں۔'
    },
    {
      q: 'مفت ہوم ڈیلیوری کیسے حاصل کی جا سکتی ہے؟',
      a: '2000 روپے یا اس سے زائد مالیت کے تمام آرڈرز پر پورے پاکستان میں ڈیلیوری بالکل مفت فراہم کی جاتی ہے۔'
    },
    {
      q: 'کیا تمام کتب اصل اور تصدیق شدہ ایڈیشنز ہیں؟',
      a: 'جی ہاں، 100 فیصد۔ مکتبہ حقانیہ صرف اصل اور معتبر ناشرین (جیسے دارالسلام، سنگ میل پبلیکیشنز وغیرہ) کی شائع کردہ مستند کتب فروخت کرتا ہے۔'
    },
    {
      q: 'کیا میں اپنے پارسل کو ٹریک کر سکتا ہوں؟',
      a: 'جی ہاں! جیسے ہی آپ کا آرڈر ہمارے اردو بازار گودام سے روانہ ہوتا ہے، آپ کو ٹریکنگ نمبر موصول ہو جاتا ہے جس سے آپ ہمارے پورٹل پر براہ راست آرڈر ٹریک کر سکتے ہیں۔'
    },
    {
      q: 'کتاب کی تبدیلی یا واپسی کی کیا پالیسی ہے؟',
      a: 'اگر کتاب میں طباعت کی خرابی یا جلد کا کوئی نقص ہو تو ہم 7 دن کے اندر بغیر کسی پریشانی کے متبادل نسخہ فراہم کرتے ہیں۔ بس ہمارے واٹس ایپ نمبر پر رابطہ فرمائیں۔'
    }
  ];

  const faqsAr = [
    {
      q: 'كيف تعمل خدمة الدفع عند الاستلام (COD) في باكستان؟',
      a: 'عند تقديم الطلب واختيار الدفع عند الاستلام، يقوم مندوب الشحن بتوصيل الطرد مباشرة إلى عنوانك، وتدفع المبلغ المحدد بالفاتورة نقداً عند الاستلام.'
    },
    {
      q: 'ما هي المدة الزمنية لتوصيل الطلبات خارج مدينة لاهور؟',
      a: 'طلبات لاهور تستغرق 1-2 يوم عمل. المدن الكبرى (كراتشي، إسلام آباد، بيشاور) تستغرق 2-4 أيام عمل، والمناطق النائية 3-6 أيام عمل.'
    },
    {
      q: 'كيف أحصل على شحن مجاني؟',
      a: 'جميع الطلبات التي تتجاوز قيمتها 2000 روبية مؤهلة تلقائياً للتوصيل المجاني إلى أي مكان في باكستان.'
    },
    {
      q: 'هل جميع الكتب طبعات أصلية ومعتمدة؟',
      a: 'نعم، بنسبة 100%. مكتبة حقانية تبيع حصرياً طبعات أصلية فاخرة ومحققة من دور النشر الرائدة مثل دار السلام وسنغ ميل وغيرها.'
    },
    {
      q: 'هل يمكنني تتبع حالة شحن الطلب؟',
      a: 'نعم، بمجرد إرسال الطرد من مستودعاتنا في أردو بازار لاهور، ستصلك رسالة تحتوي على رقم التتبع لمتابعة الشحنة مباشرة.'
    },
    {
      q: 'ما هي سياسة الاستبدال أو الإرجاع؟',
      a: 'نوفر ضمان استبدال مجاني خلال 7 أيام في حال وجود أي عيب في الطباعة أو التجليد أو تلف أثناء النقل.'
    }
  ];

  const faqs = language === 'ur' ? faqsUr : language === 'ar' ? faqsAr : faqsEn;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block">
          {language === 'ur' ? 'اکثر پوچھے جانے والے سوالات' : language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
        </span>
        <h1 className="text-3xl font-bold font-serif-heading text-slate-900">
          {language === 'ur' ? 'عام سوالات کے فوری جوابات' : language === 'ar' ? 'إجابات على الأسئلة الأكثر تكراراً' : 'Got Questions? We Have Answers'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          {language === 'ur'
            ? 'ڈیلیوری، پیمنٹ کے طریقے، کتب کی اصلیت اور پارسل ٹریکنگ سے متعلق تمام تفصیلات یہاں دیکھیں۔'
            : language === 'ar'
            ? 'تعرف على تفاصيل الشحن، خيارات الدفع، أصالة الكتب وتتبع الشحنات في باكستان.'
            : 'Find instant information on delivery charges, payment options, book authenticity, and courier tracking across Pakistan.'}
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs text-start"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:bg-slate-50 transition-colors text-start"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-700 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

