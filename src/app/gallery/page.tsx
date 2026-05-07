import React from 'react';
import Image from 'next/image';
import { Camera, Maximize2 } from 'lucide-react';
import { GlassContainer } from '@/components/GlassContainer';

export default function GalleryPage() {
  const images = [
    { src: "/images/gallery/gallery-1.png", title: "Global Academic Forum 2024", category: "Conference" },
    { src: "/images/gallery/gallery-2.png", title: "Scholarly Networking Event", category: "Networking" },
    { src: "/images/gallery/gallery-1.png", title: "Research Excellence Workshop", category: "Workshop" },
    { src: "/images/gallery/gallery-2.png", title: "International Symposium", category: "Conference" },
    { src: "/images/gallery/gallery-1.png", title: "Book Launch Ceremony", category: "Event" },
    { src: "/images/gallery/gallery-2.png", title: "Academic Collaboration", category: "Networking" },
  ];

  return (
    <main className="min-h-screen pt-32 pb-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-6">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
              Visual Legacy
            </div>
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-foreground leading-[0.9]">
              Moments of <span className="text-primary italic">Impact</span>
            </h1>
            <p className="text-xl text-foreground/60 leading-relaxed font-medium">
              Explore the highlights from our past conferences, workshops, and academic gatherings.
            </p>
        </div>

        {/* Gallery Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
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

        {/* Call to Action */}
        <div className="mt-24">
           <GlassContainer variant="dark" className="p-12 md:p-20 text-center space-y-8 bg-foreground relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5 opacity-30" />
              <div className="relative z-10 space-y-6">
                 <h2 className="text-4xl md:text-5xl font-serif font-bold text-white italic">&quot;Capturing the essence of scholarly pursuit.&quot;</h2>
                 <p className="text-xl text-white/50 max-w-2xl mx-auto">
                    Every image tells a story of collaboration, discovery, and the relentless search for knowledge.
                 </p>
                 <button className="glass-button py-4 px-10 text-[10px] uppercase tracking-widest font-black mx-auto">
                    View More on Instagram <Camera className="size-4 ml-2" />
                 </button>
              </div>
           </GlassContainer>
        </div>
      </div>
    </main>
  );
}
