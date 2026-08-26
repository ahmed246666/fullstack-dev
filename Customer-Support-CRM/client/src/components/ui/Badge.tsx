import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MessageSquare, Mail, Phone, Globe, Smartphone, Clock, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function StatusBadge({ status }: { status: string }) {
  const { t } = useLanguage();
  const s = status.toUpperCase();

  const styles: Record<string, string> = {
    NEW: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    OPEN: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    PENDING: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    RESOLVED: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    CLOSED: 'bg-slate-500/10 text-slate-400 border-slate-500/30'
  };

  return (
    <span className={twMerge('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border', styles[s] || styles.NEW)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 rtl:ml-1.5 rtl:mr-0 animate-pulse" />
      {t(`status_${s}`)}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  const { t } = useLanguage();
  const p = priority.toUpperCase();

  const styles: Record<string, string> = {
    URGENT: 'bg-rose-500/15 text-rose-400 border-rose-500/30 font-bold',
    HIGH: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    MEDIUM: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    LOW: 'bg-slate-500/15 text-slate-400 border-slate-500/30'
  };

  return (
    <span className={twMerge('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border', styles[p] || styles.MEDIUM)}>
      {p === 'URGENT' && <ShieldAlert className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0 text-rose-400" />}
      {t(`priority_${p}`)}
    </span>
  );
}

export function ChannelBadge({ channel }: { channel: string }) {
  const { t } = useLanguage();
  const c = channel.toUpperCase();

  const configs: Record<string, { icon: any; style: string }> = {
    WHATSAPP: { icon: MessageSquare, style: 'bg-emerald-950/40 text-emerald-400 border-emerald-700/40' },
    EMAIL: { icon: Mail, style: 'bg-blue-950/40 text-blue-400 border-blue-700/40' },
    LIVE_CHAT: { icon: Phone, style: 'bg-cyan-950/40 text-cyan-400 border-cyan-700/40' },
    SMS: { icon: Smartphone, style: 'bg-purple-950/40 text-purple-400 border-purple-700/40' },
    WEB_FORM: { icon: Globe, style: 'bg-amber-950/40 text-amber-400 border-amber-700/40' }
  };

  const current = configs[c] || configs.WEB_FORM;
  const Icon = current.icon;

  return (
    <span className={twMerge('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border', current.style)}>
      <Icon className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" />
      {t(`channel_${c}`)}
    </span>
  );
}

export function SLABadge({ slaStatus }: { slaStatus: string }) {
  const { t } = useLanguage();

  const configs: Record<string, { icon: any; style: string }> = {
    ON_TRACK: { icon: CheckCircle, style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    APPROACHING_BREACH: { icon: AlertTriangle, style: 'bg-amber-500/15 text-amber-400 border-amber-500/30 font-semibold' },
    BREACHED: { icon: ShieldAlert, style: 'bg-rose-500/20 text-rose-400 border-rose-500/40 font-bold animate-pulse' },
    RESOLVED_ON_TIME: { icon: CheckCircle, style: 'bg-slate-500/10 text-slate-400 border-slate-500/30' }
  };

  const current = configs[slaStatus] || configs.ON_TRACK;
  const Icon = current.icon;

  return (
    <span className={twMerge('inline-flex items-center px-2 py-0.5 rounded-md text-xs border', current.style)}>
      <Icon className="w-3 h-3 mr-1 rtl:ml-1 rtl:mr-0" />
      {t(`sla_${slaStatus}`)}
    </span>
  );
}

export function TierBadge({ tier }: { tier: string }) {
  const t = tier.toUpperCase();
  const styles: Record<string, string> = {
    ENTERPRISE: 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold',
    VIP: 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold',
    STANDARD: 'bg-slate-800 text-slate-300 border-slate-700'
  };

  return (
    <span className={twMerge('inline-flex items-center px-2 py-0.5 rounded text-[11px] uppercase tracking-wider border', styles[t] || styles.STANDARD)}>
      {t}
    </span>
  );
}
