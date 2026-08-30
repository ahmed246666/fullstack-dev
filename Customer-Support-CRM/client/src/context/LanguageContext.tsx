'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import enMessages from '@/messages/en.json';
import arMessages from '@/messages/ar.json';

export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  lang: Language;
  dir: Direction;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const messageCatalogs: Record<Language, Record<string, string>> = {
  en: enMessages,
  ar: arMessages
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLocale
}: {
  children: React.ReactNode;
  initialLocale?: Language;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Detect locale from pathname or initialLocale
  const detectedLocaleFromPath = pathname?.startsWith('/ar') ? 'ar' : 'en';
  const [lang, setLang] = useState<Language>(initialLocale || detectedLocaleFromPath);

  const dir: Direction = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    try {
      const saved = localStorage.getItem('azm_crm_lang');
      if (saved === 'ar' || saved === 'en') {
        if (!pathname?.startsWith('/' + saved)) {
          setLang(saved as Language);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (pathname?.startsWith('/ar') && lang !== 'ar') {
      setLang('ar');
    } else if (pathname?.startsWith('/en') && lang !== 'en') {
      setLang('en');
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = dir;
    }
    try {
      localStorage.setItem('azm_crm_lang', lang);
    } catch {}
  }, [lang, dir]);

  const toggleLanguage = () => {
    const nextLang: Language = lang === 'en' ? 'ar' : 'en';
    setLang(nextLang);
    try {
      localStorage.setItem('azm_crm_lang', nextLang);
    } catch {}

    if (pathname) {
      const segments = pathname.split('/').filter(Boolean);
      if (segments[0] === 'en' || segments[0] === 'ar') {
        segments[0] = nextLang;
      } else {
        segments.unshift(nextLang);
      }
      const newPath = '/' + segments.join('/');
      router.push(newPath);
    }
  };

  const setLanguage = (newLang: Language) => {
    setLang(newLang);
    try {
      localStorage.setItem('azm_crm_lang', newLang);
    } catch {}

    if (pathname) {
      const segments = pathname.split('/').filter(Boolean);
      if (segments[0] === 'en' || segments[0] === 'ar') {
        segments[0] = newLang;
      } else {
        segments.unshift(newLang);
      }
      const newPath = '/' + segments.join('/');
      router.push(newPath);
    }
  };

  const t = (key: string): string => {
    const currentMessages = messageCatalogs[lang] || messageCatalogs.en;
    if (currentMessages[key]) {
      return currentMessages[key];
    }
    const fallbackMessages = messageCatalogs.en;
    if (fallbackMessages[key]) {
      return fallbackMessages[key];
    }
    return key;
  };

  const currentMessages = messageCatalogs[lang] || messageCatalogs.en;

  return (
    <LanguageContext.Provider value={{ lang, dir, toggleLanguage, setLanguage, t }}>
      <NextIntlClientProvider locale={lang} messages={currentMessages}>
        {children}
      </NextIntlClientProvider>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
