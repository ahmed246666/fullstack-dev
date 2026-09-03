'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/queryClient';
import { LanguageProvider, Language } from '@/context/LanguageContext';
import { AgentProvider } from '@/context/AgentContext';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SLABreachBanner } from '@/components/sla/SLABreachBanner';
import { ToastContainer } from '@/components/ui/Toast';

interface AppShellProps {
  children: React.ReactNode;
  initialLocale?: Language;
  dir?: 'ltr' | 'rtl';
}

export function AppShell({ children, initialLocale }: AppShellProps) {
  const [queryClient] = useState(() => getQueryClient());
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isPublicStandalone =
    pathname?.endsWith('/login') ||
    pathname === '/login' ||
    pathname?.includes('/portal');

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider initialLocale={initialLocale}>
        <AgentProvider>
          <AuthGuard>
            {isPublicStandalone ? (
              <div className="min-h-screen bg-navy-950 text-slate-100">{children}</div>
            ) : (
              <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-gold-500 selection:text-navy-950">
                <Sidebar
                  isOpen={isMobileSidebarOpen}
                  onClose={() => setIsMobileSidebarOpen(false)}
                />
                <div className="flex-1 flex flex-col min-w-0">
                  <Header
                    onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
                  />
                  <main className="flex-1 p-6 sm:p-8 md:p-10 lg:p-12 max-w-7xl w-full mx-auto animate-in fade-in duration-200 space-y-8">
                    <SLABreachBanner />
                    {children}
                  </main>
                </div>
              </div>
            )}
            <ToastContainer />
          </AuthGuard>
        </AgentProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
