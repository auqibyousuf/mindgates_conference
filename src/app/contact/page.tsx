import React from 'react';
import { Mail, Phone, MapPin, Send, Clock, Globe } from 'lucide-react';
import siteConfig from '@/data/siteConfig.json';
import { GlassContainer } from '@/components/GlassContainer';

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mb-24 space-y-8">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
              Connect With Us
            </div>
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-foreground leading-[0.9]">
              Let&apos;s Start a <span className="text-primary italic">Dialogue</span>
            </h1>
            <p className="text-xl text-foreground/60 leading-relaxed font-medium">
              Have questions about an upcoming conference or publication? Our team is here to guide you through every step of your scholarly journey.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-20 items-start">
           {/* Contact Form */}
           <GlassContainer variant="light" className="p-10 md:p-16 border-none shadow-[0_48px_80px_-16px_rgba(0,0,0,0.08)]">
              <form className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] uppercase font-black tracking-widest text-foreground/40 ml-1">Full Name</label>
                       <input 
                         type="text" 
                         className="w-full bg-white/50 border border-foreground/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all font-medium text-foreground placeholder:text-foreground/20"
                         placeholder="Dr. John Doe"
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] uppercase font-black tracking-widest text-foreground/40 ml-1">Email Address</label>
                       <input 
                         type="email" 
                         className="w-full bg-white/50 border border-foreground/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all font-medium text-foreground placeholder:text-foreground/20"
                         placeholder="john@university.edu"
                       />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black tracking-widest text-foreground/40 ml-1">Subject</label>
                    <select className="w-full bg-white/50 border border-foreground/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all font-medium text-foreground appearance-none">
                       <option>Conference Inquiry</option>
                       <option>Book Publishing</option>
                       <option>Awards Nomination</option>
                       <option>General Feedback</option>
                    </select>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] uppercase font-black tracking-widest text-foreground/40 ml-1">Message</label>
                    <textarea 
                      rows={6}
                      className="w-full bg-white/50 border border-foreground/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all font-medium text-foreground placeholder:text-foreground/20 resize-none"
                      placeholder="How can we help you?"
                    />
                 </div>
                 <button className="glass-button w-full justify-center py-5 shadow-2xl shadow-primary/20 group">
                    Send Message <Send className="size-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                 </button>
              </form>
           </GlassContainer>

           {/* Contact Details */}
           <div className="space-y-12">
              <div className="space-y-8">
                 <h3 className="text-3xl font-serif font-bold text-foreground">Contact Information</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-6 p-6 rounded-3xl bg-primary/5 border border-primary/10">
                       <div className="size-12 rounded-2xl bg-primary flex items-center justify-center shrink-0">
                          <MapPin className="size-6 text-white" />
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] uppercase font-black tracking-widest text-primary">Srinagar Office</p>
                          <p className="text-foreground/70 font-medium leading-relaxed">Mindgates Softtech Solutions, Bulbul Bagh Barzulla Srinagar-190005</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-6 p-6 rounded-3xl bg-primary/5 border border-primary/10">
                       <div className="size-12 rounded-2xl bg-primary flex items-center justify-center shrink-0">
                          <MapPin className="size-6 text-white" />
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] uppercase font-black tracking-widest text-primary">Jammu Office</p>
                          <p className="text-foreground/70 font-medium leading-relaxed">Anand Nagar Bohri Jammu</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-6 p-6 rounded-3xl bg-white shadow-xl shadow-foreground/5 border border-foreground/5">
                       <div className="size-12 rounded-2xl bg-foreground flex items-center justify-center shrink-0">
                          <Phone className="size-6 text-white" />
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] uppercase font-black tracking-widest text-foreground/40">Phone Numbers</p>
                          <p className="text-foreground/70 font-bold">7006472072, 6005221157</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-6 p-6 rounded-3xl bg-white shadow-xl shadow-foreground/5 border border-foreground/5">
                       <div className="size-12 rounded-2xl bg-foreground flex items-center justify-center shrink-0">
                          <Mail className="size-6 text-white" />
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] uppercase font-black tracking-widest text-foreground/40">Email Address</p>
                          <p className="text-foreground/70 font-bold">info@mindgatesresearch.in</p>
                       </div>
                    </div>
                  </div>
              </div>

              <div className="space-y-6 pt-12 border-t border-foreground/5">
                 <div className="flex items-center gap-4 text-foreground/60 font-medium">
                    <Clock className="size-5 text-primary" />
                    <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
                 </div>
                 <div className="flex items-center gap-4 text-foreground/60 font-medium">
                    <Globe className="size-5 text-primary" />
                    <span>Available Globally for Digital Collaboration</span>
                 </div>
              </div>

              {/* Map Placeholder */}
              <div className="aspect-video rounded-[2.5rem] bg-foreground/5 border-4 border-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-primary/10 animate-pulse" />
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <MapPin className="size-12 text-primary/40 group-hover:scale-110 transition-transform duration-500" />
                    <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest">Interactive Map Integration <br/> Coming Soon</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </main>
  );
}
