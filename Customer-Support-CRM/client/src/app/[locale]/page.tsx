'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Ticket,
  Users,
  Kanban,
  CheckCircle2,
  Clock,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Headphones,
  Crown
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
  SLABadge
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
  const { data: analyticsData } = useQuery({
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
    totalTickets: 17,
    openTickets: 16,
    slaComplianceRate: 88,
    averageCSAT: 4.9,
    channelDistribution: { EMAIL: 6, WHATSAPP: 3, LIVE_CHAT: 3, SMS: 2, WEB_FORM: 3 }
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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="glass-panel p-8 md:p-10 rounded-3xl border border-gold-500/25 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-semibold">
              <Crown className="w-4 h-4 text-gold-400" />
              <span>
                {lang === 'ar'
                  ? 'منصة خدمة ودعم عملاء عزم المؤسسية'
                  : 'AZM Squad Customer Support CRM • Enterprise'}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-brand">
              {lang === 'ar'
                ? `أهلاً بك، ${currentAgent.nameAr}`
                : `Welcome back, ${currentAgent.name}`}
            </h1>
            <p className="text-sm text-gold-100/70 font-sans max-w-2xl">
              {lang === 'ar'
                ? `لوحة التحكم التنفيذية الشاملة بنسبة التزام SLA تبلغ ${stats.slaComplianceRate}% ومعدل رضا عملاء ${stats.csatScore || 4.9} / 5.`
                : `Executive Command Center with ${stats.slaComplianceRate}% overall SLA compliance and ${stats.csatScore || 4.9} / 5 customer satisfaction.`}
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-3">
            <Link href={`/${lang}/tickets/kanban`}>
              <Button
                variant="outline"
                className="text-xs border-navy-700 hover:border-gold-500/40 text-slate-200"
              >
                <Kanban className="w-4 h-4 text-gold-400" />
                <span>{t('navKanban')}</span>
              </Button>
            </Link>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="text-xs bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold hover:opacity-95 shadow-lg shadow-gold-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>{t('newTicketBtn')}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1 */}
        <Card className="glass-panel-hover border-gold-500/20 bg-navy-900/80 p-6 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gold-300 uppercase tracking-wider font-brand">
              {t('kpiTotalTickets')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center border border-gold-500/20">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-3xl font-extrabold text-white font-brand">
              {stats.totalTickets}
            </span>
            <span className="text-xs text-emerald-400 font-semibold">
              {lang === 'ar' ? '+14% هذا الأسبوع' : '+14% this sprint'}
            </span>
          </div>
        </Card>

        {/* KPI 2 */}
        <Card className="glass-panel-hover border-gold-500/20 bg-navy-900/80 p-6 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gold-300 uppercase tracking-wider font-brand">
              {t('kpiOpenTickets')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-3xl font-extrabold text-amber-300 font-brand">
              {stats.openTickets}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {lang === 'ar' ? 'طابور نشط' : 'Active queue'}
            </span>
          </div>
        </Card>

        {/* KPI 3 */}
        <Card className="glass-panel-hover border-gold-500/20 bg-navy-900/80 p-6 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gold-300 uppercase tracking-wider font-brand">
              {t('kpiSLACompliance')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-3xl font-extrabold text-emerald-400 font-brand">
              {stats.slaComplianceRate}%
            </span>
            <span className="text-xs text-emerald-400 font-medium">
              {lang === 'ar' ? 'المستهدف >90%' : 'Guaranteed >90%'}
            </span>
          </div>
        </Card>

        {/* KPI 4 */}
        <Card className="glass-panel-hover border-gold-500/20 bg-navy-900/80 p-6 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gold-300 uppercase tracking-wider font-brand">
              {t('kpiCSATAverage')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-gold-500/10 text-gold-400 flex items-center justify-center border border-gold-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-3xl font-extrabold text-gold-300 font-brand">
              {stats.csatScore || 4.9} / 5.0
            </span>
            <span className="text-xs text-gold-300 font-semibold">
              {lang === 'ar' ? '⭐ 99% نسبة الرضا' : '⭐ 99% Satisfaction'}
            </span>
          </div>
        </Card>
      </div>

      {/* Omnichannel Distribution & Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Channel Ingestion Breakdown */}
        <Card className="lg:col-span-1 p-6 space-y-4 border-gold-500/20 bg-navy-900/80">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-sm font-brand text-gold-300 flex items-center gap-2">
              <Headphones className="w-4 h-4 text-gold-400" />
              <span>{lang === 'ar' ? 'قنوات التواصل الشاملة' : 'Omnichannel Ingestion'}</span>
            </CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {Object.entries(stats.channelDistribution || {}).map(([chan, count]) => (
              <div
                key={chan}
                className="flex items-center justify-between p-3 rounded-2xl bg-navy-950 border border-navy-800"
              >
                <ChannelBadge channel={chan} />
                <span className="text-xs font-bold text-gold-200">
                  {lang === 'ar' ? `${count} تذاكر` : `${count} tickets`}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Access Modules */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Link href={`/${lang}/customers`} className="block group">
            <Card className="glass-panel-hover h-full flex flex-col justify-between p-6 border-gold-500/20 bg-navy-900/80">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-gold-500/10 text-gold-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-gold-500/20">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-base font-brand">{t('navCustomers')}</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-sans">
                  {lang === 'ar'
                    ? 'استعراض نقاط تفاعل العملاء الشاملة 360، وفئات الحسابات (مؤسسي/VIP)، وسجل التذاكر.'
                    : 'Inspect customer 360 touchpoints, tier levels (Enterprise/VIP), contact profiles, and ticket history.'}
                </p>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-gold-400 group-hover:underline font-brand">
                <span>{lang === 'ar' ? 'استعراض العملاء' : 'Explore Customers'}</span>
                <ArrowUpRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </div>
            </Card>
          </Link>

          <Link href={`/${lang}/workspace`} className="block group">
            <Card className="glass-panel-hover h-full flex flex-col justify-between p-6 border-gold-500/20 bg-navy-900/80">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-gold-500/10 text-gold-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-gold-500/20">
                  <Headphones className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-base font-brand">{t('navWorkspace')}</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-sans">
                  {lang === 'ar'
                    ? 'منصة الردود التفاعلية مع قوالب الردود السريعة بنقرة واحدة، والملاحظات الخاصة، والمساعد الذكي.'
                    : 'Agent interactive reply console with 1-click canned responses, internal private notes, and AI Copilot.'}
                </p>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-gold-400 group-hover:underline font-brand">
                <span>{lang === 'ar' ? 'فتح منصة الردود' : 'Open Workspace'}</span>
                <ArrowUpRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Omnichannel Tickets Feed */}
      <Card className="p-6 border-gold-500/20 bg-navy-900/80 space-y-4">
        <CardHeader className="p-0 pb-2 flex items-center justify-between">
          <CardTitle className="text-base font-brand text-gold-300 flex items-center gap-2">
            <Ticket className="w-4 h-4 text-gold-400" />
            <span>{t('recentTicketsTitle')}</span>
          </CardTitle>
          <Link
            href={`/${lang}/tickets`}
            className="text-xs font-semibold text-gold-400 hover:text-gold-300 flex items-center gap-1 font-brand"
          >
            <span>{lang === 'ar' ? 'عرض الكل' : 'View All'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </Link>
        </CardHeader>

        {isTicketsLoading ? (
          <div className="py-8 text-center text-xs text-slate-400 animate-pulse">
            {lang === 'ar' ? 'جاري تحميل التذاكر المباشرة...' : 'Loading live tickets...'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="text-[11px] text-gold-300/80 uppercase border-b border-navy-800 bg-navy-950 font-brand">
                <tr>
                  <th className="px-4 py-3.5">{lang === 'ar' ? 'التذكرة' : 'Ticket'}</th>
                  <th className="px-4 py-3.5">{lang === 'ar' ? 'العميل' : 'Customer'}</th>
                  <th className="px-4 py-3.5">{lang === 'ar' ? 'القناة' : 'Channel'}</th>
                  <th className="px-4 py-3.5">{lang === 'ar' ? 'الأولوية' : 'Priority'}</th>
                  <th className="px-4 py-3.5">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th className="px-4 py-3.5">{lang === 'ar' ? 'اتفاقية SLA' : 'SLA Status'}</th>
                  <th className="px-4 py-3.5 text-right rtl:text-left">{lang === 'ar' ? 'الموظف المسؤول' : 'Assigned Agent'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60 font-sans">
                {(ticketsData?.data || []).map((ticket: any) => (
                  <tr key={ticket.id} className="hover:bg-navy-850/80 transition-colors">
                    <td className="px-4 py-3.5 font-semibold text-slate-200">
                      <div className="font-bold text-gold-300 font-mono">{ticket.ticketNumber}</div>
                      <div className="truncate max-w-xs text-slate-300 font-normal">
                        {ticket.title}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-white">
                        {lang === 'ar'
                          ? ticket.customer?.nameAr || ticket.customer?.name
                          : ticket.customer?.name}
                      </div>
                      <div className="text-[10.5px] text-slate-400">{ticket.customer?.company}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <ChannelBadge channel={ticket.channel} />
                    </td>
                    <td className="px-4 py-3.5">
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      <SLABadge slaStatus={ticket.slaStatus} />
                    </td>
                    <td className="px-4 py-3.5 text-right rtl:text-left">
                      <span className="text-slate-300 font-medium font-brand">
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
            label={lang === 'ar' ? 'عنوان التذكرة' : 'Ticket Subject'}
            placeholder={lang === 'ar' ? 'ملخص موجز لطلب الدعم أو المشكلة...' : 'Brief summary of the inquiry or issue...'}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {lang === 'ar' ? 'اختيار العميل' : 'Select Customer'}
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full bg-navy-950 border border-navy-800 focus:border-gold-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none"
              required
            >
              <option value="">{lang === 'ar' ? '-- اختر العميل --' : '-- Choose Customer --'}</option>
              {(customersData?.data || []).map((c: any) => (
                <option key={c.id} value={c.id}>
                  {lang === 'ar' && c.nameAr ? c.nameAr : c.name} ({c.company || c.email}) - {c.tier}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {lang === 'ar' ? 'مستوى الأولوية' : 'Priority'}
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
              >
                <option value="URGENT">{lang === 'ar' ? 'عاجل جداً (ساعة واحدة)' : 'Urgent (1h SLA)'}</option>
                <option value="HIGH">{lang === 'ar' ? 'عالية (ساعتان)' : 'High (2h SLA)'}</option>
                <option value="MEDIUM">{lang === 'ar' ? 'متوسطة (4 ساعات)' : 'Medium (4h SLA)'}</option>
                <option value="LOW">{lang === 'ar' ? 'منخفضة (8 ساعات)' : 'Low (8h SLA)'}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {lang === 'ar' ? 'قناة التواصل' : 'Channel'}
              </label>
              <select
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value)}
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
              >
                <option value="WEB_FORM">{lang === 'ar' ? 'بوابة الدعم' : 'Web Form'}</option>
                <option value="WHATSAPP">{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</option>
                <option value="EMAIL">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</option>
                <option value="LIVE_CHAT">{lang === 'ar' ? 'المحادثة المباشرة' : 'Live Chat'}</option>
                <option value="SMS">{lang === 'ar' ? 'الرسائل النصية' : 'SMS'}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {lang === 'ar' ? 'تفاصيل ووصف المشكلة' : 'Issue Description'}
            </label>
            <textarea
              rows={3}
              className="w-full bg-navy-950 border border-navy-800 focus:border-gold-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none"
              placeholder={lang === 'ar' ? 'شرح مفصل لطلب الدعم والمشكلة...' : 'Detailed explanation of the support request...'}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-navy-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateOpen(false)}
              size="sm"
            >
              {t('cancel')}
            </Button>
            <Button type="submit" isLoading={isSubmitting} size="sm">
              {lang === 'ar' ? 'إرسال التذكرة' : 'Submit Ticket'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
