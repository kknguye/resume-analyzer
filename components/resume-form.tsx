'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { FileText, Upload, X } from 'lucide-react'

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
  
  const handleSubmit = async () => {
    if (!resumeFile || !jobDescription.trim()) return
    await onAnalyze(resumeFile, jobDescription)
  }

  const removeFile = () => {
    setResumeFile(null)
  }

  return (
    <div className="space-y-6">
      {/* Resume Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Resume (PDF)</label>
        {!resumeFile ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume PDF, or click to select'}
            </p>
          </div>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{resumeFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(resumeFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={removeFile}>
                <X className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Job Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Job Description</label>
        <Textarea
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={8}
          className="resize-none"
        />
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!resumeFile || !jobDescription.trim() || isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <Spinner className="mr-2" />
            Analyzing Resume...
          </>
        ) : (
          'Analyze Resume'
        )}
      </Button>
    </div>
  )
}
