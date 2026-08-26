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
  Layers
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

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
    <aside className="w-64 min-h-screen glass-panel border-r rtl:border-l rtl:border-r-0 border-slate-800/80 bg-slate-950/95 flex flex-col justify-between p-4">
      <div>
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 px-3 py-4 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-azm flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-slate-100 tracking-tight flex items-center gap-1.5">
              <span>AZM SQUAD</span>
              <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-bold">CRM</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Customer Support Platform</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="p-3.5 rounded-2xl glass-panel bg-slate-900/60 border border-slate-800/60 text-xs">
        <div className="flex items-center gap-2 text-indigo-400 font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Support Copilot</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          OpenAPI 3.0 TypeScript contract connected on port 5000.
        </p>
      </div>
    </aside>
  );
}
