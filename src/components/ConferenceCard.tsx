import React from 'react';
import Link from 'next/link';
import { Calendar, Users, ChevronRight } from 'lucide-react';

interface ConferenceProps {
  conf: {
    id: string;
    title: string;
    date: string;
    venue: string;
    type: string;
    brochureUrl?: string;
    proceedingsUrl?: string;
    status: string;
  };
}

export const ConferenceCard: React.FC<ConferenceProps> = ({ conf }) => {
  const isPast = new Date(conf.date) < new Date();

  return (
    <div className="glass-card group hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col h-full">
      <div className="p-8 space-y-6 grow">
        <div className="flex justify-between items-start">
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
            {conf.type}
          </div>
          <Calendar className="size-5 text-foreground/20" />
        </div>
        
        <h3 className="text-2xl font-serif font-bold group-hover:text-primary transition-colors leading-tight">
          {conf.title}
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-foreground/60">
            <div className="size-8 rounded-lg bg-primary/5 flex items-center justify-center">
              <Calendar className="size-4 text-primary" />
            </div>
            <span className="font-medium">{conf.date}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-foreground/60">
            <div className="size-8 rounded-lg bg-primary/5 flex items-center justify-center">
              <Users className="size-4 text-primary" />
            </div>
            <span className="font-medium">{conf.venue}</span>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-foreground/5 bg-foreground/5 flex flex-wrap gap-2 justify-between items-center mt-auto">
        <Link href={`/conferences/${conf.id}`} className="text-xs font-bold text-foreground/60 hover:text-primary transition-colors flex items-center gap-1 group/link">
          Details 
          <ChevronRight className="size-3 group-hover/link:translate-x-0.5 transition-transform" />
        </Link>
        
        <div className="flex gap-2" suppressHydrationWarning>
          {!isPast && conf.brochureUrl && (
            <Link 
              href={conf.brochureUrl} 
              target="_blank"
              className="text-[10px] font-black uppercase tracking-widest bg-primary text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
            >
              Brochure
            </Link>
          )}
          
          {isPast && conf.proceedingsUrl && (
            <Link 
              href={conf.proceedingsUrl} 
              target="_blank"
              className="text-[10px] font-black uppercase tracking-widest bg-primary text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
            >
              Proceedings
            </Link>
          )}

          {isPast && !conf.proceedingsUrl && (
            <button 
              disabled
              className="text-[10px] font-black uppercase tracking-widest bg-slate-200 text-slate-400 px-4 py-2 rounded-lg cursor-not-allowed"
            >
              Closed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
