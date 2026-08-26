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
  const { lang } = useLanguage();
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
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold text-white">{article.category}</span>
        </div>
      }
      maxWidth="xl"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-white leading-relaxed">{title}</h2>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-2 flex-wrap">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>
                Published {new Date(article.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </span>
            <span>•</span>
            <span className="font-mono text-slate-500 text-[11px]">/{article.slug}</span>
          </div>
        </div>

        {/* Tags */}
        {tagsList.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {tagsList.map((tag: string, idx: number) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Article Body */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
          {content}
        </div>

        {/* Helpfulness Voting Section */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-slate-200">
              {lang === 'ar' ? 'هل كان هذا المقال مفيداً لك؟' : 'Was this article helpful?'}
            </div>
            <div className="text-[11px] text-slate-400">
              Your feedback helps our team maintain high quality knowledge base articles.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleVote(true)}
              disabled={hasVoted !== null || isVoting}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                hasVoted === true
                  ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                  : 'bg-slate-950 border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Yes ({upvotes})</span>
            </button>

            <button
              onClick={() => handleVote(false)}
              disabled={hasVoted !== null || isVoting}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                hasVoted === false
                  ? 'bg-rose-600/30 border-rose-500 text-rose-300 ring-2 ring-rose-500/30'
                  : 'bg-slate-950 border-slate-800 hover:border-rose-500/50 text-slate-300 hover:text-rose-400'
              }`}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>No ({downvotes})</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose} size="sm">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
