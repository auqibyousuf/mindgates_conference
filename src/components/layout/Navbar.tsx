"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, GraduationCap, ChevronRight, ChevronDown, Calendar, Book, Award, Image as ImageIcon, Users, Info } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NAV_STRUCTURE = [
  { name: "Home", href: "/" },
  { 
    name: "Events", 
    icon: Calendar,
    children: [
      { name: "All Conferences", href: "/conferences", icon: Calendar, desc: "View our global event calendar" },
      { name: "Upcoming Events", href: "/conferences", icon: Calendar, desc: "Join our next scholarly gathering" },
      { name: "Past Proceedings", href: "/conferences", icon: Calendar, desc: "Review previous session insights" },
    ]
  },
  { 
    name: "Resources", 
    icon: Book,
    children: [
      { name: "Books Published", href: "/books", icon: Book, desc: "Explore our academic publications" },
      { name: "Awards & Honors", href: "/awards", icon: Award, desc: "Celebrating research excellence" },
      { name: "Photo Gallery", href: "/gallery", icon: ImageIcon, desc: "Visual highlights from our events" },
    ]
  },
  { 
    name: "Organization", 
    icon: Users,
    children: [
      { name: "About Us", href: "/about", icon: Info, desc: "Our mission and scholarly vision" },
      { name: "Editor's Board", href: "/editors", icon: Users, desc: "Distinguished governing council" },
    ]
  },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDarkBg = !scrolled;

  return (
    <nav
      className={cn(
        "fixed left-0 right-0 z-50 transition-all duration-500 px-6",
        scrolled ? "top-4" : "top-6"
      )}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <div
        className={cn(
          "section-container transition-all duration-500 rounded-2xl",
          scrolled
            ? "glass-card py-3 shadow-[0_25px_50px_-12px_rgba(49,46,129,0.15)] border-white/80"
            : "bg-linear-to-b from-primary to-primary/95 border border-white/20 py-5 shadow-2xl"
        )}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className={cn(
              "p-2 rounded-xl transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg",
              scrolled ? "bg-primary shadow-primary/20" : "bg-primary shadow-lg border border-primary/20"
            )}>
              <GraduationCap className="size-5 transition-colors duration-500 text-white" />
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "font-serif text-base font-black tracking-tight transition-colors duration-500 leading-tight",
                isDarkBg ? "text-white" : "text-primary"
              )}>
                Mindgates Research
              </span>
              <span className={cn(
                "text-[8px] uppercase tracking-[0.2em] font-black leading-none transition-colors duration-500 mt-0.5",
                isDarkBg ? "text-white/60" : "text-foreground/40"
              )}>
                Conference Forum
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2">
            {NAV_STRUCTURE.map((item) => (
              <div 
                key={item.name} 
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.name)}
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    className={cn(
                      "px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 rounded-xl flex items-center gap-1.5",
                      isDarkBg
                        ? "text-white/80 hover:text-white hover:bg-white/10"
                        : "text-foreground/60 hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button
                    className={cn(
                      "px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 rounded-xl flex items-center gap-1.5 cursor-pointer",
                      isDarkBg
                        ? "text-white/80 hover:text-white hover:bg-white/10"
                        : "text-foreground/60 hover:text-primary hover:bg-primary/5",
                      activeDropdown === item.name && (isDarkBg ? "bg-white/10 text-white" : "bg-primary/5 text-primary")
                    )}
                  >
                    {item.name}
                    <ChevronDown className={cn(
                      "size-3 transition-transform duration-300",
                      activeDropdown === item.name && "rotate-180"
                    )} />
                  </button>
                )}

                {/* Dropdown Menu */}
                {item.children && activeDropdown === item.name && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-72 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="glass-card bg-white border-white shadow-2xl p-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 transition-colors group/item"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="size-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 group-hover/item:bg-primary group-hover/item:text-white transition-all">
                             {child.icon ? <child.icon className="size-5" /> : <ChevronRight className="size-4" />}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-xs font-bold text-foreground group-hover/item:text-primary transition-colors">{child.name}</span>
                             <span className="text-[10px] text-foreground/40 font-medium leading-tight">{child.desc}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            <div className="w-px h-6 bg-foreground/5 mx-2" />
            
            <Link
              href="/conferences"
              className={cn(
                "text-[9px] font-black uppercase tracking-[0.2em] py-3 px-6 rounded-xl transition-all active:scale-95 flex items-center gap-2",
                scrolled 
                  ? "bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5" 
                  : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
              )}
            >
              Submit Paper
              <ChevronRight className="size-3.5" />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className={cn(
              "lg:hidden p-2 transition-colors duration-500 rounded-xl",
              isDarkBg ? "text-white hover:bg-white/10" : "text-foreground hover:bg-foreground/5"
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-24 left-6 right-6 glass-card p-6 flex flex-col gap-2 animate-in fade-in slide-in-from-top-4 shadow-2xl border-white/40 max-h-[80vh] overflow-y-auto">
          {NAV_STRUCTURE.map((item) => (
            <div key={item.name} className="flex flex-col">
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-xs font-black uppercase tracking-[0.2em] text-foreground/70 hover:text-primary py-4 px-2 flex items-center justify-between group"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                  <ChevronRight className="size-4 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              ) : (
                <div className="py-4 px-2 space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30">{item.name}</span>
                  <div className="grid grid-cols-1 gap-1">
                    {item.children?.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 text-xs font-bold text-foreground/60 hover:text-primary transition-all"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="size-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                           {child.icon ? <child.icon className="size-4" /> : <ChevronRight className="size-3" />}
                        </div>
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <div className="h-px bg-foreground/5 w-full" />
            </div>
          ))}
          <Link
            href="/conferences"
            className="bg-primary text-white text-center py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] mt-4 shadow-xl shadow-primary/20"
            onClick={() => setIsOpen(false)}
          >
            Join Conference
          </Link>
        </div>
      )}
    </nav>
  );
}
