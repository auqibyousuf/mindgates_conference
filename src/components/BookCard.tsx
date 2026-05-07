import React from 'react';
import Image from 'next/image';
import { BookOpen, User, Hash } from 'lucide-react';

interface BookProps {
  book: {
    id: string;
    author: string;
    title: string;
    isbn: string;
    image: string;
  };
}

export const BookCard: React.FC<BookProps> = ({ book }) => {
  return (
    <div className="glass-card group hover:-translate-y-4 transition-all duration-500 overflow-hidden flex flex-col h-full bg-white/40 border-white/40 shadow-xl hover:shadow-2xl">
      <div className="relative aspect-3/4 overflow-hidden p-6 bg-linear-to-br from-primary/5 to-secondary/5">
        <div className="relative w-full h-full shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:rotate-1">
          <Image
            src={book.image}
            alt={book.title}
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      <div className="p-8 space-y-6 grow flex flex-col">
        <div className="space-y-3 grow">
          <h3 className="text-2xl font-serif font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
            {book.title}
          </h3>
          
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-3 text-sm text-foreground/60 font-medium">
              <User className="size-4 text-primary" />
              <span>{book.author}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-foreground/40 font-black uppercase tracking-widest">
              <Hash className="size-3 text-primary/50" />
              <span>ISBN: {book.isbn}</span>
            </div>
          </div>
        </div>

        <div className="pt-6 mt-auto">
          <button className="w-full glass-button justify-center group/btn">
            View Publication
            <BookOpen className="size-4 group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
