'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, ShieldAlert, History, User, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';

interface AuditLogsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuditLogsDrawer({ isOpen, onClose }: AuditLogsDrawerProps) {
  const { lang } = useLanguage();

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => api.getAuditLogs(),
    enabled: isOpen
  });

  if (!isOpen) return null;

  const logs = data?.data || [];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 rtl:left-0 rtl:right-auto max-w-full flex pl-10 rtl:pl-0 rtl:pr-10">
        <div className="w-screen max-w-xl glass-panel bg-slate-950/95 border-l rtl:border-r rtl:border-l-0 border-slate-800 p-6 md:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto animate-in slide-in-from-right rtl:slide-in-from-left duration-200">
          <div className="space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-400" />
                  <span>
                    {lang === 'ar' ? 'سجل تدقيق العمليات (Audit Trail)' : 'System Audit Log Trail'}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Immutable security activity records, configuration changes, and actor assignments.
                </p>
              </div>

              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoading ? (
              <div className="py-16 text-center text-xs text-slate-400 animate-pulse">
                Loading security audit records...
              </div>
            ) : (
              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                {logs.map((log: any) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-200">
                          {log.actor?.name || 'System Auto-Agent'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Target: {log.entityType} ({log.entityId?.slice(0, 8)}...)
                      </span>
                    </div>

                    {log.metadata && (
                      <div className="mt-1 p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-400 font-mono overflow-x-auto">
                        {typeof log.metadata === 'object'
                          ? JSON.stringify(log.metadata)
                          : log.metadata}
                      </div>
                    )}
                  </div>
                ))}

                {logs.length === 0 && (
                  <div className="py-12 text-center text-xs text-slate-500">
                    No audit activity logged yet.
                  </div>
                )}
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
