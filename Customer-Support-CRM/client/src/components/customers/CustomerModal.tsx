'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CustomerModal({ isOpen, onClose, onSuccess }: CustomerModalProps) {
  const { lang } = useLanguage();
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [tier, setTier] = useState('STANDARD');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    try {
      setIsLoading(true);
      setError('');
      await api.createCustomer({
        name: name.trim(),
        nameAr: nameAr.trim() || name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        company: company.trim() || null,
        tier,
        avatarUrl:
          avatarUrl.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      });
      onSuccess();
      onClose();
      // Reset form
      setName('');
      setNameAr('');
      setEmail('');
      setPhone('');
      setCompany('');
      setTier('STANDARD');
      setAvatarUrl('');
    } catch (err: any) {
      setError(err.message || 'Failed to create customer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lang === 'ar' ? 'إضافة عميل جديد' : 'Add New Customer'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Full Name (English)"
            placeholder="e.g. Tariq Al-Otaibi"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="الاسم الكامل (بالعربية)"
            placeholder="مثال: طارق العتيبي"
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            type="email"
            label="Work Email"
            placeholder="tariq@client.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="tel"
            label="Phone Number"
            placeholder="+966 50 123 4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Company Name"
            placeholder="e.g. Riyadh Tech Corp"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Service Tier
            </label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none"
            >
              <option value="STANDARD">Standard Tier</option>
              <option value="VIP">VIP Priority (2h SLA)</option>
              <option value="ENTERPRISE">Enterprise Dedicated (1h SLA)</option>
            </select>
          </div>
        </div>

        <Input
          label="Avatar Image URL (Optional)"
          placeholder="https://images.unsplash.com/..."
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose} size="sm">
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} size="sm">
            Save Customer Profile
          </Button>
        </div>
      </form>
    </Modal>
  );
}
