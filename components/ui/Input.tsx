'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, icon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-400',
              'disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed',
              error
                ? 'border-red-300 focus:ring-red-400 focus:border-red-400'
                : 'border-slate-200 hover:border-slate-300',
              icon && 'pl-10',
              className
            )}
            {...props}
          />
        </div>
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
        {error && <p className="text-xs text-red-500 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
