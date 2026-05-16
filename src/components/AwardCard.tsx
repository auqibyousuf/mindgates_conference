import React from 'react';
import { Award, Calendar, MapPin, User } from 'lucide-react';
import { GlassContainer } from './GlassContainer';

interface AwardProps {
  award: {
    id: string;
    authorName: string;
    title: string;
    eventName: string;
    eventDate: string;
    eventVenue?: string;
    awardName: string;
  };
}

export const AwardCard: React.FC<AwardProps> = ({ award }) => {
  return (
    <GlassContainer variant="light" hover className="p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <Award className="size-7 text-primary" />
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
          Recognition
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-serif font-bold text-foreground leading-tight">
          {award.awardName}
        </h3>
        <p className="text-primary font-bold italic text-sm">{award.title}</p>
      </div>

      <div className="pt-4 border-t border-foreground/5 space-y-4">
        <div className="flex items-center gap-3 text-sm text-foreground/60">
          <User className="size-4 text-primary/60" />
          <span className="font-bold">{award.authorName}</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-xs text-foreground/40 font-medium uppercase tracking-widest">
            <Calendar className="size-3" />
            <span>{award.eventName} • {award.eventDate}</span>
          </div>
          {award.eventVenue && (
            <div className="flex items-center gap-3 text-xs text-foreground/40 font-medium uppercase tracking-widest">
              <MapPin className="size-3" />
              <span>{award.eventVenue}</span>
            </div>
          )}
        </div>
      </div>
    </GlassContainer>
  );
};
