import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '../locales/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: string, defaultText?: string) => string;
  formatPrice: (amount: number) => string;
  translateCategory: (categoryName: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Urdu as explicitly requested by user, with fallback to saved preference
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('maktaba_language') as Language;
    if (saved && (saved === 'ur' || saved === 'en' || saved === 'ar')) {
      return saved;
    }
    return 'ur';
  });

  const isRTL = language === 'ur' || language === 'ar';

  useEffect(() => {
    // Set html dir and lang attributes for proper RTL support and font rendering
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    localStorage.setItem('maktaba_language', language);
  }, [language, isRTL]);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
  };

  const t = (key: string, defaultText?: string): string => {
    const dict = translations[language];
    if (dict && dict[key]) {
      return dict[key];
    }
    // Fallback to English dictionary if key missing
    if (translations.en[key]) {
      return translations.en[key];
    }
    return defaultText || key;
  };

  const formatPrice = (amount: number): string => {
    const formatted = Math.round(amount).toLocaleString('en-US');
    if (language === 'ur') {
      return `${formatted} روپے`;
    }
    if (language === 'ar') {
      return `${formatted} روبية`;
    }
    return `Rs. ${formatted}`;
  };

  const translateCategory = (categoryName: string): string => {
    const key = `cat.${categoryName}`;
    const translated = t(key);
    return translated !== key ? translated : categoryName;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isRTL,
        t,
        formatPrice,
        translateCategory
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
