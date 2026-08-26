'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Ticket, Search, Filter } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusBadge, PriorityBadge, ChannelBadge, SLABadge } from '@/components/ui/Badge';

export default function TicketsPage() {
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [channel, setChannel] = useState('ALL');

  const { data, isLoading } = useQuery({
    queryKey: ['tickets', search, status, channel],
    queryFn: () => api.getTickets({ search, status, channel })
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Ticket className="w-6 h-6 text-indigo-400" />
            <span>{t('navTickets')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Detailed omnichannel data table view with multi-column sorting and filtering.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative w-full sm:col-span-1">
            <Search className="absolute left-3.5 rtl:right-3.5 rtl:left-auto top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ticket #, subject, customer..."
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
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="OPEN">Open</option>
              <option value="PENDING">Pending</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          <div>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
            >
              <option value="ALL">All Channels</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="EMAIL">Email</option>
              <option value="LIVE_CHAT">Live Chat</option>
              <option value="SMS">SMS</option>
              <option value="WEB_FORM">Web Portal</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card>
        {isLoading ? (
          <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
            Loading tickets...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="text-[11px] text-slate-400 uppercase border-b border-slate-800 bg-slate-900/40">
                <tr>
                  <th className="px-4 py-3">Number</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Channel</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">SLA Status</th>
                  <th className="px-4 py-3 text-right rtl:text-left">Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(data?.data || []).map((ticket: any) => (
                  <tr key={ticket.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="px-4 py-3 font-bold text-indigo-400">{ticket.ticketNumber}</td>
                    <td className="px-4 py-3 font-semibold text-slate-200">{ticket.title}</td>
                    <td className="px-4 py-3 text-slate-300">
                      {lang === 'ar'
                        ? ticket.customer?.nameAr || ticket.customer?.name
                        : ticket.customer?.name}
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
                      {ticket.assignedAgent
                        ? lang === 'ar'
                          ? ticket.assignedAgent.nameAr
                          : ticket.assignedAgent.name
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
