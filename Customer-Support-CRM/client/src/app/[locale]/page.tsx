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
import { Select } from '@/components/ui/Select';
import { toast } from '@/components/ui/Toast';

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
      toast.success(
        lang === 'ar' ? 'تم إنشاء التذكرة بنجاح' : 'Ticket created successfully',
        lang === 'ar' ? 'تذكرة جديدة' : 'Ticket Created'
      );
    } catch (err: any) {
      toast.error(
        err.message || (lang === 'ar' ? 'فشل إنشاء التذكرة' : 'Failed to create ticket'),
        lang === 'ar' ? 'خطأ' : 'Error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const customerOptions = (customersData?.data || []).map((c: any) => ({
    value: c.id,
    label: `${lang === 'ar' && c.nameAr ? c.nameAr : c.name} (${c.company || c.email}) - [${c.tier}]`
  }));

  const priorityOptions = [
    { value: 'URGENT', label: lang === 'ar' ? 'عاجل جداً (ساعة واحدة)' : 'Urgent (1h SLA)' },
    { value: 'HIGH', label: lang === 'ar' ? 'عالية (ساعتان)' : 'High (2h SLA)' },
    { value: 'MEDIUM', label: lang === 'ar' ? 'متوسطة (4 ساعات)' : 'Medium (4h SLA)' },
    { value: 'LOW', label: lang === 'ar' ? 'منخفضة (8 ساعات)' : 'Low (8h SLA)' }
  ];

  const channelOptions = [
    { value: 'WEB_FORM', label: lang === 'ar' ? 'بوابة الدعم' : 'Web Form' },
    { value: 'WHATSAPP', label: lang === 'ar' ? 'واتساب' : 'WhatsApp' },
    { value: 'EMAIL', label: lang === 'ar' ? 'البريد الإلكتروني' : 'Email' },
    { value: 'LIVE_CHAT', label: lang === 'ar' ? 'المحادثة المباشرة' : 'Live Chat' },
    { value: 'SMS', label: lang === 'ar' ? 'الرسائل النصية' : 'SMS' }
  ];

  return (
    <div className="space-y-8 md:space-y-10 max-w-7xl mx-auto w-full">
      {/* Welcome Banner */}
      <div className="glass-panel p-8 sm:p-10 md:p-12 rounded-3xl border border-gold-500/25 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-semibold shrink-0">
              <Crown className="w-4 h-4 text-gold-400 shrink-0" />
              <span className="whitespace-nowrap">
                {lang === 'ar'
                  ? 'منصة خدمة ودعم عملاء عزم المؤسسية'
                  : 'AZM Squad Customer Support CRM • Enterprise'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-brand leading-tight">
              {lang === 'ar'
                ? `أهلاً بك، ${currentAgent.nameAr}`
                : `Welcome back, ${currentAgent.name}`}
            </h1>
            <p className="text-sm sm:text-base text-gold-100/75 font-sans leading-relaxed">
              {lang === 'ar'
                ? `لوحة التحكم التنفيذية الشاملة بنسبة التزام SLA تبلغ ${stats.slaComplianceRate}% ومعدل رضا عملاء ${stats.csatScore || 4.9} / 5.`
                : `Executive Command Center with ${stats.slaComplianceRate}% overall SLA compliance and ${stats.csatScore || 4.9} / 5 customer satisfaction.`}
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 flex-wrap">
            <Link href={`/${lang}/tickets/kanban`} className="flex-1 sm:flex-initial">
              <Button
                variant="outline"
                className="w-full sm:w-auto text-xs border-navy-700 hover:border-gold-500/40 text-slate-200 px-4 py-2.5"
              >
                <Kanban className="w-4 h-4 text-gold-400 shrink-0" />
                <span className="whitespace-nowrap">{t('navKanban')}</span>
              </Button>
            </Link>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="flex-1 sm:flex-initial text-xs bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold hover:opacity-95 shadow-lg shadow-gold-500/20 px-5 py-2.5"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">{t('newTicketBtn')}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1 */}
        <Card className="glass-panel-hover border-gold-500/20 bg-navy-900/80 p-6 sm:p-7 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gold-300 uppercase tracking-wider font-brand whitespace-nowrap">
              {t('kpiTotalTickets')}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-gold-500/10 text-gold-400 flex items-center justify-center border border-gold-500/20 shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5 pt-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-brand">
              {stats.totalTickets}
            </span>
            <span className="text-xs text-emerald-400 font-semibold whitespace-nowrap">
              {lang === 'ar' ? '+14% هذا الأسبوع' : '+14% this sprint'}
            </span>
          </div>
        </Card>

        {/* KPI 2 */}
        <Card className="glass-panel-hover border-gold-500/20 bg-navy-900/80 p-6 sm:p-7 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gold-300 uppercase tracking-wider font-brand whitespace-nowrap">
              {t('kpiOpenTickets')}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5 pt-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-amber-300 font-brand">
              {stats.openTickets}
            </span>
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
              {lang === 'ar' ? 'طابور نشط' : 'Active queue'}
            </span>
          </div>
        </Card>

        {/* KPI 3 */}
        <Card className="glass-panel-hover border-gold-500/20 bg-navy-900/80 p-6 sm:p-7 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gold-300 uppercase tracking-wider font-brand whitespace-nowrap">
              {t('kpiSLACompliance')}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5 pt-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-brand">
              {stats.slaComplianceRate}%
            </span>
            <span className="text-xs text-emerald-400 font-medium whitespace-nowrap">
              {lang === 'ar' ? 'المستهدف >90%' : 'Guaranteed >90%'}
            </span>
          </div>
        </Card>

        {/* KPI 4 */}
        <Card className="glass-panel-hover border-gold-500/20 bg-navy-900/80 p-6 sm:p-7 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gold-300 uppercase tracking-wider font-brand whitespace-nowrap">
              {t('kpiCSATAverage')}
            </span>
            <div className="w-10 h-10 rounded-2xl bg-gold-500/10 text-gold-400 flex items-center justify-center border border-gold-500/20 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2.5 pt-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-gold-300 font-brand">
              {stats.csatScore || 4.9} / 5.0
            </span>
            <span className="text-xs text-gold-300 font-semibold whitespace-nowrap">
              {lang === 'ar' ? '⭐ 99% نسبة الرضا' : '⭐ 99% Satisfaction'}
            </span>
          </div>
        </Card>
      </div>

      {/* Omnichannel Distribution & Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Channel Ingestion Breakdown */}
        <Card className="lg:col-span-1 p-6 sm:p-7 space-y-5 border-gold-500/20 bg-navy-900/80 rounded-3xl">
          <CardHeader className="p-0 pb-1">
            <CardTitle className="text-sm font-brand text-gold-300 flex items-center gap-2">
              <Headphones className="w-4 h-4 text-gold-400 shrink-0" />
              <span>{lang === 'ar' ? 'قنوات التواصل الشاملة' : 'Omnichannel Ingestion'}</span>
            </CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {Object.entries(stats.channelDistribution || {}).map(([chan, count]) => (
              <div
                key={chan}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-navy-950 border border-navy-800 gap-2"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <ChannelBadge channel={chan} />
                </div>
                <span className="text-xs font-bold text-gold-200 whitespace-nowrap shrink-0">
                  {lang === 'ar' ? `${count} تذاكر` : `${count} tickets`}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Access Modules */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link href={`/${lang}/customers`} className="block group">
            <Card className="glass-panel-hover h-full flex flex-col justify-between p-7 border-gold-500/20 bg-navy-900/80 rounded-3xl">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform border border-gold-500/20">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-base font-brand">{t('navCustomers')}</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans">
                  {lang === 'ar'
                    ? 'استعراض نقاط تفاعل العملاء الشاملة 360، وفئات الحسابات (مؤسسي/VIP)، وسجل التذاكر.'
                    : 'Inspect customer 360 touchpoints, tier levels (Enterprise/VIP), contact profiles, and ticket history.'}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-gold-400 group-hover:underline font-brand">
                <span>{lang === 'ar' ? 'استعراض العملاء' : 'Explore Customers'}</span>
                <ArrowUpRight className="w-4 h-4 rtl:rotate-180" />
              </div>
            </Card>
          </Link>

          <Link href={`/${lang}/workspace`} className="block group">
            <Card className="glass-panel-hover h-full flex flex-col justify-between p-7 border-gold-500/20 bg-navy-900/80 rounded-3xl">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform border border-gold-500/20">
                  <Headphones className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-base font-brand">{t('navWorkspace')}</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed font-sans">
                  {lang === 'ar'
                    ? 'منصة الردود التفاعلية مع قوالب الردود السريعة بنقرة واحدة، والملاحظات الخاصة، والمساعد الذكي.'
                    : 'Agent interactive reply console with 1-click canned responses, internal private notes, and AI Copilot.'}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-gold-400 group-hover:underline font-brand">
                <span>{lang === 'ar' ? 'فتح منصة الردود' : 'Open Workspace'}</span>
                <ArrowUpRight className="w-4 h-4 rtl:rotate-180" />
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Omnichannel Tickets Feed */}
      <Card className="p-6 sm:p-8 border-gold-500/20 bg-navy-900/80 space-y-5 rounded-3xl">
        <CardHeader className="p-0 pb-1 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-brand text-gold-300 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-gold-400 shrink-0" />
            <span>{t('recentTicketsTitle')}</span>
          </CardTitle>
          <Link
            href={`/${lang}/tickets`}
            className="text-xs font-semibold text-gold-400 hover:text-gold-300 flex items-center gap-1 font-brand whitespace-nowrap"
          >
            <span>{lang === 'ar' ? 'عرض الكل' : 'View All'}</span>
            <ArrowUpRight className="w-4 h-4 rtl:rotate-180 shrink-0" />
          </Link>
        </CardHeader>

        {isTicketsLoading ? (
          <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
            {lang === 'ar' ? 'جاري تحميل التذاكر المباشرة...' : 'Loading live tickets...'}
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-left rtl:text-right text-xs min-w-[760px]">
              <thead className="text-[11px] text-gold-300/80 uppercase border-b border-navy-800 bg-navy-950 font-brand">
                <tr>
                  <th className="px-4 py-4 whitespace-nowrap">{lang === 'ar' ? 'التذكرة' : 'Ticket'}</th>
                  <th className="px-4 py-4 whitespace-nowrap">{lang === 'ar' ? 'العميل' : 'Customer'}</th>
                  <th className="px-4 py-4 whitespace-nowrap">{lang === 'ar' ? 'القناة' : 'Channel'}</th>
                  <th className="px-4 py-4 whitespace-nowrap">{lang === 'ar' ? 'الأولوية' : 'Priority'}</th>
                  <th className="px-4 py-4 whitespace-nowrap">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th className="px-4 py-4 whitespace-nowrap">{lang === 'ar' ? 'اتفاقية SLA' : 'SLA Status'}</th>
                  <th className="px-4 py-4 text-right rtl:text-left whitespace-nowrap">{lang === 'ar' ? 'الموظف المسؤول' : 'Assigned Agent'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60 font-sans">
                {(ticketsData?.data || []).map((ticket: any) => (
                  <tr key={ticket.id} className="hover:bg-navy-850/80 transition-colors">
                    <td className="px-4 py-4 font-semibold text-slate-200 whitespace-nowrap">
                      <div className="font-bold text-gold-300 font-mono text-xs">{ticket.ticketNumber}</div>
                      <div className="truncate max-w-[200px] text-slate-300 font-normal text-[11px]">
                        {ticket.title}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-semibold text-white">
                        {lang === 'ar'
                          ? ticket.customer?.nameAr || ticket.customer?.name
                          : ticket.customer?.name}
                      </div>
                      <div className="text-[10.5px] text-slate-400">{ticket.customer?.company}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <ChannelBadge channel={ticket.channel} />
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <PriorityBadge priority={ticket.priority} />
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <StatusBadge status={ticket.status} />
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <SLABadge slaStatus={ticket.slaStatus} />
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right rtl:text-left whitespace-nowrap">
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

          <Select
            label={lang === 'ar' ? 'اختيار العميل' : 'Select Customer'}
            placeholder={lang === 'ar' ? '-- اختر العميل --' : '-- Choose Customer --'}
            value={selectedCustomerId}
            onChange={(val) => setSelectedCustomerId(val)}
            options={customerOptions}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label={lang === 'ar' ? 'مستوى الأولوية' : 'Priority'}
              value={newPriority}
              onChange={(val) => setNewPriority(val)}
              options={priorityOptions}
            />

            <Select
              label={lang === 'ar' ? 'قناة التواصل' : 'Channel'}
              value={newChannel}
              onChange={(val) => setNewChannel(val)}
              options={channelOptions}
            />
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

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-navy-800 flex-wrap">
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
