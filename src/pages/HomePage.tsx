import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Search,
  CheckCircle2,
  Tag,
  Gift,
  MapPin,
  Phone,
  Clock,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { Book, Category } from '../types';
import { BookCard } from '../components/books/BookCard';
import { useLanguage } from '../context/LanguageContext';

export const HomePage: React.FC = () => {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [newArrivals, setNewArrivals] = useState<Book[]>([]);
  const [bestSellers, setBestSellers] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [homeSearch, setHomeSearch] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const { t, formatPrice, translateCategory, isRTL } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, catsRes] = await Promise.all([
          fetch('/api/books?limit=24'),
          fetch('/api/categories')
        ]);

        const booksData = await booksRes.json();
        const catsData = await catsRes.json();

        if (booksData.success && booksData.data.books) {
          const all: Book[] = booksData.data.books;
          setFeaturedBooks(all.filter((b) => b.featured).slice(0, 4));
          setNewArrivals(all.filter((b) => b.newArrival).slice(0, 4));
          setBestSellers(all.filter((b) => b.bestSeller).slice(0, 4));
        }

        if (catsData.success && catsData.data) {
          setCategories(catsData.data);
        }
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleHomeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (homeSearch.trim()) {
      navigate(`/books?search=${encodeURIComponent(homeSearch.trim())}`);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Text */}
          <div className="lg:col-span-7 space-y-6 text-start">
            <div className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/15 text-indigo-300 text-xs font-semibold px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
              <span>{t('hero.badge')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif-heading tracking-tight leading-tight sm:leading-none text-white">
              {t('hero.title')}{' '}
              <span className="bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent italic">
                {t('hero.subtitle')}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              {t('hero.description')}
            </p>

            {/* Quick Hero Search */}
            <div className="pt-2 max-w-lg">
              <form
                onSubmit={handleHomeSearch}
                className="relative flex items-center shadow-[0_20px_40px_rgba(0,0,0,0.6)] rounded-2xl bg-white/[0.06] p-1.5 border border-white/20 backdrop-blur-xl"
              >
                <Search className={`w-5 h-5 text-indigo-300 absolute ${isRTL ? 'right-4' : 'left-4'}`} />
                <input
                  type="text"
                  value={homeSearch}
                  onChange={(e) => setHomeSearch(e.target.value)}
                  placeholder={t('hero.searchPlaceholder')}
                  className={`w-full bg-transparent text-white placeholder-slate-400 text-sm py-2.5 focus:outline-none ${
                    isRTL ? 'pr-11 pl-28' : 'pl-11 pr-28'
                  }`}
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-md border border-white/20 flex-shrink-0"
                >
                  {t('hero.searchBtn')}
                </button>
              </form>
            </div>

            {/* Hero CTA buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/books"
                id="btn-hero-explore"
                className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-indigo-950/50 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 border border-white/20"
              >
                <span>{t('hero.browseBtn')}</span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </Link>
              <Link
                to="/categories"
                id="btn-hero-categories"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm px-6 py-3 rounded-xl backdrop-blur-md transition-colors shadow-xs"
              >
                {t('hero.categoriesBtn')}
              </Link>
            </div>

            {/* Delivery & Trust reassurance */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-slate-300 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <span>{t('value.delivery')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{t('value.authentic')}</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Display */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-3xl opacity-30 blur-2xl animate-pulse"></div>
              <div className="relative bg-white/[0.05] border border-white/20 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl text-start">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">{t('home.bookOfTheWeek')}</span>
                  </div>
                  <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-400/30">
                    {t('badge.popular')}
                  </span>
                </div>

                <div className="flex gap-4 items-center">
                  <img
                    src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800"
                    alt="The Sealed Nectar"
                    className="w-24 h-36 object-cover rounded-xl shadow-xl border border-white/15 flex-shrink-0"
                  />
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-indigo-400 font-bold uppercase">{t('category.seerah')}</span>
                    <h4 className="font-bold text-sm text-white line-clamp-2">Ar-Raheeq Al-Makhtum (The Sealed Nectar)</h4>
                    <p className="text-xs text-slate-400">{t('book.author')}: Safi-ur-Rahman</p>
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-indigo-300 font-extrabold text-base">{formatPrice(999)}</span>
                      <span className="text-slate-500 text-xs line-through">{formatPrice(1250)}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/books/ar-raheeq-al-makhtum-sealed-nectar"
                  className="mt-4 w-full bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md border border-white/20"
                >
                  <span>{t('action.viewDetails')}</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 mb-8 text-start">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">
              {t('home.curatedCatalog')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-heading text-white">
              {t('home.popularCategories')}
            </h2>
          </div>
          <Link
            to="/categories"
            className="text-xs sm:text-sm font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>{t('home.viewAllCategories')}</span>
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.slug}`}
              className="group bg-white/[0.04] hover:bg-white/[0.09] rounded-2xl border border-white/10 hover:border-white/25 p-4 flex flex-col items-center text-center shadow-[0_15px_35px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-300 overflow-hidden"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden mb-3 bg-white/5 border-2 border-white/15 group-hover:scale-110 transition-transform flex-shrink-0">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                {translateCategory(cat.name)}
              </h3>
              <span className="text-[10px] text-slate-400 mt-1">
                {cat.bookCount || 0} {t('home.booksCount')}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Books Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 mb-8 text-start">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">
              {t('home.handpicked')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-heading text-white">
              {t('home.featuredBooks')}
            </h2>
          </div>
          <Link
            to="/books?featured=true"
            className="text-xs sm:text-sm font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>{t('home.exploreFeatured')}</span>
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* 4. Special Promotional Coupons Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900/60 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 text-white shadow-[0_25px_60px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-white/15 text-start">
          <div className="space-y-3 max-w-xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase border border-amber-400/30">
              <Gift className="w-3.5 h-3.5" /> {t('promo.badge')}
            </div>
            <h3 className="text-2xl sm:text-4xl font-bold font-serif-heading leading-tight">
              {t('promo.title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t('promo.desc')}{' '}
              <span className="font-mono font-bold text-amber-300 bg-white/10 px-2 py-0.5 rounded border border-amber-300/40">
                HAQANYA10
              </span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 relative z-10">
            <Link
              to="/books"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg transition-transform transform hover:scale-105 text-center"
            >
              {t('promo.btn')}
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 mb-8 text-start">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">
              {t('home.mostLoved')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-heading text-white">
              {t('home.bestSellers')}
            </h2>
          </div>
          <Link
            to="/books?bestSeller=true"
            className="text-xs sm:text-sm font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>{t('home.viewAllBestSellers')}</span>
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* 6. Haqanya AI Assistant Interactive Feature Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white/[0.04] backdrop-blur-2xl text-white rounded-3xl p-8 sm:p-12 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> {t('ai.title')}
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif-heading leading-snug">
              {t('home.aiFeatureTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t('home.aiFeatureDesc')}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-xs bg-white/5 text-slate-300 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                “{t('ai.prompt1')}”
              </span>
              <span className="text-xs bg-white/5 text-slate-300 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                “{t('ai.prompt2')}”
              </span>
              <span className="text-xs bg-white/5 text-slate-300 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                “{t('ai.prompt3')}”
              </span>
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <button
              onClick={() => {
                const btn = document.getElementById('btn-toggle-ai-assistant');
                btn?.click();
              }}
              className="bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-950/50 flex items-center gap-2 transition-transform transform hover:scale-105 border border-white/20"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t('home.aiLaunchBtn')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 7. New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 mb-8 text-start">
          <div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">
              {t('home.freshEditions')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-heading text-white">
              {t('home.newArrivals')}
            </h2>
          </div>
          <Link
            to="/books?newArrival=true"
            className="text-xs sm:text-sm font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>{t('home.viewAllNewArrivals')}</span>
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* 8. Why Choose Maktaba Haqanya */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">
            {t('home.whyChooseUs')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-heading text-white">
            {t('home.whyReadersChoose')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-start">
          <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/10 p-6 space-y-3 hover:border-white/20 transition-all shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">{t('value.authentic')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('value.authenticDesc')}
            </p>
          </div>

          <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/10 p-6 space-y-3 hover:border-white/20 transition-all shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">{t('value.delivery')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('value.deliveryDesc')}
            </p>
          </div>

          <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/10 p-6 space-y-3 hover:border-white/20 transition-all shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">{t('value.returns')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('value.returnsDesc')}
            </p>
          </div>
        </div>
      </section>

      {/* 9. Customer Testimonials */}
      <section className="bg-white/[0.02] backdrop-blur-xl py-16 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">
              {t('home.reviewsHeading')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-heading text-white">
              {t('home.reviewsTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
            <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.4)] space-y-3">
              <div className="flex text-amber-400 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                “{t('home.review1')}”
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-600 text-white font-bold text-xs flex items-center justify-center border border-white/20">
                  ZH
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Zahid Hussain</h4>
                  <span className="text-[10px] text-slate-400">Islamabad</span>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.4)] space-y-3">
              <div className="flex text-amber-400 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                “{t('home.review2')}”
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-600 text-white font-bold text-xs flex items-center justify-center border border-white/20">
                  BQ
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Dr. Bilal Qureshi</h4>
                  <span className="text-[10px] text-slate-400">Lahore</span>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.4)] space-y-3">
              <div className="flex text-amber-400 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                “{t('home.review3')}”
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-600 text-white font-bold text-xs flex items-center justify-center border border-white/20">
                  MN
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Maryam Noor</h4>
                  <span className="text-[10px] text-slate-400">Karachi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Store Location & Urdu Bazaar Map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white/[0.04] backdrop-blur-2xl rounded-3xl border border-white/15 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] grid grid-cols-1 lg:grid-cols-12 text-start">
          <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">
                {t('home.visitStore')}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-serif-heading text-white mb-4">
                {t('footer.storeLocation')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                {t('home.visitStoreDesc')}
              </p>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span>{t('footer.storeAddress')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>{t('footer.timing')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>+92 42 37234567 | WhatsApp: +92 300 8492011</span>
                </div>
              </div>
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white text-xs font-bold py-3 px-5 rounded-xl transition-all self-start shadow-md border border-white/20"
            >
              <span>{t('home.contactInfoBtn')}</span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>

          <div className="lg:col-span-7 bg-white/5 min-h-[300px]">
            <iframe
              src="https://maps.google.com/maps?q=Urdu+Bazaar+Lahore&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ minHeight: '340px', border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              title="Maktaba Haqanya Urdu Bazaar Location"
            ></iframe>
          </div>
        </div>
      </section>

      {/* 11. Newsletter Subscription */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-indigo-950/70 via-purple-950/50 to-slate-900/70 backdrop-blur-2xl text-white rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/15 space-y-4">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block">
            {t('home.newsletterSubtitle')}
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold font-serif-heading">
            {t('home.newsletterTitle')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            {t('home.newsletterDesc')}
          </p>

          {newsletterSubscribed ? (
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold px-4 py-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{t('home.newsletterSuccess')}</span>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newsletterEmail) setNewsletterSubscribed(true);
              }}
              className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={t('home.newsletterPlaceholder')}
                className="flex-1 bg-white/10 border border-white/15 text-white placeholder-slate-400 text-xs sm:text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-start"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md border border-white/20"
              >
                {t('home.newsletterBtn')}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
