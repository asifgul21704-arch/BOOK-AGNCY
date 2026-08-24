import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Search,
  ShoppingCart,
  Heart,
  User as UserIcon,
  Menu,
  X,
  Phone,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Package,
  Compass,
  Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([]);

  const { user, isAuthenticated, isManager, logout } = useAuth();
  const { totalItems, subtotal } = useCart();
  const { wishlistCount } = useWishlist();
  const { t, formatPrice, translateCategory, isRTL } = useLanguage();

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoryMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Load categories for dropdown
  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data) {
          setCategories(data.data);
        }
      })
      .catch(console.error);
  }, []);

  // Handle outside click for user dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#050510]/80 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      {/* 1. Top Announcement & Utility Bar */}
      <div className="bg-white/[0.03] backdrop-blur-md text-slate-300 text-xs py-2 px-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-amber-300 font-medium">
              <Truck className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{t('announcement.freeDelivery')}</span>
            </span>
            <span className="hidden md:inline-block text-white/20">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>{t('announcement.authentic')}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] sm:text-xs">
            {/* Language Selector in Top Bar */}
            <LanguageSwitcher variant="compact" />

            <span className="text-white/20">|</span>

            <a
              href="https://wa.me/923008492011"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>{t('announcement.whatsapp')}: +92 300 8492011</span>
            </a>

            <span className="text-white/20">|</span>

            {isManager ? (
              <Link
                to="/admin"
                className="flex items-center gap-1 bg-indigo-600/80 hover:bg-indigo-600 text-white px-2.5 py-0.5 rounded-lg border border-indigo-400/30 font-bold transition-colors shadow-xs"
              >
                <LayoutDashboard className="w-3 h-3" />
                <span>{t('nav.adminDashboard')}</span>
              </Link>
            ) : (
              <Link to="/admin/login" className="text-slate-400 hover:text-slate-200 transition-colors">
                {t('announcement.adminPortal')}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Header / Brand / Search / Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            id="btn-mobile-menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-indigo-950/50 group-hover:scale-105 transition-transform border border-white/20 flex-shrink-0">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-serif-heading text-lg sm:text-2xl font-bold tracking-tight text-white block leading-tight">
                {t('brand.name')}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-indigo-400 uppercase block">
                {t('brand.tagline')}
              </span>
            </div>
          </Link>
        </div>

        {/* Global Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              id="input-desktop-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('nav.searchPlaceholder')}
              className="w-full bg-white/[0.06] border border-white/15 text-white placeholder-slate-400 text-sm rounded-xl px-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 backdrop-blur-md transition-all shadow-inner"
            />
            <Search className={`w-4 h-4 text-slate-400 absolute top-3.5 ${isRTL ? 'right-3.5' : 'left-3.5'}`} />
            <button
              id="btn-desktop-search-submit"
              type="submit"
              className={`absolute top-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20 shadow-xs transition-colors ${
                isRTL ? 'left-1.5' : 'right-1.5'
              }`}
            >
              {t('nav.searchBtn')}
            </button>
          </form>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Main Dropdown Language Switcher */}
          <div className="hidden sm:block">
            <LanguageSwitcher variant="dropdown" />
          </div>

          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            id="nav-wishlist-link"
            className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 relative transition-colors border border-transparent hover:border-white/10"
            title={t('nav.wishlist')}
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-fuchsia-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon & Flyout indicator */}
          <Link
            to="/cart"
            id="nav-cart-link"
            className="flex items-center gap-2.5 p-2 sm:px-3.5 sm:py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-100 border border-white/15 backdrop-blur-md transition-colors shadow-xs"
            title={t('nav.cart')}
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-indigo-300" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {totalItems}
                </span>
              )}
            </div>
            <div className="hidden lg:block text-start text-xs">
              <span className="block text-[10px] text-slate-400 font-medium">{t('nav.cartTotal')}</span>
              <span className="font-bold text-white">{formatPrice(subtotal)}</span>
            </div>
          </Link>

          {/* User Account / Dropdown */}
          <div className="relative" ref={dropdownRef}>
            {isAuthenticated && user ? (
              <div>
                <button
                  id="btn-user-dropdown"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 text-slate-200 transition-colors border border-transparent hover:border-white/10"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-indigo-400/50 object-cover"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
                </button>

                {userDropdownOpen && (
                  <div
                    className={`absolute mt-2 w-56 bg-[#0a0a1f]/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/15 py-2 z-50 animate-in fade-in-50 ${
                      isRTL ? 'left-0' : 'right-0'
                    }`}
                  >
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-xs font-bold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block text-[10px] font-semibold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 rounded-md mt-1">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>{t('nav.myProfile')}</span>
                    </Link>

                    <Link
                      to="/orders"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Package className="w-4 h-4 text-slate-400" />
                      <span>{t('nav.myOrders')}</span>
                    </Link>

                    {isManager && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-indigo-300 bg-indigo-500/15 hover:bg-indigo-500/25 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>{t('nav.adminDashboard')}</span>
                      </Link>
                    )}

                    <div className="border-t border-white/10 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/15 transition-colors text-start"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                id="btn-header-login"
                className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-600 hover:to-fuchsia-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-md border border-white/20"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('nav.signIn')}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 3. Secondary Navbar (Categories & Core Navigation Links) */}
      <div className="hidden lg:block bg-white/[0.02] backdrop-blur-md border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs font-medium text-slate-300">
          {/* Categories Mega Dropdown */}
          <div className="relative group">
            <button
              onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
              className="flex items-center gap-2 bg-indigo-600/70 hover:bg-indigo-600 text-white font-bold py-2.5 px-4 rounded-t-xl transition-colors border-t border-x border-white/20 shadow-xs"
            >
              <Menu className="w-4 h-4" />
              <span>{t('nav.browseCategories')}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Dropdown Menu */}
            <div
              className={`hidden group-hover:block absolute top-full w-64 bg-[#0a0a1f]/95 backdrop-blur-2xl rounded-b-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/15 py-2 z-50 ${
                isRTL ? 'right-0' : 'left-0'
              }`}
            >
              <Link
                to="/categories"
                className="block px-4 py-2 text-xs font-bold text-indigo-300 hover:bg-white/10 border-b border-white/10"
              >
                {t('nav.categories')} ({t('nav.viewAll')}) →
              </Link>
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/categories/${cat.slug}`}
                  className="block px-4 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {translateCategory(cat.name)}
                </Link>
              ))}
            </div>
          </div>

          {/* Main Navigation Links */}
          <nav className="flex items-center gap-6 py-2.5">
            <Link to="/" className="hover:text-indigo-300 transition-colors font-medium">
              {t('nav.home')}
            </Link>
            <Link to="/books" className="hover:text-indigo-300 transition-colors font-medium">
              {t('nav.allBooks')}
            </Link>
            <Link to="/books?newArrival=true" className="hover:text-indigo-300 transition-colors font-medium">
              {t('nav.newArrivals')}
            </Link>
            <Link to="/books?bestSeller=true" className="hover:text-indigo-300 transition-colors font-medium">
              {t('nav.bestSellers')}
            </Link>
            <Link to="/categories" className="hover:text-indigo-300 transition-colors font-medium">
              {t('nav.categories')}
            </Link>
            <Link to="/about" className="hover:text-indigo-300 transition-colors font-medium">
              {t('nav.about')}
            </Link>
            <Link to="/contact" className="hover:text-indigo-300 transition-colors font-medium">
              {t('nav.contact')}
            </Link>
          </nav>

          {/* Quick Urdu Bazaar Badge */}
          <div className="flex items-center gap-1.5 text-indigo-300 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('brand.urduBazaar')}</span>
          </div>
        </div>
      </div>

      {/* 4. Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0a1f]/95 backdrop-blur-2xl border-t border-white/10 p-4 shadow-2xl space-y-4 animate-in slide-in-from-top-2">
          {/* Mobile Language Switcher */}
          <div className="flex items-center justify-between p-2 bg-white/5 rounded-xl border border-white/10">
            <span className="text-xs text-slate-400">{t('lang.select')}:</span>
            <LanguageSwitcher variant="inline" />
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('nav.searchPlaceholder')}
              className="w-full bg-white/10 border border-white/15 text-white placeholder-slate-400 text-sm rounded-xl px-9 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <Search className={`w-4 h-4 text-slate-400 absolute top-2.5 ${isRTL ? 'right-3' : 'left-3'}`} />
          </form>

          {/* Navigation Links */}
          <div className="flex flex-col gap-2 text-sm font-medium text-slate-300">
            <Link to="/" className="p-2 hover:bg-white/10 rounded-lg hover:text-white">
              {t('nav.home')}
            </Link>
            <Link to="/books" className="p-2 hover:bg-white/10 rounded-lg hover:text-white">
              {t('nav.allBooks')}
            </Link>
            <Link to="/categories" className="p-2 hover:bg-white/10 rounded-lg hover:text-white">
              {t('nav.categories')}
            </Link>
            <Link to="/books?newArrival=true" className="p-2 hover:bg-white/10 rounded-lg hover:text-white">
              {t('nav.newArrivals')}
            </Link>
            <Link to="/books?bestSeller=true" className="p-2 hover:bg-white/10 rounded-lg hover:text-white">
              {t('nav.bestSellers')}
            </Link>
            <Link to="/orders" className="p-2 hover:bg-white/10 rounded-lg hover:text-white">
              {t('nav.myOrders')}
            </Link>
            <Link to="/contact" className="p-2 hover:bg-white/10 rounded-lg hover:text-white">
              {t('nav.contact')}
            </Link>
            {isManager && (
              <Link to="/admin" className="p-2 bg-indigo-500/20 text-indigo-300 font-bold rounded-lg border border-indigo-500/30">
                {t('nav.adminDashboard')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

