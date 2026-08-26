'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldAlert, AlertTriangle, ArrowRight, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';

interface SLABreachBannerProps {
  onSelectTicket?: (ticketId: string) => void;
}

export function SLABreachBanner({ onSelectTicket }: SLABreachBannerProps) {
  const { lang, t } = useLanguage();
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
    <div className="mb-6 p-3.5 px-5 rounded-2xl border bg-gradient-to-r from-rose-950/60 via-navy-950 to-amber-950/40 border-rose-500/40 flex items-center justify-between shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
          <ShieldAlert className="w-4 h-4 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-white font-brand">
              {lang === 'ar' ? 'تنبيه SLA العاجل:' : 'Critical SLA Breach Alert:'}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-bold font-sans">
              {breachedTickets.length} {lang === 'ar' ? 'تجاوزت الوقت' : 'Breached'}
            </span>
            {approachingTickets.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold font-sans">
                {approachingTickets.length} {lang === 'ar' ? 'أقل من ساعتين' : 'Approaching (<2h)'}
              </span>
            )}
          </div>
          <p className="text-[11.5px] text-slate-300 mt-0.5 font-sans">
            {mostCritical ? (
              <span>
                {lang === 'ar' ? 'التذكرة رقم ' : 'Ticket '}
                <strong className="font-mono text-rose-300">{mostCritical.ticketNumber}</strong>:
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

      <div className="flex items-center gap-2">
        {mostCritical && onSelectTicket ? (
          <button
            onClick={() => onSelectTicket(mostCritical.id)}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 font-brand"
          >
            <span>{lang === 'ar' ? 'فحص التذكرة' : 'Inspect Ticket'}</span>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        ) : (
          <Link
            href="/tickets/kanban"
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 font-brand"
          >
            <span>{lang === 'ar' ? 'عرض اللوحة' : 'View Board'}</span>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </Link>
        )}
        <button
          onClick={() => setIsDismissed(true)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-900 transition-colors"
          title={lang === 'ar' ? 'إغلاق التنبيه' : 'Dismiss banner'}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
