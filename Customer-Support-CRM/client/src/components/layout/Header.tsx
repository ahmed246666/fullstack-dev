'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Globe,
  ShieldCheck,
  Sliders,
  History,
  LogOut,
  Ticket,
  Users,
  BookOpen,
  Loader2,
  X,
  ArrowRight,
  Menu
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAgent } from '@/context/AgentContext';
import { SLAPolicyDrawer } from '@/components/sla/SLAPolicyDrawer';
import { AuditLogsDrawer } from '@/components/admin/AuditLogsDrawer';
import { api } from '@/lib/api';

interface HeaderProps {
  onToggleMobileSidebar?: () => void;
}

export function Header({ onToggleMobileSidebar }: HeaderProps) {
  const router = useRouter();
  const { lang, toggleLanguage, t } = useLanguage();
  const { currentAgent, isAdmin, logout } = useAgent();
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
    router.push(`/${lang}/tickets?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const hasResults =
    searchResults.tickets.length > 0 ||
    searchResults.customers.length > 0 ||
    searchResults.articles.length > 0;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 sm:h-20 px-2.5 sm:px-6 lg:px-8 glass-panel border-b border-gold-500/20 bg-navy-950/95 backdrop-blur-md gap-2 sm:gap-4">
      {/* Left: Mobile Hamburger Toggle + Flexible Search Bar */}
      <div className="flex items-center gap-1.5 sm:gap-3 flex-1 min-w-0">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl border border-navy-750 bg-navy-900 text-slate-300 hover:text-gold-300 hover:border-gold-500/40 transition-colors shrink-0"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5 text-gold-400 shrink-0" />
          </button>
        )}

        {/* Global Search Bar with Live Omnisearch Popover */}
        <div ref={searchContainerRef} className="relative flex-1 min-w-0 max-w-[150px] xs:max-w-[210px] sm:max-w-xs md:max-w-sm lg:max-w-md">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            {isSearching ? (
              <Loader2 className="absolute left-2.5 rtl:right-2.5 rtl:left-auto top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-400 animate-spin shrink-0" />
            ) : (
              <Search className="absolute left-2.5 rtl:right-2.5 rtl:left-auto top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-400/70 shrink-0" />
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
              className="w-full bg-navy-900/90 border border-navy-750 rounded-full pl-8 pr-6 rtl:pr-8 rtl:pl-6 sm:pl-9 sm:pr-7 sm:rtl:pr-9 sm:rtl:pl-7 py-1.5 sm:py-2 text-[11px] sm:text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-gold-500/70 focus:ring-1 focus:ring-gold-500/40 transition-all font-sans truncate"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-2 rtl:left-2 rtl:right-auto top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            )}
          </form>

          {/* Live Search Results Dropdown */}
          {isSearchOpen && searchQuery.trim().length >= 2 && (
            <div className="fixed sm:absolute left-3 right-3 sm:left-0 sm:right-auto sm:rtl:right-0 sm:rtl:left-auto top-18 sm:top-full mt-2 sm:w-[420px] max-w-full sm:max-w-md max-h-[75vh] sm:max-h-[480px] overflow-y-auto glass-panel bg-navy-900 border border-gold-500/30 rounded-3xl p-3 shadow-2xl space-y-3 z-50 animate-in fade-in zoom-in-95 duration-100 font-sans">
              {isSearching && !hasResults && (
                <div className="py-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gold-400 shrink-0" />
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
                    <Ticket className="w-3 h-3 shrink-0" />
                    <span>{lang === 'ar' ? 'التذاكر المطابقة' : 'Tickets'}</span>
                  </div>
                  {searchResults.tickets.map((t) => (
                    <Link
                      key={t.id}
                      href={`/${lang}/tickets?search=${encodeURIComponent(t.ticketNumber)}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-navy-800 text-xs text-slate-200 hover:text-white transition-colors group"
                    >
                      <div className="flex-1 truncate pr-2 rtl:pl-2 rtl:pr-0">
                        <div className="font-bold text-gold-300 font-mono text-[11px]">
                          {t.ticketNumber}
                        </div>
                        <div className="text-slate-300 text-xs truncate">{t.title}</div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 rtl:rotate-180 group-hover:text-gold-400 shrink-0" />
                    </Link>
                  ))}
                </div>
              )}

              {/* Customer Profiles Matches */}
              {searchResults.customers.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-navy-800">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400 px-2 flex items-center gap-1">
                    <Users className="w-3 h-3 shrink-0" />
                    <span>{lang === 'ar' ? 'ملفات العملاء 360' : 'Customers'}</span>
                  </div>
                  {searchResults.customers.map((c) => (
                    <Link
                      key={c.id}
                      href={`/${lang}/customers?search=${encodeURIComponent(c.name)}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-navy-800 text-xs text-slate-200 hover:text-white transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img
                          src={c.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={c.name}
                          className="w-6 h-6 rounded-lg object-cover shrink-0"
                        />
                        <div className="truncate">
                          <div className="font-bold text-slate-100 text-xs truncate">
                            {lang === 'ar' ? c.nameAr || c.name : c.name}
                          </div>
                          <div className="text-[10.5px] text-slate-400 truncate">{c.company || c.email}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold font-mono text-purple-400 shrink-0 uppercase">
                        [{c.tier}]
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Knowledge Base Articles Matches */}
              {searchResults.articles.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-navy-800">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-2 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 shrink-0" />
                    <span>{lang === 'ar' ? 'مقالات قاعدة المعرفة' : 'Knowledge Guides'}</span>
                  </div>
                  {searchResults.articles.map((a) => (
                    <Link
                      key={a.id}
                      href={`/${lang}/knowledge-base?search=${encodeURIComponent(a.title)}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-navy-800 text-xs text-slate-200 hover:text-white transition-colors"
                    >
                      <div className="truncate pr-2 rtl:pl-2 rtl:pr-0">
                        <div className="font-bold text-slate-100 text-xs truncate">
                          {lang === 'ar' && a.titleAr ? a.titleAr : a.title}
                        </div>
                        <div className="text-[10.5px] text-slate-400">
                          {a.category} • 👍 {a.helpfulCount || 0}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 rtl:rotate-180 shrink-0" />
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
      </div>

      {/* Right Actions: Audit, SLA, Language, Agent Switcher, Logout */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 shrink-0">
        {/* Admin Audit Trail Button */}
        {isAdmin && (
          <button
            onClick={() => setIsAuditLogsOpen(true)}
            className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 text-gold-300 text-[13px] font-semibold transition-colors shrink-0 shadow-sm active:scale-95"
            title="System Audit Log Trail"
          >
            <History className="w-4 h-4 text-gold-400 shrink-0" />
            <span className="font-brand whitespace-nowrap">{lang === 'ar' ? 'سجل التدقيق' : 'Audit Logs'}</span>
          </button>
        )}

        {/* SLA Status & Config Button (Admin Only) */}
        {isAdmin ? (
          <button
            onClick={() => setIsSLAPolicyOpen(true)}
            className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-400 text-[13px] font-semibold transition-colors shrink-0 shadow-sm active:scale-95"
            title="Configure SLA Policy Targets"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="whitespace-nowrap">SLA Engine</span>
            <Sliders className="w-4 h-4 text-emerald-400 ml-1 rtl:mr-1 rtl:ml-0 shrink-0" />
          </button>
        ) : (
          <div className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-navy-900 border border-navy-750 text-slate-300 text-xs font-medium shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="whitespace-nowrap">SLA Active</span>
          </div>
        )}

        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl border border-navy-750 bg-navy-900/90 hover:border-gold-500/40 text-gold-300 hover:text-gold-200 text-xs sm:text-[13px] font-semibold transition-all font-brand shrink-0 active:scale-95 shadow-sm"
          title="Switch Language / تغيير اللغة"
        >
          <Globe className="w-4 h-4 text-gold-400 shrink-0" />
          <span className="hidden sm:inline whitespace-nowrap">{lang === 'en' ? 'العربية' : 'English'}</span>
          <span className="sm:hidden font-mono text-xs font-bold">{lang === 'en' ? 'ع' : 'EN'}</span>
        </button>

        {/* Agent Profile Selector */}
        <div className="flex items-center gap-2.5 p-1 sm:p-1.5 sm:px-3.5 rounded-2xl border border-navy-750 bg-navy-900/80 shrink-0">
          <img
            src={currentAgent.avatarUrl}
            alt={currentAgent.name}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1 sm:ring-2 ring-gold-500/30 shrink-0"
          />
          <div className="hidden xl:block text-left rtl:text-right text-xs">
            <div className="font-bold text-white flex items-center gap-1 font-brand whitespace-nowrap">
              {lang === 'ar' ? currentAgent.nameAr : currentAgent.name}
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400 shrink-0" />
            </div>
            <div className="text-[11px] text-gold-300/80 font-medium whitespace-nowrap">
              {currentAgent.department} • {currentAgent.role}
            </div>
          </div>
        </div>

        {/* Explicit Logout Button */}
        <button
          onClick={() => {
            logout();
            window.location.href = `/${lang}/login`;
          }}
          className="flex items-center gap-2 p-2 sm:px-3.5 sm:py-2 rounded-xl border border-rose-500/30 bg-rose-950/20 hover:bg-rose-900/40 text-rose-300 hover:text-rose-200 text-xs sm:text-[13px] font-semibold transition-all shadow-sm shrink-0 active:scale-95"
          title="Sign Out / تسجيل الخروج"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden md:inline font-brand whitespace-nowrap">{lang === 'ar' ? 'خروج' : 'Log Out'}</span>
        </button>
      </div>

      {/* SLA Policy Config Drawer */}
      <SLAPolicyDrawer isOpen={isSLAPolicyOpen} onClose={() => setIsSLAPolicyOpen(false)} />

      {/* Audit Logs Drawer */}
      <AuditLogsDrawer isOpen={isAuditLogsOpen} onClose={() => setIsAuditLogsOpen(false)} />
    </header>
  );
}
