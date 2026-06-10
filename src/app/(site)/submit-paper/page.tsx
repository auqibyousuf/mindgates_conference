'use client'

import React, { useState } from 'react'
import { FileUp, Send, Check, Paperclip } from 'lucide-react'
import { GlassContainer } from '@/components/GlassContainer'
import { SubPageHero } from '@/components/SubPageHero'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import conferencesData from '@/data/conferences.json'
import { CustomSelect } from '@/components/ui/CustomSelect'

export default function SubmitPaperPage() {
  const { success, error, info } = useToast()
  
  // Filter conferences to find upcoming/active ones
  const activeConferences = conferencesData.filter(c => c.status === 'Upcoming')

  // Form State
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [affiliation, setAffiliation] = useState('')
  const [paperTitle, setPaperTitle] = useState('')
  const [abstract, setAbstract] = useState('')
  const [conferenceId, setConferenceId] = useState(activeConferences[0]?.id || '')
  
  // File Upload State
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  
  // Submit State
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

  const conferenceOptions = activeConferences.map((c) => ({
    value: c.id,
    label: `${c.title} (${c.date})`,
  }))

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const selectedFile = e.target.files[0]

    // Validate size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      error('File size exceeds the 10MB limit')
      return
    }

    // Validate type
    const allowedExtensions = ['.pdf', '.doc', '.docx']
    const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase()
    if (!allowedExtensions.includes(fileExtension)) {
      error('Invalid file type. Only PDF and Word documents are allowed.')
      return
    }

    setFile(selectedFile)
    setUploading(true)
    setUploadProgress(20)
    info('Uploading paper...')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      setUploadProgress(50)
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      setUploadProgress(80)
      const data = await res.json()

      if (res.ok && data.success) {
        setUploadedUrl(data.url)
        setUploadProgress(100)
        success('Paper file uploaded successfully!')
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to upload paper'
      error(errMsg)
      setFile(null)
      setUploadedUrl('')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName || !email || !paperTitle) {
      error('Please fill in all required fields.')
      return
    }

    if (!uploadedUrl) {
      error('Please upload your paper file.')
      return
    }

    setSubmitting(true)
    info('Submitting your paper registration...')

    const selectedConf = conferencesData.find(c => c.id === conferenceId)

    try {
      const res = await fetch('/api/submit-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          affiliation,
          paperTitle,
          abstract,
          conferenceId,
          conferenceTitle: selectedConf?.title || 'Unknown Conference',
          paperUrl: uploadedUrl,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        success('Paper submitted successfully!')
        setSubmittedEmail(email)
        setSubmitted(true)
        // Reset form
        setFullName('')
        setEmail('')
        setPhone('')
        setAffiliation('')
        setPaperTitle('')
        setAbstract('')
        setFile(null)
        setUploadedUrl('')
      } else {
        throw new Error(data.error || 'Submission failed')
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Failed to submit paper registration'
      error(errMsg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background overflow-hidden pb-16">
      <SubPageHero
        titleLine1="Submit Your"
        titleItalic="Research Paper"
        description="Share your scholarly work with peers worldwide. Complete the details below and upload your manuscript for editorial review."
        badge="Call for Papers"
        icon={FileUp}
        image="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=2000"
      />

      <div className="section-container -mt-16 sm:-mt-24 relative z-10">
        <GlassContainer
          variant="light"
          className="max-w-4xl mx-auto p-6 sm:p-12 border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] rounded-4xl"
        >
          {submitted ? (
            <div className="text-center py-12 space-y-6">
              <div className="size-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-500 animate-bounce">
                <Check className="size-10" />
              </div>
              <h3 className="text-2xl font-serif font-black text-foreground">
                Submission Received!
              </h3>
              <p className="text-foreground/60 max-w-md mx-auto text-sm leading-relaxed">
                Thank you for submitting your paper. A confirmation email has been sent to{' '}
                <strong className="text-primary">{submittedEmail}</strong>. Our editorial team will review your manuscript and get back to you shortly.
              </p>
              <Button
                variant="glass-button"
                onClick={() => setSubmitted(false)}
                className="mt-4"
              >
                Submit Another Paper
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h3 className="text-xl font-serif font-black text-foreground mb-1">
                  Registration Details
                </h3>
                <p className="text-xs text-foreground/40 font-medium">
                  Please provide author and conference selection details.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Author Name */}
                <div className="space-y-2.5">
                  <label className="text-[10px] uppercase font-black tracking-widest text-foreground/50 ml-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white/50 border border-foreground/20 dark:border-white/20 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium text-foreground placeholder:text-foreground/25"
                    placeholder="Dr. Jane Doe"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-2.5">
                  <label className="text-[10px] uppercase font-black tracking-widest text-foreground/50 ml-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/50 border border-foreground/20 dark:border-white/20 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium text-foreground placeholder:text-foreground/25"
                    placeholder="jane.doe@university.edu"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2.5">
                  <label className="text-[10px] uppercase font-black tracking-widest text-foreground/50 ml-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white/50 border border-foreground/20 dark:border-white/20 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium text-foreground placeholder:text-foreground/25"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                {/* Affiliation / Institution */}
                <div className="space-y-2.5">
                  <label className="text-[10px] uppercase font-black tracking-widest text-foreground/50 ml-1">
                    Affiliation / Institution
                  </label>
                  <input
                    type="text"
                    value={affiliation}
                    onChange={(e) => setAffiliation(e.target.value)}
                    className="w-full bg-white/50 border border-foreground/20 dark:border-white/20 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium text-foreground placeholder:text-foreground/25"
                    placeholder="Department of Science, University of Oxford"
                  />
                </div>
              </div>

              {/* Conference Selection */}
              <div className="space-y-2.5">
                <label className="text-[10px] uppercase font-black tracking-widest text-foreground/50 ml-1">
                  Target Conference <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  options={conferenceOptions}
                  value={conferenceId}
                  onChange={setConferenceId}
                  placeholder="Select target conference"
                />
              </div>

              <div className="border-t border-foreground/5 pt-8">
                <h3 className="text-xl font-serif font-black text-foreground mb-1">
                  Manuscript details
                </h3>
                <p className="text-xs text-foreground/40 font-medium">
                  Enter paper specifications and upload your manuscript file.
                </p>
              </div>

              <div className="space-y-6">
                {/* Paper Title */}
                <div className="space-y-2.5">
                  <label className="text-[10px] uppercase font-black tracking-widest text-foreground/50 ml-1">
                    Paper Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={paperTitle}
                    onChange={(e) => setPaperTitle(e.target.value)}
                    className="w-full bg-white/50 border border-foreground/20 dark:border-white/20 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium text-foreground placeholder:text-foreground/25"
                    placeholder="Enter the complete title of your research paper"
                  />
                </div>

                {/* Abstract */}
                <div className="space-y-2.5">
                  <label className="text-[10px] uppercase font-black tracking-widest text-foreground/50 ml-1">
                    Abstract / Summary
                  </label>
                  <textarea
                    rows={5}
                    value={abstract}
                    onChange={(e) => setAbstract(e.target.value)}
                    className="w-full bg-white/50 border border-foreground/20 dark:border-white/20 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium text-foreground placeholder:text-foreground/25 resize-none"
                    placeholder="Provide a brief summary of your paper (max 500 words)"
                  />
                </div>

                {/* File Upload Button */}
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-black tracking-widest text-foreground/50 ml-1">
                    Upload Paper (PDF, DOC, DOCX - Max 10MB) <span className="text-red-500">*</span>
                  </label>
                  
                  <div className="relative border-2 border-dashed border-foreground/15 dark:border-white/20 hover:border-primary/30 rounded-3xl p-8 transition-all bg-white/10 hover:bg-white/20 flex flex-col items-center justify-center text-center cursor-pointer group">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      disabled={uploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    <div className="size-14 rounded-2xl bg-primary/5 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-all duration-300 text-primary mb-4">
                      <Paperclip className="size-6" />
                    </div>

                    {file ? (
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-foreground">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-foreground/40 font-medium">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                          Click to upload or drag & drop file
                        </p>
                        <p className="text-[10px] text-foreground/30 font-medium">
                          Supported formats: PDF, Word Documents (.doc, .docx)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Upload Progress Bar */}
                  {uploading && (
                    <div className="w-full bg-foreground/5 h-2 rounded-full overflow-hidden mt-3">
                      <div
                        className="bg-primary h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}

                  {uploadedUrl && (
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-500/5 border border-emerald-500/10 p-3.5 rounded-2xl">
                      <Check className="size-4 shrink-0" />
                      <span>Paper file uploaded and linked successfully.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={submitting || uploading}
                  variant="glass-button"
                  className="w-full justify-center py-5 shadow-2xl shadow-primary/20 group text-xs font-black uppercase tracking-widest cursor-pointer"
                >
                  {submitting ? 'Submitting Registration...' : 'Submit Registration'}
                  <Send className="size-3.5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </div>
            </form>
          )}
        </GlassContainer>
      </div>
    </main>
  )
}
