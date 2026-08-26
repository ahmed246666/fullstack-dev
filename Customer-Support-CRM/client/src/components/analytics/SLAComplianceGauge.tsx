'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { useLanguage } from '@/context/LanguageContext';

interface SLAComplianceGaugeProps {
  complianceRate: number; // e.g. 96.5
  onTrackCount: number;
  approachingCount: number;
  breachedCount: number;
}

export function SLAComplianceGauge({
  complianceRate = 96.5,
  onTrackCount = 0,
  approachingCount = 0,
  breachedCount = 0
}: SLAComplianceGaugeProps) {
  const { lang } = useLanguage();
  const total = onTrackCount + approachingCount + breachedCount || 1;

  const onTrackPct = Math.round((onTrackCount / total) * 100);
  const approachingPct = Math.round((approachingCount / total) * 100);
  const breachedPct = Math.round((breachedCount / total) * 100);

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>{lang === 'ar' ? 'مؤشر الامتثال لـ SLA' : 'SLA Compliance & Health'}</span>
          </CardTitle>
          <p className="text-xs text-slate-400 mt-1">
            Resolution SLA adherence rate against enterprise contractual targets.
          </p>
        </div>

        <div className="text-right rtl:text-left">
          <div className="text-3xl font-extrabold text-emerald-400">{complianceRate}%</div>
          <div className="text-[10px] uppercase font-bold text-slate-500">Target: 95.0%</div>
        </div>
      </div>

      {/* Multi-segment Progress Bar */}
      <div className="space-y-2">
        <div className="h-3.5 w-full bg-slate-900 rounded-full overflow-hidden flex p-0.5 border border-slate-800">
          <div
            style={{ width: `${Math.max(onTrackPct, 5)}%` }}
            className="bg-emerald-500 rounded-l-full transition-all duration-500"
            title={`On Track: ${onTrackCount}`}
          />
          {approachingCount > 0 && (
            <div
              style={{ width: `${approachingPct}%` }}
              className="bg-amber-500 transition-all duration-500"
              title={`Approaching Breach: ${approachingCount}`}
            />
          )}
          {breachedCount > 0 && (
            <div
              style={{ width: `${breachedPct}%` }}
              className="bg-rose-500 rounded-r-full transition-all duration-500"
              title={`Breached: ${breachedCount}`}
            />
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>0% Failure</span>
          <span>Target Met (95%+)</span>
          <span>100% Guaranteed</span>
        </div>
      </div>

      {/* Legend Breakdown Grid */}
      <div className="grid grid-cols-3 gap-3 pt-2">
        <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-800/30 text-center">
          <div className="text-emerald-400 text-lg font-extrabold">{onTrackCount}</div>
          <div className="text-[10px] text-emerald-300 font-semibold mt-0.5 flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>On Track</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-800/30 text-center">
          <div className="text-amber-400 text-lg font-extrabold">{approachingCount}</div>
          <div className="text-[10px] text-amber-300 font-semibold mt-0.5 flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>&lt;2h Warning</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-rose-950/20 border border-rose-800/30 text-center">
          <div className="text-rose-400 text-lg font-extrabold">{breachedCount}</div>
          <div className="text-[10px] text-rose-300 font-semibold mt-0.5 flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>Breached</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
