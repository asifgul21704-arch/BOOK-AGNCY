import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { success } = useToast();
  const { isRTL, language, t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    success(
      isRTL
        ? 'جزاک اللہ خیراً! آپ کا پیغام ہماری اردو بازار لاہور ٹیم کو موصول ہو چکا ہے۔'
        : 'JazakAllah Khair! Your message has been sent to our Urdu Bazaar team.'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl text-start">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
            {language === 'ur' ? 'کسٹمر سپورٹ و رابطہ' : language === 'ar' ? 'خدمة العملاء والاستفسارات' : 'Customer Care & Store Inquiries'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif-heading">
            {language === 'ur' ? 'مکتبہ حقانیہ سے رابطہ کریں' : language === 'ar' ? 'تواصل مع مكتبة حقانية' : 'Contact Maktaba Haqanya'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {language === 'ur'
              ? 'کتب کی دستیابی، نادر ایڈیشنز، مدارس و اسکولوں کے بلک آرڈرز یا پارسل کی ترسیل کے حوالے سے ہم سے بلا جھجھک رابطہ فرمائیں۔'
              : language === 'ar'
              ? 'هل لديك استفسار حول طبعات الكتب، الطلبات الكبيرة للمدارس والجامعات، أو حالة الشحن؟ نحن هنا لمساعدتك.'
              : 'Have questions about rare book editions, bulk Madrasa / school orders, or courier delivery status? We are here to assist you.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info & Hours */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-start">
            <h3 className="font-bold text-lg font-serif-heading text-slate-900 border-b border-slate-100 pb-3">
              {language === 'ur' ? 'مکتبہ کی معلومات و پتہ' : language === 'ar' ? 'معلومات المتجر والعنوان' : 'Store Information'}
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">
                    {language === 'ur' ? 'اردو بازار لاہور برانچ:' : language === 'ar' ? 'فرع أردو بازار لاهور:' : 'Urdu Bazaar Lahore Branch:'}
                  </strong>
                  <span>{t('footer.storeAddress')}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">
                    {language === 'ur' ? 'فون سپورٹ:' : language === 'ar' ? 'الهاتف:' : 'Phone Support:'}
                  </strong>
                  <span>+92 42 37234567 / +92 300 8492011</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">
                    {language === 'ur' ? 'واٹس ایپ رابطہ:' : language === 'ar' ? 'واتساب مباشر:' : 'WhatsApp Direct:'}
                  </strong>
                  <a
                    href="https://wa.me/923008492011"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    +92 300 8492011 ({language === 'ur' ? 'چیٹ کے لیے کلک کریں' : language === 'ar' ? 'انقر للدردشة' : 'Click to Chat'})
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">
                    {language === 'ur' ? 'ای میل:' : language === 'ar' ? 'البريد الإلكتروني:' : 'Email Inquiries:'}
                  </strong>
                  <span>info@maktabahaqanya.pk / orders@maktabahaqanya.pk</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">
                    {language === 'ur' ? 'اوقات کار:' : language === 'ar' ? 'أوقات العمل:' : 'Opening Timings:'}
                  </strong>
                  <span>{language === 'ur' ? 'پیر تا ہفتہ: 9:00 صبح – 9:30 رات' : language === 'ar' ? 'الإثنين - السبت: 9:00 ص - 9:30 م' : 'Monday – Saturday: 9:00 AM – 9:30 PM'}</span>
                  <span className="block text-[11px] text-slate-500">
                    {language === 'ur' ? 'جمعہ کا وقفہ: 1:00 دوپہر – 2:30 دوپہر' : language === 'ar' ? 'استراحة صلاة الجمعة: 1:00 ظ - 2:30 ظ' : 'Friday Prayer Break: 1:00 PM – 2:30 PM'}
                  </span>
                  <span className="block text-[11px] text-slate-500">
                    {language === 'ur' ? 'اتوار: تعطیل' : language === 'ar' ? 'الأحد: مغلق' : 'Sunday: Closed'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-start">
          <h3 className="font-bold text-lg font-serif-heading text-slate-900 border-b border-slate-100 pb-3">
            {language === 'ur' ? 'پیغام ارسال کریں' : language === 'ar' ? 'إرسال استفسار' : 'Send an Inquiry'}
          </h3>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-6 rounded-2xl space-y-2 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-base">
                {language === 'ur' ? 'پیغام کامیابی سے بھیج دیا گیا!' : language === 'ar' ? 'تم إرسال الرسالة بنجاح!' : 'Message Sent Successfully!'}
              </h4>
              <p className="text-xs text-slate-600">
                {language === 'ur'
                  ? 'ہمارا نمائندہ جلد آپ کے ای میل یا واٹس ایپ نمبر پر رابطہ کرے گا۔'
                  : language === 'ar'
                  ? 'سيتواصل معك ممثلنا قريباً عبر البريد الإلكتروني أو الواتساب.'
                  : 'Our customer representative will respond to your email or WhatsApp number shortly.'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t('checkout.fullName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isRTL ? 'مثلاً: عبد اللہ خان' : 'e.g. Abdullah Khan'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t('checkout.email')} *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. abdullah@gmail.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {t('checkout.phone')}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {language === 'ur' ? 'عنوان / موضوع' : language === 'ar' ? 'الموضوع' : 'Subject'}
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={language === 'ur' ? 'مثلاً: کتاب کی دستیابی / بلک آرڈر' : language === 'ar' ? 'مثلاً: استفسار عن كتاب / طلب مجمع' : 'e.g. Book Inquiry / Bulk Order'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {language === 'ur' ? 'آپ کا تفصیلی پیغام *' : language === 'ar' ? 'نص الرسالة *' : 'Your Message *'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={language === 'ur' ? 'ہم آپ کی کتب کی خریداری یا معلومات میں کس طرح مدد کر سکتے ہیں؟' : language === 'ar' ? 'كيف يمكننا مساعدتك في اختيار أو طلب الكتب؟' : 'How can we assist you with our books catalog?'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>{language === 'ur' ? 'پیغام ارسال کریں' : language === 'ar' ? 'إرسال الرسالة' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Google Maps Location Section */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs text-start">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>{language === 'ur' ? 'اردو بازار لاہور کا لوکیشن نقشہ' : language === 'ar' ? 'خريطة موقع أردو بازار لاهور' : 'Interactive Urdu Bazaar Lahore Map'}</span>
          </h3>
        </div>
        <div className="h-80 w-full bg-slate-100">
          <iframe
            src="https://maps.google.com/maps?q=Urdu+Bazaar+Lahore&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            title="Urdu Bazaar Lahore Map"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

