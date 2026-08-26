'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  lang: Language;
  dir: Direction;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, { en: string; ar: string }> = {
  // Branding
  appTitle: { en: 'AZM Support CRM', ar: 'منصة دعم عملاء عزم' },
  appSubtitle: {
    en: 'Enterprise Omnichannel Platform',
    ar: 'المنصة المؤسسية الشاملة لخدمة العملاء'
  },

  // Navigation
  navDashboard: { en: 'Dashboard', ar: 'لوحة التحكم' },
  navCustomers: { en: 'Customer 360', ar: 'إدارة العملاء 360' },
  navKanban: { en: 'Kanban Board', ar: 'لوحة كانبان' },
  navTickets: { en: 'All Tickets', ar: 'جميع التذاكر' },
  navWorkspace: { en: 'Agent Workspace', ar: 'مساحة عمل الوكيل' },
  navKnowledge: { en: 'Knowledge Base', ar: 'قاعدة المعرفة' },
  navAnalytics: { en: 'Analytics & SLA', ar: 'التقارير والـ SLA' },
  navPortal: { en: 'Public Portal', ar: 'بوابة الدعم الذاتي' },

  // Statuses
  status_NEW: { en: 'New', ar: 'جديد' },
  status_OPEN: { en: 'Open', ar: 'قيد المعالجة' },
  status_PENDING: { en: 'Pending', ar: 'معلق' },
  status_RESOLVED: { en: 'Resolved', ar: 'تم الحل' },
  status_CLOSED: { en: 'Closed', ar: 'مغلق' },

  // Priorities
  priority_URGENT: { en: 'Urgent', ar: 'عاجل جداً' },
  priority_HIGH: { en: 'High', ar: 'عالي' },
  priority_MEDIUM: { en: 'Medium', ar: 'متوسط' },
  priority_LOW: { en: 'Low', ar: 'منخفض' },

  // Channels
  channel_EMAIL: { en: 'Email', ar: 'البريد' },
  channel_WHATSAPP: { en: 'WhatsApp', ar: 'واتساب' },
  channel_LIVE_CHAT: { en: 'Live Chat', ar: 'المحادثة' },
  channel_SMS: { en: 'SMS', ar: 'رسائل قصيرة' },
  channel_WEB_FORM: { en: 'Web Portal', ar: 'بوابة الويب' },

  // SLA States
  sla_ON_TRACK: { en: 'On Track', ar: 'ضمن الوقت' },
  sla_APPROACHING_BREACH: { en: 'Approaching Breach', ar: 'يقترب من التجاوز' },
  sla_BREACHED: { en: 'SLA Breached', ar: 'تجاوز الوقت المحدد' },
  sla_RESOLVED_ON_TIME: { en: 'Resolved on Time', ar: 'تم الحل بالوقت' },

  // Metrics & Headers
  kpiTotalTickets: { en: 'Total Tickets', ar: 'إجمالي التذاكر' },
  kpiOpenTickets: { en: 'Active Queue', ar: 'التذاكر النشطة' },
  kpiSLACompliance: { en: 'SLA Compliance', ar: 'الالتزام بـ SLA' },
  kpiCSATAverage: { en: 'Customer CSAT', ar: 'رضا العملاء' },
  recentTicketsTitle: { en: 'Recent Omnichannel Tickets', ar: 'أحدث التذاكر متعددة القنوات' },
  quickActions: { en: 'Quick Actions', ar: 'إجراءات سريعة' },
  newTicketBtn: { en: 'New Ticket', ar: 'إنشاء تذكرة' },
  searchPlaceholder: {
    en: 'Search tickets, customers, or articles...',
    ar: 'ابحث عن التذاكر، العملاء، أو المقالات...'
  },
  activeAgent: { en: 'Active Agent', ar: 'الوكيل الحالي' },
  switchLang: { en: 'العربية', ar: 'English' }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  const dir: Direction = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const setLanguage = (newLang: Language) => {
    setLang(newLang);
  };

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][lang] || translations[key].en;
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ lang, dir, toggleLanguage, setLanguage, t }}>
      {children}
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
