import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Package,
  Search,
  ChevronRight,
  ChevronLeft,
  Clock,
  CheckCircle2,
  Truck,
  ExternalLink,
  MapPin
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackInput, setTrackInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [searchError, setSearchError] = useState('');
  const { user, token } = useAuth();
  const { t, formatPrice, isRTL } = useLanguage();

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.data) {
          setOrders(data.data);
        }
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [token]);

  const handleTrackByNumber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackInput.trim()) return;

    setSearchError('');
    setSearchedOrder(null);

    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(trackInput.trim())}`);
      const data = await res.json();
      if (data.success && data.data) {
        setSearchedOrder(data.data);
      } else {
        setSearchError(isRTL ? 'اس ریفرنس نمبر کے ساتھ کوئی آرڈر نہیں ملا۔' : 'No order found with this tracking reference or order number.');
      }
    } catch {
      setSearchError(isRTL ? 'ٹریکنگ تلاش کرنے میں خرابی پیش آگئی۔' : 'Error searching for order tracking.');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Shipped':
      case 'Out for Delivery':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Cancelled':
      case 'Returned':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Title & Quick Order Tracker */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-800">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
            {t('orders.trackingHeading')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-heading">
            {t('orders.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {t('orders.subtitle')}
          </p>

          <form onSubmit={handleTrackByNumber} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-md">
            <input
              type="text"
              value={trackInput}
              onChange={(e) => setTrackInput(e.target.value.toUpperCase())}
              placeholder={t('orders.searchPlaceholder')}
              className="flex-1 bg-white/10 border border-white/20 text-white text-xs sm:text-sm rounded-xl px-4 py-2.5 uppercase font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-colors shadow-md flex items-center justify-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>{t('orders.trackBtn')}</span>
            </button>
          </form>

          {searchError && (
            <p className="text-xs text-rose-300 font-medium pt-1">{searchError}</p>
          )}
        </div>
      </div>

      {/* Searched Order Result Card */}
      {searchedOrder && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 shadow-md space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-emerald-200/80 pb-3">
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                {isRTL ? 'دستیاب آرڈر ریکارڈ' : 'Found Order'}
              </span>
              <h3 className="text-base font-bold text-slate-900 font-mono">
                {t('orderSuccess.orderNumber')} #{searchedOrder.orderNumber}
              </h3>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusBadgeClass(searchedOrder.orderStatus)}`}>
              {t(`status.${searchedOrder.orderStatus}`) || searchedOrder.orderStatus}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-700">
            <div>
              <span className="text-slate-500 block">{t('checkout.customerName')}:</span>
              <span className="font-bold text-slate-900">{searchedOrder.customerName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">{t('checkout.city')}:</span>
              <span className="font-bold text-slate-900">{searchedOrder.shippingAddress.city}</span>
            </div>
            <div>
              <span className="text-slate-500 block">{t('orders.total')}:</span>
              <span className="font-bold text-emerald-800">{formatPrice(searchedOrder.total)} ({searchedOrder.paymentMethod})</span>
            </div>
          </div>

          {searchedOrder.trackingNumber && (
            <div className="bg-white p-3 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-500">{isRTL ? 'کورئیر پارٹنر:' : 'Courier Partner:'}</span>{' '}
                <strong className="text-slate-900">{searchedOrder.courier || 'TCS Pakistan'}</strong>
                <span className="mx-2 text-slate-300">|</span>
                <span className="text-slate-500">{isRTL ? 'ٹریکنگ نمبر:' : 'Tracking #:'}</span>{' '}
                <strong className="font-mono text-emerald-800">{searchedOrder.trackingNumber}</strong>
              </div>
            </div>
          )}

          <div className={isRTL ? 'text-left' : 'text-right'}>
            <Link
              to={`/orders/${searchedOrder.id}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline"
            >
              {isRTL ? '← مکمل ٹریکنگ تاریخ اور رسید دیکھیں' : 'View Complete Tracking Timeline & Receipt →'}
            </Link>
          </div>
        </div>
      )}

      {/* Account Orders List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-serif-heading text-slate-900">
          {t('orders.recentOrders')}
        </h2>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            {isRTL ? 'آرڈرز لوڈ ہو رہے ہیں...' : 'Loading orders...'}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-emerald-300 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900">
                      #{ord.orderNumber}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadgeClass(ord.orderStatus)}`}>
                      {t(`status.${ord.orderStatus}`) || ord.orderStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {new Date(ord.createdAt).toLocaleDateString()} • {ord.items.length} {t('cart.items')}
                  </p>
                  <p className="text-xs text-slate-700">
                    {t('orders.deliverTo')} <span className="font-semibold">{ord.shippingAddress.city}</span> ({ord.deliveryMethod})
                  </p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className={isRTL ? 'text-right md:text-left' : 'text-left md:text-right'}>
                    <span className="text-xs text-slate-500 block">{t('orders.total')}</span>
                    <span className="text-base font-black text-emerald-800">
                      {formatPrice(ord.total)}
                    </span>
                  </div>

                  <Link
                    to={`/orders/${ord.id}`}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <span>{t('action.trackOrder')}</span>
                    {isRTL ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
            <Package className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-500">{t('orders.noOrders')}</p>
            <Link to="/books" className="inline-block bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl">
              {t('nav.allBooks')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

