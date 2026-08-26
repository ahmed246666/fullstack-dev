'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Ticket, Search, Filter, Plus, Kanban, User, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge, PriorityBadge, ChannelBadge, SLABadge } from '@/components/ui/Badge';
import { TicketDrawer } from '@/components/tickets/TicketDrawer';

export default function TicketsPage() {
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [channel, setChannel] = useState('ALL');
  const [priority, setPriority] = useState('ALL');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['tickets-table', search, status, channel, priority],
    queryFn: () => api.getTickets({ search, status, channel, priority, limit: 100 })
  });

  const tickets = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Ticket className="w-6 h-6 text-indigo-400" />
            <span>{t('navTickets')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'ar'
              ? 'عرض جدولي تفصيلي لجميع تذاكر الدعم عبر القنوات الخمس مع الفلاتر المتقدمة.'
              : 'Detailed multi-channel ticket table view with advanced filtering, sorting, and SLA trackers.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/tickets/kanban">
            <Button variant="secondary" className="text-xs">
              <Kanban className="w-4 h-4" />
              <span>{t('navKanban')}</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Controls */}
      <Card className="p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative w-full sm:col-span-1">
            <Search className="absolute left-3.5 rtl:right-3.5 rtl:left-auto top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={
                lang === 'ar'
                  ? 'ابحث بالتذكرة، العميل، العنوان...'
                  : 'Search ticket #, customer, subject...'
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2 text-xs text-slate-100 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
            >
              <option value="ALL">All Statuses (الكل)</option>
              <option value="NEW">New</option>
              <option value="OPEN">Open</option>
              <option value="PENDING">Pending</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
            >
              <option value="ALL">All Channels (جميع القنوات)</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="EMAIL">Email</option>
              <option value="LIVE_CHAT">Live Chat</option>
              <option value="SMS">SMS Gateway</option>
              <option value="WEB_FORM">Web Portal</option>
            </select>
          </div>

          <div>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
            >
              <option value="ALL">All Priorities (جميع الأولويات)</option>
              <option value="URGENT">Urgent (1h)</option>
              <option value="HIGH">High (2h)</option>
              <option value="MEDIUM">Medium (4h)</option>
              <option value="LOW">Low (8h)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tickets Data Table */}
      <Card>
        {isLoading ? (
          <div className="py-16 text-center text-xs text-slate-400 animate-pulse">
            Loading Omnichannel Tickets...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="text-[11px] text-slate-400 uppercase border-b border-slate-800 bg-slate-900/40">
                <tr>
                  <th className="px-4 py-3.5">Ticket Code</th>
                  <th className="px-4 py-3.5">Subject</th>
                  <th className="px-4 py-3.5">Customer</th>
                  <th className="px-4 py-3.5">Channel</th>
                  <th className="px-4 py-3.5">Priority</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">SLA Health</th>
                  <th className="px-4 py-3.5 text-right rtl:text-left">Assigned Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tickets.map((ticket: any) => (
                  <tr
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className="hover:bg-slate-900/70 cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3 font-mono font-bold text-indigo-400 group-hover:underline">
                      {ticket.ticketNumber}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-100 line-clamp-1">
                        {ticket.title}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">
                        {ticket.description}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-200">
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
                    <td className="px-4 py-3 text-right rtl:text-left text-slate-300">
                      <div className="flex items-center justify-end rtl:justify-start gap-1.5 font-medium">
                        <User className="w-3.5 h-3.5 text-slate-500" />
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
                      No tickets found matching current filters.
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
