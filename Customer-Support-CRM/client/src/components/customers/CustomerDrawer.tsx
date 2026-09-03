'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useQuery } from '@tanstack/react-query';
import {
  X,
  Building2,
  Mail,
  Phone,
  Calendar,
  Ticket,
  Clock,
  CheckCircle2,
  Star,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Layers,
  Plus
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
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { toast } from '@/components/ui/Toast';

interface CustomerDrawerProps {
  customerId: string | null;
  onClose: () => void;
  onNewTicket?: (customer: any) => void;
}

export function CustomerDrawer({ customerId, onClose, onNewTicket }: CustomerDrawerProps) {
  const { lang, t } = useLanguage();
  const { currentAgent } = useAgent();
  const [mounted, setMounted] = useState(false);

  // Embedded Create Ticket State
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketPriority, setTicketPriority] = useState('HIGH');
  const [ticketChannel, setTicketChannel] = useState('WHATSAPP');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['customer-360', customerId],
    queryFn: () => api.getCustomerById(customerId!),
    enabled: !!customerId
  });

  if (!customerId || !mounted) return null;

  const customer = data?.data;

  const handleCreateTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim() || !ticketDesc.trim() || !customer) return;

    try {
      setIsSubmitting(true);
      await api.createTicket({
        title: ticketTitle.trim(),
        description: ticketDesc.trim(),
        customerId: customer.id,
        priority: ticketPriority,
        channel: ticketChannel,
        department: currentAgent.department
      });
      setIsCreateTicketOpen(false);
      setTicketTitle('');
      setTicketDesc('');
      refetch();
      toast.success(
        lang === 'ar' ? 'تم إنشاء التذكرة وإضافتها لسجل العميل' : 'Ticket created and linked to profile',
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

  const priorityOptions = [
    { value: 'URGENT', label: lang === 'ar' ? 'عاجل جداً (ساعة واحدة)' : 'Urgent (1h SLA)' },
    { value: 'HIGH', label: lang === 'ar' ? 'عالية (ساعتان)' : 'High (2h SLA)' },
    { value: 'MEDIUM', label: lang === 'ar' ? 'متوسطة (4 ساعات)' : 'Medium (4h SLA)' },
    { value: 'LOW', label: lang === 'ar' ? 'منخفضة (8 ساعات)' : 'Low (8h SLA)' }
  ];

  const channelOptions = [
    { value: 'WHATSAPP', label: t('channel_WHATSAPP') },
    { value: 'EMAIL', label: t('channel_EMAIL') },
    { value: 'LIVE_CHAT', label: t('channel_LIVE_CHAT') },
    { value: 'SMS', label: t('channel_SMS') },
    { value: 'WEB_FORM', label: t('channel_WEB_FORM') }
  ];

  return createPortal(
    <div className="fixed inset-0 z-[999999] overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="fixed inset-y-0 right-0 rtl:left-0 rtl:right-auto w-full max-w-full sm:max-w-xl md:max-w-2xl flex z-[999999]">
        <div className="w-full h-full glass-panel bg-navy-950/95 border-l rtl:border-r rtl:border-l-0 border-gold-500/30 p-4 sm:p-6 md:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto animate-in slide-in-from-right rtl:slide-in-from-left duration-200 font-sans">
          {isLoading ? (
            <div className="py-24 text-center text-xs text-slate-400 animate-pulse">
              Loading Customer 360 Profile...
            </div>
          ) : customer ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-navy-800 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-gold-600 via-gold-500 to-gold-400 text-navy-950 flex items-center justify-center font-extrabold text-xl shadow-lg shadow-gold-500/20 font-brand shrink-0">
                    {(customer.name || 'C')[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl font-bold text-white font-brand text-gold-300 truncate">
                        {lang === 'ar' ? customer.nameAr || customer.name : customer.name}
                      </h2>
                      <TierBadge tier={customer.tier} />
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5 truncate">
                      <Building2 className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                      <span className="truncate">{customer.company || 'Enterprise Account'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-navy-900 transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contact Details Card */}
              <div className="p-4 rounded-2xl bg-navy-900/90 border border-navy-800 space-y-2.5 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-300 gap-1">
                  <span className="flex items-center gap-2 text-slate-400 shrink-0">
                    <Mail className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                    <span>{lang === 'ar' ? 'البريد الإلكتروني:' : 'Email Address:'}</span>
                  </span>
                  <span className="font-semibold text-slate-100 font-mono break-all sm:truncate max-w-full sm:max-w-[280px]">
                    {customer.email}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-300 gap-1">
                  <span className="flex items-center gap-2 text-slate-400 shrink-0">
                    <Phone className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                    <span>{lang === 'ar' ? 'رقم الهاتف:' : 'Direct Phone:'}</span>
                  </span>
                  <span className="font-semibold text-slate-100 font-mono">
                    {customer.phone || '—'}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-300 gap-1">
                  <span className="flex items-center gap-2 text-slate-400 shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                    <span>{lang === 'ar' ? 'تاريخ الانضمام:' : 'Customer Since:'}</span>
                  </span>
                  <span className="font-semibold text-slate-100">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Lifetime Stats & Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-navy-900/80 border border-navy-800 text-center">
                  <div className="text-[10.5px] uppercase font-bold text-slate-400">
                    {lang === 'ar' ? 'إجمالي التذاكر' : 'Total Tickets'}
                  </div>
                  <div className="text-xl font-extrabold text-white mt-1 font-brand">
                    {customer.tickets?.length || 0}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-navy-900/80 border border-navy-800 text-center">
                  <div className="text-[10.5px] uppercase font-bold text-amber-400">
                    {lang === 'ar' ? 'تذاكر نشطة' : 'Active Open'}
                  </div>
                  <div className="text-xl font-extrabold text-amber-300 mt-1 font-brand">
                    {
                      (customer.tickets || []).filter(
                        (t: any) => t.status !== 'RESOLVED' && t.status !== 'CLOSED'
                      ).length
                    }
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-navy-900/80 border border-navy-800 text-center">
                  <div className="text-[10.5px] uppercase font-bold text-gold-300">CSAT Score</div>
                  <div className="text-xl font-extrabold text-gold-300 mt-1 font-brand">
                    4.9 <span className="text-xs text-slate-400 font-normal">/ 5</span>
                  </div>
                </div>
              </div>

              {/* Touchpoint Interaction Timeline */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-gold-300 uppercase tracking-wider flex items-center gap-1.5 font-brand">
                    <Layers className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                    <span>
                      {lang === 'ar'
                        ? `سجل ونقاط التفاعل (${customer.tickets?.length || 0})`
                        : `Interaction Touchpoint Timeline (${customer.tickets?.length || 0})`}
                    </span>
                  </h3>
                  <button
                    onClick={() => {
                      if (onNewTicket) {
                        onNewTicket(customer);
                      } else {
                        setIsCreateTicketOpen(true);
                      }
                    }}
                    className="text-[11px] font-bold text-gold-400 hover:text-gold-300 flex items-center gap-1 font-brand"
                  >
                    <Plus className="w-3.5 h-3.5 shrink-0" />
                    <span>{lang === 'ar' ? 'تذكرة جديدة' : 'New Ticket'}</span>
                  </button>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {(customer.tickets || []).map((ticket: any) => (
                    <div
                      key={ticket.id}
                      className="p-3.5 rounded-2xl bg-navy-900/70 border border-navy-800 hover:border-gold-500/30 transition-colors text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-mono font-bold text-gold-300">
                          {ticket.ticketNumber}
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <ChannelBadge channel={ticket.channel} />
                          <StatusBadge status={ticket.status} />
                        </div>
                      </div>

                      <div className="font-semibold text-slate-100 break-words">{ticket.title}</div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-navy-800/80 gap-2 flex-wrap">
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        <SLABadge
                          slaStatus={ticket.slaStatus}
                          resolutionDueAt={ticket.resolutionDueAt}
                          status={ticket.status}
                        />
                      </div>
                    </div>
                  ))}

                  {(customer.tickets || []).length === 0 && (
                    <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-navy-800 rounded-2xl">
                      {lang === 'ar'
                        ? 'لا توجد تذاكر مسجلة لهذا العميل حتى الآن.'
                        : 'No tickets recorded yet for this customer.'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-xs text-rose-400">Customer not found</div>
          )}

          {/* Drawer Footer Actions */}
          <div className="pt-4 border-t border-navy-800 flex items-center justify-between gap-3 flex-wrap">
            <Button
              variant="outline"
              onClick={onClose}
              size="sm"
              className="border-navy-700 hover:border-gold-500/40"
            >
              {lang === 'ar' ? 'إغلاق' : 'Close'}
            </Button>
            {customer && (
              <Button
                onClick={() => {
                  if (onNewTicket) {
                    onNewTicket(customer);
                  } else {
                    setIsCreateTicketOpen(true);
                  }
                }}
                size="sm"
                className="bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold"
              >
                <Ticket className="w-3.5 h-3.5 shrink-0" />
                <span>{lang === 'ar' ? 'إنشاء تذكرة جديدة' : 'Create New Ticket'}</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Create Ticket Modal for Customer */}
      {customer && (
        <Modal
          isOpen={isCreateTicketOpen}
          onClose={() => setIsCreateTicketOpen(false)}
          title={
            lang === 'ar'
              ? `إنشاء تذكرة دعم للعميل: ${customer.nameAr || customer.name}`
              : `Create Ticket for ${customer.name}`
          }
          maxWidth="lg"
        >
          <form onSubmit={handleCreateTicketSubmit} className="space-y-4 font-sans">
            <Input
              label={lang === 'ar' ? 'عنوان وموضوع التذكرة' : 'Ticket Subject'}
              placeholder={lang === 'ar' ? 'ملخص موجز للمشكلة أو الاستفسار...' : 'Brief summary of the issue...'}
              value={ticketTitle}
              onChange={(e) => setTicketTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label={lang === 'ar' ? 'مستوى الأولوية' : 'Priority'}
                value={ticketPriority}
                onChange={(val) => setTicketPriority(val)}
                options={priorityOptions}
              />

              <Select
                label={lang === 'ar' ? 'قناة التواصل' : 'Channel'}
                value={ticketChannel}
                onChange={(val) => setTicketChannel(val)}
                options={channelOptions}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {lang === 'ar' ? 'تفاصيل المشكلة والطلب' : 'Issue Description'}
              </label>
              <textarea
                rows={3}
                className="w-full bg-navy-950 border border-navy-800 focus:border-gold-500 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none font-sans"
                placeholder={lang === 'ar' ? 'شرح مفصل للمشكلة والطلب...' : 'Detailed explanation of the issue...'}
                value={ticketDesc}
                onChange={(e) => setTicketDesc(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-navy-800 flex-wrap">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateTicketOpen(false)}
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
      )}
    </div>,
    document.body
  );
}
