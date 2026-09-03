'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useQuery } from '@tanstack/react-query';
import { X, ShieldCheck, Clock, Save, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { PriorityBadge } from '@/components/ui/Badge';
import { toast } from '@/components/ui/Toast';

interface SLAPolicyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SLAPolicyDrawer({ isOpen, onClose }: SLAPolicyDrawerProps) {
  const { lang, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['sla-policies'],
    queryFn: () => api.getSLAPolicies(),
    enabled: isOpen
  });

  const [editingPolicy, setEditingPolicy] = useState<{
    [key: string]: { response: number; resolution: number };
  }>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKeys, setSavedKeys] = useState<{ [key: string]: boolean }>({});

  if (!isOpen || !mounted) return null;

  const policies = data?.data || [
    { priority: 'URGENT', responseTimeHours: 1, resolutionTimeHours: 4 },
    { priority: 'HIGH', responseTimeHours: 2, resolutionTimeHours: 8 },
    { priority: 'MEDIUM', responseTimeHours: 4, resolutionTimeHours: 24 },
    { priority: 'LOW', responseTimeHours: 8, resolutionTimeHours: 48 }
  ];

  const handleUpdate = async (priority: string) => {
    const current = editingPolicy[priority];
    if (!current) return;

    try {
      setSavingKey(priority);
      await api.updateSLAPolicy(priority, {
        responseTimeHours: current.response,
        resolutionTimeHours: current.resolution
      });

      // Clear the modified state for this priority so the button disappears
      setEditingPolicy((prev) => {
        const next = { ...prev };
        delete next[priority];
        return next;
      });

      // Show temporary saved indicator
      setSavedKeys((prev) => ({ ...prev, [priority]: true }));
      setTimeout(() => {
        setSavedKeys((prev) => {
          const next = { ...prev };
          delete next[priority];
          return next;
        });
      }, 2500);

      refetch();
      toast.success(
        lang === 'ar' ? 'تم حفظ وتحديث سياسة SLA بنجاح' : 'SLA policy targets updated',
        lang === 'ar' ? 'محرك SLA' : 'SLA Engine'
      );
    } catch (err: any) {
      toast.error(
        err.message || (lang === 'ar' ? 'فشل تحديث سياسة SLA' : 'Failed to update policy'),
        lang === 'ar' ? 'خطأ' : 'Error'
      );
    } finally {
      setSavingKey(null);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[999999] overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 rtl:left-0 rtl:right-auto w-full max-w-full sm:max-w-md flex z-[999999]">
        <div className="w-full h-full glass-panel bg-navy-950/95 border-l rtl:border-r rtl:border-l-0 border-gold-500/30 p-4 sm:p-6 flex flex-col justify-between shadow-2xl overflow-y-auto animate-in slide-in-from-right rtl:slide-in-from-left duration-200">
          <div className="space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-navy-800 gap-3">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2 font-brand text-gold-300">
                  <ShieldCheck className="w-5 h-5 text-gold-400 shrink-0" />
                  <span>{lang === 'ar' ? 'إعدادات سياسات SLA' : 'SLA Policy Engine Settings'}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-sans">
                  {lang === 'ar'
                    ? 'تحديد الحدود الزمنية القصوى للرد الأول والحل النهائي لكل مستوى أولوية.'
                    : 'Configure maximum allowed first response and final resolution target hours.'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-navy-900 shrink-0 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoading ? (
              <div className="py-12 text-center text-xs text-slate-400 animate-pulse font-sans">
                {lang === 'ar' ? 'جاري تحميل سياسات SLA...' : 'Loading SLA policies...'}
              </div>
            ) : (
              <div className="space-y-4 font-sans">
                {policies.map((p: any) => {
                  const currentResponse =
                    editingPolicy[p.priority]?.response ?? p.responseTimeHours;
                  const currentResolution =
                    editingPolicy[p.priority]?.resolution ?? p.resolutionTimeHours;

                  const isModified =
                    editingPolicy[p.priority] !== undefined &&
                    (editingPolicy[p.priority].response !== p.responseTimeHours ||
                      editingPolicy[p.priority].resolution !== p.resolutionTimeHours);

                  const isSaved = !!savedKeys[p.priority];

                  return (
                    <div
                      key={p.priority}
                      className="p-4 rounded-2xl bg-navy-900/90 border border-navy-800 space-y-3 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <PriorityBadge priority={p.priority} />

                        {isModified ? (
                          <Button
                            size="sm"
                            isLoading={savingKey === p.priority}
                            onClick={() => handleUpdate(p.priority)}
                            className="text-xs py-1.5 px-3 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold shadow-md shadow-gold-500/20 active:scale-95"
                          >
                            <Save className="w-3.5 h-3.5 shrink-0" />
                            <span>{lang === 'ar' ? 'حفظ التعديل' : 'Save'}</span>
                          </Button>
                        ) : isSaved ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg animate-in fade-in duration-200">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>{lang === 'ar' ? 'تم الحفظ' : 'Saved'}</span>
                          </span>
                        ) : null}
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-gold-300/80 mb-1 font-brand">
                            {lang === 'ar' ? 'الرد الأول (بالساعات)' : 'First Response (Hours)'}
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="72"
                            value={currentResponse}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setEditingPolicy((prev) => ({
                                ...prev,
                                [p.priority]: {
                                  response: val,
                                  resolution: currentResolution
                                }
                              }));
                            }}
                            className="w-full bg-navy-950 border border-navy-800 focus:border-gold-500/50 rounded-xl px-3 py-1.5 text-xs text-slate-100 font-mono focus:ring-1 focus:ring-gold-500/30 transition-all outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-gold-300/80 mb-1 font-brand">
                            {lang === 'ar' ? 'الحل النهائي (بالساعات)' : 'Resolution Target (Hours)'}
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="168"
                            value={currentResolution}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setEditingPolicy((prev) => ({
                                ...prev,
                                [p.priority]: {
                                  response: currentResponse,
                                  resolution: val
                                }
                              }));
                            }}
                            className="w-full bg-navy-950 border border-navy-800 focus:border-gold-500/50 rounded-xl px-3 py-1.5 text-xs text-slate-100 font-mono focus:ring-1 focus:ring-gold-500/30 transition-all outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-navy-800 flex justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-xs"
            >
              {lang === 'ar' ? 'إغلاق' : 'Close'}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
