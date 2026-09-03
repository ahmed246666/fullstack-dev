'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { Ticket, Search, Kanban, User } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge, PriorityBadge, ChannelBadge, SLABadge } from '@/components/ui/Badge';
import { TicketDrawer } from '@/components/tickets/TicketDrawer';
import { Select } from '@/components/ui/Select';

export default function TicketsPage() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') || '';
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState(urlSearch);
  const [status, setStatus] = useState('ALL');
  const [channel, setChannel] = useState('ALL');
  const [priority, setPriority] = useState('ALL');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  useEffect(() => {
    if (urlSearch) {
      setSearch(urlSearch);
    }
  }, [urlSearch]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['tickets-table', search, status, channel, priority],
    queryFn: () => api.getTickets({ search, status, channel, priority, limit: 100 })
  });

  const tickets = data?.data || [];

  const statusOptions = [
    { value: 'ALL', label: lang === 'ar' ? 'جميع الحالات' : 'All Statuses' },
    { value: 'NEW', label: t('status_NEW') },
    { value: 'OPEN', label: t('status_OPEN') },
    { value: 'PENDING', label: t('status_PENDING') },
    { value: 'RESOLVED', label: t('status_RESOLVED') },
    { value: 'CLOSED', label: t('status_CLOSED') }
  ];

  const channelOptions = [
    { value: 'ALL', label: lang === 'ar' ? 'جميع القنوات' : 'All Channels' },
    { value: 'WHATSAPP', label: t('channel_WHATSAPP') },
    { value: 'EMAIL', label: t('channel_EMAIL') },
    { value: 'LIVE_CHAT', label: t('channel_LIVE_CHAT') },
    { value: 'SMS', label: t('channel_SMS') },
    { value: 'WEB_FORM', label: t('channel_WEB_FORM') }
  ];

  const priorityOptions = [
    { value: 'ALL', label: lang === 'ar' ? 'جميع الأولويات' : 'All Priorities' },
    { value: 'URGENT', label: t('priority_URGENT') },
    { value: 'HIGH', label: t('priority_HIGH') },
    { value: 'MEDIUM', label: t('priority_MEDIUM') },
    { value: 'LOW', label: t('priority_LOW') }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2 font-brand">
            <Ticket className="w-6 h-6 text-gold-400 shrink-0" />
            <span>{t('navTickets')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'ar'
              ? 'عرض جدولي تفصيلي لجميع تذاكر الدعم عبر القنوات الخمس مع الفلاتر المتقدمة.'
              : 'Detailed multi-channel ticket table view with advanced filtering, sorting, and SLA trackers.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href={`/${lang}/tickets/kanban`}>
            <Button variant="secondary" className="text-xs">
              <Kanban className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">{t('navKanban')}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Controls */}
      <Card className="p-5 space-y-3 border-gold-500/20 bg-navy-900/80 rounded-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 rtl:right-3.5 rtl:left-auto top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder={
                lang === 'ar'
                  ? 'ابحث بالتذكرة، العميل، العنوان...'
                  : 'Search ticket #, customer, subject...'
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-navy-950/90 border border-navy-800 rounded-xl pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2 text-xs text-slate-100 outline-none focus:border-gold-500 font-sans"
            />
          </div>

          <Select
            value={status}
            onChange={(val) => setStatus(val)}
            options={statusOptions}
          />

          <Select
            value={channel}
            onChange={(val) => setChannel(val)}
            options={channelOptions}
          />

          <Select
            value={priority}
            onChange={(val) => setPriority(val)}
            options={priorityOptions}
          />
        </div>
      </Card>

      {/* Tickets Data Table */}
      <Card className="border-gold-500/20 bg-navy-900/80 rounded-2xl">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-slate-400 animate-pulse">
            {lang === 'ar' ? 'جاري تحميل تذاكر الدعم الشاملة...' : 'Loading Omnichannel Tickets...'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs min-w-[760px]">
              <thead className="text-[11px] text-gold-300/80 uppercase border-b border-navy-800 bg-navy-950 font-brand">
                <tr>
                  <th className="px-4 py-3.5 whitespace-nowrap">{lang === 'ar' ? 'رمز التذكرة' : 'Ticket Code'}</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">{lang === 'ar' ? 'الموضوع' : 'Subject'}</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">{lang === 'ar' ? 'العميل' : 'Customer'}</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">{lang === 'ar' ? 'القناة' : 'Channel'}</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">{lang === 'ar' ? 'الأولوية' : 'Priority'}</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th className="px-4 py-3.5 whitespace-nowrap">{lang === 'ar' ? 'اتفاقية SLA' : 'SLA Health'}</th>
                  <th className="px-4 py-3.5 text-right rtl:text-left whitespace-nowrap">{lang === 'ar' ? 'الموظف المسؤول' : 'Assigned Agent'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60 font-sans">
                {tickets.map((ticket: any) => (
                  <tr
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className="hover:bg-navy-850/80 cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3.5 font-mono font-bold text-gold-300 group-hover:underline whitespace-nowrap">
                      {ticket.ticketNumber}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-semibold text-slate-100 line-clamp-1 max-w-xs">
                        {ticket.title}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1 max-w-xs">
                        {ticket.description}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-medium text-slate-200">
                        {lang === 'ar'
                          ? ticket.customer?.nameAr || ticket.customer?.name
                          : ticket.customer?.name}
                      </div>
                      <div className="text-[10px] text-slate-400">{ticket.customer?.company}</div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <ChannelBadge channel={ticket.channel} />
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <PriorityBadge priority={ticket.priority} />
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <StatusBadge status={ticket.status} />
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <SLABadge slaStatus={ticket.slaStatus} />
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right rtl:text-left text-slate-300 whitespace-nowrap">
                      <div className="flex items-center justify-end rtl:justify-start gap-1.5 font-medium font-brand">
                        <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>
                          {ticket.assignedAgent
                            ? lang === 'ar'
                              ? ticket.assignedAgent.nameAr
                              : ticket.assignedAgent.name
                            : '—'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
                {tickets.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-xs text-slate-500">
                      {lang === 'ar'
                        ? 'لم يتم العثور على تذاكر تطابق معايير البحث الحالية.'
                        : 'No tickets found matching current filters.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Ticket Drawer */}
      <TicketDrawer
        ticketId={selectedTicketId}
        onClose={() => setSelectedTicketId(null)}
        onUpdated={() => refetch()}
      />
    </div>
  );
}
