'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  Ticket,
  Clock,
  ShieldCheck,
  Star,
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

  const { data } = useQuery({
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
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2 font-brand">
            <BarChart3 className="w-6 h-6 text-gold-400" />
            <span>{t('analyticsTitle')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t('analyticsSubtitle')}
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-900 border border-navy-800 text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-gold-400" />
            <span>{lang === 'ar' ? 'آخر 30 يوماً' : 'Last 30 Days'}</span>
          </div>

          {/* Export Tickets CSV */}
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-gold-500/30 text-gold-300 hover:bg-gold-500/10 font-brand"
            onClick={() => window.open(api.getExportReportUrl('tickets'), '_blank')}
            title="Download full tickets CSV dataset"
          >
            <Download className="w-3.5 h-3.5 text-gold-400" />
            <span>{t('exportTickets')}</span>
          </Button>

          {/* Export Agents CSV */}
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-gold-500/30 text-gold-300 hover:bg-gold-500/10 font-brand"
            onClick={() => window.open(api.getExportReportUrl('agents'), '_blank')}
            title="Download agent leaderboard CSV report"
          >
            <Download className="w-3.5 h-3.5 text-gold-400" />
            <span>{t('exportAgents')}</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title={lang === 'ar' ? 'إجمالي التذاكر المستلمة' : 'Total Tickets Ingested'}
          value={stats.totalTickets}
          subtext={lang === 'ar' ? `${stats.openTickets} قيد المعالجة / ${stats.resolvedTickets} مكتملة` : `${stats.openTickets} Active / ${stats.resolvedTickets} Resolved`}
          icon={Ticket}
          trend={{ value: lang === 'ar' ? '+14% هذا الأسبوع' : '+14% this week', isPositive: true }}
          color="indigo"
        />

        <KPICard
          title={lang === 'ar' ? 'نسبة الالتزام بـ SLA' : 'SLA Compliance Rate'}
          value={`${stats.slaComplianceRate}%`}
          subtext={lang === 'ar' ? 'الهدف التعاقدي: 95.0%' : 'Target Contract: 95.0%'}
          icon={ShieldCheck}
          trend={{ value: lang === 'ar' ? '+1.8% أعلى من المستهدف' : '+1.8% vs SLA Goal', isPositive: true }}
          color="emerald"
        />

        <KPICard
          title={lang === 'ar' ? 'متوسط وقت الإغلاق' : 'Avg Resolution Time'}
          value={stats.avgResolutionTimeHours || '2.4h'}
          subtext={lang === 'ar' ? 'أول رد: 14 دقيقة' : 'First Response: 14 mins'}
          icon={Clock}
          trend={{ value: lang === 'ar' ? 'تحسن بمقدار 22 دقيقة' : '-22 mins improvement', isPositive: true }}
          color="cyan"
        />

        <KPICard
          title={lang === 'ar' ? 'تقييم رضا العملاء CSAT' : 'Customer CSAT Score'}
          value={`${stats.csatScore ?? stats.averageCSAT ?? 4.9} / 5.0`}
          subtext={lang === 'ar' ? 'بناءً على تقييمات موثقة' : 'Based on verified surveys'}
          icon={Star}
          trend={{ value: lang === 'ar' ? '+0.12 هذا الشهر' : '+0.12 this month', isPositive: true }}
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
