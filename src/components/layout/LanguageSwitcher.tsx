import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../locales/translations';

interface Props {
  variant?: 'compact' | 'dropdown' | 'inline';
  className?: string;
}

export const LanguageSwitcher: React.FC<Props> = ({ variant = 'dropdown', className = '' }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; name: string; nativeName: string; flag: string }[] = [
    { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' }
  ];

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 ${className}`}>
        {languages.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLanguage(l.code)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              language === l.code
                ? 'bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{l.flag}</span>
            <span>{l.nativeName}</span>
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {languages.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setLanguage(l.code)}
            className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
              language === l.code
                ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
            title={l.name}
          >
            {l.nativeName}
          </button>
        ))}
      </div>
    );
  }

  // Default 'dropdown'
  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        id="btn-language-switcher"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition-all backdrop-blur-md"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-indigo-400" />
        <span className="flex items-center gap-1.5">
          <span>{currentLang.flag}</span>
          <span>{currentLang.nativeName}</span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-[#0c0d22]/95 backdrop-blur-2xl border border-white/15 shadow-2xl z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-white/5">
            {t('lang.select', 'Select Language')}
          </div>
          {languages.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setLanguage(l.code);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                language === l.code
                  ? 'bg-indigo-500/20 text-indigo-300 font-bold'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{l.flag}</span>
                <div className="text-left rtl:text-right">
                  <div className="font-semibold text-slate-100">{l.nativeName}</div>
                  <div className="text-[10px] text-slate-400">{l.name}</div>
                </div>
              </div>
              {language === l.code && <Check className="w-4 h-4 text-indigo-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
