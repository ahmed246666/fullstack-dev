'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldAlert, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';

interface SLABreachBannerProps {
  onSelectTicket?: (ticketId: string) => void;
}

export function SLABreachBanner({ onSelectTicket }: SLABreachBannerProps) {
  const { lang } = useLanguage();
  const [isDismissed, setIsDismissed] = useState(false);

  const { data } = useQuery({
    queryKey: ['sla-breach-check'],
    queryFn: () => api.getTickets({ limit: 100 }),
    refetchInterval: 30000
  });

  if (isDismissed) return null;

  const tickets = data?.data || [];
  const breachedTickets = tickets.filter(
    (t: any) => t.slaStatus === 'BREACHED' && t.status !== 'RESOLVED' && t.status !== 'CLOSED'
  );
  const approachingTickets = tickets.filter(
    (t: any) =>
      t.slaStatus === 'APPROACHING_BREACH' && t.status !== 'RESOLVED' && t.status !== 'CLOSED'
  );

  const totalCritical = breachedTickets.length + approachingTickets.length;
  if (totalCritical === 0) return null;

  const mostCritical = breachedTickets[0] || approachingTickets[0];

  return (
    <div className="mb-6 p-4 sm:p-5 rounded-2xl border bg-gradient-to-r from-rose-950/70 via-navy-950 to-amber-950/40 border-rose-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 mt-0.5 sm:mt-0">
          <ShieldAlert className="w-5 h-5 animate-pulse" />
        </div>
        <div className="space-y-1 min-w-0 flex-1">
          {/* Header & Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs sm:text-sm font-extrabold text-white font-brand whitespace-nowrap">
              {lang === 'ar' ? 'تنبيه SLA العاجل:' : 'Critical SLA Alert:'}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] font-bold whitespace-nowrap shrink-0">
              {breachedTickets.length} {lang === 'ar' ? 'تجاوزت الوقت' : 'Breached'}
            </span>
            {approachingTickets.length > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold whitespace-nowrap shrink-0">
                {approachingTickets.length} {lang === 'ar' ? 'أقل من ساعتين' : 'Approaching (<2h)'}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed break-words">
            {mostCritical ? (
              <span>
                {lang === 'ar' ? 'التذكرة رقم ' : 'Ticket '}
                <strong className="font-mono text-rose-300 font-bold">{mostCritical.ticketNumber}</strong>
                {': '}
                &quot;{mostCritical.title}&quot;{' '}
                {lang === 'ar'
                  ? 'تتطلب تدخلاً فورياً من الفريق.'
                  : 'requires immediate agent response.'}
              </span>
            ) : lang === 'ar' ? (
              'توجد تذاكر تقترب من وقت الإغلاق المحدد تعاقدياً.'
            ) : (
              'Support tickets approaching resolution threshold.'
            )}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
        {mostCritical && onSelectTicket ? (
          <button
            onClick={() => onSelectTicket(mostCritical.id)}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 font-brand whitespace-nowrap"
          >
            <span>{lang === 'ar' ? 'فحص التذكرة' : 'Inspect Ticket'}</span>
            <ChevronRight className="w-4 h-4 rtl:rotate-180 shrink-0" />
          </button>
        ) : (
          <Link
            href={`/${lang}/tickets/kanban`}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 font-brand whitespace-nowrap"
          >
            <span>{lang === 'ar' ? 'عرض اللوحة' : 'View Board'}</span>
            <ChevronRight className="w-4 h-4 rtl:rotate-180 shrink-0" />
          </Link>
        )}
        <button
          onClick={() => setIsDismissed(true)}
          className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-navy-900 transition-colors shrink-0"
          title={lang === 'ar' ? 'إغلاق التنبيه' : 'Dismiss banner'}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
