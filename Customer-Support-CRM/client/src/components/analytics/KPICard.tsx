'use client';

import React from 'react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface KPICardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: 'indigo' | 'emerald' | 'amber' | 'purple' | 'cyan' | 'rose';
}

export function KPICard({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  color = 'indigo'
}: KPICardProps) {
  const colorMap = {
    indigo: {
      iconBg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
      ring: 'hover:border-indigo-500/50'
    },
    emerald: {
      iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      ring: 'hover:border-emerald-500/50'
    },
    amber: {
      iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      ring: 'hover:border-amber-500/50'
    },
    purple: {
      iconBg: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      ring: 'hover:border-purple-500/50'
    },
    cyan: {
      iconBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
      ring: 'hover:border-cyan-500/50'
    },
    rose: {
      iconBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      ring: 'hover:border-rose-500/50'
    }
  };

  const scheme = colorMap[color];

  return (
    <Card className={`p-5 glass-panel-hover border-slate-800 transition-all ${scheme.ring}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          <div className="text-2xl font-extrabold text-white tracking-tight">{value}</div>
        </div>

        <div
          className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${scheme.iconBg}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        {trend ? (
          <div className="flex items-center gap-1">
            {trend.isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span
              className={`font-bold text-[11px] ${
                trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {trend.value}
            </span>
          </div>
        ) : (
          <span className="text-[10px] text-slate-500 font-medium">Real-time KPI</span>
        )}

        {subtext && (
          <span className="text-[11px] text-slate-400 truncate max-w-[150px]">{subtext}</span>
        )}
      </div>
    </Card>
  );
}
