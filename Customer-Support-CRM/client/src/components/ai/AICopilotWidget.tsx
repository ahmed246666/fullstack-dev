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

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-purple-950/30 p-4 space-y-4 shadow-xl">
      {/* Widget Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
              <span>{lang === 'ar' ? 'مساعد الذكاء الاصطناعي الذكي' : 'AI Support Copilot'}</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                v2.0
              </span>
            </h4>
            <div className="text-[10px] text-slate-400">
              Sentiment Analysis & Instant Contextual Response Drafts
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-1 animate-in fade-in duration-200">
          {/* Sentiment Analysis Bar */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-lg">{sentiment.emoji}</span>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Customer Sentiment:
                </div>
                <div className="font-bold text-slate-200">
                  {lang === 'ar' ? sentiment.labelAr : sentiment.label}
                </div>
              </div>
            </div>

            <div className="text-right rtl:text-left">
              <span className="text-[10px] text-slate-500 block">Confidence</span>
              <span className="font-mono font-bold text-xs text-indigo-400">
                {sentiment.confidence}%
              </span>
            </div>
          </div>

          {/* AI Summary Card */}
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/60 text-xs space-y-1.5">
            <div className="font-bold text-slate-300 flex items-center gap-1 text-[11px]">
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'ar' ? 'ملخص البلاغ والتوصية:' : 'AI Key Insights & Action:'}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {lang === 'ar' ? summary.suggestedActionAr : summary.suggestedAction}
            </p>
          </div>

          {/* Tone Selector & Draft Reply */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 text-[11px]">
                {lang === 'ar' ? 'نبرة الرد المقترح:' : 'Response Tone:'}
              </span>
              <div className="flex items-center gap-1">
                {(['professional', 'empathetic', 'technical'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold capitalize border transition-all ${
                      tone === t
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/20 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
              {draftReply}
            </div>

            {/* Actions: Insert to reply box or copy */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="text-[11px] py-1 px-2.5 h-auto"
              >
                {isCopied ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={handleInsert}
                className="text-[11px] py-1 px-3 h-auto bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20"
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
