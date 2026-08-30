'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import {
  Users,
  Plus,
  Search,
  Building2,
  Mail,
  Phone,
  ExternalLink,
  LayoutGrid,
  List
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TierBadge } from '@/components/ui/Badge';
import { CustomerDrawer } from '@/components/customers/CustomerDrawer';
import { CustomerModal } from '@/components/customers/CustomerModal';

export default function CustomersPage() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search') || '';
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState(urlSearch);

  useEffect(() => {
    if (urlSearch) setSearch(urlSearch);
  }, [urlSearch]);

  const [tier, setTier] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Drawer & Modal State
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['customers-list', search, tier],
    queryFn: () => api.getCustomers({ search, tier })
  });

  const customers = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2 font-brand">
            <Users className="w-6 h-6 text-gold-400" />
            <span>{t('customerTitle')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t('customerSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-navy-900 border border-navy-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-gold-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title={lang === 'ar' ? 'عرض شبكي' : 'Grid View'}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'table'
                  ? 'bg-gold-500 text-navy-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={lang === 'ar' ? 'عرض جدولي' : 'Table View'}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Button
            onClick={() => setIsCreateOpen(true)}
            className="text-xs bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold hover:opacity-95 shadow-lg shadow-gold-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>{t('customerAddBtn')}</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 border-gold-500/20 bg-navy-900/80">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 rtl:right-3.5 rtl:left-auto top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={t('customerSearchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-navy-950 border border-navy-800 rounded-xl pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2 text-xs text-slate-100 outline-none focus:border-gold-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {['ALL', 'ENTERPRISE', 'VIP', 'STANDARD'].map((tierOption) => (
              <button
                key={tierOption}
                onClick={() => setTier(tierOption)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap ${
                  tier === tierOption
                    ? 'bg-gold-500 text-navy-950 border-gold-400 font-bold shadow-md shadow-gold-500/20'
                    : 'bg-navy-950 text-slate-300 border-navy-800 hover:text-white'
                }`}
              >
                {tierOption === 'ALL'
                  ? t('allTiers')
                  : tierOption === 'ENTERPRISE'
                  ? t('tier_ENTERPRISE')
                  : tierOption === 'VIP'
                  ? t('tier_VIP')
                  : t('tier_STANDARD')}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Directory Content */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-slate-400 animate-pulse">
          {lang === 'ar' ? 'جاري تحميل ملفات العملاء 360...' : 'Loading Customer 360 Profiles...'}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((customer: any) => (
            <Card
              key={customer.id}
              onClick={() => setSelectedCustomerId(customer.id)}
              className="glass-panel-hover p-5 flex flex-col justify-between cursor-pointer border-gold-500/20 bg-navy-900/80 group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        customer.avatarUrl ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                      }
                      alt={customer.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-gold-500/20 group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <h4 className="font-bold text-slate-100 text-sm group-hover:text-gold-300 transition-colors font-brand">
                        {lang === 'ar' ? customer.nameAr || customer.name : customer.name}
                      </h4>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-500" />
                        <span>{customer.company || (lang === 'ar' ? 'مستقل' : 'Independent')}</span>
                      </div>
                    </div>
                  </div>
                  <TierBadge tier={customer.tier} />
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 border-t border-navy-800 pt-3">
                  <div className="flex items-center gap-2 text-[11px]">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  {customer.phone && (
                    <div className="flex items-center gap-2 text-[11px]">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-navy-800 flex items-center justify-between text-xs font-brand">
                <span className="text-slate-400 font-medium">
                  {customer._count?.tickets || customer.tickets?.length || 0} {lang === 'ar' ? 'تذاكر' : 'Tickets'}
                </span>
                <span className="text-gold-400 font-semibold flex items-center gap-1 group-hover:underline">
                  <span>{lang === 'ar' ? 'الملف الشامل 360' : '360 Profile'}</span>
                  <ExternalLink className="w-3 h-3 rtl:rotate-180" />
                </span>
              </div>
            </Card>
          ))}
          {customers.length === 0 && (
            <div className="col-span-full py-16 text-center text-xs text-slate-500">
              {lang === 'ar'
                ? 'لم يتم العثور على عملاء يطابقون معايير البحث.'
                : 'No customers found matching your query.'}
            </div>
          )}
        </div>
      ) : (
        /* Table View */
        <Card className="border-gold-500/20 bg-navy-900/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="text-[11px] text-gold-300/80 uppercase border-b border-navy-800 bg-navy-950 font-brand">
                <tr>
                  <th className="px-4 py-3">{lang === 'ar' ? 'العميل' : 'Customer'}</th>
                  <th className="px-4 py-3">{lang === 'ar' ? 'الشركة' : 'Company'}</th>
                  <th className="px-4 py-3">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</th>
                  <th className="px-4 py-3">{lang === 'ar' ? 'الهاتف' : 'Phone'}</th>
                  <th className="px-4 py-3">{lang === 'ar' ? 'الفئة' : 'Tier'}</th>
                  <th className="px-4 py-3">{lang === 'ar' ? 'التذاكر' : 'Tickets'}</th>
                  <th className="px-4 py-3 text-right rtl:text-left">{lang === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60 font-sans">
                {customers.map((customer: any) => (
                  <tr
                    key={customer.id}
                    onClick={() => setSelectedCustomerId(customer.id)}
                    className="hover:bg-navy-850/70 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-100 flex items-center gap-2.5 font-brand">
                      <img
                        src={
                          customer.avatarUrl ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                        }
                        alt={customer.name}
                        className="w-7 h-7 rounded-xl object-cover"
                      />
                      <span>
                        {lang === 'ar' ? customer.nameAr || customer.name : customer.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{customer.company || '—'}</td>
                    <td className="px-4 py-3 text-slate-300 font-mono">{customer.email}</td>
                    <td className="px-4 py-3 text-slate-400 font-mono">{customer.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <TierBadge tier={customer.tier} />
                    </td>
                    <td className="px-4 py-3 font-bold text-gold-300">
                      {customer._count?.tickets || customer.tickets?.length || 0}
                    </td>
                    <td className="px-4 py-3 text-right rtl:text-left">
                      <button className="text-gold-400 hover:text-gold-300 font-semibold text-xs font-brand">
                        {lang === 'ar' ? 'عرض الملف' : 'Open 360'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Slide-over Customer 360 Profile Drawer */}
      <CustomerDrawer customerId={selectedCustomerId} onClose={() => setSelectedCustomerId(null)} />

      {/* Add New Customer Modal */}
      <CustomerModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
