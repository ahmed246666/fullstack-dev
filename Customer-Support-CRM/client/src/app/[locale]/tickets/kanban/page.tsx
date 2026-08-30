'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { Kanban, Search, Plus } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAgent } from '@/context/AgentContext';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { KanbanBoard } from '@/components/tickets/KanbanBoard';
import { TicketDrawer } from '@/components/tickets/TicketDrawer';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';

export default function KanbanPage() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') || '';
  const { lang, t } = useLanguage();
  const { currentAgent } = useAgent();
  const [search, setSearch] = useState(urlSearch);

  useEffect(() => {
    if (urlSearch) setSearch(urlSearch);
  }, [urlSearch]);

  const [channel, setChannel] = useState('ALL');
  const [priority, setPriority] = useState('ALL');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // New Ticket Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState('HIGH');
  const [newChannel, setNewChannel] = useState('WHATSAPP');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: ticketsData,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['tickets-kanban', search, channel, priority],
    queryFn: () => api.getTickets({ search, channel, priority, limit: 100 })
  });

  const { data: customersData } = useQuery({
    queryKey: ['customers-for-ticket'],
    queryFn: () => api.getCustomers({ limit: 50 })
  });

  const tickets = ticketsData?.data || [];

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim() || !selectedCustomerId) return;

    try {
      setIsSubmitting(true);
      await api.createTicket({
        title: newTitle.trim(),
        description: newDesc.trim(),
        customerId: selectedCustomerId,
        priority: newPriority,
        channel: newChannel,
        department: currentAgent.department
      });
      setIsCreateOpen(false);
      setNewTitle('');
      setNewDesc('');
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to create ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2 font-brand">
            <Kanban className="w-6 h-6 text-gold-400" />
            <span>{t('navKanban')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'ar'
              ? 'إدارة التذاكر عبر لوحة كانبان التفاعلية مع السحب والإفلات وتتبع الـ SLA الحقيقي.'
              : 'Interactive drag-and-drop workflow across status columns with real-time SLA breach counters.'}
          </p>
        </div>

        <Button onClick={() => setIsCreateOpen(true)} className="text-xs bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold hover:opacity-95 shadow-lg shadow-gold-500/20">
          <Plus className="w-4 h-4" />
          <span>{t('newTicketBtn')}</span>
        </Button>
      </div>

      {/* Filters Bar */}
      <Card className="p-4 space-y-3 border-gold-500/20 bg-navy-900/80">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 rtl:right-3.5 rtl:left-auto top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={
                lang === 'ar'
                  ? 'ابحث برقم التذكرة أو العنوان أو اسم العميل...'
                  : 'Search by ticket #, subject, customer...'
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-navy-950 border border-navy-800 rounded-xl pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2 text-xs text-slate-100 outline-none focus:border-gold-500"
            />
          </div>

          {/* Channel Filters */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            {['ALL', 'WHATSAPP', 'EMAIL', 'LIVE_CHAT', 'SMS', 'WEB_FORM'].map((chan) => (
              <button
                key={chan}
                onClick={() => setChannel(chan)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap ${
                  channel === chan
                    ? 'bg-gold-500 text-navy-950 border-gold-400 font-bold shadow-md shadow-gold-500/20'
                    : 'bg-navy-950 text-slate-300 border-navy-800 hover:text-white'
                }`}
              >
                {chan === 'ALL' ? (lang === 'ar' ? 'جميع القنوات' : 'All Channels') : chan}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Kanban Board Container */}
      {isLoading ? (
        <div className="py-24 text-center text-xs text-slate-400 animate-pulse">
          {lang === 'ar' ? 'جاري تحميل لوحة كانبان...' : 'Loading Omnichannel Board...'}
        </div>
      ) : (
        <KanbanBoard
          tickets={tickets}
          onSelectTicket={(id) => setSelectedTicketId(id)}
          onUpdated={() => refetch()}
        />
      )}

      {/* Ticket Drawer */}
      <TicketDrawer
        ticketId={selectedTicketId}
        onClose={() => setSelectedTicketId(null)}
        onUpdated={() => refetch()}
      />

      {/* New Ticket Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title={t('newTicketBtn')}
        maxWidth="lg"
      >
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <Input
            label={lang === 'ar' ? 'عنوان وموضوع التذكرة' : 'Ticket Subject'}
            placeholder={lang === 'ar' ? 'مثال: تعذر ربط بوابة الدفع الإلكتروني...' : 'e.g. Production API Gateway Webhook Failure'}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {lang === 'ar' ? 'اختيار العميل' : 'Select Customer'}
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full bg-navy-950 border border-navy-800 focus:border-gold-500 rounded-xl px-4 py-2 text-xs text-slate-100 outline-none"
              required
            >
              <option value="">{lang === 'ar' ? '-- اختر ملف العميل --' : '-- Choose Customer Profile --'}</option>
              {(customersData?.data || []).map((c: any) => (
                <option key={c.id} value={c.id}>
                  {lang === 'ar' && c.nameAr ? c.nameAr : c.name} ({c.company || c.email}) - [{c.tier}]
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {lang === 'ar' ? 'مستوى الأولوية' : 'Priority'}
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
              >
                <option value="URGENT">{lang === 'ar' ? 'عاجل جداً (ساعة واحدة)' : 'Urgent (1h SLA)'}</option>
                <option value="HIGH">{lang === 'ar' ? 'عالية (ساعتان)' : 'High (2h SLA)'}</option>
                <option value="MEDIUM">{lang === 'ar' ? 'متوسطة (4 ساعات)' : 'Medium (4h SLA)'}</option>
                <option value="LOW">{lang === 'ar' ? 'منخفضة (8 ساعات)' : 'Low (8h SLA)'}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {lang === 'ar' ? 'قناة التواصل' : 'Ingestion Channel'}
              </label>
              <select
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value)}
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
              >
                <option value="WHATSAPP">{t('channel_WHATSAPP')}</option>
                <option value="EMAIL">{t('channel_EMAIL')}</option>
                <option value="LIVE_CHAT">{t('channel_LIVE_CHAT')}</option>
                <option value="SMS">{t('channel_SMS')}</option>
                <option value="WEB_FORM">{t('channel_WEB_FORM')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {lang === 'ar' ? 'تفاصيل المشكلة' : 'Issue Description'}
            </label>
            <textarea
              rows={3}
              className="w-full bg-navy-950 border border-navy-800 focus:border-gold-500 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none"
              placeholder={lang === 'ar' ? 'شرح مفصل للمشكلة والطلب...' : 'Detailed explanation of the issue...'}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-navy-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateOpen(false)}
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
    </div>
  );
}
