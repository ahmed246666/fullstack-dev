'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, TrendingUp, ShieldCheck, CheckCircle2, Headphones, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { ChannelBadge } from '@/components/ui/Badge';

export default function AnalyticsPage() {
  const { lang, t } = useLanguage();

  const { data } = useQuery({
    queryKey: ['analytics-full'],
    queryFn: () => api.getAnalytics()
  });

  const stats = data?.data || {
    totalTickets: 6,
    openTickets: 4,
    resolvedTickets: 2,
    customersCount: 4,
    slaComplianceRate: 94,
    averageCSAT: 4.8,
    channelDistribution: { EMAIL: 2, WHATSAPP: 1, LIVE_CHAT: 1, SMS: 1, WEB_FORM: 1 }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            <span>{t('navAnalytics')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Executive KPI performance metrics, SLA compliance reports, and channel breakdown.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <span className="text-xs font-semibold text-slate-400 uppercase">SLA Compliance Rate</span>
          <div className="text-4xl font-extrabold text-emerald-400 mt-2">{stats.slaComplianceRate}%</div>
          <div className="mt-4 w-full bg-slate-800 rounded-full h-2">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${stats.slaComplianceRate}%` }} />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Target threshold: 90% SLA adherence</p>
        </Card>

        <Card className="p-6">
          <span className="text-xs font-semibold text-slate-400 uppercase">CSAT Satisfaction Rating</span>
          <div className="text-4xl font-extrabold text-purple-400 mt-2">{stats.averageCSAT} / 5.0</div>
          <div className="mt-4 w-full bg-slate-800 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(stats.averageCSAT / 5) * 100}%` }} />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Based on post-resolution feedback</p>
        </Card>

        <Card className="p-6">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Volume Handled</span>
          <div className="text-4xl font-extrabold text-indigo-400 mt-2">{stats.totalTickets}</div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>Resolved: {stats.resolvedTickets}</span>
            <span>Open: {stats.openTickets}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
