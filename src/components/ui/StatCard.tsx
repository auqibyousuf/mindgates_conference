"use client"

import * as React from "react"
import { Users, Calendar, BookOpen, Award, Globe, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "light" | "dark"
  icon?: string
  value: string
  label: string
}

const iconMap: Record<string, LucideIcon> = {
  Users,
  Calendar,
  BookOpen,
  Award,
  Globe
}

// Custom hook to handle numeric count-up animation
function useCountUp(target: number, isVisible: boolean, durationMs: number = 2000) {
  const [count, setCount] = React.useState(0)

  // Handle reset when not visible
  React.useEffect(() => {
    if (!isVisible) {
      const frame = requestAnimationFrame(() => setCount(0))
      return () => cancelAnimationFrame(frame)
    }
  }, [isVisible])

  // Handle animation when visible
  React.useEffect(() => {
    if (!isVisible || target === 0) return

    let startTime: number | null = null
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      const percentage = Math.min(progress / durationMs, 1)
      
      // Easing function: easeOutExpo
      const easeOut = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage)
      
      setCount(target * easeOut)

      if (progress < durationMs) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(target)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    
    return () => cancelAnimationFrame(animationFrame)
  }, [isVisible, target, durationMs])

  return count
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, variant = "light", icon, value, label, ...props }, forwardedRef) => {
    const [isVisible, setIsVisible] = React.useState(false)
    const internalRef = React.useRef<HTMLDivElement | null>(null)

    // Parse numeric part and suffix
    const numStr = value.replace(/[^0-9.]/g, '')
    const suffix = numStr ? value.substring(value.indexOf(numStr) + numStr.length) : value
    const target = parseFloat(numStr) || 0
    const hasDecimals = numStr.includes('.')

    const count = useCountUp(target, isVisible, 2000)
    
    const displayCount = hasDecimals ? count.toFixed(1) : Math.floor(count).toString()
    const displayValue = target === 0 ? value : `${displayCount}${suffix}`
    
    const IconComponent = icon ? iconMap[icon] || Users : undefined

    // Intersection Observer to trigger animation
    React.useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsVisible(true)
          } else {
            setIsVisible(false)
          }
        },
        { threshold: 0.1 }
      )
      
      const node = internalRef.current
      if (node) {
        observer.observe(node)
      }
      
      return () => {
        if (node) observer.unobserve(node)
        observer.disconnect()
      }
    }, [])

    // Merge refs
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        internalRef.current = node
        if (typeof forwardedRef === 'function') {
          forwardedRef(node)
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node
        }
      },
      [forwardedRef]
    )

    if (variant === "light") {
      return (
        <div 
          ref={setRefs}
          className={cn(
            "bg-white rounded-3xl p-6 min-w-40 flex flex-col items-center text-center group transition-all duration-500",
            "border border-slate-100 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)]",
            className
          )} 
          {...props}
        >
          {IconComponent && (
            <div className="size-12 rounded-2xl bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-500">
              <IconComponent className="size-5 text-primary group-hover:text-white transition-colors duration-500" />
            </div>
          )}
          <div className="text-3xl font-black font-serif mb-1 text-foreground">{displayValue}</div>
          <div className="text-[10px] text-foreground/40 uppercase font-black tracking-[0.2em]">{label}</div>
        </div>
      )
    }

    // dark variant (used in the global stats blue section)
    return (
      <div 
        ref={setRefs}
        className={cn(
          "space-y-2 p-6 rounded-3xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors duration-500",
          className
        )}
        {...props}
      >
        <div className="text-4xl md:text-5xl font-serif font-bold text-primary italic">{displayValue}</div>
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">{label}</div>
      </div>
    )
  }
)
StatCard.displayName = "StatCard"

export { StatCard }
