'use client'

import { useState } from 'react'
import { ResumeForm } from '@/components/resume-form'
import { FileSearch, Sparkles, Target, Zap } from 'lucide-react'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (file: File, jobDescription: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('jobDescription', jobDescription)

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to analyze resume')
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header Section */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 glow-primary-20">
              <FileSearch className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-semibold text-foreground">ResumeMatch</span>
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm sm:flex">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-medium text-primary">AI-Powered</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50">
        {/* Subtle gradient orbs */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
              See How Well You
              <br />
              <span className="text-primary">Match Any Job</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
              Upload your resume and paste a job description to get instant insights on your fit and how to improve.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
            {[
              { icon: Target, title: 'Match Score', desc: 'See your fit percentage' },
              { icon: Sparkles, title: 'Key Insights', desc: 'Skills & experience gaps' },
              { icon: Zap, title: 'Instant Results', desc: 'Analysis in seconds' },
            ].map((feature) => (
              <div key={feature.title} className="group flex items-center gap-3 rounded-xl bg-card/50 p-4 transition-colors hover:bg-card border border-border/50 hover:border-primary/50 hover-glow-primary-40">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="mx-auto max-w-6xl px-6 py-12 lg:py-16 flex-1 w-full">
        <ResumeForm onAnalyze={handleAnalyze} isLoading={isLoading} />

        {/* Error Message */}
        {error && (
          <div className="mx-auto mt-6 max-w-xl rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-center text-sm text-destructive">
            {error}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/20">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Your resume data is processed securely and never stored.
          </p>
        </div>
      </footer>
    </main>
  )
}