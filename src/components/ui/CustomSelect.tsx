'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Option {
  value: string
  label: string
}

interface CustomSelectProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className,
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'w-full border rounded-2xl px-5 py-3.5 text-left text-sm font-medium transition-all flex items-center justify-between shadow-xs',
          disabled
            ? 'bg-slate-50 dark:bg-zinc-950 border-slate-200/60 dark:border-zinc-800/40 text-foreground/40 cursor-not-allowed'
            : 'bg-white/85 dark:bg-zinc-900/85 border-foreground/15 dark:border-white/20 text-foreground hover:border-primary/30 cursor-pointer focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10',
          isOpen && !disabled && 'border-primary ring-4 ring-primary/10'
        )}
      >
        <span className={cn(!selectedOption && (disabled ? 'text-foreground/30' : 'text-foreground/45'))}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'size-4 text-foreground/30 transition-transform duration-300',
            isOpen && !disabled && 'rotate-180 text-primary'
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white/95 dark:bg-zinc-900/95 border border-foreground/15 dark:border-white/20 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden animate-in fade-in-0 slide-in-from-top-2 duration-200">
          <ul className="py-1.5 max-h-60 overflow-y-auto divide-y divide-foreground/5">
            {options.length === 0 ? (
              <li className="px-5 py-3 text-xs text-foreground/40 text-center font-medium">
                No options available
              </li>
            ) : (
              options.map((opt) => {
                const isSelected = opt.value === value
                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(opt.value)
                        setIsOpen(false)
                      }}
                      className={cn(
                        'w-full text-left px-5 py-3 text-xs font-semibold text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer',
                        isSelected && 'text-primary bg-primary/5 font-bold'
                      )}
                    >
                      {opt.label}
                    </button>
                  </li>
                )
              })
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
