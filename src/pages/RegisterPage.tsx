import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, User, Mail, Phone, Lock, ArrowRight, ArrowLeft } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { success, error } = useToast();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      error(isRTL ? 'براہ کرم تمام ضروری خانے پُر کریں۔' : 'Please complete all required fields.');
      return;
    }

    setLoading(true);
    const res = await register(name.trim(), email.trim(), phone.trim(), password);
    setLoading(false);

    if (res.success) {
      success(isRTL ? 'اکاؤنٹ کامیابی سے بن گیا!' : 'Account registered successfully!');
      navigate('/books');
    } else {
      error(res.message);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-800 flex items-center justify-center text-white mx-auto shadow-md">
          <BookOpen className="w-6 h-6 text-emerald-200" />
        </div>
        <h1 className="text-2xl font-bold font-serif-heading text-slate-900">
          {t('auth.registerTitle')}
        </h1>
        <p className="text-xs text-slate-500">
          {t('auth.registerSubtitle')}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">{t('checkout.fullName')} *</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Muhammad Tariq"
                className={`w-full bg-slate-50 border border-slate-200 rounded-xl ${
                  isRTL ? 'pr-9 pl-3.5' : 'pl-9 pr-3.5'
                } py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600`}
              />
              <User className={`w-4 h-4 text-slate-400 absolute top-3 ${isRTL ? 'right-3' : 'left-3'}`} />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">{t('auth.email')} *</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tariq@gmail.com"
                className={`w-full bg-slate-50 border border-slate-200 rounded-xl ${
                  isRTL ? 'pr-9 pl-3.5' : 'pl-9 pr-3.5'
                } py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600`}
              />
              <Mail className={`w-4 h-4 text-slate-400 absolute top-3 ${isRTL ? 'right-3' : 'left-3'}`} />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">{t('profile.phone')}</label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0300-1234567"
                className={`w-full bg-slate-50 border border-slate-200 rounded-xl ${
                  isRTL ? 'pr-9 pl-3.5' : 'pl-9 pr-3.5'
                } py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600`}
              />
              <Phone className={`w-4 h-4 text-slate-400 absolute top-3 ${isRTL ? 'right-3' : 'left-3'}`} />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">{t('auth.password')} *</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full bg-slate-50 border border-slate-200 rounded-xl ${
                  isRTL ? 'pr-9 pl-3.5' : 'pl-9 pr-3.5'
                } py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600`}
              />
              <Lock className={`w-4 h-4 text-slate-400 absolute top-3 ${isRTL ? 'right-3' : 'left-3'}`} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <span>{loading ? (isRTL ? 'اکاؤنٹ بن رہا ہے...' : 'Registering...') : t('auth.createAccountBtn')}</span>
            {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500">
          {t('auth.alreadyAccount')}{' '}
          <Link to="/login" className="font-bold text-emerald-700 hover:underline">
            {t('auth.loginLink')}
          </Link>
        </div>
      </div>
    </div>
  );
};

