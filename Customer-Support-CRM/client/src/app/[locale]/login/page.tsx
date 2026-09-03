'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Globe,
  Crown,
  UserCheck
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAgent, DEFAULT_AGENTS } from '@/context/AgentContext';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect');
  const { lang, toggleLanguage, t } = useLanguage();
  const { login } = useAgent();
  const [email, setEmail] = useState('admin@azmsquad.com');
  const [password, setPassword] = useState('Password123!');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePerformLogin = async (targetEmail: string, targetPass: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await login(targetEmail, targetPass);
      const destination = redirectTarget || `/${lang}`;
      router.push(destination);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await handlePerformLogin(email, password);
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
            <p className="text-xs text-gold-200/70">
              {lang === 'ar' ? 'منصة خدمة العملاء والدعم الفني الذكية' : 'Enterprise Customer Support Platform'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-navy-750 bg-navy-900 text-xs font-semibold text-gold-300 hover:text-gold-200 transition-colors font-brand shrink-0"
          >
            <Globe className="w-3.5 h-3.5 text-gold-400 shrink-0" />
            <span>{lang === 'en' ? 'العربية' : 'English'}</span>
          </button>
          <Link href={`/${lang}/portal`}>
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-navy-700 hover:border-gold-500/50 text-slate-300 hover:text-gold-200 shrink-0"
            >
              {lang === 'ar' ? 'بوابة العملاء' : 'Customer Portal'}
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

          {/* Quick 1-Click Demo Logins */}
          <div className="space-y-2 pt-1">
            <div className="text-[11px] font-bold text-gold-300 uppercase tracking-wider flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-gold-400" />
              <span>{lang === 'ar' ? 'الدخول السريع (حسابات تجريبية):' : 'Quick Demo Logins:'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {DEFAULT_AGENTS.map((agent) => (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => {
                    setEmail(agent.email);
                    setPassword('Password123!');
                    handlePerformLogin(agent.email, 'Password123!');
                  }}
                  className="p-2.5 rounded-xl border border-navy-800 bg-navy-950/80 hover:border-gold-500/40 text-left rtl:text-right transition-colors group"
                >
                  <div className="font-bold text-xs text-white group-hover:text-gold-300 truncate">
                    {lang === 'ar' ? agent.nameAr : agent.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{agent.role}</div>
                </button>
              ))}
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gold-400" />
                <span>{lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500 transition-colors font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
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
          <span>
            {lang === 'ar'
              ? 'هل أنت عميل تبحث عن متابعة تذكرة دعم؟'
              : 'Are you a client looking to track a support ticket?'}
          </span>
          <div>
            <Link
              href={`/${lang}/portal`}
              className="text-gold-400 hover:text-gold-300 font-bold hover:underline"
            >
              {lang === 'ar'
                ? 'الانتقال إلى بوابة الخدمة الذاتية للعملاء ←'
                : 'Go to Public Customer Self-Service Portal →'}
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
