import React from 'react';
import Image from 'next/image';
import { Mail, Linkedin, GraduationCap, UserCheck } from 'lucide-react';
import editors from '@/data/editors.json';
import { GlassContainer } from '@/components/GlassContainer';

export default function EditorsPage() {
  const categories = ["Chief", "Associate", "Advisory", "Council"];

  return (
    <main className="min-h-screen pt-32 pb-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mb-24 space-y-8">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
              Academic Governance
            </div>
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-foreground leading-[0.9]">
              Governing <span className="text-primary italic">Council</span> & Editorial Board
            </h1>
            <p className="text-xl text-foreground/60 leading-relaxed font-medium">
              Our board comprises distinguished scholars and industry leaders who guide the academic direction of Conference Event.
            </p>
        </div>

        {/* Chief Editor Featured */}
        {editors.filter(e => e.category === "Chief").map((chief) => (
          <div key={chief.id} className="mb-32">
            <GlassContainer variant="dark" className="p-12 md:p-20 relative overflow-hidden bg-foreground border-none shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 items-center">
                 <div className="relative">
                    <div className="aspect-3/4 rounded-4xl overflow-hidden border-8 border-white/5 relative z-10">
                      <Image 
                        src={chief.image} 
                        alt={chief.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute -inset-4 bg-primary/20 rounded-[2.5rem] blur-2xl z-0" />
                 </div>
                 <div className="space-y-8 text-white">
                    <div className="space-y-2">
                       <h2 className="text-5xl font-serif font-bold">{chief.name}</h2>
                       <p className="text-primary font-bold italic text-xl">{chief.role}</p>
                    </div>
                    <p className="text-xl text-white/60 leading-relaxed font-light">
                      With over a decade of experience in academic publishing and event management, {chief.name} leads the strategic vision of the organization, ensuring global standards in research dissemination.
                    </p>
                    <div className="flex gap-6 pt-4">
                       <div className="flex items-center gap-3 text-sm text-white/40">
                          <GraduationCap className="size-5 text-primary" />
                          <span>{chief.institution}</span>
                       </div>
                    </div>
                    <div className="flex gap-4 pt-8">
                       <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-primary transition-colors">
                          <Linkedin className="size-5" />
                       </button>
                       <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-primary transition-colors">
                          <Mail className="size-5" />
                       </button>
                    </div>
                 </div>
              </div>
            </GlassContainer>
          </div>
        ))}

        {/* Other Members Grid */}
        <div className="space-y-32">
          {categories.filter(c => c !== "Chief").map((category) => (
            <div key={category} className="space-y-12">
               <div className="flex items-center gap-4">
                  <h3 className="text-3xl font-serif font-bold text-foreground">{category} Board</h3>
                  <div className="h-px grow bg-foreground/10" />
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {editors.filter(e => e.category === category).map((member) => (
                    <GlassContainer key={member.id} variant="light" hover className="p-8 group">
                       <div className="space-y-6">
                          <div className="flex items-start justify-between">
                             <div className="aspect-square w-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg relative grayscale group-hover:grayscale-0 transition-all">
                                <Image 
                                  src={member.image} 
                                  alt={member.name}
                                  fill
                                  className="object-cover"
                                />
                             </div>
                             <div className="bg-primary/10 p-2 rounded-xl border border-primary/20">
                                <UserCheck className="size-5 text-primary" />
                             </div>
                          </div>
                          
                          <div className="space-y-2">
                             <h4 className="text-2xl font-serif font-bold text-foreground group-hover:text-primary transition-colors">{member.name}</h4>
                             <p className="text-primary font-bold text-sm italic">{member.role}</p>
                          </div>

                          <div className="pt-4 border-t border-foreground/5">
                             <p className="text-xs text-foreground/40 font-medium uppercase tracking-widest">{member.institution}</p>
                          </div>
                       </div>
                    </GlassContainer>
                  ))}
               </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
