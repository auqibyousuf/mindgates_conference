import React from 'react';
import Image from 'next/image';
import { Camera, Maximize2 } from 'lucide-react';
import { GlassContainer } from '@/components/GlassContainer';

import { SubPageHero } from '@/components/SubPageHero';
import siteConfigDefault from '@/data/siteConfig.json';
import { readData } from '@/lib/data-handler';
import { SiteConfig } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const siteConfig = ((await readData('siteConfig.json')) as SiteConfig) || siteConfigDefault;

  const images = [
    { src: "/images/gallery/gallery-1.png", title: "Global Academic Forum 2024", category: "Conference" },
    { src: "/images/gallery/gallery-2.png", title: "Scholarly Networking Event", category: "Networking" },
    { src: "/images/gallery/gallery-1.png", title: "Research Excellence Workshop", category: "Workshop" },
    { src: "/images/gallery/gallery-2.png", title: "International Symposium", category: "Conference" },
    { src: "/images/gallery/gallery-1.png", title: "Book Launch Ceremony", category: "Event" },
    { src: "/images/gallery/gallery-2.png", title: "Academic Collaboration", category: "Networking" },
  ];

  return (
    <main className="min-h-screen bg-background">
      <SubPageHero 
        titleLine1="Moments of"
        titleItalic="Impact"
        description="Explore the highlights from our past conferences, workshops, and academic gatherings."
        badge="Visual Legacy"
        icon={Camera}
        image={siteConfig.hero.galleryImage || siteConfigDefault.hero.galleryImage}
      />

      <div className="section-container py-4 sm:py-8 md:py-12 lg:py-16">
        {/* Gallery Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 lg:gap-8 space-y-6 lg:space-y-8">
           {images.map((img, i) => (
             <GlassContainer key={i} variant="light" className="p-0 overflow-hidden group cursor-pointer break-inside-avoid shadow-2xl">
                <div className="relative aspect-4/3 overflow-hidden">
                   <Image 
                     src={img.src} 
                     alt={img.title}
                     fill
                     className="object-cover transition-all duration-700 group-hover:scale-110"
                   />
                   <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                      <Maximize2 className="size-10 text-white scale-50 group-hover:scale-100 transition-all duration-500 delay-100" />
                   </div>
                </div>
                <div className="p-6 space-y-2">
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{img.category}</div>
                   <h3 className="text-xl font-serif font-bold text-foreground">{img.title}</h3>
                </div>
             </GlassContainer>
           ))}
        </div>
      </div>
    </main>
  );
}
