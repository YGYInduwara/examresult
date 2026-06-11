'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: { value: string | number; label: string; group?: string }[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, options, placeholder, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    const groups = options.reduce<Record<string, typeof options>>((acc, opt) => {
      const g = opt.group ?? '__default__'
      if (!acc[g]) acc[g] = []
      acc[g].push(opt)
      return acc
    }, {})

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 appearance-none cursor-pointer',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-400',
              'disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed',
              error
                ? 'border-red-300 focus:ring-red-400'
                : 'border-slate-200 hover:border-slate-300',
              className
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {Object.entries(groups).map(([group, opts]) =>
              group === '__default__' ? (
                opts.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              ) : (
                <optgroup key={group} label={group}>
                  {opts.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
              )
            )}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
export default Select
