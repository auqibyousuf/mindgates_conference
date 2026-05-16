import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string
  variant?: 'primary' | 'secondary' | 'glass' | 'outline' | 'light'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'default',
      href,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-lg font-bold transition-all disabled:opacity-50 disabled:pointer-events-none'

    const variants = {
      primary:
        'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20',
      secondary:
        'bg-secondary text-white hover:bg-secondary/90 shadow-lg shadow-black/20',
      glass:
        'bg-white/10 backdrop-blur-xl border border-white/30 text-white hover:bg-white/20 shadow-xl shadow-black/20',
      outline:
        'border-2 border-primary/20 text-primary hover:bg-primary hover:text-white',
      light:
        'bg-white text-primary hover:bg-slate-100 shadow-xl shadow-black/10',
    }

    const sizes = {
      default: 'px-4 py-2 text-sm md:px-5 md:py-3 md:text-base',
      sm: 'px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm',
      lg: 'px-4 py-3 text-sm md:px-5 md:py-3 md:text-base',
      icon: 'size-8 md:size-10',
    }

    const classes = cn(baseStyles, variants[variant], sizes[size], className)

    if (href) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      )
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'

export { Button }
