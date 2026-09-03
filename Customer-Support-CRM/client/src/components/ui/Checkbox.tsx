'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export interface CheckboxProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  name?: string;
}

export function Checkbox({
  id,
  checked = false,
  onCheckedChange,
  disabled = false,
  label,
  description,
  className,
  name
}: CheckboxProps) {
  const generatedId = id || (name ? `checkbox-${name}` : undefined);

  return (
    <div className="inline-flex items-start gap-2 select-none">
      <button
        type="button"
        role="checkbox"
        id={generatedId}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onCheckedChange?.(!checked)}
        className={twMerge(
          'peer w-4 h-4 rounded-md border flex items-center justify-center transition-all duration-150 shrink-0 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:ring-offset-1 focus:ring-offset-navy-950',
          checked
            ? 'bg-gradient-to-r from-gold-500 to-gold-600 border-gold-400 text-navy-950 shadow-sm shadow-gold-500/20'
            : 'bg-navy-950 border-navy-750 hover:border-gold-500/50 text-transparent',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <Check
          className={twMerge(
            'w-3 h-3 stroke-[3] transition-transform duration-150',
            checked ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          )}
        />
      </button>

      {(label || description) && (
        <div className="grid gap-0.5 leading-none">
          {label && (
            <label
              htmlFor={generatedId}
              onClick={() => !disabled && onCheckedChange?.(!checked)}
              className={twMerge(
                'text-xs font-semibold cursor-pointer select-none',
                disabled ? 'cursor-not-allowed opacity-50' : 'text-slate-200 hover:text-white'
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-[11px] text-slate-400 leading-normal">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}
