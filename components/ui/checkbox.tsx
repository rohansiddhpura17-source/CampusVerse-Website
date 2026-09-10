import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, checked, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex items-start gap-2.5">
        <div className="relative flex items-center h-5">
          <input
            id={inputId}
            ref={ref}
            type="checkbox"
            checked={checked}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              'w-4 h-4 rounded border border-slate-300 bg-white flex items-center justify-center transition-colors cursor-pointer',
              'peer-checked:bg-brand-600 peer-checked:border-brand-600 peer-focus:ring-2 peer-focus:ring-brand-500 peer-focus:ring-offset-1',
              'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
              className
            )}
          >
            <Check className="w-3 h-3 text-white stroke-[3] opacity-0 peer-checked:opacity-100 transition-opacity" />
          </div>
        </div>
        {(label || description) && (
          <div className="text-sm">
            {label && (
              <label htmlFor={inputId} className="font-medium text-slate-700 cursor-pointer select-none">
                {label}
              </label>
            )}
            {description && <p className="text-xs text-slate-500">{description}</p>}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
