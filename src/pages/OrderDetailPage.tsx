import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Order, OrderStatus } from '../types';
import { useLanguage } from '../context/LanguageContext';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Phone,
  Printer,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const ORDER_STEPS: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered'
];

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, formatPrice, isRTL } = useLanguage();

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        if (data.success && data.data) {
          setOrder(data.data);
        }
      } catch (err) {
        console.error('Failed to load order detail', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-slate-500">{isRTL ? 'آرڈر کی تفصیلات لوڈ ہو رہی ہیں...' : 'Loading order timeline...'}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-3">
        <h2 className="text-xl font-bold text-slate-800">{isRTL ? 'آرڈر نہیں ملا' : 'Order Not Found'}</h2>
        <p className="text-xs text-slate-500">
          {isRTL ? 'مطلوبہ آرڈر کا ریکارڈ موجود نہیں ہے۔' : 'The requested order does not exist or has been removed.'}
        </p>
        <Link to="/orders" className="inline-block bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl">
          {t('orders.title')}
        </Link>
      </div>
    );
  }

  const currentStepIndex = ORDER_STEPS.indexOf(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <Link to="/orders" className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold mb-2 hover:underline">
            {isRTL ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
            <span>{t('orders.title')}</span>
          </Link>
          <h1 className="text-2xl font-bold font-serif-heading text-slate-900">
            {t('action.trackOrder')}: <span className="font-mono">#{order.orderNumber}</span>
          </h1>
          <p className="text-xs text-slate-500">
            {isRTL ? 'آرڈر کا وقت:' : 'Placed on'} {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-semibold text-slate-700 border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors print:hidden"
        >
          <Printer className="w-3.5 h-3.5" /> {t('action.printInvoice')}
        </button>
      </div>

      {/* Visual Tracking Progress Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
          {isRTL ? 'ڈلیوری و کوریئر ٹریکنگ' : 'Courier Tracking Progress'}
        </h3>

        {/* Step Indicator */}
        <div className="relative">
          <div className="hidden sm:flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
            <div
              className={`absolute top-1/2 h-1 bg-emerald-600 -translate-y-1/2 z-0 transition-all duration-500 ${
                isRTL ? 'right-0' : 'left-0'
              }`}
              style={{
                width: `${Math.max(0, (currentStepIndex / (ORDER_STEPS.length - 1)) * 100)}%`
              }}
            ></div>

            {ORDER_STEPS.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-emerald-700 text-white shadow-md ring-4 ring-emerald-100'
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[10px] font-semibold mt-2 text-center max-w-[80px] ${
                      isCurrent ? 'text-emerald-800 font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    {t(`status.${step}`) || step}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Mobile Status Card */}
          <div className="sm:hidden bg-slate-50 p-4 rounded-xl text-xs space-y-2 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-500">{isRTL ? 'موجودہ صورتحال:' : 'Current Status:'}</span>
              <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                {t(`status.${order.orderStatus}`) || order.orderStatus}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {isRTL ? `مرحلہ ${currentStepIndex + 1} از ${ORDER_STEPS.length}` : `Step ${currentStepIndex + 1} of ${ORDER_STEPS.length}`}
            </p>
          </div>
        </div>

        {/* Courier dispatch details */}
        {order.trackingNumber && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold block">
                {isRTL ? 'کوریئر پارٹنر:' : 'Courier Partner:'} {order.courier || 'TCS Express Pakistan'}
              </span>
              <span>
                {isRTL ? 'ٹریکنگ نمبر:' : 'Tracking Number:'} <strong className="font-mono">{order.trackingNumber}</strong>
              </span>
            </div>
            <span className="bg-emerald-700 text-white font-bold px-3 py-1 rounded-lg text-center">
              {isRTL ? 'فعال ٹریکنگ' : 'Active Tracking'}
            </span>
          </div>
        )}
      </div>

      {/* Order Items & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left: Items List */}
        <div className="md:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3 uppercase tracking-wider">
            {t('cart.items')} ({order.items.length})
          </h3>

          <div className="divide-y divide-slate-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img src={item.coverImage} alt={item.title} className="w-12 h-16 object-cover rounded shadow-xs" />
                  <div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-slate-500 text-[11px]">{t('book.author')}: {item.author}</p>
                    <p className="text-slate-600 text-[11px] mt-1">
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

          <div className={`pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600 max-w-xs ${isRTL ? 'mr-auto' : 'ml-auto'}`}>
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
            <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
              <span>{t('cart.total')}:</span>
              <span className="text-emerald-800">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Right: Shipping & Payment summary */}
        <div className="md:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs text-slate-700">
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2">{t('checkout.shippingInfo')}</h4>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
              <p className="font-bold text-slate-800">{order.customerName}</p>
              <p>{order.shippingAddress.address}</p>
              {order.shippingAddress.area && <p>{order.shippingAddress.area}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.province}</p>
              <p className="text-slate-500 pt-1">{t('checkout.phone')}: {order.customerPhone}</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2">{t('checkout.paymentMethod')}</h4>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
              <p><span className="text-slate-500">{isRTL ? 'طریقہ:' : 'Method:'}</span> <strong className="text-slate-900">{order.paymentMethod}</strong></p>
              <p><span className="text-slate-500">{isRTL ? 'ادائیگی اسٹیٹس:' : 'Status:'}</span> <span className="font-bold text-emerald-700">{order.paymentStatus}</span></p>
              <p><span className="text-slate-500">{isRTL ? 'ڈلیوری کا طریقہ:' : 'Delivery:'}</span> {order.deliveryMethod}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

