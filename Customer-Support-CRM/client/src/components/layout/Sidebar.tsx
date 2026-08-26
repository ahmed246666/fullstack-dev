'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Kanban,
  Ticket,
  Headphones,
  BookOpen,
  BarChart3,
  ExternalLink,
  Sparkles,
  Layers,
  Crown,
  LogIn
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function Sidebar() {
  const pathname = usePathname();
  const { t, lang } = useLanguage();

  const navItems = [
    { labelKey: 'navDashboard', href: '/', icon: LayoutDashboard },
    { labelKey: 'navCustomers', href: '/customers', icon: Users },
    { labelKey: 'navKanban', href: '/tickets/kanban', icon: Kanban },
    { labelKey: 'navTickets', href: '/tickets', icon: Ticket },
    { labelKey: 'navWorkspace', href: '/workspace', icon: Headphones },
    { labelKey: 'navKnowledge', href: '/knowledge-base', icon: BookOpen },
    { labelKey: 'navAnalytics', href: '/analytics', icon: BarChart3 },
    { labelKey: 'navPortal', href: '/portal', icon: ExternalLink }
  ];

  return (
    <aside className="w-68 min-h-screen glass-panel border-r rtl:border-l rtl:border-r-0 border-gold-500/20 bg-navy-950/95 flex flex-col justify-between p-5">
      <div>
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3.5 px-3 py-4 mb-6 group cursor-pointer">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-gold-600 via-gold-500 to-gold-400 text-navy-950 flex items-center justify-center font-extrabold text-xl shadow-lg shadow-gold-500/20 group-hover:scale-105 transition-transform font-brand">
            عزم
          </div>
          <div>
            <h1 className="font-extrabold text-base text-white tracking-tight flex items-center gap-1.5 font-brand">
              <span>AZM CRM</span>
              <Crown className="w-3.5 h-3.5 text-gold-400" />
            </h1>
            <p className="text-xs text-gold-300/80 font-medium">Customer Support Platform</p>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-semibold transition-all duration-150 font-sans ${
                  isActive
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold shadow-md shadow-gold-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-navy-900/90 hover:border-gold-500/20 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-navy-950' : 'text-gold-400/80'}`} />
                <span className="font-medium tracking-wide">{t(item.labelKey)}</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-navy-800/80">
            <Link
              href="/login"
              className={`flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                pathname === '/login'
                  ? 'bg-gold-500/20 text-gold-300 border border-gold-500/30'
                  : 'text-slate-400 hover:text-gold-300 hover:bg-navy-900/60'
              }`}
            >
              <LogIn className="w-4 h-4 text-gold-400" />
              <span>{lang === 'ar' ? 'تسجيل الدخول / الحسابات' : 'Agent Login / Switch'}</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="p-4 rounded-2xl glass-panel bg-navy-900/80 border border-gold-500/20 text-xs space-y-1.5 shadow-lg">
        <div className="flex items-center gap-2 text-gold-300 font-bold font-brand text-xs">
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span>AZM AI Copilot Active</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
          Saudi Enterprise Bilingual Support CRM with 99.9% SLA enforcement.
        </p>
      </div>
    </aside>
  );
}
