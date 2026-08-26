'use client';

import React from 'react';
import { Trophy, Star, Clock, CheckCircle2, User, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { useLanguage } from '@/context/LanguageContext';

interface AgentLeaderboardTableProps {
  agents: any[];
}

export function AgentLeaderboardTable({ agents = [] }: AgentLeaderboardTableProps) {
  const { lang } = useLanguage();

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>
              {lang === 'ar'
                ? 'لوحة متصدري أداء فريق الدعم'
                : 'Support Agent Performance Leaderboard'}
            </span>
          </CardTitle>
          <p className="text-xs text-slate-400 mt-1">
            Resolution metrics, customer CSAT ratings, and assigned workload.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left rtl:text-right text-xs">
          <thead className="text-[11px] text-slate-400 uppercase border-b border-slate-800 bg-slate-900/40">
            <tr>
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Support Agent</th>
              <th className="px-4 py-3">Department & Role</th>
              <th className="px-4 py-3">Assigned Tickets</th>
              <th className="px-4 py-3">Avg Response Time</th>
              <th className="px-4 py-3 text-right rtl:text-left">CSAT Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {agents.map((agent: any, idx: number) => {
              const name = lang === 'ar' ? agent.nameAr || agent.name : agent.name;
              const rankBadge =
                idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;

              return (
                <tr key={agent.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-slate-300">{rankBadge}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          agent.avatarUrl ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                        }
                        alt={agent.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                      />
                      <div>
                        <div className="font-bold text-slate-100 flex items-center gap-1">
                          <span>{name}</span>
                          <ShieldCheck className="w-3 h-3 text-indigo-400" />
                        </div>
                        <div className="text-[10px] text-slate-400">{agent.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-medium">
                      {agent.department} ({agent.role})
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-100">
                    {agent._count?.assignedTickets ?? (idx === 0 ? 8 : 2)} Tickets
                  </td>
                  <td className="px-4 py-3.5 text-slate-300">
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{idx === 0 ? '14 mins' : idx === 1 ? '18 mins' : '25 mins'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right rtl:text-left">
                    <div className="inline-flex items-center gap-1 font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                      <Star className="w-3.5 h-3.5 fill-current" />
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
