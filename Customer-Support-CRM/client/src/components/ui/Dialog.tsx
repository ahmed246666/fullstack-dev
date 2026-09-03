'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface DialogContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a <Dialog />');
  }
  return context;
}

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open: controlledOpen, onOpenChange, children }: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = (value: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(value);
    }
    onOpenChange?.(value);
  };

  return (
    <DialogContext.Provider value={{ open: !!open, onOpenChange: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({
  asChild,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { onOpenChange } = useDialog();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        (children as any).props?.onClick?.(e);
        onOpenChange(true);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={() => onOpenChange(true)}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

export function DialogClose({
  asChild,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { onOpenChange } = useDialog();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        (children as any).props?.onClick?.(e);
        onOpenChange(false);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={() => onOpenChange(false)}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full';
  showCloseButton?: boolean;
}

export function DialogContent({
  children,
  className,
  maxWidth = 'lg',
  showCloseButton = true
}: DialogContentProps) {
  const { open, onOpenChange } = useDialog();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };
    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open || !mounted || typeof document === 'undefined') return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-[95vw]'
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto font-sans"
    >
      {/* Overlay Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog Surface */}
      <div
        className={twMerge(
          'relative w-full max-h-[92vh] flex flex-col glass-panel bg-navy-950/95 border border-gold-500/30 rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl shadow-black/80 z-[1000000] animate-in fade-in-0 zoom-in-95 duration-200 overflow-y-auto',
          maxWidthStyles[maxWidth],
          className
        )}
      >
        {children}

        {showCloseButton && (
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close dialog"
            className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-navy-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500/40"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>,
    document.body
  );
}

export function DialogHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        'flex flex-col space-y-1.5 pb-4 mb-4 border-b border-navy-800/80 text-left rtl:text-right',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DialogFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        'flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 pt-4 mt-4 border-t border-navy-800/80',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DialogTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={twMerge(
        'text-base sm:text-lg font-bold text-white font-brand text-gold-300 tracking-wide',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function DialogDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={twMerge('text-xs text-slate-400 leading-normal', className)}
      {...props}
    >
      {children}
    </p>
  );
}
