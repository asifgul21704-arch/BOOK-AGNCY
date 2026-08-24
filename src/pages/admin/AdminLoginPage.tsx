import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { BookOpen, Lock, Mail, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@maktabahaqanya.pk');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email.trim(), password, true);
    setLoading(false);

    if (res.success) {
      success('Logged in to Maktaba Haqanya Admin Portal!');
      navigate('/admin');
    } else {
      error(res.message);
    }
  };

  const handleFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-slate-100">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-950/50">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold font-serif-heading text-white">
            Maktaba Haqanya Admin
          </h1>
          <p className="text-xs text-slate-400">
            Owner &amp; Inventory Management Portal (Urdu Bazaar Lahore)
          </p>
        </div>

        <form onSubmit={handleAdminSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold text-xs sm:text-sm py-3 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In as Admin'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Fast Admin Demos */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            One-Click Admin Credentials
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleFill('admin@maktabahaqanya.pk')}
              className="p-2.5 bg-slate-800 hover:bg-emerald-900/60 border border-slate-700 rounded-xl text-center font-bold text-emerald-300 transition-colors"
            >
              Super Admin
            </button>
            <button
              type="button"
              onClick={() => handleFill('manager@maktabahaqanya.pk')}
              className="p-2.5 bg-slate-800 hover:bg-emerald-900/60 border border-slate-700 rounded-xl text-center font-bold text-emerald-300 transition-colors"
            >
              Store Manager
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
