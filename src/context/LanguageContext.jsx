import React, { createContext, useContext, useState } from 'react';
import { TRANSLATIONS } from '../translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem('dockmaster_lang');
      return saved === 'km' ? 'km' : 'en';
    } catch (e) {
      return 'km'; // Default or en
    }
  });

  const toggleLanguage = () => {
    setLang(prev => {
      const next = prev === 'en' ? 'km' : 'en';
      try {
        localStorage.setItem('dockmaster_lang', next);
      } catch (e) {}
      return next;
    });
  };

  const selectLanguage = (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem('dockmaster_lang', newLang);
    } catch (e) {}
  };

  // Translation helper function
  const t = (key, fallback = '') => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    if (dict && dict[key] !== undefined) {
      return dict[key];
    }
    // Fallback to English
    if (TRANSLATIONS.en && TRANSLATIONS.en[key] !== undefined) {
      return TRANSLATIONS.en[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, isKhmer: lang === 'km', toggleLanguage, selectLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      lang: 'en',
      isKhmer: false,
      toggleLanguage: () => {},
      selectLanguage: () => {},
      t: (k, fb) => fb || k,
    };
  }
  return context;
}
