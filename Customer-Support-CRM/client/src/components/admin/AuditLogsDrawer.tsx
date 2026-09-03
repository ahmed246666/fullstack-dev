'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => api.getAuditLogs(),
    enabled: isOpen
  });

  if (!isOpen || !mounted) return null;

  const logs = data?.data || [];

  return createPortal(
    <div className="fixed inset-0 z-[999999] overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 rtl:left-0 rtl:right-auto w-full max-w-full sm:max-w-xl flex z-[999999]">
        <div className="w-full h-full glass-panel bg-navy-950/95 border-l rtl:border-r rtl:border-l-0 border-gold-500/30 p-4 sm:p-6 md:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto animate-in slide-in-from-right rtl:slide-in-from-left duration-200">
          <div className="space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-navy-800">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2 font-brand text-gold-300">
                  <History className="w-5 h-5 text-gold-400" />
                  <span>
                    {lang === 'ar' ? 'سجل تدقيق العمليات (Audit Trail)' : 'System Audit Log Trail'}
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1 font-sans">
                  Immutable security activity records, configuration changes, and actor assignments.
                </p>
              </div>

              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-navy-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoading ? (
              <div className="py-16 text-center text-xs text-slate-400 animate-pulse">
                Loading security audit records...
              </div>
            ) : (
              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1 font-sans">
                {logs.map((log: any) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl bg-navy-900/90 border border-navy-800 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-gold-300 bg-gold-500/10 px-2.5 py-0.5 rounded border border-gold-500/20">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gold-400" />
                        <span className="font-semibold text-white font-brand">
                          {log.actor?.name || 'System Auto-Agent'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Target: {log.entityType} ({log.entityId?.slice(0, 8)}...)
                      </span>
                    </div>

                    {log.metadata && (
                      <div className="mt-1 p-2.5 rounded-xl bg-navy-950 border border-navy-800 text-[11px] text-slate-300 font-mono overflow-x-auto">
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
