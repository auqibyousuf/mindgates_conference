'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  toast: (message: string, type: ToastType, duration?: number) => void
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback((message: string, type: ToastType, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type, duration }])

    setTimeout(() => {
      removeToast(id)
    }, duration)
  }, [removeToast])

  const success = useCallback((message: string, duration?: number) => toast(message, 'success', duration), [toast])
  const error = useCallback((message: string, duration?: number) => toast(message, 'error', duration), [toast])
  const info = useCallback((message: string, duration?: number) => toast(message, 'info', duration), [toast])
  const warning = useCallback((message: string, duration?: number) => toast(message, 'warning', duration), [toast])

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
      case 'error':
        return <XCircle className="size-5 text-rose-500 shrink-0" />
      case 'warning':
        return <AlertTriangle className="size-5 text-amber-500 shrink-0" />
      case 'info':
        return <Info className="size-5 text-blue-500 shrink-0" />
    }
  }

  const getBgStyle = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/50 bg-white/95 dark:bg-zinc-900/95 shadow-emerald-500/10'
      case 'error':
        return 'border-rose-500/50 bg-white/95 dark:bg-zinc-900/95 shadow-rose-500/10'
      case 'warning':
        return 'border-amber-500/50 bg-white/95 dark:bg-zinc-900/95 shadow-amber-500/10'
      case 'info':
        return 'border-blue-500/50 bg-white/95 dark:bg-zinc-900/95 shadow-blue-500/10'
    }
  }

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-4 rounded-2xl border backdrop-blur-md shadow-lg animate-in slide-in-from-right-8 fade-in-0 duration-300 ${getBgStyle(t.type)}`}
          >
            <div className="flex gap-3">
              {getIcon(t.type)}
              <span className="text-xs font-semibold text-foreground leading-relaxed">
                {t.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-foreground/40 hover:text-foreground/80 p-0.5 rounded-lg hover:bg-foreground/5 transition-all shrink-0 cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
