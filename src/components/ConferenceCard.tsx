import React from 'react';
import Link from 'next/link';
import { Calendar, Users, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ConferenceProps {
  conf: {
    id: string;
    title: string;
    date: string;
    startDate?: string;
    endDate?: string;
    venue: string;
    type: string;
    brochureUrl?: string;
    proceedingsUrl?: string;
    status: string;
  };
}

export const ConferenceCard: React.FC<ConferenceProps> = ({ conf }) => {
  const now = new Date();
  const start = new Date(conf.startDate || conf.date);
  const end = new Date(conf.endDate || conf.date);
  
  // Set time to end of day for the end date to be inclusive
  end.setHours(23, 59, 59, 999);

  const isOngoing = now >= start && now <= end;
  const isPast = now > end;

  return (
    <div className="glass-card group hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col h-full">
      <div className="p-6 sm:p-8 space-y-4 sm:space-y-6 grow">
        <div className="flex justify-between items-start">
          <div className="flex gap-2" suppressHydrationWarning>
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
              {conf.type}
            </div>
            {isOngoing && (
              <div className="bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse shadow-lg shadow-green-500/20">
                Live
              </div>
            )}
            {isPast && (
              <div className="bg-slate-100 text-slate-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200">
                Completed
              </div>
            )}
          </div>
          <Calendar className="size-5 text-foreground/20" />
        </div>
        
        <h3 className="text-xl sm:text-2xl font-serif font-bold group-hover:text-primary transition-colors leading-tight">
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
          {isPast ? (
            conf.proceedingsUrl ? (
              <Button 
                href={conf.proceedingsUrl} 
                target="_blank"
                variant="primary"
                size="sm"
                className="text-[10px] uppercase tracking-widest px-4 py-2"
              >
                Proceedings
              </Button>
            ) : (
              <Button 
                disabled
                variant="secondary"
                size="sm"
                className="text-[10px] uppercase tracking-widest px-4 py-2 bg-slate-200 text-slate-400 border-none shadow-none hover:translate-y-0"
              >
                Closed
              </Button>
            )
          ) : (
            conf.brochureUrl && (
              <Button 
                href={conf.brochureUrl} 
                target="_blank"
                variant="primary"
                size="sm"
                className="text-[10px] uppercase tracking-widest px-4 py-2"
              >
                Brochure
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
