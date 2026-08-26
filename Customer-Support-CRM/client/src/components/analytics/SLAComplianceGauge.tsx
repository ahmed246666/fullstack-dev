'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { useLanguage } from '@/context/LanguageContext';

interface SLAComplianceGaugeProps {
  complianceRate: number;
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
  const { lang, t } = useLanguage();
  const total = onTrackCount + approachingCount + breachedCount || 1;

  const onTrackPct = Math.round((onTrackCount / total) * 100);
  const approachingPct = Math.round((approachingCount / total) * 100);
  const breachedPct = Math.round((breachedCount / total) * 100);

  return (
    <Card className="p-6 space-y-6 border-gold-500/20 bg-navy-900/80">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-base font-brand text-gold-300 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>
              {lang === 'ar'
                ? 'مؤشر الامتثال لاتفاقيات الخدمة (SLA)'
                : 'SLA Compliance & Contractual Health'}
            </span>
          </CardTitle>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            {lang === 'ar'
              ? 'معدل الالتزام بأوقات الاستجابة والحل التعاقدية للعملاء.'
              : 'Resolution SLA adherence rate against enterprise contractual targets.'}
          </p>
        </div>

        <div className="text-right rtl:text-left font-brand">
          <div className="text-3xl font-extrabold text-emerald-400">{complianceRate}%</div>
          <div className="text-[10px] uppercase font-bold text-slate-400">
            {lang === 'ar' ? 'المستهدف: 95%+' : 'Target: 95.0%+'}
          </div>
        </div>
      </div>

      {/* Multi-segment Progress Bar */}
      <div className="space-y-2">
        <div className="h-3.5 w-full bg-navy-950 rounded-full overflow-hidden flex p-0.5 border border-navy-800">
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

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-sans">
          <span>0%</span>
          <span>{lang === 'ar' ? 'تم تحقيق الهدف (95%+)' : 'Target Met (95%+)'}</span>
          <span>100%</span>
        </div>
      </div>

      {/* Legend Breakdown Grid */}
      <div className="grid grid-cols-3 gap-3 pt-2">
        <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-800/30 text-center">
          <div className="text-emerald-400 text-xl font-extrabold font-brand">{onTrackCount}</div>
          <div className="text-[11px] text-emerald-300 font-semibold mt-0.5 flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{lang === 'ar' ? 'ضمن الوقت' : 'On Track'}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-800/30 text-center">
          <div className="text-amber-400 text-xl font-extrabold font-brand">{approachingCount}</div>
          <div className="text-[11px] text-amber-300 font-semibold mt-0.5 flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>{lang === 'ar' ? 'إنذار اقتراب' : '<2h Warning'}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-800/30 text-center">
          <div className="text-rose-400 text-xl font-extrabold font-brand">{breachedCount}</div>
          <div className="text-[11px] text-rose-300 font-semibold mt-0.5 flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>{lang === 'ar' ? 'تجاوز SLA' : 'Breached'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
