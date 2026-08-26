'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Ticket,
  Users,
  Kanban,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  Headphones,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAgent } from '@/context/AgentContext';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  StatusBadge,
  PriorityBadge,
  ChannelBadge,
  SLABadge,
  TierBadge
} from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';

export default function DashboardPage() {
  const { lang, t } = useLanguage();
  const { currentAgent } = useAgent();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState('MEDIUM');
  const [newChannel, setNewChannel] = useState('WEB_FORM');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Queries
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => api.getAnalytics()
  });

  const {
    data: ticketsData,
    isLoading: isTicketsLoading,
    refetch: refetchTickets
  } = useQuery({
    queryKey: ['recent-tickets'],
    queryFn: () => api.getTickets({ limit: 6 })
  });

  const { data: customersData } = useQuery({
    queryKey: ['customers-select'],
    queryFn: () => api.getCustomers({ limit: 50 })
  });

  const stats = analyticsData?.data || {
    totalTickets: 6,
    openTickets: 4,
    slaComplianceRate: 94,
    averageCSAT: 4.8,
    channelDistribution: { EMAIL: 2, WHATSAPP: 1, LIVE_CHAT: 1, SMS: 1, WEB_FORM: 1 }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !selectedCustomerId) return;
    try {
      setIsSubmitting(true);
      await api.createTicket({
        title: newTitle,
        description: newDesc,
        customerId: selectedCustomerId,
        priority: newPriority,
        channel: newChannel,
        department: currentAgent.department
      });
      setIsCreateOpen(false);
      setNewTitle('');
      setNewDesc('');
      refetchTickets();
    } catch (err: any) {
      alert(err.message || 'Failed to create ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AZM Squad Customer Support CRM • Week 4</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {lang === 'ar'
                ? `مرحباً، ${currentAgent.nameAr}`
                : `Welcome back, ${currentAgent.name}`}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {lang === 'ar'
                ? `لديك اليوم تذاكر نشطة بنسبة التزام SLA تبلغ ${stats.slaComplianceRate}%.`
                : `You have active support queues with ${stats.slaComplianceRate}% overall SLA compliance.`}
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-3">
            <Link href="/tickets/kanban">
              <Button variant="secondary" className="text-xs">
                <Kanban className="w-4 h-4" />
                <span>{t('navKanban')}</span>
              </Button>
            </Link>
            <Button onClick={() => setIsCreateOpen(true)} className="text-xs">
              <Plus className="w-4 h-4" />
              <span>{t('newTicketBtn')}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <Card className="glass-panel-hover border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t('kpiTotalTickets')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{stats.totalTickets}</span>
            <span className="text-xs text-emerald-400 font-medium">+12% this week</span>
          </div>
        </Card>

        {/* KPI 2 */}
        <Card className="glass-panel-hover border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t('kpiOpenTickets')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-300">{stats.openTickets}</span>
            <span className="text-xs text-slate-400 font-medium">Under active review</span>
          </div>
        </Card>

        {/* KPI 3 */}
        <Card className="glass-panel-hover border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t('kpiSLACompliance')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400">
              {stats.slaComplianceRate}%
            </span>
            <span className="text-xs text-emerald-400 font-medium">Target: &gt;90%</span>
          </div>
        </Card>

        {/* KPI 4 */}
        <Card className="glass-panel-hover border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t('kpiCSATAverage')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-purple-300">
              {stats.averageCSAT} / 5.0
            </span>
            <span className="text-xs text-purple-400 font-medium">⭐ 98% Positive</span>
          </div>
        </Card>
      </div>

      {/* Omnichannel Distribution & Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Channel Ingestion Breakdown */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">
              <Headphones className="w-4 h-4 text-indigo-400" />
              <span>{lang === 'ar' ? 'قنوات التواصل الشاملة' : 'Omnichannel Ingestion'}</span>
            </CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {Object.entries(stats.channelDistribution || {}).map(([chan, count]) => (
              <div
                key={chan}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60"
              >
                <ChannelBadge channel={chan} />
                <span className="text-xs font-bold text-slate-200">{count as number} tickets</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Access Modules */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/customers" className="block group">
            <Card className="glass-panel-hover h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-100 text-sm">{t('navCustomers')}</h4>
                <p className="text-xs text-slate-400 mt-1">
                  View customer 360 touchpoint timeline, tiers, contact details, and open tickets.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-purple-400 group-hover:underline">
                <span>Explore Customers</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </Card>
          </Link>

          <Link href="/workspace" className="block group">
            <Card className="glass-panel-hover h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Headphones className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-100 text-sm">{t('navWorkspace')}</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Agent reply console with 1-click canned responses, internal notes thread, and SLA
                  alerts.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-cyan-400 group-hover:underline">
                <span>Open Workspace</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Omnichannel Tickets Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            <Ticket className="w-4 h-4 text-indigo-400" />
            <span>{t('recentTicketsTitle')}</span>
          </CardTitle>
          <Link
            href="/tickets"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>{lang === 'ar' ? 'عرض الكل' : 'View All'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>

        {isTicketsLoading ? (
          <div className="py-8 text-center text-xs text-slate-400 animate-pulse">
            Loading live tickets...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="text-[11px] text-slate-400 uppercase border-b border-slate-800 bg-slate-900/40">
                <tr>
                  <th className="px-4 py-3">Ticket</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Channel</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">SLA Status</th>
                  <th className="px-4 py-3 text-right rtl:text-left">Assigned Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(ticketsData?.data || []).map((ticket: any) => (
                  <tr key={ticket.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-200">
                      <div className="font-bold text-indigo-400">{ticket.ticketNumber}</div>
                      <div className="truncate max-w-xs text-slate-300 font-normal">
                        {ticket.title}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-200">
                        {lang === 'ar'
                          ? ticket.customer?.nameAr || ticket.customer?.name
                          : ticket.customer?.name}
                      </div>
                      <div className="text-[10px] text-slate-400">{ticket.customer?.company}</div>
                    </td>
                    <td className="px-4 py-3">
                      <ChannelBadge channel={ticket.channel} />
                    </td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-4 py-3">
                      <SLABadge slaStatus={ticket.slaStatus} />
                    </td>
                    <td className="px-4 py-3 text-right rtl:text-left">
                      <span className="text-slate-300 font-medium">
                        {ticket.assignedAgent
                          ? lang === 'ar'
                            ? ticket.assignedAgent.nameAr
                            : ticket.assignedAgent.name
                          : '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create Ticket Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title={t('newTicketBtn')}
        maxWidth="lg"
      >
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <Input
            label="Ticket Subject"
            placeholder="Brief summary of the inquiry or issue..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Select Customer
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2 text-sm text-slate-100 outline-none"
              required
            >
              <option value="">-- Choose Customer --</option>
              {(customersData?.data || []).map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.company || c.email}) - {c.tier}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
              >
                <option value="URGENT">Urgent (1h SLA)</option>
                <option value="HIGH">High (2h SLA)</option>
                <option value="MEDIUM">Medium (4h SLA)</option>
                <option value="LOW">Low (8h SLA)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Channel
              </label>
              <select
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
              >
                <option value="WEB_FORM">Web Form</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="EMAIL">Email</option>
                <option value="LIVE_CHAT">Live Chat</option>
                <option value="SMS">SMS</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Issue Description
            </label>
            <textarea
              rows={3}
              className="w-full bg-slate-900/80 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none"
              placeholder="Detailed explanation of the support request..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Submit Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
