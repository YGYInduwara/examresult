'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]'

    const variants = {
      primary: 'bg-linear-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 focus-visible:ring-violet-500 shadow-md hover:shadow-lg',
      secondary: 'bg-linear-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 focus-visible:ring-emerald-500 shadow-md hover:shadow-lg',
      outline: 'border-2 border-violet-300 text-violet-700 hover:bg-violet-50 focus-visible:ring-violet-400 bg-white',
      ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400',
      danger: 'bg-linear-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 focus-visible:ring-red-500 shadow-md',
    }

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-5 text-sm',
      lg: 'h-12 px-7 text-base',
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
