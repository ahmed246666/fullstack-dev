'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Plus,
  Search,
  Building2,
  Mail,
  Phone,
  ExternalLink,
  LayoutGrid,
  List,
  Layers,
  Sparkles,
  Ticket
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TierBadge } from '@/components/ui/Badge';
import { CustomerDrawer } from '@/components/customers/CustomerDrawer';
import { CustomerModal } from '@/components/customers/CustomerModal';

export default function CustomersPage() {
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState('');
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
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            <span>{t('navCustomers')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'ar'
              ? 'إدارة ملفات العملاء 360، السجل الزمني للتفاعلات، تصنيفات الخدمة وقنوات التواصل.'
              : 'Complete Customer 360 directory with interaction touchpoint timelines, tiers, and omnichannel activity.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Button onClick={() => setIsCreateOpen(true)} className="text-xs">
            <Plus className="w-4 h-4" />
            <span>{lang === 'ar' ? 'إضافة عميل' : 'Add Customer'}</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 rtl:right-3.5 rtl:left-auto top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={
                lang === 'ar'
                  ? 'ابحث بالاسم، الشركة، البريد أو الهاتف...'
                  : 'Search by name, company, email, phone...'
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2 text-xs text-slate-100 outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {['ALL', 'ENTERPRISE', 'VIP', 'STANDARD'].map((tierOption) => (
              <button
                key={tierOption}
                onClick={() => setTier(tierOption)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap ${
                  tier === tierOption
                    ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/25'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tierOption === 'ALL' ? (lang === 'ar' ? 'الكل' : 'ALL TIERS') : tierOption}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Directory Content */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-slate-400 animate-pulse">
          Loading Customer 360 Profiles...
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((customer: any) => (
            <Card
              key={customer.id}
              onClick={() => setSelectedCustomerId(customer.id)}
              className="glass-panel-hover p-5 flex flex-col justify-between cursor-pointer border-slate-800/80 group"
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
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-500/20 group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <h4 className="font-bold text-slate-100 text-sm group-hover:text-purple-300 transition-colors">
                        {lang === 'ar' ? customer.nameAr || customer.name : customer.name}
                      </h4>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-500" />
                        <span>{customer.company || 'Independent'}</span>
                      </div>
                    </div>
                  </div>
                  <TierBadge tier={customer.tier} />
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
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

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">
                  {customer._count?.tickets || customer.tickets?.length || 0} Tickets
                </span>
                <span className="text-purple-400 font-semibold flex items-center gap-1 group-hover:underline">
                  <span>360 Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </Card>
          ))}
          {customers.length === 0 && (
            <div className="col-span-full py-16 text-center text-xs text-slate-500">
              No customers found matching your query.
            </div>
          )}
        </div>
      ) : (
        /* Table View */
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="text-[11px] text-slate-400 uppercase border-b border-slate-800 bg-slate-900/40">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Tier</th>
                  <th className="px-4 py-3">Tickets</th>
                  <th className="px-4 py-3 text-right rtl:text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {customers.map((customer: any) => (
                  <tr
                    key={customer.id}
                    onClick={() => setSelectedCustomerId(customer.id)}
                    className="hover:bg-slate-900/60 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-100 flex items-center gap-2.5">
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
                    <td className="px-4 py-3 font-bold text-indigo-400">
                      {customer._count?.tickets || customer.tickets?.length || 0}
                    </td>
                    <td className="px-4 py-3 text-right rtl:text-left">
                      <button className="text-purple-400 hover:text-purple-300 font-semibold text-xs">
                        Open 360
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
