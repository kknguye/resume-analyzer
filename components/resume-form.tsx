'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { FileText, Upload, X, CheckCircle2, ArrowRight } from 'lucide-react'

interface ResumeFormProps {
  onAnalyze: (file: File, jobDescription: string) => Promise<void>
  isLoading: boolean
}

export function ResumeForm({ onAnalyze, isLoading }: ResumeFormProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')

  const onDrop = (acceptedFiles: File[]) => {
    setResumeFile(acceptedFiles[0])
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  })

  const isReady = resumeFile && jobDescription.trim()

  const handleSubmit = async () => {
    if (!isReady) return
    await onAnalyze(resumeFile!, jobDescription)
  }

  const removeFile = () => {
    setResumeFile(null)
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Resume Upload Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground glow-primary-40">
              1
            </div>
            <div>
              <h2 className="font-semibold">Upload Resume</h2>
              <p className="text-sm text-muted-foreground">PDF format, max 10MB</p>
            </div>
          </div>

          {!resumeFile ? (
            <div
              {...getRootProps()}
              className={`group min-h-[240px] cursor-pointer rounded-xl border-2 border-dashed p-10 transition-all duration-300 ${
                isDragActive
                  ? 'border-primary bg-primary/10'
                  : 'border-border/60 bg-card/30 hover:border-primary/40 hover:bg-card/50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center text-center">
                <div
                  className={`mb-5 rounded-2xl p-5 transition-all duration-300 ${
                    isDragActive
                      ? 'bg-primary/20'
                      : 'bg-muted/50 group-hover:bg-primary/10'
                  }`}
                >
                  <Upload
                    className={`h-8 w-8 transition-all duration-300 ${
                      isDragActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                    }`}
                  />
                </div>
                <p className="mb-1.5 text-base font-medium text-foreground">
                  {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                </p>
                <p className="text-sm text-muted-foreground">
                  or{' '}
                  <span className="font-medium text-primary underline-offset-4 hover:underline">
                    browse files
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <Card className="overflow-hidden border border-primary/40 bg-primary/5">
              <CardContent className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15">
                    <FileText className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{resumeFile.name}</p>
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {(resumeFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={removeFile}
                  className="h-9 w-9 rounded-xl text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Job Description Section */}
        <div className="space-y-4 flex flex-col">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground glow-primary-40">
              2
            </div>
            <div>
              <h2 className="font-semibold">Job Description</h2>
              <p className="text-sm text-muted-foreground">Paste the full posting</p>
            </div>
          </div>
          <div className="relative flex-1">
            <Textarea
              placeholder="Paste the full job description here including requirements, responsibilities, and qualifications..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="h-full min-h-[240px] resize-none"
            />
            {jobDescription.length > 0 && (
              <p className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                {jobDescription.length.toLocaleString()} chars
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mx-auto max-w-md">
        <Button
          onClick={handleSubmit}
          disabled={!isReady || isLoading}
          className="group w-full rounded-2xl py-7 text-base font-semibold transition-all duration-300 disabled:opacity-40 disabled:shadow-none cursor-pointer hover:bg-primary/80 glow-primary-40 hover-glow-primary-40-lg"
          size="lg"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Spinner className="h-4 w-4" />
              Analyzing your resume...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Analyze Match
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </Button>

        {!isReady && (
          <p className="mt-3 text-center text-sm text-muted-foreground">
            {!resumeFile && !jobDescription.trim()
              ? 'Upload your resume and paste a job description to continue'
              : !resumeFile
                ? 'Upload your resume to continue'
                : 'Paste a job description to continue'}
          </p>
        )}
      </div>
    </div>
  )
}