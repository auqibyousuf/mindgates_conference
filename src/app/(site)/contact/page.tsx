import React from 'react'
import { Mail, Phone, MapPin, Send, Clock, Globe } from 'lucide-react'
import { GlassContainer } from '@/components/GlassContainer'

import { SubPageHero } from '@/components/SubPageHero';
import siteConfig from '@/data/siteConfig.json';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
  return (
    <main className='min-h-screen bg-background overflow-hidden'>
      <SubPageHero 
        titleLine1="Let's Start a"
        titleItalic="Dialogue"
        description="Have questions about an upcoming conference or publication? Our team is here to guide you through every step of your scholarly journey."
        badge="Connect With Us"
        icon={Mail}
        image={siteConfig.hero.image}
      />

      <div className='section-container py-4 sm:py-8 md:py-12 lg:py-16'>

        <div className='grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-16 items-start'>
          {/* Contact Form */}
          <GlassContainer
            variant='light'
            className='p-5 sm:p-10 md:p-12 border-none shadow-[0_48px_80px_-16px_rgba(0,0,0,0.08)]'
          >
            <form className='space-y-8'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <div className='space-y-3'>
                  <label className='text-[10px] uppercase font-black tracking-widest text-foreground/40 ml-1'>
                    Full Name
                  </label>
                  <input
                    type='text'
                    className='w-full bg-white/50 border border-foreground/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all font-medium text-foreground placeholder:text-foreground/20'
                    placeholder='Dr. John Doe'
                  />
                </div>
                <div className='space-y-3'>
                  <label className='text-[10px] uppercase font-black tracking-widest text-foreground/40 ml-1'>
                    Email Address
                  </label>
                  <input
                    type='email'
                    className='w-full bg-white/50 border border-foreground/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all font-medium text-foreground placeholder:text-foreground/20'
                    placeholder='john@university.edu'
                  />
                </div>
              </div>
              <div className='space-y-3'>
                <label className='text-[10px] uppercase font-black tracking-widest text-foreground/40 ml-1'>
                  Subject
                </label>
                <select className='w-full bg-white/50 border border-foreground/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all font-medium text-foreground appearance-none'>
                  <option>Conference Inquiry</option>
                  <option>Book Publishing</option>
                  <option>Awards Nomination</option>
                  <option>General Feedback</option>
                </select>
              </div>
              <div className='space-y-3'>
                <label className='text-[10px] uppercase font-black tracking-widest text-foreground/40 ml-1'>
                  Message
                </label>
                <textarea
                  rows={6}
                  className='w-full bg-white/50 border border-foreground/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all font-medium text-foreground placeholder:text-foreground/20 resize-none'
                  placeholder='How can we help you?'
                />
              </div>
              <Button type='submit' variant='glass-button' className='w-full justify-center py-5 shadow-2xl shadow-primary/20 group'>
                Send Message{' '}
                <Send className='size-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform' />
              </Button>
            </form>
          </GlassContainer>

          {/* Contact Details */}
          <div className='space-y-8 sm:space-y-12'>
            <div className='space-y-4 sm:space-y-6'>
              <h3 className='text-xl sm:text-2xl font-serif font-bold text-foreground'>
                Contact Information
              </h3>
              <div className='space-y-6'>
                <div className='flex items-start gap-6 p-6 rounded-3xl bg-primary/5 border border-primary/10'>
                  <div className='size-12 rounded-2xl bg-primary flex items-center justify-center shrink-0'>
                    <MapPin className='size-6 text-white' />
                  </div>
                  <div className='space-y-1'>
                    <p className='text-[10px] uppercase font-black tracking-widest text-primary'>
                      Srinagar Office
                    </p>
                    <p className='text-foreground/70 font-medium leading-relaxed'>
                      Mindgates Softtech Solutions, Bulbul Bagh Barzulla
                      Srinagar-190005
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-6 p-6 rounded-3xl bg-primary/5 border border-primary/10'>
                  <div className='size-12 rounded-2xl bg-primary flex items-center justify-center shrink-0'>
                    <MapPin className='size-6 text-white' />
                  </div>
                  <div className='space-y-1'>
                    <p className='text-[10px] uppercase font-black tracking-widest text-primary'>
                      Jammu Office
                    </p>
                    <p className='text-foreground/70 font-medium leading-relaxed'>
                      Anand Nagar Bohri Jammu
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-6 p-6 rounded-3xl bg-white shadow-xl shadow-foreground/5 border border-foreground/5'>
                  <div className='size-12 rounded-2xl bg-foreground flex items-center justify-center shrink-0'>
                    <Phone className='size-6 text-white' />
                  </div>
                  <div className='space-y-1'>
                    <p className='text-[10px] uppercase font-black tracking-widest text-foreground/40'>
                      Phone Numbers
                    </p>
                    <p className='text-foreground/70 font-bold'>
                      7006472072, 6005221157
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-6 p-6 rounded-3xl bg-white shadow-xl shadow-foreground/5 border border-foreground/5'>
                  <div className='size-12 rounded-2xl bg-foreground flex items-center justify-center shrink-0'>
                    <Mail className='size-6 text-white' />
                  </div>
                  <div className='space-y-1'>
                    <p className='text-[10px] uppercase font-black tracking-widest text-foreground/40'>
                      Email Address
                    </p>
                    <p className='text-foreground/70 font-bold'>
                      info@mindgatesresearch.in
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='space-y-6 pt-8 lg:pt-12 border-t border-foreground/5'>
              <div className='flex items-center gap-4 text-foreground/60 font-medium'>
                <Clock className='size-5 text-primary' />
                <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
              </div>
              <div className='flex items-center gap-4 text-foreground/60 font-medium'>
                <Globe className='size-5 text-primary' />
                <span>Available Globally for Digital Collaboration</span>
              </div>
            </div>

            {/* Map Integration */}
            <div className='aspect-video rounded-[2.5rem] bg-foreground/5 border-4 border-white shadow-2xl relative overflow-hidden group'>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3306.467472018861!2d74.80164837643534!3d34.03195207316531!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e18f97063f114b%3A0xe54e60742f5674c9!2sBarzulla%2C%20Srinagar!5e0!3m2!1sen!2sin!4v1715850000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[0.5] contrast-[1.1] hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
