'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Plus, Search, Building2, Mail, Phone, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TierBadge } from '@/components/ui/Badge';

export default function CustomersPage() {
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [tier, setTier] = useState('ALL');

  const { data, isLoading } = useQuery({
    queryKey: ['customers', search, tier],
    queryFn: () => api.getCustomers({ search, tier })
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            <span>{t('navCustomers')}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Directory of customer profiles, contact details, company tiers, and interaction history.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 rtl:right-3.5 rtl:left-auto top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, company, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2 text-xs text-slate-100 outline-none focus:border-purple-500"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {['ALL', 'ENTERPRISE', 'VIP', 'STANDARD'].map((tierOption) => (
              <button
                key={tierOption}
                onClick={() => setTier(tierOption)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                  tier === tierOption ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {tierOption}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Customers List Grid */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-400 animate-pulse">Loading customer directory...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data?.data || []).map((customer: any) => (
            <Card key={customer.id} className="glass-panel-hover p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img src={customer.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} alt={customer.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-500/20" />
                    <div>
                      <h4 className="font-bold text-slate-100 text-sm">{lang === 'ar' ? customer.nameAr || customer.name : customer.name}</h4>
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
                <span className="text-slate-400 font-medium">{customer._count?.tickets || 0} Tickets</span>
                <span className="text-purple-400 font-semibold flex items-center gap-1">
                  <span>360 Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
