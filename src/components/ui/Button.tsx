import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "role"> {
  href?: string
  variant?:
    | "primary"
    | "secondary"
    | "glass"
    | "outline"
    | "light"
    | "glass-button"
    | "ghost"
    | "white-glass"
    | "primary-glass"
    | "action"
  size?: "default" | "sm" | "lg" | "icon" | "none"
  target?: string
  rel?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      href,
      children,
      target,
      rel,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]"

    const variants = {
      primary:
        "bg-primary text-white hover:bg-primary/95 shadow-lg shadow-primary/20 hover:-translate-y-0.5",
      secondary:
        "bg-secondary text-white hover:bg-secondary/95 shadow-lg shadow-secondary/20 hover:-translate-y-0.5",
      glass:
        "bg-white/10 backdrop-blur-xl border border-white/30 text-white hover:bg-white/20 shadow-xl shadow-black/20 hover:-translate-y-0.5",
      outline:
        "border-2 border-primary/20 text-primary hover:bg-primary hover:text-white hover:-translate-y-0.5",
      light:
        "bg-white text-primary hover:bg-slate-100 shadow-xl shadow-black/10 hover:-translate-y-0.5",
      "glass-button":
        "bg-primary text-white hover:bg-primary/95 shadow-lg shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0",
      ghost:
        "text-primary hover:underline hover:text-primary/80 active:scale-100",
      "white-glass":
        "border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:-translate-y-0.5",
      "primary-glass":
        "border border-primary/20 bg-primary/20 text-primary hover:bg-primary/30 hover:-translate-y-0.5",
      action:
        "flex items-center gap-4 w-full p-4 rounded-2xl bg-foreground/5 hover:bg-primary/10 hover:text-primary transition-all text-sm font-bold group",
    }

    const sizes = {
      default: "px-5 py-2.5 text-sm",
      sm: "px-3.5 py-1.5 text-xs",
      lg: "px-6 py-3 text-sm md:text-base",
      icon: "size-10",
      none: "",
    }

    const classes = cn(baseStyles, variants[variant], sizes[size], className)

    if (href) {
      return (
        <Link href={href} className={classes} target={target} rel={rel}>
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
Button.displayName = "Button"

export { Button }
