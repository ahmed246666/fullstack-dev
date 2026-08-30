import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { AppShell } from '@/components/layout/AppShell';
import '../globals.css';

export const metadata: Metadata = {
  title: 'AZM Customer Support CRM | Enterprise Platform',
  description:
    'Full-stack Customer Support CRM platform with Customer 360, Omnichannel Tickets, SLA Automation, Knowledge Base & AI Copilot in Arabic & English.'
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased font-sans">
        <AppShell initialLocale={locale as any}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
