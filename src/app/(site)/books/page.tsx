import { DataTable, Column } from '@/components/DataTable';
import Image from 'next/image';
import { readData } from '@/lib/data-handler';
import { Book } from '@/lib/types';
import { SubPageHero } from '@/components/SubPageHero';
import siteConfig from '@/data/siteConfig.json';
import { BookOpen } from 'lucide-react';

export default async function BooksPage() {
  const books = (await readData('books.json') as Book[]) || [];

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
    <main className="min-h-screen bg-background">
      <SubPageHero 
        titleLine1="Published"
        titleItalic="Books"
        description="Explore our curated collection of scholarly publications, research series, and academic monographs from leading researchers worldwide."
        badge="Academic Gallery"
        icon={BookOpen}
        image={siteConfig.hero.booksImage}
      />

      {/* Table Section */}
      <section className="px-6 relative z-10 py-20">
        <div className="max-w-7xl mx-auto">
          <DataTable 
            columns={columns} 
            data={books} 
            emptyMessage="No publications found in our gallery." 
          />
        </div>
      </section>
    </main>
  );
}
