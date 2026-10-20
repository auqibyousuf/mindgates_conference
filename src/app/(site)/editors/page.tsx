import React from "react"
import Image from "next/image"
import {
  Mail,
  Linkedin,
  UserCheck,
  Globe,
  Award,
  Users,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { GlassContainer } from "@/components/GlassContainer"
import { readData } from "@/lib/data-handler"
import { Editor, SiteConfig } from "@/lib/types"

import { SubPageHero } from "@/components/SubPageHero"
import siteConfigDefault from "@/data/siteConfig.json"

export const dynamic = 'force-dynamic'

export default async function EditorsPage() {
  const editors = ((await readData("editors.json")) as Editor[]) || []
  const siteConfig = ((await readData("siteConfig.json")) as SiteConfig) || siteConfigDefault

  return (
    <main className='min-h-screen bg-background relative overflow-hidden'>
      <SubPageHero
        titleLine1='Editorial'
        titleItalic='Board'
        description='Meet the distinguished scholars and industry pioneers shaping the future of international research and innovation.'
        badge='Global Academic Leadership'
        icon={Users}
        image={siteConfig.hero.editorsImage || siteConfigDefault.hero.editorsImage}
      />

      <div className='section-container relative z-10 py-4 sm:py-8 md:py-12 lg:py-16'>
        {/* Director Message / Featured Section */}
        {editors
          .filter(
            (e) =>
              e.category === "Governing Council" && e.role.includes("Director"),
          )
          .map((chief) => (
            <div key={chief.id} className='mb-8 sm:mb-16 lg:mb-20'>
              <div className='flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8'>
                <div className='h-px grow bg-foreground/10' />
                <span className='text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] text-primary text-center'>
                  Chief Editor&apos;s Message
                </span>
                <div className='h-px grow bg-foreground/10' />
              </div>

              <div className='grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-8 lg:gap-16 items-start'>
                <div className='space-y-6 max-w-sm mx-auto lg:max-w-none w-full'>
                  <div className='aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative group w-full'>
                    <Image
                      src={chief.image}
                      alt={chief.name}
                      fill
                      className='object-cover group-hover:scale-105 transition-transform duration-700'
                    />
                    <div className='absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6 sm:p-8'>
                      <div className='flex gap-4'>
                        <Linkedin className='size-5 text-white hover:text-primary cursor-pointer transition-colors' />
                        <Mail className='size-5 text-white hover:text-primary cursor-pointer transition-colors' />
                      </div>
                    </div>
                  </div>
                  <div className='text-center lg:text-left'>
                    <h3 className='text-xl sm:text-2xl font-serif font-bold text-foreground'>
                      {chief.name}
                    </h3>
                    <p className='text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-primary mt-1'>
                      {chief.role}
                    </p>
                  </div>
                </div>

                <div className='space-y-6 sm:space-y-8 text-center lg:text-left'>
                  <p className='text-sm sm:text-base md:text-lg lg:text-xl font-serif italic text-foreground/70 leading-relaxed border-t-2 pt-6 lg:border-t-0 lg:pt-0 lg:border-l-4 lg:pl-8 border-primary/20'>
                    &quot;
                    {chief.bio ||
                      "Leading the charge in global academic excellence through collaborative research and peer-reviewed innovation."}
                    &quot;
                  </p>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8'>
                    <div className='p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-left'>
                      <span className='text-[9px] font-black uppercase tracking-widest text-foreground/30'>
                        Academic Affiliation
                      </span>
                      <p className='text-sm font-bold text-foreground/80 leading-snug'>
                        {chief.institution}
                      </p>
                    </div>
                    <div className='p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-left'>
                      <span className='text-[9px] font-black uppercase tracking-widest text-foreground/30'>
                        Official Email
                      </span>
                      <p className='text-sm font-bold text-primary break-all'>
                        {chief.email}
                      </p>
                    </div>
                  </div>

                  <p className='text-sm text-foreground/50 leading-relaxed font-medium'>
                    Dr. Naseer and the Governing Council are dedicated to
                    maintaining the highest standards of peer review and
                    academic integrity. Our mission is to bridge the gap between
                    regional research and global visibility.
                  </p>
                </div>
              </div>
            </div>
          ))}

        {/* Governing Council Grid */}
        <div className='space-y-16'>
          <div className='flex flex-col gap-4 text-center'>
            <div className='flex items-center gap-4 justify-center'>
              <div className='h-px w-12 bg-primary/20' />
              <span className='text-[10px] font-black uppercase tracking-[0.5em] text-primary'>
                BOARD MEMBERS
              </span>
              <div className='h-px w-12 bg-primary/20' />
            </div>
            <h3 className='text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground'>
              Governing Council
            </h3>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
            {editors
              .filter((e) => !e.role.includes("Director"))
              .map((member) => (
                <GlassContainer
                  key={member.id}
                  variant='light'
                  hover
                  className='p-6 group flex flex-col items-center text-center h-full bg-white border-slate-100 hover:border-primary/20 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-primary/5'
                >
                  <div className='space-y-6 w-full flex flex-col items-center'>
                    <div className='relative'>
                      <div className='size-32 rounded-full overflow-hidden border-4 border-white shadow-2xl relative grayscale group-hover:grayscale-0 transition-all duration-500 ring-4 ring-slate-50 group-hover:ring-primary/10'>
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className='object-cover group-hover:scale-110 transition-transform duration-500'
                        />
                      </div>
                      <div className='absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-lg border-2 border-white translate-x-1 translate-y-1 group-hover:scale-110 transition-transform'>
                        <UserCheck className='size-3.5' />
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <h4 className='text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors leading-tight'>
                        {member.name}
                      </h4>
                      <p className='text-primary font-bold text-[9px] uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full inline-block'>
                        {member.role}
                      </p>
                    </div>

                    <div className='space-y-3 pt-4 border-t border-slate-50 w-full'>
                      <div className='flex flex-col items-center gap-2'>
                        <div className='flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[9px] font-black uppercase tracking-widest text-foreground/40'>
                          <Globe className='size-3' />
                          {member.country}
                        </div>
                        <span className='text-[11px] text-foreground/50 font-medium leading-tight max-w-45 line-clamp-2'>
                          {member.institution}
                        </span>
                      </div>
                      <div className='text-[10px] text-foreground/40 hover:text-primary transition-colors font-bold flex items-center justify-center gap-2 pt-2'>
                        <Mail className='size-3 text-primary/30' />
                        <span>{member.email}</span>
                      </div>
                    </div>
                  </div>
                </GlassContainer>
              ))}
          </div>
        </div>

        {/* Joining CTA */}
        <div className='mt-8 sm:mt-16 lg:mt-24'>
          <GlassContainer
            variant='light'
            className='p-5 sm:p-12 md:p-16 bg-primary border-none overflow-hidden relative group'
          >
            <div className='absolute top-0 right-0 w-150 h-150 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700' />

            <div className='relative z-10 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-16 items-center'>
              <div className='space-y-4 sm:space-y-6 text-center lg:text-left'>
                <h2 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight'>
                  Shape the Future of <br />
                  <span className='italic opacity-80 text-primary-200'>
                    Global Research
                  </span>
                </h2>
                <p className='text-sm sm:text-base lg:text-lg text-white/80 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed'>
                  We are always looking for distinguished scholars to join our
                  editorial board and reviewers&apos; council. Contribute your
                  expertise to a global forum.
                </p>
                <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
                  <Button href='/contact' variant='light'>
                    Apply for Membership
                  </Button>
                  <Button href='/about' variant='glass'>
                    <BookOpen className='size-5 mr-2' />
                    View Guidelines
                  </Button>
                </div>
              </div>
              <div className='hidden lg:flex justify-center'>
                <div className='relative'>
                  <div className='size-64 rounded-full border-8 border-white/10 flex items-center justify-center animate-spin-slow'>
                    <Users className='size-24 text-white opacity-20' />
                  </div>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='size-40 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 flex items-center justify-center'>
                      <Award className='size-16 text-white' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassContainer>
        </div>
      </div>
    </main>
  )
}
