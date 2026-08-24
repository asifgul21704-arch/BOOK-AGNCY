import React, { useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Order } from '../types';
import { useLanguage } from '../context/LanguageContext';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Phone,
  Printer,
  ArrowRight,
  ArrowLeft,
  Clock,
  Sparkles
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const order = (location.state as { order?: Order })?.order;
  const { t, formatPrice, isRTL } = useLanguage();

  useEffect(() => {
    // Fire festive confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Success Banner */}
      <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-8 sm:p-12 text-center shadow-xl border border-emerald-800 space-y-4">
        <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-400/40 rounded-full flex items-center justify-center text-emerald-300 mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold font-serif-heading">
          {t('orderSuccess.title')}
        </h1>

        <p className="text-xs sm:text-sm text-emerald-100 max-w-lg mx-auto">
          {t('orderSuccess.subtitle')}
        </p>

        {order?.orderNumber && (
          <div className="inline-block bg-white/10 border border-white/20 px-4 py-2 rounded-xl text-xs font-mono font-bold text-amber-300">
            {t('orderSuccess.orderNumber')}: {order.orderNumber}
          </div>
        )}
      </div>

      {/* Order Details Card */}
      {order && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 print:border-none print:shadow-none">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">{t('checkout.orderSummary')}</h3>
              <p className="text-xs text-slate-400">
                {isRTL ? 'آرڈر کی تاریخ:' : 'Placed on'} {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors print:hidden"
            >
              <Printer className="w-3.5 h-3.5" /> {t('action.printInvoice')}
            </button>
          </div>

          {/* Customer & Address Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="space-y-1">
              <span className="font-bold text-slate-900 uppercase block">
                {t('checkout.shippingInfo')}:
              </span>
              <p className="font-medium text-slate-800">{order.customerName}</p>
              <p>{order.shippingAddress.address}, {order.shippingAddress.area}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.province}</p>
              <p className="pt-1 text-slate-500">{t('checkout.phone')}: {order.customerPhone}</p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-900 uppercase block">
                {t('checkout.paymentMethod')}:
              </span>
              <p><span className="text-slate-500">{isRTL ? 'طریقہ:' : 'Method:'}</span> <strong className="text-slate-900">{order.paymentMethod}</strong></p>
              <p><span className="text-slate-500">{isRTL ? 'ڈلیوری سپیڈ:' : 'Speed:'}</span> {order.deliveryMethod}</p>
              <p><span className="text-slate-500">{isRTL ? 'اسٹیٹس:' : 'Status:'}</span> <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[11px]">{t(`status.${order.orderStatus}`) || order.orderStatus}</span></p>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">{t('cart.items')}</h4>
            <div className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.coverImage} alt={item.title} className="w-10 h-14 object-cover rounded shadow-xs" />
                    <div>
                      <p className="font-bold text-slate-900">{item.title}</p>
                      <p className="text-slate-400 text-[11px]">{t('book.author')}: {item.author}</p>
                      <p className="text-slate-500 text-[11px]">
                        {t('book.quantity')}: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">
                    {formatPrice(item.totalPrice)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className={`border-t border-slate-200 pt-4 space-y-2 text-xs text-slate-600 max-w-xs ${isRTL ? 'mr-auto' : 'ml-auto'}`}>
            <div className="flex justify-between">
              <span>{t('cart.subtotal')}:</span>
              <span className="font-bold text-slate-800">{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>{t('cart.couponDiscount')} ({order.couponCode}):</span>
                <span>- {formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>{t('cart.deliveryCharges')}:</span>
              <span>{order.deliveryFee === 0 ? (isRTL ? 'مفت' : 'FREE') : formatPrice(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-100">
              <span>{t('cart.total')}:</span>
              <span className="text-emerald-800">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4 print:hidden">
        <Link
          to="/orders"
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-colors flex items-center gap-2"
        >
          <Package className="w-4 h-4" />
          <span>{t('action.trackOrder')}</span>
        </Link>
        <Link
          to="/books"
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl transition-colors"
        >
          {t('action.continueShopping')}
        </Link>
      </div>
    </div>
  );
};

