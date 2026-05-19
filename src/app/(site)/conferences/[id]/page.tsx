import Link from "next/link"
import Image from "next/image"
import {
  Calendar,
  MapPin,
  Globe,
  Download,
  ChevronLeft,
  ChevronRight,
  Share2,
  Printer,
  FileCheck,
  HelpCircle,
} from "lucide-react"
import { readData } from "@/lib/data-handler"
import { Conference } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"

export default async function ConferenceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const conferences =
    ((await readData("conferences.json")) as Conference[]) || []
  const conference = conferences.find((c) => c.id === id)

  if (!conference) {
    return (
      <div className='pt-32 flex flex-col items-center justify-center min-h-[60vh] space-y-6'>
        <HelpCircle className='size-20 text-foreground/10' />
        <h1 className='text-3xl font-serif font-bold'>Conference Not Found</h1>
        <Button href='/conferences' variant='glass-button'>
          Back to All Conferences
        </Button>
      </div>
    )
  }

  return (
    <div className='pt-36 sm:pt-40 md:pt-44 lg:pt-48 pb-12 sm:pb-16 md:pb-20 lg:pb-24 bg-background'>
      <div className='section-container'>
        {/* Breadcrumb */}
        <Link
          href='/conferences'
          className='flex items-center gap-2 text-sm font-bold text-foreground/40 hover:text-primary transition-colors mb-6 sm:mb-8 group'
        >
          <ChevronLeft className='size-4 transition-transform group-hover:-translate-x-1' />
          Back to Conferences
        </Link>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-6 sm:space-y-10'>
            <div className='space-y-3 sm:space-y-4'>
              <div className='flex flex-wrap gap-2 sm:gap-3'>
                <span className='bg-primary/10 text-primary px-3 py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest flex items-center gap-1'>
                  <Globe className='size-3' /> {conference.type}
                </span>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest",
                    conference.status === "Upcoming"
                      ? "bg-primary/10 text-primary"
                      : "bg-foreground/10 text-foreground/60",
                  )}
                >
                  {conference.status}
                </span>
              </div>
              <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground leading-tight'>
                {conference.title}
              </h1>
            </div>

            {/* Banner/Image */}
            <div className='aspect-video relative rounded-3xl overflow-hidden glass-card border-foreground/5 shadow-2xl'>
              <Image
                src='/images/banners/main-hero.png'
                alt={conference.title}
                fill
                className='object-cover'
              />
            </div>

            {/* Details Section */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8'>
              <div className='glass-card p-5 sm:p-8 flex items-start gap-4 sm:gap-6 border-primary/10'>
                <div className='bg-primary/10 p-3 sm:p-4 rounded-2xl text-primary shrink-0'>
                  <Calendar className='size-6 sm:size-8' />
                </div>
                <div className='space-y-1'>
                  <p className='text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-foreground/40'>
                    Event Date
                  </p>
                  <p className='text-base sm:text-lg font-bold'>{conference.date}</p>
                </div>
              </div>
              <div className='glass-card p-5 sm:p-8 flex items-start gap-4 sm:gap-6 border-primary/10'>
                <div className='bg-primary/10 p-3 sm:p-4 rounded-2xl text-primary shrink-0'>
                  <MapPin className='size-6 sm:size-8' />
                </div>
                <div className='space-y-1'>
                  <p className='text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-foreground/40'>
                    Venue
                  </p>
                  <p className='text-base sm:text-lg font-bold'>{conference.venue}</p>
                </div>
              </div>
            </div>

            {/* Description / Schedule placeholder */}
            <div className='prose prose-lg max-w-none space-y-4 sm:space-y-6'>
              <h2 className='text-xl sm:text-2xl font-serif font-bold text-foreground'>
                About the Conference
              </h2>
              <p className='text-sm sm:text-base text-foreground/60 leading-relaxed font-medium'>
                The {conference.title} aims to bring together leading academic
                scientists, researchers and research scholars to exchange and
                share their experiences and research results on all aspects of
                modern innovation. It also provides a premier interdisciplinary
                platform for researchers, practitioners and educators to present
                and discuss the most recent innovations, trends, and concerns as
                well as practical challenges encountered and solutions adopted
                in the fields of scholarly research.
              </p>
              <h3 className='text-lg sm:text-xl font-serif font-bold text-foreground'>
                Key Topics
              </h3>
              <ul className='grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0'>
                {[
                  "Advanced Research Methodologies",
                  "Sustainable Innovation",
                  "Global Knowledge Exchange",
                  "Interdisciplinary Studies",
                ].map((topic, i) => (
                  <li
                    key={i}
                    className='flex items-center gap-3 bg-foreground/5 p-4 rounded-xl text-sm font-bold'
                  >
                    <div className='w-2 h-2 rounded-full bg-primary' />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar / Sidebar Info */}
          <div className='space-y-6 sm:space-y-8'>
            {/* Registration Card */}
            <div className='glass-card p-5 sm:p-8 bg-foreground text-white space-y-4 sm:space-y-6 relative overflow-hidden'>
              <div className='absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl' />
              <div className='space-y-3 sm:space-y-4'>
                <h3 className='text-xl sm:text-2xl font-serif font-bold'>Interested?</h3>
                <p className='text-white/60 text-xs sm:text-sm leading-relaxed'>
                  Join hundreds of researchers and register your interest for
                  this upcoming forum.
                </p>
              </div>
              <div className='space-y-4 pt-4'>
                <Button variant='glass-button' className='w-full justify-center py-4'>
                  Register Now
                  <ChevronRight className='size-5' />
                </Button>
                {conference.brochureUrl && conference.brochureUrl !== "#" && (
                  <Button
                    href={conference.brochureUrl}
                    target='_blank'
                    variant='white-glass'
                    className='w-full py-4 flex items-center justify-center gap-2'
                  >
                    <Download className='size-4' />
                    Download Brochure
                  </Button>
                )}
                {conference.proceedingsUrl &&
                  conference.proceedingsUrl !== "#" &&
                  conference.status === "Past" && (
                    <Button
                      href={conference.proceedingsUrl}
                      target='_blank'
                      variant='primary-glass'
                      className='w-full py-4 flex items-center justify-center gap-2'
                    >
                      <Download className='size-4' />
                      View Proceedings
                    </Button>
                  )}
              </div>
              <div className='pt-6 border-t border-white/10 flex items-center justify-between text-white/40 text-[10px] font-black uppercase tracking-widest'>
                <span>Registration Status</span>
                <span>
                  {conference.status === "Upcoming" ? "Open Now" : "Closed"}
                </span>
              </div>
            </div>
 
            {/* Quick Actions */}
            <div className='glass-card p-5 sm:p-8 space-y-6'>
              <h3 className='text-lg font-serif font-bold'>Quick Actions</h3>
              <div className='space-y-4'>
                <Button variant='action'>
                  <Share2 className='size-5 text-foreground/20 group-hover:text-primary' />
                  Share with Colleagues
                </Button>
                <Button variant='action'>
                  <Printer className='size-5 text-foreground/20 group-hover:text-primary' />
                  Print Details
                </Button>
                <Button variant='action'>
                  <FileCheck className='size-5 text-foreground/20 group-hover:text-primary' />
                  Apply for Grants
                </Button>
              </div>
            </div>

            {/* Timeline */}
            <div className='glass-card p-5 sm:p-8 space-y-6'>
              <h3 className='text-lg font-serif font-bold'>Timeline</h3>
              <div className='space-y-8 relative before:absolute before:left-2.75 before:top-2 before:bottom-2 before:w-px before:bg-foreground/5'>
                {[
                  { date: "Oct 20, 2024", label: "Abstract Submission" },
                  { date: "Oct 30, 2024", label: "Acceptance Notification" },
                  { date: "Nov 05, 2024", label: "Final Paper Deadline" },
                ].map((step, i) => (
                  <div key={i} className='relative pl-8 flex flex-col gap-1'>
                    <div className='absolute left-0 top-1.5 w-5.5 h-5.5 rounded-full bg-background border-2 border-primary z-10 flex items-center justify-center'>
                      <div className='w-2 h-2 rounded-full bg-primary' />
                    </div>
                    <span className='text-[10px] font-black uppercase tracking-widest text-primary'>
                      {step.date}
                    </span>
                    <span className='text-sm font-bold'>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
