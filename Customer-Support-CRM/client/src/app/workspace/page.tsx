'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Headphones, Send, Clock, Sparkles, MessageSquare, ShieldAlert, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAgent } from '@/context/AgentContext';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PriorityBadge, ChannelBadge, SLABadge, StatusBadge } from '@/components/ui/Badge';

export default function WorkspacePage() {
  const { lang, t } = useLanguage();
  const { currentAgent } = useAgent();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  const { data: ticketsData, refetch: refetchTickets } = useQuery({
    queryKey: ['workspace-tickets'],
    queryFn: () => api.getTickets({ limit: 20 })
  });

  const { data: cannedData } = useQuery({
    queryKey: ['canned-responses'],
    queryFn: () => api.getCannedResponses()
  });

  const tickets = ticketsData?.data || [];
  const activeTicket = tickets.find((t: any) => t.id === selectedTicketId) || tickets[0];

  const handleSendReply = async () => {
    if (!activeTicket || !replyText.trim()) return;
    try {
      await api.addTicketNote(activeTicket.id, {
        content: replyText,
        authorName: lang === 'ar' ? currentAgent.nameAr : currentAgent.name,
        isInternal,
        channel: activeTicket.channel
      });
      setReplyText('');
      refetchTickets();
    } catch (e: any) {
      alert(e.message || 'Failed to send note');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Headphones className="w-6 h-6 text-cyan-400" />
            <span>{t('navWorkspace')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Dedicated agent reply console with canned shortcuts and live SLA countdowns.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Assigned Queue */}
        <Card className="lg:col-span-1 p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Agent Queue ({tickets.length})</h3>
          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {tickets.map((ticket: any) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicketId(ticket.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  (activeTicket?.id === ticket.id)
                    ? 'bg-indigo-600/15 border-indigo-500/50 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-1.5">
                  <span className="font-bold text-indigo-400">{ticket.ticketNumber}</span>
                  <PriorityBadge priority={ticket.priority} />
                </div>
                <h4 className="text-xs font-semibold text-slate-200 line-clamp-1 mb-2">{ticket.title}</h4>
                <div className="flex items-center justify-between text-[10px]">
                  <ChannelBadge channel={ticket.channel} />
                  <SLABadge slaStatus={ticket.slaStatus} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right: Active Ticket Conversation & Reply */}
        <Card className="lg:col-span-2 flex flex-col justify-between p-6">
          {activeTicket ? (
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-indigo-400">{activeTicket.ticketNumber}</span>
                    <StatusBadge status={activeTicket.status} />
                    <PriorityBadge priority={activeTicket.priority} />
                  </div>
                  <h2 className="text-lg font-bold text-white">{activeTicket.title}</h2>
                  <p className="text-xs text-slate-400 mt-1">Customer: {activeTicket.customer?.name} ({activeTicket.customer?.email})</p>
                </div>
                <SLABadge slaStatus={activeTicket.slaStatus} />
              </div>

              {/* Initial Customer Issue */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                <div className="font-bold text-indigo-400 mb-1">Original Issue Description:</div>
                <p className="leading-relaxed">{activeTicket.description}</p>
              </div>

              {/* Canned Responses Row */}
              <div>
                <div className="text-[11px] font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>1-Click Canned Quick Replies:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(cannedData?.data || []).map((c: any) => (
                    <button
                      key={c.id}
                      onClick={() => setReplyText(lang === 'ar' ? c.contentAr || c.content : c.content)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition-colors"
                    >
                      {c.shortcut} ({lang === 'ar' ? c.titleAr : c.title})
                    </button>
                  ))}
                </div>
              </div>

              {/* Reply Box */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Compose Message</span>
                  <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0"
                    />
                    <span>Internal Agent Note (Private)</span>
                  </label>
                </div>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={isInternal ? 'Add private internal team note...' : 'Type public reply to customer...'}
                  className={`w-full p-3 rounded-2xl text-xs outline-none border transition-all ${
                    isInternal ? 'bg-amber-950/20 border-amber-800/40 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-100 focus:border-indigo-500'
                  }`}
                />
                <div className="flex justify-end">
                  <Button onClick={handleSendReply} className="text-xs">
                    <Send className="w-3.5 h-3.5" />
                    <span>{isInternal ? 'Save Internal Note' : 'Send Reply'}</span>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-xs text-slate-500">No active ticket selected</div>
          )}
        </Card>
      </div>
    </div>
  );
}
