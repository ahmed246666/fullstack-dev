'use client';

import React, { useState } from 'react';
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

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['sla-policies'],
    queryFn: () => api.getSLAPolicies(),
    enabled: isOpen
  });

  const [editingPolicy, setEditingPolicy] = useState<{
    [key: string]: { response: number; resolution: number };
  }>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 rtl:left-0 rtl:right-auto max-w-full flex pl-10 rtl:pl-0 rtl:pr-10">
        <div className="w-screen max-w-md glass-panel bg-slate-950/95 border-l rtl:border-r rtl:border-l-0 border-slate-800 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto animate-in slide-in-from-right rtl:slide-in-from-left duration-200">
          <div className="space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  <span>{lang === 'ar' ? 'إعدادات سياسات SLA' : 'SLA Policy Engine Settings'}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Configure first response and final resolution hour thresholds.
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoading ? (
              <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
                Loading SLA policies...
              </div>
            ) : (
              <div className="space-y-4">
                {policies.map((p: any) => {
                  const currentResponse =
                    editingPolicy[p.priority]?.response ?? p.responseTimeHours;
                  const currentResolution =
                    editingPolicy[p.priority]?.resolution ?? p.resolutionTimeHours;
                  const isModified = editingPolicy[p.priority] !== undefined;

                  return (
                    <div
                      key={p.priority}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <PriorityBadge priority={p.priority} />
                        {isModified && (
                          <Button
                            size="sm"
                            isLoading={savingKey === p.priority}
                            onClick={() => handleUpdate(p.priority)}
                            className="text-[11px] py-1 px-2.5 h-auto"
                          >
                            <Save className="w-3 h-3" />
                            <span>Save</span>
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
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
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
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
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <Button variant="outline" onClick={onClose} size="sm">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
