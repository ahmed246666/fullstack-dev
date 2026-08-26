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
  Layers
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import {
  TierBadge,
  StatusBadge,
  PriorityBadge,
  ChannelBadge,
  SLABadge
} from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface CustomerDrawerProps {
  customerId: string | null;
  onClose: () => void;
  onNewTicket?: (customer: any) => void;
}

export function CustomerDrawer({ customerId, onClose, onNewTicket }: CustomerDrawerProps) {
  const { lang, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['customer-360', customerId],
    queryFn: () => api.getCustomerById(customerId!),
    enabled: !!customerId
  });

  if (!customerId || !mounted) return null;

  const customer = data?.data;

  return createPortal(
    <div className="fixed inset-0 z-[999999] overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="absolute inset-y-0 right-0 rtl:left-0 rtl:right-auto max-w-full flex pl-10 rtl:pl-0 rtl:pr-10 z-[999999]">
        <div className="w-screen max-w-xl glass-panel bg-navy-950/95 border-l rtl:border-r rtl:border-l-0 border-gold-500/30 p-6 md:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto animate-in slide-in-from-right rtl:slide-in-from-left duration-200 font-sans">
          {isLoading ? (
            <div className="py-24 text-center text-xs text-slate-400 animate-pulse">
              Loading Customer 360 Profile...
            </div>
          ) : customer ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-navy-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-gold-600 via-gold-500 to-gold-400 text-navy-950 flex items-center justify-center font-extrabold text-xl shadow-lg shadow-gold-500/20 font-brand">
                    {(customer.name || 'C')[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white font-brand text-gold-300">
                        {lang === 'ar' ? customer.nameAr || customer.name : customer.name}
                      </h2>
                      <TierBadge tier={customer.tier} />
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-gold-400" />
                      <span>{customer.company || 'Enterprise Account'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-navy-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contact Details Card */}
              <div className="p-4 rounded-2xl bg-navy-900/90 border border-navy-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2 text-slate-400">
                    <Mail className="w-3.5 h-3.5 text-gold-400" />
                    <span>Email Address:</span>
                  </span>
                  <span className="font-semibold text-slate-100 font-mono">{customer.email}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2 text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-gold-400" />
                    <span>Direct Phone:</span>
                  </span>
                  <span className="font-semibold text-slate-100 font-mono">
                    {customer.phone || '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-gold-400" />
                    <span>Customer Since:</span>
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
                    Total Tickets
                  </div>
                  <div className="text-xl font-extrabold text-white mt-1 font-brand">
                    {customer.tickets?.length || 0}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-navy-900/80 border border-navy-800 text-center">
                  <div className="text-[10.5px] uppercase font-bold text-amber-400">
                    Active Open
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
                <h3 className="text-xs font-bold text-gold-300 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-brand">
                  <Layers className="w-3.5 h-3.5 text-gold-400" />
                  <span>Interaction Touchpoint Timeline ({customer.tickets?.length || 0})</span>
                </h3>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {(customer.tickets || []).map((ticket: any) => (
                    <div
                      key={ticket.id}
                      className="p-3.5 rounded-2xl bg-navy-900/70 border border-navy-800 hover:border-gold-500/30 transition-colors text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-gold-300">
                          {ticket.ticketNumber}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <ChannelBadge channel={ticket.channel} />
                          <StatusBadge status={ticket.status} />
                        </div>
                      </div>

                      <div className="font-semibold text-slate-100">{ticket.title}</div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-navy-800/80">
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        <SLABadge slaStatus={ticket.slaStatus} />
                      </div>
                    </div>
                  ))}

                  {(customer.tickets || []).length === 0 && (
                    <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-navy-800 rounded-2xl">
                      No tickets recorded yet for this customer.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-xs text-rose-400">Customer not found</div>
          )}

          {/* Drawer Footer Actions */}
          <div className="pt-4 border-t border-navy-800 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={onClose}
              size="sm"
              className="border-navy-700 hover:border-gold-500/40"
            >
              Close
            </Button>
            {customer && (
              <Button
                onClick={() => onNewTicket?.(customer)}
                size="sm"
                className="bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Create New Ticket</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
