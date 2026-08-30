'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

import { useRouter } from 'next/navigation';
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
  LogIn,
  Ticket,
  Users,
  BookOpen,
  Loader2,
  X,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

import { useAgent } from '@/context/AgentContext';
import { SLAPolicyDrawer } from '@/components/sla/SLAPolicyDrawer';

import { AuditLogsDrawer } from '@/components/admin/AuditLogsDrawer';
import { api } from '@/lib/api';

export function Header() {
  const router = useRouter();
  const { lang, toggleLanguage, t } = useLanguage();
  const { currentAgent, agents, isAdmin, switchAgent, logout } = useAgent();
  const [isSLAPolicyOpen, setIsSLAPolicyOpen] = useState(false);
  const [isAuditLogsOpen, setIsAuditLogsOpen] = useState(false);



  // Global Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    tickets: any[];
    customers: any[];
    articles: any[];
  }>({ tickets: [], customers: [], articles: [] });
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced search fetcher
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults({ tickets: [], customers: [], articles: [] });
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setIsSearchOpen(true);

    const timer = setTimeout(async () => {
      try {
        const [ticketsRes, customersRes, kbRes] = await Promise.all([
          api.getTickets({ search: searchQuery.trim(), limit: 4 }),
          api.getCustomers({ search: searchQuery.trim(), limit: 4 }),
          api.getKnowledgeArticles({ search: searchQuery.trim() })
        ]);

        setSearchResults({
          tickets: ticketsRes.data || [],
          customers: customersRes.data || [],
          articles: (kbRes.data || []).slice(0, 4)
        });
      } catch (err) {
        console.error('Global search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close search popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    router.push(`/tickets?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const hasResults =
    searchResults.tickets.length > 0 ||
    searchResults.customers.length > 0 ||
    searchResults.articles.length > 0;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-18 px-8 glass-panel border-b border-gold-500/20 bg-navy-950/90 backdrop-blur-md">
      {/* Global Search Bar with Live Omnisearch Popover */}
      <div ref={searchContainerRef} className="relative w-80 sm:w-96">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          {isSearching ? (
            <Loader2 className="absolute left-4 rtl:right-4 rtl:left-auto top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400 animate-spin" />
          ) : (
            <Search className="absolute left-4 rtl:right-4 rtl:left-auto top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400/70" />
          )}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => {
              if (searchQuery.trim().length >= 2) setIsSearchOpen(true);
            }}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-navy-900/90 border border-navy-750 rounded-full pl-11 pr-9 rtl:pr-11 rtl:pl-9 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-gold-500/70 focus:ring-1 focus:ring-gold-500/40 transition-all font-sans"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute right-3.5 rtl:left-3.5 rtl:right-auto top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Live Search Results Dropdown */}
        {isSearchOpen && searchQuery.trim().length >= 2 && (
          <div className="absolute left-0 rtl:right-0 rtl:left-auto mt-2 w-[340px] sm:w-[420px] max-h-[480px] overflow-y-auto glass-panel bg-navy-900 border border-gold-500/30 rounded-3xl p-3 shadow-2xl space-y-3 z-50 animate-in fade-in zoom-in-95 duration-100 font-sans">
            {isSearching && !hasResults && (
              <div className="py-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                <span>{lang === 'ar' ? 'جاري البحث...' : 'Searching...'}</span>
              </div>
            )}

            {!isSearching && !hasResults && (
              <div className="py-6 text-center text-xs text-slate-400 font-sans">
                {lang === 'ar'
                  ? `لا توجد نتائج مطابقة لـ "${searchQuery}"`
                  : `No results found for "${searchQuery}"`}
              </div>
            )}

            {/* Tickets Matches */}
            {searchResults.tickets.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 px-2 flex items-center gap-1">
                  <Ticket className="w-3 h-3" />
                  <span>{lang === 'ar' ? 'التذاكر المطابقة' : 'Tickets'}</span>
                </div>
                {searchResults.tickets.map((t) => (
                  <Link
                    key={t.id}
                    href={`/tickets?search=${encodeURIComponent(t.ticketNumber)}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-navy-800 border border-transparent hover:border-gold-500/30 transition-all text-xs"
                  >
                    <div className="min-w-0 pr-2 rtl:pl-2 rtl:pr-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-gold-300 text-[11px]">
                          {t.ticketNumber}
                        </span>
                        <span className="text-slate-200 truncate font-medium text-xs">
                          {t.title}
                        </span>
                      </div>
                      <div className="text-[10.5px] text-slate-400 truncate">
                        {lang === 'ar' && t.customer?.nameAr
                          ? t.customer.nameAr
                          : t.customer?.name}{' '}
                        • {t.priority}
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono shrink-0">
                      {t.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {/* Customer Matches */}
            {searchResults.customers.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-navy-800">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gold-400 px-2 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{lang === 'ar' ? 'العملاء' : 'Customers'}</span>
                </div>
                {searchResults.customers.map((c) => (
                  <Link
                    key={c.id}
                    href={`/customers?search=${encodeURIComponent(c.name)}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-navy-800 border border-transparent hover:border-gold-500/30 transition-all text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-white text-xs">
                        {lang === 'ar' && c.nameAr ? c.nameAr : c.name}
                      </div>
                      <div className="text-[10.5px] text-slate-400 truncate">
                        {c.company || c.email} • Tier {c.tier}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 rtl:rotate-180" />
                  </Link>
                ))}
              </div>
            )}

            {/* Knowledge Base Matches */}
            {searchResults.articles.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-navy-800">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-2 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  <span>{lang === 'ar' ? 'قاعدة المعرفة' : 'Knowledge Base'}</span>
                </div>
                {searchResults.articles.map((a) => (
                  <Link
                    key={a.id}
                    href={`/knowledge-base?search=${encodeURIComponent(a.title)}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-navy-800 border border-transparent hover:border-gold-500/30 transition-all text-xs"
                  >
                    <div className="min-w-0 pr-2 rtl:pl-2 rtl:pr-0">
                      <div className="font-bold text-slate-100 text-xs truncate">
                        {lang === 'ar' && a.titleAr ? a.titleAr : a.title}
                      </div>
                      <div className="text-[10.5px] text-slate-400">
                        {a.category} • 👍 {a.helpfulVotes || 0}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 rtl:rotate-180" />
                  </Link>
                ))}
              </div>
            )}

            {/* View Full Results Footer */}
            <div className="pt-2 border-t border-navy-800 text-center">
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="text-[11px] font-semibold text-gold-400 hover:text-gold-300 hover:underline"
              >
                {lang === 'ar'
                  ? `عرض جميع النتائج في جدول التذاكر ↵`
                  : `Press Enter to view full ticket results ↵`}
              </button>
            </div>
          </div>
        )}
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
            <span className="font-brand">{lang === 'ar' ? 'سجل التدقيق' : 'Audit Logs'}</span>
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
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-rose-500/30 bg-rose-950/20 hover:bg-rose-900/40 text-rose-300 hover:text-rose-200 text-xs font-semibold transition-all shadow-sm"
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


