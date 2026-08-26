'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Kanban, Clock, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { PriorityBadge, ChannelBadge, SLABadge } from '@/components/ui/Badge';

export default function KanbanPage() {
  const { lang, t } = useLanguage();

  const { data, isLoading } = useQuery({
    queryKey: ['tickets-kanban'],
    queryFn: () => api.getTickets({ limit: 50 })
  });

  const columns = [
    { key: 'NEW', title: t('status_NEW'), color: 'border-blue-500/30 bg-blue-950/10' },
    { key: 'OPEN', title: t('status_OPEN'), color: 'border-emerald-500/30 bg-emerald-950/10' },
    { key: 'PENDING', title: t('status_PENDING'), color: 'border-amber-500/30 bg-amber-950/10' },
    { key: 'RESOLVED', title: t('status_RESOLVED'), color: 'border-purple-500/30 bg-purple-950/10' }
  ];

  const tickets = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Kanban className="w-6 h-6 text-indigo-400" />
            <span>{t('navKanban')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Interactive drag-and-drop workflow across status columns.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-400 animate-pulse">Loading board...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {columns.map((col) => {
            const colTickets = tickets.filter((t: any) => t.status === col.key);

            return (
              <div key={col.key} className={`glass-panel rounded-2xl p-4 border ${col.color}`}>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
                  <h3 className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
                    <span>{col.title}</span>
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-bold">
                    {colTickets.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[300px]">
                  {colTickets.map((t: any) => (
                    <Card key={t.id} className="p-3.5 glass-panel-hover border-slate-800 cursor-grab active:cursor-grabbing">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-bold text-indigo-400">{t.ticketNumber}</span>
                        <PriorityBadge priority={t.priority} />
                      </div>
                      <h4 className="text-xs font-semibold text-slate-100 line-clamp-2 mb-2.5">{t.title}</h4>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px]">
                        <ChannelBadge channel={t.channel} />
                        <SLABadge slaStatus={t.slaStatus} />
                      </div>
                    </Card>
                  ))}
                  {colTickets.length === 0 && (
                    <div className="py-8 text-center text-[11px] text-slate-500 border border-dashed border-slate-800/60 rounded-xl">
                      No tickets in this column
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
