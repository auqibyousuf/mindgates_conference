"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, GraduationCap, ChevronRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Conferences", href: "/conferences" },
  { name: "Books", href: "/books" },
  { name: "Editor's Board", href: "/editors" },
  { name: "Gallery", href: "/gallery" },
  { name: "Awards", href: "/awards" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine text color based on scroll and page
  // On home page, we want white text over the hero image when not scrolled
  const isDarkBg = isHome && !scrolled;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6",
        scrolled ? "top-4" : "top-0"
      )}
    >
      <div
        className={cn(
          "max-w-7xl mx-auto transition-all duration-500",
          scrolled
            ? "glass-card px-6 py-3 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border-white/40"
            : "bg-white/5 backdrop-blur-sm border border-white/10 px-6 py-5 rounded-none border-t-0 border-x-0"
        )}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className={cn(
              "p-2 rounded-xl transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg",
              scrolled ? "bg-primary shadow-primary/20" : "bg-primary shadow-lg border border-primary/20"
            )}>
              <GraduationCap className="size-6 transition-colors duration-500 text-white" />
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "font-serif text-xl font-black tracking-tight transition-colors duration-500",
                isDarkBg ? "text-white drop-shadow-md" : "text-primary"
              )}>
                Conference Event
              </span>
              <span className={cn(
                "text-[10px] uppercase tracking-[0.3em] font-black leading-none transition-colors duration-500",
                isDarkBg ? "text-white/80 drop-shadow-sm" : "text-foreground/40"
              )}>
                Simplifying Research
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 relative group py-2",
                  isDarkBg
                    ? "text-white hover:text-white drop-shadow-sm font-black"
                    : "text-foreground/60 hover:text-primary"
                )}
              >
                {link.name}
                <span className={cn(
                  "absolute bottom-0 left-0 h-0.5 transition-all duration-500 group-hover:w-full",
                  scrolled ? "bg-primary w-0" : "bg-white w-0"
                )} />
              </Link>
            ))}
            <Link
              href="/conferences"
              className={cn(
                "glass-button text-[10px] font-black uppercase tracking-[0.2em] py-3.5 px-7 shadow-xl transition-all active:scale-95",
                !scrolled && "bg-primary hover:bg-primary-hover border-primary/20 text-white shadow-primary/40 shadow-2xl"
              )}
            >
              Join Conference
              <ChevronRight className="size-4" />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className={cn(
              "lg:hidden p-2 transition-colors duration-500",
              isDarkBg ? "text-white" : "text-foreground"
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-24 left-6 right-6 glass-card p-8 flex flex-col gap-5 animate-in fade-in slide-in-from-top-4 shadow-2xl border-white/40">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-black uppercase tracking-[0.2em] text-foreground/70 hover:text-primary py-3 border-b border-foreground/5 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/conferences"
            className="glass-button justify-center mt-4 py-4"
            onClick={() => setIsOpen(false)}
          >
            Join Conference
          </Link>
        </div>
      )}
    </nav>
  );
}
