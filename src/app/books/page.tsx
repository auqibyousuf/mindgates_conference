import React from 'react';
import { BookOpen, Search } from 'lucide-react';
import books from '@/data/books.json';
import { BookCard } from '@/components/BookCard';

export default function BooksPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-20">
      {/* Header Section */}
      <section className="relative px-6 mb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
            Academic Gallery
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground leading-tight">
            Published <span className="text-primary italic">Books</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-foreground/60 leading-relaxed font-medium">
            Explore our curated collection of scholarly publications, research series, and academic monographs from leading researchers worldwide.
          </p>

          <div className="max-w-xl mx-auto relative pt-4">
            <div className="flex items-center bg-white/50 backdrop-blur-md border border-foreground/10 rounded-2xl p-2 pl-6 shadow-xl focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Search className="size-5 text-foreground/30 mr-4" />
              <input 
                type="text" 
                placeholder="Search by Title, Author or ISBN..." 
                className="grow bg-transparent border-none outline-none text-foreground font-medium placeholder:text-foreground/30"
              />
              <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary-hover transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[120px]" />
        </div>
      </section>

      {/* Grid Section */}
      <section className="px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {books.length === 0 && (
            <div className="text-center py-40 glass-card">
              <BookOpen className="size-16 text-foreground/10 mx-auto mb-6" />
              <h3 className="text-2xl font-serif font-bold text-foreground/40">No books found matching your criteria.</h3>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="mt-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card bg-foreground p-12 md:p-20 relative overflow-hidden border-none text-white">
            <div className="absolute inset-0 bg-primary/5 opacity-50" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-10">
              <div className="space-y-4">
                <div className="text-5xl font-serif font-bold text-primary">100+</div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Total Publications</div>
              </div>
              <div className="space-y-4">
                <div className="text-5xl font-serif font-bold text-primary">45k+</div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Citations Generated</div>
              </div>
              <div className="space-y-4">
                <div className="text-5xl font-serif font-bold text-primary">12</div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Series Categories</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
