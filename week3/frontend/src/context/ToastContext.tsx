'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 3500) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = { id, message, type };

    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const getToastConfig = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          border: 'var(--success-border)',
          color: 'var(--success)',
          icon: <CheckCircle2 size={16} color="var(--success)" />
        };
      case 'error':
        return {
          border: 'var(--danger-border)',
          color: 'var(--danger)',
          icon: <AlertCircle size={16} color="var(--danger)" />
        };
      case 'warning':
        return {
          border: 'var(--warning-border)',
          color: 'var(--warning)',
          icon: <AlertTriangle size={16} color="var(--warning)" />
        };
      default:
        return {
          border: 'var(--info-border)',
          color: 'var(--info)',
          icon: <Info size={16} color="var(--info)" />
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}

      {/* Floating Toast Notification Container */}
      <div
        style={{
          position: 'fixed',
          bottom: '1.25rem',
          right: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          zIndex: 9999,
          maxWidth: '360px',
          width: 'calc(100% - 2.5rem)',
          pointerEvents: 'none'
        }}
      >
        {toasts.map(toast => {
          const config = getToastConfig(toast.type);
          return (
            <div
              key={toast.id}
              style={{
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                padding: '0.75rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-surface)',
                border: `1px solid ${config.border}`,
                boxShadow: 'var(--shadow-lg)',
                color: 'var(--text-primary)',
                fontSize: '0.8125rem',
                fontWeight: 500,
                lineHeight: 1.4
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                {config.icon}
                <span style={{ color: config.color, wordBreak: 'break-word' }}>{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0
                }}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
