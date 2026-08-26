'use client';

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, ShieldAlert, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface SLACountdownTimerProps {
  resolutionDueAt: string | null;
  status: string;
  className?: string;
}

export function SLACountdownTimer({ resolutionDueAt, status, className }: SLACountdownTimerProps) {
  const { lang, t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    isBreached: boolean;
  } | null>(null);

  useEffect(() => {
    if (!resolutionDueAt || status === 'RESOLVED' || status === 'CLOSED') {
      setTimeLeft(null);
      return;
    }

    const calculateTime = () => {
      const target = new Date(resolutionDueAt).getTime();
      const now = new Date().getTime();
      const diffMs = target - now;

      if (diffMs <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, isBreached: true });
      } else {
        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        setTimeLeft({ hours, minutes, isBreached: false });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 30000); // 30s tick
    return () => clearInterval(interval);
  }, [resolutionDueAt, status]);

  if (status === 'RESOLVED' || status === 'CLOSED') {
    return (
      <span
        className={`inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 ${className}`}
      >
        <CheckCircle className="w-3 h-3 text-slate-400" />
        <span>Resolved</span>
      </span>
    );
  }

  if (!timeLeft) {
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] text-slate-400 ${className}`}>
        <Clock className="w-3 h-3" />
        <span>No Due Date</span>
      </span>
    );
  }

  if (timeLeft.isBreached) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/30 animate-pulse ${className}`}
      >
        <ShieldAlert className="w-3 h-3" />
        <span>SLA Breached</span>
      </span>
    );
  }

  const isUrgent = timeLeft.hours < 2;

  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
        isUrgent
          ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 font-bold'
          : 'bg-slate-900 text-slate-300 border-slate-800'
      } ${className}`}
    >
      <Clock
        className={`w-3 h-3 ${isUrgent ? 'text-amber-400 animate-spin-slow' : 'text-slate-400'}`}
      />
      <span>
        {timeLeft.hours}h {timeLeft.minutes}m left
      </span>
    </span>
  );
}
