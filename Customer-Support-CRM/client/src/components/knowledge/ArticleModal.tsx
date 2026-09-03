'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ArticleModal({ isOpen, onClose, onSuccess }: ArticleModalProps) {
  const { lang } = useLanguage();
  const [title, setTitle] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Getting Started');
  const [tags, setTags] = useState('Guide, Support');
  const [content, setContent] = useState('');
  const [contentAr, setContentAr] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug) {
      setSlug(generateSlug(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      setIsLoading(true);
      setError('');
      await api.createKnowledgeArticle({
        title: title.trim(),
        titleAr: titleAr.trim() || title.trim(),
        slug: slug.trim() || generateSlug(title),
        category,
        tags: tags.trim(),
        content: content.trim(),
        contentAr: contentAr.trim() || content.trim()
      });
      onSuccess();
      onClose();
      // Reset
      setTitle('');
      setTitleAr('');
      setSlug('');
      setContent('');
      setContentAr('');
    } catch (err: any) {
      setError(err.message || 'Failed to publish article');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lang === 'ar' ? 'نشر مقال جديد في قاعدة المعرفة' : 'Publish Knowledge Base Article'}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-sans">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label={lang === 'ar' ? 'عنوان المقال بالإنجليزية' : 'Article Title (English)'}
            placeholder="e.g. How to Connect WhatsApp Business API"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
          />
          <Input
            label={lang === 'ar' ? 'عنوان المقال بالعربية' : 'Article Title (Arabic)'}
            placeholder="مثال: كيفية ربط واتساب للأعمال عبر API"
            value={titleAr}
            onChange={(e) => setTitleAr(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="URL Slug"
            placeholder="connect-whatsapp-api"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
          <Select
            label={lang === 'ar' ? 'القسم / التصنيف' : 'Category'}
            value={category}
            onChange={(val) => setCategory(val)}
            options={[
              {
                value: 'Getting Started',
                label: lang === 'ar' ? 'البدء السريع (Getting Started)' : 'Getting Started'
              },
              {
                value: 'API & Integrations',
                label: lang === 'ar' ? 'واجهات البرمجة والربط (API & Integrations)' : 'API & Integrations'
              },
              {
                value: 'Account & Billing',
                label: lang === 'ar' ? 'الحسابات والاشتراكات (Account & Billing)' : 'Account & Billing'
              },
              {
                value: 'Troubleshooting',
                label: lang === 'ar' ? 'استكشاف الأخطاء وحلها (Troubleshooting)' : 'Troubleshooting'
              }
            ]}
          />
          <Input
            label={lang === 'ar' ? 'الوسوم (مفصولة بفواصل)' : 'Tags (Comma separated)'}
            placeholder="WhatsApp, API, Integration"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gold-300 uppercase tracking-wider mb-1.5 font-brand">
            {lang === 'ar' ? 'المحتوى والشرح بالإنجليزية' : 'Content (English)'}
          </label>
          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Detailed guide steps, explanations, or FAQ solution in English..."
            className="w-full bg-navy-950 border border-navy-800 focus:border-gold-500/50 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gold-300 uppercase tracking-wider mb-1.5 font-brand">
            {lang === 'ar' ? 'المحتوى والشرح بالعربية' : 'Content (Arabic)'}
          </label>
          <textarea
            rows={4}
            value={contentAr}
            onChange={(e) => setContentAr(e.target.value)}
            placeholder="شرح الخطوات التفصيلية وحل المشكلة باللغة العربية..."
            className="w-full bg-navy-950 border border-navy-800 focus:border-gold-500/50 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 outline-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-navy-800 font-sans">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            size="sm"
            className="border-navy-700"
          >
            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            size="sm"
            className="bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold"
          >
            {lang === 'ar' ? 'نشر المقال' : 'Publish Article'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
