'use client';

import React from 'react';
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

  const { data, isLoading } = useQuery({
    queryKey: ['customer-360', customerId],
    queryFn: () => api.getCustomerById(customerId!),
    enabled: !!customerId
  });

  if (!customerId) return null;

  const customer = data?.data;

  return (
    <div className="fixed inset-0 z-[99999] overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="absolute inset-y-0 right-0 rtl:left-0 rtl:right-auto max-w-full flex pl-10 rtl:pl-0 rtl:pr-10">
        <div className="w-screen max-w-xl glass-panel bg-slate-950/95 border-l rtl:border-r rtl:border-l-0 border-slate-800 p-6 md:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto animate-in slide-in-from-right rtl:slide-in-from-left duration-200">
          {isLoading ? (
            <div className="py-24 text-center text-xs text-slate-400 animate-pulse">
              Loading Customer 360 Profile...
            </div>
          ) : customer ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      customer.avatarUrl ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                    }
                    alt={customer.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-500/30 shadow-lg"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white">
                        {lang === 'ar' ? customer.nameAr || customer.name : customer.name}
                      </h2>
                      <TierBadge tier={customer.tier} />
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>{customer.company || 'Independent Client'}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contact Information Card */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Email</span>
                  <div className="flex items-center gap-1.5 text-slate-200 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-purple-400" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Phone</span>
                  <div className="flex items-center gap-1.5 text-slate-200 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{customer.phone || 'N/A'}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">
                    Customer Since
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-300 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{new Date(customer.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">
                    Language Preference
                  </span>
                  <div className="text-slate-200 font-semibold mt-0.5">
                    {lang === 'ar' ? 'العربية (Arabic)' : 'English (الإنجليزية)'}
                  </div>
                </div>
              </div>

              {/* 360 KPI Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                  <div className="text-xl font-extrabold text-white">
                    {customer.tickets?.length || 0}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">
                    Total Tickets
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                  <div className="text-xl font-extrabold text-amber-400">
                    {customer.tickets?.filter(
                      (t: any) => t.status !== 'RESOLVED' && t.status !== 'CLOSED'
                    ).length || 0}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">
                    Active Queue
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
                  <div className="text-xl font-extrabold text-purple-400 flex items-center justify-center gap-1">
                    <span>5.0</span>
                    <Star className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">
                    CSAT Score
                  </div>
                </div>
              </div>

              {/* Omnichannel Interaction Touchpoints Timeline */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span>Touchpoint Timeline ({customer.tickets?.length || 0})</span>
                  </h3>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {(customer.tickets || []).map((ticket: any) => (
                    <div
                      key={ticket.id}
                      className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-indigo-400 font-mono">
                          {ticket.ticketNumber}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <ChannelBadge channel={ticket.channel} />
                          <StatusBadge status={ticket.status} />
                        </div>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-100">{ticket.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        {ticket.description}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                        <SLABadge slaStatus={ticket.slaStatus || 'ON_TRACK'} />
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                  {(customer.tickets || []).length === 0 && (
                    <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                      No support tickets created yet for this customer.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-xs text-rose-400">Customer not found</div>
          )}

          {/* Drawer Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <Button variant="outline" onClick={onClose} size="sm">
              Close
            </Button>
            {customer && (
              <Button onClick={() => onNewTicket?.(customer)} size="sm">
                <Ticket className="w-3.5 h-3.5" />
                <span>Create New Ticket</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
