'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Zap,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  AlertCircle,
  Flame,
  ThumbsUp
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { aiCopilot, SentimentResult, SummaryResult } from '@/lib/aiCopilot';
import { Button } from '@/components/ui/Button';

interface AICopilotWidgetProps {
  ticket: any;
  onApplyDraft: (draftText: string) => void;
}

export function AICopilotWidget({ ticket, onApplyDraft }: AICopilotWidgetProps) {
  const { lang, t } = useLanguage();
  const [tone, setTone] = useState<'professional' | 'empathetic' | 'technical'>('professional');
  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  if (!ticket) return null;

  const sentiment: SentimentResult = aiCopilot.analyzeSentiment(
    ticket.title || '',
    ticket.description || ''
  );
  const summary: SummaryResult = aiCopilot.summarizeTicket(ticket);
  const draftReply = aiCopilot.generateAIDraft(ticket, tone, lang as 'en' | 'ar');

  const handleCopy = () => {
    navigator.clipboard.writeText(draftReply);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleInsert = () => {
    onApplyDraft(draftReply);
  };

  const toneLabels = {
    professional: { en: 'Professional', ar: 'رسمي مهني' },
    empathetic: { en: 'Empathetic', ar: 'متعاطف وودود' },
    technical: { en: 'Technical', ar: 'تقني مفصل' }
  };

  return (
    <div className="rounded-2xl border border-gold-500/30 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 p-4 space-y-4 shadow-xl">
      {/* Widget Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5 font-brand text-gold-300">
              <span>{lang === 'ar' ? 'مساعد الدعم الذكي (AI Copilot)' : 'AI Support Copilot'}</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-gold-500/20 text-gold-300 border border-gold-500/30">
                v2.0
              </span>
            </h4>
            <div className="text-[10px] text-slate-400 font-sans">
              {lang === 'ar'
                ? 'تحليل المشاعر وصياغة الردود السياقية الفورية'
                : 'Sentiment Analysis & Instant Contextual Response Drafts'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-800 transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-1 animate-in fade-in duration-200 font-sans">
          {/* Sentiment Analysis Bar */}
          <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-lg">{sentiment.emoji}</span>
              <div>
                <div className="text-[10px] text-gold-400 uppercase font-bold tracking-wider font-brand">
                  {lang === 'ar' ? 'مشاعر ورضا العميل:' : 'Customer Sentiment:'}
                </div>
                <div className="font-bold text-slate-200">
                  {lang === 'ar' ? sentiment.labelAr : sentiment.label}
                </div>
              </div>
            </div>

            <div className="text-right rtl:text-left">
              <span className="text-[10px] text-slate-400 block font-brand">
                {lang === 'ar' ? 'نسبة الدقة' : 'Confidence'}
              </span>
              <span className="font-mono font-bold text-xs text-gold-400">
                {sentiment.confidence}%
              </span>
            </div>
          </div>

          {/* AI Summary Card */}
          <div className="p-3 rounded-xl bg-navy-950/70 border border-navy-800 text-xs space-y-1.5">
            <div className="font-bold text-gold-300 flex items-center gap-1 text-[11px] font-brand">
              <Bot className="w-3.5 h-3.5 text-gold-400" />
              <span>{lang === 'ar' ? 'ملخص البلاغ والتوصية:' : 'AI Key Insights & Action:'}</span>
            </div>
            <p className="text-[11.5px] text-slate-300 leading-relaxed">
              {lang === 'ar' ? summary.suggestedActionAr : summary.suggestedAction}
            </p>
          </div>

          {/* Tone Selector & Draft Reply */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gold-300 text-[11px] font-brand">
                {lang === 'ar' ? 'نبرة الرد المقترح:' : 'Response Tone:'}
              </span>
              <div className="flex items-center gap-1 font-sans">
                {(['professional', 'empathetic', 'technical'] as const).map((tKey) => (
                  <button
                    key={tKey}
                    type="button"
                    onClick={() => setTone(tKey)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border transition-all ${
                      tone === tKey
                        ? 'bg-gold-500 text-navy-950 border-gold-400 font-bold shadow-sm'
                        : 'bg-navy-950 text-slate-300 border-navy-800 hover:text-white'
                    }`}
                  >
                    {toneLabels[tKey][lang === 'ar' ? 'ar' : 'en']}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-navy-950 border border-gold-500/20 text-xs text-slate-100 leading-relaxed whitespace-pre-wrap font-sans">
              {draftReply}
            </div>

            {/* Actions: Insert to reply box or copy */}
            <div className="flex items-center justify-end gap-2 pt-1 font-sans">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="text-[11px] py-1 px-2.5 h-auto border-navy-700 hover:border-gold-500/40"
              >
                {isCopied ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-gold-400" />
                )}
                <span>
                  {isCopied
                    ? lang === 'ar'
                      ? 'تم النسخ'
                      : 'Copied'
                    : lang === 'ar'
                      ? 'نسخ النص'
                      : 'Copy'}
                </span>
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={handleInsert}
                className="text-[11px] py-1 px-3 h-auto bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold shadow-md shadow-gold-500/20"
              >
                <Zap className="w-3 h-3 fill-current" />
                <span>{lang === 'ar' ? 'إدراج في صندوق الرد' : 'Insert to Reply'}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
