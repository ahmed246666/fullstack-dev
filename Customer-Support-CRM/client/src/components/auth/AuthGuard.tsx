'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAgent } from '@/context/AgentContext';
import { ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/Button';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoadingAuth, isAdmin, currentAgent } = useAgent();
  const { lang } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  // Strip locale prefix (e.g. /en/login -> /login)
  const pathWithoutLocale = pathname
    ? pathname.replace(/^\/(en|ar)/, '') || '/'
    : '/';

  const isPublicRoute =
    pathWithoutLocale === '/login' ||
    pathWithoutLocale === '/portal' ||
    pathWithoutLocale.startsWith('/portal/');

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated && !isPublicRoute) {
      router.push(`/${lang}/login`);
    }
  }, [isAuthenticated, isLoadingAuth, isPublicRoute, router, lang]);

  // Admin-only Route Check for /analytics
  if (pathWithoutLocale.startsWith('/analytics') && !isAdmin && isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="glass-panel p-8 max-w-md w-full text-center space-y-4 border border-rose-500/30">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">
            {lang === 'ar' ? 'صلاحيات غير كافية' : 'Access Restricted: Admin Only'}
          </h2>
          <p className="text-xs text-slate-400">
            {lang === 'ar'
              ? 'لوحة التحليلات التنفيذية مخصصة للمدراء فقط. تم تسجيل حسابك بصلاحية وكيل دعم فني.'
              : `Your account (${currentAgent.email}) has role ${currentAgent.role}. The Executive Analytics dashboard requires ADMIN privileges.`}
          </p>
          <div className="pt-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/${lang}/workspace`)}
              className="text-xs border-navy-700 hover:border-gold-500/50"
            >
              {lang === 'ar' ? 'العودة إلى مساحة العمل' : 'Go to Agent Workspace'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
