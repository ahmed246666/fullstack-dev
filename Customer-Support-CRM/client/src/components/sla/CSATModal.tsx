'use client';

import React, { useState } from 'react';
import { Star, MessageSquare, ThumbsUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface CSATModalProps {
  isOpen: boolean;
  ticket: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function CSATModal({ isOpen, ticket, onClose, onSuccess }: CSATModalProps) {
  const { lang, t } = useLanguage();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!ticket) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.submitCSAT(ticket.id, {
        rating,
        feedback: feedback.trim() || undefined
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onSuccess();
        onClose();
      }, 1200);
    } catch (err: any) {
      alert(err.message || 'Failed to submit CSAT rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingDescriptions = [
    { en: 'Very Dissatisfied (1/5)', ar: 'غير راضٍ تماماً (1/5)' },
    { en: 'Dissatisfied (2/5)', ar: 'غير راضٍ (2/5)' },
    { en: 'Neutral (3/5)', ar: 'محايد (3/5)' },
    { en: 'Satisfied (4/5)', ar: 'راضٍ وممتاز (4/5)' },
    { en: 'Excellent & Outstanding (5/5)', ar: 'خدمة استثنائية ورائعة (5/5)' }
  ];

  const currentDescIndex = (hoverRating !== null ? hoverRating : rating) - 1;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        lang === 'ar' ? 'استطلاع رضا العميل (CSAT Score)' : 'Customer Satisfaction Survey (CSAT)'
      }
      maxWidth="md"
    >
      {isSuccess ? (
        <div className="py-8 text-center space-y-3 font-sans">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-brand text-gold-300">
            {lang === 'ar' ? 'شكراً جزيلاً لتقييمك!' : 'Thank You for Your Feedback!'}
          </h3>
          <p className="text-xs text-slate-400">
            {lang === 'ar'
              ? 'تم حفظ تقييمك بنجاح وإدراجه ضمن تقارير الجودة ورضا العملاء.'
              : 'Your CSAT rating has been saved and factored into CRM quality metrics.'}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 font-sans">
          <div className="p-3.5 rounded-2xl bg-navy-900/90 border border-navy-800 text-xs">
            <div className="font-bold text-gold-300 font-mono mb-1">{ticket.ticketNumber}</div>
            <div className="font-semibold text-white font-brand">{ticket.title}</div>
            <div className="text-[11px] text-slate-400 mt-1 font-sans">
              {lang === 'ar' ? 'العميل: ' : 'Customer: '}
              {lang === 'ar'
                ? ticket.customer?.nameAr || ticket.customer?.name
                : ticket.customer?.name}{' '}
              ({ticket.customer?.company || 'Enterprise'})
            </div>
          </div>

          {/* Star Rating Selector */}
          <div className="text-center space-y-2 py-2">
            <label className="block text-xs font-bold text-gold-300 uppercase tracking-wider font-brand">
              {lang === 'ar'
                ? 'كيف تقيّم جودة وسرعة حل طلبك؟'
                : 'How would you rate the resolution quality & speed?'}
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverRating !== null ? hoverRating : rating) >= star;

                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1.5 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        isFilled
                          ? 'fill-gold-400 text-gold-400 drop-shadow-md'
                          : 'text-navy-800 hover:text-gold-500/50'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <p className="text-xs font-semibold text-gold-300 h-4 font-brand">
              {ratingDescriptions[currentDescIndex]?.[lang === 'ar' ? 'ar' : 'en']}
            </p>
          </div>

          {/* Customer Comment Textarea */}
          <div className="space-y-1.5 font-sans">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-brand">
              {lang === 'ar'
                ? 'ملاحظات أو تعليقات إضافية (اختياري):'
                : 'Additional Feedback (Optional):'}
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={
                lang === 'ar'
                  ? 'أخبرنا برأيك حول الخدمة أو ما يمكن تحسينه...'
                  : 'Tell us what went well or what could be improved...'
              }
              className="w-full bg-navy-950 border border-navy-800 focus:border-gold-500/50 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all"
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
              isLoading={isSubmitting}
              size="sm"
              className="bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold"
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{lang === 'ar' ? 'إرسال التقييم' : 'Submit Rating'}</span>
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
