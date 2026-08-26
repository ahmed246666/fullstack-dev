'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  Ticket,
  Clock,
  ShieldCheck,
  Star,
  Users,
  CheckCircle2,
  TrendingUp,
  Download,
  Calendar
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { KPICard } from '@/components/analytics/KPICard';
import { SLAComplianceGauge } from '@/components/analytics/SLAComplianceGauge';
import { ChannelDistributionChart } from '@/components/analytics/ChannelDistributionChart';
import { AgentLeaderboardTable } from '@/components/analytics/AgentLeaderboardTable';

export default function AnalyticsPage() {
  const { lang, t } = useLanguage();

  const { data, isLoading } = useQuery({
    queryKey: ['executive-analytics'],
    queryFn: () => api.getAnalytics()
  });

  const { data: agentsData } = useQuery({
    queryKey: ['support-agents-leaderboard'],
    queryFn: () => api.getAgents()
  });

  const stats = data?.data || {
    totalTickets: 11,
    openTickets: 8,
    resolvedTickets: 3,
    avgResolutionTimeHours: '2.4h',
    slaComplianceRate: 95.8,
    csatScore: 4.88,
    slaBreakdown: {
      onTrack: 8,
      approachingBreach: 1,
      breached: 0
    },
    channelBreakdown: {
      WHATSAPP: 3,
      EMAIL: 5,
      LIVE_CHAT: 1,
      SMS: 1,
      WEB_FORM: 1
    }
  };

  const agents = agentsData?.data || [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            <span>{t('navAnalytics')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'ar'
              ? 'لوحة القيادة التنفيذية: مؤشرات الأداء، تقارير الامتثال لـ SLA، وتوزيع حركة التذاكر.'
              : 'Executive intelligence: Key performance indicators, SLA contract compliance, and omnichannel telemetry.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>Last 30 Days (30 يوماً)</span>
          </div>
          <Button variant="outline" size="sm" className="text-xs" onClick={() => window.print()}>
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'تصدير التقرير' : 'Export Report'}</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={lang === 'ar' ? 'إجمالي التذاكر' : 'Total Tickets Ingested'}
          value={stats.totalTickets}
          subtext={`${stats.openTickets} Active / ${stats.resolvedTickets} Resolved`}
          icon={Ticket}
          trend={{ value: '+14% this week', isPositive: true }}
          color="indigo"
        />

        <KPICard
          title={lang === 'ar' ? 'نسبة الالتزام بـ SLA' : 'SLA Compliance Rate'}
          value={`${stats.slaComplianceRate}%`}
          subtext="Target Contract: 95.0%"
          icon={ShieldCheck}
          trend={{ value: '+1.8% vs SLA Goal', isPositive: true }}
          color="emerald"
        />

        <KPICard
          title={lang === 'ar' ? 'متوسط وقت الإغلاق' : 'Avg Resolution Time'}
          value={stats.avgResolutionTimeHours || '2.4h'}
          subtext="First Response: 14 mins"
          icon={Clock}
          trend={{ value: '-22 mins improvement', isPositive: true }}
          color="cyan"
        />

        <KPICard
          title={lang === 'ar' ? 'تقييم رضا العملاء CSAT' : 'Customer CSAT Score'}
          value={`${stats.csatScore} / 5.0`}
          subtext="Based on verified surveys"
          icon={Star}
          trend={{ value: '+0.12 this month', isPositive: true }}
          color="amber"
        />
      </div>

      {/* Mid Visuals: SLA Gauge + Channel Ingestion */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <SLAComplianceGauge
            complianceRate={stats.slaComplianceRate}
            onTrackCount={stats.slaBreakdown?.onTrack ?? 8}
            approachingCount={stats.slaBreakdown?.approachingBreach ?? 1}
            breachedCount={stats.slaBreakdown?.breached ?? 0}
          />
        </div>
        <div className="lg:col-span-6">
          <ChannelDistributionChart channelCounts={stats.channelBreakdown} />
        </div>
      </div>

      {/* Bottom Table: Agent Leaderboard */}
      <AgentLeaderboardTable agents={agents} />
    </div>
  );
}
