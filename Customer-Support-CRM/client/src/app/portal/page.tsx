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
  Mail,
  ShieldAlert,
  Paperclip,
  FileText
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
import { FileUploadZone, UploadedFile } from '@/components/common/FileUploadZone';

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
  const [portalAttachments, setPortalAttachments] = useState<UploadedFile[]>([]);
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
        authorName: matchedTicket.customer?.name || (lang === 'ar' ? 'العميل' : 'Customer'),
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
        department: 'Support',
        attachments: portalAttachments
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
        setPortalAttachments([]);
      }, 2000);
    } catch (err: any) {
      alert(err.message || 'Failed to submit inquiry');
    } finally {
      setIsSubmittingTicket(false);
    }

  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      {/* Top Portal Nav */}
      <div className="flex items-center justify-between pb-6 border-b border-navy-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-gold-600 via-gold-500 to-gold-400 text-navy-950 flex items-center justify-center font-extrabold text-xl shadow-lg shadow-gold-500/20 font-brand">
            عزم
          </div>
          <div>
            <h1 className="text-xl font-bold text-white font-brand text-gold-300">
              {lang === 'ar'
                ? 'بوابة دعم وخدمة العملاء الذاتية'
                : 'AZM Public Customer Support Portal'}
            </h1>
            <p className="text-xs text-slate-400 font-sans">
              {lang === 'ar'
                ? 'منصة تتبع التذاكر والتواصل المباشر مع فريق الدعم'
                : 'Self-service ticket tracking and live inquiry submission'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="px-3.5 py-1.5 rounded-xl border border-navy-800 bg-navy-900 text-xs font-semibold text-gold-300 hover:text-white transition-colors"
          >
            {lang === 'en' ? 'العربية' : 'English'}
          </button>
          <Link href="/login">
            <Button
              variant="secondary"
              size="sm"
              className="text-xs border-gold-500/30 text-gold-300 hover:bg-navy-900"
            >
              {lang === 'ar' ? 'دخول الموظفين' : 'Specialist Login'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Search Box */}
      <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 border border-gold-500/30 space-y-6 text-center shadow-2xl">
        <div className="max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 text-gold-300 text-xs font-semibold border border-gold-500/20 font-brand">
            <Globe className="w-3.5 h-3.5 text-gold-400" />
            <span>
              {lang === 'ar' ? 'نظام التتبع المباشر 24/7' : '24/7 Real-Time Ticket Tracker'}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-brand text-gold-200">
            {lang === 'ar' ? 'تتبع حالة طلبك الفني فورياً' : 'Track Your Support Request Live'}
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            {lang === 'ar'
              ? 'أدخل رقم التذكرة لمتابعة حالة المعالجة وسجل الردود واتفاقية الـ SLA.'
              : 'Enter your ticket reference code to inspect real-time progress, agent notes, and SLA status.'}
          </p>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="max-w-lg mx-auto flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 rtl:right-4 rtl:left-auto top-1/2 -translate-y-1/2 w-4 h-4 text-gold-400" />
            <input
              type="text"
              value={ticketSearch}
              onChange={(e) => setTicketSearch(e.target.value)}
              placeholder="e.g. TCK-1001"
              className="w-full bg-navy-950 border border-navy-800 focus:border-gold-500/60 rounded-2xl pl-11 pr-4 rtl:pr-11 rtl:pl-4 py-3 text-xs text-slate-100 font-mono focus:outline-none shadow-inner"
              required
            />
          </div>
          <Button
            type="submit"
            size="md"
            className="bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold"
          >
            <span>{lang === 'ar' ? 'بحث' : 'Search'}</span>
          </Button>
        </form>

        <div className="flex items-center justify-center gap-3 pt-2">
          <span className="text-xs text-slate-400">
            {lang === 'ar' ? 'أو تود إنشاء استفسار جديد؟' : 'Need help with something else?'}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="text-xs border-gold-500/40 text-gold-300 hover:bg-gold-500/10"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'فتح بلاغ دعم جديد' : 'Open New Support Ticket'}</span>
          </Button>
        </div>
      </div>

      {/* Ticket Details Body */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-slate-400 animate-pulse font-sans">
          {lang === 'ar' ? 'جاري استرجاع تفاصيل التذكرة...' : 'Loading ticket records...'}
        </div>
      ) : matchedTicket ? (
        <div className="space-y-6">
          <Card className="p-6 md:p-8 space-y-6 border-gold-500/30 bg-navy-900/80">
            {/* Header Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-navy-800 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap font-sans">
                  <span className="font-mono text-sm font-extrabold text-gold-300 bg-gold-500/10 px-3 py-1 rounded-xl border border-gold-500/30">
                    {matchedTicket.ticketNumber}
                  </span>
                  <StatusBadge status={matchedTicket.status} />
                  <PriorityBadge priority={matchedTicket.priority} />
                  <ChannelBadge channel={matchedTicket.channel} />
                </div>
                <h3 className="text-xl font-extrabold text-white font-brand text-gold-200">
                  {matchedTicket.title}
                </h3>
                <div className="text-xs text-slate-400 mt-1 font-sans">
                  {lang === 'ar' ? 'تاريخ الإنشاء: ' : 'Submitted on '}
                  {new Date(matchedTicket.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="text-left sm:text-right rtl:text-right sm:rtl:text-left">
                <SLACountdownTimer
                  resolutionDueAt={matchedTicket.resolutionDueAt}
                  status={matchedTicket.status}
                />
              </div>
            </div>

            {/* Description */}
            <div className="p-4 rounded-2xl bg-navy-950 border border-navy-800 space-y-1">
              <span className="text-[10.5px] uppercase font-bold text-gold-400 font-brand">
                {lang === 'ar' ? 'تفاصيل البلاغ المسجلة:' : 'Ticket Inquiry Details:'}
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {matchedTicket.description}
              </p>

              {/* Portal Ticket Attachments */}
              {matchedTicket.attachments && matchedTicket.attachments.length > 0 && (
                <div className="pt-2 border-t border-navy-800">
                  <div className="text-[10.5px] font-bold text-gold-400 mb-1 flex items-center gap-1">
                    <Paperclip className="w-3 h-3 text-gold-400" />
                    <span>{lang === 'ar' ? 'المرفقات المسجلة:' : 'Attached Files:'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {matchedTicket.attachments.map((att: any) => (
                      <a
                        key={att.id}
                        href={att.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-navy-900 border border-gold-500/30 hover:border-gold-500 text-[11px] text-slate-200 hover:text-gold-300 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-gold-400" />
                        <span className="truncate max-w-[130px]">{att.originalName}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notes & Messages Stream */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-gold-300 uppercase tracking-wider flex items-center gap-2 font-brand">
                <MessageSquare className="w-4 h-4 text-gold-400" />
                <span>
                  {lang === 'ar' ? 'سجل المحادثات والمتابعة' : 'Resolution & Communication History'}
                </span>
              </h4>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {(matchedTicket.notes || [])
                  .filter((n: any) => !n.isInternal)
                  .map((note: any) => {
                    const isCustomer =
                      note.authorName === matchedTicket.customer?.name ||
                      note.authorName?.toLowerCase().includes('customer') ||
                      note.authorName?.includes('العميل');

                    return (
                      <div
                        key={note.id}
                        className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                          isCustomer
                            ? 'bg-navy-950 border-navy-800 text-slate-300 ml-4 rtl:ml-0 rtl:mr-4'
                            : 'bg-gradient-to-r from-gold-950/20 to-navy-900 border-gold-500/30 text-white mr-4 rtl:mr-0 rtl:ml-4'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5 font-semibold">
                            <User className="w-3 h-3 text-gold-400" />
                            <span className="font-brand text-gold-200">
                              {isCustomer
                                ? lang === 'ar'
                                  ? 'أنت (العميل)'
                                  : 'You (Customer)'
                                : `${note.authorName} (${lang === 'ar' ? 'فريق دعم عزم' : 'AZM Specialist'})`}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(note.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                          {note.content}
                        </p>

                        {/* Note Attachments */}
                        {note.attachments && note.attachments.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-navy-800">
                            {note.attachments.map((att: any) => (
                              <a
                                key={att.id}
                                href={att.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-navy-900 border border-gold-500/30 text-[10.5px] text-slate-200 hover:text-gold-300"
                              >
                                <Paperclip className="w-3 h-3 text-gold-400" />
                                <span className="truncate max-w-[120px]">{att.originalName}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}


                {(matchedTicket.notes || []).filter((n: any) => !n.isInternal).length === 0 && (
                  <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-navy-800 rounded-2xl font-sans">
                    {lang === 'ar'
                      ? 'لا توجد ردود بعد. يقوم أحد مسؤولي الدعم بمراجعة طلبك حالياً.'
                      : 'No public updates yet. A support specialist is actively handling your request.'}
                  </div>
                )}
              </div>
            </div>

            {/* Reply Input Box */}
            {matchedTicket.status !== 'CLOSED' && (
              <form
                onSubmit={handleSendCustomerReply}
                className="pt-4 border-t border-navy-800 space-y-3 font-sans"
              >
                <label className="block text-xs font-bold text-gold-300 font-brand">
                  {lang === 'ar'
                    ? 'إضافة رد أو تعقيب على التذكرة:'
                    : 'Add a reply or update to this ticket:'}
                </label>
                <textarea
                  rows={3}
                  value={customerReply}
                  onChange={(e) => setCustomerReply(e.target.value)}
                  placeholder={
                    lang === 'ar'
                      ? 'اكتب رسالتك أو أي تفاصيل إضافية هنا...'
                      : 'Provide additional information or reply to the support agent...'
                  }
                  className="w-full bg-navy-950 border border-navy-800 focus:border-gold-500/50 rounded-2xl p-3 text-xs text-slate-100 outline-none"
                  required
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    size="sm"
                    isLoading={isSubmittingReply}
                    className="bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'إرسال الرد' : 'Send Update'}</span>
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      ) : (
        <Card className="p-12 text-center space-y-3 border-navy-800 bg-navy-900/60 font-sans">
          <HelpCircle className="w-10 h-10 text-gold-400/60 mx-auto" />
          <h3 className="text-base font-bold text-white font-brand">
            {lang === 'ar' ? 'لم يتم العثور على التذكرة' : 'Ticket Not Found'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {lang === 'ar'
              ? 'يرجى التأكد من كتابة رمز التذكرة بشكل صحيح (مثال: TCK-1001).'
              : 'Please check your ticket reference ID (e.g. TCK-1001) and try again.'}
          </p>
        </Card>
      )}

      {/* New Inquiry Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title={lang === 'ar' ? 'فتح بلاغ دعم جديد' : 'Submit Support Inquiry'}
        maxWidth="lg"
      >
        {createdSuccessCode ? (
          <div className="py-8 text-center space-y-3 font-sans">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-white font-brand text-gold-300">
              {lang === 'ar' ? 'تم إنشاء التذكرة بنجاح!' : 'Ticket Submitted Successfully!'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'ar' ? 'رمز تذكرتك هو: ' : 'Your ticket reference code is: '}
              <span className="font-mono font-bold text-gold-300 text-sm">
                {createdSuccessCode}
              </span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleCreatePublicTicket} className="space-y-4 font-sans">
            <div>
              <label className="block text-xs font-bold text-gold-300 mb-1 font-brand">
                {lang === 'ar' ? 'عنوان المشكلة أو الطلب' : 'Inquiry Subject / Title'}
              </label>
              <Input
                placeholder={
                  lang === 'ar'
                    ? 'مثال: مشكلة في تسجيل الدخول'
                    : 'e.g. Issue connecting to API endpoint'
                }
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gold-300 mb-1 font-brand">
                {lang === 'ar' ? 'شرح مفصل للبلاغ' : 'Detailed Description'}
              </label>
              <textarea
                rows={4}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder={
                  lang === 'ar'
                    ? 'يرجى تقديم أكبر قدر ممكن من التفاصيل...'
                    : 'Please describe the steps to reproduce...'
                }
                className="w-full bg-navy-950 border border-navy-800 focus:border-gold-500/50 rounded-2xl p-3 text-xs text-slate-100 outline-none"
                required
              />
            </div>

            {/* File Upload Zone */}
            <FileUploadZone
              attachments={portalAttachments}
              onAttachmentsChange={setPortalAttachments}
              maxFiles={3}
            />

            <div className="flex justify-end gap-2 pt-2">

              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                size="sm"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                size="sm"
                isLoading={isSubmittingTicket}
                className="bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold"
              >
                {lang === 'ar' ? 'إرسال التذكرة' : 'Submit Ticket'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
