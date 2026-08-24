import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { User, MapPin, Phone, Mail, Plus, CheckCircle2, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, updateProfile, saveAddress } = useAuth();
  const { success, error } = useToast();
  const { t, isRTL } = useLanguage();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isUpdating, setIsUpdating] = useState(false);

  // New Address modal/form state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addrLabel, setAddrLabel] = useState('Home');
  const [addrFullName, setAddrFullName] = useState(user?.name || '');
  const [addrPhone, setAddrPhone] = useState(user?.phone || '');
  const [addrProvince, setAddrProvince] = useState('Punjab');
  const [addrCity, setAddrCity] = useState('Lahore');
  const [addrArea, setAddrArea] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrPostal, setAddrPostal] = useState('');

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">{isRTL ? 'براہ کرم لاگ ان کریں' : 'Please Sign In'}</h2>
        <p className="text-xs text-slate-500">
          {isRTL ? 'پروفائل دیکھنے اور سنبھالنے کے لیے لاگ ان ہونا ضروری ہے۔' : 'You need to log in to view and manage your profile.'}
        </p>
        <Link to="/login" className="inline-block bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl">
          {t('nav.signIn')}
        </Link>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    const ok = await updateProfile({ name, phone });
    setIsUpdating(false);
    if (ok) {
      success(isRTL ? 'پروفائل کامیابی سے اپ ڈیٹ ہو گئی!' : 'Profile updated successfully!');
    } else {
      error(isRTL ? 'پروفائل اپ ڈیٹ نہیں ہو سکی۔' : 'Failed to update profile.');
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrStreet.trim() || !addrCity.trim()) {
      error(isRTL ? 'براہ کرم مکمل پتہ اور شہر درج کریں۔' : 'Please complete street address and city.');
      return;
    }

    const ok = await saveAddress({
      label: addrLabel,
      fullName: addrFullName,
      phone: addrPhone,
      province: addrProvince,
      city: addrCity,
      area: addrArea,
      address: addrStreet,
      postalCode: addrPostal,
      isDefault: (user.addresses || []).length === 0
    });

    if (ok) {
      success(isRTL ? 'ڈلیوری پتہ محفوظ کر لیا گیا!' : 'Delivery address saved!');
      setShowAddAddress(false);
      setAddrStreet('');
      setAddrArea('');
    } else {
      error(isRTL ? 'پتہ محفوظ کرنے میں خرابی ہوئی۔' : 'Failed to save address.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
          alt={user.name}
          className="w-20 h-20 rounded-full border-2 border-emerald-500 object-cover shadow-md"
        />
        <div className={`space-y-1 text-center ${isRTL ? 'sm:text-right' : 'sm:text-left'}`}>
          <div className={`flex items-center justify-center ${isRTL ? 'sm:justify-start flex-row-reverse' : 'sm:justify-start'} gap-2`}>
            <h1 className="text-xl sm:text-2xl font-bold font-serif-heading text-slate-900">{user.name}</h1>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              {user.role}
            </span>
          </div>
          <p className="text-xs text-slate-500">{user.email} • {user.phone || (isRTL ? 'فون نمبر درج نہیں' : 'No phone set')}</p>
          <p className="text-[11px] text-slate-400">
            {isRTL ? `مکتبہ حقانیہ پر شمولیت: ${new Date(user.createdAt).toLocaleDateString()}` : `Member of Maktaba Haqanya since ${new Date(user.createdAt).toLocaleDateString()}`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Profile Settings */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-700" /> {t('profile.personalDetails')}
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">{t('checkout.fullName')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">{t('profile.email')}</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">{t('profile.phone')}</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0300-1234567"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-xs"
            >
              {isUpdating ? (isRTL ? 'محفوظ ہو رہا ہے...' : 'Saving...') : t('profile.saveChanges')}
            </button>
          </form>
        </div>

        {/* Saved Shipping Addresses */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700" /> {t('profile.savedAddresses')}
            </h3>
            <button
              onClick={() => setShowAddAddress(!showAddAddress)}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> {t('profile.addNew')}
            </button>
          </div>

          {/* Add address form toggle */}
          {showAddAddress && (
            <form onSubmit={handleSaveAddress} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in">
              <h4 className="font-bold text-xs text-slate-800">
                {isRTL ? 'نیا پاکستانی پتہ درج کریں' : 'Add New Pakistan Address'}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder={isRTL ? 'لیبل (مثلاً: گھر / دفتر)' : 'Label (e.g. Home / Office)'}
                  value={addrLabel}
                  onChange={(e) => setAddrLabel(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg p-2 text-xs"
                />
                <input
                  type="text"
                  placeholder={t('checkout.city')}
                  value={addrCity}
                  onChange={(e) => setAddrCity(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg p-2 text-xs"
                />
              </div>
              <input
                type="text"
                placeholder={t('checkout.address')}
                value={addrStreet}
                onChange={(e) => setAddrStreet(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddAddress(false)}
                  className="text-xs text-slate-500 px-3 py-1.5"
                >
                  {isRTL ? 'منسوخ' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 text-white font-bold text-xs px-4 py-1.5 rounded-lg"
                >
                  {isRTL ? 'محفوظ کریں' : 'Save'}
                </button>
              </div>
            </form>
          )}

          {/* Address List */}
          <div className="space-y-3">
            {user.addresses && user.addresses.length > 0 ? (
              user.addresses.map((addr) => (
                <div key={addr.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        {t('profile.default')}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600">{addr.address}, {addr.area}</p>
                  <p className="text-slate-600">{addr.city}, {addr.province}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">
                {isRTL ? 'ابھی تک کوئی پتہ محفوظ نہیں ہے۔' : 'No saved addresses yet.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

