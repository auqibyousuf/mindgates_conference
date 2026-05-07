import { Award, Trophy, Star, Calendar, MapPin, Search } from "lucide-react";
import awards from "@/data/awards.json";
import { AwardCard } from "@/components/AwardCard";
import { GlassContainer } from "@/components/GlassContainer";

export default function AwardsPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
            Excellence Recognized
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground leading-tight">
            Academic <span className="text-primary italic">Awards</span>
          </h1>
          <p className="text-xl text-foreground/60 leading-relaxed font-medium">
            Honoring the exceptional contributions of researchers and scholars who have demonstrated excellence in their fields during our conferences.
          </p>
        </div>

        {/* Featured Award */}
        <GlassContainer variant="dark" className="mb-20 p-12 md:p-20 relative overflow-hidden text-white border-none shadow-[0_48px_80px_-16px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="bg-primary/20 text-primary border border-primary/30 px-5 py-2 rounded-full w-fit flex items-center gap-3">
                <Trophy className="size-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Hall of Fame</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-serif font-bold leading-tight">"Innovation in Research <br/><span className="text-primary">Excellence</span>"</h2>
              <p className="text-xl text-white/60 leading-relaxed font-light">
                Awarded to individuals who have significantly pushed the boundaries of academic inquiry and collaborative research.
              </p>
            </div>
            <div className="flex flex-col items-center lg:items-end gap-4">
               <div className="size-48 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20 shadow-2xl relative">
                  <Star className="size-24 text-primary animate-pulse" />
                  <div className="absolute inset-0 rounded-full border-2 border-primary/5 animate-ping" />
               </div>
            </div>
          </div>
        </GlassContainer>

        {/* Awards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {awards.map((award) => (
            <AwardCard key={award.id} award={award} />
          ))}
        </div>
      </div>
    </div>
  );
}
