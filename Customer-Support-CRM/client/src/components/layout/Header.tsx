'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Globe,
  Bell,
  ChevronDown,
  ShieldCheck,
  Sparkles,
  Sliders,
  History,
  LogOut,
  LogIn
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAgent } from '@/context/AgentContext';
import { SLAPolicyDrawer } from '@/components/sla/SLAPolicyDrawer';
import { AuditLogsDrawer } from '@/components/admin/AuditLogsDrawer';

export function Header() {
  const { lang, toggleLanguage, t } = useLanguage();
  const { currentAgent, agents, isAdmin, switchAgent, logout } = useAgent();
  const [isSLAPolicyOpen, setIsSLAPolicyOpen] = useState(false);
  const [isAuditLogsOpen, setIsAuditLogsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-18 px-8 glass-panel border-b border-gold-500/20 bg-navy-950/90 backdrop-blur-md">
      {/* Global Search Bar */}
      <div className="flex items-center w-96">
        <div className="relative w-full">
          <Search className="absolute left-4 rtl:right-4 rtl:left-auto top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400/70" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="w-full bg-navy-900/90 border border-navy-750 rounded-full pl-11 pr-4 rtl:pr-11 rtl:pl-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-gold-500/70 focus:ring-1 focus:ring-gold-500/40 transition-all font-sans"
          />
        </div>
      </div>

      {/* Right Actions: SLA Ticker, Language Toggle, Agent Switcher */}
      <div className="flex items-center gap-3.5">
        {/* Admin Audit Trail Button */}
        {isAdmin && (
          <button
            onClick={() => setIsAuditLogsOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 text-gold-300 text-xs font-semibold transition-colors"
            title="System Audit Log Trail"
          >
            <History className="w-3.5 h-3.5 text-gold-400" />
            <span className="font-brand">سجل التدقيق</span>
          </button>
        )}

        {/* SLA Status & Config Button (Admin Only) */}
        {isAdmin ? (
          <button
            onClick={() => setIsSLAPolicyOpen(true)}
            className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition-colors"
            title="Configure SLA Policy Targets"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SLA Engine</span>
            <Sliders className="w-3.5 h-3.5 text-emerald-400 ml-1 rtl:mr-1 rtl:ml-0" />
          </button>
        ) : (
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-navy-900 border border-navy-750 text-slate-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>SLA Active (Agent View)</span>
          </div>
        )}

        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-navy-750 bg-navy-900/90 hover:border-gold-500/40 text-gold-300 hover:text-gold-200 text-xs font-semibold transition-colors font-brand"
          title="Switch Language / تغيير اللغة"
        >
          <Globe className="w-3.5 h-3.5 text-gold-400" />
          <span>{lang === 'en' ? 'العربية' : 'English'}</span>
        </button>

        {/* Agent Profile Selector */}
        <div className="flex items-center gap-2 p-1.5 px-3 rounded-2xl border border-navy-750 bg-navy-900/80">
          <img
            src={currentAgent.avatarUrl}
            alt={currentAgent.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-gold-500/30"
          />
          <div className="hidden lg:block text-left rtl:text-right text-xs">
            <div className="font-bold text-white flex items-center gap-1 font-brand">
              {lang === 'ar' ? currentAgent.nameAr : currentAgent.name}
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
            </div>
            <div className="text-[10.5px] text-gold-300/80 font-medium">
              {currentAgent.department} • {currentAgent.role}
            </div>
          </div>
        </div>

        {/* Explicit Logout Button */}
        <button
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-950/20 hover:bg-rose-900/40 text-rose-300 hover:text-rose-200 text-xs font-semibold transition-all shadow-sm"
          title="Sign Out / تسجيل الخروج"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-brand">{lang === 'ar' ? 'خروج' : 'Log Out'}</span>
        </button>
      </div>




      {/* SLA Policy Config Drawer */}
      <SLAPolicyDrawer isOpen={isSLAPolicyOpen} onClose={() => setIsSLAPolicyOpen(false)} />

      {/* Audit Logs Drawer */}
      <AuditLogsDrawer isOpen={isAuditLogsOpen} onClose={() => setIsAuditLogsOpen(false)} />
    </header>
  );
}
