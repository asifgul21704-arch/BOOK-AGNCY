import React, { useState } from 'react';
import { Book } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useLanguage } from '../../context/LanguageContext';
import { Star, ShoppingCart, Heart, Eye, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BookQuickViewModal } from './BookQuickViewModal';

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { t, formatPrice, translateCategory, isRTL } = useLanguage();

  const currentPrice = book.discountPrice || book.price;
  const hasDiscount = book.discountPrice && book.discountPrice < book.price;
  const discountPercent = hasDiscount ? Math.round(((book.price - book.discountPrice!) / book.price) * 100) : 0;
  const inWish = isInWishlist(book.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (book.stock <= 0) return;

    setIsAdding(true);
    addToCart(book, 1);
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(book);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  return (
    <>
      <div
        id={`card-book-${book.id}`}
        className="group relative bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/25 shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.6)] transition-all duration-300 flex flex-col justify-between overflow-hidden"
      >
        {/* Top Cover Image Area */}
        <div className="relative bg-white/[0.02] p-5 flex items-center justify-center min-h-[230px] overflow-hidden border-b border-white/5">
          {/* Discount Badge */}
          {hasDiscount && (
            <span className={`absolute top-3 z-10 bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-md border border-white/20 ${
              isRTL ? 'right-3' : 'left-3'
            }`}>
              -{discountPercent}% {t('badge.discount')}
            </span>
          )}

          {/* Language Tag */}
          <span className={`absolute top-3 z-10 bg-white/10 backdrop-blur-md text-slate-200 border border-white/15 text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-xs ${
            isRTL ? 'left-3' : 'right-3'
          }`}>
            {book.language}
          </span>

          {/* Book Image with Link */}
          <Link to={`/books/${book.slug || book.id}`} className="relative block">
            <img
              src={book.coverImage}
              alt={book.title}
              loading="lazy"
              className="h-44 w-32 object-cover rounded-lg shadow-xl group-hover:scale-105 transition-transform duration-300 border border-white/10"
            />
          </Link>

          {/* Floating Hover Action Buttons */}
          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              id={`btn-quickview-${book.id}`}
              onClick={handleQuickView}
              className="bg-[#0a0a1f]/90 hover:bg-indigo-600 text-white p-2 rounded-full shadow-lg text-xs font-semibold flex items-center gap-1 backdrop-blur-md border border-white/20 transition-colors"
              title={t('action.quickView')}
            >
              <Eye className="w-4 h-4" />
              <span className="text-[11px] px-1">{t('action.quickView')}</span>
            </button>
            <button
              id={`btn-wishlist-${book.id}`}
              onClick={handleToggleWishlist}
              className={`p-2 rounded-full shadow-lg backdrop-blur-md border transition-colors ${
                inWish
                  ? 'bg-fuchsia-600/30 text-fuchsia-300 border-fuchsia-500/40'
                  : 'bg-[#0a0a1f]/90 text-slate-300 hover:text-fuchsia-400 border-white/20'
              }`}
              title={inWish ? t('nav.wishlist') : t('nav.wishlist')}
            >
              <Heart className={`w-4 h-4 ${inWish ? 'fill-fuchsia-400 text-fuchsia-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Book Details Info */}
        <div className="p-4 flex flex-col flex-1 justify-between text-start">
          <div>
            <span className="text-[11px] font-semibold text-indigo-400 block mb-1 uppercase tracking-wider line-clamp-1">
              {translateCategory(book.category)}
            </span>

            <Link
              to={`/books/${book.slug || book.id}`}
              className="text-sm sm:text-base font-bold text-white hover:text-indigo-300 transition-colors line-clamp-2 leading-snug mb-1"
              title={book.title}
            >
              {book.title}
            </Link>

            <p className="text-xs text-slate-400 mb-2 line-clamp-1">
              {t('book.author')}: <span className="text-slate-200 font-medium">{book.author}</span>
            </p>

            {/* Rating Stars */}
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(book.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-200">{book.rating}</span>
              <span className="text-[10px] text-slate-400">({book.reviewCount})</span>
            </div>
          </div>

          {/* Price and Cart Button */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between mt-1">
            <div>
              <div className="text-base sm:text-lg font-extrabold text-white">
                {formatPrice(currentPrice)}
              </div>
              {hasDiscount && (
                <div className="text-xs text-slate-400 line-through">
                  {formatPrice(book.price)}
                </div>
              )}
            </div>

            <button
              id={`btn-add-to-cart-${book.id}`}
              onClick={handleAddToCart}
              disabled={book.stock <= 0}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md border ${
                book.stock <= 0
                  ? 'bg-white/5 border-white/10 text-slate-500 cursor-not-allowed'
                  : isAdding
                  ? 'bg-emerald-600 text-white border-emerald-400/40'
                  : 'bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white border-white/20'
              }`}
            >
              {isAdding ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('action.added')}</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">{book.stock > 0 ? t('action.addToCart') : t('action.outOfStock')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {showQuickView && (
        <BookQuickViewModal book={book} onClose={() => setShowQuickView(false)} />
      )}
    </>
  );
};
