'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  X,
  Bot,
  User,
  ArrowRight,
  ExternalLink,
  Loader2,
  Ticket,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedArticles?: Array<{ id: string; title: string; titleAr?: string | null; slug: string }>;
  canEscalate?: boolean;
}

interface PortalChatbotWidgetProps {
  onEscalateToTicket?: (initialMessage: string) => void;
}

export function PortalChatbotWidget({ onEscalateToTicket }: PortalChatbotWidgetProps) {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialWelcome =
    lang === 'ar'
      ? 'مرحباً بك في المساعد الذكي لمنصة عزم! كيف يمكنني مساعدتك اليوم؟ يمكنك سؤالي عن الفوترة، إعدادات API، أو متابعة التذاكر.'
      : 'Welcome to AZM AI Smart Assistant! How can I help you today? Ask me about billing, API configurations, or ticket statuses.';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: initialWelcome,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const quickPrompts =
    lang === 'ar'
      ? [
          'كيف يمكنني إنشاء مفتاح API؟',
          'ما هي طرق الدفع المدعومة (سداد / STC Pay)؟',
          'كيف يتم احتساب اتفاقية مستوى الخدمة (SLA)؟'
        ]
      : [
          'How do I generate an API key?',
          'What payment methods are supported (SADAD / STC Pay)?',
          'How is SLA compliance calculated?'
        ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || isLoading) return;

    const userMsgId = Date.now().toString();
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      // Build history for backend AI
      const history = messages.slice(-4).map((m) => ({
        role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
        text: m.text
      }));

      const res = await api.chatWithPortalBot({
        message: messageText,
        history
      });

      if (res.success && res.data) {
        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: res.data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedArticles: res.data.suggestedArticles,
          canEscalate: res.data.escalateToTicket
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (err) {
      console.error('Chatbot error:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text:
          lang === 'ar'
            ? 'نعتذر، حدث خطأ مؤقت أثناء الاتصال بالمساعد الذكي. يمكنك فتح تذكرة دعم مباشرة.'
            : 'Sorry, a temporary issue occurred with the assistant. You can create a direct support ticket.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        canEscalate: true
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 rtl:left-6 rtl:right-auto z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-navy-950 font-bold shadow-2xl hover:shadow-gold-500/30 transition-all transform hover:scale-105"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-navy-950"></span>
            </span>
            <Bot className="w-5 h-5" />
            <span className="text-xs font-brand tracking-wide">
              {lang === 'ar' ? 'المساعد الذكي (AI)' : 'AI Support Assistant'}
            </span>
          </button>
        )}
      </div>

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 rtl:left-6 rtl:right-auto z-50 w-96 max-w-[calc(100vw-2rem)] h-[540px] flex flex-col glass-panel bg-navy-950/95 border border-gold-500/40 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 font-sans">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-navy-900 border-b border-gold-500/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xs text-white">
                    {lang === 'ar' ? 'مساعد عزم الذكي' : 'AZM Smart Assistant'}
                  </h3>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                    ONLINE
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  {lang === 'ar'
                    ? 'مدعوم بالذكاء الاصطناعي وقاعدة المعرفة'
                    : 'Powered by AI & Knowledge Base'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: 'welcome-reset',
                      sender: 'bot',
                      text: initialWelcome,
                      timestamp: new Date().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    }
                  ])
                }
                title={lang === 'ar' ? 'إعادة تعيين المحادثة' : 'Reset Conversation'}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-navy-800 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-navy-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-3 rounded-2xl ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-gold-600 to-amber-600 text-navy-950 font-medium rounded-br-none rtl:rounded-bl-none rtl:rounded-br-2xl'
                      : 'bg-navy-900 border border-navy-750 text-slate-100 rounded-bl-none rtl:rounded-br-none rtl:rounded-bl-2xl shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{m.text}</p>

                  {/* Suggested Knowledge Articles */}
                  {m.suggestedArticles && m.suggestedArticles.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-navy-800 space-y-1">
                      <div className="text-[10px] font-bold text-gold-400 uppercase tracking-wider">
                        {lang === 'ar' ? 'مقالات ذات صلة:' : 'Relevant Articles:'}
                      </div>
                      {m.suggestedArticles.map((art) => (
                        <a
                          key={art.id}
                          href={`/knowledge-base?search=${encodeURIComponent(art.title)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-1.5 rounded-lg bg-navy-800/80 hover:bg-navy-750 text-slate-200 hover:text-white transition-colors text-[11px]"
                        >
                          <span className="truncate pr-1 rtl:pl-1 rtl:pr-0">
                            {lang === 'ar' && art.titleAr ? art.titleAr : art.title}
                          </span>
                          <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Escalation CTA */}
                  {m.canEscalate && onEscalateToTicket && (
                    <div className="mt-2.5 pt-2 border-t border-navy-800">
                      <button
                        onClick={() => {
                          onEscalateToTicket(m.text);
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 border border-gold-500/40 text-gold-300 font-bold text-[11px] transition-colors"
                      >
                        <Ticket className="w-3 h-3 text-gold-400" />
                        <span>
                          {lang === 'ar' ? 'فتح تذكرة دعم رسميّة' : 'Escalate to Support Ticket'}
                        </span>
                      </button>
                    </div>
                  )}

                  <span className="block text-[9px] text-slate-400 mt-1 text-right rtl:text-left font-mono opacity-80">
                    {m.timestamp}
                  </span>
                </div>
                {m.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-gold-400 p-2 text-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{lang === 'ar' ? 'المساعد الذكي يكتب...' : 'AI Assistant is typing...'}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Question Chips */}
          <div className="px-3 py-1.5 bg-navy-900/60 border-t border-navy-800 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="shrink-0 text-[10.5px] px-2.5 py-1 rounded-full bg-navy-800 hover:bg-navy-750 border border-navy-700 text-slate-300 hover:text-white transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-navy-900 border-t border-gold-500/20 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                lang === 'ar'
                  ? 'اكتب استفسارك هنا...'
                  : 'Type your support inquiry...'
              }
              disabled={isLoading}
              className="flex-1 bg-navy-950 border border-navy-750 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-gold-500 transition-all font-sans"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-xl bg-gold-500 hover:bg-gold-400 disabled:opacity-40 text-navy-950 font-bold transition-colors"
            >
              <Send className="w-4 h-4 rtl:rotate-180" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
