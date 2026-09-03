'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Headphones,
  Send,
  MessageSquare,
  Lock,
  Globe,
  Search,
  Paperclip
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAgent } from '@/context/AgentContext';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  PriorityBadge,
  ChannelBadge,
  SLABadge,
  StatusBadge
} from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { toast } from '@/components/ui/Toast';
import { CannedResponsesBar } from '@/components/workspace/CannedResponsesBar';
import { SLACountdownTimer } from '@/components/sla/SLACountdownTimer';
import { CSATModal } from '@/components/sla/CSATModal';
import { AICopilotWidget } from '@/components/ai/AICopilotWidget';
import { FileUploadZone, UploadedFile } from '@/components/common/FileUploadZone';
import { AgentTasksWidget } from '@/components/agent/AgentTasksWidget';

export default function WorkspacePage() {
  const { lang, t } = useLanguage();
  const { currentAgent } = useAgent();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [searchQueue, setSearchQueue] = useState('');
  const [replyText, setReplyText] = useState('');
  const [attachments, setAttachments] = useState<UploadedFile[]>([]);
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
    if (!activeTicket || (!replyText.trim() && attachments.length === 0)) return;

    try {
      setIsSubmitting(true);
      await api.addTicketNote(activeTicket.id, {
        content: replyText.trim() || '(Attachment uploaded)',
        authorName: lang === 'ar' ? currentAgent.nameAr : currentAgent.name,
        isInternal,
        channel: activeTicket.channel,
        attachments: attachments as any
      });
      setReplyText('');
      setAttachments([]);
      refetch();
      toast.success(
        lang === 'ar' ? 'تم إرسال الرد بنجاح' : 'Response submitted successfully',
        lang === 'ar' ? 'منصة الردود' : 'Reply Sent'
      );
    } catch (e: any) {
      toast.error(
        e.message || (lang === 'ar' ? 'فشل إرسال الرد' : 'Failed to send note'),
        lang === 'ar' ? 'خطأ' : 'Error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!activeTicket) return;
    try {
      await api.updateTicketStatus(activeTicket.id, newStatus, currentAgent.name);
      refetch();
      toast.success(
        lang === 'ar' ? 'تم تغيير حالة التذكرة' : 'Ticket status updated',
        lang === 'ar' ? 'الحالة' : 'Status Changed'
      );
      if (newStatus === 'RESOLVED') {
        setIsCSATOpen(true);
      }
    } catch (err: any) {
      toast.error(
        err.message || (lang === 'ar' ? 'فشل تحديث الحالة' : 'Failed to update status'),
        lang === 'ar' ? 'خطأ' : 'Error'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2 font-brand">
            <Headphones className="w-6 h-6 text-gold-400" />
            <span>{t('workspaceTitle')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t('workspaceSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-navy-900 border border-navy-800 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400">{t('activeAgent')}:</span>
          <strong className="text-slate-100 font-brand">
            {lang === 'ar' ? currentAgent.nameAr : currentAgent.name}
          </strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane: Assigned Queue & Tasks (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-4 space-y-3 border-gold-500/20 bg-navy-900/80">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gold-300 uppercase tracking-wider font-brand">
                {lang === 'ar' ? `طابور التذاكر (${tickets.length})` : `Inbox Queue (${tickets.length})`}
              </h3>
              <span className="text-[10px] text-emerald-400 font-semibold">
                {lang === 'ar' ? 'طابور مباشر' : 'Active Queue'}
              </span>
            </div>

            {/* Search Queue */}
            <div className="relative">
              <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder={lang === 'ar' ? 'البحث في الطابور...' : 'Search queue...'}
                value={searchQueue}
                onChange={(e) => setSearchQueue(e.target.value)}
                className="w-full bg-navy-950 border border-navy-800 rounded-xl pl-9 pr-3 rtl:pr-9 rtl:pl-3 py-1.5 text-xs text-slate-100 outline-none focus:border-gold-500"
              />
            </div>

            {/* Queue List */}
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {isLoading ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  {lang === 'ar' ? 'جاري تحميل الطابور...' : 'Loading queue...'}
                </div>
              ) : (
                tickets.map((ticket: any) => {
                  const isSelected = ticket.id === activeTicket?.id;
                  return (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-navy-800 border-gold-500 shadow-md shadow-gold-500/10'
                          : 'bg-navy-950/80 border-navy-800 hover:border-gold-500/30 hover:bg-navy-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold font-mono text-gold-300 whitespace-nowrap shrink-0">
                          {ticket.ticketNumber}
                        </span>
                        <PriorityBadge priority={ticket.priority} />
                      </div>

                      <div className="text-xs font-semibold text-slate-100 line-clamp-1">
                        {ticket.title}
                      </div>

                      <div className="text-[11px] text-slate-400 line-clamp-1">
                        {lang === 'ar' && ticket.customer?.nameAr
                          ? ticket.customer.nameAr
                          : ticket.customer?.name}{' '}
                        ({ticket.customer?.company || (lang === 'ar' ? 'مباشر' : 'Direct')})
                      </div>

                      <div className="flex items-center justify-between gap-1.5 flex-wrap pt-2 border-t border-navy-800 text-[10px]">
                        <ChannelBadge channel={ticket.channel} />
                        <SLABadge slaStatus={ticket.slaStatus} />
                      </div>
                    </div>
                  );
                })
              )}
              {tickets.length === 0 && (
                <div className="py-12 text-center text-xs text-slate-500">
                  {lang === 'ar' ? 'لا توجد تذاكر في الطابور' : 'No tickets found in queue'}
                </div>
              )}
            </div>
          </Card>

          {/* Agent Tasks & Reminders Widget */}
          <AgentTasksWidget />
        </div>

        {/* Right Pane: Active Ticket Conversation & Reply Console (8 cols) */}
        <Card className="lg:col-span-8 p-6 flex flex-col justify-between space-y-6 border-gold-500/20 bg-navy-900/80">
          {activeTicket ? (
            <div className="space-y-6">
              {/* Ticket Top Meta */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-navy-800">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-mono text-sm font-extrabold text-gold-300 bg-gold-500/10 px-2.5 py-0.5 rounded-lg border border-gold-500/20">
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
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 flex-wrap min-w-0">
                    <span className="truncate">
                      {lang === 'ar' ? 'العميل: ' : 'Customer: '}
                      <strong className="text-slate-200">
                        {lang === 'ar'
                          ? activeTicket.customer?.nameAr || activeTicket.customer?.name
                          : activeTicket.customer?.name}
                      </strong>
                    </span>
                    <span>•</span>
                    <span className="break-all sm:truncate text-gold-300/80 font-mono text-[11px]">
                      {activeTicket.customer?.email}
                    </span>
                  </div>
                </div>

                {/* Status Quick Select */}
                <div className="w-44">
                  <Select
                    size="sm"
                    value={activeTicket.status}
                    onChange={(val) => handleStatusChange(val)}
                    options={[
                      { value: 'NEW', label: t('status_NEW') },
                      { value: 'OPEN', label: t('status_OPEN') },
                      { value: 'PENDING', label: t('status_PENDING') },
                      { value: 'RESOLVED', label: t('status_RESOLVED') },
                      { value: 'CLOSED', label: t('status_CLOSED') }
                    ]}
                  />
                </div>
              </div>

              {/* Customer Initial Issue */}
              <div className="p-4 rounded-2xl bg-navy-950/80 border border-navy-800 text-xs text-slate-300">
                <div className="font-bold text-gold-400 mb-1 flex items-center justify-between font-brand">
                  <span>{lang === 'ar' ? 'طلب الدعم وتفاصيل المشكلة:' : 'Customer Support Request:'}</span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(activeTicket.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="leading-relaxed whitespace-pre-wrap font-sans">{activeTicket.description}</p>
              </div>

              {/* Conversation Activity Thread */}
              <div>
                <h3 className="text-xs font-bold text-gold-300 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-brand">
                  <MessageSquare className="w-3.5 h-3.5 text-gold-400" />
                  <span>
                    {lang === 'ar'
                      ? `سجل المحادثة والتحديثات (${activeTicket.notes?.length || 0})`
                      : `Activity Thread (${activeTicket.notes?.length || 0})`}
                  </span>
                </h3>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {(activeTicket.notes || []).map((note: any) => (
                    <div
                      key={note.id}
                      className={`p-3.5 rounded-2xl border text-xs ${
                        note.isInternal
                          ? 'bg-amber-950/30 border-amber-800/40 text-amber-200'
                          : 'bg-navy-950 border-navy-800 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1.5 pb-1 border-b border-navy-800">
                        <div className="flex items-center gap-1.5 font-bold font-brand">
                          {note.isInternal ? (
                            <span className="flex items-center gap-1 text-amber-400">
                              <Lock className="w-3 h-3" />
                              <span>{lang === 'ar' ? 'ملاحظة سرية خاصة:' : 'Internal Note:'} {note.authorName}</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-gold-300">
                              <Globe className="w-3 h-3" />
                              <span>{lang === 'ar' ? 'رد معتمد للعميل:' : 'Public Reply:'} {note.authorName}</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(note.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-wrap font-sans">{note.content}</p>

                      {/* Note Attachments */}
                      {note.attachments && note.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2 mt-2 border-t border-navy-800">
                          {note.attachments.map((att: any) => (
                            <a
                              key={att.id}
                              href={att.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-navy-900 border border-gold-500/20 text-[10.5px] text-slate-300 hover:text-gold-300 hover:border-gold-500/40"
                            >
                              <Paperclip className="w-3 h-3 text-gold-400" />
                              <span className="truncate max-w-[120px]">{att.originalName}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {(activeTicket.notes || []).length === 0 && (
                    <div className="py-6 text-center text-xs text-slate-500 border border-dashed border-navy-800 rounded-2xl">
                      {lang === 'ar' ? 'لا توجد ردود مسجلة بعد.' : 'No replies recorded yet.'}
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
              <form onSubmit={handleSendReply} className="space-y-3 pt-3 border-t border-navy-800">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold text-slate-300 font-brand">
                    {lang === 'ar' ? 'محرر الردود والملاحظات' : 'Message Composer'}
                  </span>
                  <Checkbox
                    checked={isInternal}
                    onCheckedChange={(val) => setIsInternal(val)}
                    label={
                      <span className="text-amber-400 font-semibold font-brand">
                        {t('internalNoteLabel')}
                      </span>
                    }
                  />
                </div>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={isInternal ? t('internalNotePlaceholder') : t('publicReplyPlaceholder')}
                  className={`w-full p-3.5 rounded-2xl text-xs outline-none border transition-all ${
                    isInternal
                      ? 'bg-amber-950/20 border-amber-800/50 text-amber-100 placeholder-amber-400/50'
                      : 'bg-navy-950 border-navy-800 text-slate-100 placeholder-slate-500 focus:border-gold-500'
                  }`}
                />

                {/* File Upload Zone */}
                <FileUploadZone
                  attachments={attachments}
                  onAttachmentsChange={setAttachments}
                  maxFiles={4}
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">
                    {lang === 'ar'
                      ? 'يؤدي الإرسال إلى تحديث سجل العميل وتتبع سجل التدقيق.'
                      : 'Pressing Send updates customer timeline and audit logs.'}
                  </span>
                  <Button type="submit" isLoading={isSubmitting} size="sm">
                    <Send className="w-3.5 h-3.5" />
                    <span>{isInternal ? t('saveNoteBtn') : t('sendReplyBtn')}</span>
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="py-24 text-center text-xs text-slate-500">
              {lang === 'ar'
                ? 'اختر تذكرة من الطابور لبدء كتابة الرد.'
                : 'Select a ticket from the queue to start responding.'}
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
