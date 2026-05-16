import React from 'react';
import Image from 'next/image';
import { LucideIcon } from 'lucide-react';

interface SubPageHeroProps {
  titleLine1: string;
  titleItalic: string;
  titleLine2?: string;
  description: string;
  badge: string;
  icon?: LucideIcon;
  image?: string;
}

export const SubPageHero: React.FC<SubPageHeroProps> = ({ 
  titleLine1, 
  titleItalic, 
  titleLine2, 
  description, 
  badge, 
  icon: Icon,
  image = "/images/banners/hero-v2.png" 
}) => {
  return (
    <section className="relative h-[60vh] min-h-112.5 flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={image} 
          alt={titleLine1}
          fill
          className="object-cover brightness-[0.5] scale-105 animate-slow-zoom"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-60" />
      </div>

      <div className="relative z-10 section-container w-full">
        <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-md">
            {Icon && <Icon className="size-3 text-primary" />}
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              {badge}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight">
            {titleLine1} <span className="text-primary italic">{titleItalic}</span> {titleLine2}
          </h1>
          <p className="text-lg text-white/80 leading-relaxed font-medium max-w-2xl">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};
