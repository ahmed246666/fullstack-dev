'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
  duration?: number;
}

type ToastListener = (toast: ToastMessage) => void;

class ToastManager {
  private listeners: Set<ToastListener> = new Set();

  subscribe(listener: ToastListener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  show(message: string, type: ToastType = 'info', title?: string, duration: number = 4000) {
    const toast: ToastMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      message,
      type,
      duration
    };
    this.listeners.forEach((listener) => listener(toast));
  }

  success(message: string, title?: string, duration?: number) {
    this.show(message, 'success', title, duration);
  }

  error(message: string, title?: string, duration?: number) {
    this.show(message, 'error', title, duration);
  }

  warning(message: string, title?: string, duration?: number) {
    this.show(message, 'warning', title, duration);
  }

  info(message: string, title?: string, duration?: number) {
    this.show(message, 'info', title, duration);
  }
}

export const toast = new ToastManager();

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = toast.subscribe((newToast) => {
      setToasts((prev) => [...prev, newToast]);

      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
        }, newToast.duration);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!mounted || typeof document === 'undefined') return null;

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const icons: Record<ToastType, any> = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };

  const colorStyles: Record<ToastType, { border: string; bg: string; iconColor: string; titleColor: string }> = {
    success: {
      border: 'border-emerald-500/40',
      bg: 'bg-gradient-to-r from-navy-950 via-emerald-950/40 to-navy-950',
      iconColor: 'text-emerald-400',
      titleColor: 'text-emerald-300'
    },
    error: {
      border: 'border-rose-500/40',
      bg: 'bg-gradient-to-r from-navy-950 via-rose-950/40 to-navy-950',
      iconColor: 'text-rose-400',
      titleColor: 'text-rose-300'
    },
    warning: {
      border: 'border-amber-500/40',
      bg: 'bg-gradient-to-r from-navy-950 via-amber-950/40 to-navy-950',
      iconColor: 'text-amber-400',
      titleColor: 'text-amber-300'
    },
    info: {
      border: 'border-gold-500/40',
      bg: 'bg-gradient-to-r from-navy-950 via-gold-950/40 to-navy-950',
      iconColor: 'text-gold-400',
      titleColor: 'text-gold-300'
    }
  };

  return createPortal(
    <div
      aria-live="polite"
      className="fixed top-4 left-3 right-3 sm:left-auto sm:right-4 rtl:sm:right-auto rtl:sm:left-4 z-[9999999] flex flex-col gap-2.5 max-w-[calc(100vw-1.5rem)] sm:max-w-sm w-auto sm:w-full pointer-events-none font-sans box-border"
    >
      {toasts.map((t) => {
        const IconComponent = icons[t.type];
        const style = colorStyles[t.type];

        return (
          <div
            key={t.id}
            className={twMerge(
              'pointer-events-auto flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl border glass-panel shadow-2xl shadow-black/80 backdrop-blur-xl animate-in slide-in-from-top-3 fade-in duration-200 transition-all max-w-full overflow-hidden box-border',
              style.border,
              style.bg
            )}
          >
            <IconComponent className={twMerge('w-5 h-5 mt-0.5 shrink-0', style.iconColor)} />
            <div className="flex-1 min-w-0 overflow-hidden">
              {t.title && (
                <div className={twMerge('text-xs font-bold font-brand mb-0.5 truncate', style.titleColor)}>
                  {t.title}
                </div>
              )}
              <div className="text-xs text-slate-200 leading-relaxed break-words overflow-hidden">{t.message}</div>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-900 transition-colors shrink-0 -mr-1 rtl:-ml-1 rtl:-mr-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>,
    document.body
  );
}
