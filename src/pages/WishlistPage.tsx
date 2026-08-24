import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Book } from '../types';
import { BookCard } from '../components/books/BookCard';
import { Heart, ShoppingBag, ArrowRight, ArrowLeft, Trash2 } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlistIds, removeFromWishlist } = useWishlist();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    const fetchWishlistBooks = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/books?limit=50');
        const data = await res.json();
        if (data.success && data.data.books) {
          const matched = data.data.books.filter((b: Book) => wishlistIds.includes(b.id));
          setBooks(matched);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistBooks();
  }, [wishlistIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif-heading text-slate-900 flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-600 fill-rose-600" />
          <span>{t('wishlist.title')} ({wishlistIds.length} {isRTL ? 'کتب' : 'Saved'})</span>
        </h1>
        <p className="text-xs text-slate-500">
          {isRTL
            ? 'اپنی پسندیدہ اسلامی و اردو کتب محفوظ کریں تاکہ بوقتِ ضرورت فوری خرید سکیں۔'
            : 'Keep track of Islamic and Urdu literature you intend to read'}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-xs text-slate-400">
          {isRTL ? 'پسندیدہ کتب لوڈ ہو رہی ہیں...' : 'Loading wishlist...'}
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-lg mx-auto">
          <Heart className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">{t('wishlist.empty')}</h3>
          <p className="text-xs text-slate-500">
            {t('wishlist.emptyDesc')}
          </p>
          <Link
            to="/books"
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors"
          >
            <span>{t('wishlist.browse')}</span>
            {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </Link>
        </div>
      )}
    </div>
  );
};

