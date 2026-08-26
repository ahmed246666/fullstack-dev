import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'AZM Customer Support CRM | Enterprise Platform',
  description: 'Full-stack Customer Support CRM platform with Customer 360, Omnichannel Tickets, SLA Automation, Knowledge Base & AI Copilot in Arabic & English.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
