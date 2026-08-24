import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  Star,
  Settings,
  FileText,
  FileSpreadsheet,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  AlertTriangle,
  Bell,
  Sparkles
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, isManager, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // If not logged in or not manager, allow rendering AdminLoginPage or redirect
  if (!isManager) {
    return <Outlet />;
  }

  const navItems = [
    { label: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Books & Products', path: '/admin/books', icon: BookOpen },
    { label: 'Inventory & Stock Alerts', path: '/admin/inventory', icon: AlertTriangle },
    { label: 'Orders & Dispatch', path: '/admin/orders', icon: Package },
    { label: 'Categories Catalog', path: '/admin/categories', icon: Layers },
    { label: 'Customer Accounts', path: '/admin/customers', icon: Users },
    { label: 'Discount Coupons', path: '/admin/coupons', icon: Tag },
    { label: 'Customer Reviews', path: '/admin/reviews', icon: Star },
    { label: 'CSV Bulk Import/Export', path: '/admin/import-export', icon: FileSpreadsheet },
    { label: 'Store Settings', path: '/admin/settings', icon: Settings },
    { label: 'System Audit Logs', path: '/admin/audit-logs', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-[#080918] text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-[#0c0d22]/90 backdrop-blur-2xl border-b border-white/10 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-fuchsia-600 flex items-center justify-center text-white shadow-md">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm font-serif-heading text-white">Maktaba Haqanya Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0a0b1f]/95 backdrop-blur-3xl border-r border-white/10 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:static ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div>
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 border border-white/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-sm font-serif-heading text-white tracking-wide">
                Maktaba Haqanya
              </h2>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">
                Executive Portal
              </span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-190px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-white shadow-lg shadow-indigo-500/25 border border-white/20'
                      : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Session and Live Store Switch */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-white/[0.02]">
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-indigo-300 border border-indigo-500/30 py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Customer Storefront
          </Link>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
                alt=""
                className="w-8 h-8 rounded-full border border-indigo-500/40 object-cover"
              />
              <div className="text-[11px] leading-tight">
                <span className="font-bold text-white block truncate max-w-[100px]">{user?.name}</span>
                <span className="text-indigo-400 text-[10px]">{user?.role}</span>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors"
              title="Logout from Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <main className="flex-1 min-w-0 bg-[#080918] flex flex-col">
        {/* Top bar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-[#0a0b1f]/80 backdrop-blur-2xl border-b border-white/10">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-medium text-slate-300">Maktaba Haqanya Admin Control Panel</span>
            <span>•</span>
            <span className="text-indigo-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Central Urdu Bazaar Warehouse Live
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full font-bold">
              {user?.role} Access
            </span>
            <Link
              to="/"
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Live Storefront
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="p-4 sm:p-8 flex-1 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
