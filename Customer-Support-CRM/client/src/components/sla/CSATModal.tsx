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
    'Very Dissatisfied / غير راضٍ تماماً',
    'Dissatisfied / غير راضٍ',
    'Neutral / محايد',
    'Satisfied / راضٍ',
    'Excellent Service / خدمة ممتازة ورائعة'
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lang === 'ar' ? 'تقييم رضا العميل (CSAT)' : 'Customer Satisfaction Survey (CSAT)'}
      maxWidth="md"
    >
      {isSuccess ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Thank You for Your Feedback!</h3>
          <p className="text-xs text-slate-400">
            Your CSAT rating has been saved and factored into CRM quality metrics.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
            <div className="font-bold text-indigo-400 font-mono mb-1">{ticket.ticketNumber}</div>
            <div className="font-semibold text-slate-100">{ticket.title}</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Customer: {ticket.customer?.name} ({ticket.customer?.company})
            </div>
          </div>

          {/* Star Rating Selector */}
          <div className="text-center space-y-2 py-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              {lang === 'ar'
                ? 'كيف تقيّم تجربتك مع فريق الدعم؟'
                : 'How would you rate the resolution quality?'}
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
                          ? 'fill-amber-400 text-amber-400 drop-shadow-md'
                          : 'text-slate-700 hover:text-slate-500'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <p className="text-xs font-semibold text-amber-400 h-4">
              {ratingDescriptions[(hoverRating !== null ? hoverRating : rating) - 1]}
            </p>
          </div>

          {/* Customer Comment Textarea */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Additional Feedback / ملاحظات إضافية
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what went well or what could be improved..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button type="button" variant="outline" onClick={onClose} size="sm">
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              size="sm"
              className="bg-amber-600 hover:bg-amber-500 text-white"
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Submit Rating</span>
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
