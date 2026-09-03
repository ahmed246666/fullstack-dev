'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Select({
  value,
  onChange,
  options,
  placeholder = 'Select an option...',
  label,
  className,
  triggerClassName,
  contentClassName,
  disabled = false,
  size = 'md'
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sizeStyles = {
    sm: 'h-9 px-3 text-xs rounded-xl',
    md: 'h-11 px-4 text-sm rounded-xl',
    lg: 'h-13 px-5 text-base rounded-2xl'
  };

  return (
    <div className={twMerge('relative space-y-1.5 w-full', className)} ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-brand">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={twMerge(
          'w-full flex items-center justify-between gap-2 bg-navy-950/90 border border-navy-800 hover:border-gold-500/50 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 text-slate-100 font-medium transition-all outline-none shadow-inner select-none',
          sizeStyles[size],
          isOpen && 'border-gold-500 ring-1 ring-gold-500/30',
          disabled && 'opacity-50 cursor-not-allowed',
          triggerClassName
        )}
      >
        <span className="truncate flex items-center gap-2">
          {selectedOption ? (
            <>
              {selectedOption.icon && <span className="shrink-0">{selectedOption.icon}</span>}
              <span className="truncate">{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-slate-500">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={twMerge(
            'w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200',
            isOpen && 'transform rotate-180 text-gold-400'
          )}
        />
      </button>

      {/* Dropdown Popover Content */}
      {isOpen && !disabled && (
        <div
          className={twMerge(
            'absolute z-50 mt-1.5 w-full min-w-[8rem] max-h-60 overflow-y-auto rounded-2xl bg-navy-900 border border-gold-500/30 p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 font-sans',
            contentClassName
          )}
        >
          <div className="space-y-0.5">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={twMerge(
                    'w-full flex items-center justify-between gap-2 px-3 py-2 text-xs rounded-xl font-medium transition-colors text-left rtl:text-right',
                    isSelected
                      ? 'bg-gold-500/15 text-gold-300 font-bold border border-gold-500/25'
                      : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                  )}
                >
                  <span className="flex items-center gap-2 truncate">
                    {option.icon && <span className="shrink-0">{option.icon}</span>}
                    <span className="truncate">{option.label}</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-gold-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
