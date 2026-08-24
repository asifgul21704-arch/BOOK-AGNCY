import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Book, Category } from '../types';
import { BookCard } from '../components/books/BookCard';
import { useLanguage } from '../context/LanguageContext';
import { ChevronRight, ChevronLeft, ArrowLeft, BookOpen } from 'lucide-react';

export const CategoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, translateCategory, isRTL } = useLanguage();

  useEffect(() => {
    const fetchCategoryAndBooks = async () => {
      setLoading(true);
      try {
        // Fetch category info & books by category
        const catsRes = await fetch('/api/categories');
        const catsData = await catsRes.json();
        if (catsData.success && catsData.data) {
          const matched = catsData.data.find((c: Category) => c.slug === slug);
          setCategory(matched || null);

          if (matched) {
            const booksRes = await fetch(`/api/books?category=${encodeURIComponent(matched.name)}&limit=50`);
            const booksData = await booksRes.json();
            if (booksData.success && booksData.data.books) {
              setBooks(booksData.data.books);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load category books', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryAndBooks();
      window.scrollTo(0, 0);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-slate-500 font-medium">
          {isRTL ? 'کتب لوڈ ہو رہی ہیں...' : 'Loading category collection...'}
        </p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">{isRTL ? 'موضوع نہیں ملا' : 'Category Not Found'}</h2>
        <p className="text-sm text-slate-500">
          {isRTL ? 'مطلوبہ موضوع ہمارے کیٹلاگ میں موجود نہیں ہے۔' : 'The requested category does not exist in our store catalog.'}
        </p>
        <Link to="/categories" className="inline-block bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl">
          {t('nav.browseCategories')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-emerald-700">{t('nav.home')}</Link>
        {isRTL ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        <Link to="/categories" className="hover:text-emerald-700">{t('nav.categories')}</Link>
        {isRTL ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        <span className="text-slate-800 font-semibold">{translateCategory(category.name)}</span>
      </nav>

      {/* Category Header */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 sm:p-12 shadow-xl border border-slate-800">
        <div className="absolute inset-0 opacity-20">
          <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
            {t('brand.name')}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif-heading">
            {translateCategory(category.name)}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {category.description}
          </p>
          <div className="pt-2 text-xs text-emerald-300 font-semibold">
            {books.length} {isRTL ? 'کتب گودام میں دستیاب ہیں' : 'Books Available in Stock'}
          </div>
        </div>
      </div>

      {/* Books Grid */}
      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            {isRTL ? 'اس موضوع میں فی الحال کوئی کتاب موجود نہیں' : 'No books found in this category'}
          </h3>
          <p className="text-xs text-slate-500">
            {isRTL
              ? 'ہمارے اردو بازار گودام میں نئی کتابیں جلد ہی شامل کی جائیں گی۔'
              : 'Check back soon as new editions arrive weekly at our Lahore store.'}
          </p>
        </div>
      )}
    </div>
  );
};

