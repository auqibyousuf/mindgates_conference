'use client';

import React, { useState } from 'react';
import { Calendar, Search, Globe, MapPin } from 'lucide-react';
import conferences from '@/data/conferences.json';
import { ConferenceCard } from '@/components/ConferenceCard';

type ConferenceStatus = 'All' | 'Upcoming' | 'Past';

export default function ConferencesPage() {
  const [activeTab, setActiveTab] = useState<ConferenceStatus>('Upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConferences = conferences.filter((conf) => {
    const matchesTab = activeTab === 'All' || conf.status === activeTab;
    const matchesSearch = 
      conf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conf.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-background pt-32 pb-20">
      {/* Header Section */}
      <section className="relative px-6 mb-16">
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                Global Calendar
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground leading-tight">
                Academic <span className="text-primary italic">Conferences</span>
              </h1>
              <p className="max-w-2xl text-xl text-foreground/60 leading-relaxed font-medium">
                Join the conversation at our world-class national and international conferences, fostering innovation across scholarly disciplines.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="glass-card flex items-center p-2 pl-5 bg-white shadow-xl min-w-75">
                <Search className="size-4 text-foreground/30 mr-3" />
                <input 
                  type="text" 
                  placeholder="Filter events..." 
                  className="bg-transparent border-none outline-none text-sm font-bold placeholder:text-foreground/20 grow"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 p-1.5 bg-white/50 backdrop-blur-md border border-foreground/5 rounded-2xl w-fit shadow-lg">
            {(['Upcoming', 'Past', 'All'] as ConferenceStatus[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                  ${activeTab === tab 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-foreground/40 hover:text-foreground hover:bg-foreground/5'}
                `}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Decor */}
        <div className="absolute top-0 right-0 w-125 h-125 bg-primary/5 rounded-full blur-[150px] -z-10" />
      </section>

      {/* Grid Section */}
      <section className="px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {filteredConferences.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredConferences.map((conf) => (
                <ConferenceCard key={conf.id} conf={conf} />
              ))}
            </div>
          ) : (
            <div className="text-center py-40 glass-card bg-white/30 border-white/40">
              <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8 animate-pulse">
                <Calendar className="size-10 text-primary/40" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-foreground/60 mb-2">No conferences found</h3>
              <p className="text-foreground/40 font-medium">Try adjusting your filters or search terms.</p>
              <button 
                onClick={() => { setActiveTab('All'); setSearchQuery(''); }}
                className="mt-8 text-primary font-black uppercase tracking-widest text-[10px] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="mt-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="glass-card p-12 space-y-6 bg-linear-to-br from-primary/10 to-transparent border-primary/20">
              <div className="size-12 rounded-2xl bg-primary flex items-center justify-center">
                <Globe className="size-6 text-white" />
              </div>
              <h3 className="text-3xl font-serif font-bold">Host a Conference</h3>
              <p className="text-lg text-foreground/70 leading-relaxed">
                Interested in partnering with Conference Event to host your next scholarly gathering? We provide full-scale logistical and promotional support.
              </p>
              <button className="glass-button bg-foreground border-none">Get Partnership Info</button>
            </div>
            <div className="glass-card p-12 space-y-6 bg-linear-to-br from-secondary/10 to-transparent border-secondary/20">
              <div className="size-12 rounded-2xl bg-secondary flex items-center justify-center">
                <MapPin className="size-6 text-white" />
              </div>
              <h3 className="text-3xl font-serif font-bold">Venue Support</h3>
              <p className="text-lg text-foreground/70 leading-relaxed">
                From luxury hotels to historic university halls, we help you secure the perfect venue for intellectual discourse and networking.
              </p>
              <button className="glass-button bg-secondary border-none">Browse Venues</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
