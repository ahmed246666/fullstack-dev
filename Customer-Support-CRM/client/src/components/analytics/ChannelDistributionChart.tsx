'use client';

import React from 'react';
import { Layers, MessageSquare, Mail, PhoneCall, Smartphone, Globe } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { useLanguage } from '@/context/LanguageContext';

interface ChannelDistributionChartProps {
  channelCounts: {
    WHATSAPP?: number;
    EMAIL?: number;
    LIVE_CHAT?: number;
    SMS?: number;
    WEB_FORM?: number;
  };
}

export function ChannelDistributionChart({ channelCounts = {} }: ChannelDistributionChartProps) {
  const { lang, t } = useLanguage();

  const channels = [
    {
      key: 'WHATSAPP',
      label: t('channel_WHATSAPP'),
      icon: PhoneCall,
      color: 'bg-emerald-500',
      count: channelCounts.WHATSAPP || 0
    },
    {
      key: 'EMAIL',
      label: t('channel_EMAIL'),
      icon: Mail,
      color: 'bg-blue-500',
      count: channelCounts.EMAIL || 0
    },
    {
      key: 'LIVE_CHAT',
      label: t('channel_LIVE_CHAT'),
      icon: MessageSquare,
      color: 'bg-cyan-500',
      count: channelCounts.LIVE_CHAT || 0
    },
    {
      key: 'SMS',
      label: t('channel_SMS'),
      icon: Smartphone,
      color: 'bg-amber-500',
      count: channelCounts.SMS || 0
    },
    {
      key: 'WEB_FORM',
      label: t('channel_WEB_FORM'),
      icon: Globe,
      color: 'bg-purple-500',
      count: channelCounts.WEB_FORM || 0
    }
  ];

  const total = channels.reduce((sum, c) => sum + c.count, 0) || 1;

  return (
    <Card className="p-6 space-y-6 border-gold-500/20 bg-navy-900/80">
      <div>
        <CardTitle className="text-base font-brand text-gold-300 flex items-center gap-2">
          <Layers className="w-5 h-5 text-gold-400" />
          <span>{lang === 'ar' ? 'توزيع التذاكر حسب القناة' : 'Omnichannel Ingestion Volume'}</span>
        </CardTitle>
        <p className="text-xs text-slate-400 mt-1 font-sans">
          {lang === 'ar'
            ? 'حجم التذاكر الواردة والموزعة لحظياً عبر القنوات الخمس.'
            : 'Real-time incoming support volume segregated across 5 communication channels.'}
        </p>
      </div>

      <div className="space-y-4 font-sans">
        {channels.map((chan) => {
          const Icon = chan.icon;
          const pct = Math.round((chan.count / total) * 100);

          return (
            <div key={chan.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-gold-400" />
                  <span className="font-semibold text-slate-200 font-brand">{chan.label}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-white">{chan.count}</span>
                  <span className="text-[11px] text-slate-400 w-8 text-right rtl:text-left">
                    ({pct}%)
                  </span>
                </div>
              </div>

              <div className="h-2 w-full bg-navy-950 rounded-full overflow-hidden border border-navy-800">
                <div
                  style={{ width: `${Math.max(pct, chan.count > 0 ? 4 : 0)}%` }}
                  className={`h-full ${chan.color} rounded-full transition-all duration-500`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
