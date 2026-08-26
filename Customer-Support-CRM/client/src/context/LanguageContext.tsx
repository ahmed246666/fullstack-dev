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
  // Branding & Platform
  appTitle: { en: 'AZM Support CRM', ar: 'منصة دعم عملاء عزم' },
  appSubtitle: {
    en: 'Enterprise Omnichannel Customer Platform',
    ar: 'المنصة المؤسسية الشاملة لخدمة ودعم العملاء'
  },
  welcomeBack: { en: 'Welcome back', ar: 'مرحباً بك مجدداً' },

  // Navigation
  navDashboard: { en: 'Dashboard', ar: 'لوحة التحكم' },
  navCustomers: { en: 'Customer 360', ar: 'إدارة العملاء 360' },
  navKanban: { en: 'Kanban Board', ar: 'لوحة كانبان' },
  navTickets: { en: 'All Tickets', ar: 'جميع التذاكر' },
  navWorkspace: { en: 'Agent Workspace', ar: 'منصة الردود والمعالجة' },
  navKnowledge: { en: 'Knowledge Base', ar: 'قاعدة المعرفة' },
  navAnalytics: { en: 'Analytics & SLA', ar: 'التقارير والـ SLA' },
  navPortal: { en: 'Public Portal', ar: 'بوابة الخدمة الذاتية' },
  navLogin: { en: 'Sign In / Switch Agent', ar: 'تسجيل الدخول / تبديل الحساب' },

  // Statuses
  status_NEW: { en: 'New', ar: 'جديد' },
  status_OPEN: { en: 'In Progress', ar: 'قيد المعالجة' },
  status_PENDING: { en: 'Pending Customer', ar: 'بانتظار العميل' },
  status_RESOLVED: { en: 'Resolved', ar: 'تم الحل' },
  status_CLOSED: { en: 'Closed', ar: 'مغلق نهائياً' },

  // Priorities
  priority_URGENT: { en: 'Urgent', ar: 'عاجل جداً' },
  priority_HIGH: { en: 'High', ar: 'أولوية عالية' },
  priority_MEDIUM: { en: 'Medium', ar: 'أولوية متوسطة' },
  priority_LOW: { en: 'Low', ar: 'أولوية منخفضة' },

  // Channels
  channel_EMAIL: { en: 'Email', ar: 'البريد الإلكتروني' },
  channel_WHATSAPP: { en: 'WhatsApp', ar: 'واتساب' },
  channel_LIVE_CHAT: { en: 'Live Chat', ar: 'المحادثة المباشرة' },
  channel_SMS: { en: 'SMS', ar: 'الرسائل النصية (SMS)' },
  channel_WEB_FORM: { en: 'Web Portal', ar: 'بوابة الدعم' },

  // SLA States
  sla_ON_TRACK: { en: 'On Track', ar: 'ضمن الوقت المستهدف' },
  sla_APPROACHING_BREACH: { en: 'Approaching Breach', ar: 'يقترب من التجاوز' },
  sla_BREACHED: { en: 'SLA Breached', ar: 'تجاوز اتفاقية SLA' },
  sla_RESOLVED_ON_TIME: { en: 'Resolved on Time', ar: 'تم الحل ضمن الوقت' },
  sla_RESOLVED_LATE: { en: 'Resolved Late', ar: 'تم الحل بعد التجاوز' },

  // Customer Tiers
  tier_ENTERPRISE: { en: 'Enterprise', ar: 'مؤسسي (Enterprise)' },
  tier_VIP: { en: 'VIP Account', ar: 'حساب VIP' },
  tier_STANDARD: { en: 'Standard', ar: 'حساب قياسي' },

  // Metrics & KPI Headers
  kpiTotalTickets: { en: 'Total Tickets', ar: 'إجمالي التذاكر' },
  kpiOpenTickets: { en: 'Active Open Queue', ar: 'التذاكر قيد المعالجة' },
  kpiSLACompliance: { en: 'SLA Compliance Rate', ar: 'نسبة الالتزام بالـ SLA' },
  kpiCSATAverage: { en: 'Customer CSAT Score', ar: 'معدل رضا العملاء' },
  recentTicketsTitle: { en: 'Recent Omnichannel Tickets', ar: 'أحدث التذاكر متعددة القنوات' },
  quickActions: { en: 'Quick Actions', ar: 'إجراءات سريعة' },
  newTicketBtn: { en: 'New Ticket', ar: 'إنشاء تذكرة جديدة' },
  searchPlaceholder: {
    en: 'Search tickets, customers, or articles...',
    ar: 'ابحث عن التذاكر، العملاء، أو المقالات...'
  },
  activeAgent: { en: 'Active Specialist', ar: 'الموظف المسؤول' },
  switchLang: { en: 'العربية', ar: 'English' },

  // Customer 360 Module
  customerTitle: { en: 'Customer 360 Profiles', ar: 'ملفات العملاء الشاملة (360)' },
  customerSubtitle: {
    en: 'Unified view of enterprise accounts, touchpoint history & tickets.',
    ar: 'رؤية موحدة للحسابات وسجل التفاعل والتذاكر عبر القنوات.'
  },
  customerAddBtn: { en: 'Add Customer', ar: 'إضافة عميل جديد' },
  customerSearchPlaceholder: {
    en: 'Search by customer name, email or company...',
    ar: 'ابحث بالاسم، البريد أو الشركة...'
  },
  allTiers: { en: 'All Tiers', ar: 'جميع الفئات' },

  // Kanban Board Module
  kanbanTitle: { en: 'Omnichannel Kanban Board', ar: 'لوحة كانبان لإدارة التذاكر' },
  kanbanSubtitle: {
    en: 'Drag-and-drop workflow across 5 support lifecycle stages.',
    ar: 'سحب وإفلات تفاعلي للتذاكر عبر 5 مراحل لمعالجة الطلبات.'
  },

  // Workspace Module
  workspaceTitle: { en: 'Support Specialist Console', ar: 'منصة معالجة وتوجيه الردود' },
  workspaceSubtitle: {
    en: 'Interactive inbox queue with 1-click macro chips, AI Copilot & private internal notes.',
    ar: 'طابور المهام التفاعلي مع ردود سريعة جاهزة ومساعد الذكاء الاصطناعي والملاحظات الخاصة.'
  },
  internalNoteLabel: { en: 'Private Internal Note', ar: 'ملاحظة داخلية خاصة' },
  internalNotePlaceholder: {
    en: 'Add private note for support agents...',
    ar: 'أضف ملاحظة سرية لفريق الدعم...'
  },
  publicReplyPlaceholder: {
    en: 'Type public reply to send to customer...',
    ar: 'اكتب الرد المباشر الذي سيصل إلى العميل...'
  },
  sendReplyBtn: { en: 'Send Public Reply', ar: 'إرسال الرد للعميل' },
  saveNoteBtn: { en: 'Save Internal Note', ar: 'حفظ الملاحظة الخاصة' },

  // Knowledge Base Module
  kbTitle: { en: 'Knowledge Base & Help Center', ar: 'قاعدة المعرفة ودليل الإرشادات' },
  kbSubtitle: {
    en: 'Searchable technical guides with bilingual translations & helpfulness voting.',
    ar: 'مقالات وأدلة الدعم الفني ثنائية اللغة مع تصويت فوري على الفائدة.'
  },
  kbNewArticle: { en: 'New Article', ar: 'كتابة مقال جديد' },
  allCategories: { en: 'All Categories', ar: 'جميع الأقسام' },
  wasHelpfulQuestion: { en: 'Was this guide helpful?', ar: 'هل كان هذا الدليل مفيداً لك؟' },

  // Analytics Module
  analyticsTitle: {
    en: 'Executive Intelligence & SLA Dashboard',
    ar: 'لوحة التقارير التنفيذية والامتثال'
  },
  analyticsSubtitle: {
    en: 'Real-time performance metrics, omnichannel distribution, and specialist leaderboard.',
    ar: 'مؤشرات الأداء المباشرة، وتوزيع القنوات، ولوحة صدارة موظفي الدعم.'
  },

  // Common UI Actions
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  save: { en: 'Save Changes', ar: 'حفظ التعديلات' },
  close: { en: 'Close', ar: 'إغلاق' },
  loading: { en: 'Loading...', ar: 'جاري التحميل...' },
  viewAll: { en: 'View All', ar: 'عرض الكل' },
  filter: { en: 'Filter', ar: 'تصفية' }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  const dir: Direction = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    try {
      const saved = localStorage.getItem('azm_crm_lang');
      if (saved === 'ar' || saved === 'en') {
        setLang(saved);
      }
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    try {
      localStorage.setItem('azm_crm_lang', lang);
    } catch {}
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
