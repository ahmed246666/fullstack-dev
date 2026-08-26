'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen,
  Search,
  Plus,
  ThumbsUp,
  FolderOpen,
  ArrowRight,
  Sparkles,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArticleModal } from '@/components/knowledge/ArticleModal';
import { ArticleViewerModal } from '@/components/knowledge/ArticleViewerModal';

export default function KnowledgeBasePage() {
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewingArticle, setViewingArticle] = useState<any | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['kb-articles', search, selectedCategory],
    queryFn: () => api.getKnowledgeArticles({ search, category: selectedCategory })
  });

  const articles = data?.data || [];

  const categories = [
    { key: 'ALL', label: lang === 'ar' ? 'جميع التصنيفات' : 'All Categories' },
    { key: 'Getting Started', label: lang === 'ar' ? 'البدء السريع' : 'Getting Started' },
    {
      key: 'API & Integrations',
      label: lang === 'ar' ? 'واجهات البرمجة والربط' : 'API & Integrations'
    },
    {
      key: 'Account & Billing',
      label: lang === 'ar' ? 'الحسابات والاشتراكات' : 'Account & Billing'
    },
    { key: 'Troubleshooting', label: lang === 'ar' ? 'استكشاف الأخطاء وحلها' : 'Troubleshooting' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Self-Service Knowledge Base</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
            {lang === 'ar'
              ? 'قاعدة المعرفة والمقالات الإرشادية'
              : 'Knowledge Base & Troubleshooting Guides'}
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            {lang === 'ar'
              ? 'تصفح الحلول والأدلة المعتمدة ثنائية اللغة لتقليل وقت معالجة التذاكر وتسهيل الدعم الذاتي.'
              : 'Browse verified bilingual guides, API specs, and resolution steps to accelerate agent workflows.'}
          </p>
        </div>

        <Button onClick={() => setIsCreateOpen(true)} className="text-xs shrink-0">
          <Plus className="w-4 h-4" />
          <span>{lang === 'ar' ? 'نشر مقال جديد' : 'Publish Article'}</span>
        </Button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 rtl:right-4 rtl:left-auto top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={
              lang === 'ar'
                ? 'ابحث في المقالات بالعنوان، المحتوى أو الوسوم...'
                : 'Search articles by title, content, or tags...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-11 pr-4 rtl:pr-11 rtl:pl-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all shadow-inner"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap ${
                selectedCategory === c.key
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {isLoading ? (
        <div className="py-24 text-center text-xs text-slate-400 animate-pulse">
          Loading Knowledge Base Articles...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((article: any) => {
            const title = lang === 'ar' ? article.titleAr || article.title : article.title;
            const content = lang === 'ar' ? article.contentAr || article.content : article.content;
            const tagsList =
              typeof article.tags === 'string'
                ? article.tags.split(',').map((t: string) => t.trim())
                : [];

            return (
              <Card
                key={article.id}
                onClick={() => setViewingArticle(article)}
                className="p-5 flex flex-col justify-between glass-panel-hover border-slate-800/80 hover:border-emerald-500/50 cursor-pointer group transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 font-semibold text-[10px] border border-emerald-500/20">
                      {article.category}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <ThumbsUp className="w-3 h-3 text-emerald-400" />
                      <span>{article.helpfulCount ?? 0}</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-100 text-sm group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{content}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 flex-wrap">
                    {tagsList.slice(0, 2).map((tag: string, idx: number) => (
                      <span key={idx} className="text-[10px] text-slate-500 font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <span className="font-semibold text-emerald-400 flex items-center gap-1 text-[11px] group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform">
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </span>
                </div>
              </Card>
            );
          })}

          {articles.length === 0 && (
            <div className="col-span-full py-20 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-3xl">
              No knowledge base articles found matching your criteria.
            </div>
          )}
        </div>
      )}

      {/* Article Creation Modal */}
      <ArticleModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => refetch()}
      />

      {/* Article Viewer & Voting Modal */}
      <ArticleViewerModal
        article={viewingArticle}
        isOpen={!!viewingArticle}
        onClose={() => setViewingArticle(null)}
        onVoted={() => refetch()}
      />
    </div>
  );
}
