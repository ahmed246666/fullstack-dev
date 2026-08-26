'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Globe,
  Search,
  Plus,
  Send,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  Building2,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Mail
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge, PriorityBadge, ChannelBadge, SLABadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { SLACountdownTimer } from '@/components/sla/SLACountdownTimer';

export default function PublicPortalPage() {
  const { lang, toggleLanguage, t } = useLanguage();
  const [ticketSearch, setTicketSearch] = useState('TCK-1001');
  const [queriedCode, setQueriedCode] = useState('TCK-1001');
  const [customerReply, setCustomerReply] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // New Public Ticket Modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newPriority, setNewPriority] = useState('HIGH');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [createdSuccessCode, setCreatedSuccessCode] = useState<string | null>(null);

  // Query Ticket by Search
  const {
    data: ticketsData,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['public-ticket-lookup', queriedCode],
    queryFn: () => api.getTickets({ search: queriedCode, limit: 1 })
  });

  const { data: customersData } = useQuery({
    queryKey: ['customers-public-link'],
    queryFn: () => api.getCustomers({ limit: 10 })
  });

  const matchedTicket = ticketsData?.data?.[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQueriedCode(ticketSearch.trim());
  };

  const handleSendCustomerReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchedTicket || !customerReply.trim()) return;

    try {
      setIsSubmittingReply(true);
      await api.addTicketNote(matchedTicket.id, {
        content: customerReply.trim(),
        authorName: matchedTicket.customer?.name || 'Customer / العميل',
        isInternal: false,
        channel: 'WEB_FORM'
      });
      setCustomerReply('');
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to send reply');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleCreatePublicTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;

    try {
      setIsSubmittingTicket(true);
      const defaultCustomerId = customersData?.data?.[0]?.id;
      const res = await api.createTicket({
        title: newTitle.trim(),
        description: newDesc.trim(),
        customerId: defaultCustomerId,
        priority: newPriority,
        channel: 'WEB_FORM',
        department: 'Support'
      });
      setCreatedSuccessCode(res.data?.ticketNumber || 'TCK-NEW');
      setTicketSearch(res.data?.ticketNumber || '');
      setQueriedCode(res.data?.ticketNumber || '');
      refetch();
      setTimeout(() => {
        setIsCreateOpen(false);
        setCreatedSuccessCode(null);
        setNewTitle('');
        setNewDesc('');
      }, 2000);
    } catch (err: any) {
      alert(err.message || 'Failed to submit inquiry');
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      {/* Top Portal Nav */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-indigo-600/30">
            عزم
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AZM Public Support Portal</h1>
            <p className="text-xs text-slate-400">بوابة الدعم الفني وتتبع التذاكر لعملاء عزم</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white"
          >
            {lang === 'en' ? 'العربية' : 'English'}
          </button>
          <Link href="/">
            <Button variant="secondary" size="sm" className="text-xs">
              Agent Portal Login
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Search Box */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 border border-slate-800 space-y-6 text-center shadow-2xl">
        <div className="max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20">
            <Globe className="w-3.5 h-3.5" />
            <span>24/7 Real-Time Ticket Tracker</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            {lang === 'ar' ? 'تتبع حالة طلبك الفني فورياً' : 'Track Your Support Request Live'}
          </h2>
          <p className="text-xs text-slate-400">
            {lang === 'ar'
              ? 'أدخل رقم التذكرة لمتابعة حالة المعالجة وسجل الردود واتفاقية الـ SLA.'
              : 'Enter your ticket reference code to inspect real-time progress, agent notes, and SLA status.'}
          </p>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="max-w-lg mx-auto flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 rtl:right-4 rtl:left-auto top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={ticketSearch}
              onChange={(e) => setTicketSearch(e.target.value)}
              placeholder="e.g. TCK-1001"
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-11 pr-4 rtl:pr-11 rtl:pl-4 py-3 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500 shadow-inner"
              required
            />
          </div>
          <Button type="submit" size="md" className="py-3 px-6 text-xs">
            Track Ticket
          </Button>
        </form>

        <div className="flex items-center justify-center gap-3 text-xs text-slate-400 pt-2">
          <span>Need to report a new problem?</span>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="text-indigo-400 hover:underline font-bold"
          >
            + Submit New Inquiry
          </button>
        </div>
      </div>

      {/* Ticket Details View */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-slate-400 animate-pulse">
          Searching ticket tracking records...
        </div>
      ) : matchedTicket ? (
        <Card className="p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-mono text-sm font-extrabold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-xl border border-indigo-500/20">
                  {matchedTicket.ticketNumber}
                </span>
                <StatusBadge status={matchedTicket.status} />
                <PriorityBadge priority={matchedTicket.priority} />
                <SLACountdownTimer
                  resolutionDueAt={matchedTicket.resolutionDueAt}
                  status={matchedTicket.status}
                />
              </div>
              <h2 className="text-xl font-bold text-white">{matchedTicket.title}</h2>
              <div className="text-xs text-slate-400 mt-1">
                Requested by:{' '}
                <strong className="text-slate-200">{matchedTicket.customer?.name}</strong> • Created
                on {new Date(matchedTicket.createdAt).toLocaleDateString()}
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
              <User className="w-4 h-4 text-indigo-400" />
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">
                  Assigned Specialist
                </div>
                <div className="font-bold text-slate-200">
                  {matchedTicket.assignedAgent
                    ? lang === 'ar'
                      ? matchedTicket.assignedAgent.nameAr
                      : matchedTicket.assignedAgent.name
                    : 'Support Team'}
                </div>
              </div>
            </div>
          </div>

          {/* Issue Description */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300">
            <div className="font-bold text-indigo-400 mb-1">Inquiry Description:</div>
            <p className="leading-relaxed whitespace-pre-wrap">{matchedTicket.description}</p>
          </div>

          {/* Public Conversation History (Internal Notes Filtered Out) */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span>Official Responses & Activity</span>
            </h3>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {(matchedTicket.notes || [])
                .filter((note: any) => !note.isInternal)
                .map((note: any) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px] pb-1 border-b border-slate-800/60">
                      <strong className="text-indigo-400 flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        <span>{note.authorName}</span>
                      </strong>
                      <span className="text-[10px] text-slate-500">
                        {new Date(note.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-200 leading-relaxed whitespace-pre-wrap pt-1">
                      {note.content}
                    </p>
                  </div>
                ))}

              {(matchedTicket.notes || []).filter((n: any) => !n.isInternal).length === 0 && (
                <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                  Our support engineering team is reviewing your ticket. Updates will appear here.
                </div>
              )}
            </div>
          </div>

          {/* Customer Reply Box */}
          <form
            onSubmit={handleSendCustomerReply}
            className="space-y-3 pt-4 border-t border-slate-800"
          >
            <span className="text-xs font-bold text-slate-300 block">
              Send Update / Reply to Support Team
            </span>
            <textarea
              rows={3}
              value={customerReply}
              onChange={(e) => setCustomerReply(e.target.value)}
              placeholder="Type your message or additional details here..."
              className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 outline-none"
              required
            />
            <div className="flex justify-end">
              <Button type="submit" isLoading={isSubmittingReply} size="sm">
                <Send className="w-3.5 h-3.5" />
                <span>Send Reply</span>
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <div className="py-16 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-3xl">
          No ticket found with tracking code &quot;{queriedCode}&quot;. Please verify the ticket
          code.
        </div>
      )}

      {/* New Public Inquiry Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Submit New Support Request"
        maxWidth="lg"
      >
        {createdSuccessCode ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Ticket Submitted Successfully!</h3>
            <p className="text-xs text-slate-400">
              Your tracking reference code is{' '}
              <strong className="font-mono text-emerald-400">{createdSuccessCode}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleCreatePublicTicket} className="space-y-4">
            <Input
              label="Subject / العنوان"
              placeholder="e.g. Inability to access portal API keys"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Your Name / الاسم"
                placeholder="Tariq Al-Harbi"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <Input
                label="Email Address / البريد الإلكتروني"
                type="email"
                placeholder="customer@enterprise.sa"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Priority Level
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
              >
                <option value="URGENT">Critical Business Impact (1h Response)</option>
                <option value="HIGH">High Priority (2h Response)</option>
                <option value="MEDIUM">Standard Inquiry (4h Response)</option>
                <option value="LOW">General Question (8h Response)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Issue Description / تفاصيل المشكلة
              </label>
              <textarea
                rows={4}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Provide detailed information regarding the issue..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                size="sm"
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmittingTicket} size="sm">
                Submit Inquiry
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
