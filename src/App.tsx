import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { LanguageProvider } from './context/LanguageContext';

// Customer Layout Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HaqanyaAIAssistant } from './components/ai/HaqanyaAIAssistant';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { BooksPage } from './pages/BooksPage';
import { BookDetailPage } from './pages/BookDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { WishlistPage } from './pages/WishlistPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { FAQPage } from './pages/FAQPage';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminBooks } from './pages/admin/AdminBooks';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { AdminReviews } from './pages/admin/AdminReviews';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminBulkImportExport } from './pages/admin/AdminBulkImportExport';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';

// Scroll to top on route change helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Customer Layout Shell wrapper
const CustomerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#050510] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden">
      {/* Ambient background light orbs for Frosted Glass refraction */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[140px]"></div>
        <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-fuchsia-600/15 rounded-full blur-[160px]"></div>
        <div className="absolute bottom-10 left-1/4 w-[650px] h-[650px] bg-cyan-500/15 rounded-full blur-[150px]"></div>
        <div className="absolute top-2/3 right-1/4 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[130px]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 min-w-0">
          {children}
        </main>
        <Footer />
        <HaqanyaAIAssistant />
      </div>
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  {/* Admin Portal Routes */}
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="books" element={<AdminBooks />} />
                    <Route path="inventory" element={<AdminInventory />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="customers" element={<AdminCustomers />} />
                    <Route path="coupons" element={<AdminCoupons />} />
                    <Route path="reviews" element={<AdminReviews />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="import-export" element={<AdminBulkImportExport />} />
                    <Route path="audit-logs" element={<AdminAuditLogs />} />
                  </Route>

                  {/* Customer Storefront Routes */}
                  <Route
                    path="/*"
                    element={
                      <CustomerLayout>
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/books" element={<BooksPage />} />
                          <Route path="/books/:slugOrId" element={<BookDetailPage />} />
                          <Route path="/categories" element={<CategoriesPage />} />
                          <Route path="/categories/:slug" element={<CategoryDetailPage />} />
                          <Route path="/cart" element={<CartPage />} />
                          <Route path="/checkout" element={<CheckoutPage />} />
                          <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
                          <Route path="/orders" element={<OrdersPage />} />
                          <Route path="/orders/:id" element={<OrderDetailPage />} />
                          <Route path="/wishlist" element={<WishlistPage />} />
                          <Route path="/profile" element={<ProfilePage />} />
                          <Route path="/login" element={<LoginPage />} />
                          <Route path="/register" element={<RegisterPage />} />
                          <Route path="/contact" element={<ContactPage />} />
                          <Route path="/about" element={<AboutPage />} />
                          <Route path="/faq" element={<FAQPage />} />
                        </Routes>
                      </CustomerLayout>
                    }
                  />
                </Routes>
              </BrowserRouter>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}

export default App;
