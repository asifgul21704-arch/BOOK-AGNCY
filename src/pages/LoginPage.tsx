import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, Lock, Mail, ArrowRight, ArrowLeft, ShieldCheck, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { success, error } = useToast();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      error(isRTL ? 'براہ کرم اپنا ای میل درج کریں۔' : 'Please enter your email.');
      return;
    }

    setLoading(true);
    const res = await login(email.trim(), password);
    setLoading(false);

    if (res.success) {
      success(isRTL ? 'خوش آمدید! لاگ ان کامیاب رہا۔' : res.message);
      navigate(from, { replace: true });
    } else {
      error(isRTL ? 'ای میل یا پاس ورڈ درست نہیں ہے۔' : res.message);
    }
  };

  const handleQuickDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-800 flex items-center justify-center text-white mx-auto shadow-md">
          <BookOpen className="w-6 h-6 text-emerald-200" />
        </div>
        <h1 className="text-2xl font-bold font-serif-heading text-slate-900">
          {t('auth.loginTitle')}
        </h1>
        <p className="text-xs text-slate-500">
          {t('auth.loginSubtitle')}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">{t('auth.email')}</label>
            <div className="relative">
              <input
                id="input-login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="reader@maktabahaqanya.pk"
                className={`w-full bg-slate-50 border border-slate-200 rounded-xl ${
                  isRTL ? 'pr-9 pl-3.5' : 'pl-9 pr-3.5'
                } py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600`}
              />
              <Mail className={`w-4 h-4 text-slate-400 absolute top-3 ${isRTL ? 'right-3' : 'left-3'}`} />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">{t('auth.password')}</label>
            <div className="relative">
              <input
                id="input-login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full bg-slate-50 border border-slate-200 rounded-xl ${
                  isRTL ? 'pr-9 pl-3.5' : 'pl-9 pr-3.5'
                } py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600`}
              />
              <Lock className={`w-4 h-4 text-slate-400 absolute top-3 ${isRTL ? 'right-3' : 'left-3'}`} />
            </div>
          </div>

          <button
            id="btn-login-submit"
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <span>{loading ? (isRTL ? 'لاگ ان ہو رہا ہے...' : 'Signing In...') : t('auth.signInBtn')}</span>
            {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Demo Fast Logins */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            {t('auth.demoAccounts')}
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemo('ahmed@gmail.com')}
              className="p-2 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 rounded-xl text-center font-medium transition-colors"
            >
              {t('auth.customerDemo')}
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin@maktabahaqanya.pk')}
              className="p-2 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 rounded-xl text-center font-medium transition-colors"
            >
              {t('auth.adminDemo')}
            </button>
          </div>
        </div>

        <div className="text-center pt-2 text-xs text-slate-500">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="font-bold text-emerald-700 hover:underline">
            {t('auth.registerLink')}
          </Link>
        </div>
      </div>
    </div>
  );
};

