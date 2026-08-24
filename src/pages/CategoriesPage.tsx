import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, translateCategory, isRTL } = useLanguage();

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          setCategories(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-slate-800 shadow-xl">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
            {t('brand.name')} • {t('nav.categories')}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif-heading">
            {t('nav.browseCategories')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {isRTL
              ? 'قرآن کریم کے تفاسیر و تراجم، کتب احادیث اور سیرت النبی ﷺ سے لے کر کلاسیکی اردو ادب، شاعری اور مقابلے کے امتحانات کی تمام کتب۔'
              : 'From monumental Quran translations and Hadith compendiums to timeless Urdu prose, poetry, and academic books.'}
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 h-64 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-500 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="h-44 overflow-hidden relative bg-slate-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
                    {cat.bookCount || 0} {isRTL ? 'کتب دستیاب' : 'Titles Available'}
                  </span>
                  <h3 className="text-lg font-bold text-white font-serif-heading">
                    {translateCategory(cat.name)}
                  </h3>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>

                <div className="flex items-center justify-between text-xs font-bold text-emerald-700 pt-3 border-t border-slate-100 group-hover:text-emerald-800">
                  <span>{isRTL ? 'مجموعہ کتب دیکھیں' : 'Explore Collection'}</span>
                  {isRTL ? (
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

