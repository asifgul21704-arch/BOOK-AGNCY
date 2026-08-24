import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Truck,
  ShieldCheck,
  CreditCard,
  Banknote,
  CheckCircle2,
  Lock,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  User,
  AlertCircle
} from 'lucide-react';
import { PaymentMethod } from '../types';

export const CheckoutPage: React.FC = () => {
  const {
    items,
    totalItems,
    subtotal,
    discount,
    couponCode,
    deliveryFee,
    total,
    isExpressDelivery,
    setIsExpressDelivery,
    clearCart
  } = useCart();

  const { user, isAuthenticated } = useAuth();
  const { error, success } = useToast();
  const { t, formatPrice, isRTL } = useLanguage();
  const navigate = useNavigate();

  // Form State
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');

  const [province, setProvince] = useState('Punjab');
  const [city, setCity] = useState('Lahore');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [instructions, setInstructions] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');

  // Card details state for simulation
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [submitting, setSubmitting] = useState(false);

  // Auto-fill from user profile if available
  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerEmail) setCustomerEmail(user.email);
      if (!customerPhone && user.phone) setCustomerPhone(user.phone);

      if (user.addresses && user.addresses.length > 0) {
        const def = user.addresses.find((a) => a.isDefault) || user.addresses[0];
        setProvince(def.province || 'Punjab');
        setCity(def.city || 'Lahore');
        setArea(def.area || '');
        setAddress(def.address || '');
        setPostalCode(def.postalCode || '');
      }
    }
  }, [user]);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      error(t('checkout.customerName') + ', ' + t('checkout.email') + ', ' + t('checkout.phone') + ' required.');
      return;
    }

    if (!address.trim() || !city.trim()) {
      error(t('checkout.address') + ' & ' + t('checkout.city') + ' required.');
      return;
    }

    if (paymentMethod === 'Credit/Debit Card (Online)') {
      if (cardNumber.replace(/\s/g, '').length < 16 || !cardExpiry || !cardCvv) {
        error('Please enter valid 16-digit card details for online payment.');
        return;
      }
    }

    setSubmitting(true);

    try {
      const orderPayload = {
        userId: user?.id,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        items: items.map((i) => {
          const unitPrice = i.book.discountPrice || i.book.price;
          return {
            bookId: i.book.id,
            title: i.book.title,
            author: i.book.author,
            coverImage: i.book.coverImage,
            price: unitPrice,
            quantity: i.quantity,
            totalPrice: unitPrice * i.quantity
          };
        }),
        shippingAddress: {
          province,
          city,
          area,
          address: address.trim(),
          postalCode,
          instructions
        },
        deliveryMethod: isExpressDelivery ? 'Express Delivery' : 'Standard Delivery',
        subtotal,
        discount,
        couponCode: couponCode || undefined,
        deliveryFee,
        total,
        paymentMethod,
        paymentStatus: paymentMethod === 'Credit/Debit Card (Online)' ? 'Paid' : 'Pending'
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (data.success && data.data) {
        clearCart();
        success(`Order #${data.data.orderNumber} placed successfully!`);
        navigate(`/order-success/${data.data.id}`, { state: { order: data.data } });
      } else {
        error(data.message || 'Failed to place order.');
      }
    } catch (err: any) {
      error(err.message || 'Network error while placing order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 text-start">
      {/* Checkout Header */}
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif-heading text-white">
          {t('checkout.title')}
        </h1>
        <p className="text-xs text-slate-400">
          {t('checkout.subtitle')}
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Steps */}
        <div className="lg:col-span-8 space-y-8">
          {/* Step 1: Contact Information */}
          <div className="bg-white/[0.04] backdrop-blur-2xl rounded-2xl border border-white/10 p-6 space-y-4 shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
            <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <User className="w-4 h-4 text-indigo-400" /> {t('checkout.contactInfo')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">{t('checkout.customerName')} *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Muhammad Farhan"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">{t('checkout.email')} *</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. farhan@gmail.com"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {t('checkout.phone')} *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0300-1234567 or 0321-9876543"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Shipping Address */}
          <div className="bg-white/[0.04] backdrop-blur-2xl rounded-2xl border border-white/10 p-6 space-y-4 shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
            <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <MapPin className="w-4 h-4 text-indigo-400" /> {t('checkout.shippingInfo')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">{t('checkout.province')} *</label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full bg-slate-900 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa (KPK)</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Islamabad Capital Territory">Islamabad Capital Territory</option>
                  <option value="Azad Kashmir">Azad Kashmir</option>
                  <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">{t('checkout.city')} *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Lahore, Karachi, Islamabad..."
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">{t('checkout.area')}</label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Gulberg III, DHA Phase 5, F-7/2..."
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">{t('checkout.postalCode')}</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 54000"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300 block mb-1">{t('checkout.address')} *</label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House #, Street #, Building Name, Landmark..."
                  className="w-full bg-white/5 border border-white/15 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                ></textarea>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300 block mb-1">{t('checkout.instructions')}</label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Please deliver after 2 PM, call before arrival..."
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Delivery Speed */}
          <div className="bg-white/[0.04] backdrop-blur-2xl rounded-2xl border border-white/10 p-6 space-y-4 shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
            <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Truck className="w-4 h-4 text-indigo-400" /> {t('checkout.deliveryMethod')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                onClick={() => setIsExpressDelivery(false)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                  !isExpressDelivery
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-white/10 hover:border-white/20 bg-white/5'
                }`}
              >
                <div>
                  <span className="font-bold text-xs sm:text-sm text-white block">{t('checkout.standardCourier')}</span>
                  <span className="text-xs text-slate-400 block mt-1">{t('checkout.standardDays')}</span>
                </div>
                <span className="text-xs font-extrabold text-indigo-300">
                  {subtotal >= 2000 ? t('cart.freeDelivery') : formatPrice(199)}
                </span>
              </label>

              <label
                onClick={() => setIsExpressDelivery(true)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start justify-between ${
                  isExpressDelivery
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-white/10 hover:border-white/20 bg-white/5'
                }`}
              >
                <div>
                  <span className="font-bold text-xs sm:text-sm text-white block">{t('checkout.expressCourier')}</span>
                  <span className="text-xs text-slate-400 block mt-1">{t('checkout.expressDays')}</span>
                </div>
                <span className="text-xs font-extrabold text-indigo-300">{formatPrice(350)}</span>
              </label>
            </div>
          </div>

          {/* Step 4: Payment Method */}
          <div className="bg-white/[0.04] backdrop-blur-2xl rounded-2xl border border-white/10 p-6 space-y-4 shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
            <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <CreditCard className="w-4 h-4 text-indigo-400" /> {t('checkout.paymentMethod')}
            </h3>

            <div className="space-y-3">
              {/* COD */}
              <label
                onClick={() => setPaymentMethod('Cash on Delivery')}
                className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-white/10 hover:border-white/20 bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={() => setPaymentMethod('Cash on Delivery')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <div className="flex-1">
                  <span className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-indigo-400" /> {t('checkout.cod')}
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    {t('checkout.codDesc')}
                  </span>
                </div>
              </label>

              {/* Online Card */}
              <label
                onClick={() => setPaymentMethod('Credit/Debit Card (Online)')}
                className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col gap-3 transition-all ${
                  paymentMethod === 'Credit/Debit Card (Online)'
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-white/10 hover:border-white/20 bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Credit/Debit Card (Online)'}
                    onChange={() => setPaymentMethod('Credit/Debit Card (Online)')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-indigo-400" /> {t('checkout.card')}
                    </span>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      {t('checkout.cardDesc')}
                    </span>
                  </div>
                </div>

                {paymentMethod === 'Credit/Debit Card (Online)' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10 animate-in fade-in">
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        placeholder="16-Digit Card Number (e.g. 4242 4242 4242 4242)"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-center text-white"
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="CVV"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-center font-mono text-white"
                      />
                    </div>
                  </div>
                )}
              </label>

              {/* JazzCash / EasyPaisa */}
              <label
                onClick={() => setPaymentMethod('Bank Transfer / JazzCash / EasyPaisa')}
                className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${
                  paymentMethod === 'Bank Transfer / JazzCash / EasyPaisa'
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-white/10 hover:border-white/20 bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Bank Transfer / JazzCash / EasyPaisa'}
                  onChange={() => setPaymentMethod('Bank Transfer / JazzCash / EasyPaisa')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="font-bold text-xs sm:text-sm text-white">
                    {t('checkout.bankTransfer')}
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    {t('checkout.bankTransferDesc')}
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review & Submit */}
        <div className="lg:col-span-4 bg-white/[0.04] backdrop-blur-2xl rounded-3xl border border-white/15 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-6 sticky top-24">
          <h3 className="font-bold text-base text-white border-b border-white/10 pb-3">
            {t('checkout.reviewOrder')} ({totalItems})
          </h3>

          {/* Items mini list */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {items.map(({ book, quantity }) => {
              const unitPrice = book.discountPrice || book.price;
              return (
                <div key={book.id} className="flex items-center gap-3 text-xs">
                  <img src={book.coverImage} alt={book.title} className="w-10 h-14 object-cover rounded shadow-md border border-white/10" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{book.title}</p>
                    <p className="text-slate-400 text-[11px]">{quantity} × {formatPrice(unitPrice)}</p>
                  </div>
                  <span className="font-bold text-indigo-300">
                    {formatPrice(unitPrice * quantity)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Pricing breakdown */}
          <div className="space-y-2 text-xs text-slate-300 pt-3 border-t border-white/10">
            <div className="flex justify-between">
              <span>{t('cart.subtotal')}:</span>
              <span className="font-bold text-white">{formatPrice(subtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>{t('cart.discount')} ({couponCode}):</span>
                <span>- {formatPrice(discount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>{t('cart.deliveryFee')} ({isExpressDelivery ? t('checkout.express') : t('checkout.standard')}):</span>
              <span>{deliveryFee === 0 ? <strong className="text-emerald-400 font-bold">{t('cart.freeDelivery')}</strong> : formatPrice(deliveryFee)}</span>
            </div>

            <div className="flex justify-between text-base font-black text-white pt-3 border-t border-white/10">
              <span>{t('cart.total')}:</span>
              <span className="text-indigo-300 font-extrabold">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            id="btn-place-order"
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 disabled:opacity-40 text-white font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50 transition-all border border-white/20"
          >
            <Lock className="w-4 h-4" />
            <span>{submitting ? '...' : t('checkout.placeOrder')}</span>
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t('checkout.encrypted')}</span>
          </div>
        </div>
      </form>
    </div>
  );
};
