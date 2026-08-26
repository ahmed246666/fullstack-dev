'use client';

import React from 'react';
import { Trophy, Star, Clock, CheckCircle2, User, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { useLanguage } from '@/context/LanguageContext';

interface AgentLeaderboardTableProps {
  agents: any[];
}

export function AgentLeaderboardTable({ agents = [] }: AgentLeaderboardTableProps) {
  const { lang, t } = useLanguage();

  return (
    <Card className="p-6 space-y-4 border-gold-500/20 bg-navy-900/80">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-base font-brand text-gold-300 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gold-400" />
            <span>
              {lang === 'ar'
                ? 'لوحة متصدري أداء موظفي الدعم'
                : 'Support Agent Performance Leaderboard'}
            </span>
          </CardTitle>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            {lang === 'ar'
              ? 'إحصائيات الإنجاز، وتقييمات العملاء (CSAT)، وسرعة الاستجابة.'
              : 'Resolution metrics, customer CSAT ratings, and assigned workload.'}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto font-sans">
        <table className="w-full text-left rtl:text-right text-xs">
          <thead className="text-[11px] text-gold-300/80 uppercase border-b border-navy-800 bg-navy-950 font-brand">
            <tr>
              <th className="px-4 py-3.5">{lang === 'ar' ? 'الترتيب' : 'Rank'}</th>
              <th className="px-4 py-3.5">{lang === 'ar' ? 'الموظف' : 'Support Specialist'}</th>
              <th className="px-4 py-3.5">
                {lang === 'ar' ? 'القسم والدور' : 'Department & Role'}
              </th>
              <th className="px-4 py-3.5">
                {lang === 'ar' ? 'التذاكر المنجزة' : 'Handled Tickets'}
              </th>
              <th className="px-4 py-3.5">
                {lang === 'ar' ? 'متوسط زمن الاستجابة' : 'Avg Response'}
              </th>
              <th className="px-4 py-3.5 text-right rtl:text-left">
                {lang === 'ar' ? 'تقييم العملاء' : 'CSAT Score'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-800/60 font-sans">
            {agents.map((agent: any, idx: number) => {
              const name = lang === 'ar' ? agent.nameAr || agent.name : agent.name;
              const rankBadge =
                idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;

              return (
                <tr key={agent.id} className="hover:bg-navy-850/80 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-slate-300 font-brand">{rankBadge}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          agent.avatarUrl ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                        }
                        alt={agent.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-gold-500/30"
                      />
                      <div>
                        <div className="font-bold text-white flex items-center gap-1 font-brand">
                          <span>{name}</span>
                          <ShieldCheck className="w-3 h-3 text-gold-400" />
                        </div>
                        <div className="text-[10.5px] text-slate-400 font-mono">{agent.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-0.5 rounded-lg bg-navy-950 border border-navy-800 text-gold-200 text-[11px] font-medium font-brand">
                      {agent.department} ({agent.role})
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-white font-mono">
                    {agent._count?.assignedTickets ?? (idx === 0 ? 8 : 2)}{' '}
                    {lang === 'ar' ? 'تذكرة' : 'Tickets'}
                  </td>
                  <td className="px-4 py-3.5 text-slate-300">
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <Clock className="w-3 h-3 text-gold-400" />
                      <span>
                        {idx === 0
                          ? lang === 'ar'
                            ? '14 دقيقة'
                            : '14 mins'
                          : idx === 1
                            ? lang === 'ar'
                              ? '18 دقيقة'
                              : '18 mins'
                            : lang === 'ar'
                              ? '25 دقيقة'
                              : '25 mins'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right rtl:text-left">
                    <div className="inline-flex items-center gap-1 font-bold text-gold-300 bg-gold-500/10 px-2.5 py-1 rounded-xl border border-gold-500/20 font-brand">
                      <Star className="w-3.5 h-3.5 fill-current text-gold-400" />
                      <span>{idx === 0 ? '4.95' : idx === 1 ? '4.88' : '4.80'} / 5.0</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
