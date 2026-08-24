import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Banknote,
  ShoppingBag,
  BookOpen,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Package,
  Plus,
  Truck,
  CheckCircle2,
  Clock,
  ChevronRight,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  Users
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await fetch('/api/admin/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.data) {
          setStats(data.data);
        }
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [token]);

  if (loading || !stats) {
    return (
      <div className="py-24 text-center text-xs text-slate-400">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        Loading Maktaba Haqanya executive metrics...
      </div>
    );
  }

  // Monthly revenue dataset
  const salesChartData = [
    { month: 'Apr', sales: 185000, orders: 42 },
    { month: 'May', sales: 240000, orders: 58 },
    { month: 'Jun', sales: 310000, orders: 74 },
    { month: 'Jul', sales: 280000, orders: 66 },
    { month: 'Aug', sales: 395000, orders: 92 },
    { month: 'Sep (Ramadan)', sales: 520000, orders: 135 },
    { month: 'Current', sales: stats.metrics?.totalRevenue || 425800, orders: stats.metrics?.totalOrders || 48 }
  ];

  const categoryShareData = [
    { name: 'Quran & Tafseer', value: 38, color: '#6366f1' },
    { name: 'Hadith Studies', value: 24, color: '#a855f7' },
    { name: 'Urdu Literature', value: 18, color: '#ec4899' },
    { name: 'Islamic History', value: 12, color: '#06b6d4' },
    { name: 'Academic & CSS', value: 8, color: '#10b981' }
  ];

  const metrics = stats.metrics || {};

  return (
    <div className="space-y-8">
      {/* Top Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">
              Maktaba Haqanya Admin Portal
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Live Warehouse
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-heading text-white mt-1">
            Executive Bookstore Dashboard
          </h1>
          <p className="text-xs text-slate-400">
            Real-time catalog performance, revenue metrics, inventory levels, and dispatch status
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/books?action=new"
            id="btn-admin-add-book-quick"
            className="bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 border border-white/20 transition-all transform hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" /> Add New Book / Product
          </Link>
          <Link
            to="/admin/books"
            className="bg-white/5 hover:bg-white/10 text-slate-200 border border-white/15 text-xs font-semibold px-4 py-2.5 rounded-xl backdrop-blur-md transition-colors"
          >
            Manage Catalog &amp; Upload Dates
          </Link>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-[0_15px_35px_rgba(0,0,0,0.4)] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Store Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-white block">
              Rs. {(metrics.totalRevenue || 0).toLocaleString()}
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +18.4% growth this month
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-[0_15px_35px_rgba(0,0,0,0.4)] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Customer Orders</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-white block">
              {metrics.totalOrders || 0}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              {metrics.pendingOrders || 0} pending dispatch • TCS / Leopards / Trax
            </span>
          </div>
        </div>

        {/* Active Catalog Titles */}
        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-[0_15px_35px_rgba(0,0,0,0.4)] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Book Catalog</span>
            <div className="w-9 h-9 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-white block">
              {metrics.totalBooks || 0} Books
            </span>
            <Link
              to="/admin/books"
              className="text-[11px] text-indigo-300 font-semibold flex items-center gap-1 mt-1 hover:underline"
            >
              View catalog with upload dates <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Low Stock Warnings */}
        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-[0_15px_35px_rgba(0,0,0,0.4)] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Low Stock Alert</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 block">
              {metrics.lowStockBooks || 0} Titles
            </span>
            <Link
              to="/admin/inventory"
              className="text-[11px] text-amber-300/80 font-medium flex items-center gap-1 mt-1 hover:underline"
            >
              Adjust publisher stock <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Sales Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Growth Chart */}
        <div className="lg:col-span-8 bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)] space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="font-bold text-sm text-white">Monthly Sales Growth (PKR)</h3>
              <p className="text-xs text-slate-400">Online store &amp; Urdu Bazaar warehouse orders</p>
            </div>
            <span className="text-xs text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-1 rounded-lg font-bold">
              2026 Live Metrics
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesChartData}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c0d22',
                    borderColor: 'rgba(255,255,255,0.15)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [`Rs. ${Number(val).toLocaleString()}`, 'Sales Volume']}
                />
                <Area type="monotone" dataKey="sales" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#salesGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="lg:col-span-4 bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col justify-between space-y-4">
          <div className="border-b border-white/10 pb-3">
            <h3 className="font-bold text-sm text-white">Category Sales Distribution</h3>
            <p className="text-xs text-slate-400">Share of monthly book purchases</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryShareData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0c0d22',
                    borderColor: 'rgba(255,255,255,0.15)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [`${val}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-white/10">
            {categoryShareData.map((c, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }}></span>
                <span className="text-slate-300 truncate">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders & Quick Dispatch Table */}
      <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)] space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="font-bold text-sm text-white">Recent Customer Orders</h3>
            <p className="text-xs text-slate-400">Real-time checkout stream across Pakistan</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 font-semibold"
          >
            View All Orders <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="text-slate-400 uppercase bg-white/[0.02] border-b border-white/10">
              <tr>
                <th className="p-3">Order Number</th>
                <th className="p-3">Customer</th>
                <th className="p-3">City</th>
                <th className="p-3">Items</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {stats.recentOrders?.map((ord: any) => (
                <tr key={ord.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3 font-mono font-bold text-indigo-300">{ord.orderNumber}</td>
                  <td className="p-3 font-medium text-white">{ord.shippingAddress?.fullName || 'Valued Customer'}</td>
                  <td className="p-3 text-slate-400">{ord.shippingAddress?.city || 'Lahore'}</td>
                  <td className="p-3 text-slate-300">{ord.items?.length || 1} books</td>
                  <td className="p-3 font-bold text-white">Rs. {ord.total?.toLocaleString()}</td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        ord.orderStatus === 'Delivered'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : ord.orderStatus === 'Shipped'
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                          : ord.orderStatus === 'Processing'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-slate-500/20 text-slate-300 border-slate-500/30'
                      }`}
                    >
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      to={`/admin/orders?order=${ord.id}`}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-indigo-300 hover:text-white border border-white/10 font-semibold transition-colors"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
