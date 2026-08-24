import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Book, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { BookCard } from '../components/books/BookCard';
import {
  Star,
  ShoppingCart,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  Share2,
  ChevronRight,
  ChevronLeft,
  Plus,
  Send,
  MessageSquare
} from 'lucide-react';

export const BookDetailPage: React.FC = () => {
  const { slugOrId } = useParams<{ slugOrId: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [bundleBook, setBundleBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');

  // Review Form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success, error, info } = useToast();
  const { t, formatPrice, translateCategory, isRTL } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const loadBook = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/books/${slugOrId}`);
        const data = await res.json();
        if (data.success && data.data) {
          setBook(data.data.book);
          setRelatedBooks(data.data.relatedBooks || []);
          setReviews(data.data.reviews || []);
          setSelectedImage(data.data.book.coverImage);

          // Find a bundle book from related or fetch another
          if (data.data.relatedBooks && data.data.relatedBooks.length > 0) {
            setBundleBook(data.data.relatedBooks[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load book detail', err);
      } finally {
        setLoading(false);
      }
    };

    if (slugOrId) {
      loadBook();
      window.scrollTo(0, 0);
    }
  }, [slugOrId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-slate-500 font-medium">
          {isRTL ? 'کتاب کی تفصیلات لوڈ ہو رہی ہیں...' : 'Loading book details...'}
        </p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">
          {isRTL ? 'کتاب دستیاب نہیں' : 'Book Not Found'}
        </h2>
        <p className="text-sm text-slate-500">
          {isRTL ? 'مطلوبہ کتاب ہماری فہرست میں نہیں مل سکی۔' : 'The requested book could not be located in our catalog.'}
        </p>
        <Link to="/books" className="inline-block bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl">
          {isRTL ? 'کتب کے کیٹلاگ پر جائیں' : 'Return to Books Catalog'}
        </Link>
      </div>
    );
  }

  const currentPrice = book.discountPrice || book.price;
  const hasDiscount = book.discountPrice && book.discountPrice < book.price;
  const discountPercent = hasDiscount ? Math.round(((book.price - book.discountPrice!) / book.price) * 100) : 0;
  const inWish = isInWishlist(book.id);

  const handleBuyNow = () => {
    if (book.stock <= 0) return;
    addToCart(book, quantity);
    navigate('/checkout');
  };

  const handleAddBundle = () => {
    if (!bundleBook) return;
    addToCart(book, 1);
    addToCart(bundleBook, 1);
    success(
      isRTL
        ? `"${book.title}" اور "${bundleBook.title}" کا بنڈل کارٹ میں شامل ہو گیا!`
        : `Added "${book.title}" & "${bundleBook.title}" combo bundle to cart!`
    );
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    info(isRTL ? 'کتاب کا لنک کلپ بورڈ پر کاپی ہو گیا!' : 'Book link copied to clipboard!');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      error(isRTL ? 'براہ کرم اپنا نام اور رائے درج کریں۔' : 'Please fill in your name and comment.');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/books/${book.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: reviewName.trim(),
          rating: reviewRating,
          comment: reviewComment.trim()
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setReviews((prev) => [data.data, ...prev]);
        setReviewName('');
        setReviewComment('');
        success(isRTL ? 'جزاک اللہ خیراً! آپ کی رائے موصول ہو گئی ہے۔' : 'JazakAllah Khair! Your review has been submitted.');
      } else {
        error(data.message || (isRTL ? 'رائے درج نہیں ہو سکی۔' : 'Could not submit review.'));
      }
    } catch {
      error(isRTL ? 'رائے بھیجنے میں خرابی پیش آئی۔' : 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-emerald-700">{t('nav.home')}</Link>
        <ChevronIcon className="w-3 h-3 text-slate-400" />
        <Link to="/books" className="hover:text-emerald-700">{t('nav.books')}</Link>
        <ChevronIcon className="w-3 h-3 text-slate-400" />
        <Link to={`/category/${book.category.toLowerCase()}`} className="hover:text-emerald-700">
          {translateCategory(book.category)}
        </Link>
        <ChevronIcon className="w-3 h-3 text-slate-400" />
        <span className="text-slate-800 font-semibold truncate max-w-xs">{book.title}</span>
      </nav>

      {/* Main Product Hero */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Book Cover Image & Gallery */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-sm bg-slate-50 border border-slate-100 rounded-2xl p-8 flex items-center justify-center min-h-[380px] shadow-inner">
            {hasDiscount && (
              <span className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow-xs`}>
                {discountPercent}% {t('book.discount')}
              </span>
            )}
            <img
              src={selectedImage || book.coverImage}
              alt={book.title}
              className="max-h-80 object-contain rounded-lg shadow-xl hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Thumbnail Gallery */}
          {book.images && book.images.length > 1 && (
            <div className="flex items-center gap-3 mt-4 overflow-x-auto">
              {book.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-18 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === img ? 'border-emerald-600 ring-2 ring-emerald-200' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Book Details & Actions */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md">
                {translateCategory(book.category)}
              </span>
              <button
                onClick={handleShare}
                className="text-slate-500 hover:text-slate-800 text-xs flex items-center gap-1 p-1"
                title={t('book.share')}
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">{t('book.share')}</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif-heading text-slate-900 leading-tight">
              {book.title}
            </h1>

            <p className="text-sm text-slate-600">
              {t('book.author')}: <span className="font-semibold text-slate-800">{book.author}</span> | {t('book.publisher')}: <span className="text-slate-800">{book.publisher}</span>
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(book.rating) ? 'fill-amber-400' : 'text-slate-200'}`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-800">{book.rating}</span>
              <span className="text-xs text-slate-400">({book.reviewCount} {t('book.reviews')})</span>
            </div>

            {/* Price block */}
            <div className="flex items-baseline gap-4 py-3 border-y border-slate-100">
              <span className="text-3xl font-black text-emerald-800">
                {formatPrice(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-lg text-slate-400 line-through">
                  {formatPrice(book.price)}
                </span>
              )}
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isRTL ? 'mr-auto' : 'ml-auto'} ${
                  book.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {book.stock > 0 ? `${book.stock} ${t('book.inStock')}` : t('book.outOfStock')}
              </span>
            </div>

            {/* Specification Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block">{t('book.language')}:</span>
                <span className="font-bold text-slate-800">{book.language}</span>
              </div>
              <div>
                <span className="text-slate-400 block">{t('book.pages')}:</span>
                <span className="font-bold text-slate-800">{book.pages}</span>
              </div>
              <div>
                <span className="text-slate-400 block">{t('book.edition')}:</span>
                <span className="font-bold text-slate-800">{book.edition || (isRTL ? 'مجلد فخیم' : 'Hardcover')}</span>
              </div>
              <div>
                <span className="text-slate-400 block">{t('book.isbn')}:</span>
                <span className="font-mono text-slate-800">{book.isbn}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-bold text-slate-800 text-sm min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(book.stock, q + 1))}
                    className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  id="btn-book-detail-add-cart"
                  onClick={() => addToCart(book, quantity)}
                  disabled={book.stock <= 0}
                  className="flex-1 min-w-[150px] bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{book.stock > 0 ? t('book.addToCart') : t('book.outOfStock')}</span>
                </button>

                {/* Buy Now */}
                <button
                  id="btn-book-detail-buy-now"
                  onClick={handleBuyNow}
                  disabled={book.stock <= 0}
                  className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold py-3 px-6 rounded-xl transition-all text-sm"
                >
                  {t('book.buyNow')}
                </button>

                {/* Wishlist */}
                <button
                  id="btn-book-detail-wishlist"
                  onClick={() => toggleWishlist(book)}
                  className={`p-3 rounded-xl border transition-colors ${
                    inWish
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-rose-600'
                  }`}
                  title={inWish ? t('book.inWishlist') : t('book.addToWishlist')}
                >
                  <Heart className={`w-5 h-5 ${inWish ? 'fill-rose-600' : ''}`} />
                </button>
              </div>

              {/* Delivery info bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{t('book.deliveryNote')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{t('book.authenticGuarantee')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{t('book.returnPolicy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{t('book.freeShippingNote')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Book Synopsis & Description */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
        <h3 className="text-xl font-bold font-serif-heading text-slate-900 border-b border-slate-100 pb-3">
          {t('book.description')}
        </h3>
        <div className="text-sm text-slate-700 leading-relaxed space-y-4 max-w-4xl">
          <p>{book.description}</p>
          <div className="flex flex-wrap gap-2 pt-2">
            {book.tags?.map((t, idx) => (
              <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                #{t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Frequently Bought Together Bundle */}
      {bundleBook && (
        <div className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-emerald-900">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              {isRTL ? 'اکثر خریداروں کی پسندیدہ کتب کا مجموعہ (بنڈل)' : 'Frequently Bought Together Bundle'}
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img src={book.coverImage} alt={book.title} className="w-16 h-22 object-cover rounded shadow-md" />
              <Plus className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <img src={bundleBook.coverImage} alt={bundleBook.title} className="w-16 h-22 object-cover rounded shadow-md" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-slate-200">{book.title} + {bundleBook.title}</p>
                <p className="text-emerald-300 font-extrabold text-sm">
                  {isRTL ? 'مجموعی قیمت:' : 'Combined Total:'} {formatPrice((book.discountPrice || book.price) + (bundleBook.discountPrice || bundleBook.price))}
                </p>
              </div>
            </div>

            <button
              id="btn-add-bundle-cart"
              onClick={handleAddBundle}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-colors shadow-md flex-shrink-0"
            >
              {isRTL ? 'دونوں کتب کارٹ میں شامل کریں' : 'Add Both to Cart'}
            </button>
          </div>
        </div>
      )}

      {/* Verified Reviews Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-bold font-serif-heading text-slate-900">
              {t('book.reviews')} ({reviews.length})
            </h3>
            <p className="text-xs text-slate-500">
              {isRTL ? 'مکتبہ حقانیہ کے قارئین کی تصدیق شدہ آراء' : 'Verified reader feedback on Maktaba Haqanya'}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(book.rating) ? 'fill-amber-400' : 'text-slate-200'}`}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-slate-900">{book.rating} / 5</span>
          </div>
        </div>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{rev.userName}</span>
                    {rev.verifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                        <CheckCircle2 className="w-3 h-3" /> {isRTL ? 'تصدیق شدہ خریدار' : 'Verified Purchase'}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-200'}`}
                    />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{rev.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 italic">
              {isRTL ? 'اس کتاب پر ابھی کوئی تبصرہ موجود نہیں۔ آپ پہلے قاری بنیں اور اپنی رائے دیں۔' : 'No reviews yet for this edition. Be the first to share your thoughts!'}
            </p>
          )}
        </div>

        {/* Write a Review Form */}
        <div className="pt-6 border-t border-slate-100">
          <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-700" /> {t('book.writeReview')} - "{book.title}"
          </h4>
          <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-xl">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">{t('checkout.fullName')}</label>
              <input
                type="text"
                required
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                placeholder={isRTL ? 'مثلاً: محمد احمد' : 'e.g. Muhammad Ali'}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">{t('book.rating')}</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-amber-400' : 'text-slate-200'}`} />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 ml-2">{reviewRating} {isRTL ? 'ستارے' : 'Stars'}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">{t('book.writeReview')}</label>
              <textarea
                required
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder={isRTL ? 'کتاب کے معیار، طباعت، جلد بندی یا علمی مواد کے بارے میں اپنی رائے درج کریں...' : "Share your thoughts about the book's quality, paper, binding, or content..."}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              ></textarea>
            </div>

            <button
              id="btn-submit-review"
              type="submit"
              disabled={submittingReview}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submittingReview ? (isRTL ? 'ارسال ہو رہا ہے...' : 'Submitting...') : t('book.submitReview')}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Related Books Recommendations */}
      {relatedBooks.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-bold font-serif-heading text-slate-900">
              {t('home.featuredBooks')}
            </h3>
            <Link to={`/category/${book.category.toLowerCase()}`} className="text-xs font-bold text-emerald-700 hover:underline">
              {isRTL ? `${translateCategory(book.category)} میں مزید کتب دیکھیں` : `View more in ${book.category}`} &larr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedBooks.map((relBook) => (
              <BookCard key={relBook.id} book={relBook} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

