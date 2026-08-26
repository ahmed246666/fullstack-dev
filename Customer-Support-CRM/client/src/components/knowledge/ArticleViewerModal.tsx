'use client';

import React, { useState } from 'react';
import { BookOpen, ThumbsUp, ThumbsDown, Tag, Clock, Check, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

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

  // Sync state when article opens
  React.useEffect(() => {
    if (article) {
      setUpvotes(article.helpfulCount ?? 0);
      setDownvotes(article.notHelpfulCount ?? 0);
      setHasVoted(null);
    }
  }, [article]);

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
      await api.voteKnowledgeArticle(article.slug, isHelpful);
      onVoted?.();
    } catch (err: any) {
      alert(err.message || 'Failed to submit vote');
    } finally {
      setIsVoting(false);
    }
  };

  const title = lang === 'ar' ? article.titleAr || article.title : article.title;
  const content = lang === 'ar' ? article.contentAr || article.content : article.content;
  const tagsList =
    typeof article.tags === 'string' ? article.tags.split(',').map((t: string) => t.trim()) : [];

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
          <h2 className="text-xl font-extrabold text-white leading-relaxed font-brand text-gold-200">
            {title}
          </h2>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-2 flex-wrap">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              <span>
                {lang === 'ar' ? 'تاريخ النشر: ' : 'Published on '}
                {new Date(article.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </span>
            <span>•</span>
            <span className="font-mono text-gold-400/80 text-[11px]">/{article.slug}</span>
          </div>
        </div>

        {/* Tags */}
        {tagsList.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap font-sans">
            {tagsList.map((tag: string, idx: number) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-lg bg-navy-950 border border-navy-800 text-gold-300 text-[10.5px] font-medium font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Article Body */}
        <div className="p-5 rounded-2xl bg-navy-950 border border-navy-800 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
          {content}
        </div>

        {/* Helpfulness Voting Section */}
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-gold-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
          <div>
            <div className="text-xs font-bold text-white font-brand text-gold-300">
              {lang === 'ar' ? 'هل كان هذا الدليل مفيداً لك؟' : 'Was this article helpful?'}
            </div>
            <div className="text-[11px] text-slate-400">
              {lang === 'ar'
                ? 'تقييمك يساعد فريق الدعم على تحسين وتحديث قواعد المعرفة باستمرار.'
                : 'Your feedback helps our team maintain high quality knowledge base articles.'}
            </div>
          </div>

          <div className="flex items-center gap-2 font-brand">
            <button
              onClick={() => handleVote(true)}
              disabled={hasVoted !== null || isVoting}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                hasVoted === true
                  ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                  : 'bg-navy-950 border-navy-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>
                {lang === 'ar' ? 'نعم، مفيد' : 'Yes'} ({upvotes})
              </span>
            </button>

            <button
              onClick={() => handleVote(false)}
              disabled={hasVoted !== null || isVoting}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                hasVoted === false
                  ? 'bg-rose-600/30 border-rose-500 text-rose-300 ring-2 ring-rose-500/30'
                  : 'bg-navy-950 border-navy-800 hover:border-rose-500/50 text-slate-300 hover:text-rose-400'
              }`}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>
                {lang === 'ar' ? 'غير مفيد' : 'No'} ({downvotes})
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
