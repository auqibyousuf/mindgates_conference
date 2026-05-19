"use client"

import React, { useState } from "react"
import { Calendar, Search, MapPin, FileText, Download } from "lucide-react"
import { DataTable, Column } from "@/components/DataTable"
import { Conference } from "@/lib/types"
import { SubPageHero } from "@/components/SubPageHero"
import siteConfig from "@/data/siteConfig.json"

import { Button } from "@/components/ui/Button"

type ConferenceStatus = "All" | "Upcoming" | "Past"

export default function ConferencesClient({
  conferences,
}: {
  conferences: Conference[]
}) {
  const [activeTab, setActiveTab] = useState<ConferenceStatus>("Upcoming")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConferences = conferences.filter((conf) => {
    const matchesTab = activeTab === "All" || conf.status === activeTab
    const matchesSearch =
      conf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conf.venue.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const columns: Column<Conference>[] = [
    {
      header: "Conference Title",
      accessor: (conf) => (
        <div className='flex flex-col gap-1'>
          <span className='text-foreground font-bold text-xs sm:text-sm'>
            {conf.title}
          </span>
          <span className='text-[9px] uppercase tracking-widest text-primary/60 font-black'>
            {conf.type} Conference
          </span>
        </div>
      ),
      className: "min-w-[160px] sm:min-w-[220px] md:min-w-[300px]",
    },
    {
      header: "Date",
      accessor: (conf) => (
        <div className='flex items-center gap-2'>
          <Calendar className='size-4 text-primary/40' />
          <span>{conf.date}</span>
        </div>
      ),
    },
    {
      header: "Venue",
      accessor: (conf) => (
        <div className='flex items-center gap-2'>
          <MapPin className='size-4 text-primary/40' />
          <span>{conf.venue}</span>
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: (conf) => {
        const now = new Date()
        const end = new Date(conf.endDate || conf.date)
        end.setHours(23, 59, 59, 999)
        const isPast = now > end

        const url = isPast ? conf.proceedingsUrl : conf.brochureUrl
        const label = isPast ? "Download Proceedings" : "View Brochure"

        return url && url !== "#" ? (
          <Button
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            variant='primary-glass'
            size='sm'
            className='gap-2 text-xs py-2 px-4'
          >
            {isPast ? (
              <Download className='size-3.5' />
            ) : (
              <FileText className='size-3.5' />
            )}
            {label}
          </Button>
        ) : (
          <span className='text-foreground/20 italic text-xs'>
            {isPast ? "No Proceedings" : "Brochure Pending"}
          </span>
        )
      },
      className: "text-right",
    },
  ]

  return (
    <main className='min-h-screen bg-background'>
      <SubPageHero
        titleLine1='Academic'
        titleItalic='Conferences'
        description='Join the conversation at our world-class national and international conferences, fostering innovation across scholarly disciplines.'
        badge='Global Calendar'
        icon={Calendar}
        image={siteConfig.hero.conferencesImage}
      />

      {/* Filter Section */}
      <section className='relative py-4 sm:py-6'>
        <div className='section-container space-y-6 sm:space-y-8 relative z-10'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-8'>
            {/* Tabs */}
            <div className='flex gap-1.5 p-1 bg-white/50 backdrop-blur-md border border-foreground/5 rounded-2xl w-full sm:w-fit shadow-lg'>
              {(["Upcoming", "Past", "All"] as ConferenceStatus[]).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                    flex-1 sm:flex-initial px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all cursor-pointer text-center
                    ${
                      activeTab === tab
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "text-foreground/40 hover:text-foreground hover:bg-foreground/5"
                    }
                  `}
                  >
                    {tab}
                  </button>
                ),
              )}
            </div>

            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='glass-card flex items-center p-2 pl-5 bg-white shadow-xl min-w-75'>
                <Search className='size-4 text-foreground/30 mr-3' />
                <input
                  type='text'
                  placeholder='Filter events...'
                  className='bg-transparent border-none outline-none text-sm font-bold placeholder:text-foreground/20 grow'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Table Section */}
      <section className='relative z-10 pb-12 sm:pb-16'>
        <div className='section-container'>
          <DataTable
            columns={columns}
            data={filteredConferences}
            emptyMessage={`No ${activeTab.toLowerCase()} conferences found matching your search.`}
          />
        </div>
      </section>
    </main>
  )
}
