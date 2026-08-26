'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Headphones,
  Send,
  Clock,
  Sparkles,
  MessageSquare,
  ShieldAlert,
  CheckCircle,
  User,
  Building2,
  Lock,
  Globe,
  Search,
  CheckCircle2,
  Star
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAgent } from '@/context/AgentContext';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  PriorityBadge,
  ChannelBadge,
  SLABadge,
  StatusBadge,
  TierBadge
} from '@/components/ui/Badge';
import { CannedResponsesBar } from '@/components/workspace/CannedResponsesBar';
import { SLACountdownTimer } from '@/components/sla/SLACountdownTimer';
import { CSATModal } from '@/components/sla/CSATModal';
import { AICopilotWidget } from '@/components/ai/AICopilotWidget';

export default function WorkspacePage() {
  const { lang, t } = useLanguage();
  const { currentAgent } = useAgent();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [searchQueue, setSearchQueue] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCSATOpen, setIsCSATOpen] = useState(false);

  const {
    data: ticketsData,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['workspace-tickets', searchQueue],
    queryFn: () => api.getTickets({ search: searchQueue, limit: 50 })
  });

  const tickets = ticketsData?.data || [];
  const activeTicket = tickets.find((t: any) => t.id === selectedTicketId) || tickets[0];

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyText.trim()) return;

    try {
      setIsSubmitting(true);
      await api.addTicketNote(activeTicket.id, {
        content: replyText.trim(),
        authorName: lang === 'ar' ? currentAgent.nameAr : currentAgent.name,
        isInternal,
        channel: activeTicket.channel
      });
      setReplyText('');
      refetch();
    } catch (e: any) {
      alert(e.message || 'Failed to send note');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!activeTicket) return;
    try {
      await api.updateTicketStatus(activeTicket.id, newStatus, currentAgent.name);
      refetch();
      if (newStatus === 'RESOLVED') {
        setIsCSATOpen(true);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Headphones className="w-6 h-6 text-cyan-400" />
            <span>{t('navWorkspace')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'ar'
              ? 'وحدة تحكم الوكيل المتكاملة مع الردود الجاهزة بنقرة واحدة، والملاحظات الداخلية وسجل التذاكر.'
              : 'Interactive agent console with 1-click canned responses, internal notes, and omnichannel replies.'}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400">Agent:</span>
          <strong className="text-slate-100">
            {lang === 'ar' ? currentAgent.nameAr : currentAgent.name}
          </strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Assigned Queue (4 cols) */}
        <Card className="lg:col-span-4 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Inbox Queue ({tickets.length})
            </h3>
            <span className="text-[10px] text-indigo-400 font-semibold">Active Queue</span>
          </div>

          {/* Search Queue */}
          <div className="relative">
            <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search queue..."
              value={searchQueue}
              onChange={(e) => setSearchQueue(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 rtl:pr-9 rtl:pl-3 py-1.5 text-xs text-slate-100 outline-none focus:border-cyan-500"
            />
          </div>

          {/* Queue List */}
          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {isLoading ? (
              <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
                Loading inbox...
              </div>
            ) : (
              tickets.map((ticket: any) => {
                const isSelected = activeTicket?.id === ticket.id;

                return (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500/60 shadow-lg shadow-indigo-600/10'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="font-mono font-bold text-indigo-400">
                        {ticket.ticketNumber}
                      </span>
                      <PriorityBadge priority={ticket.priority} />
                    </div>

                    <h4 className="text-xs font-semibold text-slate-200 line-clamp-1 mb-1.5">
                      {ticket.title}
                    </h4>

                    <div className="text-[11px] text-slate-400 mb-2 truncate">
                      {lang === 'ar'
                        ? ticket.customer?.nameAr || ticket.customer?.name
                        : ticket.customer?.name}{' '}
                      ({ticket.customer?.company || 'Direct'})
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px]">
                      <ChannelBadge channel={ticket.channel} />
                      <SLABadge slaStatus={ticket.slaStatus} />
                    </div>
                  </div>
                );
              })
            )}
            {tickets.length === 0 && (
              <div className="py-12 text-center text-xs text-slate-500">
                No tickets found in queue
              </div>
            )}
          </div>
        </Card>

        {/* Right Pane: Active Ticket Conversation & Reply Console (8 cols) */}
        <Card className="lg:col-span-8 p-6 flex flex-col justify-between space-y-6">
          {activeTicket ? (
            <div className="space-y-6">
              {/* Ticket Top Meta */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-mono text-sm font-extrabold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-lg border border-indigo-500/20">
                      {activeTicket.ticketNumber}
                    </span>
                    <ChannelBadge channel={activeTicket.channel} />
                    <PriorityBadge priority={activeTicket.priority} />
                    <StatusBadge status={activeTicket.status} />
                    <SLACountdownTimer
                      resolutionDueAt={activeTicket.resolutionDueAt}
                      status={activeTicket.status}
                    />
                  </div>
                  <h2 className="text-xl font-bold text-white leading-snug">
                    {activeTicket.title}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>
                      Customer:{' '}
                      <strong className="text-slate-200">
                        {lang === 'ar'
                          ? activeTicket.customer?.nameAr || activeTicket.customer?.name
                          : activeTicket.customer?.name}
                      </strong>
                    </span>
                    <span>•</span>
                    <span>{activeTicket.customer?.email}</span>
                  </div>
                </div>

                {/* Status Quick Select */}
                <div className="flex items-center gap-2">
                  <select
                    value={activeTicket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-semibold outline-none focus:border-indigo-500"
                  >
                    <option value="NEW">New</option>
                    <option value="OPEN">Open</option>
                    <option value="PENDING">Pending</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
              </div>

              {/* Customer Initial Issue */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                <div className="font-bold text-indigo-400 mb-1 flex items-center justify-between">
                  <span>Customer Support Request:</span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(activeTicket.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{activeTicket.description}</p>
              </div>

              {/* Conversation Activity Thread */}
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Activity Thread ({activeTicket.notes?.length || 0})</span>
                </h3>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {(activeTicket.notes || []).map((note: any) => (
                    <div
                      key={note.id}
                      className={`p-3.5 rounded-2xl border text-xs ${
                        note.isInternal
                          ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
                          : 'bg-slate-900/80 border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1.5 pb-1 border-b border-slate-800/60">
                        <div className="flex items-center gap-1.5 font-bold">
                          {note.isInternal ? (
                            <span className="flex items-center gap-1 text-amber-400">
                              <Lock className="w-3 h-3" />
                              <span>Internal Note: {note.authorName}</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-indigo-400">
                              <Globe className="w-3 h-3" />
                              <span>Public Reply: {note.authorName}</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {new Date(note.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap">{note.content}</p>
                    </div>
                  ))}
                  {(activeTicket.notes || []).length === 0 && (
                    <div className="py-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                      No replies recorded yet.
                    </div>
                  )}
                </div>
              </div>

              {/* AI Support Copilot */}
              <AICopilotWidget
                ticket={activeTicket}
                onApplyDraft={(draft) => setReplyText(draft)}
              />

              {/* 1-Click Canned Responses Bar */}
              <div className="pt-2">
                <CannedResponsesBar onSelect={(text) => setReplyText(text)} />
              </div>

              {/* Composer Box */}
              <form onSubmit={handleSendReply} className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Message Composer</span>
                  <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0"
                    />
                    <span className="text-amber-400 font-semibold">Private Internal Note</span>
                  </label>
                </div>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={
                    isInternal
                      ? 'Add private note for support agents...'
                      : 'Type public reply to send to customer...'
                  }
                  className={`w-full p-3.5 rounded-2xl text-xs outline-none border transition-all ${
                    isInternal
                      ? 'bg-amber-950/20 border-amber-800/50 text-amber-100 placeholder-amber-400/50'
                      : 'bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-cyan-500'
                  }`}
                  required
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Pressing Send updates customer timeline and audit logs.
                  </span>
                  <Button type="submit" isLoading={isSubmitting} size="sm">
                    <Send className="w-3.5 h-3.5" />
                    <span>{isInternal ? 'Save Internal Note' : 'Send Public Reply'}</span>
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="py-24 text-center text-xs text-slate-500">
              Select a ticket from the queue to start responding.
            </div>
          )}
        </Card>
      </div>

      {/* CSAT Modal */}
      <CSATModal
        isOpen={isCSATOpen}
        ticket={activeTicket}
        onClose={() => setIsCSATOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
