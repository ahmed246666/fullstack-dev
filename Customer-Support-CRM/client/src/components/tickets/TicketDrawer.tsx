'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useQuery } from '@tanstack/react-query';
import {
  X,
  Building2,
  Mail,
  Send,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  Lock,
  Globe,
  Star,
  Paperclip,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAgent } from '@/context/AgentContext';
import { api } from '@/lib/api';
import {
  TierBadge,
  StatusBadge,
  PriorityBadge,
  ChannelBadge,
  SLABadge
} from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SLACountdownTimer } from '@/components/sla/SLACountdownTimer';
import { CSATModal } from '@/components/sla/CSATModal';
import { AICopilotWidget } from '@/components/ai/AICopilotWidget';
import { FileUploadZone, UploadedFile } from '@/components/common/FileUploadZone';

interface TicketDrawerProps {
  ticketId: string | null;
  onClose: () => void;
  onUpdated?: () => void;
}

export function TicketDrawer({ ticketId, onClose, onUpdated }: TicketDrawerProps) {
  const { lang, t } = useLanguage();
  const { currentAgent } = useAgent();
  const [replyText, setReplyText] = useState('');
  const [attachments, setAttachments] = useState<UploadedFile[]>([]);
  const [isInternal, setIsInternal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [statusUpdating, setStatusUpdating] = useState(false);
  const [isCSATOpen, setIsCSATOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['ticket-detail', ticketId],
    queryFn: () => api.getTicketById(ticketId!),
    enabled: !!ticketId
  });

  if (!ticketId || !mounted) return null;

  const ticket = data?.data;

  const handleStatusChange = async (newStatus: string) => {
    if (!ticket) return;
    try {
      setStatusUpdating(true);
      await api.updateTicketStatus(ticket.id, newStatus, currentAgent.name);
      refetch();
      onUpdated?.();
      if (newStatus === 'RESOLVED') {
        setIsCSATOpen(true);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleSendNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket || (!replyText.trim() && attachments.length === 0)) return;

    try {
      setIsSubmitting(true);
      await api.addTicketNote(ticket.id, {
        content: replyText.trim() || '(Attachment uploaded)',
        authorName: currentAgent.name,
        isInternal,
        channel: ticket.channel,
        attachments: attachments as any
      });
      setReplyText('');
      setAttachments([]);
      refetch();
      onUpdated?.();
    } catch (err: any) {
      alert(err.message || 'Failed to send note');
    } finally {
      setIsSubmitting(false);
    }
  };


  return createPortal(
    <div className="fixed inset-0 z-[999999] overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 rtl:left-0 rtl:right-auto max-w-full flex pl-10 rtl:pl-0 rtl:pr-10 z-[999999]">
        <div className="w-screen max-w-2xl glass-panel bg-navy-950/95 border-l rtl:border-r rtl:border-l-0 border-gold-500/30 p-6 md:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto animate-in slide-in-from-right rtl:slide-in-from-left duration-200">
          {isLoading ? (
            <div className="py-24 text-center text-xs text-slate-400 animate-pulse">
              Loading Ticket Details...
            </div>
          ) : ticket ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="font-mono text-sm font-extrabold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-lg border border-indigo-500/20">
                      {ticket.ticketNumber}
                    </span>
                    <ChannelBadge channel={ticket.channel} />
                    <PriorityBadge priority={ticket.priority} />
                    <SLABadge slaStatus={ticket.slaStatus} />
                    <SLACountdownTimer
                      resolutionDueAt={ticket.resolutionDueAt}
                      status={ticket.status}
                    />
                  </div>
                  <h2 className="text-xl font-bold text-white mt-2 leading-snug">{ticket.title}</h2>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>
                      Customer:{' '}
                      <strong className="text-slate-200">
                        {lang === 'ar'
                          ? ticket.customer?.nameAr || ticket.customer?.name
                          : ticket.customer?.name}
                      </strong>
                    </span>
                    <span>•</span>
                    <span>{ticket.customer?.company || 'Direct'}</span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status and Assignment Control Bar */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Ticket Status
                  </label>
                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={statusUpdating}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-semibold outline-none focus:border-indigo-500"
                  >
                    <option value="NEW">New (Unassigned)</option>
                    <option value="OPEN">Open (In Progress)</option>
                    <option value="PENDING">Pending (Waiting on Customer)</option>
                    <option value="RESOLVED">Resolved (Complete)</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Assigned Agent
                  </label>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <User className="w-4 h-4 text-indigo-400" />
                    <span className="font-semibold text-slate-200">
                      {ticket.assignedAgent
                        ? lang === 'ar'
                          ? ticket.assignedAgent.nameAr
                          : ticket.assignedAgent.name
                        : 'Sara Al-Ghamdi (Auto-Assigned)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* CSAT Feedback Banner (If Rated or Resolved) */}
              {ticket.csatRating ? (
                <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-800/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-200">Customer CSAT Score:</span>
                    <span className="font-extrabold text-amber-300">
                      {ticket.csatRating} / 5 Stars
                    </span>
                  </div>
                  {ticket.csatFeedback && (
                    <span className="text-slate-400 italic text-[11px] truncate max-w-xs">
                      &quot;{ticket.csatFeedback}&quot;
                    </span>
                  )}
                </div>
              ) : ticket.status === 'RESOLVED' ? (
                <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-800/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-200 font-semibold">
                      Ready for Customer CSAT Survey
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setIsCSATOpen(true)}
                    className="text-[11px] py-1 bg-amber-600 hover:bg-amber-500 text-white"
                  >
                    Rate Service
                  </Button>
                </div>
              ) : null}

              {/* Issue Description Box */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-2">
                <div className="font-bold text-indigo-400 mb-1 flex items-center justify-between">
                  <span>Initial Support Request</span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{ticket.description}</p>

                {/* Ticket Attachments */}
                {ticket.attachments && ticket.attachments.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80">
                    <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                      <Paperclip className="w-3 h-3 text-gold-400" />
                      <span>Attached Files ({ticket.attachments.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {ticket.attachments.map((att: any) => (
                        <a
                          key={att.id}
                          href={att.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-navy-950 border border-navy-700 hover:border-gold-500/50 text-[11px] text-slate-300 hover:text-gold-300 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                          <span className="truncate max-w-[130px]">{att.originalName}</span>
                          <span className="text-[9.5px] text-slate-500 font-mono">
                            {(att.sizeBytes / 1024).toFixed(0)}KB
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Conversation & Notes Activity Thread */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Conversation & Internal Notes ({ticket.notes?.length || 0})</span>
                  </h3>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {(ticket.notes || []).map((note: any) => (
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

                      {/* Note Attachments */}
                      {note.attachments && note.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2 mt-2 border-t border-slate-800/50">
                          {note.attachments.map((att: any) => (
                            <a
                              key={att.id}
                              href={att.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-navy-950/80 border border-slate-700 text-[10.5px] text-slate-300 hover:text-gold-300 hover:border-gold-500/40"
                            >
                              <Paperclip className="w-3 h-3 text-gold-400" />
                              <span className="truncate max-w-[120px]">{att.originalName}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {(ticket.notes || []).length === 0 && (
                    <div className="py-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                      No replies or internal notes added yet.
                    </div>
                  )}
                </div>
              </div>

              {/* AI Support Copilot */}
              <AICopilotWidget ticket={ticket} onApplyDraft={(draft) => setReplyText(draft)} />

              {/* Reply / Note Composer */}
              <form onSubmit={handleSendNote} className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Add Message / Reply</span>
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
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={
                    isInternal
                      ? 'Add private note for support agents...'
                      : 'Type public reply to send to customer...'
                  }
                  className={`w-full p-3 rounded-2xl text-xs outline-none border transition-all ${
                    isInternal
                      ? 'bg-amber-950/20 border-amber-800/50 text-amber-100 placeholder-amber-400/50'
                      : 'bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-indigo-500'
                  }`}
                />

                {/* File Upload Zone */}
                <FileUploadZone
                  attachments={attachments}
                  onAttachmentsChange={setAttachments}
                  maxFiles={4}
                />

                <div className="flex justify-end pt-1">
                  <Button type="submit" isLoading={isSubmitting} size="sm">
                    <Send className="w-3.5 h-3.5" />
                    <span>{isInternal ? 'Save Internal Note' : 'Send Public Reply'}</span>
                  </Button>
                </div>
              </form>

            </div>
          ) : (
            <div className="text-center text-xs text-rose-400">Ticket not found</div>
          )}
        </div>
      </div>

      {/* CSAT Modal */}
      <CSATModal
        isOpen={isCSATOpen}
        ticket={ticket}
        onClose={() => setIsCSATOpen(false)}
        onSuccess={() => {
          refetch();
          onUpdated?.();
        }}
      />
    </div>,
    document.body
  );
}
