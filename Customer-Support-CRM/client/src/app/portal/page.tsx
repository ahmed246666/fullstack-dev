'use client';

import React, { useState } from 'react';
import { ExternalLink, Search, Plus, CheckCircle, ShieldCheck, Ticket } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge, PriorityBadge, ChannelBadge, SLABadge } from '@/components/ui/Badge';

export default function PublicPortalPage() {
  const { lang, t } = useLanguage();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackedTicket, setTrackedTicket] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleTrackTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;
    try {
      setIsSearching(true);
      setSearchError('');
      const res = await api.getTicketById(trackingNumber.trim());
      setTrackedTicket(res.data);
    } catch (err: any) {
      setSearchError('Ticket not found. Please verify your tracking code (e.g. TCK-1001).');
      setTrackedTicket(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>AZM Squad Customer Self-Service Portal</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Track Your Support Request</h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Enter your unique ticket reference code below to check live resolution status and SLA
          deadlines.
        </p>
      </div>

      {/* Lookup Bar */}
      <Card className="p-6">
        <form onSubmit={handleTrackTicket} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 rtl:right-3.5 rtl:left-auto top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. TCK-1001"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 font-mono uppercase"
              required
            />
          </div>
          <Button type="submit" isLoading={isSearching}>
            Track Status
          </Button>
        </form>
        {searchError && <p className="text-xs text-rose-400 font-medium mt-2.5">{searchError}</p>}
      </Card>

      {/* Tracked Ticket View */}
      {trackedTicket && (
        <Card className="p-6 space-y-6 border-indigo-500/40 bg-slate-900/90 animate-in fade-in zoom-in-95">
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-sm font-bold text-indigo-400">
                  {trackedTicket.ticketNumber}
                </span>
                <StatusBadge status={trackedTicket.status} />
                <PriorityBadge priority={trackedTicket.priority} />
              </div>
              <h2 className="text-xl font-bold text-white">{trackedTicket.title}</h2>
              <p className="text-xs text-slate-400 mt-1">
                Submitted by: {trackedTicket.customer?.name} ({trackedTicket.customer?.company})
              </p>
            </div>
            <SLABadge slaStatus={trackedTicket.slaStatus} />
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
            <div className="font-bold text-indigo-400 mb-1">Issue Details:</div>
            <p className="leading-relaxed">{trackedTicket.description}</p>
          </div>

          {/* Conversation History */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Public Updates
            </h3>
            <div className="space-y-3">
              {(trackedTicket.notes || [])
                .filter((n: any) => !n.isInternal)
                .map((note: any) => (
                  <div
                    key={note.id}
                    className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="font-bold text-indigo-300">{note.authorName}</span>
                      <span>{new Date(note.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-200">{note.content}</p>
                  </div>
                ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
