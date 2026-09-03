'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, ThumbsUp, ThumbsDown, Tag, Clock, Check, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/Toast';

interface ArticleViewerModalProps {
  article: any | null;
  isOpen: boolean;
  onClose: () => void;
  onVoted?: () => void;
}

export function ArticleViewerModal({ article, isOpen, onClose, onVoted }: ArticleViewerModalProps) {
  const { lang, t } = useLanguage();
  const [hasVoted, setHasVoted] = useState<boolean | null>(null);
  const [upvotes, setUpvotes] = useState<number>(0);
  const [downvotes, setDownvotes] = useState<number>(0);
  const [isVoting, setIsVoting] = useState(false);

  // Sync state when article opens and restore local vote memory
  useEffect(() => {
    if (article) {
      const initialUp = article.helpfulVotes ?? article.helpfulCount ?? 0;
      const initialDown = article.unhelpfulVotes ?? article.notHelpfulCount ?? 0;
      setUpvotes(initialUp);
      setDownvotes(initialDown);

      // Check persistent localStorage for prior vote on this article
      const articleKey = `azm_article_vote_${article.id || article.slug}`;
      try {
        const storedVote = localStorage.getItem(articleKey);
        if (storedVote === 'true') {
          setHasVoted(true);
        } else if (storedVote === 'false') {
          setHasVoted(false);
        } else {
          setHasVoted(null);
        }
      } catch {
        setHasVoted(null);
      }
    }
  }, [article, isOpen]);

  if (!article) return null;

  const handleVote = async (isHelpful: boolean) => {
    if (hasVoted !== null || isVoting) return;

    try {
      setIsVoting(true);
      if (isHelpful) {
        setUpvotes((prev) => prev + 1);
      } else {
        setDownvotes((prev) => prev + 1);
      }
      setHasVoted(isHelpful);

      // Persist client vote memory
      const articleKey = `azm_article_vote_${article.id || article.slug}`;
      try {
        localStorage.setItem(articleKey, isHelpful ? 'true' : 'false');
      } catch {
        // ignore localStorage errors
      }

      await api.voteKnowledgeArticle(article.id || article.slug, isHelpful);

      toast.success(
        lang === 'ar'
          ? 'شكراً لك! تم تسجيل تصويتك وحفظه بنجاح.'
          : 'Thank you! Your vote has been saved.',
        lang === 'ar' ? 'تقييم المقال' : 'Article Feedback'
      );

      onVoted?.();
    } catch (err: any) {
      toast.error(
        err.message || (lang === 'ar' ? 'فشل إرسال التقييم' : 'Failed to submit vote'),
        lang === 'ar' ? 'خطأ' : 'Error'
      );
    } finally {
      setIsVoting(false);
    }
  };

  const title = lang === 'ar' ? article.titleAr || article.title : article.title;
  const content = lang === 'ar' ? article.contentAr || article.content : article.content;
  const tagsList =
    typeof article.tags === 'string'
      ? article.tags.split(',').map((t: string) => t.trim())
      : Array.isArray(article.tags)
      ? article.tags
      : [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-gold-400" />
          <span className="text-sm font-bold text-white font-brand text-gold-300">
            {article.category}
          </span>
        </div>
      }
      maxWidth="xl"
    >
      <div className="space-y-6 font-sans">
        <div>
          <h2 className="text-xl font-bold text-slate-100 font-brand leading-snug">{title}</h2>
          <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 flex-wrap">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <span>
                {new Date(article.createdAt || Date.now()).toLocaleDateString(
                  lang === 'ar' ? 'ar-SA' : 'en-US',
                  { year: 'numeric', month: 'short', day: 'numeric' }
                )}
              </span>
            </div>

            <div className="flex items-center gap-1 font-mono text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              <ThumbsUp className="w-3 h-3 shrink-0" />
              <span>{upvotes} {lang === 'ar' ? 'صوت مفيد' : 'helpful'}</span>
            </div>

            {downvotes > 0 && (
              <div className="flex items-center gap-1 font-mono text-[11px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                <ThumbsDown className="w-3 h-3 shrink-0" />
                <span>{downvotes}</span>
              </div>
            )}
          </div>
        </div>

        {tagsList.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <Tag className="w-3.5 h-3.5 text-gold-400 mr-1 rtl:ml-1 rtl:mr-0 shrink-0" />
            {tagsList.map((tag: string, idx: number) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-[11px] bg-navy-900 border border-navy-750 text-slate-300 font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Article Body */}
        <div className="p-5 rounded-2xl bg-navy-950 border border-navy-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans shadow-inner">
          {content}
        </div>

        {/* Helpfulness Voting Section */}
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-gold-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
          <div>
            <div className="text-xs font-bold text-white font-brand text-gold-300">
              {lang === 'ar' ? 'هل كان هذا الدليل مفيداً لك؟' : 'Was this article helpful?'}
            </div>
            <div className="text-[11px] text-slate-400">
              {hasVoted !== null
                ? (lang === 'ar'
                  ? 'تم تسجيل تقييمك لهذا الدليل. شكراً لمشاركتك!'
                  : 'Your vote has been saved for this guide. Thank you!')
                : (lang === 'ar'
                  ? 'تقييمك يساعد فريق الدعم على تحسين وتحديث قواعد المعرفة باستمرار.'
                  : 'Your feedback helps our team maintain high quality knowledge base articles.')}
            </div>
          </div>

          <div className="flex items-center gap-2 font-brand shrink-0">
            <button
              onClick={() => handleVote(true)}
              disabled={hasVoted !== null || isVoting}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all select-none ${
                hasVoted === true
                  ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30 cursor-default font-bold shadow-lg shadow-emerald-500/20'
                  : hasVoted !== null
                  ? 'bg-navy-950/60 border-navy-850 text-slate-500 cursor-not-allowed opacity-60'
                  : 'bg-navy-950 border-navy-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 active:scale-95'
              }`}
            >
              {hasVoted === true ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <ThumbsUp className="w-4 h-4 shrink-0" />
              )}
              <span>
                {hasVoted === true
                  ? (lang === 'ar' ? 'مفيد (تم التصويت)' : 'Helpful (Voted)')
                  : (lang === 'ar' ? 'نعم، مفيد' : 'Yes, Helpful')}
              </span>
              <span className="font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded text-[11px]">
                {upvotes}
              </span>
            </button>

            <button
              onClick={() => handleVote(false)}
              disabled={hasVoted !== null || isVoting}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all select-none ${
                hasVoted === false
                  ? 'bg-rose-600/30 border-rose-500 text-rose-300 ring-2 ring-rose-500/30 cursor-default font-bold shadow-lg shadow-rose-500/20'
                  : hasVoted !== null
                  ? 'bg-navy-950/60 border-navy-850 text-slate-500 cursor-not-allowed opacity-60'
                  : 'bg-navy-950 border-navy-800 hover:border-rose-500/50 text-slate-300 hover:text-rose-400 active:scale-95'
              }`}
            >
              {hasVoted === false ? (
                <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
              ) : (
                <ThumbsDown className="w-4 h-4 shrink-0" />
              )}
              <span>
                {hasVoted === false
                  ? (lang === 'ar' ? 'غير مفيد (تم التصويت)' : 'Unhelpful (Voted)')
                  : (lang === 'ar' ? 'غير مفيد' : 'No')}
              </span>
              <span className="font-mono bg-rose-500/10 px-1.5 py-0.5 rounded text-[11px]">
                {downvotes}
              </span>
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2 font-sans">
          <Button variant="outline" onClick={onClose} size="sm" className="border-navy-700">
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
