import { prisma } from '../db';

interface ChatbotResult {
  reply: string;
  suggestedArticles: Array<{ id: string; title: string; titleAr?: string | null; slug: string }>;
  escalateToTicket: boolean;
  confidenceScore: number;
}

export async function generateChatbotResponse(
  userMessage: string,
  history: Array<{ role: 'user' | 'model'; text: string }> = [],
  customerName?: string
): Promise<ChatbotResult> {
  const query = userMessage.trim();

  // 1. Fetch relevant Knowledge Base context
  const kbArticles = await prisma.knowledgeArticle.findMany({
    where: { isPublished: true },
    take: 6
  });

  const relevantArticles = kbArticles.filter((art) => {
    const qLower = query.toLowerCase();
    return (
      art.title.toLowerCase().includes(qLower) ||
      (art.titleAr && art.titleAr.includes(query)) ||
      art.content.toLowerCase().includes(qLower) ||
      (art.contentAr && art.contentAr.includes(query)) ||
      (art.tags && art.tags.toLowerCase().includes(qLower))
    );
  });

  const articlesToUse = relevantArticles.length > 0 ? relevantArticles : kbArticles.slice(0, 3);
  const kbContext = articlesToUse
    .map(
      (a) =>
        `[Article: ${a.title} (${a.category})]\nEN: ${a.content}\nAR: ${a.contentAr || ''}`
    )
    .join('\n\n');

  // 2. If GEMINI_API_KEY is available, call Gemini 1.5 Flash API
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (geminiApiKey && geminiApiKey.trim() !== '') {
    try {
      const systemInstruction = `You are "AZM AI Assistant" (مساعد عزم الذكي), an enterprise bilingual customer support agent for AZM Customer Support CRM.
Answer the customer politely and concisely in the language they used (Arabic or English).
Use the following Knowledge Base context when relevant:
${kbContext}

If the question is resolved by the Knowledge Base, explain the solution clearly.
If the customer expresses deep frustration, asks to speak to a human, or has a complex billing/system outage issue, offer to create a formal support ticket.`;

      const contents = [
        ...history.map((h) => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        })),
        {
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\nCustomer question: ${query}` }]
        }
      ];

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      });

      if (response.ok) {
        const data = await response.json();
        const candidateText =
          data.candidates?.[0]?.content?.parts?.[0]?.text || null;

        if (candidateText) {
          const isEscalation =
            query.toLowerCase().includes('agent') ||
            query.toLowerCase().includes('human') ||
            query.toLowerCase().includes('escalate') ||
            query.includes('موظف') ||
            query.includes('إنسان') ||
            query.includes('تصعيد');

          return {
            reply: candidateText.trim(),
            suggestedArticles: articlesToUse.map((a) => ({
              id: a.id,
              title: a.title,
              titleAr: a.titleAr,
              slug: a.slug
            })),
            escalateToTicket: isEscalation,
            confidenceScore: 0.95
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local semantic engine:', err);
    }
  }

  // 3. Fallback: Intelligent Local Semantic RAG
  const isArabic = /[\u0600-\u06FF]/.test(query);
  let reply = '';
  const topArticle = articlesToUse[0];

  if (topArticle) {
    if (isArabic) {
      reply = `أهلاً بك! بناءً على قاعدة معرفة عزم، إليك الحل المقترح:\n\n📌 **${topArticle.titleAr || topArticle.title}**\n${topArticle.contentAr || topArticle.content}\n\nهل ساعدك هذا الجواب، أم تفضل فتح تذكرة دعم فني لمتابعة الحالة مع أحد مسؤولي الدعم؟`;
    } else {
      reply = `Hello! Based on AZM Knowledge Base, here is the recommended resolution:\n\n📌 **${topArticle.title}**\n${topArticle.content}\n\nDid this help resolve your issue, or would you like to escalate this into an official support ticket?`;
    }
  } else {
    if (isArabic) {
      reply = `أهلاً بك في مركز دعم منصة عزم. شكراً لتواصلك معنا بخصوص "${query}". لم نتمكن من إيجاد حل مباشر في المقالات الشائعة، لذا نوصي بإنشاء تذكرة دعم فني ليقوم أحد مهندسي الدعم بمتابعتها وفق اتفاقية مستوى الخدمة (SLA).`;
    } else {
      reply = `Hello! Thank you for reaching out regarding "${query}". We could not find a direct automated guide, so we recommend opening a support ticket so our technical team can address it under your SLA policy.`;
    }
  }

  return {
    reply,
    suggestedArticles: articlesToUse.map((a) => ({
      id: a.id,
      title: a.title,
      titleAr: a.titleAr,
      slug: a.slug
    })),
    escalateToTicket: true,
    confidenceScore: 0.88
  };
}
