import React from 'react'
import Image from 'next/image'
import { Target, Users, ShieldCheck } from 'lucide-react'
import siteConfig from '@/data/siteConfig.json'
import { GlassContainer } from '@/components/GlassContainer'

import { SubPageHero } from '@/components/SubPageHero';

export default function AboutPage() {
  return (
    <main className='min-h-screen bg-background overflow-hidden'>
      <SubPageHero 
        titleLine1="Our"
        titleItalic="Organization"
        description="Mindgates Research conference forum is a global platform dedicated to advancing scholarly discourse through high-impact conferences and academic publishing."
        badge="Academic Excellence"
        icon={Target}
        image={siteConfig.hero.aboutImage}
      />

      {/* Mission & Vision */}
      <section className='px-6 py-24 bg-white relative overflow-hidden'>
        <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12'>
          {[
            {
              icon: Target,
              title: 'Our Mission',
              desc: 'To provide a vibrant forum for researchers worldwide to share their innovations and contribute to the global pool of knowledge.',
            },
            {
              icon: ShieldCheck,
              title: 'Quality First',
              desc: 'We ensure every conference and publication adheres to the highest standards of academic integrity and rigorous peer review.',
            },
            {
              icon: Users,
              title: 'Global Network',
              desc: 'Connecting thousands of scholars across continents to foster collaborative research and cross-disciplinary studies.',
            },
          ].map((item, i) => (
            <GlassContainer
              key={i}
              variant='primary'
              hover
              className='p-10 space-y-6 border-none bg-primary/5'
            >
              <div className='size-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20'>
                <item.icon className='size-7 text-white' />
              </div>
              <h3 className='text-2xl font-serif font-bold'>{item.title}</h3>
              <p className='text-lg text-foreground/60 leading-relaxed font-medium'>
                {item.desc}
              </p>
            </GlassContainer>
          ))}
        </div>
      </section>

      {/* Director Message Expanded */}
      <section className='px-6 py-32 bg-background'>
        <div className='max-w-5xl mx-auto'>
          <GlassContainer
            variant='light'
            className='p-12 md:p-20 relative overflow-hidden'
          >
            <div className='absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl' />
            <div className='relative z-10 space-y-12'>
              <div className='text-center space-y-4'>
                <div className='inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em]'>
                  Chief Editor&apos;s Message
                </div>
                <h2 className='text-3xl md:text-5xl font-serif font-bold text-foreground'>
                  A Legacy of{' '}
                  <span className='text-primary italic'>Innovation</span>
                </h2>
              </div>

              <div className='grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 items-start'>
                <div className='space-y-6 text-center lg:text-left'>
                  <div className='aspect-4/5 rounded-3xl overflow-hidden shadow-xl border-4 border-white mb-6'>
                    <Image
                      src='/images/banners/hero-v2.png'
                      alt='Dr Naseer Ganiee'
                      width={400}
                      height={500}
                      className='object-cover'
                    />
                  </div>
                  <div>
                    <p className='font-bold text-2xl font-serif text-primary'>
                      Dr Naseer Ganiee
                    </p>
                    <p className='text-xs uppercase font-black tracking-widest text-foreground/40 mt-1'>
                      Director & Chief Editor
                    </p>
                  </div>
                </div>
                <div className='space-y-8'>
                  <p className='text-xl font-serif italic text-foreground/80 leading-relaxed'>
                    &quot;{siteConfig.directorMessage}&quot;
                  </p>
                  <div className='space-y-6 text-foreground/60 leading-relaxed font-medium'>
                    <p className='text-sm'>
                      Our organization, in collaboration with Mindgates Softtech
                      Solutions, has been at the forefront of academic event
                      management since its inception. We believe that research
                      should not be confined to laboratories but shared with the
                      world to create real impact.
                    </p>
                    <p className='text-sm'>
                      Each year, we expand our reach to new institutions and
                      disciplines, ensuring that every researcher has a platform
                      that is reliable, professional, and accessible.
                    </p>
                  </div>
                  <div className='pt-8'>
                    <Image
                      src='https://upload.wikimedia.org/wikipedia/commons/3/3a/Jon_Kirsch%27s_Signature.png'
                      alt='Signature'
                      width={150}
                      height={50}
                      className='opacity-40 grayscale contrast-125'
                    />
                  </div>
                </div>
              </div>
            </div>
          </GlassContainer>
        </div>
      </section>
    </main>
  )
}
