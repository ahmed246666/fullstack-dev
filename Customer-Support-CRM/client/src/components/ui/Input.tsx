import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">{label}</label>}
      <input
        className={twMerge(
          'w-full bg-slate-900/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-500 transition-all outline-none',
          error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
    </div>
  );
}
