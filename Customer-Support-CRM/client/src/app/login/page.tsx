'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Globe,
  Headphones,
  CheckCircle2,
  Building2,
  Crown
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAgent, DEFAULT_AGENTS } from '@/context/AgentContext';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const { lang, toggleLanguage, t } = useLanguage();
  const { login, currentAgent } = useAgent();
  const [email, setEmail] = useState('admin@azmsquad.com');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(email);
      router.push('/');
    }, 600);
  };

  const handleQuickLogin = (agentId: string) => {
    setIsLoading(true);
    login(agentId);
    setTimeout(() => {
      router.push('/');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-navy-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(212,175,55,0.15),rgba(255,255,255,0))] text-slate-100 flex flex-col justify-between p-6 md:p-10 font-sans">
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-gold-600 via-gold-500 to-gold-400 text-navy-950 flex items-center justify-center font-extrabold text-xl shadow-lg shadow-gold-500/20 font-brand">
            عزم
          </div>
          <div>
            <h1 className="text-xl font-bold text-white font-brand flex items-center gap-1.5">
              <span>AZM CRM Enterprise</span>
              <Crown className="w-4 h-4 text-gold-400" />
            </h1>
            <p className="text-xs text-gold-200/70">منصة خدمة العملاء والدعم الفني الذكية</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-navy-700 bg-navy-900/80 hover:border-gold-500/40 text-gold-300 text-xs font-semibold transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-gold-400" />
            <span>{lang === 'en' ? 'العربية' : 'English'}</span>
          </button>
          <Link href="/portal">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-navy-700 hover:border-gold-500/50 text-slate-300 hover:text-gold-200"
            >
              Customer Portal
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-8 space-y-6">
        <div className="glass-panel p-8 md:p-10 rounded-3xl border border-gold-500/20 shadow-2xl relative overflow-hidden space-y-6 bg-navy-900/90 backdrop-blur-xl">
          {/* Glowing Ambient Backdrop */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-semibold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
              <span>Enterprise RBAC Authentication</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white font-brand">
              {lang === 'ar' ? 'تسجيل دخول موظفي الدعم' : 'Support Portal Login'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'ar'
                ? 'قم بتسجيل الدخول للوصول إلى لوحة التحكم والتذاكر ومركز العملاء.'
                : 'Sign in to access your customer 360 queue, SLA engine, and AI copilot.'}
            </p>
          </div>

          {/* 1-Click Fast Profile Switcher / Quick Demo Login */}
          <div className="space-y-2 pt-2">
            <div className="text-[11px] uppercase tracking-wider font-bold text-gold-400 text-center">
              {lang === 'ar' ? 'تسجيل دخول سريع للتجربة (1-Click)' : '⚡ 1-Click Fast Test Sign-In'}
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {DEFAULT_AGENTS.slice(0, 2).map((agent) => (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => handleQuickLogin(agent.id)}
                  className="p-3 rounded-2xl border border-navy-750 bg-navy-850/80 hover:bg-navy-800 hover:border-gold-500/50 text-left rtl:text-right transition-all group flex items-center gap-2.5"
                >
                  <img
                    src={agent.avatarUrl}
                    alt={agent.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-gold-500/40"
                  />
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-white group-hover:text-gold-300 truncate">
                      {lang === 'ar' ? agent.nameAr : agent.name}
                    </div>
                    <div className="text-[10px] text-gold-400 font-mono">{agent.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-navy-750 w-full" />
            <span className="bg-navy-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider">
              {lang === 'ar' ? 'أو عبر البريد' : 'or email login'}
            </span>
            <div className="border-t border-navy-750 w-full" />
          </div>

          {/* Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gold-400" />
                <span>{lang === 'ar' ? 'البريد الإلكتروني المهني' : 'Work Email Address'}</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-gold-400" />
                <span>{lang === 'ar' ? 'كلمة المرور' : 'Password'}</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors font-mono"
                required
              />
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full py-3 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 text-navy-950 font-bold hover:opacity-95 shadow-lg shadow-gold-500/20 text-xs mt-2"
            >
              <span>{lang === 'ar' ? 'تسجيل الدخول إلى النظام' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </Button>
          </form>
        </div>

        {/* Public Portal Switcher Box */}
        <div className="text-center text-xs text-slate-400 space-y-1">
          <span>Are you a client looking to track a support ticket?</span>
          <div>
            <Link
              href="/portal"
              className="text-gold-400 hover:text-gold-300 font-bold hover:underline"
            >
              Go to Public Customer Self-Service Portal →
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-navy-850">
        <span>© 2026 AZM Squad Enterprise CRM • All Rights Reserved</span>
        <div className="flex items-center gap-4 text-gold-400/70">
          <span>SLA Target: 99.9%</span>
          <span>•</span>
          <span>Bilingual Saudi Gov Edition</span>
        </div>
      </div>
    </div>
  );
}
