import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 select-none tracking-wide';

  const variants = {
    primary:
      'bg-gradient-to-r from-gold-500 via-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-bold shadow-md shadow-gold-500/20 active:scale-[0.98]',
    secondary:
      'bg-navy-900 hover:bg-navy-800 text-slate-100 border border-navy-750 active:scale-[0.98]',
    outline:
      'border border-navy-750 hover:border-gold-500/40 text-slate-300 hover:text-white bg-transparent active:scale-[0.98]',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 active:scale-[0.98]',
    ghost: 'text-slate-400 hover:text-white hover:bg-navy-900/60'
  };

  const sizes = {
    sm: 'px-3.5 py-2 text-xs sm:text-[13px] gap-2 rounded-xl',
    md: 'px-5 py-2.5 sm:py-3 text-xs sm:text-sm gap-2.5 rounded-2xl',
    lg: 'px-7 py-3.5 sm:py-4 text-sm sm:text-base font-bold gap-3 rounded-2xl'
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 rtl:ml-2 rtl:-mr-1 h-4 w-4 text-current shrink-0"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
