'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  variant?: 'primary' | 'white' | 'currentColor'
}

export default function Logo({ className, variant = 'currentColor' }: LogoProps) {
  const colorMap = {
    primary: '#312e81',
    white: '#ffffff',
    currentColor: 'currentColor',
  }

  const selectedColor = colorMap[variant]

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-10 h-10', className)}
    >
      {/* 3D Geometric / Faceted Mortarboard Cap */}
      
      {/* Cap Band (Under-cap) - Left Facet */}
      <path
        d="M30 42 L50 52 L50 74 L30 64 Z"
        fill={selectedColor}
        fillOpacity="0.85"
      />
      
      {/* Cap Band (Under-cap) - Right Facet */}
      <path
        d="M70 42 L50 52 L50 74 L70 64 Z"
        fill={selectedColor}
        fillOpacity="0.65"
      />

      {/* Cap Band Inner Rim / Shadow */}
      <path
        d="M30 64 L50 74 L50 78 L30 68 Z"
        fill={selectedColor}
        fillOpacity="0.95"
      />
      <path
        d="M70 64 L50 74 L50 78 L70 68 Z"
        fill={selectedColor}
        fillOpacity="0.5"
      />

      {/* Top Diamond - Left Top Facet (Lightest) */}
      <path
        d="M50 16 L12 34 L50 34 Z"
        fill={selectedColor}
        fillOpacity="1.0"
      />
      
      {/* Top Diamond - Left Bottom Facet (Medium Light) */}
      <path
        d="M12 34 L50 52 L50 34 Z"
        fill={selectedColor}
        fillOpacity="0.9"
      />
      
      {/* Top Diamond - Right Bottom Facet (Medium Dark) */}
      <path
        d="M88 34 L50 52 L50 34 Z"
        fill={selectedColor}
        fillOpacity="0.75"
      />
      
      {/* Top Diamond - Right Top Facet (Darkest) */}
      <path
        d="M50 16 L88 34 L50 34 Z"
        fill={selectedColor}
        fillOpacity="0.6"
      />

      {/* Central Button / Node */}
      <circle
        cx="50"
        cy="34"
        r="3"
        fill={selectedColor}
        fillOpacity="1.0"
      />

      {/* Tassel Cord */}
      <path
        d="M50 34 C62 30 72 32 78 44"
        stroke={selectedColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeOpacity="0.9"
      />

      {/* Tassel Hanging Threads (Faceted Drops) */}
      {/* Left Strand */}
      <path
        d="M75 46 L78 46 L75 70 L72 70 Z"
        fill={selectedColor}
        fillOpacity="0.9"
      />
      {/* Center Strand */}
      <path
        d="M78 46 L81 46 L79 74 L76 74 Z"
        fill={selectedColor}
        fillOpacity="0.75"
      />
      {/* Right Strand */}
      <path
        d="M81 46 L84 46 L83 68 L80 68 Z"
        fill={selectedColor}
        fillOpacity="0.55"
      />
    </svg>
  )
}
