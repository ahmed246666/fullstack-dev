'use client';

import React, { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/queryClient';
import { LanguageProvider } from '@/context/LanguageContext';
import { AgentProvider } from '@/context/AgentContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SLABreachBanner } from '@/components/sla/SLABreachBanner';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AgentProvider>
          <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Header />
              <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
                <SLABreachBanner />
                {children}
              </main>
            </div>
          </div>
        </AgentProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
