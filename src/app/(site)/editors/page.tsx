import React from 'react';
import Image from 'next/image';
import { Mail, Linkedin, GraduationCap, UserCheck, Phone, Globe, Award, ChevronRight, Users, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/Button";
import { GlassContainer } from '@/components/GlassContainer';
import { readData } from '@/lib/data-handler';
import { Editor } from '@/lib/types';

export default async function EditorsPage() {
  const editors = (await readData('editors.json') as Editor[]) || [];
  
  const categories = ["Chief", "Executive", "Associate", "Advisory", "Council", "Reviewer"];

  return (
    <main className="min-h-screen pt-32 pb-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]" />
      </div>
      
      <div className="section-container relative z-10">
        {/* Header Section */}
        <div className="max-w-4xl mb-32 space-y-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
              <Users className="size-3" />
              Global Academic Leadership
            </div>
            <h1 className="text-7xl md:text-9xl font-serif font-bold text-foreground leading-[0.85]">
              Editorial <span className="text-primary italic">Board</span>
            </h1>
            <p className="text-2xl text-foreground/60 leading-relaxed font-medium max-w-2xl">
              Meet the distinguished scholars and industry pioneers shaping the future of international research and innovation.
            </p>
        </div>

        {/* Featured Chief Editor */}
        <div className="mb-40">
          <div className="flex items-center gap-6 mb-12">
            <div className="h-px grow bg-foreground/10" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Board Leadership</span>
            <div className="h-px grow bg-foreground/10" />
          </div>

          {editors.filter(e => e.category === "Chief").map((chief) => (
            <GlassContainer key={chief.id} variant="dark" className="p-6 md:p-10 relative overflow-hidden bg-[#0A0C10] border-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] group">
              <div className="absolute top-0 right-0 w-125 h-125 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px] opacity-50 group-hover:opacity-80 transition-opacity" />
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 md:gap-16 items-center">
                 <div className="relative">
                    <div className="aspect-4/5 rounded-[2.5rem] overflow-hidden border-8 border-white/5 relative z-10 shadow-2xl">
                      <Image 
                        src={chief.image} 
                        alt={chief.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="absolute -inset-10 bg-primary/30 rounded-full blur-[80px] z-0 opacity-40" />
                    
                    {/* Badge */}
                    <div className="absolute -bottom-6 -right-6 bg-primary text-white p-6 rounded-3xl shadow-2xl z-20 animate-bounce-slow">
                       <Award className="size-8" />
                    </div>
                 </div>

                 <div className="space-y-10 text-white">
                    <div className="space-y-4">
                       <div className="flex items-center gap-3 text-primary">
                         <div className="w-12 h-px bg-primary" />
                         <span className="text-xs font-black uppercase tracking-widest">{chief.role}</span>
                       </div>
                       <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">{chief.name}</h2>
                       <div className="flex items-center gap-2 text-white/40 font-bold text-sm">
                          <Globe className="size-4" />
                          <span>{chief.country}</span>
                          <span className="mx-2">•</span>
                          <span>{chief.institution}</span>
                       </div>
                    </div>

                    <p className="text-2xl text-white/60 leading-relaxed font-light italic border-l-4 border-primary/30 pl-8">
                      &quot;{chief.bio || "Dedicated to excellence in research dissemination and global academic collaboration."}&quot;
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                       <div className="space-y-2">
                         <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Official Correspondence</span>
                         <div className="flex items-center gap-3 text-lg font-medium hover:text-primary transition-colors">
                            <Mail className="size-5 text-primary" />
                            <span>{chief.email}</span>
                         </div>
                       </div>
                       <div className="space-y-2">
                         <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Direct Contact</span>
                         <div className="flex items-center gap-3 text-lg font-medium hover:text-primary transition-colors">
                            <Phone className="size-5 text-primary" />
                            <span>{chief.contact}</span>
                         </div>
                       </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                       <Button 
                        href="#" 
                        variant="glass"
                        className="group/btn"
                       >
                          <Linkedin className="size-5 text-primary mr-2" />
                          View Academic Profile
                          <ChevronRight className="size-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                       </Button>
                    </div>
                 </div>
              </div>
            </GlassContainer>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="space-y-40">
          {categories.filter(c => c !== "Chief").map((category) => (
            <div key={category} className="space-y-16">
               <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">{category} BOARD</span>
                    <div className="h-px grow bg-foreground/5" />
                  </div>
                  <h3 className="text-5xl font-serif font-bold text-foreground">Distinguished {category}s</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {editors.filter(e => e.category === category).map((member) => (
                    <GlassContainer key={member.id} variant="light" hover className="p-5 group flex flex-col h-full bg-white border-slate-100 hover:border-primary/20 transition-all duration-500">
                       <div className="space-y-6 grow">
                          <div className="flex items-start justify-between">
                             <div className="relative">
                                <div className="aspect-square w-20 rounded-2xl overflow-hidden border-4 border-white shadow-xl relative grayscale group-hover:grayscale-0 transition-all duration-500">
                                  <Image 
                                    src={member.image} 
                                    alt={member.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                  />
                               </div>
                               <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-xl shadow-lg border-4 border-white">
                                  <UserCheck className="size-4" />
                               </div>
                             </div>
                             <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[9px] font-black uppercase tracking-widest text-foreground/40">
                                   <Globe className="size-3" />
                                   {member.country}
                                </div>
                             </div>
                          </div>
                          
                          <div className="space-y-3">
                             <h4 className="text-2xl font-serif font-bold text-foreground group-hover:text-primary transition-colors leading-tight">{member.name}</h4>
                             <p className="text-primary font-bold text-[11px] uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-lg inline-block">{member.role}</p>
                          </div>

                          <div className="space-y-4 pt-6 border-t border-slate-50">
                             <div className="flex items-start gap-3">
                                <GraduationCap className="size-4 text-primary mt-1 shrink-0" />
                                <span className="text-[12px] text-foreground/60 font-medium leading-relaxed">{member.institution}</span>
                             </div>
                             <div className="flex items-center gap-3 text-[12px] text-foreground/40 hover:text-primary transition-colors font-bold">
                                <Mail className="size-4 text-primary/40" />
                                <span>{member.email}</span>
                             </div>
                          </div>
                       </div>
                    </GlassContainer>
                  ))}
               </div>
            </div>
          ))}
        </div>

        {/* Joining CTA */}
        <div className="mt-40">
           <GlassContainer variant="light" className="p-12 md:p-20 bg-primary border-none overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-150 h-150 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-16 items-center">
                 <div className="space-y-8">
                    <h2 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight">
                       Shape the Future of <br/>
                       <span className="italic opacity-80">Global Research</span>
                    </h2>
                    <p className="text-xl text-white/80 max-w-xl font-medium leading-relaxed">
                       We are always looking for distinguished scholars to join our editorial board and reviewers&apos; council. Contribute your expertise to a global forum.
                    </p>
                    <div className="flex flex-wrap gap-6">
                       <Button 
                        href="/contact" 
                        variant="light"
                        size="lg"
                       >
                          Apply for Membership
                       </Button>
                       <Button 
                        href="/about" 
                        variant="glass"
                        size="lg"
                       >
                          <BookOpen className="size-5 mr-2" />
                          View Guidelines
                       </Button>
                    </div>
                 </div>
                 <div className="hidden lg:flex justify-center">
                    <div className="relative">
                       <div className="size-64 rounded-full border-8 border-white/10 flex items-center justify-center animate-spin-slow">
                          <Users className="size-24 text-white opacity-20" />
                       </div>
                       <div className="absolute inset-0 flex items-center justify-center">
                          <div className="size-40 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                             <Award className="size-16 text-white" />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </GlassContainer>
        </div>
      </div>
    </main>
  );
}
