'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useQuery } from '@tanstack/react-query';
import { X, Clock, ShieldCheck, CheckCircle2, Save } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { PriorityBadge } from '@/components/ui/Badge';

interface SLAPolicyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SLAPolicyDrawer({ isOpen, onClose }: SLAPolicyDrawerProps) {
  const { lang } = useLanguage();
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
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to update policy');
    } finally {
      setSavingKey(null);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[999999] overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 rtl:left-0 rtl:right-auto max-w-full flex pl-10 rtl:pl-0 rtl:pr-10 z-[999999]">
        <div className="w-screen max-w-md glass-panel bg-navy-950/95 border-l rtl:border-r rtl:border-l-0 border-gold-500/30 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto animate-in slide-in-from-right rtl:slide-in-from-left duration-200">
          <div className="space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-navy-800">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2 font-brand text-gold-300">
                  <ShieldCheck className="w-5 h-5 text-gold-400" />
                  <span>{lang === 'ar' ? 'إعدادات سياسات SLA' : 'SLA Policy Engine Settings'}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-sans">
                  Configure first response and final resolution hour thresholds.
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-navy-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoading ? (
              <div className="py-12 text-center text-xs text-slate-400 animate-pulse font-sans">
                Loading SLA policies...
              </div>
            ) : (
              <div className="space-y-4 font-sans">
                {policies.map((p: any) => {
                  const currentResponse =
                    editingPolicy[p.priority]?.response ?? p.responseTimeHours;
                  const currentResolution =
                    editingPolicy[p.priority]?.resolution ?? p.resolutionTimeHours;
                  const isModified = editingPolicy[p.priority] !== undefined;

                  return (
                    <div
                      key={p.priority}
                      className="p-4 rounded-2xl bg-navy-900/90 border border-navy-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <PriorityBadge priority={p.priority} />
                        {isModified && (
                          <Button
                            size="sm"
                            isLoading={savingKey === p.priority}
                            onClick={() => handleUpdate(p.priority)}
                            className="text-[11px] py-1 px-2.5 h-auto bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold"
                          >
                            <Save className="w-3 h-3" />
                            <span>Save</span>
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-gold-300/80 mb-1">
                            First Response (Hours)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="72"
                            value={currentResponse}
                            onChange={(e) =>
                              setEditingPolicy((prev) => ({
                                ...prev,
                                [p.priority]: {
                                  response: Number(e.target.value),
                                  resolution: currentResolution
                                }
                              }))
                            }
                            className="w-full bg-navy-950 border border-navy-800 focus:border-gold-500/50 rounded-xl px-3 py-1.5 text-xs text-slate-100 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-gold-300/80 mb-1">
                            Resolution Target (Hours)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="168"
                            value={currentResolution}
                            onChange={(e) =>
                              setEditingPolicy((prev) => ({
                                ...prev,
                                [p.priority]: {
                                  response: currentResponse,
                                  resolution: Number(e.target.value)
                                }
                              }))
                            }
                            className="w-full bg-navy-950 border border-navy-800 focus:border-gold-500/50 rounded-xl px-3 py-1.5 text-xs text-slate-100 font-mono"
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
              size="sm"
              className="border-navy-700 hover:border-gold-500/40"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
