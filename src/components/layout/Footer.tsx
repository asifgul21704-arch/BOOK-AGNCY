import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Phone, Mail, MapPin, ShieldCheck, Truck, RotateCcw, CreditCard, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#04040d]/90 backdrop-blur-2xl text-slate-400 text-xs border-t border-white/10 mt-auto">
      {/* Value Badges Banner */}
      <div className="border-b border-white/5 bg-white/[0.02] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 backdrop-blur-md flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">{t('value.authentic')}</h4>
              <p className="text-slate-400 text-[11px]">{t('value.authenticDesc')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 backdrop-blur-md flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">{t('value.delivery')}</h4>
              <p className="text-slate-400 text-[11px]">{t('value.deliveryDesc')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 backdrop-blur-md flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">{t('value.returns')}</h4>
              <p className="text-slate-400 text-[11px]">{t('value.returnsDesc')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 backdrop-blur-md flex-shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">{t('value.payment')}</h4>
              <p className="text-slate-400 text-[11px]">{t('value.paymentDesc')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-start">
        {/* Brand & Story */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center text-white border border-white/20 shadow-md flex-shrink-0">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-serif-heading text-xl font-bold text-white block leading-tight">
                {t('brand.name')}
              </span>
              <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest block">
                {t('brand.tagline')}
              </span>
            </div>
          </div>

          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
            {t('footer.description')}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-indigo-600/80 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-indigo-600/80 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-indigo-600/80 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors" aria-label="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-indigo-600/80 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors" aria-label="YouTube">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 font-sans uppercase tracking-wider">{t('footer.quickLinks')}</h4>
          <ul className="space-y-2.5">
            <li><Link to="/" className="hover:text-indigo-400 transition-colors">{t('nav.home')}</Link></li>
            <li><Link to="/books" className="hover:text-indigo-400 transition-colors">{t('nav.allBooks')}</Link></li>
            <li><Link to="/categories" className="hover:text-indigo-400 transition-colors">{t('nav.categories')}</Link></li>
            <li><Link to="/books?bestSeller=true" className="hover:text-indigo-400 transition-colors">{t('nav.bestSellers')}</Link></li>
            <li><Link to="/books?newArrival=true" className="hover:text-indigo-400 transition-colors">{t('nav.newArrivals')}</Link></li>
            <li><Link to="/about" className="hover:text-indigo-400 transition-colors">{t('nav.about')}</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 font-sans uppercase tracking-wider">{t('footer.customerCare')}</h4>
          <ul className="space-y-2.5">
            <li><Link to="/orders" className="hover:text-indigo-400 transition-colors">{t('nav.myOrders')}</Link></li>
            <li><Link to="/cart" className="hover:text-indigo-400 transition-colors">{t('nav.cart')}</Link></li>
            <li><Link to="/wishlist" className="hover:text-indigo-400 transition-colors">{t('nav.wishlist')}</Link></li>
            <li><Link to="/contact" className="hover:text-indigo-400 transition-colors">{t('nav.contact')}</Link></li>
            <li><Link to="/about" className="hover:text-indigo-400 transition-colors">{t('footer.privacyPolicy')}</Link></li>
            <li><Link to="/about" className="hover:text-indigo-400 transition-colors">{t('footer.terms')}</Link></li>
          </ul>
        </div>

        {/* Contact & Urdu Bazaar Location */}
        <div>
          <h4 className="text-white font-bold text-sm mb-4 font-sans uppercase tracking-wider">{t('footer.storeLocation')}</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <span>{t('footer.storeAddress')}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span>+92 42 37234567 / +92 300 8492011</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span>info@maktabahaqanya.pk</span>
            </li>
            <li className="pt-1">
              <span className="text-[11px] text-slate-500 block">{t('footer.timing')}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar & Payment Methods */}
      <div className="border-t border-white/5 py-6 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            {t('footer.rights')}
          </p>
          <div className="flex items-center flex-wrap gap-2 text-xs font-semibold text-slate-300">
            <span className="bg-white/5 border border-white/10 px-2 py-1 rounded-lg backdrop-blur-md">Cash on Delivery</span>
            <span className="bg-white/5 border border-white/10 px-2 py-1 rounded-lg backdrop-blur-md">Visa / Mastercard</span>
            <span className="bg-white/5 border border-white/10 px-2 py-1 rounded-lg backdrop-blur-md">JazzCash</span>
            <span className="bg-white/5 border border-white/10 px-2 py-1 rounded-lg backdrop-blur-md">EasyPaisa</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
