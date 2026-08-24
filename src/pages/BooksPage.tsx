import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Book, Category } from '../types';
import { BookCard } from '../components/books/BookCard';
import { useLanguage } from '../context/LanguageContext';
import {
  Filter,
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  LayoutGrid,
  List,
  Sparkles,
  BookOpen,
  ArrowUpDown
} from 'lucide-react';

export const BooksPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const { t, formatPrice, translateCategory, isRTL } = useLanguage();

  // Filters state from URL query
  const querySearch = searchParams.get('search') || '';
  const queryCategory = searchParams.get('category') || '';
  const queryLanguage = searchParams.get('language') || '';
  const queryMinPrice = searchParams.get('minPrice') || '';
  const queryMaxPrice = searchParams.get('maxPrice') || '';
  const queryInStock = searchParams.get('inStock') === 'true';
  const querySort = searchParams.get('sort') || 'featured';
  const queryPage = parseInt(searchParams.get('page') || '1', 10);
  const queryFeatured = searchParams.get('featured') === 'true';
  const queryBestSeller = searchParams.get('bestSeller') === 'true';
  const queryNewArrival = searchParams.get('newArrival') === 'true';

  // Fetch categories once
  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) setCategories(data.data);
      })
      .catch(console.error);
  }, []);

  // Fetch books whenever searchParams change
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(searchParams);
        params.set('limit', '12');
        const res = await fetch(`/api/books?${params.toString()}`);
        const data = await res.json();
        if (data.success && data.data) {
          setBooks(data.data.books || []);
          setTotalCount(data.data.pagination.total);
          setTotalPages(data.data.pagination.pages);
        }
      } catch (err) {
        console.error('Failed to load books catalog', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchParams]);

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value === null || value === '' || value === 'all') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    next.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(next);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters =
    querySearch ||
    queryCategory ||
    queryLanguage ||
    queryMinPrice ||
    queryMaxPrice ||
    queryInStock ||
    queryFeatured ||
    queryBestSeller ||
    queryNewArrival;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Header */}
      <div className="bg-white/[0.04] backdrop-blur-2xl text-white rounded-3xl p-6 sm:p-10 mb-8 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/15">
        <div className="max-w-2xl space-y-2 relative z-10">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">
            {t('brand.name')} • {t('nav.books')}
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold font-serif-heading">
            {queryCategory ? `${translateCategory(queryCategory)}` : t('nav.browseCategories')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {isRTL
              ? 'مستند اسلامی کتب، تفاسیر، احادیث، سیرت، اردو ادب، شاعری اور مقابلے کے امتحانات کی تمام کتب اردو بازار لاہور سے براہِ راست حاصل کریں۔'
              : 'Browse authentic Islamic publications, Urdu poetry and fiction, translations, and competitive exam guides with real-time warehouse stock in PKR.'}
          </p>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 bg-white/[0.04] backdrop-blur-2xl rounded-3xl border border-white/10 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-400" /> {t('action.filter')}
            </h3>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-fuchsia-400 hover:text-fuchsia-300 font-semibold"
              >
                {t('action.clearAll')}
              </button>
            )}
          </div>

          {/* Search filter inside sidebar */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              {t('nav.searchPlaceholder')}
            </label>
            <div className="relative">
              <input
                type="text"
                value={querySearch}
                onChange={(e) => updateParam('search', e.target.value)}
                placeholder={isRTL ? 'کتاب کا نام، مصنف، موضوع...' : 'Title, author, ISBN...'}
                className={`w-full bg-white/5 border border-white/15 text-white placeholder-slate-400 text-xs rounded-xl ${
                  isRTL ? 'pr-8 pl-3' : 'pl-8 pr-3'
                } py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 backdrop-blur-md`}
              />
              <Search className={`w-3.5 h-3.5 text-slate-400 absolute top-2.5 ${isRTL ? 'right-2.5' : 'left-2.5'}`} />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              {t('nav.categories')}
            </label>
            <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
              <button
                onClick={() => updateParam('category', null)}
                className={`w-full ${isRTL ? 'text-right' : 'text-left'} text-xs px-2.5 py-1.5 rounded-xl transition-colors flex items-center justify-between ${
                  !queryCategory
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{isRTL ? 'تمام موضوعات' : 'All Categories'}</span>
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => updateParam('category', c.name)}
                  className={`w-full ${isRTL ? 'text-right' : 'text-left'} text-xs px-2.5 py-1.5 rounded-xl transition-colors flex items-center justify-between ${
                    queryCategory === c.name
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">{translateCategory(c.name)}</span>
                  {c.bookCount !== undefined && (
                    <span className="text-[10px] text-slate-500">({c.bookCount})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              {t('book.language')}
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {['Urdu', 'English', 'Arabic', 'Persian'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => updateParam('language', queryLanguage === lang ? null : lang)}
                  className={`text-xs px-2.5 py-1.5 rounded-xl border transition-all text-center ${
                    queryLanguage === lang
                      ? 'bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-white border-white/20 font-bold shadow-md'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {lang === 'Urdu' ? (isRTL ? 'اردو' : 'Urdu') :
                   lang === 'English' ? (isRTL ? 'انگریزی' : 'English') :
                   lang === 'Arabic' ? (isRTL ? 'عربی' : 'Arabic') :
                   (isRTL ? 'فارسی' : 'Persian')}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              {isRTL ? 'قیمت (روپے)' : 'Price in PKR'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder={isRTL ? 'کم از کم' : 'Min'}
                value={queryMinPrice}
                onChange={(e) => updateParam('minPrice', e.target.value)}
                className="w-full bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs rounded-xl px-2.5 py-1.5 backdrop-blur-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <span className="text-slate-400 text-xs">-</span>
              <input
                type="number"
                placeholder={isRTL ? 'زیادہ سے زیادہ' : 'Max'}
                value={queryMaxPrice}
                onChange={(e) => updateParam('maxPrice', e.target.value)}
                className="w-full bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs rounded-xl px-2.5 py-1.5 backdrop-blur-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Stock Filter */}
          <div className="pt-2 border-t border-white/10">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={queryInStock}
                onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : null)}
                className="rounded border-white/20 bg-white/5 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-xs font-semibold text-slate-300">
                {isRTL ? 'صرف دستیاب کتب' : 'In Stock Books Only'}
              </span>
            </label>
          </div>
        </aside>

        {/* Catalog Main Content */}
        <main className="lg:col-span-9 space-y-6">
          {/* Top Sort & Summary Bar */}
          <div className="bg-white/[0.04] backdrop-blur-2xl rounded-2xl border border-white/10 p-4 shadow-[0_15px_35px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 w-full sm:w-auto">
              {isRTL ? (
                <>کل <span className="font-bold text-white">{totalCount}</span> میں سے <span className="font-bold text-white">{books.length}</span> کتب ظاہر ہیں</>
              ) : (
                <>Showing <span className="font-bold text-white">{books.length}</span> of <span className="font-bold text-white">{totalCount}</span> books</>
              )}
            </div>

            {/* Mobile Filter Button */}
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 bg-white/10 text-white text-xs font-bold px-3 py-2 rounded-xl border border-white/15 backdrop-blur-md"
              >
                <Filter className="w-4 h-4" /> {t('action.filter')} {hasActiveFilters && `(${isRTL ? 'فعال' : 'Active'})`}
              </button>

              {/* Sort Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{t('action.sortBy')}:</span>
                <select
                  id="select-sort-books"
                  value={querySort}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="bg-[#0b0c1e] border border-white/15 text-xs font-semibold text-white rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="featured">{isRTL ? 'نمایاں کتب' : 'Featured First'}</option>
                  <option value="newest">{isRTL ? 'نئی اشاعتیں' : 'Newest Editions'}</option>
                  <option value="price-asc">{isRTL ? 'قیمت: کم سے زیادہ' : 'Price: Low to High'}</option>
                  <option value="price-desc">{isRTL ? 'قیمت: زیادہ سے کم' : 'Price: High to Low'}</option>
                  <option value="rating">{isRTL ? 'بہترین ریٹنگ' : 'Top Rated'}</option>
                  <option value="popular">{isRTL ? 'سب سے زیادہ فروخت' : 'Best Sellers'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400">{isRTL ? 'فعال فلٹرز:' : 'Active filters:'}</span>
              {queryCategory && (
                <span className="inline-flex items-center gap-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs px-2.5 py-0.5 rounded-full font-medium backdrop-blur-md">
                  {t('nav.categories')}: {translateCategory(queryCategory)}
                  <button onClick={() => updateParam('category', null)}><X className="w-3 h-3" /></button>
                </span>
              )}
              {queryLanguage && (
                <span className="inline-flex items-center gap-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs px-2.5 py-0.5 rounded-full font-medium backdrop-blur-md">
                  {t('book.language')}: {queryLanguage}
                  <button onClick={() => updateParam('language', null)}><X className="w-3 h-3" /></button>
                </span>
              )}
              {querySearch && (
                <span className="inline-flex items-center gap-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs px-2.5 py-0.5 rounded-full font-medium backdrop-blur-md">
                  {isRTL ? 'تلاش:' : 'Keyword:'} "{querySearch}"
                  <button onClick={() => updateParam('search', null)}><X className="w-3 h-3" /></button>
                </span>
              )}
              {queryInStock && (
                <span className="inline-flex items-center gap-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs px-2.5 py-0.5 rounded-full font-medium backdrop-blur-md">
                  {isRTL ? 'صرف دستیاب کتب' : 'In Stock Only'}
                  <button onClick={() => updateParam('inStock', null)}><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>
          )}

          {/* Books Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/10 p-4 h-80 animate-pulse flex flex-col justify-between">
                  <div className="bg-white/5 h-44 rounded-xl mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-white/5 rounded w-3/4"></div>
                    <div className="h-3 bg-white/5 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="bg-white/[0.04] backdrop-blur-2xl rounded-2xl border border-white/10 p-12 text-center space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-slate-400 mx-auto flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">
                {isRTL ? 'کوئی کتاب دستیاب نہیں ملی' : 'No books match your criteria'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {isRTL
                  ? 'براہ کرم فلٹرز تبدیل کر کے یا تلاش کے الفاظ تبدیل کر کے دوبارہ کوشش کریں۔'
                  : 'Try clearing active filters or searching for alternative Islamic or Urdu keywords.'}
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md border border-white/20"
              >
                {t('action.clearAll')}
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={queryPage <= 1}
                onClick={() => updateParam('page', String(queryPage - 1))}
                className="px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs font-semibold text-slate-300 disabled:opacity-30 hover:bg-white/10 hover:text-white backdrop-blur-md transition-colors"
              >
                {isRTL ? 'پچھلا' : 'Previous'}
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => updateParam('page', String(i + 1))}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                    queryPage === i + 1
                      ? 'bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-white border border-white/20 shadow-md'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white backdrop-blur-md'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={queryPage >= totalPages}
                onClick={() => updateParam('page', String(queryPage + 1))}
                className="px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs font-semibold text-slate-300 disabled:opacity-30 hover:bg-white/10 hover:text-white backdrop-blur-md transition-colors"
              >
                {isRTL ? 'اگلا' : 'Next'}
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xl flex justify-end">
          <div className="w-full max-w-xs bg-[#0c0d22]/95 border-l border-white/15 h-full p-6 space-y-6 overflow-y-auto backdrop-blur-3xl animate-in slide-in-from-right">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-bold text-base text-white">{t('action.filter')}</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase">{t('nav.categories')}</label>
              <div className="space-y-1">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      updateParam('category', c.name);
                      setMobileFilterOpen(false);
                    }}
                    className={`block w-full ${isRTL ? 'text-right' : 'text-left'} text-xs py-1.5 text-slate-400 hover:text-indigo-300`}
                  >
                    {translateCategory(c.name)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                handleClearFilters();
                setMobileFilterOpen(false);
              }}
              className="w-full bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-white font-bold text-xs py-2.5 rounded-xl border border-white/20 shadow-md"
            >
              {t('action.clearAll')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

