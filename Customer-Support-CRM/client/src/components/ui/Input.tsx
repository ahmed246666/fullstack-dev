'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  sizeVariant?: 'sm' | 'md' | 'lg';
}

export function Input({
  label,
  error,
  sizeVariant = 'md',
  className,
  ...props
}: InputProps) {
  const sizeStyles = {
    sm: 'h-9 px-3 text-xs rounded-xl',
    md: 'h-11 px-4 text-sm rounded-xl',
    lg: 'h-13 px-5 text-base rounded-2xl'
  };

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-brand">
          {label}
        </label>
      )}
      <input
        className={twMerge(
          'w-full flex items-center bg-navy-950/90 border border-navy-800 hover:border-gold-500/40 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 text-slate-100 placeholder-slate-500 font-medium transition-all outline-none shadow-inner',
          sizeStyles[sizeVariant],
          error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
    </div>
  );
}
