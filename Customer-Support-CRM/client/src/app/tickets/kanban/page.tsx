'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { Kanban, Search, Plus, Filter, Sparkles, Layers } from 'lucide-react';
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
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Kanban className="w-6 h-6 text-indigo-400" />
            <span>{t('navKanban')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'ar'
              ? 'إدارة التذاكر عبر لوحة كانبان التفاعلية مع السحب والإفلات وتتبع الـ SLA الحقيقي.'
              : 'Interactive drag-and-drop workflow across status columns with real-time SLA breach counters.'}
          </p>
        </div>

        <Button onClick={() => setIsCreateOpen(true)} className="text-xs">
          <Plus className="w-4 h-4" />
          <span>{lang === 'ar' ? 'تذكرة جديدة' : 'New Ticket'}</span>
        </Button>
      </div>

      {/* Filters Bar */}
      <Card className="p-4 space-y-3">
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
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2 text-xs text-slate-100 outline-none focus:border-indigo-500"
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
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
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
          Loading Omnichannel Board...
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
        title={lang === 'ar' ? 'إنشاء تذكرة جديدة' : 'Create New Ticket'}
        maxWidth="lg"
      >
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <Input
            label="Ticket Subject"
            placeholder="e.g. Production API Gateway Webhook Failure"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Select Customer
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2 text-xs text-slate-100 outline-none"
              required
            >
              <option value="">-- Choose Customer Profile --</option>
              {(customersData?.data || []).map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.company || c.email}) - [{c.tier}]
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
              >
                <option value="URGENT">Urgent (1h Response SLA)</option>
                <option value="HIGH">High (2h Response SLA)</option>
                <option value="MEDIUM">Medium (4h Response SLA)</option>
                <option value="LOW">Low (8h Response SLA)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Ingestion Channel
              </label>
              <select
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
              >
                <option value="WHATSAPP">WhatsApp Support</option>
                <option value="EMAIL">Email Support</option>
                <option value="LIVE_CHAT">Live Chat</option>
                <option value="SMS">SMS Gateway</option>
                <option value="WEB_FORM">Web Portal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Issue Description
            </label>
            <textarea
              rows={3}
              className="w-full bg-slate-900/80 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none"
              placeholder="Detailed explanation of the issue..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
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
            <Button type="submit" isLoading={isSubmitting} size="sm">
              Submit Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
