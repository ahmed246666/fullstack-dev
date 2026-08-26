'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Search, ThumbsUp, ThumbsDown, Tag, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';

export default function KnowledgeBasePage() {
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');

  const { data, isLoading } = useQuery({
    queryKey: ['kb-articles', search, category],
    queryFn: () => api.getKnowledgeArticles({ search, category })
  });

  const categories = ['ALL', 'Getting Started', 'API & Integrations', 'Account & Billing', 'Troubleshooting'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <span>{t('navKnowledge')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Searchable bilingual self-service guides, FAQs, and integration docs.</p>
        </div>
      </div>

      {/* Search Header */}
      <div className="p-8 rounded-3xl glass-panel bg-gradient-to-r from-emerald-950/20 via-slate-900 to-slate-950 border border-slate-800 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">How can we help you today?</h2>
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 rtl:right-4 rtl:left-auto top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search FAQs, solutions, or guides..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700 rounded-2xl pl-11 pr-4 rtl:pr-11 rtl:pl-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-xl"
          />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                category === c ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-400 animate-pulse">Loading articles...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(data?.data || []).map((article: any) => (
            <Card key={article.id} className="glass-panel-hover p-6 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold mb-3">
                  <Tag className="w-3 h-3" />
                  <span>{article.category}</span>
                </div>
                <h3 className="font-bold text-slate-100 text-base mb-2">
                  {lang === 'ar' ? article.titleAr || article.title : article.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {lang === 'ar' ? article.contentAr || article.content : article.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px] text-slate-500">{article.tags}</span>
                <div className="flex items-center gap-3 font-semibold text-emerald-400">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>+{article.helpfulVotes}</span>
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
