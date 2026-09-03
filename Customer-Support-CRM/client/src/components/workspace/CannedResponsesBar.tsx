'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, MessageSquare, Zap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';

interface CannedResponsesBarProps {
  onSelect: (content: string) => void;
}

export function CannedResponsesBar({ onSelect }: CannedResponsesBarProps) {
  const { lang, t } = useLanguage();

  const { data, isLoading } = useQuery({
    queryKey: ['canned-macros'],
    queryFn: () => api.getCannedResponses()
  });

  const cannedList = data?.data || [
    {
      id: 'canned-1',
      shortcut: '/greet',
      title: 'Standard Greeting',
      titleAr: 'تحية ترحيبية',
      content:
        'Hello! Thank you for reaching out to AZM Squad Support. I would be glad to assist you today.',
      contentAr:
        'مرحباً بك! شكراً لتواصلك مع فريق دعم عزم. يسعدني جداً مساعدتك اليوم والعمل على حل طلبك.'
    },
    {
      id: 'canned-2',
      shortcut: '/investigating',
      title: 'Issue Under Investigation',
      titleAr: 'جاري التحقيق بالطلب',
      content:
        'Our technical engineering team is actively investigating this issue and analyzing system telemetry logs.',
      contentAr:
        'يقوم فريق الهندسة التقنية لدينا بالتحقيق الفوري في المشكلة وتحليل سجلات النظام لتقديم الحل.'
    },
    {
      id: 'canned-3',
      shortcut: '/invoice',
      title: 'Billing Clarification',
      titleAr: 'توضيح الفواتير والاشتراك',
      content:
        'I have reviewed your corporate billing account and verified your subscription tier and active licenses.',
      contentAr:
        'لقد قمت بمراجعة حساب الفوترة المؤسسي الخاص بك والتحقق من باقة الاشتراك والتراخيص النشطة.'
    },
    {
      id: 'canned-4',
      shortcut: '/resolve',
      title: 'Resolution Confirmation',
      titleAr: 'تأكيد الحل النهائي',
      content:
        'The issue has been successfully resolved and tested. Please let us know if you need anything else!',
      contentAr:
        'تم حل المشكلة واختبارها بنجاح تام. نرجو إعلامنا إذا كنت بحاجة إلى أي مساعدة إضافية!'
    }
  ];

  return (
    <div className="space-y-2 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] font-bold text-gold-300">
        <div className="flex items-center gap-1.5 text-gold-400 font-brand shrink-0">
          <Zap className="w-3.5 h-3.5 shrink-0" />
          <span>
            {lang === 'ar'
              ? 'الردود السريعة الجاهزة (1-Click Macros):'
              : '1-Click Canned Macro Replies:'}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-normal">
          {lang === 'ar'
            ? 'انقر لإدراج الرد المخصص تلقائياً'
            : 'Click chip to auto-insert template'}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {cannedList.map((c: any) => {
          const title = lang === 'ar' ? c.titleAr || c.title : c.title;
          const text = lang === 'ar' ? c.contentAr || c.content : c.content;

          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(text)}
              className="group flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-navy-950/90 hover:bg-gold-500/10 border border-navy-800 hover:border-gold-500/40 text-slate-300 hover:text-gold-200 text-xs font-medium transition-all shadow-sm active:scale-95 shrink-0"
              title={text}
            >
              <span className="font-mono font-bold text-[10px] text-gold-400 group-hover:text-gold-300 bg-gold-500/10 px-1.5 py-0.5 rounded shrink-0">
                {c.shortcut}
              </span>
              <span className="truncate max-w-[170px] sm:max-w-none">{title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
