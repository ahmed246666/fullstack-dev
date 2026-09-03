'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CustomerModal({ isOpen, onClose, onSuccess }: CustomerModalProps) {
  const { lang, t } = useLanguage();
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
      title={lang === 'ar' ? 'إضافة ملف عميل جديد' : 'Add New Customer Profile'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-sans">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label={lang === 'ar' ? 'الاسم بالإنجليزية' : 'Full Name (English)'}
            placeholder={lang === 'ar' ? 'مثال: Tariq Al-Otaibi' : 'e.g. Tariq Al-Otaibi'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label={lang === 'ar' ? 'الاسم بالعربية' : 'Full Name (Arabic)'}
            placeholder={lang === 'ar' ? 'مثال: طارق العتيبي' : 'e.g. طارق العتيبي'}
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            type="email"
            label={lang === 'ar' ? 'البريد الإلكتروني للعمل' : 'Work Email'}
            placeholder="tariq@client.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="tel"
            label={lang === 'ar' ? 'رقم الهاتف المباشر' : 'Direct Phone Number'}
            placeholder="+966 50 123 4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label={lang === 'ar' ? 'اسم الشركة / المؤسسة' : 'Company / Organization'}
            placeholder={lang === 'ar' ? 'مثال: شركة الرياض للتقنية' : 'e.g. Riyadh Tech Corp'}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <Select
            label={lang === 'ar' ? 'باقة خدمة العميل (Tier)' : 'Service Level Tier'}
            value={tier}
            onChange={(val) => setTier(val)}
            options={[
              { value: 'STANDARD', label: t('tier_STANDARD') },
              { value: 'VIP', label: t('tier_VIP') },
              { value: 'ENTERPRISE', label: t('tier_ENTERPRISE') }
            ]}
          />
        </div>

        <Input
          label={lang === 'ar' ? 'رابط صورة الملف الشخصي (اختياري)' : 'Avatar Image URL (Optional)'}
          placeholder="https://images.unsplash.com/..."
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-navy-800 flex-wrap">
          <Button type="button" variant="outline" onClick={onClose} size="sm">
            {t('cancel')}
          </Button>
          <Button type="submit" isLoading={isLoading} size="sm">
            {lang === 'ar' ? 'حفظ ملف العميل' : 'Save Customer Profile'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
