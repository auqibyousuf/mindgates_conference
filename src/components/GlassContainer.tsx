import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark' | 'primary';
  hover?: boolean;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({ 
  children, 
  className, 
  variant = 'light',
  hover = false
}) => {
  return (
    <div className={cn(
      "glass-card transition-all duration-500",
      variant === 'light' && "bg-white/40 border-white/40 shadow-xl",
      variant === 'dark' && "bg-foreground/10 border-white/10 shadow-2xl backdrop-blur-xl",
      variant === 'primary' && "bg-primary/5 border-primary/20 shadow-lg",
      hover && "hover:-translate-y-2 hover:shadow-2xl hover:border-primary/30",
      className
    )}>
      {children}
    </div>
  );
};
