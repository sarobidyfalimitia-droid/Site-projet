'use client'

import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full px-3 py-2.5 rounded-xl border bg-gray-50 dark:bg-gray-800 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-colors',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            error
              ? 'border-red-400 dark:border-red-500'
              : 'border-gray-200 dark:border-gray-700',
            className
          )}
          {...props}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export { Input }
