import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Order, OrderStatus, PaymentStatus } from '../../types';
import {
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  X,
  MapPin,
  Phone,
  CreditCard,
  Banknote,
  Send,
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Selected Order Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('Pending');
  const [newPaymentStatus, setNewPaymentStatus] = useState<PaymentStatus>('Pending');
  const [courier, setCourier] = useState('TCS Express Pakistan');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [updating, setUpdating] = useState(false);

  const { token } = useAuth();
  const { success, error } = useToast();
  const [searchParams] = useSearchParams();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setOrders(data.data);

        // Highlight if query param present
        const highlightId = searchParams.get('order') || searchParams.get('highlight');
        if (highlightId) {
          const found = data.data.find((o: Order) => o.id === highlightId);
          if (found) handleOpenManage(found);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const handleOpenManage = (ord: Order) => {
    setSelectedOrder(ord);
    setNewStatus(ord.orderStatus);
    setNewPaymentStatus(ord.paymentStatus);
    setCourier(ord.courier || 'TCS Express Pakistan');
    setTrackingNumber(ord.trackingNumber || `TCS-${Math.floor(10000000 + Math.random() * 90000000)}`);
    setTrackingUrl(ord.trackingUrl || '');
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          orderStatus: newStatus,
          paymentStatus: newPaymentStatus,
          courier: ['Shipped', 'Out for Delivery', 'Delivered'].includes(newStatus) ? courier : undefined,
          trackingNumber: ['Shipped', 'Out for Delivery', 'Delivered'].includes(newStatus) ? trackingNumber : undefined,
          trackingUrl: trackingUrl || undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        success(`Order #${selectedOrder.orderNumber} status updated to ${newStatus}`);
        setSelectedOrder(null);
        fetchOrders();
      } else {
        error(data.message || 'Failed to update order.');
      }
    } catch {
      error('Network error while updating order.');
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress?.city?.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress?.phone?.includes(search);

    const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">
              Orders &amp; Dispatch Management
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-heading text-white mt-1">
            Customer Orders &amp; Courier Dispatch
          </h1>
          <p className="text-xs text-slate-400">
            Process Cash on Delivery (COD), verify Bank Transfers, issue TCS tracking, and print dispatch invoices
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 backdrop-blur-md transition-colors"
          >
            Refresh Orders
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/[0.04] backdrop-blur-2xl p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-3 shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order # (e.g. MH-2025-...), customer name, city, phone..."
            className="w-full bg-white/5 border border-white/15 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 backdrop-blur-md"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0b0c1e] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Order Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="text-slate-400 uppercase bg-white/[0.02] border-b border-white/10 font-bold tracking-wider">
              <tr>
                <th className="p-3.5">Order ID &amp; Date</th>
                <th className="p-3.5">Customer &amp; Shipping</th>
                <th className="p-3.5">Items Ordered</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5">Order Status</th>
                <th className="p-3.5">Courier &amp; Tracking</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <Package className="w-8 h-8 mx-auto text-slate-500 mb-2" />
                    <p className="font-semibold text-white">No customer orders found</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5">
                      <span className="font-bold text-white block font-mono text-sm">{ord.orderNumber}</span>
                      <span className="text-slate-400 text-[11px] block">
                        {new Date(ord.createdAt).toLocaleDateString('en-PK', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className="font-semibold text-white block">{ord.shippingAddress?.fullName}</span>
                      <span className="text-slate-400 text-[11px] block flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-indigo-400" /> {ord.shippingAddress?.city}, {ord.shippingAddress?.state || 'Pakistan'}
                      </span>
                      <span className="text-slate-500 text-[10px] block font-mono">{ord.shippingAddress?.phone}</span>
                    </td>

                    <td className="p-3.5">
                      <span className="text-slate-200 font-semibold block">{ord.items?.length || 0} books</span>
                      <span className="text-slate-400 text-[10px] truncate max-w-[150px] block">
                        {ord.items?.[0]?.title} {ord.items?.length > 1 ? `+ ${ord.items.length - 1} more` : ''}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className="font-bold text-white block text-sm">
                        Rs. {ord.total?.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{ord.paymentMethod}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full inline-block mt-0.5 ${
                          ord.paymentStatus === 'Paid'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : ord.paymentStatus === 'Failed'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          ord.orderStatus === 'Delivered'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : ord.orderStatus === 'Shipped' || ord.orderStatus === 'Out for Delivery'
                            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                            : ord.orderStatus === 'Processing'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : ord.orderStatus === 'Cancelled'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : 'bg-slate-500/20 text-slate-300 border-slate-500/30'
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>

                    <td className="p-3.5">
                      {ord.trackingNumber ? (
                        <div>
                          <span className="font-mono text-indigo-300 text-[11px] block font-semibold">
                            {ord.trackingNumber}
                          </span>
                          <span className="text-slate-400 text-[10px]">{ord.courier || 'TCS'}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px] italic">Not dispatched</span>
                      )}
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleOpenManage(ord)}
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white font-bold transition-all shadow-md"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manage Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-[#0c0d22]/95 border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 text-slate-100 max-h-[90vh] overflow-y-auto shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider block">
                  Order Management
                </span>
                <h3 className="font-bold text-xl font-serif-heading text-white mt-0.5">
                  Order #{selectedOrder.orderNumber}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order Items Summary */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-3">
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Purchased Books
              </h4>
              <div className="divide-y divide-white/10">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img src={item.coverImage} alt="" className="w-8 h-11 object-cover rounded" />
                      <div>
                        <span className="font-semibold text-white block">{item.title}</span>
                        <span className="text-slate-400 text-[11px]">Qty: {item.quantity} × Rs. {item.price}</span>
                      </div>
                    </div>
                    <span className="font-bold text-white">Rs. {(item.quantity * item.price).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-sm text-white">
                <span>Total Amount</span>
                <span className="text-indigo-400">Rs. {selectedOrder.total?.toLocaleString()}</span>
              </div>
            </div>

            {/* Status Update Form */}
            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Order Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full bg-[#0b0c1e] border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing / Warehouse Packing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Payment Status</label>
                  <select
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value as any)}
                    className="w-full bg-[#0b0c1e] border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid / Confirmed</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Courier Partner</label>
                  <select
                    value={courier}
                    onChange={(e) => setCourier(e.target.value)}
                    className="w-full bg-[#0b0c1e] border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="TCS Express Pakistan">TCS Express Pakistan</option>
                    <option value="Leopards Courier">Leopards Courier</option>
                    <option value="Trax Logistics">Trax Logistics</option>
                    <option value="Call Courier">Call Courier</option>
                    <option value="Pakistan Post UMS">Pakistan Post UMS</option>
                    <option value="M&P Express">M&P Express</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Courier Tracking / Airway Bill (AWB)</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. TCS-77291823"
                    className="w-full bg-white/5 border border-white/15 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl border border-white/10 flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-4 h-4" /> Print Invoice
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-md"
                  >
                    {updating ? 'Saving...' : 'Update Order Status'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
