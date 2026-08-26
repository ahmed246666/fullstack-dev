export interface SentimentResult {
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'FRUSTRATED';
  confidence: number;
  label: string;
  labelAr: string;
  emoji: string;
  color: string;
  urgencyRecommended: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  keyPhrases: string[];
}

export interface SummaryResult {
  executiveSummary: string;
  executiveSummaryAr: string;
  customerImpact: string;
  customerImpactAr: string;
  suggestedAction: string;
  suggestedActionAr: string;
}

export const aiCopilot = {
  analyzeSentiment(title: string, description: string): SentimentResult {
    const text = `${title} ${description}`.toLowerCase();

    // Frustrated / Critical Signals
    if (
      text.includes('timeout') ||
      text.includes('critical') ||
      text.includes('down') ||
      text.includes('production') ||
      text.includes('failure') ||
      text.includes('urgent') ||
      text.includes('عاجل') ||
      text.includes('فشل') ||
      text.includes('تعطل') ||
      text.includes('مشكلة خطيرة')
    ) {
      return {
        sentiment: 'FRUSTRATED',
        confidence: 94,
        label: 'Frustrated / Urgent Escalation',
        labelAr: 'مستاء / تصعيد عاجل',
        emoji: '🚨',
        color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
        urgencyRecommended: 'URGENT',
        keyPhrases: ['Production Impact', 'Critical SLA Risk', 'Requires Immediate Lead Action']
      };
    }

    // Negative / Problem Signals
    if (
      text.includes('error') ||
      text.includes('issue') ||
      text.includes('discrepancy') ||
      text.includes('mismatch') ||
      text.includes('fail') ||
      text.includes('خطأ') ||
      text.includes('عدم تطابق') ||
      text.includes('خلل')
    ) {
      return {
        sentiment: 'NEGATIVE',
        confidence: 88,
        label: 'Negative / Blocked Work',
        labelAr: 'سلبي / تعثر في العمليات',
        emoji: '⚠️',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        urgencyRecommended: 'HIGH',
        keyPhrases: ['Technical Blocker', 'Billing Discrepancy', 'Follow-up Needed']
      };
    }

    // Positive / Gratitude Signals
    if (
      text.includes('thank') ||
      text.includes('great') ||
      text.includes('resolved') ||
      text.includes('excellent') ||
      text.includes('شكراً') ||
      text.includes('ممتاز') ||
      text.includes('رائع')
    ) {
      return {
        sentiment: 'POSITIVE',
        confidence: 96,
        label: 'Positive / Satisfied',
        labelAr: 'إيجابي / راضٍ',
        emoji: '✨',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        urgencyRecommended: 'LOW',
        keyPhrases: ['High Satisfaction', 'Appreciation Expressed', 'Ready to Close']
      };
    }

    // Default Neutral / Inquiry
    return {
      sentiment: 'NEUTRAL',
      confidence: 82,
      label: 'Neutral / General Inquiry',
      labelAr: 'محايد / استفسار عام',
      emoji: 'ℹ️',
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      urgencyRecommended: 'MEDIUM',
      keyPhrases: ['Informational Query', 'Configuration Request', 'Standard Queue']
    };
  },

  summarizeTicket(ticket: any): SummaryResult {
    const title = ticket.title || '';
    const customerName = ticket.customer?.name || 'Customer';

    return {
      executiveSummary: `${customerName} reported an inquiry regarding "${title}".`,
      executiveSummaryAr: `قام العميل ${ticket.customer?.nameAr || customerName} برفع استفسار بخصوص "${title}".`,
      customerImpact: `Operational workflow affected on channel ${ticket.channel} with priority ${ticket.priority}.`,
      customerImpactAr: `تأثرت سير العمليات عبر قناة ${ticket.channel} وبأولوية ${ticket.priority}.`,
      suggestedAction:
        'Verify system telemetry logs, apply verified knowledge base procedures, and send confirmation.',
      suggestedActionAr:
        'التحقق من سجلات النظام وتطبيق خطوات الحل المعتمدة من قاعدة المعرفة وإرسال التأكيد للعميل.'
    };
  },

  generateAIDraft(
    ticket: any,
    tone: 'professional' | 'empathetic' | 'technical',
    lang: 'en' | 'ar'
  ): string {
    const customerName =
      lang === 'ar'
        ? ticket.customer?.nameAr || ticket.customer?.name || 'عزيزي العميل'
        : ticket.customer?.name || 'Valued Customer';
    const title = ticket.title || '';

    if (lang === 'ar') {
      if (tone === 'empathetic') {
        return `مرحباً ${customerName}،\n\nنقدّر تواصلك معنا ونعتذر بصدق عن أي إزعاج تسببت به هذه المسألة بخصوص "${title}".\n\nفريق الدعم الفني يعمل حالياً بأولوية قصوى لفحص الحالة وتطبيق الحل الجذري في أسرع وقت.\n\nسنقوم بإعلامك فور الانتهاء من المعالجة مباشرة.`;
      }
      if (tone === 'technical') {
        return `مرحباً ${customerName}،\n\nتم استلام البلاغ رقم ${ticket.ticketNumber} المتعلق بـ "${title}".\n\nتم فحص السجلات الفنية وتأكيد حالة الخدمة. جاري تنفيذ الإجراءات التصحيحية وربط التحديث مع السجلات المركزية.\n\nيرجى إعادة المحاولة وموافاتنا بالنتيجة في حال استمرار المشكلة.`;
      }
      // Professional default
      return `مرحباً ${customerName}،\n\nشكراً لتواصلك مع فريق دعم عزم بخصوص "${title}".\n\nيسعدنا إبلاغك بأننا قمنا بمراجعة طلبك وبدأنا العمل على إنجازه وفقاً لأعلى معايير الجودة واتفاقية مستوى الخدمة (SLA).\n\nيسعدنا الرد على أي استفسار إضافي لديك.`;
    } else {
      if (tone === 'empathetic') {
        return `Dear ${customerName},\n\nThank you for contacting AZM Support. We truly apologize for any inconvenience caused regarding "${title}".\n\nOur engineering team is actively investigating this with highest priority to ensure seamless operation.\n\nWe will update you as soon as the verification is finalized.`;
      }
      if (tone === 'technical') {
        return `Hello ${customerName},\n\nRegarding ticket ${ticket.ticketNumber} ("${title}"):\n\nOur telemetry confirms the reported state. Corrective patches and configuration checks have been dispatched across the gateway cluster.\n\nPlease verify operation on your end and let us know if any anomalies persist.`;
      }
      // Professional default
      return `Dear ${customerName},\n\nThank you for reaching out to AZM Support regarding "${title}".\n\nWe have reviewed your request and our technical team is resolving it in compliance with your enterprise SLA tier.\n\nPlease let us know if you have any further questions!`;
    }
  }
};
