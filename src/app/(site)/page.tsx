import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Bell, ArrowRight } from 'lucide-react'
import { ConferenceCard } from '@/components/ConferenceCard'
import { AwardCard } from '@/components/AwardCard'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/ui/StatCard'
import { FadeIn } from '@/components/ui/FadeIn'
import { readData } from '@/lib/data-handler'
import { SiteConfig, Conference, Award } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const siteConfig = (await readData('siteConfig.json')) as SiteConfig
  const conferences =
    ((await readData('conferences.json')) as Conference[]) || []
  const awards = ((await readData('awards.json')) as Award[]) || []
  const notificationsData =
    ((await readData('notifications.json')) as { text: string }[]) || []
  const statsData = ((await readData('stats.json')) as {
    heroStats: Record<string, string>[]
    globalStats: Record<string, string>[]
  }) || { heroStats: [], globalStats: [] }
  const notifications = notificationsData.map((n) => n.text)

  if (!siteConfig) return null

  const upcomingConferences = conferences.filter((c) => c.status === 'Upcoming')

  return (
    <div className='flex flex-col w-full'>
      {/* Hero Section */}
      <section className='relative h-[90vh] min-h-187.5 flex items-center pt-20 overflow-hidden'>
        <div className='absolute inset-0 z-0'>
          <Image
            src={siteConfig.hero.image}
            alt={siteConfig.name}
            fill
            className='object-cover brightness-[0.5] scale-105 animate-slow-zoom'
            priority
          />
          <div className='absolute inset-0 bg-linear-to-r from-background via-background/40 to-transparent' />
          <div className='absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-60' />
        </div>

        <div className='relative z-10 section-container w-full'>
          <div className='max-w-3xl space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000'>
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-md'>
              <span className='w-2 h-2 rounded-full bg-primary animate-pulse' />
              <span className='text-[11px] font-black uppercase tracking-[0.2em] text-primary'>
                {siteConfig.hero.badge}
              </span>
            </div>

            <h1 className='text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-[1.05]'>
              {siteConfig.hero.titleLine1}{' '}
              <span className='text-primary italic relative'>
                {siteConfig.hero.titleItalic}
                <svg
                  className='absolute -bottom-2 left-0 w-full h-3 text-primary/40'
                  viewBox='0 0 200 20'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M5 15C50 5 150 5 195 15'
                    stroke='currentColor'
                    strokeWidth='8'
                    strokeLinecap='round'
                  />
                </svg>
              </span>{' '}
              {siteConfig.hero.titleLine2}
            </h1>

            <p className='text-xl text-white/80 leading-relaxed max-w-2xl font-medium'>
              <span className='text-primary font-black block mb-2'>
                {siteConfig.tagline}
              </span>
              {siteConfig.hero.description}
            </p>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 max-w-lg'>
              <Button
                href={siteConfig.hero.primaryButton.link}
                variant='primary'
                size='lg'
                className='group'
              >
                {siteConfig.hero.primaryButton.label}
                <ArrowRight className='size-5 ml-2 group-hover:translate-x-1 transition-transform' />
              </Button>
              <Button
                href={siteConfig.hero.secondaryButton.link}
                variant='secondary'
                size='lg'
              >
                {siteConfig.hero.secondaryButton.label}
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Stats */}
        <div className='absolute bottom-16 right-6 lg:right-12 z-10 hidden lg:flex gap-6'>
          {statsData.heroStats.map(
            (stat: Record<string, string>, idx: number) => (
              <StatCard
                key={idx}
                variant='light'
                icon={stat.icon}
                value={stat.value}
                label={stat.label}
                className='animate-in fade-in slide-in-from-bottom-8 md:min-w-48'
                style={{ animationDelay: `${idx * 150}ms` }}
              />
            ),
          )}
        </div>
      </section>

      {/* Notification Bar */}
      <section className='bg-primary py-4 relative z-20 shadow-lg overflow-hidden border-y border-white/10'>
        <div className='section-container flex items-center relative'>
          <div className='flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-[0.2em] whitespace-nowrap shrink-0 px-4 py-2 bg-primary rounded-lg border border-white/20 shadow-xl z-30 mr-8'>
            <Bell className='size-4 animate-bounce' />
            Live Updates
          </div>
          <div className='grow overflow-hidden relative h-8 flex items-center'>
            <div className='flex gap-16 animate-marquee absolute left-0 whitespace-nowrap'>
              {[...notifications, ...notifications, ...notifications].map(
                (note, i) => (
                  <span
                    key={i}
                    className='text-white text-xs font-bold whitespace-nowrap flex items-center gap-6 uppercase tracking-widest'
                  >
                    <span className='w-1.5 h-1.5 rounded-full bg-white/40' />
                    {note}
                  </span>
                ),
              )}
            </div>
            {/* Fade effect on the left side to hide incoming text */}
            <div className='absolute left-0 top-0 w-12 h-full bg-linear-to-r from-primary to-transparent z-20' />
          </div>
        </div>
      </section>

      {/* Director Message */}
      <section className='py-32 bg-white relative overflow-hidden'>
        <div className='absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/3' />

        <FadeIn className='max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center'>
          <div className='relative'>
            <div className='aspect-4/5 rounded-4xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] relative z-10 border-8 border-white'>
              <Image
                src='/images/banners/hero-v2.png' // Using hero as placeholder until director photo is provided
                alt='Director'
                fill
                className='object-cover brightness-90 grayscale-[0.2] hover:grayscale-0 transition-all duration-700'
              />
            </div>
            <div className='absolute -bottom-10 -right-10 w-72 glass-card p-8 z-20 border-primary/20 shadow-2xl'>
              <p className='text-sm italic text-foreground/70 mb-4 leading-relaxed'>
                &quot;Research is the seed, and collaboration is the water that
                makes it bloom.&quot;
              </p>
              <div>
                <p className='font-bold text-xl text-primary font-serif'>
                  Dr Naseer Ganiee
                </p>
                <p className='text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em] mt-1'>
                  Chief Editor & Director
                </p>
              </div>
            </div>
            <div className='absolute -top-10 -left-10 w-40 h-40 border-2 border-primary/10 rounded-full z-0 animate-pulse' />
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] border-2 border-primary/5 rounded-full z-0' />
          </div>

          <div className='grow space-y-10'>
            <div className='space-y-6'>
              <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]'>
                Leadership
              </div>
              <h2 className='text-4xl md:text-6xl font-serif font-bold text-foreground leading-tight'>
                Visionary <br />
                <span className='text-primary italic'>Academic</span> Leadership
              </h2>
              <p className='text-2xl font-serif italic text-foreground/70 leading-relaxed font-medium'>
                &quot;{siteConfig.directorMessage}&quot;
              </p>
            </div>
            <Button
              href='/about'
              variant='outline'
              size='lg'
              className='group self-start'
            >
              Read Full Message
              <ChevronRight className='size-4 ml-2 group-hover:translate-x-1 transition-transform' />
            </Button>
          </div>
        </FadeIn>
      </section>

      {/* Stats Counter */}
      <section className='py-24 px-6 bg-slate-50 text-foreground overflow-hidden relative border-t border-slate-200'>
        <div className='absolute inset-0 bg-primary/5' />
        <FadeIn className='max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative z-10 text-center'>
          {statsData.globalStats.map(
            (stat: Record<string, string>, i: number) => (
              <StatCard
                key={i}
                variant='light'
                value={stat.value}
                label={stat.label}
              />
            ),
          )}
        </FadeIn>
      </section>

      {/* Upcoming Conferences */}
      <section className='py-32 bg-background relative overflow-hidden'>
        <div className='absolute top-0 left-0 w-full h-24 bg-linear-to-b from-white to-transparent' />

        <FadeIn className='max-w-7xl mx-auto px-6 relative z-10'>
          <div className='flex flex-col md:flex-row justify-between items-end gap-8 mb-20'>
            <div className='space-y-6'>
              <div className='inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em]'>
                Global Events
              </div>
              <h2 className='text-5xl font-serif font-bold'>
                Upcoming <span className='text-primary'>Conferences</span>
              </h2>
            </div>
            <Button
              href='/conferences'
              variant='outline'
              size='lg'
              className='group'
            >
              View All Events
              <ChevronRight className='size-4 ml-2 group-hover:translate-x-1 transition-transform' />
            </Button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
            {upcomingConferences.slice(0, 3).map((conf) => (
              <ConferenceCard key={conf.id} conf={conf} />
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Awards Section */}
      <section className='py-32 px-6 bg-white overflow-hidden relative'>
        <div className='absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]' />
        <FadeIn className='max-w-7xl mx-auto space-y-20'>
          <div className='text-center space-y-6 max-w-3xl mx-auto'>
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]'>
              Honoring Excellence
            </div>
            <h2 className='text-5xl md:text-7xl font-serif font-bold text-foreground leading-[0.9]'>
              Celebrating{' '}
              <span className='text-primary italic'>Innovation</span> in
              Research
            </h2>
            <p className='text-xl text-foreground/60 leading-relaxed font-medium'>
              Recognizing the outstanding contributions of researchers who push
              the boundaries of their fields.
            </p>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
            {awards.slice(0, 2).map((award) => (
              <AwardCard key={award.id} award={award} />
            ))}
          </div>
          <div className='text-center'>
            <Button
              href='/awards'
              variant='primary'
              size='lg'
              className='group'
            >
              View Hall of Fame
              <ChevronRight className='size-4 ml-2 group-hover:translate-x-1 transition-transform' />
            </Button>
          </div>
        </FadeIn>
      </section>

      {/* Featured Book */}
      <section className='py-32 bg-slate-50 text-foreground relative overflow-hidden border-t border-slate-200'>
        <div className="absolute inset-0 bg-[url('/images/banners/hero-v2.png')] bg-cover bg-fixed opacity-10 grayscale" />
        <div className='absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-primary/20 to-transparent' />

        <FadeIn className='max-w-7xl mx-auto px-6 relative z-10'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center'>
            <div className='space-y-10 order-2 lg:order-1'>
              <div className='space-y-6'>
                <div className='inline-block px-4 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]'>
                  Featured Publication
                </div>
                <h2 className='text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight'>
                  New Release in <br />
                  <span className='text-primary'>Academic Series</span>
                </h2>
              </div>
              <div className='space-y-4 p-8 md:p-10 rounded-3xl bg-white shadow-2xl'>
                <p className='text-3xl md:text-4xl font-serif font-bold text-foreground'>
                  Modern Research Methodologies
                </p>
                <div className='flex flex-wrap gap-4 items-center text-foreground/50 text-sm font-bold uppercase tracking-widest'>
                  <span>By Dr Naseer Ganiee</span>
                  <span className='size-1 rounded-full bg-primary' />
                  <span>ISBN: 978-3-16-148410-0</span>
                </div>
              </div>
              <p className='text-xl text-foreground/70 leading-relaxed font-light'>
                A comprehensive guide to contemporary research practices,
                designed for scholars looking to elevate their methodology and
                impact in the global research landscape.
              </p>
            </div>

            <div className='relative order-1 lg:order-2 flex justify-center'>
              <div className='relative w-80 md:w-112.5 aspect-3/4 group'>
                <Image
                  src='/images/books/book1.png'
                  alt='Featured Book'
                  fill
                  className='object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] transition-all duration-700 group-hover:scale-105 group-hover:-rotate-2'
                />
                <div className='absolute -inset-10 border border-primary/20 rounded-[3rem] -z-10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 opacity-0 group-hover:opacity-100' />
              </div>
              <div className='absolute -top-12 -right-12 w-48 h-48 bg-primary/30 rounded-full blur-[100px] animate-pulse' />
              <div className='absolute -bottom-12 -left-12 w-64 h-64 bg-primary/20 rounded-full blur-[120px] animate-pulse delay-1000' />
            </div>
          </div>
        </FadeIn>
      </section>

      {/* CTA Section */}
      <section className='py-32 bg-white'>
        <FadeIn className='max-w-7xl mx-auto px-6'>
          <div className='glass-card bg-primary p-16 md:p-24 relative overflow-hidden shadow-[0_48px_80px_-16px_rgba(49,46,129,0.4)] border-none'>
            <div className='absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl' />
            <div className='absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl' />

            <div className='relative z-10 text-center max-w-3xl mx-auto space-y-10'>
              <h2 className='text-5xl md:text-6xl font-serif font-bold text-white leading-tight'>
                Ready to Share Your Research?
              </h2>
              <p className='text-white/90 text-xl font-medium leading-relaxed'>
                Join our network of thousands of researchers and take the next
                step in your academic career. We provide the platform, you
                provide the brilliance.
              </p>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 max-w-lg mx-auto'>
                <Link
                  href='/contact'
                  className='bg-white text-primary px-10 py-5 rounded-xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-2xl shadow-black/20 text-center'
                >
                  Contact Us Now
                </Link>
                <Link
                  href='/gallery'
                  className='bg-white/10 border border-white/30 backdrop-blur-md text-white px-10 py-5 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-white/20 transition-all text-center'
                >
                  View Awards
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  )
}
