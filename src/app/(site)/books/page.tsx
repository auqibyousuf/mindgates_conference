import { DataTable, Column } from "@/components/DataTable"
import Image from "next/image"
import { readData } from "@/lib/data-handler"
import { Book, SiteConfig } from "@/lib/types"
import { SubPageHero } from "@/components/SubPageHero"
import siteConfigDefault from "@/data/siteConfig.json"
import { BookOpen } from "lucide-react"
import { Button } from "@/components/ui/Button"

export const dynamic = 'force-dynamic'

export default async function BooksPage() {
  const books = ((await readData("books.json")) as Book[]) || []
  const siteConfig = ((await readData("siteConfig.json")) as SiteConfig) || siteConfigDefault

  const columns: Column<Book>[] = [
    {
      header: "Book Front Page",
      accessor: (book) => (
        <div className='relative size-12 sm:size-16 rounded-lg overflow-hidden border border-foreground/5 shadow-sm group-hover:scale-110 transition-transform'>
          <Image
            src={book.image || "/images/books/book1.png"}
            alt={book.title}
            fill
            className='object-cover'
          />
        </div>
      ),
      className: "w-24 sm:w-32 md:w-40",
    },
    {
      header: "Book Title",
      accessor: (book) => (
        <span className='text-foreground font-bold text-[11px] sm:text-xs md:text-sm'>{book.title}</span>
      ),
      className: "min-w-[150px] sm:min-w-[200px] md:min-w-[250px]",
    },
    {
      header: "Author Name",
      accessor: "author",
    },
    {
      header: "ISBN Number",
      accessor: (book) => (
        <code className='bg-foreground/5 px-2 py-1 rounded text-[11px] font-bold text-foreground/60 tracking-wider'>
          {book.isbn}
        </code>
      ),
    },
    {
      header: "Action",
      accessor: () => (
        <Button
          variant='ghost'
          size='none'
          className='text-primary font-black uppercase tracking-widest text-[10px] hover:underline'
        >
          View Details
        </Button>
      ),
      className: "text-right",
    },
  ]

  return (
    <main className='min-h-screen bg-background'>
      <SubPageHero
        titleLine1='Published'
        titleItalic='Books'
        description='Explore our curated collection of scholarly publications, research series, and academic monographs from leading researchers worldwide.'
        badge='Academic Gallery'
        icon={BookOpen}
        image={siteConfig.hero.booksImage || siteConfigDefault.hero.booksImage}
      />

      {/* Table Section */}
      <section className='relative z-10 py-4 sm:py-8 md:py-12 lg:py-16'>
        <div className='section-container'>
          <DataTable
            columns={columns}
            data={books}
            emptyMessage='No publications found in our gallery.'
          />
        </div>
      </section>
    </main>
  )
}
