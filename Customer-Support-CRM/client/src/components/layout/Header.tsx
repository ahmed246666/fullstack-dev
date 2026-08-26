'use client';

import React from 'react';
import { Search, Globe, Bell, ChevronDown, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAgent } from '@/context/AgentContext';

export function Header() {
  const { lang, toggleLanguage, t } = useLanguage();
  const { currentAgent, agents, switchAgent } = useAgent();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      {/* Global Search Bar */}
      <div className="flex items-center w-96">
        <div className="relative w-full">
          <Search className="absolute left-3.5 rtl:right-3.5 rtl:left-auto top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Right Actions: SLA Ticker, Language Toggle, Agent Switcher */}
      <div className="flex items-center gap-4">
        {/* SLA Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>SLA: 100% On-Track</span>
        </div>

        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          title="Switch Language / تغيير اللغة"
        >
          <Globe className="w-3.5 h-3.5 text-indigo-400" />
          <span>{lang === 'en' ? 'العربية' : 'English'}</span>
        </button>

        {/* Agent Profile Selector */}
        <div className="relative group">
          <div className="flex items-center gap-3 p-1.5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 cursor-pointer transition-colors">
            <img
              src={currentAgent.avatarUrl}
              alt={currentAgent.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
            <div className="hidden lg:block text-left rtl:text-right text-xs">
              <div className="font-bold text-slate-100 flex items-center gap-1">
                {lang === 'ar' ? currentAgent.nameAr : currentAgent.name}
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="text-[10px] text-slate-400 font-medium">{currentAgent.department} • {currentAgent.role}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1 rtl:ml-1 rtl:mr-0" />
          </div>

          {/* Dropdown Menu */}
          <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-56 glass-panel bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl hidden group-hover:block animate-in fade-in zoom-in-95 duration-100 z-50">
            <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {t('activeAgent')}
            </div>
            {agents.map(a => (
              <button
                key={a.id}
                onClick={() => switchAgent(a.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left rtl:text-right transition-colors ${
                  currentAgent.id === a.id ? 'bg-indigo-600/20 text-indigo-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <img src={a.avatarUrl} alt={a.name} className="w-6 h-6 rounded-full object-cover" />
                <div>
                  <div>{lang === 'ar' ? a.nameAr : a.name}</div>
                  <div className="text-[10px] text-slate-400">{a.department} ({a.role})</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
