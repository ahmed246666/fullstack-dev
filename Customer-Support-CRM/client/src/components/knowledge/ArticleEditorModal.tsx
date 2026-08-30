'use client';

import React, { useState, useEffect } from 'react';
import { X, BookOpen, Sparkles, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';

interface ArticleEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialArticle?: any;
  onSuccess?: () => void;
}

const CATEGORIES = [
  'Getting Started',
  'Account & Billing',
  'Troubleshooting',
  'API & Integrations',
  'Security & Compliance'
];

export function ArticleEditorModal({
  isOpen,
  onClose,
  initialArticle,
  onSuccess
}: ArticleEditorModalProps) {
  const { lang } = useLanguage();
  const [title, setTitle] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [content, setContent] = useState('');
  const [contentAr, setContentAr] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tags, setTags] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialArticle) {
      setTitle(initialArticle.title || '');
      setTitleAr(initialArticle.titleAr || '');
      setContent(initialArticle.content || '');
      setContentAr(initialArticle.contentAr || '');
      setCategory(initialArticle.category || CATEGORIES[0]);
      setTags(initialArticle.tags || '');
      setIsPublished(initialArticle.isPublished !== false);
    } else {
      setTitle('');
      setTitleAr('');
      setContent('');
      setContentAr('');
      setCategory(CATEGORIES[0]);
      setTags('');
      setIsPublished(true);
    }
    setError(null);
  }, [initialArticle, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError(
        lang === 'ar'
          ? 'الرجاء إدخال العنوان والمحتوى باللغة الإنجليزية كحد أدنى'
          : 'Title and Content in English are required.'
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (initialArticle?.id) {
        await api.updateKnowledgeArticle(initialArticle.id, {
          title: title.trim(),
          titleAr: titleAr.trim() || null,
          content: content.trim(),
          contentAr: contentAr.trim() || null,
          category,
          tags: tags.trim() || null,
          isPublished
        });
      } else {
        await api.createKnowledgeArticle({
          title: title.trim(),
          titleAr: titleAr.trim() || null,
          content: content.trim(),
          contentAr: contentAr.trim() || null,
          category,
          tags: tags.trim() || null,
          isPublished
        });
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save knowledge base article');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="glass-panel w-full max-w-2xl bg-navy-900 border border-gold-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-navy-800 bg-navy-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-brand">
                {initialArticle
                  ? lang === 'ar'
                    ? 'تعديل مقال المعرفة'
                    : 'Edit Knowledge Article'
                  : lang === 'ar'
                    ? 'نشر مقال جديد في قاعدة المعرفة'
                    : 'Publish Knowledge Article'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'ar'
                  ? 'إضافة مقالات وحلول ثنائية اللغة لمركز الدعم والعملاء'
                  : 'Bilingual article authoring for support agents and customer portal.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 font-sans">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Category & Tags Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                {lang === 'ar' ? 'التصنيف' : 'Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                {lang === 'ar' ? 'الوسوم (مفصولة بفواصل)' : 'Tags (comma separated)'}
              </label>
              <input
                type="text"
                placeholder="e.g. billing, invoice, vat, refund"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          {/* Titles Section */}
          <div className="space-y-3 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Title (English) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. How to connect ERPNext with AZM CRM"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 font-brand">
                العنوان (باللغة العربية)
              </label>
              <input
                type="text"
                dir="rtl"
                placeholder="مثال: كيفية ربط نظام تخطيط الموارد المؤسسية مع منصة عزم"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 font-brand"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-3 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Content Body (English) <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Write step-by-step solution or documentation..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 font-brand">
                نص المقال والحل (باللغة العربية)
              </label>
              <textarea
                rows={4}
                dir="rtl"
                placeholder="اكتب خطوات الحل بالتفصيل هنا..."
                value={contentAr}
                onChange={(e) => setContentAr(e.target.value)}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 font-brand"
              />
            </div>
          </div>

          {/* Published Toggle */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isPublishedCheck"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 rounded text-gold-500 bg-navy-950 border-navy-700 focus:ring-gold-500"
            />
            <label htmlFor="isPublishedCheck" className="text-xs text-slate-300 cursor-pointer">
              {lang === 'ar'
                ? 'نشر فوري في مركز المساعدة وبوابة العملاء'
                : 'Publish immediately to Knowledge Center & Portal'}
            </label>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-navy-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs border-navy-700"
            >
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={isLoading}
              className="bg-gradient-to-r from-gold-600 to-gold-400 text-navy-950 font-bold hover:opacity-95 text-xs shadow-lg shadow-gold-500/20"
            >
              <Save className="w-3.5 h-3.5 mr-1 rtl:ml-1 rtl:mr-0" />
              <span>{initialArticle ? (lang === 'ar' ? 'تحديث المقال' : 'Update Article') : (lang === 'ar' ? 'نشر المقال' : 'Publish Article')}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
