import { Trophy, Calendar, MapPin, Medal } from "lucide-react"
import { DataTable, Column } from "@/components/DataTable"
import { readData } from "@/lib/data-handler"
import { Award } from "@/lib/types"
import { SubPageHero } from "@/components/SubPageHero"
import siteConfig from "@/data/siteConfig.json"

export default async function AwardsPage() {
  const awards = ((await readData("awards.json")) as Award[]) || []

  const columns: Column<Award>[] = [
    {
      header: "Recipient",
      accessor: (award) => (
        <div className='flex flex-col gap-0.5'>
          <span className='text-foreground font-bold text-[11px] sm:text-xs'>
            {award.authorName}
          </span>
          <span className='text-[9px] uppercase tracking-widest text-primary/60 font-black'>
            Researcher
          </span>
        </div>
      ),
      className: "min-w-[120px] sm:min-w-[160px] md:min-w-[200px]",
    },
    {
      header: "Project/Paper Title",
      accessor: (award) => (
        <span className='text-foreground/80 font-medium italic text-[11px] sm:text-xs md:text-sm'>
          &quot;{award.title}&quot;
        </span>
      ),
      className: "min-w-[150px] sm:min-w-[200px] md:min-w-[250px]",
    },
    {
      header: "Event Name",
      accessor: (award) => (
        <div className='flex items-center gap-2'>
          <div className='size-2 rounded-full bg-primary/20' />
          <span>{award.eventName}</span>
        </div>
      ),
    },
    {
      header: "Event Date & Venue",
      accessor: (award) => (
        <div className='flex flex-col gap-1 text-[12px]'>
          <div className='flex items-center gap-1.5 text-foreground/40'>
            <Calendar className='size-3' />
            <span>{award.eventDate}</span>
          </div>
          <div className='flex items-center gap-1.5 text-foreground/40'>
            <MapPin className='size-3' />
            <span>{award.eventVenue || "Online"}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Award Category",
      accessor: (award) => (
        <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-wider shadow-sm'>
          <Medal className='size-3' />
          {award.awardName}
        </div>
      ),
      className: "text-right",
    },
  ]

  return (
    <div className='min-h-screen bg-background'>
      <SubPageHero
        titleLine1='Academic'
        titleItalic='Awards'
        description='Honoring the exceptional contributions of researchers and scholars who have demonstrated excellence in their fields during our conferences.'
        badge='Excellence Recognized'
        icon={Trophy}
        image={siteConfig.hero.awardsImage}
      />

      <div className='section-container py-4 sm:py-8 md:py-12 lg:py-16'>
        {/* Awards Table */}
        <div className='space-y-6 sm:space-y-8'>
          <div className='flex items-center gap-4'>
            <h3 className='text-2xl font-serif font-bold text-foreground'>
              Award Recipients
            </h3>
            <div className='h-px grow bg-foreground/5' />
          </div>
          <DataTable
            columns={columns}
            data={awards}
            emptyMessage='The hall of fame is currently being updated.'
          />
        </div>
      </div>
    </div>
  )
}
