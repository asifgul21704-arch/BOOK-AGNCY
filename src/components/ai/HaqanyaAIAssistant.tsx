import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, BookOpen, ShoppingCart, RefreshCw, ChevronRight, ChevronLeft, MapPin, Truck, Check } from 'lucide-react';
import { Book } from '../../types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  recommendedBooks?: Book[];
  timestamp: string;
}

export const HaqanyaAIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isRTL, language, formatPrice, t } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const welcomeText =
    language === 'ur'
      ? 'السلام علیکم! میں مکتبہ حقانیہ کا **ذہین کتب معاون (AI Assistant)** ہوں۔\n\nآپ مجھ سے تفاسیر، احادیث، اسلامی کتب، اردو ادب، قیمتوں، اسٹاک اور پاکستان بھر میں ڈیلیوری کے بارے میں پوچھ سکتے ہیں۔'
      : language === 'ar'
      ? 'السلام عليكم! أنا **المساعد الذكي لمكتبة حقانية**.\n\nيمكنني مساعدتك في البحث عن كتب التفسير، الحديث، والفكر الإسلامي، ومعرفة الأسعار وحالة التوصيل.'
      : 'Assalamu Alaikum! I am your **Haqanya AI Assistant**.\n\nI can help you search our catalog of Islamic studies, Urdu literature, and academic books, verify real-time stock and prices in PKR, or assist with delivery inquiries.';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: welcomeText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  useEffect(() => {
    setMessages([
      {
        id: 'welcome-lang-switch',
        sender: 'ai',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [language]);

  const suggestedPromptsEn = [
    'Find books under Rs. 1,000',
    'Show Islamic & Seerah books',
    'What is the price of Tafseer Ibn Kathir?',
    'Check stock for Atomic Habits',
    'Where is your store located?',
    'Track my order',
    'Recommend CSS exam books'
  ];

  const suggestedPromptsUr = [
    '1000 روپے سے کم قیمت کتب دکھائیں',
    'سیرت النبی ﷺ اور اسلامی کتب',
    'تفسیر ابن کثیر کی قیمت کیا ہے؟',
    'اردو شاعری اور کلیات اقبال',
    'آپ کا کتب خانہ کہاں واقع ہے؟',
    'ڈیلیوری کے کتنے دن لگتے ہیں؟'
  ];

  const suggestedPromptsAr = [
    'كتب بأقل من 1000 روبية',
    'كتب التفسير والسيرة النبوية',
    'ما هو سعر تفسير ابن كثير؟',
    'أين يقع متجركم في لاهور؟',
    'تفاصيل الدفع عند الاستلام'
  ];

  const suggestedPrompts = language === 'ur' ? suggestedPromptsUr : language === 'ar' ? suggestedPromptsAr : suggestedPromptsEn;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (customPrompt?: string) => {
    const query = (customPrompt || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.id ? { Authorization: `Bearer ${user.id}` } : {})
        },
        body: JSON.stringify({ prompt: query })
      });

      const data = await res.json();
      if (data.success && data.data) {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.data.text,
          recommendedBooks: data.data.recommendedBooks || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error(data.message || 'AI request failed');
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: isRTL
            ? 'کنکشن میں عارضی تاخیر ہے۔ آپ اوپر سرچ بار سے کتب تلاش کر سکتے ہیں یا ہمارے واٹس ایپ نمبر **+92 300 8492011** پر رابطہ فرما سکتے ہیں۔'
            : 'I am experiencing a momentary connection issue. You can browse our books via the search bar above or contact our Urdu Bazaar WhatsApp at **+92 300 8492011**.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'ai',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <>
      {/* Floating Action Button */}
      <div className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-40 flex items-center gap-2`}>
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-1.5 bg-[#0a0a1f]/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-white/15 animate-bounce backdrop-blur-xl pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'ur' ? 'حقانیہ AI معاون' : language === 'ar' ? 'مساعد حقانية AI' : 'Ask Haqanya AI'}</span>
          </div>
        )}
        <button
          id="btn-toggle-ai-assistant"
          onClick={() => setIsOpen(!isOpen)}
          className="relative group bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white p-4 rounded-full shadow-[0_15px_35px_rgba(99,102,241,0.4)] transition-all duration-300 transform hover:scale-105 border border-white/30 flex items-center justify-center backdrop-blur-xl"
          title={language === 'ur' ? 'حقانیہ AI کتب معاون' : language === 'ar' ? 'مساعد حقانية الذكي' : 'Haqanya AI Book Assistant'}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-fuchsia-500"></span>
          </span>
        </button>
      </div>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          id="modal-haqanya-ai"
          className={`fixed bottom-24 ${isRTL ? 'left-4 sm:left-6' : 'right-4 sm:right-6'} z-50 w-[94vw] sm:w-[420px] h-[560px] max-h-[82vh] bg-[#0c0d22]/90 backdrop-blur-3xl rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] border border-white/15 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300`}
        >
          {/* Header */}
          <div className="bg-white/[0.04] backdrop-blur-xl border-b border-white/10 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 border border-white/20 flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="text-start">
                <h3 className="font-bold text-sm flex items-center gap-1.5 font-sans">
                  {language === 'ur' ? 'مکتبہ حقانیہ AI معاون' : language === 'ar' ? 'مساعد حقانية الذكي' : 'Haqanya AI Assistant'}
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-1.5 py-0.2 rounded font-normal">
                    {language === 'ur' ? 'آن لائن' : language === 'ar' ? 'نشط' : 'Active'}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  {language === 'ur' ? 'کتب، تفاسیر اور رہنمائی' : language === 'ar' ? 'مرشدكم للكتب والمراجع' : 'Maktaba Haqanya Knowledge Guide'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors"
                title={language === 'ur' ? 'گفتگو صاف کریں' : 'Clear Chat'}
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors"
                title={language === 'ur' ? 'بند کریں' : 'Close'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-black/20 space-y-3.5 text-start">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? (isRTL ? 'items-start' : 'items-end') : (isRTL ? 'items-end' : 'items-start')}`}
              >
                <div
                  className={`max-w-[86%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed shadow-md backdrop-blur-xl text-start ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-white rounded-br-none border border-white/20'
                      : 'bg-white/[0.06] text-slate-200 border border-white/10 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Render Book Recommendations if present */}
                  {msg.recommendedBooks && msg.recommendedBooks.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-2">
                      <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
                        {language === 'ur' ? 'تجویز کردہ کتب:' : language === 'ar' ? 'الكتب المقترحة:' : 'Recommended Books:'}
                      </span>
                      {msg.recommendedBooks.map((book) => (
                        <div
                          key={book.id}
                          className="bg-white/[0.04] border border-white/10 rounded-xl p-2.5 flex items-center gap-2.5 hover:bg-white/[0.08] transition-colors backdrop-blur-md"
                        >
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-10 h-14 object-cover rounded-lg shadow-md flex-shrink-0 border border-white/10"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-xs text-white truncate">{book.title}</h5>
                            <p className="text-[11px] text-slate-400 truncate">
                              {t('book.author')}: {book.author}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-extrabold text-white">
                                {formatPrice(book.discountPrice || book.price)}
                              </span>
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded font-medium border ${
                                  book.stock > 0
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                }`}
                              >
                                {book.stock > 0 ? t('badge.inStock') : t('badge.outOfStock')}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => addToCart(book, 1)}
                              disabled={book.stock <= 0}
                              className="p-1.5 bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 disabled:opacity-40 text-white rounded-lg shadow-sm border border-white/20"
                              title={t('book.addToCart')}
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                            </button>
                            <Link
                              to={`/books/${book.slug || book.id}`}
                              onClick={() => setIsOpen(false)}
                              className="p-1.5 bg-white/10 border border-white/15 text-slate-300 hover:text-white rounded-lg flex items-center justify-center backdrop-blur-md"
                              title={t('action.viewDetails')}
                            >
                              <ChevronIcon className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 bg-white/[0.06] border border-white/10 p-3 rounded-2xl rounded-bl-none max-w-[70%] shadow-md backdrop-blur-xl">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse delay-150"></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse delay-300"></span>
                </div>
                <span className="text-xs text-slate-300 font-medium">
                  {language === 'ur' ? 'کیٹلاگ تلاش کیا جا رہا ہے...' : language === 'ar' ? 'جاري البحث في الكتالوج...' : 'Checking catalog...'}
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Chips */}
          <div className="px-3 py-2 bg-white/[0.02] border-t border-white/10 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5 backdrop-blur-md">
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="text-[11px] bg-white/5 hover:bg-white/10 hover:text-white text-slate-300 px-2.5 py-1 rounded-full transition-colors border border-white/10 flex-shrink-0 backdrop-blur-md"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white/[0.03] border-t border-white/10 backdrop-blur-xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                id="input-ai-chat"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  language === 'ur'
                    ? 'کتب، قیمتوں، تفاسیر یا مصنفین کے بارے میں پوچھیں...'
                    : language === 'ar'
                    ? 'اسأل عن الكتب، الأسعار، أو المؤلفين...'
                    : 'Ask about books, prices, stock...'
                }
                className="flex-1 bg-white/[0.06] border border-white/15 text-white placeholder-slate-400 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md transition-all"
              />
              <button
                id="btn-ai-send"
                type="submit"
                disabled={!input.trim() || loading}
                className="bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all shadow-md border border-white/20 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

