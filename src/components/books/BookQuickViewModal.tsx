import React, { useState } from 'react';
import { Book } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, Star, ShoppingCart, Heart, Check, BookOpen, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BookQuickViewModalProps {
  book: Book | null;
  onClose: () => void;
}

export const BookQuickViewModal: React.FC<BookQuickViewModalProps> = ({ book, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { t, formatPrice, translateCategory, isRTL } = useLanguage();

  if (!book) return null;

  const currentPrice = book.discountPrice || book.price;
  const hasDiscount = book.discountPrice && book.discountPrice < book.price;
  const discountPercent = hasDiscount ? Math.round(((book.price - book.discountPrice!) / book.price) * 100) : 0;
  const inWish = isInWishlist(book.id);

  const handleAddToCart = () => {
    addToCart(book, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="bg-[#0b0c1e]/90 backdrop-blur-3xl rounded-3xl max-w-3xl w-full overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] border border-white/15 flex flex-col md:flex-row relative max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="btn-close-quickview"
          onClick={onClose}
          className={`absolute top-4 z-10 p-2 rounded-full bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition-colors backdrop-blur-md border border-white/10 ${
            isRTL ? 'left-4' : 'right-4'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Book Cover Image */}
        <div className="md:w-5/12 bg-white/[0.02] p-8 flex items-center justify-center relative overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
          {hasDiscount && (
            <span className={`absolute top-4 bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md border border-white/20 ${
              isRTL ? 'right-4' : 'left-4'
            }`}>
              -{discountPercent}% {t('badge.discount')}
            </span>
          )}
          <img
            src={book.coverImage}
            alt={book.title}
            className="max-h-72 object-contain rounded-xl shadow-2xl hover:scale-105 transition-transform duration-300 border border-white/10"
          />
        </div>

        {/* Details Content */}
        <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto text-start">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
              <span>{translateCategory(book.category)}</span>
              <span>•</span>
              <span className="bg-white/10 px-2 py-0.5 rounded text-slate-200 border border-white/10">{book.language}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-1">{book.title}</h2>
            <p className="text-sm text-slate-400 mb-3">
              {t('book.author')}: <span className="font-medium text-slate-200">{book.author}</span> | {t('book.publisher')}: {book.publisher}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(book.rating) ? 'fill-amber-400' : 'text-slate-600'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-200">{book.rating}</span>
              <span className="text-xs text-slate-400">({book.reviewCount} {t('book.reviews')})</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-black text-white">{formatPrice(currentPrice)}</span>
              {hasDiscount && (
                <span className="text-base text-slate-400 line-through">{formatPrice(book.price)}</span>
              )}
              <span
                className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                  isRTL ? 'mr-auto' : 'ml-auto'
                } ${
                  book.stock > 0
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}
              >
                {book.stock > 0 ? `${book.stock} ${t('badge.inStock')}` : t('badge.outOfStock')}
              </span>
            </div>

            {/* Description Snippet */}
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 mb-5 leading-relaxed">
              {book.description}
            </p>

            {/* Meta attributes */}
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-white/[0.04] p-3.5 rounded-xl mb-5 border border-white/10 backdrop-blur-md">
              <div><span className="font-semibold text-slate-200">{t('book.pages')}:</span> {book.pages}</div>
              <div><span className="font-semibold text-slate-200">{t('book.isbn')}:</span> {book.isbn}</div>
              <div><span className="font-semibold text-slate-200">{t('book.binding')}:</span> {book.binding || 'Hardcover'}</div>
              <div><span className="font-semibold text-slate-200">{t('book.publicationYear')}:</span> {book.publicationYear || 2024}</div>
            </div>
          </div>

          {/* Action Row */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border border-white/15 rounded-xl overflow-hidden bg-white/5 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-slate-300 hover:bg-white/10 text-sm font-bold transition-colors"
                >
                  -
                </button>
                <span className="px-3 py-1.5 text-sm font-semibold text-white min-w-[2rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(book.stock, q + 1))}
                  className="px-3 py-1.5 text-slate-300 hover:bg-white/10 text-sm font-bold transition-colors"
                >
                  +
                </button>
              </div>

              <button
                id={`btn-quickview-add-cart-${book.id}`}
                onClick={handleAddToCart}
                disabled={book.stock <= 0}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 disabled:opacity-40 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all text-sm border border-white/20"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{book.stock > 0 ? t('action.addToCart') : t('action.outOfStock')}</span>
              </button>

              <button
                id={`btn-quickview-wishlist-${book.id}`}
                onClick={() => toggleWishlist(book)}
                className={`p-2.5 rounded-xl border backdrop-blur-md transition-colors ${
                  inWish
                    ? 'bg-fuchsia-600/30 border-fuchsia-500/40 text-fuchsia-300'
                    : 'bg-white/5 border-white/15 text-slate-300 hover:text-fuchsia-400'
                }`}
                title={t('nav.wishlist')}
              >
                <Heart className={`w-5 h-5 ${inWish ? 'fill-fuchsia-400 text-fuchsia-400' : ''}`} />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-indigo-400" /> {t('value.delivery')}
              </span>
              <Link
                to={`/books/${book.slug || book.id}`}
                onClick={onClose}
                className="font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                {t('action.viewDetails')} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
