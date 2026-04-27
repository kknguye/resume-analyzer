'use client'

import { useState } from 'react'
import { ResumeForm } from '@/components/resume-form'
import { FileSearch } from 'lucide-react'

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
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 mb-4">
            <FileSearch className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-balance">Resume Analyzer</h1>
          <p className="text-muted-foreground mt-2 text-balance">
            Upload your resume and paste a job description to see how well you match
          </p>
        </div>

        {/* Form */}
        <ResumeForm onAnalyze={handleAnalyze} isLoading={isLoading} />

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}
      </div>
    </main>
  )
}