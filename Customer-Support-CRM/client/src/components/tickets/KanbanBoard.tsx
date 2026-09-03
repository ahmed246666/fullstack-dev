'use client';

import React, { useState } from 'react';
import { Kanban, Clock, User, Sparkles, MoveRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAgent } from '@/context/AgentContext';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { PriorityBadge, ChannelBadge, SLABadge } from '@/components/ui/Badge';
import { toast } from '@/components/ui/Toast';

interface KanbanBoardProps {
  tickets: any[];
  onSelectTicket: (ticketId: string) => void;
  onUpdated: () => void;
}

export function KanbanBoard({ tickets, onSelectTicket, onUpdated }: KanbanBoardProps) {
  const { lang, t } = useLanguage();
  const { currentAgent } = useAgent();
  const [draggedTicketId, setDraggedTicketId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const columns = [
    {
      key: 'NEW',
      titleKey: 'status_NEW',
      border: 'border-blue-500/30',
      bg: 'bg-blue-950/10',
      countBg: 'bg-blue-500/20 text-blue-300'
    },
    {
      key: 'OPEN',
      titleKey: 'status_OPEN',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-950/10',
      countBg: 'bg-emerald-500/20 text-emerald-300'
    },
    {
      key: 'PENDING',
      titleKey: 'status_PENDING',
      border: 'border-amber-500/30',
      bg: 'bg-amber-950/10',
      countBg: 'bg-amber-500/20 text-amber-300'
    },
    {
      key: 'RESOLVED',
      titleKey: 'status_RESOLVED',
      border: 'border-purple-500/30',
      bg: 'bg-purple-950/10',
      countBg: 'bg-purple-500/20 text-purple-300'
    }
  ];

  const handleDragStart = (e: React.DragEvent, ticketId: string) => {
    e.dataTransfer.setData('text/plain', ticketId);
    setDraggedTicketId(ticketId);
  };

  const handleDragOver = (e: React.DragEvent, colKey: string) => {
    e.preventDefault();
    if (dragOverColumn !== colKey) {
      setDragOverColumn(colKey);
    }
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData('text/plain') || draggedTicketId;
    setDragOverColumn(null);
    setDraggedTicketId(null);

    if (!ticketId) return;

    try {
      await api.updateTicketStatus(ticketId, targetStatus, currentAgent.name);
      onUpdated();
      toast.success(
        lang === 'ar' ? 'تم نقل التذكرة وتحديث مسار العمل' : 'Ticket workflow updated',
        lang === 'ar' ? 'لوحة كانبان' : 'Kanban Board'
      );
    } catch (err: any) {
      toast.error(
        err.message || (lang === 'ar' ? 'فشل تحديث حالة التذكرة' : 'Failed to update ticket status'),
        lang === 'ar' ? 'خطأ' : 'Error'
      );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
      {columns.map((col) => {
        const colTickets = tickets.filter((ticket: any) => ticket.status === col.key);
        const isOver = dragOverColumn === col.key;

        return (
          <div
            key={col.key}
            onDragOver={(e) => handleDragOver(e, col.key)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.key)}
            className={`glass-panel rounded-2xl p-4 border transition-all duration-200 ${col.border} ${col.bg} ${
              isOver ? 'ring-2 ring-indigo-500 scale-[1.01] bg-slate-900/90' : ''
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
              <h3 className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
                <span>{t(col.titleKey)}</span>
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${col.countBg}`}>
                {colTickets.length}
              </span>
            </div>

            {/* Column Dropzone / Cards */}
            <div className="space-y-3 min-h-[350px]">
              {colTickets.map((ticket: any) => (
                <Card
                  key={ticket.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, ticket.id)}
                  onClick={() => onSelectTicket(ticket.id)}
                  className="p-3.5 glass-panel-hover border-slate-800/80 cursor-grab active:cursor-grabbing hover:border-indigo-500/50 shadow-md group transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[11px] font-bold text-indigo-400 group-hover:underline whitespace-nowrap shrink-0">
                      {ticket.ticketNumber}
                    </span>
                    <PriorityBadge priority={ticket.priority} />
                  </div>

                  <h4 className="text-xs font-semibold text-slate-100 line-clamp-2 mb-2 leading-relaxed">
                    {ticket.title}
                  </h4>

                  <div className="text-[11px] text-slate-400 mb-2.5 flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-500" />
                    <span className="truncate">
                      {lang === 'ar'
                        ? ticket.customer?.nameAr || ticket.customer?.name
                        : ticket.customer?.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-1.5 flex-wrap pt-2 border-t border-navy-800 text-[10px]">
                    <ChannelBadge channel={ticket.channel} />
                    <SLABadge slaStatus={ticket.slaStatus} />
                  </div>
                </Card>
              ))}

              {colTickets.length === 0 && (
                <div
                  className={`py-12 text-center text-xs text-slate-500 border border-dashed rounded-2xl transition-colors ${
                    isOver ? 'border-gold-500 text-gold-300 bg-gold-500/10' : 'border-slate-800/60'
                  }`}
                >
                  {isOver
                    ? lang === 'ar'
                      ? 'أفلت التذكرة هنا لتحديث حالتها'
                      : 'Drop ticket here to update status'
                    : lang === 'ar'
                      ? 'لا توجد تذاكر في هذه المرحلة'
                      : 'No tickets in this stage'}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
