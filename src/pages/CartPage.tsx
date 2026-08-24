import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
  Tag,
  X,
  Sparkles
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    items,
    totalItems,
    subtotal,
    discount,
    deliveryFee,
    total,
    freeShippingThreshold,
    freeShippingRemaining,
    coupon,
    couponCode,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const { t, formatPrice, translateCategory, isRTL } = useLanguage();
  const [inputCoupon, setInputCoupon] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;

    setCouponLoading(true);
    setCouponMessage(null);
    const res = await applyCoupon(inputCoupon);
    setCouponLoading(false);
    if (!res.success) {
      setCouponMessage({ text: res.message, isError: true });
    } else {
      setCouponMessage({ text: res.message, isError: false });
      setInputCoupon('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-serif-heading text-white">{t('cart.emptyTitle')}</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
            {t('cart.emptySubtitle')}
          </p>
        </div>
        <Link
          to="/books"
          id="btn-empty-cart-browse"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg border border-white/20 transition-all"
        >
          <span>{t('cart.continueShopping')}</span>
          <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
        </Link>
      </div>
    );
  }

  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 text-start">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-heading text-white">{t('cart.title')}</h1>
          <p className="text-xs text-slate-400">{t('cart.emptySubtitle')}</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-400 hover:text-rose-300 hover:underline font-semibold"
        >
          {t('cart.clear')}
        </button>
      </div>

      {/* Free Delivery Banner / Progress Bar */}
      <div className="bg-white/[0.04] border border-emerald-500/30 rounded-2xl p-4 sm:p-5 space-y-2 backdrop-blur-xl">
        <div className="flex items-center justify-between text-xs font-semibold text-emerald-300">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            {freeShippingRemaining > 0 ? (
              <span>
                {t('cart.freeDeliveryProgress')} <strong className="text-amber-300">{formatPrice(freeShippingRemaining)}</strong>
              </span>
            ) : (
              <span className="text-emerald-300 font-bold flex items-center gap-1">
                🎉 {t('cart.freeDeliveryUnlocked')}
              </span>
            )}
          </div>
          <span>{freeShippingProgress}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${freeShippingProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Cart Layout: Items (Left) & Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map(({ book, quantity }) => {
            const unitPrice = book.discountPrice || book.price;
            const itemTotal = unitPrice * quantity;

            return (
              <div
                key={book.id}
                className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_15px_35px_rgba(0,0,0,0.4)]"
              >
                {/* Book Thumbnail and Info */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <Link to={`/books/${book.slug || book.id}`} className="flex-shrink-0">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-16 h-22 object-cover rounded-md shadow-md border border-white/15"
                    />
                  </Link>

                  <div className="space-y-1 min-w-0 flex-1 text-start">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">{translateCategory(book.category)}</span>
                    <Link
                      to={`/books/${book.slug || book.id}`}
                      className="text-xs sm:text-sm font-bold text-white hover:text-indigo-300 block truncate"
                    >
                      {book.title}
                    </Link>
                    <p className="text-[11px] text-slate-400">{t('book.author')}: {book.author}</p>
                    <div className="flex items-center gap-2 pt-1 text-xs">
                      <span className="font-bold text-indigo-300">{formatPrice(unitPrice)}</span>
                      {book.discountPrice && (
                        <span className="text-slate-500 line-through text-[11px]">{formatPrice(book.price)}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-white/15 rounded-lg overflow-hidden bg-white/5">
                    <button
                      onClick={() => updateQuantity(book.id, quantity - 1)}
                      className="p-1.5 text-slate-300 hover:bg-white/10"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-white min-w-[2rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(book.id, quantity + 1)}
                      disabled={quantity >= book.stock}
                      className="p-1.5 text-slate-300 hover:bg-white/10 disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Total item price */}
                  <div className="text-end min-w-[80px]">
                    <span className="text-sm font-black text-white block">
                      {formatPrice(itemTotal)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(book.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                    title={t('cart.remove')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="lg:col-span-4 bg-white/[0.04] backdrop-blur-2xl rounded-3xl border border-white/15 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-6 sticky top-24">
          <h3 className="font-bold text-base text-white border-b border-white/10 pb-3">
            {t('cart.orderSummary')} ({totalItems})
          </h3>

          {/* Coupon Code Section */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-400" /> {t('cart.coupon')}
            </label>

            {coupon ? (
              <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl">
                <div>
                  <span className="font-mono font-bold text-xs text-emerald-300 uppercase">{couponCode}</span>
                  <span className="text-[11px] text-emerald-400 block">
                    {coupon.type === 'percentage' ? `${coupon.value}% Off applied` : `${formatPrice(coupon.value)} Off applied`}
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="p-1 text-emerald-300 hover:text-rose-400"
                  title="Remove coupon"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                  placeholder="e.g. HAQANYA10"
                  className="flex-1 bg-white/5 border border-white/15 text-xs text-white placeholder-slate-400 rounded-xl px-3 py-2 uppercase font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={couponLoading || !inputCoupon.trim()}
                  className="bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors border border-white/10"
                >
                  {couponLoading ? '...' : t('cart.apply')}
                </button>
              </form>
            )}

            {couponMessage && (
              <p
                className={`text-[11px] font-medium ${
                  couponMessage.isError ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {couponMessage.text}
              </p>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3 text-xs text-slate-300 pt-3 border-t border-white/10">
            <div className="flex justify-between">
              <span>{t('cart.subtotal')}:</span>
              <span className="font-bold text-white">{formatPrice(subtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>{t('cart.discount')}:</span>
                <span>- {formatPrice(discount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>{t('cart.deliveryFee')}:</span>
              <span>{deliveryFee === 0 ? <strong className="text-emerald-400 uppercase font-bold">{t('cart.freeDelivery')}</strong> : formatPrice(deliveryFee)}</span>
            </div>

            <div className="flex justify-between text-sm sm:text-base font-black text-white pt-3 border-t border-white/10">
              <span>{t('cart.total')}:</span>
              <span className="text-indigo-300 font-extrabold">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            id="btn-proceed-checkout"
            onClick={() => navigate('/checkout')}
            className="w-full bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50 transition-all border border-white/20"
          >
            <span>{t('cart.checkout')}</span>
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </button>

          <Link
            to="/books"
            className="block text-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
          >
            {t('cart.continueShopping')}
          </Link>
        </div>
      </div>
    </div>
  );
};
