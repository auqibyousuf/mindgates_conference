import React from 'react';
import books from '@/data/books.json';
import { DataTable, Column } from '@/components/DataTable';
import Image from 'next/image';

type Book = typeof books[0];

export default function BooksPage() {
  const columns: Column<Book>[] = [
    {
      header: 'Book Front Page',
      accessor: (book) => (
        <div className="relative size-16 rounded-lg overflow-hidden border border-foreground/5 shadow-sm group-hover:scale-110 transition-transform">
          <Image 
            src={book.image || '/images/books/book1.png'} 
            alt={book.title}
            fill
            className="object-cover"
          />
        </div>
      ),
      className: "w-32"
    },
    {
      header: 'Book Title',
      accessor: (book) => (
        <span className="text-foreground font-bold text-base">{book.title}</span>
      ),
      className: "min-w-[250px]"
    },
    {
      header: 'Author Name',
      accessor: 'author'
    },
    {
      header: 'ISBN Number',
      accessor: (book) => (
        <code className="bg-foreground/5 px-2 py-1 rounded text-[11px] font-bold text-foreground/60 tracking-wider">
          {book.isbn}
        </code>
      )
    },
    {
      header: 'Action',
      accessor: () => (
        <button className="text-primary font-black uppercase tracking-widest text-[10px] hover:underline">
          View Details
        </button>
      ),
      className: "text-right"
    }
  ];

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
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[120px]" />
        </div>
      </section>

      {/* Table Section */}
      <section className="px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <DataTable 
            columns={columns} 
            data={books} 
            emptyMessage="No publications found in our gallery." 
          />
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
