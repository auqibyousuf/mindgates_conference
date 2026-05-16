"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FadeInProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
}

export function FadeIn({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 700,
  ...props
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = domRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Re-animate every time it comes into view
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(currentRef);
    return () => observer.unobserve(currentRef);
  }, []);

  const getDirectionClasses = () => {
    if (isVisible) return "translate-x-0 translate-y-0 opacity-100";
    
    switch (direction) {
      case "up":
        return "translate-y-12 opacity-0";
      case "down":
        return "-translate-y-12 opacity-0";
      case "left":
        return "-translate-x-12 opacity-0";
      case "right":
        return "translate-x-12 opacity-0";
      default:
        return "opacity-0";
    }
  };

  return (
    <div
      ref={domRef}
      className={cn(
        "transition-all",
        getDirectionClasses(),
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: isVisible ? `${delay}ms` : '0ms',
        ...props.style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
