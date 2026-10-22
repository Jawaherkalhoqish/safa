import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LangContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem('safa_lang') || 'ar';
    } catch (e) {
      return 'ar';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('safa_lang', lang);
    } catch (e) {
      /* ignore */
    }
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      isAr: lang === 'ar',
      dir: lang === 'ar' ? 'rtl' : 'ltr',
      setLang,
      toggle: () => setLang((l) => (l === 'ar' ? 'en' : 'ar')),
      L: (ar, en) => (lang === 'ar' ? ar : en),
    }),
    [lang]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);